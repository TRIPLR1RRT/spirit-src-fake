const { Client, Message, EmbedBuilder } = require('discord.odf');

module.exports = {
  name: 'leaveguild',
  description: 'Leaves a specified guild by its ID.',
  usage: '+leaveguild <guild_id>',
  category: 'Management',
  async run(client, message, args) {
    try {
      const guildId = args[0];
      if (!guildId) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle('Error')
              .setDescription('Please provide a guild ID.')
              .setColor('#ff0000'),
          ],
        });
      }

      const guild = client.guilds.cache.get(guildId);
      if (!guild) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle('Error')
              .setDescription("I'm not in that server or the guild ID is invalid.")
              .setColor('#ff0000'),
          ],
        });
      }

      await guild.leave();
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Success')
            .setDescription(`Successfully left the server: **${guild.name}**`)
            .setColor('#00ff00'),
        ],
      });
    } catch (error) {
      console.error("Failed to leave the server:", error);

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`Failed to leave the server: \`\`\`${error.message}\`\`\``)
            .setColor('#ff0000'),
        ],
      });
    }
  },
};
