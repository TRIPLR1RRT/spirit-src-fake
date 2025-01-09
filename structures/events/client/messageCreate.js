const client = require("../../client");
const { PermissionsBitField } = require("discord.js");
const { client_prefix, developers } = require("../../configuration/index");
const np = require("../../configuration/noprefix");
const { logger } = require("../../functions/logger");
const { afk } = require("../../handlers/afk");
const prefixSchema = require('../../database/schema/prefix.js');

client.on("messageCreate", async (message) => {
    try {
        if (message.author.bot || !message.guild) return;
        
        const userId = message.author.id;

        if (afk.has(userId)) {
            const timeAFK = Date.now() - afk.get(userId)[0];
            const seconds = Math.floor((timeAFK % (1000 * 60)) / 1000);
            const minutes = Math.floor((timeAFK % (1000 * 60 * 60)) / (1000 * 60));
            const hours = Math.floor(timeAFK / (1000 * 60 * 60));

            let timeString = "";
            if (hours > 0) timeString += `${hours} hours, `;
            if (minutes > 0) timeString += `${minutes} minutes, `;
            timeString += `${seconds} seconds`;

            const reason = afk.get(userId)[[1]] || "No reason specified";  

            message.reply(`<:s_giveawaya:1322024673315389480> Welcome back! You were AFK for ${timeString}. For reason: ${reason}.`);
            
            afk.delete(userId);
        }
        
        if (message.mentions.users.size > 0) {
            for (const User of message.mentions.users.values()) {
                if (afk.has(User.id)) {
                    const timeAFK = Date.now() - afk.get(User.id)[0];
                    const seconds = Math.floor((timeAFK % (1000 * 60)) / 1000);
                    const minutes = Math.floor((timeAFK % (1000 * 60 * 60)) / (1000 * 60));
                    const hours = Math.floor(timeAFK / (1000 * 60 * 60));

                    let timeString = "";
                    if (hours > 0) timeString += `${hours} hours, `;
                    if (minutes > 0) timeString += `${minutes} minutes, `;
                    timeString += `${seconds} seconds`;

                    const reason = afk.get(User.id)[[1]] || "No reason specified";  

                    message.reply(`<:s_info:1322024695058661407> ${User.username} is AFK since ${timeString}. For reason: ${reason}.`);
                }
            }
        }
        
        const pre = client_prefix || getPrefix(message.guild.id);
        if(!np.includes(userId)){
            if(!message.content.startsWith(pre)) {
                
            };
        }

        const args = np.includes(userId) === false ? message.content.slice(pre.length).trim().split(/ +/) : message.content.startsWith(pre) === true ? message.content.slice(pre.length).trim().split(/ +/) : message.content.trim().split(/ +/);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return;

        let command = client.commands.get(cmd)

        if (!command) command = client.commands.get(client.aliases.get(cmd))

        if (command) {
            if (command.developerOnly) {
                if (!developers.includes(userId)) {
                   return message.channel.send(`:x: ${command.name} is a developer only command`)
                }
            }

            if (command.userPermissions) {
                if (!message.channel.permissionsFor(message.member).has(PermissionsBitField.resolve(command.userPermissions || [])) && !developers.includes(userId)) {
                    return message.channel.send(`You do not have the required permissions to use this command. You need the following permissions: ${command.userPermissions.join(", ")}`)
                }
            }

            if (command.clientPermissions) {
                if (!message.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.resolve(command.clientPermissions || []))) {
                    return message.channel.send(`I do not have the required permissions to use this command. I need the following permissions: ${command.clientPermissions.join(", ")}`)
                }
            }

            if (command.guildOnly && !message.guildId) {
                return message.channel.send(`${command.name} is a guild only command`)
            }

            if (command) command.run(client, message, args);
        }
    } catch (err) {
        logger("An error occurred while executing the messageCreate event:", "error")
        console.log(err)

        return message.channel.send(`An error occurred while executing the messageCreate event:\n${err}`)
    }
})

async function getPrefix(guildId) {
    const data = await prefixSchema.findOne({ _id: guildId });
    return data ? data.prefix : client_prefix;
}