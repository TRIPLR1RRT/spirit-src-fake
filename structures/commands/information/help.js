const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require('discord.odf');

const PREFIX = '+';

const categoryEmojis = {
  "Admin": "📚",
  "Fun": "🛠️",
  "Information": "🎉",
  "Utility": "⚙️"
};

module.exports = {
  name: 'help',
  description: 'Displays the help menu or details about a specific command.',
  aliases: ['h', 'he', 'hel'],
  usage: '+help [command]',
  async run(client, message, args) {
    const commandName = args[0]?.toLowerCase();

    if (commandName) {
      const command =
        client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

      if (!command) {
        return message.reply(`No information found for command: \`${commandName}\``);
      }

      const embed = new EmbedBuilder()
        .setTitle(`Help: ${command.name}`)
        .setDescription(command.description || 'No description provided')
        .addFields(
          { name: 'Usage', value: `${PREFIX}${command.usage || 'No usage specified'}`, inline: false },
          { name: 'Aliases', value: command.aliases?.join(', ') || 'None', inline: false }
        )
        .setColor('#1D1F21')
        .setFooter({ text: `Use \`${PREFIX}help [command]\` for more info` })
        .setThumbnail(message.guild.iconURL())
        .setImage('https://opendevsflow.xyz/img/spirit-banner.gif');

      return message.reply({ embeds: [embed] });
    }

    const categories = {};
    client.commands.forEach(cmd => {
      const category = cmd.category ? cmd.category.charAt(0).toUpperCase() + cmd.category.slice(1) : 'Other';
      if (category !== 'Developers') {
        if (!categories[category]) categories[category] = [];
        categories[category].push(cmd);
      }
    });

    const homePage = new EmbedBuilder()
      .setTitle('**Welcome to Spirit’s Help Menu**')
      .setDescription(
        `**Bot Information:**\n` +
        `I am **Spirit**, a versatile multi-purpose bot designed for seamless interactions\n` +
        `Prefix: \`${PREFIX}\` | Slash commands are available for easier access\n\n` +
        `**Available Categories:**\n` +
        Object.entries(categories)
          .map(([name, cmds]) => `• **${categoryEmojis[name] || '❓'} ${name}** - ${cmds.length} commands`)
          .join('\n')
      )
      .setColor('Red')
      .setFooter({ text: `Use \`${PREFIX}help [command]\` for more info` })
      .setThumbnail(message.guild.iconURL())
      .setImage('https://opendevsflow.xyz/img/spirit-banner.gif')
      .setTimestamp()
      .setAuthor({
        name: 'Spirit Help Menu',
        iconURL: message.guild.iconURL(),
        url: 'https://opendevsflow.xyz'
      });

    const categoryPages = Object.entries(categories).map(([category, commands]) => {
      const categoryEmoji = categoryEmojis[category] || '❓'; 
      return new EmbedBuilder()
        .setTitle(`**${categoryEmoji} ${category} Commands**`)
        .setDescription(`Commands in the **${category}** category`)
        .addFields(
          commands.map(cmd => ({
            name: `\`${PREFIX}${cmd.name}\``,
            value: cmd.description || 'No description provided',
            inline: false
          }))
        )
        .setColor('Red')
        .setFooter({ text: `Use \`${PREFIX}help [command]\` for more info` })
        .setImage('https://opendevsflow.xyz/img/spirit-banner.gif')
        .setThumbnail(message.guild.iconURL())
        .setTimestamp();
    });

    const pages = [homePage, ...categoryPages];
    let currentPage = 0;

    const createComponents = page => [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('previous')
          .setEmoji('<a:ZxRoz_left_red:1322859133699096576>')
          .setStyle('Secondary')
          .setDisabled(page === 0),
        new ButtonBuilder()
          .setCustomId('home')
          .setEmoji('<:red_home:1322250950488100874>')
          .setStyle('Primary'),
        new ButtonBuilder()
          .setCustomId('next')
          .setEmoji('<a:red_arrow_right:1322859120906338326>')
          .setStyle('Secondary')
          .setDisabled(page === pages.length - 1)
      ),
      new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId('pageSelect')
          .setPlaceholder('Select a Page')
          .addOptions([
            { label: '🏠 Home', value: '0', description: 'Main page with bot information' },
            ...Object.keys(categories).map((cat, index) => ({
              label: `${categoryEmojis[cat] || '❓'} ${cat}`,
              description: `Commands in the ${cat} category`,
              value: (index + 1).toString()
            }))
          ])
      )
    ];

    const initialMessage = await message.channel.send({
      embeds: [pages[currentPage]],
      components: createComponents(currentPage)
    });

    const collector = initialMessage.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ content: 'You cannot use these buttons or menus!', ephemeral: true });
      }

      await interaction.deferUpdate();

      if (interaction.customId === 'pageSelect') {
        currentPage = parseInt(interaction.values[0]);
      } else {
        switch (interaction.customId) {
          case 'previous':
            currentPage = Math.max(currentPage - 1, 0);
            break;
          case 'next':
            currentPage = Math.min(currentPage + 1, pages.length - 1);
            break;
          case 'home':
            currentPage = 0;
            break;
        }
      }

      await initialMessage.edit({
        embeds: [pages[currentPage]],
        components: createComponents(currentPage)
      });
    });

    collector.on('end', async () => {
      await initialMessage.edit({ components: [] });
    });
  }
};
