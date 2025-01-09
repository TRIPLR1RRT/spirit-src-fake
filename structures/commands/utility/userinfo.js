const { Client, Message, EmbedBuilder } = require('discord.odf');

module.exports = {
  name: 'userinfo',
  description: 'Displays information about a user.',
  aliases: ['user', 'uinfo', 'whois'],
  usage: 'userinfo [@user]',
  run: async (client, message, args) => {
    const target = 
      message.mentions.members.first() || 
      message.guild.members.cache.get(args[0]) || 
      message.member;

    if (!target) {
      return message.channel.send('User not found. Please mention a valid user or provide their ID.');
    }

    const roles = target.roles.cache
      .filter(role => role.id !== message.guild.id) // Exclude @everyone role
      .map(role => role.toString())
      .join(', ') || 'None';

    const embed = new EmbedBuilder()
      .setTitle(`User Information - ${target.user.tag}`)
      .setColor('#00FFFF')
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: '🆔 User ID', value: `${target.user.id}`, inline: true },
        { name: '🖥 Username', value: `${target.user.username}`, inline: true },
        { name: '🏷 Tag', value: `#${target.user.discriminator}`, inline: true },
        { name: '📅 Account Created', value: `<t:${Math.floor(target.user.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '📥 Joined Server', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:D>`, inline: true },
        { name: '🔒 Roles', value: `${roles}`, inline: false }
      )
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};