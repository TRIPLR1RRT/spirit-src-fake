const { ActivityType } = require("discord.js");
const client = require("../../client");
const { logger } = require("../../functions/logger");
const startDashboard = require("../../../dashboard/server");

client.on("ready", async () => {
    console.log("\n---------------------");
    logger(`${client.user.tag} is ready`, "success");
    startDashboard();
    console.log("---------------------");

    const activities = [
        { name: "+help || /help", type: ActivityType.Listening },
        { name: `${client.guilds.cache.size} servers.`, type: ActivityType.Watching },
        { name: `${await getTotalUsers()} users.`, type: ActivityType.Watching },
        { name: "OpenDevsFlow || OpenDevsFlow.xyz", type: ActivityType.Streaming }
    ];
    const statuses = ["online", "dnd", "idle"];

    setInterval(() => {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        client.user.setPresence({
            activities: [randomActivity],
            status: randomStatus
        });
    }, 5000);
});

// Function to get the total number of users across all shards
async function getTotalUsers() {
    try {
        const users = await client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0));
        const totalUsers = users.reduce((acc, userCount) => acc + userCount, 0);
        return totalUsers;
    } catch (err) {
        console.error("Error fetching total users:", err);
        return 0;
    }
}
