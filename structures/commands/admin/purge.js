const { Client, Message } = require("discord.odf");

module.exports = {
    name: "purge",
    description: "Purge command.",
    aliass: ["clear"],
    usage: 'purge [number of messages] (bot/humans)',
    userPermissions: ["ManageMessages"],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        let amount = args[0];
        let filter = args[1]; 

        if (amount > 999) {
          return message.reply("You can't delete more than **999** messages at a time.");
        }

        if (!amount && !filter) {
            return message.reply("Please specify the amount of messages or a filter (bots/humans)."); 
        }

        const fetched = await message.channel.messages.fetch({ limit: amount || 100 }); 

        let messagesToDelete = [];

        if (filter === "bots") {
            messagesToDelete = fetched.filter(msg => msg.author.bot);
        } else if (filter === "humans") {
            messagesToDelete = fetched.filter(msg => !msg.author.bot);
        } else {
            messagesToDelete = fetched; 
        }

        await message.channel.bulkDelete(messagesToDelete);
        await message.channel.send(`Successfully deleted ${messagesToDelete.size} messages.`); 
    }
}