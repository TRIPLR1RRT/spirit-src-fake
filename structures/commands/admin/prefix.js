const { Client, Message, EmbedBuilder } = require('discord.odf');
const mongoose = require('mongoose');

const prefixSchema = require('../../database/schema/prefix.js');

module.exports = {
    name: 'prefix',
    description: 'Sets or checks the server prefix.',
    aliases: ['setprefix'],
    userPermissions: ["ManageGuild"],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async (client, message, args) => {
        const { guild } = message;

        const newPrefix = args[0]; 

        if (!newPrefix) {
            const data = await prefixSchema.findOne({ _id: guild.id }) || false;
            if (!data) {
                return message.reply(`Current prefix for this server is \`+\`.`)
            } else {
                return message.reply(`Current prefix for this server is \`${data.prefix}\`.`);
            }
        }

        await prefixSchema.findOneAndUpdate(
            { _id: guild.id },
            { prefix: newPrefix },
            { upsert: true }
        );

        message.reply(`Prefix for this server has been set to \`${newPrefix}\`.`);
    }
};