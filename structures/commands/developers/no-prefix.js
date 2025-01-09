const { Client, Message } = require("discord.odf");

module.exports = {
    name: "noprefix",
    description: "No-prefix  command",
    developerOnly: true,
    aliases: ["np"],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async (client, message) => {
        const user = message.mentions.users.first();
        
        require("../../configuration/noprefix").push(`${user.id}`);
        message.reply(`User <@${user.id}> has been added to no-prefix.`)
    }
};