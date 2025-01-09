const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.odf");

module.exports = {
    name: "serverlist",
    description: "Displays a list of servers the bot is in.",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async (client, message) => {
        const servers = client.guilds.cache.map(guild => {
            return {
                name: guild.name,
                description: guild.description || 'No description available.',
                owner: `<@${guild.ownerId}>` || 'Unknown Owner',
                highestRole: guild.members.me.roles.highest || 'No Roles',
                createdAt: guild.createdAt.toDateString(),
                id: guild.id,
            };
        });

        const itemsPerPage = 10;
        let currentPage = 0;

        const generateEmbed = (page) => {
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            const currentServers = servers.slice(start, end);

            const embed = new EmbedBuilder()
                .setTitle(`Server List - Page ${page + 1}/${Math.ceil(servers.length / itemsPerPage)}`)
                .setColor('Random')
                .setFooter({ text: `Showing ${start + 1}-${end > servers.length ? servers.length : end} of ${servers.length} servers.` })
                .setTimestamp();

            currentServers.forEach((server) => {
                if (embed.data.fields && embed.data.fields.length >= 25) {
                    // Skip adding more fields if the limit is reached
                    return;
                }
                embed.addFields([
                    { name: 'Server Name', value: server.name, inline: true },
                    { name: 'Description', value: server.description, inline: true },
                    { name: 'Owner', value: server.owner, inline: true },
                    { name: 'Highest Role', value: server.highestRole.name || 'N/A', inline: true },
                    { name: 'Created At', value: server.createdAt, inline: true },
                    { name: 'ID', value: server.id, inline: true },
                ]);
            });

            return embed;
        };

        const prevButton = new ButtonBuilder()
            .setCustomId('prev')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 0);

        const nextButton = new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === Math.ceil(servers.length / itemsPerPage) - 1);

        const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

        const messageReply = await message.reply({
            embeds: [generateEmbed(currentPage)],
            components: [row],
        });

        const collector = messageReply.createMessageComponentCollector({
            time: 60000,
        });

        collector.on('collect', async (btnInteraction) => {
            if (btnInteraction.user.id !== message.author.id) {
                return btnInteraction.reply({ content: 'This button is not for you!', ephemeral: true });
            }

            if (btnInteraction.customId === 'prev' && currentPage > 0) {
                currentPage--;
            } else if (btnInteraction.customId === 'next' && currentPage < Math.ceil(servers.length / itemsPerPage) - 1) {
                currentPage++;
            }

            await btnInteraction.update({
                embeds: [generateEmbed(currentPage)],
                components: [
                    new ActionRowBuilder().addComponents(
                        prevButton.setDisabled(currentPage === 0),
                        nextButton.setDisabled(currentPage === Math.ceil(servers.length / itemsPerPage) - 1)
                    ),
                ],
            });
        });

        collector.on('end', () => {
            if (!messageReply.editable) return;
            const disabledRow = new ActionRowBuilder().addComponents(
                prevButton.setDisabled(true),
                nextButton.setDisabled(true)
            );

            messageReply.edit({ components: [disabledRow] }).catch(console.error);
        });
    },
};
