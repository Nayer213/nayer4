const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
const color = require("./color.json");
const superagent = require("superagent");

const cdseconds = 5;

bot.commands = new Discord.Collection();

bot.login(config.token);

fs.readdir("./cmds/", (err, files) => {
    if(err) console.log(error);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Aucunes commandes trouvés bb !")
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${f} Ok !`);
        bot.commands.set(props.help.name, props)
    })
})
bot.on("ready", async () => {
    console.log("(Flying City): Est en ligne !");
    bot.user.setActivity(`$help sur Flynig City`, {
        type: "WATCHING",
        url: "https://www.twitch.tv/pa_rayan"})
});
   
    bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
 
    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);
 
    let commandFile = bot.commands.get(command.slice(prefix.length));
    if(commandFile) commandFile.run(bot, message, args)
 
});
 
bot.on('guildMemberAdd', member => {

    let newEmbed = new Discord.RichEmbed()
    .setDescription(member.user.username + ' **Bienvenue dans la ville de :palm_tree: Flying City | GTA RP :palm_tree: ! Veuillez suivre les étapes présentes dans la #『📑』règlement à fin que vous puissiez récuperer et valider votre VISA.**')
    .setFooter(`Nous sommes désormais ` + member.guild.memberCount)
    .setColor('#ff9dbb')
    .setFooter(`Flying City`, bot.user.displayAvatarURL)
    member.guild.channels.get("699513673206726666").sendMessage(newEmbed)

    let myGuild = bot.guilds.get('698719834904592386')
    let memberCount = myGuild.memberCount;
    let memberCountChannel = myGuild.channels.get('699749201529012225')
    memberCountChannel.setName(`Membres: ` + memberCount)
 
})
 
bot.on("guildMemberRemove", member => {
    let removeEmbed = new Discord.RichEmbed()
    .setDescription(member.user.username + ' **Nous a malheureusement quitté, bonne continuation à lui :tired_face: **')
    .setFooter(`Nous sommes désormais ` + member.guild.memberCount)
    .setColor('#ffa500')
    .setFooter(`Flying City`, bot.user.displayAvatarURL)
    member.guild.channels.get("699515460701519952").sendMessage(removeEmbed)

    let myGuild = bot.guilds.get('698719834904592386')
    let memberCount = myGuild.memberCount;
    let memberCountChannel = myGuild.channels.get('699749201529012225')
    memberCountChannel.setName(`Membres: ` + memberCount)
 
})

bot.on("messageReactionAdd", (reaction, user) => {
    if(user.bot) return;
    const message = reaction.message;
    const member = message.guild.members.get(user.id)
    const STAFF = message.guild.roles.find(`name`, 'STAFF')
    const everyone = message.guild.roles.find(`name`, '@everyone')
 
    if(
        ["🎟️", "🔒"].includes(reaction.emoji.name)
    ) {
        switch(reaction.emoji.name) {
 
            case "🎟️":
 
            var TicketList = [
                "ticket-001",
                "ticket-002",
                "ticket-003"
            ]
 
            let result = Math.floor((Math.random() * TicketList.length))
 
            let categoryID = "699318920338735204";
 
            var bool = false;
 
            if(bool == true) return;
 
            message.guild.createChannel(TicketList[result], "text").then((createChan) => {
               
                createChan.setParent(categoryID).then((settedParent) => {
                    settedParent.overwritePermissions(everyone, {
                        "READ_MESSAGES": false
                    });
 
                    settedParent.overwritePermissions(member, {
                        "SEND_MESSAGES": true,
                        "ADD_REACTIONS": true,
                        "ATTACH_FILES": true,
                        "READ_MESSAGES": true,
                        "READ_MESSAGE_HISTORY": true
                    })
 
                    settedParent.overwritePermissions(STAFF, {
                        "READ_MESSAGES": true,
                        "MANAGE_MESSAGES": true
                    })
 
                    settedParent.overwritePermissions(member, {
                        "SEND_MESSAGES": true,
                        "ADD_REACTIONS": true,
                        "ATTACH_FILES": true,
                        "READ_MESSAGES": true,
                        "READ_MESSAGE_HISTORY": true
                    })
 
                    let embedTicketOpen = new Discord.RichEmbed()
                    .setTitle("Bonjour,")
                    .setColor("#cd3")
                    .setDescription("Dîtes vos question / message ici")
 
                    settedParent.send(embedTicketOpen).then( async msg => {
                        await msg.react("🔒")
                    })
                })
            })
 
            break;
 
            case "🔒":
 
            message.channel.send("**Le salon se fermera dans une 10 de secondes...**")
 
            setTimeout(() => {
                message.channel.delete()
            }, cdseconds * 1500)
 
            let embedTicketClose = new Discord.RichEmbed()
            .setTitle(`Le ticket ${message.channel.name} a été fermer`)
            .setColor("#cd3")
            .setFooter("Ticket Fermer Avertissement")
 
            let logChannel = message.guild.channels.find("name", "logs")
 
            logChannel.send(embedTicketClose)
            break;
        }
    }
})

bot.on("messageReactionAdd", (reaction, user) => {
    if(user.bot) return;
    var roleName = reaction.emoji.name;
    var role = reaction.message.guild.roles.find(role => role.name.toLocaleLowerCase() === roleName.toLocaleLowerCase())
    var member = reaction.message.guild.members.find(member => member.id === user.id)

    member.addRole(role.id)
    member.createDM().then(channel => {
        channel.send(`**Le Role ${role.name} à été ajouté avec succès.**`)
    });
})

bot.on("messageReactionRemove", (reaction, user) => {
    if(user.bot) return;
    var roleName = reaction.emoji.name;
    var role = reaction.message.guild.roles.find(role => role.name.toLocaleLowerCase() === roleName.toLocaleLowerCase())
    var member = reaction.message.guild.members.find(member => member.id === user.id)

    member.removeRole(role.id)
    member.createDM().then(channel => {
        channel.send(`**Le Role ${role.name} à été enlevé avec succès.**`)
    });
})