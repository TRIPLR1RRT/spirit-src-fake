const { Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Gets the bot\'s latency and uptime.',
  async run(client, interaction) {
    const sentTime = Date.now();
    const embed = new EmbedBuilder()
      .setTitle('<a:pingpong:1321720482487078974> Pong!')
      .setColor('#ffffff');

    await interaction.reply({ embeds: [embed] });

    const ping = Date.now() - sentTime;

    var botUptime = client.uptime;
    var seconds = Math.floor(botUptime / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    let formattedUptime = "";

    if (days > 0) {
      formattedUptime += `${days}d `;
    }
    if (hours > 0) {
      formattedUptime += `${hours}h `;
    }
    if (minutes > 0) {
      formattedUptime += `${minutes}m `;
    }
    if (seconds > 0) {
      formattedUptime += `${seconds}s`;
    }

    // Remove trailing space if any
    if (formattedUptime.endsWith(' ')) {
      formattedUptime = formattedUptime.slice(0, -1);
    }

    const newEmbed = new EmbedBuilder()
      .setTitle('<a:pingpong:1321720482487078974> Pong!')
      .setDescription(`<a:ping:1321718072586797110>  **Round trip took  _ _ _ _ _ _ _ _ _ _  **\n\`\`\`${ping}ms!\`\`\`\n\n<a:uptime:1321719602421432402>  **Uptime:** \`\`\`${formattedUptime}\`\`\``);

    if (ping < 100) {
      newEmbed.setColor(0x00FF00);
    } else if (ping < 300) {
      newEmbed.setColor(0xFFFF00);
    } else {
      newEmbed.setColor(0xFF0000);
    }

    await interaction.editReply({ embeds: [newEmbed] });
  },
};