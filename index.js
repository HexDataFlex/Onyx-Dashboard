const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require(`./config.json`);
const dash = require(`./dashboard/settings.json`);
const colors = require("colors");
const chalk = require("chalk");
const Enmap = require("enmap");
const client = new Discord.Client({
  shards: "auto",
  allowedMentions: {
    parse: [],
    repliedUser: false,
  },
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});

console.log(chalk.blue(`
 ██████╗ ███╗   ██╗██╗   ██╗██╗  ██╗
██╔═══██╗████╗  ██║╚██╗ ██╔╝╚██╗██╔╝
██║   ██║██╔██╗ ██║ ╚████╔╝  ╚███╔╝ 
██║   ██║██║╚██╗██║  ╚██╔╝   ██╔██╗ 
╚██████╔╝██║ ╚████║   ██║   ██╔╝ ██╗
 ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝
       Developed by PXL#4001                                   
`));
console.log(chalk.bgWhite.red(" CORE ") + ` ✨ Booting up!`);

client.settings = new Enmap({
  name: "settings",
  dataDir: "./databases/settings",
});

client.on("messageCreate", (message) => {
  if (!message.guild || message.author.bot) return;
  client.settings.ensure(message.guild.id, {
    prefix: config.prefix,
    hellomsg: "Hello World!",
  });
  //Get the settings
  let { prefix, hellomsg, roles } = client.settings.get(message.guild.id);
  //Get the arguments
  let args = message.content.slice(prefix.length).trim().split(" ");
  let cmd = args.shift()?.toLowerCase();
  //If there is a command, execute it
  if (cmd && cmd.length > 0 && message.content.startsWith(prefix)) {
    if (cmd == "prefix") {
      message
        .reply({ embeds: [new MessageEmbed().setDescription(`The current prefix for this guild is \`${prefix}\`.\n> *Change the prefix for this guild in the dashboard!*`)] })
        .catch(console.error);
      console.log(chalk.bgWhite.blue(" BOT ") + ` 🔎 ${message.author.tag} ran command prefix`);
    }
    if (cmd == "hello") {
      message.reply(hellomsg).catch(console.error);
      console.log(chalk.bgWhite.blue(" BOT ") + ` 🔎 ${message.author.tag} ran command hello`);
    }
  }
});

/**
 * @LOAD_THE_DASHBOARD - Loading the Dashbaord Module with the BotClient into it!
 */
client.on("ready", async () => {
  console.log(chalk.bgWhite.blue(" BOT ") + ` ✅ Bot online as ${client.user.tag}. `);
  await require("./dashboard/index.js")(client);
  console.log(chalk.bgWhite.red(" CORE ") + ` 🔋 Successfully booted up! `);
});

//Start the Bot
client.login(process.env.token || config.token);
