const { Client, User, DMChannel, TextChannel } = require("discord.js");

/**
 * 
 * @param {Client} client
 * @param {any} options
 * @param {User} user
 * @returns {DMChannel | TextChannel}
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