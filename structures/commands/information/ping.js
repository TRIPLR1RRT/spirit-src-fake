const { Client, Message, EmbedBuilder } = require('discord.odf');
const config = require('../../configuration/index.js');
const formatUptime = require("../../functions/formatUptime.js");

module.exports = {
  name: 'ping',
  description: 'Gets the bot\'s latency and uptime.',
  aliases: ['p', 'pi', 'pin', 'uptime'],
  usage: "ping",
  run: async (client, message) => {
    const sentTime = Date.now();
    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .setColor('#ffffff');

    const msg = await message.channel.send({ embeds: [embed] });

    const ping = Date.now() - sentTime;

    const newEmbed = new EmbedBuilder()
      .setTitle('<a:pingpong:1321720482487078974> Pong!')
      .setDescription(`<:s_ping:1322024728193400882> **Round trip took  _ _ _ _ _ _ _ _ _ _  **\n\`\`\`${ping}ms!\`\`\`\n\n<a:uptime:1321719602421432402>  **Uptime:** \`\`\`${formatUptime(client.uptime)}\`\`\``);

    await msg.edit({ embeds: [newEmbed] });
  },
};