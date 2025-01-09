const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "avatar",
    description: "Get the avatar of a user or yourself.",
    aliases: ["av"],
    usage: "avatar [@user]",
    run: async (client, message, args) => {
        // Get the mentioned user or the message author
        const user = message.mentions.users.first() || message.author;

        // Fetch the avatar URL
        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

        // Create an embed
        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setDescription(`[Click here to open the avatar in full size](${avatarURL})`)
            .setImage(avatarURL)
            .setColor("#ff0000") // Updated color
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        // Create a button
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Download Avatar")
                .setStyle(ButtonStyle.Link)
                .setURL(avatarURL)
        );

        // Send the embed with the button
        message.reply({ embeds: [embed], components: [row] });
    }
};
