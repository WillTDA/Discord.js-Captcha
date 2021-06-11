# Discord.js Captcha

A powerful package for discord.js that allows you to easily create CAPTCHAs for Discord Servers.

# Install Package

To install this awesome module, type the command shown below into your Terminal.

`npm i discord.js-captcha --save`

# Example Code

```js
const Discord = require("discord.js");
const client = new Discord.Client();

const { Captcha } = require("discord.js-captcha"); 

const captcha = new Captcha(client, {
    guildID: "Guild ID Here",
    roleID: "Role ID Here",
    channelID: "Text Channel ID Here", //optional
    sendToTextChannel: Boolean, //optional
});
 
client.on("guildMemberAdd", async member => {
    //in your bot application, make sure you have intents turned on!
    captcha.present(member);
});

client.login("Discord Bot Token")
```

### <u>What is the Parameter **channelID**?</u>
The ID of the Discord Text Channel to Send the CAPTCHA to if the user's Direct Messages are locked.

Use the parameter `sendToTextChannel`, and set it to `true` to always send the CAPTCHA to the Text Channel.

### <u>What is the Parameter **sendToTextChannel**?</u>
Whether you want the CAPTCHA to be sent to a specified Text Channel instead of Direct Messages, regardless of whether the user's DMs are locked.

Use the parameter `channelID` to specify the Text Channel.

# Need Help or Find any Bugs? Join Our Discord Server!

https://discord.gg/P2g24jp