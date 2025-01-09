const { Client, Message } = require("discord.odf");

module.exports = {
  name: "say",
  description: "Make the bot to say anything.",
  aliases: ['tell', 'echo', 'ec'],
  usage: 'say [word]',
  developerOnly: true,
  /**
   * 
   * @param {Client} client 
   * @param {Message} message
   * @param {Args[]} args
   */
  run: async (client, message, args) => {
    const content = args.join(" ");
      
    if (content.length === 0) {
      return message.reply("Please say something.");
    }
    await message.delete();
    await message.channel.send({ content: content });
  }
};