const { Client, GuildMember, DMChannel, TextChannel } = require("discord.js");

/**
 * 
 * @param {Client} client
 * @param {any} options
 * @param {GuildMember} member
 * @returns {DMChannel | TextChannel}
 */

module.exports = async function handleChannelType(client, options, member) {
    let channel;
    if (!options.channelID) {
        channel = await member.user.createDM();
    } else {
        if (options.sendToTextChannel == true) {
            channel = (await client.guilds.fetch(member.guild.id)).channels.resolve(options.channelID);
        }
    }
    return channel;
}