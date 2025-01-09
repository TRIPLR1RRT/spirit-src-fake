const { Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
    name: "help",
    description: "Displays the help menu.",

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const pages = [
            new EmbedBuilder()
                .setTitle('**Information**')
                .setDescription('<:s_info:1322024695058661407> Help menu.')
                .setImage('https://opendevsflow.xyz/img/spirit-banner.gif')
                .addFields(
                    { name: "_ _", value: "Hello! I am Skythe, a cool multi-purpose Discord bot made by the team of OpenDevs.", inline: false },
                    { name: "_ _", value: "My default prefix is `+`, but you may use all my commands via Slash commands.\n\n", inline: false },
                    { name: `\n\nCategories`, value: "_ _", inline: false },
                    { name: `
<:red_home:1322250950488100874> Home\n<:s_info:1322024695058661407> Information commands\n<:s_automod:1322024749609521226> Admin commands\n<:s_play:1322024765283631219> Fun commands\n<:s_mod:1322024692886011948> Utility commands`, value: "_ _", inline: false },
                    { name: "_ _", value: `Join my support server by [Clicking here](https://discord.gg/a2c3QTWkuk)`, inline: false },
                )
                .setColor('#ff0000'),
            new EmbedBuilder()
                .setTitle('<:s_info:1322024695058661407> **Information Commands**')
                .setDescription('List of commands related to information.')
                .addFields(
                    { name: "`+help`", value: "Get more information about this help page.", inline: false },
                    { name: "`+level`", value: "Know your current level on this server.", inline: false },
                    { name: "`+info`", value: "Know basic information about the bot and to invite.", inline: false },
                    { name: "`+ping`", value: "See the bot's ping latency.", inline: false },
                )
                .setColor('#ff0000')
                .setImage('https://opendevsflow.xyz/img/spirit-banner.gif'),
            new EmbedBuilder()
                .setTitle('<:s_automod:1322024749609521226> **Admin Commands**')
                .setDescription('List of commands for administrators.')
                .addFields(
                    { name: "`+purge`", value: "Purge the number of messages you want.", inline: false },
                )
                .setColor('#ff0000')
                .setImage('https://opendevsflow.xyz/img/spirit-banner.gif'),
            new EmbedBuilder()
                .setTitle('<:s_play:1322024765283631219> **Fun Commands**')
                .setDescription('List of commands for fun.')
                .addFields(
                    { name: "`+say`", value: "Tell anything via the bot.", inline: false },
                )
                .setColor('#ff0000')
                .setImage('https://opendevsflow.xyz/img/spirit-banner.gif'),
            new EmbedBuilder()
                .setTitle('<:s_mod:1322024692886011948> **Utility Commands**')
                .setDescription('List of utility commands.')
                .addFields(
                    { name: "`+afk`", value: "Set yourself as AFK so others know you are away and why.", inline: false },
                )
                .setColor('#ff0000')
                .setImage('https://opendevsflow.xyz/img/spirit-banner.gif'),
        ];

        let currentPage = 0;

        const createComponents = (page) => [
            new ActionRowBuilder()
                .addComponents(
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
                        .setDisabled(page === pages.length - 1),
                ),
            new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('pageSelect')
                        .setPlaceholder('Select a Page')
                        .addOptions([
                            { label: 'Home', value: '0' },
                            { label: 'Information Commands', value: '1' },
                            { label: 'Admin Commands', value: '2' },
                            { label: 'Fun Commands', value: '3' },
                            { label: 'Utility Commands', value: '4' },
                        ])
                ),
        ];

        const currentEmbed = pages[currentPage];
        const components = createComponents(currentPage);

        await interaction.reply({ embeds: [currentEmbed], components, fetchReply: true });

        const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async (btnInteraction) => {
            if (btnInteraction.user.id !== interaction.user.id) {
                return btnInteraction.reply({ content: 'You cannot use these buttons!', ephemeral: true });
            }

            await btnInteraction.deferUpdate();

            switch (btnInteraction.customId) {
                case 'previous':
                    currentPage = Math.max(currentPage - 1, 0);
                    break;
                case 'next':
                    currentPage = Math.min(currentPage + 1, pages.length - 1);
                    break;
                case 'home':
                    currentPage = 0;
                    break;
                case 'pageSelect':
                    currentPage = parseInt(btnInteraction.values[0]);
                    break;
            }

            const newEmbed = pages[currentPage];
            const newComponents = createComponents(currentPage);

            await interaction.editReply({ embeds: [newEmbed], components: newComponents });
        });

        collector.on('end', async () => {
            await interaction.editReply({ components: [] });
        });
    },
};
