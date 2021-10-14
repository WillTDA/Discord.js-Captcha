<h1 align="center">
    🎓 Discord.js Captcha 🎓
</h1>

A powerful package for Discord.js v13 that allows you to easily create CAPTCHAs for Discord Servers.

### <u>What is a **CAPTCHA**?</u>

Put simply, a **CAPTCHA** is a question you have to answer to prove you are not a robot.

**CAPTCHA** is an acronym for:

**C**ompletely

**A**utomated

**P**ublic

**T**uring Test (to tell)

**C**omputers (and humans)

**A**part

To learn more about what a CAPTCHA is, you can [watch this video](https://www.youtube.com/watch?v=o1zNIm8GVPY&ab_channel=TomScott) by Tom Scott.

# Install Package

To install this awesome module, type the command shown below into your Terminal.

`npm i discord.js-captcha --save`

For versions 2.0.0 and Above, you'll also need discord.js v13.

`npm i discord.js@13 --save`

For versions earlier than 2.0.0, you'll need discord.js v12. However it is recommended you update to gain access to more customisation options, as well as to patch bugs and security vulnerabilities.

`npm i discord.js@12 --save`

# Example Code

```js
const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES] });
const { Captcha } = require("discord.js-captcha");

const captcha = new Captcha(client, {
    guildID: "Guild ID Here",
    roleID: "Role ID Here",
    channelID: "Text Channel ID Here", //optional
    sendToTextChannel: false, //optional, defaults to false
    attempts: 3, //optional, defaults to 1. number of attempts before captcha is considered to be failed
    timeout: 30000, //optional, defaults to 60000. amount of time the user has to solve the captcha on each attempt in milliseconds
    showAttemptCount: true, //optional, defaults to true. whether to show the number of attempts left in embed footer
    customPromptEmbed: new MessageEmbed(), //customise the embed that will be sent to the user when the captcha is requested
    customSuccessEmbed: new MessageEmbed(), //customise the embed that will be sent to the user when the captcha is solved
    customFailureEmbed: new MessageEmbed(), //customise the embed that will be sent to the user when they fail to solve the captcha
});

client.on("guildMemberAdd", async member => {
    //in your bot application in the dev portal, make sure you have intents turned on!
    captcha.present(member);
});

client.login("Discord Bot Token")
```

**Note:** When displaying a CAPTCHA to the user, the CAPTCHA image will automatically be attached to the `customPromptEmbed` for you.

In addition, if you have the `showAttemptCount` option enabled, any embed footer text on the `customPromptEmbed` will be overwritten with the number of attempts left.

### <u>**`channelID`** Option Explained</u>
The `channelID` option is the ID of the Discord Text Channel to Send the CAPTCHA to if the user's Direct Messages are locked.

Use the option `sendToTextChannel`, and set it to `true` to always send the CAPTCHA to the Text Channel.

### <u>**`sendToTextChannel`** Option Explained</u>
The `sendToTextChannel` option determines whether you want the CAPTCHA to be sent to a specified Text Channel instead of Direct Messages, regardless of whether the user's DMs are locked.

Use the option `channelID` to specify the Text Channel.

# What do the CAPTCHAs look like?
Below is an image of what answering a CAPTCHA will look like when using the default settings:

![Image of Captcha](https://github.com/WillTDA/discord.js-captcha/blob/master/src/images/captchaExample.jpg?raw=true)

# Need Help or Find any Bugs? Join Our Discord Server!

https://discord.gg/P2g24jp