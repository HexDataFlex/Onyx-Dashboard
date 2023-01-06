const Discord = require("discord.js");
const { MessageEmbed, Collection } = require("discord.js");
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

// ———————————————[Starting]———————————————
console.log(chalk.blue(`
 ██████╗ ███╗   ██╗██╗   ██╗██╗  ██╗
██╔═══██╗████╗  ██║╚██╗ ██╔╝╚██╗██╔╝
██║   ██║██╔██╗ ██║ ╚████╔╝  ╚███╔╝ 
██║   ██║██║╚██╗██║  ╚██╔╝   ██╔██╗ 
╚██████╔╝██║ ╚████║   ██║   ██╔╝ ██╗
 ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝
       Developed by PXL#0016                                   
`));
console.log(chalk.bgWhite.red(" CORE ") + ` ✨ Booting up!`);

client.settings = new Enmap({
  name: "settings",
  dataDir: "./databases/settings",
});

// ———————————————[Global Variables]———————————————
client.commands = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();
client.config = require("./botconfig/main.json");
require("./handler")(client);

client.on("messageCreate", (message) => {

  if (!message.guild || message.author.bot) return;

  // Default settings
  client.settings.ensure(message.guild.id, {
    prefix: client.config.prefix,
    hellomsg: "Hello World!",
  });

  let { prefix, hellomsg } = client.settings.get(message.guild.id);
  let args = message.content.slice(prefix.length).trim().split(" ");
  let cmd = args.shift()?.toLowerCase();

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


client.on("ready", async () => {
  console.log(chalk.bgWhite.blue(" BOT ") + ` ✅ Bot online as ${client.user.tag}. `);
  await require("./dashboard/index.js")(client);
  console.log(chalk.bgWhite.red(" CORE ") + ` 🔋 Successfully booted up! `);
});

client.login(process.env.token || config.token);

// ———————————————[Error Handling]———————————————
process.on("unhandledRejection", (reason, p) => {
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(
     chalk.white("["),
     chalk.red.bold("AntiCrash"),
     chalk.white("]"),
     chalk.gray(" : "),
     chalk.white.bold("Unhandled Rejection/Catch")
  );
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(
     chalk.white("["),
     chalk.red.bold("AntiCrash"),
     chalk.white("]"),
     chalk.gray(" : "),
     chalk.white.bold("Uncaught Exception/Catch")
  );
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(
     chalk.white("["),
     chalk.red.bold("AntiCrash"),
     chalk.white("]"),
     chalk.gray(" : "),
     chalk.white.bold("Multiple Resolves")
  );
  console.log(chalk.gray("—————————————————————————————————"));
  console.log(type, promise, reason);
});
