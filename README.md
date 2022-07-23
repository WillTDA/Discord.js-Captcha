<h1 align="center">
    🎓 Discord.js Captcha 🎓
</h1>

[![NPM](https://nodei.co/npm/discord.js-captcha.png)](https://npmjs.com/package/discord.js-captcha)

[![Downloads](https://img.shields.io/npm/dt/discord.js-captcha?logo=npm&style=flat-square)](https://npmjs.com/package/discord.js-captcha) [![Discord Server](https://img.shields.io/discord/667479986214666272?logo=discord&logoColor=white&style=flat-square)](https://discord.gg/P2g24jp)

A powerful package for Discord.js v14 that allows you to easily create CAPTCHAs for Discord Servers.

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

For versions 3.0.0 and above, you'll also need Discord.js v14.

`npm i discord.js@14 --save`

For versions earlier than 3.0.0, you'll need Discord.js v13 instead. However it is recommended you update to gain access to more customisation options, as well as to patch bugs and security vulnerabilities!

`npm i discord.js@13 --save`

# Example Code

## Initial Setup:

```js
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const client = new Client({
    intents: [
        IntentsBitField.Guilds,
        IntentsBitField.GuildMessages,
        IntentsBitField.GuildMembers,
        IntentsBitField.DirectMessages,
    ]
});

client.login("Discord Bot Token");

const { Captcha } = require("discord.js-captcha");

const captcha = new Captcha(client, {
    roleID: "Role ID Here", //optional
    channelID: "Text Channel ID Here", //optional
    sendToTextChannel: false, //optional, defaults to false
    addRoleOnSuccess: true, //optional, defaults to true. whether you want the bot to add the role to the user if the captcha is solved
    kickOnFailure: true, //optional, defaults to true. whether you want the bot to kick the user if the captcha is failed
    caseSensitive: true, //optional, defaults to true. whether you want the captcha responses to be case-sensitive
    attempts: 3, //optional, defaults to 1. number of attempts before captcha is considered to be failed
    timeout: 30000, //optional, defaults to 60000. time the user has to solve the captcha on each attempt in milliseconds
    showAttemptCount: true, //optional, defaults to true. whether to show the number of attempts left in embed footer
    customPromptEmbed: new EmbedBuilder(), //customise the embed that will be sent to the user when the captcha is requested
    customSuccessEmbed: new EmbedBuilder(), //customise the embed that will be sent to the user when the captcha is solved
    customFailureEmbed: new EmbedBuilder(), //customise the embed that will be sent to the user when they fail to solve the captcha
});
```

### <u>**`channelID`** Option Explained</u>
The `channelID` option is the ID of the Discord Text Channel to Send the CAPTCHA to if the user's Direct Messages are locked.

Use the option `sendToTextChannel`, and set it to `true` to always send the CAPTCHA to the Text Channel.

### <u>**`sendToTextChannel`** Option Explained</u>
The `sendToTextChannel` option determines whether you want the CAPTCHA to be sent to a specified Text Channel instead of Direct Messages, regardless of whether the user's DMs are locked.

Use the option `channelID` to specify the Text Channel.

## Presenting a CAPTCHA to a Member (With Built-In CAPTCHA Creation):

Discord.js Captcha can automatically create a CAPTCHA for you, if you don't want to create one yourself.

**Note:** Built-In CAPTCHA Creation requires you to install the `canvas` package. (`npm i canvas --save`)

```js
client.on("guildMemberAdd", async member => {
    //in your bot application in the dev portal, make sure you have intents turned on!
    captcha.present(member); //captcha is created by the package, and sent to the member
});
```

## Presenting a CAPTCHA to a Member (With Custom CAPTCHA Image Data):

Don't like how the automatically created CAPTCHA looks? Simply pass in your own `CaptchaImageData` to the `present` method!

```js
client.on("guildMemberAdd", async member => {
    //in your bot application in the dev portal, make sure you have intents turned on!
    const captchaImageBuffer = //custom image as buffer
    const captchaImageText = //answer to the captcha as string
    captcha.present(member, { image: captchaImageBuffer, text: captchaImageText });
});
```

**Note:** When displaying a CAPTCHA to the user, the CAPTCHA image will automatically be attached to the `customPromptEmbed` for you.

In addition, if you have the `showAttemptCount` option enabled, any embed footer text on the `customPromptEmbed` will be overwritten with the number of attempts left.

# CAPTCHA Events

There are five events that you can use to log CAPTCHA actions, responses, and other details. They are:

- `prompt` - Emitted when a CAPTCHA is presented to a user.
- `answer` - Emitted when a user responds to a CAPTCHA.
- `success` - Emitted when a CAPTCHA is successfully solved.
- `failure` - Emitted when a CAPTCHA is failed to be solved.
- `timeout` - Emitted when a user does not solve the CAPTCHA in time.

All of these events are emitted by the `Captcha` class. Here's an example of how to use them:

```js
captcha.on("success", data => {
    console.log(`A Member has Solved a CAPTCHA!`);
    console.log(data);
});
```

# What do the CAPTCHAs look like?
Below is an image of what answering a CAPTCHA will look like when using the default settings:

![Image of Captcha](https://github.com/WillTDA/Discord.js-Captcha/blob/master/src/images/captchaExample.jpg?raw=true)

## Contact Me

- 👋 Need Help? [Join Our Discord Server](https://discord.gg/P2g24jp)!

- 👾 Found a Bug? [Open an Issue](https://github.com/WillTDA/Discord.js-Captcha/issues), or Fork and [Submit a Pull Request](https://github.com/WillTDA/Discord.js-Captcha/pulls) on our [GitHub Repository](https://github.com/WillTDA/Discord.js-Captcha)!
