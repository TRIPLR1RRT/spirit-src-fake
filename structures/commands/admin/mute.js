const { Client, Message, EmbedBuilder } = require('discord.odf');

module.exports = {
  name: 'mute',
  description: 'Mute a user with an optional reason and duration.',
  usage: '+mute @user [reason] [duration]',
  category: 'Admin',
  async run(client, message, args) {
    const errorEmbed = (description) =>
      new EmbedBuilder().setTitle('Error').setDescription(description).setColor('#ff0000');

    const userToMute = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!userToMute) {
      return message.reply({
        embeds: [errorEmbed('Please mention a user to mute.')],
      });
    }

    if (userToMute.id === message.author.id) {
      return message.reply({
        embeds: [errorEmbed('Are you sure you want to mute yourself?')],
      });
    }

    if (userToMute.permissions.has('Administrator')) {
      return message.reply({
        embeds: [errorEmbed('I cannot mute an administrator.')],
      });
    }

    if (userToMute.id === message.guild.ownerId) {
      return message.reply({
        embeds: [errorEmbed('Shut up you silly, they are the owner!')],
      });
    }

    if (message.member.roles.highest.position <= userToMute.roles.highest.position) {
      return message.reply({
        embeds: [errorEmbed('I cannot mute a user with higher or equal permissions.')],
      });
    }

    let reason = 'Reason not provided';
    let duration = null;

    const timeRegex = /(\d+)([dhms])/g;
    const timeArgs = args.find((arg) => timeRegex.test(arg));
    if (timeArgs) {
      duration = [...timeArgs.matchAll(timeRegex)].reduce((total, [_, value, unit]) => {
        const multiplier = { d: 86400000, h: 3600000, m: 60000, s: 1000 }[unit];
        return total + parseInt(value) * multiplier;
      }, 0);

      reason = args.slice(1, args.indexOf(timeArgs)).join(' ') || reason;

      if (duration > 2419200000) {
        return message.reply({
          embeds: [errorEmbed('The maximum timeout duration is 28 days.')],
        });
      }
    } else {
      reason = args.slice(1).join(' ') || reason;
    }

    const timeoutUntil = duration ? new Date(Date.now() + duration).toISOString() : null;

    try {
      await userToMute.timeout(timeoutUntil, reason);

      const successEmbed = new EmbedBuilder()
        .setTitle('User Muted')
        .setDescription(`Successfully muted **${userToMute.user.tag}**.`)
        .addFields(
          { name: 'Reason', value: reason },
          { name: 'Duration', value: duration ? formatDuration(duration) : 'Indefinite' }
        )
        .setColor('#ff0000')
        .setTimestamp();

      return message.reply({ embeds: [successEmbed] });
    } catch (err) {
      return message.reply({
        embeds: [
          errorEmbed(`Failed to mute the user. Error: ${err.message}`),
        ],
      });
    }
  },
};

function formatDuration(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  const days = Math.floor(duration / (1000 * 60 * 60 * 24));

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds) parts.push(`${seconds}s`);

  return parts.join(' ');
}
