

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

client.login(token);

function welcomeDM(member) {
  const l1 = 'Welcome to Gay Men Meditating.';
  const l2 = 'You have been verified but please go to #roles to set your age band.';
  const l3 = 'NSFW channels are not visible to you unless you choose the 18+ age role.';
  const l4 = 'Roles are set by clicking on the appropriate emoji with the number beside it under each question.';
  const l5 = 'Please also look at the following channels:';
  const l6 = '1. Welcome: for an overview.';
  const l7 = '2. Etiquette: to review the rules.';
  const l8 = '4. Member Introductions: to introduce yourself to the community (optional).';
  const l9 = '5. Sitting times: to read what times other members sit online so that you can join them.' +
    '\nTo protect your privacy, the message your wrote to request admission will have been deleted. You can ' +
    'introduce yourself to the group in member-introductions if you wish';
  member.send(`${l1}\n\n${l2}\n${l3}\n${l4}\n\n${l5}\n${l6}\n${l7}\n${l8}\n${l9}\n`).catch(err => console.log(err));
}


let newcomer_report = '';

async function newcomers() {

  newcomer_report = '';

  newcomer_report = newcomer_report + '\n' + '__Newcomers reminder and exclusion.__\n';

  const guild = client.guilds.cache.get('827888294100074516');

  const init = new Date('2021-08-17T12:00:00+06:00');

  await guild.members.fetch().then(members => {

    const mods = client.channels.cache.get('837570108745580574');

    const newcomer = guild.roles.cache.find(rolen => rolen.name === 'newcomer');
    const newcomer_muted = guild.roles.cache.find(rolen => rolen.name === 'newcomer-muted');
    const newcomer_reminded = guild.roles.cache.find(rolen => rolen.name === 'newcomer-reminded');
    const newcomer_kicked = guild.roles.cache.find(rolen => rolen.name === 'newcomer-kicked');

    for (const member of members) {

      if (member[1].user.username === 'marq_andrew' || true) {

        if (!member[1].roles.cache.some(rolen => rolen.name === 'verified')) {

          if (!member[1].roles.cache.some(rolen => rolen.name === 'newcomer')) {
            member[1].roles.add(newcomer).catch(err => console.log(err));
          }

          let spoke = '';

          if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer-spoke')) {
            spoke = ' *';
          }

          let muted = '';

          if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer-muted')) {
            muted = ' +';
          }

          let joined = member[1].joinedTimestamp;

          if (joined < init) {
            joined = init;
          }

          currenttime = new Date();
          const joinelapsed = new Date(currenttime - joined) / (24 * 60 * 60 * 1000);

          if (joinelapsed > 7) {
            newcomer_report = newcomer_report + '\n' + member[1].user.username + ' --> kicked : ' + joinelapsed.toFixed(1) + ' days.' + spoke + muted;
            if (!member[1].roles.cache.some(rolen => rolen.name === 'newcomer-kicked')) {
              member[1].roles.add(newcomer_kicked).catch(err => console.log(err));
              mods.send(`@${member[1].user.username} has been removed (7 days after joining).`);
            }
            member[1].kick('Entry requirements unsatisfied after 7 days').catch(err => console.log(err));
          }
          else if (joinelapsed > 2) {
            newcomer_report = newcomer_report + '\n' + member[1].user.username + ' --> reminded : ' + joinelapsed.toFixed(1) + ' days.' + spoke + muted;
            if (!member[1].roles.cache.some(rolen => rolen.name === 'newcomer-reminded')) {
              member[1].roles.add(newcomer_reminded).catch(err => console.log(err));
              member[1].send('__Welcome to the Gay Men Meditating Discord.__\n\n' +
                'To gain full access, you must send a message mentioning @moderator in the #landing-zone channel ' +
                'or to a moderator directly. You must include:\n\n' +
                '**1. Something about yourself** e.g. your age, your country etc..\n' +
                '**2. Your experience with meditation if any** (none is fine as long as your are interested).\n' +
                '**3. Why you want to join this group.**\n\n' +
                'We have strong entry requirements to keep the community safe and comfortable to express themselves ' +
                'and to exclude people who join casually or simply to abuse. After 7 days from the time you joined, ' +
                'if you have not satisfied the entry requirements, you will be removed.').catch(err => console.log(err));
              mods.send(`@${member[1].user.username} has been reminded of the entry requirements (2 days after joining).`);
            }
          }
          else {
            newcomer_report = newcomer_report + '\n' + member[1].user.username + ' --> waiting : ' + joinelapsed.toFixed(1) + ' days.' + spoke + muted;
            if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer-reminded')) {
              member[1].roles.remove(newcomer_reminded).catch(err => console.log(err));
            }
            if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer-kicked')) {
              member[1].roles.remove(newcomer_kicked).catch(err => console.log(err));
            }
          }
        }
        else {
          if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer')) {
            member[1].roles.remove(newcomer).catch(err => console.log(err));
          }
          if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer-muted')) {
            member[1].roles.remove(newcomer_muted).catch(err => console.log(err));
          }
          if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer-reminded')) {
            member[1].roles.remove(newcomer_reminded).catch(err => console.log(err));
          }
          if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer-kicked')) {
            member[1].roles.remove(newcomer_kicked).catch(err => console.log(err));
          }
          if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer-spoke')) {
            member[1].roles.remove(newcomer_kicked).catch(err => console.log(err));
          }
        }
      }
    }
  })
    .catch(err => console.log(err));

  newcomer_report = newcomer_report + '\n\n* Indicates that the member wrote a message in #landing-zone.';
  newcomer_report = newcomer_report + '\n+ Indicates that the member is muted.';

  console.log(newcomer_report);


  console.log('\nLanding zone message cleanup.');
  console.log('----------------------------.');

  const landing_zone = client.channels.cache.get('851056727419256902');

  landing_zone.messages.fetch({ limit: 100 }).then(async messages => {
    messages.forEach(message => {
      if (!message.pinned) {

        currenttime = new Date();
        const age = new Date(currenttime - message.createdTimestamp) / (24 * 60 * 60 * 1000);

        if (age > 3) {
          console.log('Message is more than 3 days old - delete message.');
          message.delete().catch(err => console.log(err));
        }

        const author = message.author.id;
        const mention = message.mentions.users.first();

        message.guild.members.fetch(author).then(async member => {
          if (member.roles.cache.some(rolen => rolen.name === 'moderator')) {
            console.log('Message is from a moderator - check mentions.');
            if (mention) {
              message.guild.members.fetch(mention).then(async mention => {
                if (mention.roles.cache.some(rolen => rolen.name === 'moderator')) {
                  console.log('Mention is of a moderator - weird but wait.');
                }
                else if (mention.roles.cache.some(rolen => rolen.name === 'verified')) {
                  console.log('Mention is of a verified member - delete message.');
                  message.delete().catch(err => console.log(err));
                }
                else {
                  console.log('Mention is of an unverified newcomer - wait.');
                }
              })
                .catch(async err => {
                  console.log('Mention is not a member - delete message.');
                  message.delete().catch(err => console.log(err));
                });
            }
          }
          else if (member.roles.cache.some(rolen => rolen.name === 'verified')) {
            console.log('Message is from a verified member - delete message.');
            message.delete().catch(err => console.log(err));
          }
          else {
            console.log('Message is from an unverified newcomer - wait.');
          }
        })
          .catch(async err => {
            console.log('Author is not a member - delete message.');
            message.delete().catch(err => console.log(err));
          });
      }
    });
  });
}


let bumptime = 0;
let nextbumptime = 0;
let currenttime = 0;

client.once('ready', async () => {
  console.log('Ready!');

  const botcom = client.channels.cache.get('834013095805452318');

  botcom.messages.fetch({ limit: 100 }).then(messages => {
    messages.forEach(message => {
      if (message.embeds[0] && message.author.id === '302050872383242240') {
        if ((message.embeds[0].description.includes(':thumbsup:')
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
    if (nextbumptime > 0) {
      console.log('DISBOARD reminder active: waiting for ' + nextbumptime);
      if (currenttime > nextbumptime) {
        botcom.send('Time to bump DISBOARD (!d bump).');
        console.log('DISBOARD reminder sent. Waiting for a bump.');
        nextbumptime = 0;
      }
    }
  }, checkthe_interval);


  const guild = client.guilds.cache.get('827888294100074516');

  const mod_allow = { id: '836489212625682462', type: 'ROLE', permission: true, };

  const everyone_deny = { id: guild.roles.everyone.id, type: 'ROLE', permission: false, };

  const everyone_allow = { id: guild.roles.everyone.id, type: 'ROLE', permission: true, };


  let commands = await guild.commands.fetch();

  await commands.forEach(command => {
    console.log(`Setting command permissions on ${command.id} ${command.name}`);
    if (command.name === 'verify') {
      guild.commands.permissions.set({ command: command.id, permissions: [everyone_deny, mod_allow] });
    }
    else {
      guild.commands.permissions.set({ command: command.id, permissions: [everyone_allow] });
    }
  });


  checkminutes = 120;
  checkthe_interval = checkminutes * 60 * 1000;

  newcomers();

  setInterval(newcomers, checkthe_interval);

});



client.on('interactionCreate', async interaction => {

  //console.log(interaction);

  if (interaction.isCommand()) {

    if (interaction.commandName === 'avatar') {

      const username = interaction.options.getUser('username');

      if (!username) {
        const embed = new MessageEmbed()
          .setTitle(interaction.user.tag)
          .setColor(0x00ffff)
          .setImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));

        const messageId = await interaction.reply({ embeds: [embed] });
      }
      else {
        const embed = new MessageEmbed()
          .setTitle(username.username)
          .setColor(0x00ffff)
          .setImage(username.displayAvatarURL({ format: 'png', size: 2048 }));

        const messageId = await interaction.reply({ embeds: [embed] });
      }
    }
    else if (interaction.commandName === 'verify') {

      if (interaction.member.roles.cache.some(rolen => rolen.name === 'moderator')) {

        const username = interaction.options.getUser('username');

        const member = interaction.guild.members.cache.get(username.id);

        if (!member) {
          interaction.reply(`@${username.username} isn't a member. Maybe they left? :sob:`)
        }
        else if (member.roles.cache.some(role => role.name === 'verified')) {
          interaction.reply(`Member @${username.username} is already verified. :confused:`);
        }
        else {
          let role = interaction.guild.roles.cache.find(rolen => rolen.name === 'verified');
          member.roles.add(role);
          role = interaction.guild.roles.cache.find(rolen => rolen.name === 'newcomer');
          member.roles.remove(role);

          interaction.reply(`Member @${username.username} has been verified. :partying_face:`);
          welcomeDM(member);
        }
      }
      else {
        interaction.reply('Sorry, only a moderator can verify. :cry:');
      }
    }
  }
});


client.on('messageCreate', async (message) => {

  if (message.channel.type === 'DM') {
    return;
  }

	console.log(message.channel.name);

	if(message.embeds[0]) {
		console.log(message.author.username + ': ');
		console.log(message.embeds[0]);
	}
	else {
		console.log(message.author.username + ': ' + message.content);
	}

  if (message.channel.name.includes('bot-commands')) {
    if (message.embeds[0] && message.author.id === '302050872383242240') {
      if (message.embeds[0].description.includes(':thumbsup:')
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

  mods.send({ embeds: [embed] });

});


const sessions = new Array();


client.on('voiceStateUpdate', (oldmember, newmember) => {

  //console.log(newmember);

	const logs = client.channels.cache.get('880223898413695046');

	const guild = client.guilds.cache.get('827888294100074516');

	if(oldmember.channelId) {

		const oldchannel = guild.channels.cache.get(oldmember.channelId);

		if(newmember.channelId != oldmember.channelId) {
			//console.log('session ended');
			const index = sessions.findIndex(session => (session.channelId === oldmember.channelId && session.userId === oldmember.id));

			if(index != -1) {
				sessions[index].end = new Date();
				sessions[index].session_duration = sessions[index].end - sessions[index].start;

				if(sessions[index].camera_on && !sessions[index].camera_off) {
					sessions[index].camera_off = new Date();
					sessions[index].camera_duration = sessions[index].camera_duration + (sessions[index].camera_off - sessions[index].camera_on);
				}

				if(sessions[index].streaming_on && !sessions[index].streaming_off) {
					sessions[index].streaming_off = new Date();
					sessions[index].streaming_duration = sessions[index].streaming_duration + (sessions[index].streaming_off - sessions[index].streaming_on);
				}
			}
		}

		if(oldchannel.members.size === 0) {
			let init = true;
			let title = '';
			const rows = new Array();

			for (let index = sessions.length - 1; index >= 0; index--) {
				if (sessions[index].channelId === oldmember.channelId) {

					if (init) {
						title = 'Voice session in ' + sessions[index].channel + ' has ended.\n';

						const cols = new Array();
						cols[0] = 'Member';
						cols[1] = 'Joined';
						cols[2] = 'Duration';
						cols[3] = 'Camera';
						cols[4] = '%';

						rows.push(cols);
						init = false;
					}

					const cols = new Array();
					cols[0] = sessions[index].username;
					cols[1] = sessions[index].start.toLocaleTimeString('en-US', { hour12: false });
					cols[2] = format(sessions[index].session_duration);
					cols[3] = format(sessions[index].camera_duration);
					cols[4] = (sessions[index].camera_duration / sessions[index].session_duration)
						.toLocaleString(undefined, { style: 'percent', minimumFractionDigits:2 });

					rows.push(cols);
					sessions.splice(index, 1);
				}
			}

			if(!init) {
				//console.log(rows);
				const tab = table(rows);
				logs.send('```' + title + tab + '```');
			}
		}
	}

	if(newmember.channelId) {

		const newchannel = guild.channels.cache.get(newmember.channelId);

		const user = client.users.cache.get(newmember.id);

		let username = 'Unknown';

		if (user) {
			username = user.tag;
		}

		if(newmember.channelId != oldmember.channelId) {

      //console.log('session started');

			const session = new Object();
			session.channelId = newmember.channelId;
			session.channel = newchannel.name;
			session.userId = newmember.id;
			session.username = username;
			session.start = new Date();
			session.end = null;

			if(newmember.selfVideo) {
				session.camera_on = session.start;
			}
			else {
				session.camera_on = null;
			}

			session.camera_off = null;

			if(newmember.streaming) {
				session.streaming_on = session.start;
			}
			else {
				session.streaming_on = null;
			}

			session.streaming_off = null;

			session.session_duration = 0;
			session.camera_duration = 0;
			session.streaming_duration = 0;

			sessions.unshift(session);
		}
		else {
			const index = sessions.findIndex(session => (session.channelId === newmember.channelId && session.userId === newmember.id));

			if(index != -1) {

				if(newmember.selfVideo && !oldmember.selfVideo) {
					sessions[index].camera_on = new Date();
				}
				else if(oldmember.selfVideo && !newmember.selfVideo) {
					sessions[index].camera_off = new Date();
					sessions[index].camera_duration = sessions[index].camera_duration + (sessions[index].camera_off - sessions[index].camera_on);
				}

				if(newmember.streaming && !oldmember.streaming) {
					sessions[index].streaming_on = new Date();
				}
				else if(oldmember.streaming && !newmember.streaming) {
					sessions[index].streaming_off = new Date();
					sessions[index].streaming_duration = sessions[index].streaming_duration + (sessions[index].streaming_off - sessions[index].streaming_on);
				}
			}
		}
	}

	// fs.writeFile('./sessions.txt', JSON.stringify(sessions, null, 4), { flag: 'a+' }, err => {
	// 	if (err) {
	// 		console.error(err);
	// 		return;
	// 	}
	// });

	//console.log(sessions);
});