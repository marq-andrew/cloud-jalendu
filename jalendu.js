

const { Client, Intents, MessageEmbed } = require('discord.js');

const fs = require('fs');

const table = require('text-table');

const format = require('format-duration');

const querystring = require('querystring');

const token = process.env['TOKEN'];


const intents = new Intents();

intents.add(Intents.FLAGS.GUILDS);
intents.add(Intents.FLAGS.GUILD_MEMBERS);
intents.add(Intents.FLAGS.GUILD_BANS);
//intents.add(Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS);
//intents.add(Intents.FLAGS.GUILD_INTEGRATIONS);
//intents.add(Intents.FLAGS.GUILD_WEBHOOKS);
//intents.add(Intents.FLAGS.GUILD_INVITES);
intents.add(Intents.FLAGS.GUILD_VOICE_STATES);
//intents.add(Intents.FLAGS.GUILD_PRESENCES);
intents.add(Intents.FLAGS.GUILD_MESSAGES);
intents.add(Intents.FLAGS.GUILD_MESSAGE_REACTIONS);
//intents.add(Intents.FLAGS.GUILD_MESSAGE_TYPING);
intents.add(Intents.FLAGS.DIRECT_MESSAGES);
intents.add(Intents.FLAGS.DIRECT_MESSAGE_REACTIONS);
//intents.add(Intents.FLAGS.DIRECT_MESSAGE_TYPING);

const client = new Client({ intents: intents });


let bumptime = 0;
let nextbumptime = 0;
let currenttime = 0;

client.once('ready', () => {
  console.log('Ready!');

  const botcom = client.channels.cache.get('834013095805452318');

  botcom.messages.fetch({ limit: 100 }).then(messages => {
    messages.forEach(message => {
      if(message.embeds[0] && message.author.id === '302050872383242240') {
				if((message.embeds[0].description.includes(':thumbsup:')
					|| message.embeds[0].description.includes('timeout of'))
					&& bumptime === 0) {
          bumptime = message.createdAt;
          nextbumptime = new Date(bumptime.getTime() + 120 * 60000);
        }
      }
    });
  });

  let checkminutes = 10;
  let checkthe_interval = checkminutes * 60 * 1000;

  setInterval(function() {
    currenttime = new Date();
    if(nextbumptime > 0) {
      console.log('DISBOARD reminder active: waiting for ' + nextbumptime);
      if(currenttime > nextbumptime) {
        botcom.send('Time to bump DISBOARD (!d bump).');
        console.log('DISBOARD reminder sent. Waiting for a bump.');
        nextbumptime = 0;
      }
    }
  }, checkthe_interval);
  
});


client.login(token);


client.on('interactionCreate', async interaction => {

  console.log(interaction.options);

  if (interaction.isCommand()) {

    if (interaction.commandName === 'avatar') {

      const username = interaction.options.getUser('username');

      if(!username) {
				const embed = new MessageEmbed()
					.setTitle(interaction.user.tag)
					.setColor(0x00ffff)
          .setImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));

        const messageId = await interaction.reply({ embeds: [ embed ] });
      }
			else {
        const embed = new MessageEmbed()
          .setTitle(username.username)
          .setColor(0x00ffff)
          .setImage(username.displayAvatarURL({ format: 'png', size: 2048 }));

        const messageId = await interaction.reply({ embeds: [ embed ] });
			}
    }
  }
});


client.on('messageCreate', async (message) => {

  if(message.channel.name.includes('bot-commands')) {
		if(message.embeds[0] && message.author.id === '302050872383242240') {
			if(message.embeds[0].description.includes(':thumbsup:')
				|| message.embeds[0].description.includes('timeout of')) {
				bumptime = message.createdAt;
				nextbumptime = new Date(bumptime.getTime() + 120 * 60000);
				console.log('Detected DISBOARD bump @ ' + bumptime);

				const words = message.embeds[0].description.split(' ');

				const emoji = [':heart:', ':heart_exclamation:', ':heart_eyes:',
          ':smiling_face_with_3_hearts:',
					':kissing_heart:', ':kiss_mm:', ':kiss:', ':thumbsup:', ':santa:', ':clap:', ':couple_mm:',
					':rose:', ':medal:', ':rainbow:', ':eggplant:'];

				const rand = Math.floor(Math.random() * emoji.length);

				message.channel.send('Thanks ' + words[0] + ' ' + emoji[rand]);
			}
		}
	}
});


client.on('guildMemberAdd', async (member) => {
	const mods = client.channels.cache.get('837570108745580574');

	mods.send('New member @' + member.user.username + ' ID ' + member.user.id);

  const embed = new MessageEmbed()
    .setTitle(member.user.username)
    .setColor(0x00ffff)
    .setImage(member.user.displayAvatarURL({ format: 'png', size: 2048 }));

  const messageId = await interaction.reply({ embeds: [ embed ] });

});