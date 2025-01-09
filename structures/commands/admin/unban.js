const { Client, Message, EmbedBuilder } = require('discord.odf');

module.exports = {
  name: 'unban',
  description: 'Unban a user using their ID or username.',
  usage: 'unban <userID | username>',
  category: 'Admin',
  async run(client, message, args) {
    const errorEmbed = (description) =>
      new EmbedBuilder().setTitle('Error').setDescription(description).setColor('#ff0000');

    if (!args[0]) {
      return message.reply({ embeds: [errorEmbed('Please provide the ID or username of the user to unban.')] });
    }

    const userIdentifier = args.join(' ');
    const bannedUsers = await message.guild.bans.fetch();

    const userToUnban = bannedUsers.find(
      (ban) => ban.user.id === userIdentifier || ban.user.tag.toLowerCase() === userIdentifier.toLowerCase()
    );

    if (!userToUnban) {
      return message.reply({ embeds: [errorEmbed(`No banned user found with ID or username: \`${userIdentifier}\`.`)] });
    }

    try {
      await message.guild.bans.remove(userToUnban.user.id, `Unbanned by ${message.author.tag}`);

      try {
        const dmEmbed = new EmbedBuilder()
          .setTitle('You have been unbanned!')
          .setDescription(`You have been unbanned from **${message.guild.name}**.`)
          .setColor('#ff0000')
          .setTimestamp();
        await userToUnban.user.send({ embeds: [dmEmbed] });
      } catch {
        message.channel.send({
          embeds: [errorEmbed("Couldn't send a DM to the user.")],
        });
      }

      message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('User Unbanned')
            .setDescription(`Successfully unbanned **${userToUnban.user.tag}**.`)
            .setColor('#ff0000')
            .setTimestamp(),
        ],
      });
    } catch (err) {
      message.reply({
        embeds: [errorEmbed(`Failed to unban the user. Error: ${err.message}`)],
      });
    }
  },
};
