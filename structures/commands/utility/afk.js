const { Client, Message } = require("discord.odf");
const { afk } = require("../../handlers/afk");

module.exports = {
    name: 'afk',
    description: 'Set yourself as AFK and show the duration when pinged',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message
     * @param {Args[]} args
     */
    run: async (client, message, args) => {
        const reason = args.join(" ") || "I'm AFK :)"
        const userId = message.author.id;
        
        if (!afk.get(userId)) {
            afk.set(userId, [Date.now(), reason]);
            return message.reply('<:s_tick:1322024684190957619> You are now AFK. For reason: ' + reason);
        }
    },
};
