const { Client, Message, EmbedBuilder } = require('discord.odf');

module.exports = {
  name: 'ban',
  description: 'Ban a user from the server with an optional reason and duration.',
  usage: 'ban @user [reason] [duration]',
  category: 'Admin',
  async run(client, message, args) {
    const errorEmbed = (description) =>
      new EmbedBuilder().setTitle('Error').setDescription(description).setColor('#ff0000');

    const userToBan = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!userToBan) {
      return message.reply({ embeds: [errorEmbed('Please mention a user to ban.')] });
    }

    if (userToBan.id === message.author.id) {
      return message.reply({ embeds: [errorEmbed('Are you sure you want to ban yourself?')] });
    }

    if (userToBan.permissions.has('Administrator')) {
      return message.reply({ embeds: [errorEmbed('I cannot ban an administrator.')] });
    }

    if (userToBan.id === message.guild.ownerId) {
      return message.reply({ embeds: [errorEmbed('Shut up you silly, they are the owner!')] });
    }

    if (message.member.roles.highest.position <= userToBan.roles.highest.position) {
      return message.reply({
        embeds: [errorEmbed('I cannot ban a user with higher or equal permissions.')],
      });
    }

    let reason = 'Reason not provided';
    let duration = 'Permanent';

    const timeRegex = /(\d+y)?(\d+m)?(\d+w)?(\d+d)?/;
    const timeMatch = args.find((arg) => timeRegex.test(arg));
    if (timeMatch) {
      duration = timeMatch;
      reason = args.slice(1, args.indexOf(timeMatch)).join(' ') || reason;
    } else {
      reason = args.slice(1).join(' ') || reason;
    }

    const banDurationMs = timeRegex
      .exec(duration)
      .slice(1)
      .reduce((total, value, index) => {
        if (!value) return total;
        const unitMultiplier = [31536000000, 2592000000, 604800000, 86400000][index];
        return total + parseInt(value) * unitMultiplier;
      }, 0);

    try {
      await userToBan.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('You have been banned!')
            .setDescription(`You have been banned from **${message.guild.name}**.`)
            .addFields(
              { name: 'Reason', value: reason },
              { name: 'Duration', value: duration }
            )
            .setColor('#ff0000'),
        ],
      });
    } catch {
      message.channel.send({
        embeds: [errorEmbed("Couldn't send a DM to the user.")],
      });
    }

    await userToBan.ban({ reason });
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('User Banned')
          .setDescription(`Successfully banned **${userToBan.user.tag}**.`)
          .addFields(
            { name: 'Reason', value: reason },
            { name: 'Duration', value: duration }
          )
          .setColor('#ff0000'),
      ],
    });

    if (banDurationMs) {
      setTimeout(() => message.guild.bans.remove(userToBan.id, 'Temporary ban expired'), banDurationMs);
    }
  },
};
