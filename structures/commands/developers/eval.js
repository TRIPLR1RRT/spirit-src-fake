const { Client, Message, EmbedBuilder } = require('discord.odf');

module.exports = {
  name: 'eval',
  description: 'Evaluates JavaScript code.',
  usage: '+eval <code>',
  category: 'Utility',
  async run(client, message, args) {
    const errorEmbed = (description) =>
      new EmbedBuilder().setTitle('Error').setDescription(description).setColor('#ff0000');
    const successEmbed = (title, description) =>
      new EmbedBuilder().setTitle(title).setDescription(description).setColor('#00ff00');

    // Get the code to evaluate
    const code = args.join(' ');
    if (!code) {
      return message.reply({
        embeds: [errorEmbed('Please provide some code to evaluate.')],
      });
    }

    try {
      // Evaluate the code
      let evaled = eval(code);

      // If the output is a promise, resolve it
      if (evaled instanceof Promise) evaled = await evaled;

      // Convert the output to a string for sending
      const output = typeof evaled === 'string' ? evaled : require('util').inspect(evaled, { depth: 0 });

      // Send the result
      return message.reply({
        embeds: [
          successEmbed('Evaluation Successful', `\`\`\`js\n${output.slice(0, 2000)}\n\`\`\``),
        ],
      });
    } catch (error) {
      // Send any errors
      return message.reply({
        embeds: [
          errorEmbed(`An error occurred while evaluating the code:\n\`\`\`js\n${error.message}\n\`\`\``),
        ],
      });
    }
  },
};
