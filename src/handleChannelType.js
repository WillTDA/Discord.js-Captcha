const Discord = require("discord.js");

/**
 * 
 * @param {Discord.Client} client
 * @param {any} options
 * @param {Discord.User} user
 * @returns {Discord.DMChannel | Discord.TextChannel}
 */

module.exports = async function handleChannelType(client, options, user) {
    let channel;
    if (!options.channelID) {
        channel = await user.createDM();
    } else {
        if (options.sendToTextChannel == true) {
            channel = (await client.guilds.fetch(options.guildID)).channels.resolve(options.channelID);
        }
    }
    return channel
}