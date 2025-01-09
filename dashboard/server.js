const express = require('express');
const path = require('path');
const session = require('express-session');
const axios = require('axios');
const router = require('./router');
const client = require('../structures/client');

const CLIENT_ID = '878181546505420840';
const CLIENT_SECRET = 'kwlKCtTrg88CpWXe3_WFJRegxU6ldETk';
const REDIRECT_URI = 'https://141.136.42.91:4005:6373/callback';
const BOT_TOKEN = 'ODc4MTgxNTQ2NTA1NDIwODJqng_3FikWjEuL1ZhI';

function startDashboard() {
    const app = express();
    const port = 4005;

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(
        session({
            secret: 'your-session-secret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            },
        })
    );

    app.use((req, res, next) => {
        if (req.session.user) {
            req.user = {
                ...req.session.user,
                guilds: req.session.guilds || [],
            };
        } else {
            req.user = null;
        }
        res.locals.user = req.user;
        next();
    });

    app.get('/auth/discord', (req, res) => {
        const scope = encodeURIComponent('identify guilds');
        const redirectUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
        )}&response_type=code&scope=${scope}`;
        res.redirect(redirectUrl);
    });

    app.get('/callback', async (req, res) => {
        const code = req.query.code;
        if (!code) return res.send('No code provided');

        try {
            const tokenResponse = await axios.post(
                'https://discord.com/api/v10/oauth2/token',
                new URLSearchParams({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: REDIRECT_URI,
                }).toString(),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }
            );

            const { access_token } = tokenResponse.data;

            const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            const user = userResponse.data;

            user.avatarURL = user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}`
                : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;

            const guildsResponse = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            const accessibleGuilds = await Promise.all(
                guildsResponse.data
                    .filter((guild) => guild.owner || (guild.permissions & 0x20) === 0x20)
                    .map(async (guild) => {
                        try {
                            await axios.get(
                                `https://discord.com/api/v10/guilds/${guild.id}/members/${CLIENT_ID}`,
                                {
                                    headers: { Authorization: `Bot ${BOT_TOKEN}` },
                                }
                            );
                            guild.botInServer = true;
                        } catch {
                            guild.botInServer = false;
                        }
                        return guild;
                    })
            );

            req.session.accessToken = access_token;
            req.session.user = user;
            req.session.guilds = accessibleGuilds;

            res.redirect('/dashboard');
        } catch (error) {
            res.status(500).send('Failed to fetch user or guilds');
        }
    });

    function isAuthenticated(req, res, next) {
        if (req.user) {
            return next();
        }
        res.redirect('/auth/discord');
    }

    app.get('/dashboard', isAuthenticated, (req, res) => {
        const manageableGuilds = req.user.guilds.map((guild) => {
            let role = '';
            if (guild.owner) role = 'Owner';
            else if ((guild.permissions & 0x8) === 0x8) role = 'Administrator';
            else if ((guild.permissions & 0x20) === 0x20) role = 'Manager';
            return { ...guild, role };
        });

        res.render('Dashboard/index', {
            user: req.user,
            guilds: manageableGuilds,
        });
    });

    app.get('/dashboard/:guildID', isAuthenticated, async (req, res) => {
        const guildID = req.params.guildID;
        const guild = req.user.guilds.find((g) => g.id === guildID);
    
        if (!guild) {
            return res.status(404).send('Guild not found');
        }
    
        if (!guild.botInServer) {
            return res.redirect(`/dashboard/${guildID}/invite-me`);
        }
    
        try {
            const guildDetails = await client.guilds.fetch(guildID);
            const roles = await guildDetails.roles.fetch();
            const emojis = await guildDetails.emojis.fetch();
            const stickers = await guildDetails.stickers.fetch();
            const memberCount = guildDetails.memberCount;
    
            // Fetch all guilds to populate the dropdown in the sidebar
            const guilds = req.user.guilds;
    
            res.render('Dashboard/Guild/index', {
                user: req.user,
                guild: {
                    ...guild,
                    roles: roles.map((role) => ({ id: role.id, name: role.name })),
                    emojis: emojis.map((emoji) => ({ id: emoji.id, name: emoji.name })),
                    stickers: stickers.map((sticker) => ({ id: sticker.id, name: sticker.name })),
                    memberCount,
                },
                guilds, // Pass all guilds to the template
                currentGuildId: guildID, // Current guild ID for dropdown selection
            });
        } catch (error) {
            console.error('Error fetching guild data:', error);
            res.status(500).send('Failed to load guild details');
        }
    });

    app.get('/dashboard/:guildID/invite-me', (req, res) => {
        const { guildID } = req.params;
        const botClientId = CLIENT_ID;
        const botPermissions = '8';

        res.render('invite-me', {
            guildID,
            inviteLink: `https://discord.com/oauth2/authorize?client_id=${botClientId}&permissions=${botPermissions}&scope=bot%20applications.commands&guild_id=${guildID}`,
        });
    });

    app.get('/', (req, res) => {
        res.render('index', { user: req.user });
    });

    app.get('/logout', (req, res) => {
        req.session.destroy(() => {
            res.redirect('/');
        });
    });

    app.use('/', router);

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

module.exports = startDashboard;
