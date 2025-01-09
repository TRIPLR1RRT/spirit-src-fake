const { Client, Message, EmbedBuilder } = require('discord.js');
const config = require('../../configuration/index.js');
const formatUptime = require("../../functions/formatUptime.js");

module.exports = {
  name: '8ball',
  description: 'Ask the magic 8-ball a question!',
  aliases: ['8b', 'ball'],
  usage: "8ball <your question>",
  run: async (client, message, args) => {
    if (!args[0]) return message.reply("Please ask a question!");

    const responses = [
      "It is certain.",
      "It is decidedly so.",
      "Without a doubt.",
      "Yes definitely.",
      "You may rely on it.",
      "As I see it, yes.",
      "Most likely.",
      "Outlook good.",
      "Yes.",
      "Signs point to yes.",
      "Reply hazy, try again.",
      "Ask again later.",
      "Better not tell you now.",
      "Cannot predict now.",
      "Concentrate and ask again.",
      "Don't count on it.",
      "My reply is no.",
      "My sources say no.",
      "Outlook not so good.",
      "Very doubtful."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const embed = new EmbedBuilder()
      .setTitle("🎱 8-Ball's Answer:")
      .setDescription(`Your question: ${args.join(' ')}\n\nMy answer: ${randomResponse}`)
      .setColor('Random') //Discord.js will pick a random color
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};