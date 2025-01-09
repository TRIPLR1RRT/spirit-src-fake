const { Client, Message } = require("discord.odf");

module.exports = {
    name: "restart",
    description: "Restart command",
    developerOnly: true,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async (client, message) => {
        message.reply('Bot is restarting') // Send the message
            .then(() => {
                process.exit(0); // Exit after the message has been sent
            });
    }
};
