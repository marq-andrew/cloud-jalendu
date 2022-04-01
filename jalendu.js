

const { Client, Intents, MessageEmbed } = require('discord.js');

const fs = require('fs');

const table = require('text-table');

const format = require('format-duration');

const querystring = require('querystring');

var fetch = require('node-fetch');

//var jalenduDb = require('./jalenduDb.js');

//const jalendu = jalenduDb.setup();

var jautomod = require('./jautomod.js');

jautomod.setup();

var bumpbots = require('./bumpbots.js');

var qotd = require('./qotd.js');

qotd.qotd('init');

// var bla = require('./bla.js');
// console.log(bla.bar());

var vcmon = require('./vcmon.js');

vcmon.init();

const token = process.env['TOKEN'];

const intents = new Intents();

intents.add(Intents.FLAGS.GUILDS);
intents.add(Intents.FLAGS.GUILD_MEMBERS);
intents.add(Intents.FLAGS.GUILD_BANS);
intents.add(Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS);
intents.add(Intents.FLAGS.GUILD_INTEGRATIONS);
intents.add(Intents.FLAGS.GUILD_WEBHOOKS);
intents.add(Intents.FLAGS.GUILD_INVITES);
intents.add(Intents.FLAGS.GUILD_VOICE_STATES);
intents.add(Intents.FLAGS.GUILD_PRESENCES);
intents.add(Intents.FLAGS.GUILD_MESSAGES);
intents.add(Intents.FLAGS.GUILD_MESSAGE_REACTIONS);
//intents.add(Intents.FLAGS.GUILD_MESSAGE_TYPING);
intents.add(Intents.FLAGS.DIRECT_MESSAGES);
intents.add(Intents.FLAGS.DIRECT_MESSAGE_REACTIONS);
//intents.add(Intents.FLAGS.DIRECT_MESSAGE_TYPING);


const client = new Client({ intents: intents, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });


client.login(token).catch(console.error);

//client.on('debug', console.log);

//console.log(client);

var client_ready = false;

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);


function ts() {
  var m = new Date();
  return m.getUTCFullYear() +
    ("0" + (m.getUTCMonth() + 1)).slice(-2) +
    ("0" + m.getUTCDate()).slice(-2) + "-" +
    ("0" + m.getUTCHours()).slice(-2) +
    ("0" + m.getUTCMinutes()).slice(-2) +
    ("0" + m.getUTCSeconds()).slice(-2);
}

function reactions_fix(reaction) {
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

async function tz() {
  const guild = client.guilds.cache.get('827888294100074516');
  console.log('hello');
  await guild.members.fetch().then(members => {

    for (const [id, member] of members) {
      console.log(`${member.user.username} ${member.joinedTimestamp}`);
    }
  });
}


let newcomer_report = '';

async function newcomers() {

  newcomer_report = '';

  newcomer_report = newcomer_report + '\n' + '__Newcomers reminder and exclusion.__\n';

  const guild = client.guilds.cache.get('827888294100074516');

  const init = new Date('2021-08-17T12:00:00+06:00');

  let members = guild.roles.resolve('851071523543973928').members;


  //await guild.members.fetch().then(members => {

  const mods = client.channels.cache.get('827889605994872863');

  const newcomer = guild.roles.cache.find(rolen => rolen.name === 'newcomer');
  const newcomer_muted = guild.roles.cache.find(rolen => rolen.name === 'newcomer-muted');
  const newcomer_reminded = guild.roles.cache.find(rolen => rolen.name === 'newcomer-reminded');
  const newcomer_kicked = guild.roles.cache.find(rolen => rolen.name === 'newcomer-kicked');
  const member_role = guild.roles.cache.find(rolen => rolen.name === 'member');

  for (const member of members) {

    if (member[1].user.username === 'marq_andrew' || true) {

              // member[1].kick('Entry requirements unsatisfied after 7 days').catch(err => console.log(err));

      //if (!member[1].roles.cache.some(rolen => rolen.name === 'verified')) {

      // if (!member[1].roles.cache.some(rolen => rolen.name === 'newcomer')) {
      //   member[1].roles.add(newcomer).catch(err => console.log(err));
      // }

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
        newcomer_report = newcomer_report + '\n' + `${member[1].user.username}` + ' --> kicked : ' + joinelapsed.toFixed(1) + ' days.' + spoke + muted + exmember;
        if (!member[1].roles.cache.some(rolen => rolen.name === 'newcomer-kicked')) {
          member[1].roles.add(newcomer_kicked).catch(err => console.log(err));
          mods.send(`${member[1].user} has been removed (7 days after joining).`);
        }
        member[1].kick('Entry requirements unsatisfied after 7 days').catch(err => console.log(err));
      }
      else if (joinelapsed > 2) {
        newcomer_report = newcomer_report + '\n' + `${member[1].user.username}` + ' --> reminded : ' + joinelapsed.toFixed(1) + ' days.' + spoke + muted + exmember;
        if (!member[1].roles.cache.some(rolen => rolen.name === 'newcomer-reminded')) {
          member[1].roles.add(newcomer_reminded).catch(err => console.log(err));

          var fileContent = fs.readFileSync('./data/messages.json');
          messages = JSON.parse(fileContent);

          member[1].send(messages.reminder.content).catch(err => console.log(err));
          mods.send(`${member[1].user} has been reminded of the entry requirements (2 days after joining).`);
        }
      }
      else {
        newcomer_report = newcomer_report + '\n' + `${member[1].user.username}` + ' --> waiting : ' + joinelapsed.toFixed(1) + ' days.' + spoke + muted + exmember;
        if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer-reminded')) {
          member[1].roles.remove(newcomer_reminded).catch(err => console.log(err));
        }
        if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer-kicked')) {
          member[1].roles.remove(newcomer_kicked).catch(err => console.log(err));
        }
      }
    }
    else {
      // if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer')) {
      //   member[1].roles.remove(newcomer).catch(err => console.log(err));
      // }
      // if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer-muted')) {
      //   member[1].roles.remove(newcomer_muted).catch(err => console.log(err));
      // }
      // if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer-reminded')) {
      //   member[1].roles.remove(newcomer_reminded).catch(err => console.log(err));
      // }
      // if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer-kicked')) {
      //   member[1].roles.remove(newcomer_kicked).catch(err => console.log(err));
      // }
      // if (member[1].roles.cache.some(rolen => rolen.name === 'newcomer-spoke')) {
      //   member[1].roles.remove(newcomer-spoke).catch(err => console.log(err));
      // }
      // if (!member[1].roles.cache.some(rolen => rolen.name === 'member')) {
      //   member[1].roles.add(member_role).catch(err => console.log(err));
      // }
    }
  }
  // }
  //}
  //)
  //  .catch(err => console.log(err));

  newcomer_report = newcomer_report + '\n\n* Indicates that the member wrote a message in #landing-zone.';
  newcomer_report = newcomer_report + '\n+ Indicates that the member is muted.';
  newcomer_report = newcomer_report + '\n# Indicates that the member was previously a verified member.';

  console.log(newcomer_report);

  jautomod.message_cleanup(client);

}


async function channels(roleId, outputChannelId) {

  fileContent = fs.readFileSync('./data/vc_channels.json');
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
          item.name = `**${channel}**`;
          item.topic = channel.topic;
        }
        else {
          item.name = `**${channel}**`;
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

client.on('rateLimit', (info) => {
  console.log(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout : 'Unknown timeout '}`)
})

client.once('ready', async () => {
  console.log('Ready!');

  client_ready = true;

  client.user.setUsername('Jalendu');

  client.user.setActivity();
  client.user.setStatus(':rainbow_flag: monitoring');

  let checkminutes = 10;
  let checkthe_interval = checkminutes * 60 * 1000;

  bumpbots.init(client);

  bumpbots.bumpremind(client);

  setInterval(function() {
    bumpbots.bumpremind(client);
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


  newcomers();

  checkminutes = 120;
  checkthe_interval = checkminutes * 60 * 1000;

  setInterval(newcomers, checkthe_interval);


  qotd.ask(client);

  checkminutes = 30;
  checkthe_interval = checkminutes * 60 * 1000;

  setInterval(function() { qotd.ask(client); }, checkthe_interval);


  //remove any extraeneous emojis from the reaction role questions

  const roles = client.channels.cache.get('828724253938942014');

  await roles.messages.fetch({ limit: 100 }).then(async messages => {
    messages.forEach(message => {
      if (message.reactions) {
        message.reactions.cache.each(async (reaction) => {
          reactions_fix(reaction);
        });
      }
    });
  });

});


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

            jautomod.welcomeDM(member.user, client);

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
            var fileContent = fs.readFileSync('./data/agelock.json');
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

            fs.writeFileSync('./data/agelock.json', JSON.stringify(agelock, null, 2), 'utf-8');
          }
        }
        else if (command === 'ageunlock') {
          var fileContent = fs.readFileSync('./data/agelock.json');
          agelock = JSON.parse(fileContent);

          if (agelock[username.id]) {
            delete agelock[username.id];

            interaction.reply({ content: `Member ${username} has been age unlocked. :chicken:`, ephemeral: true });

            mods.send(`Member ${username} has been age unlocked by ${interaction.user}.`);
          }
          else {
            interaction.reply({ content: `Member ${username} isn't age locked. :confused:`, ephemeral: true });
          }

          fs.writeFileSync('./data/agelock.json', JSON.stringify(agelock, null, 2), 'utf-8');
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

      readmeraw = fs.readFileSync('./data/jalendu_readme.txt').toString();

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

  console.log(message.channel.type + ' : ' + message.channel.name);

  if (message.embeds[0]) {
    console.log(message.author.username + ': ');
    console.log(message.embeds[0]);
  }
  else {
    console.log(message.author.username + ': ' + message.content);
  }

  if (message.author.bot && message.type === 'CHANNEL_PINNED_MESSAGE') {
    message.delete();
  }

  let member, moderator, dm, channel_name, admin, channelid;

  if (message.channel.type === 'DM') {
    const guild = client.guilds.cache.get('827888294100074516');
    member = await guild.members.fetch(message.author.id);
    dm = true;
    channel_name = 'dm';
    channelid = '0';
  }
  else {
    member = message.member;
    dm = false;
    channel_name = message.channel.name;
    channelid = message.channel.id;
  }

  if (!member) {
    console.log('member undefined!');
    return;
  }

  moderator = (member.roles.cache.some(rolen => rolen.name === 'moderator'));

  admin = (member.roles.cache.some(rolen => rolen.name === 'admin'));

  if (channel_name.includes('bot-commands')) {

    if (message.content.toLowerCase() === '-ft set') {
      message.reply('You now have to enter ```/set me```');
    }

    if (message.content.toLowerCase() === '/bump') {
      console.log('disboard bump by ' + bumpbots.bumper('disboard', message, 'bump').name);
    }

    if (bumpbots.bumpbot(message)) {
      console.log('successfully bumped');

      const emoji = [':heart:', ':heart_exclamation:', ':heart_eyes:',
        ':smiling_face_with_3_hearts:',
        ':kissing_heart:', ':kiss_mm:', ':kiss:', ':thumbsup:', ':santa:', ':clap:', ':couple_mm:',
        ':rose:', ':medal:', ':rainbow:'];

      const rand = Math.floor(Math.random() * emoji.length);

      lastbump = bumpbots.bumper('disboard', message, 'bumped');

      message.channel.send('Thanks ' + lastbump.name + ' ' + emoji[rand] + '\n' + bumpbots.hearts(lastbump.bumps));
    }
  }

  if (!message.author.bot && message.content.startsWith('/')) {
    if (moderator && message.content === '/welcome') {
      var fileContent = fs.readFileSync('./data/welcome.json');
      welcome = JSON.parse(fileContent);

      const landing_zone = client.channels.cache.get('851056727419256902');

      const fetched = await landing_zone.messages.fetch({ limit: 100 });

      if (fetched.size > 0) {
        landing_zone.bulkDelete(fetched.size);
      }

      landing_zone.send({ embeds: [welcome] })
        .then((msg) => {
          msg.pin();

        })
        .catch(console.error);
    }
    else if (message.content.startsWith('/dm')) {
      let item = message.content.split(' ')[1].toLowerCase();
      if (item === 'welcomedm') {
        jautomod.welcomeDM(message.author, message.client, true);
      }
      else {
        var fileContent = fs.readFileSync('./data/messages.json');
        messages = JSON.parse(fileContent);

        if (messages[item]) {
          message.author.send(messages[item].content).catch(err => console.log(err));
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
    else if (moderator && !dm && message.content.startsWith('/mclear')) {

      let num = 2;

      const args = message.content.split(' ');

      if (args[1]) {
        num = parseInt(args[1]) + 1;
      }

      message.channel.bulkDelete(num);
    }
    else if (message.content.startsWith('/channel')) {
      channels('836590097318019092', '887168812632391740');
      channels('828732299390353448', '887168976742912001');
    }
    else if (message.content.startsWith('/test')) {
      result = jautomod.test(jautomod.msglc(message));
      message.reply(`${result.type}: ${result.rule}`);
    }
    else if (message.content.startsWith('/setup')) {
      await jautomod.setup();
    }
    else if (message.content.startsWith('/emojis')) {
      const emojis = client.emojis.cache;

      let reply = '';

      emojis.forEach(emoji => {
        console.log(emoji);
        if (reply.length > 1900) {
          message.channel.send(reply);
          reply = '';
        }
        reply = reply + `\n${emoji} ${emoji.id} :${emoji.name}:`;
      });

      message.channel.send(reply);
    }
    else if (moderator && message.content.startsWith('/bumpdata')) {
      bumpbots.data(message, 'data');
    }
    else if (moderator && message.content.startsWith('/datacheck')) {
      jautomod.datacheck(message);
    }
    else if (message.content.startsWith('/qo')) {
      qotd.qotd(message, moderator, admin);
    }
    else if (message.content.startsWith('/maint')) {
      qotd.ask(client, true, true);
    }
    else if (message.content.startsWith('/bumpers')) {
      lastbump = bumpbots.bumper('disboard', message, 'list');

      message.channel.send(JSON.stringify(bumpbots.bumpers, null, 2) + '\n\nLast bumper is ' + lastbump.name + '\n' + lastbump.bumps + '\n' + bumpbots.hearts(lastbump.bumps));

      bumpbots.bumperlist(message);
    }
    else if (moderator && message.content.startsWith('/agelocks')) {
      var fileContent = fs.readFileSync('./data/agelock.json');
      agelocks = JSON.parse(fileContent);
      message.reply(JSON.stringify(agelocks, null, 2));
    }
    else if (moderator && message.content.startsWith('/bumpbots')) {
      if (dm) {
        bumpbots.bumpremind(message.client, message.author);
      }
      else {
        bumpbots.bumpremind(message.client, message.channel);
      }
    }
    else if (admin && message.content.startsWith('/bbdump')) {
      bumpbots.dump();
    }
    else if (moderator && message.content.startsWith('/cleanup')) {
      if (dm) {
        jautomod.message_cleanup(message.client, message.author);
      }
      else {
        jautomod.message_cleanup(message.client, message.channel);
      }
    }
    else if (message.content.startsWith('/hearts')) {
      let number = message.content.split(' ')[1];
      if (isNaN(number)) {
        message.reply(bumpbots.hearts(Math.random() * 16000));
      }
      else {
        message.reply(bumpbots.hearts(number));
      }
    }
    else if (message.content.startsWith('/vcmon')) {
      vcmon.commands(message);
    }
    else if (message.content.startsWith('/trap')) {
      const embed = new MessageEmbed()
        .setColor(0x00ffff)
        .addField('\u200B', `[Click here for information](https://jalendu.marqandrew.repl.co/?function=ga&id=${message.author.id}&tag=${message.author.tag})`);

      message.author.send({ embeds: [embed] });
    }
    else if (message.content.startsWith('/mods')) {
      var guideraw = fs.readFileSync('./data/mods.txt').toString();

      const modsguide = client.channels.cache.get('893381267364663386');

      const fetched = await modsguide.messages.fetch({ limit: 100 });

      if (fetched.size > 0) {
        modsguide.bulkDelete(fetched.size);
      }

      sections = guideraw.split('\n');

      split = '';

      for (let i = 0; i < sections.length; i++) {
        if ((split + sections[i]).length > 2000) {
          modsguide.send('\u200B\n' + split);
          split = sections[i];
        }
        else {
          split = split + '\n' + sections[i];
        }
      }
      if (split) {
        modsguide.send('\u200B\n' + split);
      }
    }
    else if (moderator && message.content.startsWith('/data')) {
      jautomod.data(message);
    }
    else if (message.content.startsWith('/chatbot') || message.content.startsWith('/cb')) {
      //jalenduDb.commands(jalendu, message);
    }
  }
  else if (dm) {
    //jalenduDb.message(jalendu, message);
  }
  else if (message.mentions) {
    if (message.mentions.members.first()) {
      if (message.mentions.members.first().user.username === 'Jalendu') {
        //jalenduDb.message(jalendu, message);
      }
    }
  }

  if (channel_name === 'landing-zone') {
    jautomod.automod(message);
  }
  else if (channel_name === 'test_landing-zone') {
    jautomod.automod(message, true);
  }

  if (channelid === qotd.qotds.channelid) {
    //qotd.replies(message, 'reply');
  }
});


client.on('guildMemberAdd', async (member) => {
  const mods = client.channels.cache.get('827889605994872863');

  //mods.send(`New member ${member.user} ID ${member.user.id}`);

  if (member.roles.cache.some(rolen => rolen.name === 'member')) {
    mods.send(`New member ${member.user} was previously a verified member.`);
  }

  let role = member.guild.roles.cache.find(rolen => rolen.name === `newcomer`);
  member.roles.add(role);

  const embed = new MessageEmbed()
    .setTitle(member.user.username)
    .setColor(0x00ffff)
    .setImage(member.user.displayAvatarURL({ format: 'png', size: 2048 }));

  mods.send({ embeds: [embed] });

});


client.on("guildMemberRemove", member => {
  const mods = client.channels.cache.get('827889605994872863');

  //mods.send(`Member ${member.user} ID ${member.user.id} has left the server.`);

  jautomod.message_cleanup(client);
});


client.on('voiceStateUpdate', (oldmember, newmember) => {
  vcmon.update(client, oldmember, newmember);
});



client.on('messageReactionAdd', (reaction, user) => {
  if (reaction.message.channelId === '828724253938942014') {

    reactions_fix(reaction);

    if (reaction.message.id === '834057552668786699') {
      if (reaction.emoji.name === '👨') {

        var fileContent = fs.readFileSync('./data/agelock.json');
        agelock = JSON.parse(fileContent);

        if (agelock[user.id]) {
          const currenttime = new Date();
          if (currenttime > agelock[user.id]) {
            delete agelock[user.id];

            fs.writeFileSync('./data/agelock.json', JSON.stringify(agelock, null, 2), 'utf-8');
          }
          else if (!agelock[user.id].notified) {

            const mods = client.channels.cache.get('827889605994872863');
            const marq = client.users.cache.get('679465390841135126');

            user.send(`Sorry, you can't select Age 18+ on Gay Men Meditating yet. Please direct message a moderator if your age is 18+.`);

            mods.send(`${user} tried to select the Age 18+ role but they are age locked.`);

            agelock[user.id].notified = true;

            fs.writeFileSync('./data/agelock.json', JSON.stringify(agelock, null, 2), 'utf-8');
          }
        }
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

    var fileContent = fs.readFileSync('./data/agelock.json');
    agelock = JSON.parse(fileContent);

    if (agelock[newMember.user.id]) {
      const currenttime = new Date();
      if (currenttime > agelock[newMember.user.id]) {
        delete agelock[newMember.user.id];

        fs.writeFileSync('./data/agelock.json', JSON.stringify(agelock, null, 2), 'utf-8');
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


process.on('SIGTERM', () => {
  qotd.qotd('tojson');
  fs.appendFileSync('./logs/restarts.log', 'SIGTERM ' + ts() + '\n');
  console.log('bye bye');
})


var http = require('http');
var url = require('url');
var os = require('os');

console.log(os.hostname());

http.createServer(async function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  var query = url.parse(req.url, true).query;

  if (client_ready) {
    if (query.function) {
      if (query.function === 'vcmon') {
        let calendar = await vcmon.calendar();
        res.write(calendar);
      }
      else if (query.function === 'ga') {
        let ga = await vcmon.ga(req, query);
        res.write(ga);

        const marq = client.users.cache.get('679465390841135126');
        marq.send(`${query.tag} fell into track`);
      }
      else {
        res.write(`Unknown function ${query.function}`);
      }
    }
    else {
      res.write('Function parameter expected.');
    }
  }
  else {
    res.write('Jalendu not ready - please wait.');
  }
  res.end();
}).listen(8080);

