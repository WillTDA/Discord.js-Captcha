const Discord = require("discord.js");
const EventEmitter = require("events");
const createCaptcha = require("./createCaptcha");
const handleChannelType = require("./handleChannelType");

/**
 * Captcha Options
 * @typedef {object} CaptchaOptions
 * @prop {string} guildID The ID of the Discord Server to Create a CAPTCHA for.
 * @prop {string} [roleID=undefined] (OPTIONAL): The ID of the Discord Role to Give when the CAPTCHA is complete.
 * @prop {string} [channelID=undefined] (OPTIONAL): The ID of the Discord Text Channel to Send the CAPTCHA to if the user's Direct Messages are locked. Use the option "sendToTextChannel", and set it to "true" to always send the CAPTCHA to the Text Channel.
 * @prop {boolean} [sendToTextChannel=false] (OPTIONAL): Whether you want the CAPTCHA to be sent to a specified Text Channel instead of Direct Messages, regardless of whether the user's DMs are locked. Use the option "channelID" to specify the Text Channel.
 * @prop {boolean} [addRoleOnSuccess=true] (OPTIONAL): Whether you want the Bot to Add the role to the User if the CAPTCHA is Solved Successfully.
 * @prop {boolean} [kickOnFailure=true] (OPTIONAL): Whether you want the Bot to Kick the User if the CAPTCHA is Failed.
 * @prop {boolean} [caseSensitive=true] (OPTIONAL): Whether you want the CAPTCHA to be case-sensitive.
 * @prop {number} [attempts=1] (OPTIONAL): The Number of Attempts Given to Solve the CAPTCHA.
 * @prop {number} [timeout=60000] (OPTIONAL): The Time in Milliseconds before the CAPTCHA expires and the User fails the CAPTCHA.
 * @prop {boolean} [showAttemptCount=true] (OPTIONAL): Whether you want to show the Attempt Count in the CAPTCHA Prompt. (Displayed in Embed Footer)
 * @prop {Discord.MessageEmbed} [customPromptEmbed=undefined] (OPTIONAL): Custom Discord Embed to be Shown for the CAPTCHA Prompt.
 * @prop {Discord.MessageEmbed} [customSuccessEmbed=undefined] (OPTIONAL): Custom Discord Embed to be Shown for the CAPTCHA Success Message.
 * @prop {Discord.MessageEmbed} [customFailureEmbed=undefined] (OPTIONAL): Custom Discord Embed to be Shown for the CAPTCHA Failure Message.
 * 
 */

class Captcha extends EventEmitter {

    /**
    * Creates a New Instance of the Captcha Class.
    * 
    * __Captcha Options__
    * 
    * - `guildID` - The ID of the Discord Server to Create a CAPTCHA for.
    * 
    * - `roleID` - The ID of the Discord Role to Give when the CAPTCHA is complete.
    * 
    * - `channelID` - The ID of the Discord Text Channel to Send the CAPTCHA to if the user's Direct Messages are locked.
    * 
    * - `sendToTextChannel` - Whether you want the CAPTCHA to be sent to a specified Text Channel instead of Direct Messages, regardless of whether the user's DMs are locked.
    * 
    * - `addRoleOnSuccess` - Whether you want the Bot to Add the role to the User if the CAPTCHA is Solved Successfully.
    * 
    * - `kickOnFailure` - Whether you want the Bot to Kick the User if the CAPTCHA is Failed.
    * 
    * - `caseSensitive` - Whether you want the the CAPTCHA to be case-sensitive.
    * 
    * - `attempts` - The Number of Attempts Given to Solve the CAPTCHA.
    * 
    * - `timeout` - The Time in Milliseconds before the CAPTCHA expires and the User fails the CAPTCHA.
    * 
    * - `showAttemptCount` - Whether you want to show the Attempt Count in the CAPTCHA Prompt. (Displayed in Embed Footer)
    * 
    * - `customPromptEmbed` - Custom Discord Embed to be Shown for the CAPTCHA Prompt.
    * 
    * - `customSuccessEmbed` - Custom Discord Embed to be Shown for the CAPTCHA Success Message.
    * 
    * - `customFailureEmbed` - Custom Discord Embed to be Shown for the CAPTCHA Failure Message.
    * 
    * @param {CaptchaOptions} options The Options for the Captcha.
    * @param {Discord.Client} client The Discord Client.
    * @param {CaptchaOptions} options
    * @example
    * const { Client, Intents } = require("discord.js");
    * const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES] });
    * 
    * const { Captcha } = require("discord.js-captcha"); 
    * 
    * const captcha = new Captcha(client, {
    *     guildID: "Guild ID Here",
    *     roleID: "Role ID Here", //optional
    *     channelID: "Text Channel ID Here", //optional
    *     sendToTextChannel: false, //optional, defaults to false
    *     addRoleOnSuccess: true, //optional, defaults to true
    *     kickOnFailure: true, //optional, defaults to true
    *     caseSensitive: true, //optional, defaults to true
    *     attempts: 3, //optional, defaults to 1
    *     timeout: 30000, //optional, defaults to 60000
    *     showAttemptCount: true, //optional, defaults to true
    *     customPromptEmbed: new MessageEmbed(), //custom embed for the captcha prompt
    *     customSuccessEmbed: new MessageEmbed(), //custom embed for success message
    *     customFailureEmbed: new MessageEmbed(), //custom embed for failure message
    * });
       */
    constructor(client, options = {}) {
        super();

        if (!client) {
            console.log(`Discord.js Captcha Error: No Discord Client was Provided!\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
            process.exit(1)
        }
        this.client = client;
        /**
        * Captcha Options
        * @type {CaptchaOptions}
        */
        this.options = options;

        if (!options.guildID) {
            console.log(`Discord.js Captcha Error: No Discord Guild ID was Provided!\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
            process.exit(1);
        }
        if ((options.sendToTextChannel === true) && (!options.channelID)) {
            console.log(`Discord.js Captcha Error: Option "sendToTextChannel" was set to true, but "channelID" was not Provided!\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
            process.exit(1)
        }
        if ((options.addRoleOnSuccess === true) && (!options.roleID)) {
            console.log(`Discord.js Captcha Error: Option "addRoleOnSuccess" was set to true, but "roleID" was not Provided!\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
            process.exit(1)
        }
        if (options.attempts < 1) {
            console.log(`Discord.js Captcha Error: Option "attempts" must be Greater than 0!\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
            process.exit(1)
        }
        if (options.timeout < 1) {
            console.log(`Discord.js Captcha Error: Option "timeout" must be Greater than 0!\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
            process.exit(1)
        }
        if (options.caseSensitive && (typeof options.caseSensitive !== "boolean")) {
            console.log(`Discord.js Captcha Error: Option "caseSensitive" must be of type boolean!\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
            process.exit(1)
        }
        if (options.customPromptEmbed && (typeof options.customPromptEmbed === "string")) {
            console.log(`Discord.js Captcha Error: Option "customPromptEmbed" is not an instance of MessageEmbed!\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
            process.exit(1)
        }
        if (options.customSuccessEmbed && (typeof options.customSuccessEmbed === "string")) {
            console.log(`Discord.js Captcha Error: Option "customSuccessEmbed" is not an instance of MessageEmbed!\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
            process.exit(1)
        }
        if (options.customFailureEmbed && (typeof options.customFailureEmbed === "string")) {
            console.log(`Discord.js Captcha Error: Option "customFailureEmbed" is not an instance of MessageEmbed!\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
            process.exit(1)
        }

        if (options.addRoleOnSuccess === undefined) options.addRoleOnSuccess = true;
        options.attempts = options.attempts || 1;
        if (options.caseSensitive === undefined) options.caseSensitive = true;
        options.timeout = options.timeout || 60000;
        if (options.showAttemptCount === undefined) options.showAttemptCount = true;

        Object.assign(this.options, options);
    }

    /**
    * Presents the CAPTCHA to a Discord Server Member.
    * 
    * Note: The CAPTCHA will be sent in Direct Messages. (If the user has their DMs locked, it will be Sent in a specified Text Channel.)
    * @param {Discord.GuildMember} member The Discord Server Member to Present the CAPTCHA to.
    * @returns {Promise<boolean>} Whether or not the Member Successfully Solved the CAPTCHA.
    * @example
    * const { Captcha } = require("discord.js-captcha"); 
    * 
    * const captcha = new Captcha(client, {
    *     guildID: "Guild ID Here",
    *     roleID: "Role ID Here", //optional
    *     channelID: "Text Channel ID Here", //optional
    *     sendToTextChannel: false, //optional, defaults to false
    *     kickOnFailure: true, //optional, defaults to true
    *     caseSensitive: true, //optional, defaults to true
    *     attempts: 3, //optional. number of attempts before captcha is considered to be failed
    *     timeout: 30000, //optional. time the user has to solve the captcha on each attempt in milliseconds
    *     showAttemptCount: true, //optional. whether to show the number of attempts left in embed footer
    *     customPromptEmbed: new MessageEmbed(), //custom embed for the captcha prompt
    *     customSuccessEmbed: new MessageEmbed(), //custom embed for success message
    *     customFailureEmbed: new MessageEmbed(), //custom embed for failure message
    * });
    * 
    * client.on("guildMemberAdd", async member => {
    *     captcha.present(member);
    * });
    */
    async present(member) {
        if (!member) return console.log(`Discord.js Captcha Error: No Discord Member was Provided!\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
        const user = member.user
        const captcha = await createCaptcha(this.options.caseSensitive).catch(e => { return console.log(e) })
        let attemptsLeft = this.options.attempts || 1;
        let attemptsTaken = 1;
        let captchaResponses = [];

        let captchaIncorrect = new Discord.MessageEmbed()
            .setTitle("❌ You Failed to Complete the CAPTCHA!")
            .setDescription(`${member.user}, you failed to solve the CAPTCHA!\n\nCAPTCHA Text: **${captcha.text}**`)
            .setTimestamp()
            .setColor("RED")
            .setThumbnail(member.guild.iconURL({ dynamic: true }))

        if (this.options.customFailureEmbed) captchaIncorrect = this.options.customFailureEmbed

        let captchaCorrect = new Discord.MessageEmbed()
            .setTitle("✅ CAPTCHA Solved!")
            .setDescription(`${member.user}, you completed the CAPTCHA successfully, and you have been given access to **${member.guild.name}**!`)
            .setTimestamp()
            .setColor("GREEN")
            .setThumbnail(member.guild.iconURL({ dynamic: true }))

        if (this.options.customSuccessEmbed) captchaCorrect = this.options.customSuccessEmbed

        let captchaPrompt = new Discord.MessageEmbed()
            .setTitle(`Welcome to ${member.guild.name}!`)
            .addField("I'm Not a Robot", `${member.user}, to gain access to **${member.guild.name}**, please solve the CAPTCHA below!\n\nThis is done to protect the server from raids consisting of spam bots.`)
            .setColor("RANDOM")
            .setThumbnail(member.guild.iconURL({ dynamic: true }))

        if (this.options.customPromptEmbed) captchaPrompt = this.options.customPromptEmbed
        if (this.options.showAttemptCount) captchaPrompt.setFooter({ text: this.options.attempts == 1 ? "You have one attempt to solve the CAPTCHA." : `Attempts Left: ${attemptsLeft}` })
        captchaPrompt.setImage('attachment://captcha.png')

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
                    embeds: [captchaPrompt],
                    files: [
                        { name: "captcha.png", attachment: captcha.image }
                    ]
                })
            } catch {
                channel = (await this.client.guilds.fetch(this.options.guildID)).channels.resolve(this.options.channelID)
                if (this.options.channelID) {
                    captchaEmbed = await channel.send({
                        embeds: [captchaPrompt],
                        files: [
                            { name: "captcha.png", attachment: captcha.image }
                        ]
                    })
                } else {
                    return console.log(`Discord.js Captcha Error: User's Direct Messages are Locked!\nYou can attempt have the CAPTCHA sent to a Text Channel if it can't send to DMs by using the "channelID" Option in the Constructor.\nNeed Help? Join our Discord Server at 'https://discord.gg/P2g24jp'`);
                }
            }

            const captchaFilter = x => {
                return (x.author.id == member.user.id)
            }

            async function handleAttempt(captchaData) { //Handles CAPTCHA Responses and Checks
                await captchaEmbed.channel.awaitMessages({
                    filter: captchaFilter, max: 1, time: captchaData.options.timeout
                })
                    .then(async responses => {

                        if (!responses.size) { //If no response was given, CAPTCHA is fully cancelled here

                            //emit timeout event
                            captchaData.emit("timeout", {
                                member: member,
                                responses: captchaResponses,
                                attempts: attemptsTaken,
                                captchaText: captcha.text,
                                captchaOptions: captchaData.options
                            })

                            await captchaEmbed.delete();
                            await channel.send({ embeds: [captchaIncorrect] })
                                .then(async msg => {
                                    if (captchaData.options.kickOnFailure) await member.kick("Failed to Pass CAPTCHA")
                                    if (channel.type === "GUILD_TEXT") setTimeout(() => msg.delete(), 3000);
                                });
                            return false;
                        }

                        //emit answer event
                        captchaData.emit("answer", {
                            member: member,
                            response: String(responses.first()),
                            attempts: attemptsTaken,
                            captchaText: captcha.text,
                            captchaOptions: captchaData.options
                        })

                        let answer = String(responses.first()); //Converts the response message to a string
                        if (captchaData.options.caseSensitive !== true) answer = answer.toLowerCase(); //If the CAPTCHA is case sensitive, convert the response to lowercase
                        captchaResponses.push(answer); //Adds the answer to the array of answers
                        if (channel.type === "GUILD_TEXT") await responses.first().delete();

                        if (answer === captcha.text) { //If the answer is correct, this code will execute
                            //emit success event
                            captchaData.emit("success", {
                                member: member,
                                responses: captchaResponses,
                                attempts: attemptsTaken,
                                captchaText: captcha.text,
                                captchaOptions: captchaData.options
                            })
                            if (captchaData.options.addRoleOnSuccess === true) { // Only adds to role if option is set
                                await member.roles.add(captchaData.options.roleID)
                            }
                            if (channel.type === "GUILD_TEXT") await captchaEmbed.delete();
                            channel.send({ embeds: [captchaCorrect] })
                                .then(async msg => {
                                    if (channel.type === "GUILD_TEXT") setTimeout(() => msg.delete(), 3000);
                                });
                            return true;
                        } else { //If the answer is incorrect, this code will execute
                            if (attemptsLeft > 1) { //If there are attempts left
                                attemptsLeft--;
                                attemptsTaken++;
                                if (channel.type === "GUILD_TEXT" && captchaData.options.showAttemptCount) {
                                    await captchaEmbed.edit({
                                        embeds: [captchaPrompt.setFooter({ text: `Attempts Left: ${attemptsLeft}` })],
                                        files: [
                                            { name: "captcha.png", attachment: captcha.image }
                                        ]
                                    })
                                }
                                else if (channel.type !== "GUILD_TEXT") {
                                    await captchaEmbed.channel.send({
                                        embeds: [captchaData.options.showAttemptCount ? captchaPrompt.setFooter({ text: `Attempts Left: ${attemptsLeft}` }) : captchaPrompt],
                                        files: [
                                            { name: "captcha.png", attachment: captcha.image }
                                        ]
                                    })
                                }
                                return handleAttempt(captchaData);
                            }
                            //If there are no attempts left

                            //emit failure event
                            captchaData.emit("failure", {
                                member: member,
                                responses: captchaResponses,
                                attempts: attemptsTaken,
                                captchaText: captcha.text,
                                captchaOptions: captchaData.options
                            })

                            if (channel.type === "GUILD_TEXT") await captchaEmbed.delete();
                            await channel.send({ embeds: [captchaIncorrect] })
                                .then(async msg => {
                                    if (captchaData.options.kickOnFailure) await member.kick("Failed to Pass CAPTCHA")
                                    if (channel.type === "GUILD_TEXT") setTimeout(() => msg.delete(), 3000);
                                });
                            return false;
                        }
                    })
            }
            //emit prompt event
            this.emit("prompt", {
                member: member,
                captchaText: captcha.text,
                captchaOptions: this.options
            })
            handleAttempt(this);
        })
    }
}

module.exports.Captcha = Captcha;
