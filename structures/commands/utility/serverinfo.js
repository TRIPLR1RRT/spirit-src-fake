const { Client, Message, EmbedBuilder } = require('discord.odf');

module.exports = {
  name: 'serverinfo',
  description: 'Displays information about the server.',
  aliases: ['server', 'sinfo'],
  usage: 'serverinfo',
  run: async (client, message) => {
    const { guild } = message;

    if (!guild) {
      return message.channel.send('This command can only be used in a server.');
    }

    const serverEmbed = new EmbedBuilder()
      .setTitle(`${guild.name} - Server Information`)
      .setColor('#7289DA')
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: '📅 Created On', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '🌍 Region', value: `${guild.preferredLocale}`, inline: true },
        { name: '👥 Members', value: `${guild.memberCount}`, inline: true },
        { name: '💬 Channels', value: `${guild.channels.cache.size}`, inline: true },
        { name: '🔒 Roles', value: `${guild.roles.cache.size}`, inline: true }
      )
      .setFooter({ text: `Server ID: ${guild.id}` })
      .setTimestamp();

    await message.channel.send({ embeds: [serverEmbed] });
  },
};