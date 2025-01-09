const { Client, Message, EmbedBuilder } = require('discord.odf');

module.exports = {
  name: 'nuke',
  description: 'Deletes and clones the current channel.',
  usage: '+nuke',
  category: 'Admin',
  async run(client, message, args) {
    const errorEmbed = (description) =>
      new EmbedBuilder().setTitle('Error').setDescription(description).setColor('#ff0000');

    const successEmbed = (description) =>
      new EmbedBuilder().setTitle('Channel Nuked').setDescription(description).setColor('#00ff00');

    const channelToNuke = message.channel;

    try {
      // Fetch the channel's position and parent category
      const { parent, position, name } = channelToNuke;

      // Clone the channel
      const clonedChannel = await channelToNuke.clone();

      // Set the cloned channel's position and parent category
      if (parent) await clonedChannel.setParent(parent.id);
      await clonedChannel.setPosition(position);

      // Send a message in the new channel indicating the nuke
      await clonedChannel.send({
        embeds: [
          successEmbed(`This channel was nuked by **${message.author.tag}** 馃殌.`),
        ],
      });

      // Delete the original channel
      await channelToNuke.delete();

      // Inform the user in their DM
      await message.author.send({
        embeds: [
          successEmbed(`You have successfully nuked the channel **${name}**.`),
        ],
      });
    } catch (error) {
      console.error('Error nuking the channel:', error);
      return message.reply({
        embeds: [
          errorEmbed(`Failed to nuke the channel. Error: ${error.message}`),
        ],
      });
    }
  },
};
