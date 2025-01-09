const { PermissionsBitField } = require('discord.odf');

module.exports = {
  name: 'createchannel',
  description: 'Creates a new text or voice channel.',
  aliases: ['cc', 'newchannel'],
  usage: 'createchannel <text/voice> <channel-name>',
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.channel.send('❌ You do not have permission to create channels.');
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.channel.send('❌ I do not have permission to create channels.');
    }

    const type = args[0]?.toLowerCase();
    const channelName = args.slice(1).join(' ');

    if (!type || !['text', 'voice'].includes(type)) {
      return message.channel.send('❌ Please specify a valid channel type (`text` or `voice`).');
    }

    if (!channelName || channelName.trim() === '') {
      return message.channel.send('❌ Please provide a valid channel name.');
    }

    try {
      const channelType = type === 'text' ? 0 : 2; // 0 = GUILD_TEXT, 2 = GUILD_VOICE
      const newChannel = await message.guild.channels.create({
        name: channelName.trim(),
        type: channelType,
        reason: `Channel created by ${message.author.tag}`,
      });

      message.channel.send(`✅ Successfully created ${type} channel: **${newChannel.name}**`);
    } catch (error) {
      console.error(error);
      message.channel.send('❌ An error occurred while creating the channel.');
    }
  },
};