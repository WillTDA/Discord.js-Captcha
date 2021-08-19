const Discord = require("discord.js");
const createCaptcha = require("./createCaptcha");
const handleChannelType = require("./handleChannelType");
/**
 * Captcha Parameters
 * @typedef {object} captchaOptions
 * @prop {string} guildID The ID of the Discord Server to Create a CAPTCHA for.
 * @prop {string} roleID The ID of the Discord Role to Give when the CAPTCHA is complete.
 * @prop {string} [channelID=undefined] (OPTIONAL): The ID of the Discord Text Channel to Send the CAPTCHA to if the user's Direct Messages are locked. Use the parameter "sendToTextChannel", and set it to "true" to always send the CAPTCHA to the Text Channel.
 * @prop {boolean} [sendToTextChannel=false] (OPTIONAL): Whether you want the CAPTCHA to be sent to a specified Text Channel instead of Direct Messages, regardless of whether the user's DMs are locked. Use the parameter "channelID" to specify the Text Channel.
 * 
 */

const captchaOptions = {
    guildID: String,
    roleID: String,
    channelID: undefined,
    sendToTextChannel: false
}

class Captcha {

    /**
    * Creates a New Instance of the Captcha Class.
    * 
    * __Captcha Options__
    * 
    * - `guildID` - The ID of the Discord Server to Create a CAPTCHA for.
    * - `roleID` - The ID of the Discord Role to Give when the CAPTCHA is complete.
    * - `channelID` - The ID of the Discord Text Channel to Send the CAPTCHA to if the user's Direct Messages are locked.
    * - `sendToTextChannel` - Whether you want the CAPTCHA to be sent to a specified Text Channel instead of Direct Messages, regardless of whether the user's DMs are locked.
    * 
    * @param {captchaOptions} options The Options for the Captcha.
    * @param {Discord.Client} client The Discord Client.
    * @param {captchaOptions} options
    * @example
    * const { Client, Intents } = require("discord.js");
    * const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES] });
    * 
    * const { Captcha } = require("discord.js-captcha"); 
    * 
    * const captcha = new Captcha(client, {
    *     guildID: "Guild ID Here",
    *     roleID: "Role ID Here",
    *     channelID: "Text Channel ID Here", //optional
    *     sendToTextChannel: Boolean, //optional
    * });
       */
    constructor(client, options = {}) {

        const structure = `
        new Captcha(Discord#Client, {
            guildID: "Guild ID Here",
            roleID: "Role ID Here",
            channelID: "Text Channel ID Here", //optional
            sendToTextChannel: Boolean, //optional
        });`

        if (!client) {
            console.log(`Discord.js Captcha Error: No Discord Client was Provided!\n\nFollow this Structure:\n${structure}\n\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
            process.exit(1)
        }
        this.client = client;
        /**
        * Captcha Options
        * @type {captchaOptions}
        */
        this.options = options;

        if (!options.guildID) {
            console.log(`Discord.js Captcha Error: No Discord Guild ID was Provided!\n\nFollow this Structure:\n${structure}\n\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
            process.exit(1);
        }
        if (!options.roleID) {
            console.log(`Discord.js Captcha Error: No Discord Role ID was Provided!\n\nFollow this Structure:\n${structure}\n\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
            process.exit(1)
        }
        if ((options.sendToTextChannel === true) && (!options.channelID)) {
            console.log(`Discord.js Captcha Error: Option "sendToTextChannel" was set to true, but "channelID" was not Provided!\n\nFollow this Structure:\n${structure}\n\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
            process.exit(1)
        }

        Object.assign(this.options, options);
    }

    /**
    * Presents the CAPTCHA to a Discord Server Member.
    * 
    * Note: The CAPTCHA will be sent in Direct Messages. (If the user has their DMs locked, it will be Sent in a specified Text Channel.)
    * @param {Discord.GuildMember} member The Discord Server Member to Present the CAPTCHA to.
    * @returns {Promise<Discord.Message>}
    * @example
    * const { Captcha } = require("discord.js-captcha"); 
    * 
    * const captcha = new Captcha(client, {
    *     guildID: "Guild ID Here",
    *     roleID: "Role ID Here",
    *     channelID: "Text Channel ID Here", //optional
    *     sendToTextChannel: Boolean, //optional
    * });
    * 
    * client.on("guildMemberAdd", async member => {
    *     captcha.present(member);
    * });
    */
    async present(member) {
        if (!member) return console.log(`Discord.js Captcha Error: No Discord Member was Provided!\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
        const user = member.user
        const captcha = await createCaptcha().catch(e => { return console.log(e) })

        const captchaIncorrect = new Discord.MessageEmbed()
            .setTitle("❌ You Failed to Complete the CAPTCHA!")
            .setDescription(`${member.user}, you didn't solve the CAPTCHA, and you were kicked from **${member.guild.name}**.\nCAPTCHA Text: **${captcha.text}**`)
            .addField("What Should I Do?", "No need to worry! You can just try again by re-joining the server!")
            .setTimestamp()
            .setColor("RED")
            .setThumbnail(member.guild.iconURL())

        const captchaCorrect = new Discord.MessageEmbed()
            .setTitle("✅ CAPTCHA Solved!")
            .setDescription(`${member.user}, you completed the CAPTCHA successfully, and you have been given access to **${member.guild.name}**!`)
            .setTimestamp()
            .setColor("GREEN")
            .setThumbnail(member.guild.iconURL())

        await handleChannelType(this.client, this.options, user).then(async channel => {
            let captchaEmbed;
            try {
                if ((this.options.channelID) && this.options.sendToTextChannel == true) {
                    channel = (await this.client.guilds.fetch(this.options.guildID)).channels.resolve(this.options.channelID)
                }
                else {
                    channel = await user.createDM()
                }
                captchaEmbed = await channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setTitle(`Welcome to ${member.guild.name}!`)
                            .addField("I'm Not a Robot", `${member.user}, to gain access to **${member.guild.name}**, please solve the CAPTCHA below within 60 seconds!\n\nThis is done to protect the server from raids consisting of spam bots.`)
                            .setFooter("Failure to Solve the CAPTCHA will have you kicked from the server. You can try again by re-joining!")
                            .setColor("RANDOM")
                            .setThumbnail(member.guild.iconURL())
                            .setImage('attachment://captcha.png')
                    ],
                    files: [
                        { name: "captcha.png", attachment: captcha.image }
                    ]
                })
            } catch {
                channel = (await this.client.guilds.fetch(this.options.guildID)).channels.resolve(this.options.channelID)
                if (this.options.channelID) {
                    captchaEmbed = await channel.send({
                        embeds: [
                            new Discord.MessageEmbed()
                                .setTitle(`Welcome to ${member.guild.name}!`)
                                .addField("I'm Not a Robot", `${member.user}, to gain access to **${member.guild.name}**, please solve the CAPTCHA below within 60 seconds!\n\nThis is done to protect the server from raids consisting of spam bots.`)
                                .setFooter("Failure to Solve the CAPTCHA will have you kicked from the server. You can try again by re-joining!")
                                .setColor("RANDOM")
                                .setThumbnail(member.guild.iconURL())
                                .setImage('attachment://captcha.png')
                        ],
                        files: [
                            { name: "captcha.png", attachment: captcha.image }
                        ]
                    })
                } else {
                    return console.log(`Discord.js Captcha Error: User's Direct Messages are Locked!\nYou can attempt have the CAPTCHA sent to a Text Channel if it can't send to DMs by using the "channelID" Parameter in the Constructor.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
                }
            }

            const captchaFilter = x => {
                return (x.author.id == member.user.id)
            }

            await captchaEmbed.channel.awaitMessages({
                filter: captchaFilter, max: 1, time: 60000
            })
                .then(async responses => {
                    if (!responses.size) {
                        await member.kick("Failed to Pass CAPTCHA")
                        await captchaEmbed.delete();
                        return channel.send({ embeds: [captchaIncorrect] })
                            .then(async msg => {
                                if (channel.type === "GUILD_TEXT") setTimeout(() => msg.delete(), 3000);
                            });
                    }

                    const answer = String(responses.first());
                    if (channel.type === "GUILD_TEXT") await responses.first().delete();

                    if (answer === captcha.text) {
                        await member.roles.add(this.options.roleID)
                        if (channel.type === "GUILD_TEXT") await captchaEmbed.delete();
                        return channel.send({ embeds: [captchaCorrect] })
                            .then(async msg => {
                                if (channel.type === "GUILD_TEXT") setTimeout(() => msg.delete(), 3000);
                            });
                    } else {
                        await member.kick("Failed to Pass CAPTCHA")
                        if (channel.type === "GUILD_TEXT") await captchaEmbed.delete();
                        return channel.send({ embeds: [captchaIncorrect] })
                            .then(async msg => {
                                if (channel.type === "GUILD_TEXT") setTimeout(() => msg.delete(), 3000);
                            });
                    }
                })
        })
    }
}

module.exports.Captcha = Captcha;