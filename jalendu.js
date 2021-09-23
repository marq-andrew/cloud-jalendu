

const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

const fs = require('fs');

const table = require('text-table');

const format = require('format-duration');

const querystring = require('querystring');

var fetch = require('node-fetch');

var jalenduDb = require('./jalenduDb.js');

const jalendu = jalenduDb.setup();

var jautomod = require('./jautomod.js');

jautomod.setup();

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

const client = new Client({ intents: intents, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.login(token);

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);


function lastbumper() {
  var fileContent = fs.readFileSync('./bumpers.json');
  bumpers = JSON.parse(fileContent);

  var lastbumptime = '';
  var lastbumper = '';

  for (const [id, bumper] of Object.entries(bumpers)) {
    console.log(`${id}: ${bumper.name}`);
    if (bumper.lasttime > lastbumptime) {
      lastbumptime = bumper.lasttime;
      lastbumper = bumper.name;
    }
  }

  return lastbumper;
}

let newcomer_report = '';

async function newcomers() {

  newcomer_report = '';

  newcomer_report = newcomer_report + '\n' + '__Newcomers reminder and exclusion.__\n';

  const guild = client.guilds.cache.get('827888294100074516');

  const init = new Date('2021-08-17T12:00:00+06:00');

  await guild.members.fetch().then(members => {

    const mods = client.channels.cache.get('827889605994872863');

    const newcomer = guild.roles.cache.find(rolen => rolen.name === 'newcomer');
    const newcomer_muted = guild.roles.cache.find(rolen => rolen.name === 'newcomer-muted');
    const newcomer_reminded = guild.roles.cache.find(rolen => rolen.name === 'newcomer-reminded');
    const newcomer_kicked = guild.roles.cache.find(rolen => rolen.name === 'newcomer-kicked');
    const member_role = guild.roles.cache.find(rolen => rolen.name === 'member');

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

          let exmember = '';

          if (member[1].roles.cache.some(rolen => rolen.name === 'member')) {
            exmember = ' #';
          }

          let joined = member[1].joinedTimestamp;

          if (joined < init) {
            joined = init;
          }

          currenttime = new Date();
          const joinelapsed = new Date(currenttime - joined) / (24 * 60 * 60 * 1000);

          if (joinelapsed > 7) {
            newcomer_report = newcomer_report + '\n' + `${member[1].user}` + ' --> kicked : ' + joinelapsed.toFixed(1) + ' days.' + spoke + muted + exmember;
            if (!member[1].roles.cache.some(rolen => rolen.name === 'newcomer-kicked')) {
              member[1].roles.add(newcomer_kicked).catch(err => console.log(err));
              mods.send(`${member[1].user} has been removed (7 days after joining).`);
            }
            member[1].kick('Entry requirements unsatisfied after 7 days').catch(err => console.log(err));
          }
          else if (joinelapsed > 2) {
            newcomer_report = newcomer_report + '\n' + `${member[1].user}` + ' --> reminded : ' + joinelapsed.toFixed(1) + ' days.' + spoke + muted + exmember;
            if (!member[1].roles.cache.some(rolen => rolen.name === 'newcomer-reminded')) {
              member[1].roles.add(newcomer_reminded).catch(err => console.log(err));

              var fileContent = fs.readFileSync('./messages.json');
              messages = JSON.parse(fileContent);

              member[1].send(messages.reminder.content).catch(err => console.log(err));
              mods.send(`${member[1].user} has been reminded of the entry requirements (2 days after joining).`);
            }
          }
          else {
            newcomer_report = newcomer_report + '\n' + `${member[1].user}` + ' --> waiting : ' + joinelapsed.toFixed(1) + ' days.' + spoke + muted + exmember;
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
          if (!member[1].roles.cache.some(rolen => rolen.name === 'member')) {
            member[1].roles.add(member_role).catch(err => console.log(err));
          }
        }
      }
    }
  })
    .catch(err => console.log(err));

  newcomer_report = newcomer_report + '\n\n* Indicates that the member wrote a message in #landing-zone.';
  newcomer_report = newcomer_report + '\n+ Indicates that the member is muted.';
  newcomer_report = newcomer_report + '\n# Indicates that the member was previously a verified member.';

  console.log(newcomer_report);

  jautomod.message_cleanup(client);

  const roles = client.channels.cache.get('828724253938942014');

  await roles.messages.fetch({ limit: 100 }).then(async messages => {
    messages.forEach(message => {
      let title = '';
      if (message.content) {
        title = message.content.toLowerCase().substring(0, 20);
      }
      if (message.embeds[0]) {
        title = message.embeds[0].title.toLowerCase().substring(0, 20);
      }
      //console.log(title);
      if (message.reactions) {
        message.reactions.cache.each(async (reaction) => {
          //console.log(reaction.emoji.name);
          if (title === 'do you use insight t') {
            if (reaction.emoji.name !== '⏲️') {
              reaction.remove();
            }
          }
          else if (title === 'what is your age?') {
            if (reaction.emoji.name !== '👦'
              && reaction.emoji.name !== '👨') {
              reaction.remove();
            }
          }
          else if (title === 'do you identify as g') {
            if (reaction.emoji.name !== 'gay_flag'
              && reaction.emoji.name !== 'bi_flag'
              && reaction.emoji.name !== 'bi_curious_flag') {
              reaction.remove();
            }
          }
          else if (title === 'memes') {
            if (reaction.emoji.name !== 'memes') {
              reaction.remove();
            }
          }
          else if (title === 'practice') {
            if (reaction.emoji.name !== 'lotus_meditator'
              && reaction.emoji.name !== 'yoga') {
              reaction.remove();
            }
          }
        });
      }
    });
  });
}


async function channels(roleId, outputChannelId) {

  fileContent = fs.readFileSync('./vc_channels.json');
  const vc_channels = JSON.parse(fileContent);

  const guild = client.guilds.cache.get('827888294100074516');

  let categories = await guild.channels.cache.filter(channel => channel.type === 'GUILD_CATEGORY');

  const sections = [];

  await categories.forEach(category => {

    const section = new Object();

    section.title = category.name.toUpperCase();
    section.order = category.rawPosition;
    section.channels = [];

    let channels = guild.channels.cache.filter(channel => channel.parentId === category.id);

    channels.forEach(channel => {
      const role = guild.roles.cache.get(roleId)
      const roleperm = channel.permissionsFor(role);

      if (roleperm.serialize().VIEW_CHANNEL) {

        const item = new Object();

        if (channel.type === 'GUILD_TEXT') {
          item.name = '#' + channel.name;
          item.topic = channel.topic;
        }
        else {
          item.name = channel.name;
          item.topic = vc_channels[channel.name];
        }

        item.order = channel.rawPosition;


        if (section.channels.length === 0) {
          section.channels.push(item);
        }
        else {
          let splice = 0;
          while (section.channels[splice].order < item.order) {
            splice = splice + 1
            if (splice === section.channels.length) {
              break;
            }
          }
          section.channels.splice(splice, 0, item);
        }
      }
    });

    if (sections.length === 0) {
      sections.push(section);
    }
    else {
      let splice = 0;
      while (sections[splice].order < section.order) {
        splice = splice + 1
        if (splice === sections.length) {
          break;
        }
      }
      sections.splice(splice, 0, section);
    }
  });

  const output = client.channels.cache.get(outputChannelId);

  const fetched = await output.messages.fetch({ limit: 100 });

  if (fetched.size > 0) {
    output.bulkDelete(fetched.size);
  }

  let content = '**Channels Directory**\n\n';
  let newcontent = '';

  for (let i = 0; i < sections.length; i++) {
    if (sections[i].channels.length > 0) {
      newcontent = '**' + sections[i].title + '**\n\n\u200B';
      if ((content + newcontent).length > 2000) {
        output.send(content);
        content = '';
      }
      content = content + newcontent;
    }

    for (let j = 0; j < sections[i].channels.length; j++) {
      newcontent = sections[i].channels[j].name + ' : ' + sections[i].channels[j].topic + '\n\n\u200B';
      if ((content + newcontent).length > 2000) {
        output.send(content);
        content = '';
      }
      content = content + newcontent;
    }
  }

  output.send(content);
}


let bumptime = 0;
let nextbumptime = 0;
let currenttime = 0;

client.once('ready', async () => {
  console.log('Ready!');

  client.user.setUsername('Jalendu');

  client.user.setActivity();
  client.user.setStatus(':rainbow_flag: monitoring');

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


  const guildId = '827888294100074516';

  const guild = client.guilds.cache.get(guildId);

  const mod_allow = { id: '836489212625682462', type: 'ROLE', permission: true, };

  const everyone_deny = { id: guild.roles.everyone.id, type: 'ROLE', permission: false, };

  const everyone_allow = { id: guild.roles.everyone.id, type: 'ROLE', permission: true, };


  commands = await client.application.commands.fetch();

  await commands.forEach(command => {
    console.log(`Setting application command permissions on ${command.id} ${command.name}`);
    if (command.name === 'moderate') {
      command.permissions.set({
        guild: guildId,
        command: command.id,
        permissions: [everyone_deny, mod_allow]
      });
    }
    else {
      command.permissions.set({
        guild: guildId,
        command: command.id,
        permissions: [everyone_allow]
      });
    }
  });


  checkminutes = 120;
  checkthe_interval = checkminutes * 60 * 1000;

  newcomers();

  setInterval(newcomers, checkthe_interval);

});


// client.on("channelUpdate", function(oldChannel, newChannel) {
//   channels('836590097318019092', '887168812632391740');
//   channels('828732299390353448', '887168976742912001');
// });



client.on('interactionCreate', async interaction => {

  if (interaction.isCommand()) {

    if (interaction.commandName === 'avatar') {

      const username = interaction.options.getUser('username');

      if (!username) {
        const embed = new MessageEmbed()
          .setTitle(interaction.user.username)
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
    else if (interaction.commandName === 'moderate') {

      if (interaction.member.roles.cache.some(rolen => rolen.name === 'moderator')) {

        const command = interaction.options.getString('command');
        const username = interaction.options.getUser('username');

        const member = interaction.guild.members.cache.get(username.id);

        //let test = 'test_';
        let test = '';

        if (test === '') {
          mods = client.channels.cache.get('827889605994872863');
        }
        else {
          mods = client.channels.cache.get('827889605994872863');
        }

        const marq = client.users.cache.get('679465390841135126');

        if (!member) {
          interaction.reply({ content: `${username} isn't a member. Maybe they left? :sob:`, ephemeral: true });
        }
        else if (command === 'verify') {

          if (member.roles.cache.some(role => role.name === `${test}verified`)) {
            interaction.reply({ content: `Member ${username} is already verified. :confused:`, ephemeral: true });
          }
          else {
            let role = interaction.guild.roles.cache.find(rolen => rolen.name === `${test}verified`);
            member.roles.add(role);
            role = interaction.guild.roles.cache.find(rolen => rolen.name === `${test}newcomer`);
            member.roles.remove(role);

            interaction.reply({ content: `Member ${username} has been verified. :partying_face:`, ephemeral: true });

            mods.send(`Member ${username} has been verified by ${interaction.user}.`);

            jautomod.welcomeDM(member, client);

            jautomod.message_cleanup(client);
          }
        }
        else if (command === 'unverify') {
          let role = interaction.guild.roles.cache.find(rolen => rolen.name === `${test}verified`);
          member.roles.remove(role);
          role = interaction.guild.roles.cache.find(rolen => rolen.name === `${test}newcomer`);
          member.roles.add(role);

          interaction.reply({ content: `Member ${username} has been unverified. :unamused:`, ephemeral: true });

          mods.send(`Member ${username} has been unverified by ${interaction.user}.`);
        }
        else if (command === 'mute') {
          if (!member.roles.cache.some(role => role.name === `${test}newcomer`)) {
            interaction.reply({ content: `Member ${username} is not a newcomer. :confused:`, ephemeral: true });
          }
          else {
            let role = interaction.guild.roles.cache.find(rolen => rolen.name === `${test}newcomer-muted`);
            member.roles.add(role);

            interaction.reply({ content: `Member ${username} has been muted. :zipper_mouth:`, ephemeral: true });

            mods.send(`Member ${username} has been muted by ${interaction.user}.`);
          }
        }
        else if (command === 'unmute') {
          if (!member.roles.cache.some(role => role.name === `${test}newcomer`)) {
            interaction.reply({ content: `Member ${username} is not a newcomer. :confused:`, ephemeral: true });
          }
          else {
            let role = interaction.guild.roles.cache.find(rolen => rolen.name === `${test}newcomer-muted`);
            member.roles.remove(role);

            interaction.reply({ content: `Member ${username} has been unmuted. :open_mouth:`, ephemeral: true });

            mods.send(`Member ${username} has been unmuted by ${interaction.user}.`);
          }
        }
        else if (command === 'kick') {
          if (!member.kickable) {
            interaction.reply({ content: `Member ${username} is not kickable. :confused:`, ephemeral: true });
          }
          else {
            member.kick()
              .then(member => {
                interaction.reply({ content: `Member ${username} has been kicked. :dancer:`, ephemeral: true });

                mods.send(`Member ${username} has been kicked by ${interaction.user}.`);
              })
              .catch(err => {
                interaction.reply({ content: `Failed to kick ${username}. :confused:`, ephemeral: true });
              });
          }
        }
        else if (command === 'ban') {
          if (!member.bannable) {
            interaction.reply({ content: `Member ${username} is not bannable. :confused:`, ephemeral: true });
          }
          else {
            member.ban({ days: 7 })
              .then(member => {
                interaction.reply({ content: `Member ${username} has been banned. :no_entry_sign:`, ephemeral: true });

                mods.send(`Member ${username} has been banned by ${interaction.user}.`);
              })
              .catch(err => {
                interaction.reply({ content: `Failed to ban ${username}. :confused:`, ephemeral: true });
              });
          }
        }
        else if (command === 'agelock') {
          if (member.roles.cache.some(role => role.name === `moderatorx`)) {
            interaction.reply({ content: `You can't age lock a moderator. :confused:`, ephemeral: true });
          }
          else {
            var fileContent = fs.readFileSync('./agelock.json');
            agelock = JSON.parse(fileContent);

            if (!agelock[username.id]) {
              const newagelock = new Object();
              newagelock.username = username.tag;
              newagelock.lockedbyid = interaction.user.id;
              newagelock.lockedbyname = interaction.user.tag;
              newagelock.lockdate = new Date();
              newagelock.months = 12;
              newagelock.expires = new Date();
              newagelock.expires.setMonth(newagelock.expires.getMonth() + newagelock.months);
              newagelock.notified = false;
              agelock[username.id] = newagelock;

              interaction.reply({ content: `Member ${username} has been age locked until ${agelock[username.id].expires.toISOString().split('T')[0]} :baby_chick:`, ephemeral: true });

              mods.send(`Member ${username} has been age locked by ${interaction.user}.`);
            }
            else {
              interaction.reply({ content: `Member ${username} is already age locked (until ${agelock[username.id].expires.split('T')[0]}) :confused:`, ephemeral: true });
            }

            let role = interaction.guild.roles.cache.find(rolen => rolen.name === `Age 18 +`);
            member.roles.remove(role);

            fs.writeFileSync('./agelock.json', JSON.stringify(agelock, null, 2), 'utf-8');
          }
        }
        else if (command === 'ageunlock') {
          var fileContent = fs.readFileSync('./agelock.json');
          agelock = JSON.parse(fileContent);

          if (agelock[username.id]) {
            delete agelock[username.id];

            interaction.reply({ content: `Member ${username} has been age unlocked. :chicken:`, ephemeral: true });

            mods.send(`Member ${username} has been age unlocked by ${interaction.user}.`);
          }
          else {
            interaction.reply({ content: `Member ${username} isn't age locked. :confused:`, ephemeral: true });
          }

          fs.writeFileSync('./agelock.json', JSON.stringify(agelock, null, 2), 'utf-8');
        }
        else {
          interaction.reply({ content: `${command}: ${username} Sorry, not implemented yet - working on it.`, ephemeral: true });
        }
      }
      else {
        interaction.reply({ content: 'Sorry, only a moderators can use moderate commands. :cry:', ephemeral: true });
      }
    }
    else if (interaction.commandName === 'joke') {

      const term = interaction.options.getString('term');

      const options = {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
      };

      var url = `https://icanhazdadjoke.com/`;

      if (term) {
        const query = querystring.stringify({ term: term });
        url = `https://icanhazdadjoke.com/search?${query}`;
      }

      result = await fetch(url, options)
        .then(response => response.text())
        .catch((err) => console.log(err));

      const joke = await JSON.parse(result);

      if (joke.joke) {
        interaction.reply(joke.joke);
      }
      else if (joke.results) {
        const rand = Math.floor(Math.random() * joke.results.length);
        interaction.reply(joke.results[rand].joke);
      }
    }
    else if (interaction.commandName === 'define') {

      const term = interaction.options.getString('term');
      const result_type = interaction.options.getString('result');

      const query = querystring.stringify({ term: term });

      const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`)
        .then(response => response.json())
        .catch(err => console.log(err));

      if (!list.length) {
        return interaction.reply(`No results found for **${term}**.`);
      }
      else {
        let select = 1;

        if (result_type === 'all') {
          select = 0;
        }
        else if (result_type === 'random') {
          select = Math.floor(Math.random() * list.length);
        }

        const embeds = [];

        for (let i = 0; i < list.length; i++) {

          if (select === 0 || i === (select - 1)) {

            const embed = new MessageEmbed()
              .setColor('RANDOM')
              .setTitle(list[i].word)
              .setURL(list[i].permalink)
              .addFields(
                { name: 'Definition', value: trim(list[i].definition, 1024) },
                { name: 'Example', value: trim(list[i].example, 1024) },
                { name: 'Rating', value: `${list[i].thumbs_up} thumbs up. ${list[i].thumbs_down} thumbs down.` },
              );

            embeds.push(embed);
          }
        }

        await interaction.reply({ embeds: embeds }).catch(console.error);
      }
    }
    else if (interaction.commandName === 'readme') {

      await interaction.reply('Jalendu bot help will be sent to you as a direct message.').catch(console.error);

      readmeraw = fs.readFileSync('./jalendu_readme.txt').toString();

      sections = readmeraw.split('\n');

      split = '';

      for (let i = 0; i < sections.length; i++) {
        if ((split + sections[i]).length > 2000) {
          interaction.user.send('\u200B\n' + split);
          split = sections[i];
        }
        else {
          split = split + '\n' + sections[i];
        }
      }
      interaction.user.send('\u200B\n' + split);
    }
  }
});


client.on('messageCreate', async (message) => {

  if (message.author.bot) {
  }

  if (message.author.bot && message.type === 'CHANNEL_PINNED_MESSAGE') {
    message.delete();
  }

  if (message.channel.type === 'DM') {
    jalenduDb.message(jalendu, message);
  }
  else {

    if (message.mentions) {
      if (message.mentions.members.first()) {
        if (message.mentions.members.first().user.username === 'Jalendu') {
          jalenduDb.message(jalendu, message);
        }
      }
    }

    console.log(message.channel.name);

    if (message.embeds[0]) {
      console.log(message.author.username + ': ');
      console.log(message.embeds[0]);
    }
    else {
      console.log(message.author.username + ': ' + message.content);
    }

    if (message.channel.name.includes('bot-commands')) {

      if (message.content.toLowerCase() === '!d bump') {

        var fileContent = fs.readFileSync('./bumpers.json');
        bumpers = JSON.parse(fileContent);

        if (bumpers[message.author.id]) {
          bumpers[message.author.id].count = bumpers[message.author.id].count + 1;
          bumpers[message.author.id].lasttime = new Date();
        }
        else {
          const newbumper = new Object();

          newbumper.name = message.author.username; newbumper.count = 1;
          newbumper.lasttime = new Date();

          bumpers[message.author.id] = newbumper;
        }

        fs.writeFileSync('./bumpers.json', JSON.stringify(bumpers, null, 2), 'utf-8');
      }

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

          message.channel.send('Thanks ' + lastbumper() + ' ' + emoji[rand]);
        }
      }
    }

    if (message.content === '/welcome') {
      if (message.member.roles.cache.some(rolen => rolen.name === 'moderator')) {
        const embed = new MessageEmbed()
          .setTitle('Welcome to Gay+ Men Meditating!')
          .setColor('0xBC002D')
          .addField('\u200B', 'This server contains various channels for discussion and online practice of meditation and yoga for gay+ (gay, bisexual and bi-curious) men.')
          .addField('\u200B', '\nIn order to gain access, please respond using complete sentences ' +
            'to the following questions:')
          .addField('\u200B', '**1. Tell us about yourself.' +
            '\n2. Describe your experience with meditation and/or yoga, if any.' +
            '\n3. Why do you want to join this group?' +
            '\n4. Include @moderator in your message so we will be notified of your response.* **')
          .setFooter('\u200B\n*You may directly message a moderator with your responses if you prefer. ' +
            'A moderator will review your responses as soon as possible and determine whether to grant you access. ' +
            '\nCaution: This channel is auto-moderated so please keep your answers brief, proper-cased and free of links or any terms of abuse.');

        const landing_zone = client.channels.cache.get('851056727419256902');

        const fetched = await landing_zone.messages.fetch({ limit: 100 });

        if (fetched.size > 0) {
          landing_zone.bulkDelete(fetched.size);
        }

        console.log(embed);

        landing_zone.send({ embeds: [embed] })
          .then((msg) => {
            msg.pin();

          })
          .catch(console.error);
      }
    }
    else if (message.content.startsWith('/dm')) {
      let item = message.content.split(' ')[1].toLowerCase();
      if (item === 'welcomedm') {
        jautomod.welcomeDM(message.member, message.client, true);
      }
      else {
        var fileContent = fs.readFileSync('./messages.json');
        messages = JSON.parse(fileContent);

        if (messages[item]) {
          message.member.send(messages[item].content).catch(err => console.log(err));
          message.reply(`message item "${item}" sent to you as a direct message.`).catch(err => console.log(err));
        }
        else {
          message.reply(`message item "${item}" doesn't exist.`).catch(err => console.log(err));
        }
      }
    }
    else if (message.content.startsWith('/newcomer')) {
      message.channel.send(newcomer_report);
    }
    else if (message.content.startsWith('/mclear')) {
      if (message.member.roles.cache.some(rolen => rolen.name === 'moderator')) {
        let num = 2;

        const args = message.content.split(' ');

        if (args[1]) {
          num = parseInt(args[1]) + 1;
        }

        message.channel.bulkDelete(num);
      }
    }
    else if (message.content.startsWith('/channel')) {
      channels('836590097318019092', '887168812632391740');
      channels('828732299390353448', '887168976742912001');
    }
    else if (message.content.startsWith('/test')) {
      result = jautomod.test(jautomod.msglc(message));
      message.channel.send(`${result.type}: ${result.rule}`);
    }
    else if (message.content.startsWith('/setup')) {
      await jautomod.setup();
    }
    else if (message.content.startsWith('/maint')) {

      console.log(lastbumper());
    }
    else if (message.content.startsWith('/datacheck')) {
      if (message.member.roles.cache.some(rolen => rolen.name === 'moderator')) {
        jautomod.datacheck(message);
      }
    }
    else if (message.content.startsWith('/bumpers')) {
      var fileContent = fs.readFileSync('./bumpers.json');
      bumpers = JSON.parse(fileContent);
      message.reply(JSON.stringify(bumpers, null, 2) +`\n\nLast bumper is ${lastbumper()}`);
    }
    else if (message.content.startsWith('/agelocks')) {
      if (message.member.roles.cache.some(rolen => rolen.name === 'moderator')) {
        var fileContent = fs.readFileSync('./agelock.json');
        agelocks = JSON.parse(fileContent);
        message.reply(JSON.stringify(agelocks, null, 2));
      }
    }
    else if (message.content.startsWith('/cleanup')) {
      jautomod.message_cleanup(message.client);
    }

    if (message.channel.name === 'landing-zone') {
      jautomod.automod(message);
    }
  }
});


client.on('guildMemberAdd', async (member) => {
  const mods = client.channels.cache.get('827889605994872863');

  mods.send(`New member ${member.user} ID ${member.user.id}`);

  if (member.roles.cache.some(rolen => rolen.name === 'member')) {
    mods.send(`New member ${member.user} was previously a verified member.`);
  }

  const embed = new MessageEmbed()
    .setTitle(member.user.username)
    .setColor(0x00ffff)
    .setImage(member.user.displayAvatarURL({ format: 'png', size: 2048 }));

  mods.send({ embeds: [embed] });

});


client.on("guildMemberRemove", member => {
  const mods = client.channels.cache.get('827889605994872863');

  mods.send(`Member ${member.user} ID ${member.user.id} has left the server.`);

  jautomod.message_cleanup(client);
});


const sessions = new Array();

client.on('voiceStateUpdate', (oldmember, newmember) => {

  //console.log(newmember);

  const logs = client.channels.cache.get('880223898413695046');

  const guild = client.guilds.cache.get('827888294100074516');

  if (oldmember.channelId) {

    const oldchannel = guild.channels.cache.get(oldmember.channelId);

    if (newmember.channelId != oldmember.channelId) {
      //console.log('session ended');
      const index = sessions.findIndex(session => (session.channelId === oldmember.channelId && session.userId === oldmember.id));

      if (index != -1) {
        sessions[index].end = new Date();
        sessions[index].session_duration = sessions[index].end - sessions[index].start;

        if (sessions[index].camera_on && !sessions[index].camera_off) {
          sessions[index].camera_off = new Date();
          sessions[index].camera_duration = sessions[index].camera_duration + (sessions[index].camera_off - sessions[index].camera_on);
        }

        if (sessions[index].streaming_on && !sessions[index].streaming_off) {
          sessions[index].streaming_off = new Date();
          sessions[index].streaming_duration = sessions[index].streaming_duration + (sessions[index].streaming_off - sessions[index].streaming_on);
        }
      }
    }

    if (oldchannel.members.size === 0) {
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
            .toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 });

          rows.push(cols);
          sessions.splice(index, 1);
        }
      }

      if (!init) {
        //console.log(rows);
        const tab = table(rows);
        logs.send('```' + title + tab + '```');
      }
    }
  }

  if (newmember.channelId) {

    const newchannel = guild.channels.cache.get(newmember.channelId);

    const user = client.users.cache.get(newmember.id);

    let username = 'Unknown';

    if (user) {
      username = user.tag;
    }

    if (newmember.channelId != oldmember.channelId) {

      //console.log('session started');

      const session = new Object();
      session.channelId = newmember.channelId;
      session.channel = newchannel.name;
      session.userId = newmember.id;
      session.username = username;
      session.start = new Date();
      session.end = null;

      if (newmember.selfVideo) {
        session.camera_on = session.start;
      }
      else {
        session.camera_on = null;
      }

      session.camera_off = null;

      if (newmember.streaming) {
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

      if (index != -1) {

        if (newmember.selfVideo && !oldmember.selfVideo) {
          sessions[index].camera_on = new Date();
        }
        else if (oldmember.selfVideo && !newmember.selfVideo) {
          sessions[index].camera_off = new Date();
          sessions[index].camera_duration = sessions[index].camera_duration + (sessions[index].camera_off - sessions[index].camera_on);
        }

        if (newmember.streaming && !oldmember.streaming) {
          sessions[index].streaming_on = new Date();
        }
        else if (oldmember.streaming && !newmember.streaming) {
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

client.on('messageReactionAdd', (reaction, user) => {
  if (reaction.message.channelId === '828724253938942014') {

    if (reaction.message.id === '834032215662526465') {
      if (reaction.emoji.name !== '⏲️') {
        reaction.remove();
      }
    }
    else if (reaction.message.id === '834057552668786699') {
      if (reaction.emoji.name !== '👦'
        && reaction.emoji.name !== '👨') {
        reaction.remove();
      }

      if (reaction.emoji.name === '👨') {

        var fileContent = fs.readFileSync('./agelock.json');
        agelock = JSON.parse(fileContent);

        if (agelock[user.id]) {
          const currenttime = new Date();
          if (currenttime > agelock[user.id]) {
            delete agelock[user.id];

            fs.writeFileSync('./agelock.json', JSON.stringify(agelock, null, 2), 'utf-8');
          }
          else if (!agelock[user.id].notified) {

            const mods = client.channels.cache.get('827889605994872863');
            const marq = client.users.cache.get('679465390841135126');

            user.send(`Sorry, you can't select Age 18+ on Gay Men Meditating yet. Please direct message a moderator if your age is 18+.`);

            mods.send(`${user} tried to select the Age 18+ role but they are age locked.`);

            agelock[user.id].notified = true;

            fs.writeFileSync('./agelock.json', JSON.stringify(agelock, null, 2), 'utf-8');
          }
        }
      }
    }
    else if (reaction.message.id === '834324950486876192') {
      if (reaction.emoji.name !== 'gay_flag'
        && reaction.emoji.name !== 'bi_flag'
        && reaction.emoji.name !== 'bi_curious_flag') {
        reaction.remove();
      }
    }
    else if (reaction.message.id === '881690698879995934') {
      if (reaction.emoji.name !== 'memes') {
        reaction.remove();
      }
    }
    else if (reaction.message.id === '881816102102003722') {
      if (reaction.emoji.name !== 'lotus_meditator'
        && reaction.emoji.name !== 'yoga') {
        reaction.remove();
      }
    }
  }
});


client.on("guildMemberUpdate", (oldMember, newMember) => {

  if (oldMember.roles.cache.size > newMember.roles.cache.size) {

    oldMember.roles.cache.forEach(role => {
      if (!newMember.roles.cache.has(role.id)) {
        console.log(`role ${role} removed from ${newMember}`);
      }
    });
  } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    newMember.roles.cache.forEach(role => {
      if (!oldMember.roles.cache.has(role.id)) {
        console.log(`role ${role} added to ${oldMember}`);
      }
    });
  }

  let role = newMember.guild.roles.cache.find(rolen => rolen.name === `Age 18 +`);

  if (!oldMember.roles.cache.has('828732299390353448') && newMember.roles.cache.has('828732299390353448')) {

    var fileContent = fs.readFileSync('./agelock.json');
    agelock = JSON.parse(fileContent);

    if (agelock[newMember.user.id]) {
      const currenttime = new Date();
      if (currenttime > agelock[newMember.user.id]) {
        delete agelock[newMember.user.id];

        fs.writeFileSync('./agelock.json', JSON.stringify(agelock, null, 2), 'utf-8');
      }
      else {
        const mods = client.channels.cache.get('827889605994872863');
        const marq = client.users.cache.get('679465390841135126');

        //mods.send(`Assignment of ${role} to ${oldMember} was reversed because of an age lock.`);
        newMember.roles.remove(role);
      }
    }
  }
});