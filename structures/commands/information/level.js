const { QuickDB } = require('quick.db');
const db = new QuickDB();
const { Util } = require("../../handlers/xp.js");

module.exports = {
  name: "level",
  aliases: ["lvl", "rank"],
  description: "Get the level of Author or Mentioned",
  usage: "level (username)}",
  run: async (client, message, args) => {
    const user = message.mentions.users.first() || message.author;

    try {
      let xp = await db.get(`xp_${user.id}_${message.guild.id}`) || 0;
      const { level, remxp, levelxp } = Util.getInfo(xp);
        
      message.reply(`**${user.username}'s Rank\n **Level:** ${level}.\n **Remaining xp:** ${remxp}.\n **Level xp:** ${levelxp}.`)

    } catch (error) {
      console.error("Error fetching xp:", error);
      message.channel.send("An error occurred while fetching your level."); 
    }
  },
};  