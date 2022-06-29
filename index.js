const Discord = require("discord.js");

const TOKEN = "OTkwNjI3MzY2NzgwOTUyNjA3.GXxnim.b_wkcc8tPP5gud1dNiwKO0AwLdYpbDNaf9IOes"

const prefix = '!';

const fs = require('fs')

const { MessageEmbed } = require('discord.js')


const command = require('./command')

const client = new Discord.Client({
    allowedMentions: {
        Parse: ['user', 'roles'],
        repiledUser: true,
    },
    intents: [
        'DIRECT_MESSAGES',
        'GUILDS',
        'GUILD_BANS',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_MEMBERS',
        'GUILD_MESSAGES',
        'GUILD_WEBHOOKS',
        'GUILD_MEMBERS',
        "GUILD_PRESENCES"
        ],
});

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

}

client.on("ready", () => {
    console.log('Ticket Bot has Restarted Successful')


    client.user.setActivity(` Out for !help and !discord`, { type: "WATCHING" })
});



client.on('messageCreate', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commands = args.shift().toLowerCase();

    //message array var

    const messageArray = message.content.split(" ");
    const argument = messageArray.slice(1);
    const cmd = messageArray[0];

    //spliting 


    // test commands 

    if (commands === 'status') {
        message.channel.send(`System is Fine Made By United Development! `)
    }
    if (commands === 'discord') {
        message.channel.send(`Discord: https://discord.gg/NtewWRxShy Invite People!`)
    }
    const embed = new MessageEmbed()
        .setTitle('Command Help')
        .addFields(
            { name: 'Help', value: 'Sends command help.' },
            { name: 'Ticket', value: 'Creates a ticket.' }
        )
        .setTimestamp()
        .setColor('#080808')


    if (commands === 'help') {
        message.reply({ embeds: [embed] })
    }
});

//ban

command(client, 'ban', (message) => {
    const { member, mentions } = message

    const tag = `<@${member.id}>`

    if (
        member.permissions.has('BAN_MEMBERS')) {
        const target = mentions.users.first()
        if (target) {
            const targetMember = message.guild.members.cache.get(target.id)
            targetMember.ban()
            message.channel.send(`${targetMember} Has Been Banned`);
        } else {
            message.channel.send(`${tag} Please specify someone to ban!`)
        }
    } else {
        message.channel.send(
            `${tag} You do not have permission to use this command.`
        )
    }
});

command(client, 'kick', (message) => {
    const { member, mentions } = message

    const tag = `<@${member.id}>`

    if (
        member.permissions.has('KICK_MEMBERS')) {
        const target = mentions.users.first()
        if (target) {
            const targetMember = message.guild.members.cache.get(target.id)
            targetMember.kick()
            message.channel.send(`${targetMember} Has Been Kicked.`)
        } else {
            message.channel.send(`${tag} Please specify someone to kick.`)
        }
    } else {
        message.channel.send(
            `${tag} You do not have permission to use this command.`
        )
    }
});


command(client, 'ticket', async (message) => {

    const channel = await message.guild.channels.create(`ticket: ${message.author.tag}`);

    channel.setParent("990657542671720509");

    channel.permissionOverwrites.create(message.author, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: true,
    })
    channel.permissionOverwrites.create(message.author, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: true,
    });

    const reactionMessage = await channel.send("Thank you for contacting support!");

    try {
        await reactionMessage.react("⛔");
        await reactionMessage.react("🔒");
    } catch (err) {
        channel.send("Error sending emojis!");
        throw err;
    }

    const collector = reactionMessage.createReactionCollector(
        (reaction, user) => message.guild.members.cache.find((member) => member.id === user.id).hasPermission("ADMINISTRATOR"),
        { dispose: true }
    );

    collector.on("collect", (reaction, user) => {
        switch (reaction.emoji.name) {
            case "🔒":
                channel.permissionOverwrites.create(message.author, { SEND_MESSAGES: false, });
                break;
            case "⛔":
                channel.send("**Deleting this channel in 5 seconds!**");
                setTimeout(() => channel.delete(), 5000);
                break;
        }
    });

    message.channel
        .send(`We will be right with you! ${channel}`)
        .then((msg) => {
            setTimeout(() => msg.delete(), 7000);
            setTimeout(() => message.delete(), 3000);
        })
        .catch((err) => {
            throw err;
        });
});

client.login(process.env.TOKEN)