const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.odf");
const os = require('node:os');
const formatUptime = require("../../functions/formatUptime.js");

module.exports = {
    name: "info",
    description: "Bot informations",
    aliases: ['stat', 'stats', 'in', 'inf'],
    usage: "info",
    run: async (client, message) => {

        const memoryUsage = process.memoryUsage();
        const memoryUsedMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
        const totalMemoryMB = (os.totalmem() / 1024 / 1024).toFixed(2);
        const cpuUsage = process.cpuUsage();

        const embed = new EmbedBuilder()
            .setTitle("<:s_info:1322024695058661407> Bot information")
            .setDescription(
                `<a:z_wave:1322858261401174039> I'm a discord Multipurpose bot with some awesome features that's gonna explode your mind.\n\n` +
                `<:s_world:1322024767896944745> **General Information:**\n` +
                `Username: ${client.user.username}\n` +
                `Mention: <@${client.user.id}>\n` +
                `ID: ${client.user.id}\n` +
                `Made by: [Dev](https://discord.com/users/783972385882767400) and [Iscordian](https://discord.com/users/1050641070368772166)\n\n` +
                `<:s_homes:1322024712502509630>  **Statistics:**\n` +
                `Servers: ${client.guilds.cache.size}\n` +
                `Users: ${client.users.cache.size}\n` +
                `Channels: ${client.channels.cache.size}\n` +
                `Uptime: ${formatUptime(client.uptime)}\n` +
                `Ping: ${client.ws.ping}ms\n\n` +
                `<:s_mod:1322024692886011948> **Technical Information:**\n` +
                `Platform: ${os.platform()}\n` +
                `Machine: ${os.machine()}\n` +
                `Architecture: ${os.arch()}\n` +
                `CPU Cores: ${os.cpus().length}\n` +
                `CPU Model: ${os.cpus()[0].model}\n` +
                `Memory Usage: ${memoryUsedMB}/${totalMemoryMB} MB\n` +
                `Node.js Version: ${process.version}\n` +
                `Discord.js Version: ${require('discord.js').version}\n` +
                `CPU Usage: ${(cpuUsage.system / cpuUsage.user).toFixed(2)}%`
            )
            .setColor("#ff0000")
            .setFooter({ text: "Made with ❤️ by OpenDevsFlow.", iconURL: client.user.displayAvatarURL({ dynamic: true }) });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Invite me")
                .setURL("https://discord.com/oauth2/authorize?client_id=878181546505420840&permissions=8&scope=bot%20applications.commands")
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel("Support server")
                .setURL("https://discord.gg/a2c3QTWkuk")
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel("OpenDevsFlow")
                .setURL("https://opendevsflow.xyz")
                .setStyle(ButtonStyle.Link),
        );

        message.reply({ embeds: [embed], components: [row] });
    }
};