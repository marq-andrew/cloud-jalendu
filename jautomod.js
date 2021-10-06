const fs = require('fs');

const { MessageEmbed } = require('discord.js');

module.exports.data = {
  verify: [],
  homophobic: [],
  racist: [],
  profane: [],
  except: [],
}

module.exports.scumbags = [];
module.exports.warnings = [];

module.exports.setup = function() {
  var fileContent = fs.readFileSync('./data/data.json');
  data = JSON.parse(fileContent);
}

module.exports.welcomeDM = function(member, client, test = false) {
  var fileContent = fs.readFileSync('./data/messages.json');
  messages = JSON.parse(fileContent);

  member.send(messages.welcomedm.content).catch(err => console.log(err));

  var memberintro;

  if (test) {
    memberintro = client.channels.cache.get('871627629831290920');
  }
  else {
    memberintro = client.channels.cache.get('833559519611060244');
  }

  //memberintro.send(`Please welcome ${member}.`);

  const embed = new MessageEmbed()
    .setColor(0x00ffff)
    .setThumbnail(member.displayAvatarURL({ format: 'png' }))
    .addField('\u200B', `Please welcome ${member}.`, true);

  memberintro.send({ embeds: [embed] });
}

module.exports.msglc = function(message) {

  const msglc = new Object;

  var string;

  if (message.content.startsWith('/')) {
    string = message.content.split(' ').slice(1).join(' ');
  }
  else {
    string = message.content;
  }

  if (string === string.toUpperCase()) {
    msglc.uppercase = true;
  }
  else {
    msglc.uppercase = false;
  }

  msglc.string = string.toLowerCase();

  msglc.normal = msglc.string.normalize("NFD").replace(/\p{Diacritic}/gu, "");

  return msglc;
}

module.exports.except = function(string, rule) {
  const words = string.split(' ');

  let exception;

  for (let i = 0; i < words.length; i++) {
    if (words[i].includes(rule)) {
      exception = false;
      for (let j = 0; j < data.except.length; j++) {
        if (words[i].includes(data.except[j])) {
          exception = true;
          break;
        }
      }
    }
    if (!exception) {
      return false;
    }
  }
  return true;
}

module.exports.test = function(msglc) {

  result = new Object();

  for (let i = 0; i < data.verify.length; i++) {
    if (msglc.normal.includes(data.verify[i])) {
      result.type = 'verify';
      result.rule = data.verify[i];
      return result;
    }
  }

  if (msglc.string.length > 1100) {
    result.type = 'excessive length';
    result.rule = msglc.string.length;
    return result;
  }

  if (msglc.string.length > 40 && msglc.uppercase) {
    result.type = 'all upper case';
    result.rule = msglc.string.length;
    return result;
  }

  for (let i = 0; i < data.homophobic.length; i++) {
    if (msglc.normal.includes(data.homophobic[i])) {
      if (!this.except(msglc.normal, data.homophobic[i])) {
        result.type = 'homophobic language';
        result.rule = data.homophobic[i];
        return result;
      }
    }
  }

  for (let i = 0; i < data.racist.length; i++) {
    if (msglc.normal.includes(data.racist[i])) {
      if (!this.except(msglc.normal, data.racist[i])) {
        result.type = 'racist language';
        result.rule = data.racist[i];
        return result;
      }
    }
  }

  for (let i = 0; i < data.profane.length; i++) {
    if (msglc.normal.includes(data.profane[i])) {
      if (!this.except(msglc.normal, data.profane[i])) {
        result.type = 'profanity';
        result.rule = data.profane[i];
        return result;
      }
    }
  }


  let urlrx1 = new RegExp("$(http:\/\/|https:\/\/|ftp:\/\/|email:\/\/|file:\/\/)?([a-z0-9]+\.?)+");

  let urlrx2 = new RegExp("([a-z0-9]+\.)+(com|co|org|edu|gov|biz|info)$");

  let words = msglc.string.split(' ');

  for (let i = 0; i < words.length; i++) {
    if (urlrx1.test(words[i]) || urlrx2.test(words[i])) {
      result.type = 'URL or file links';
      result.rule = 'words[i]';
      return result;
    }
  }

  result.type = 'none';
  result.rule = 'none';
  return result;
}

module.exports.automod = function(message, test = false) {

  if (!message.content || message.author.bot) {
    return;
  }

  let mods;
  let dels;
  let pfx;

  if (test) {
    mods = message.client.channels.cache.get('871628022388764672');
    dels = message.client.channels.cache.get('871628022388764672');
    pfx = 'test_';
  }
  else {
    mods = message.client.channels.cache.get('827889605994872863');
    dels = message.client.channels.cache.get('874900065142046720');
    pfx = '';
  }


  if (!message.member.roles.cache.some(rolen => rolen.name === `${pfx}verified`)) {


    const nsrole = message.guild.roles.cache.find(rolen => rolen.name === 'newcomer-spoke');
    message.member.roles.add(nsrole);

    dels.send(`**${message.author} wrote:**`);
    dels.send(`${message.content}`);

    const automod = this.test(this.msglc(message));

    dels.send(`**Jalendu automod classified this as type "${automod.type}" by rule "${automod.rule}"**`);

    if (automod.type === 'none') {
      return;
    }

    if (automod.type === 'verify') {
      let role = message.guild.roles.cache.find(rolen => rolen.name === `${pfx}verified`);
      message.member.roles.add(role);
      role = message.guild.roles.cache.find(rolen => rolen.name === `${pfx}newcomer`);
      message.member.roles.remove(role);

      message.delete;

      this.welcomeDM(message.author, message.client);

      mods.send(`${message.author} has been verified by rule "${automod.rule}".`);
      mods.send(`Their message was:\n${message.content}`);

      dels.send(`**${message.author} was verified and their message was deleted.**`);

      return;
    }

    message.delete()
      .then(msgx => console.log(`Deleted message from ${msgx.author.username}`))
      .catch(err => console.log(err));

    //message.author.send(`Please refrain from writing homophobic or racist language, profanity and from including URLs or file links in the Gay Men Meditating ${message.channel.name}.\nYour message containing ${automod.type} was deleted.`).catch(err => console.log(err));

    mods.send(`${message.author} wrote ${automod.type} in ${message.channel.name} and their message was deleted.`);

    const scumbag = this.scumbags.indexOf(message.author.username);

    if (scumbag > -1) {
      this.warnings[scumbag] = this.warnings[scumbag] + 1;
      if (this.warnings[scumbag] > 2) {

        const member = message.guild.members.resolve(message.author);

        if (member) {

          const role = message.guild.roles.cache.find(rolen => rolen.name === `${pfx}newcomer-muted`);

          message.member.roles.add(role).catch(err => console.log(err));

          var fileContent = fs.readFileSync('./data/messages.json');
          messages = JSON.parse(fileContent);

          message.author.send(messages.muted.content)
            // .then(message => {
            //   message.author.send('\u200B\n' + messages.muted_end.content)
            // })
            .catch(err => console.log(err));

          mods.send(`${message.author} has been muted.`).catch(err => console.log(err));

          dels.send(`**${message.author} has been muted.**`).catch(err => console.log(err));

          this.message_cleanup(message.client);
        }
      }
      else {
        dels.send(`**${message.author} - second (final) violation.**`).catch(err => console.log(err));
      }
    }
    else {
      this.scumbags.push(message.author.username);
      this.warnings.push(1);

      dels.send(`**${message.author} - first violation.**`).catch(err => console.log(err));
    }

    console.log(this.scumbags);
    console.log(this.warnings);
  }
}

function check(type, message) {
  let result = '';

  for (let i = 0; i < data[type].length; i++) {
    if (data[type][i] !== data[type][i].toLowerCase()) {
      result = result + `\n${data[type][i]} contains upper case.`;
    }

    if (data[type][i] !== data[type][i].normalize("NFD").replace(/\p{Diacritic}/gu, "")) {
      result = result + `\n${data[type][i]} contains diacritics.`;
    }

    for (let j = 0; j < data[type].length; j++) {
      if (i != j && data[type][i].includes(data[type][j])) {
        result = result + `\n${data[type][i]} includes ${data[type][j]}`;
      }
    }
  }

  message.reply(`${type} redundancies:\n${result}`);
}

module.exports.datacheck = function(message) {
  let result = '';

  result = `\n${result}` + check('verify', message);
  result = `\n${result}` + check('homophobic', message); result = `\n${result}` + check('racist', message); result = `\n${result}` + check('profane', message);
}


//module.exports.cleanup_log = '';

module.exports.message_cleanup = async function(client, output) {

  var cleanup_log = '';

  const landing_zone = client.channels.cache.get('851056727419256902');

  await landing_zone.messages.fetch({ limit: 100 }).then(messages => {
    messages.forEach(message => {
      if (message.type === 'CHANNEL_PINNED_MESSAGE') {
        cleanup_log = cleanup_log + 'CHANNEL_PINNED_MESSAGE deleted';
        message.delete();
      }
      else if (!message.pinned) {

        currenttime = new Date();
        const age = new Date(currenttime - message.createdTimestamp) / (24 * 60 * 60 * 1000);

        cleanup_log = cleanup_log + `\nMessage by ${message.author} "${message.content.substring(0, 50)}"`;

        if (age > 3) {

          cleanup_log = cleanup_log + '-is more than 3 days old - delete.';
          message.delete().catch(err => console.log(err));
        }

        const author = message.author.id;
        const mention = message.mentions.users.first();

        message.guild.members.fetch(author).then(member => {
          if (member.roles.cache.some(rolen => rolen.name === 'moderator')) {
            cleanup_log = cleanup_log + '\n- is from a moderator - check mentions:';
            if (mention) {
              message.guild.members.fetch(mention).then(mention => {
                if (mention.roles.cache.some(rolen => rolen.name === 'moderator')) {
                  cleanup_log = cleanup_log + '\n- - mentions a moderator - wait.';
                }
                else if (mention.roles.cache.some(rolen => rolen.name === 'verified')) {
                  cleanup_log = cleanup_log + '\n- - mentions a verified member - delete.';
                  message.delete().catch(err => console.log(err));
                }
                else {
                  cleanup_log = cleanup_log + '\n- - mentions an unverified newcomer - wait.';
                }
              })
                .catch(err => {
                  cleanup_log = cleanup_log + '\n- - mentions an non-member - delete.';
                  message.delete().catch(err => console.log(err));
                });
            }
          }
          else if (member.roles.cache.some(rolen => rolen.name === 'verified')) {
            cleanup_log = cleanup_log + '\n- is from a verified member - delete.';
            message.delete().catch(err => console.log(err));
          }
          else if (member.roles.cache.some(rolen => rolen.name === 'newcomer-muted')) {
            cleanup_log = cleanup_log + '\n- is from a muted newcomer - delete.';
            message.delete().catch(err => console.log(err));
          }
          else {
            cleanup_log = cleanup_log + '\n- is from an unverified newcomer - wait.';
          }
        })
          .catch(err => {
            cleanup_log = cleanup_log + '\n- is from a non-member - delete.';
            message.delete().catch(err => console.log(err));
          });
      }
    });
  });

  if (cleanup_log) {
    cleanup_log = '__Landing zone message cleanup__' + cleanup_log;
  }
  else {
    cleanup_log = 'cleanup: no messages found';
  }

  if (!output) {
    console.log(cleanup_log);
  }
  else {
    output.send(cleanup_log);
  }
}


module.exports.data = function(message) {
  const args = message.content.toLowerCase().split(' ');

  const command = args[1];
  const list = args[2];
  const term = args.slice(3).join(' ');

  const log = message.client.channels.cache.get('874900065142046720');

  let reply = '';

  if (command === 'help') {
    reply = 'Usage: /data [help|list|search|add|delete|save|revert] [';
    let lists = '';
    for (const [list] of Object.entries(data)) {
      if (lists != '') {
        lists = lists + '|';
      }
      lists = lists + list;
    }
    reply = reply + lists + '] [(term)|(index)]';
    message.reply(reply);
  }
  else if (command === 'list' || command === 'search') {
    if (!data[list]) {
      message.reply(`no such list : ${list}`);
      return;
    }

    for (var i = 0; i < data[list].length; i++) {
      if (reply.length > 1900) {
        if (reply) {
          message.reply(reply);
        }
        reply = '';
      }
      if (command === 'list' || data[list][i].includes(term)) {
        reply = reply + `\n${i + 1}: ${data[list][i]}`;
      }
    }
    if (reply) {
      message.reply(reply);
    }
  }
  else if (command === 'add') {
    if (!data[list]) {
      message.reply(`no such list : ${list}`);
      return;
    }

    if (!term) {
      message.reply(`term required for add`);
      return;
    }

    data[list].push(term);

    message.reply(`${data[list].length}: ${data[list][data[list].length - 1]}`);

    log.send(`${message.author} added ${term} to ${list}`)
  }
  else if (command === 'delete') {
    if (!data[list]) {
      message.reply(`no such list : ${list}`);
      return;
    }

    if (isNaN(term)) {
      message.reply(`index number from list or search required for delete`);
      return;
    }

    if (!data[list][term - 1]) {
      message.reply(`index ${list}[${term}(-1)] is not defined`);
      return;
    }

    log.send(`${message.author} deleted ${data[list][term - 1]} from ${list}`)

    if (data[list][term - 1].substring(0, 3) !== '^v^') {
      data[list][term - 1] = '^v^' + data[list][term - 1];
    }

    message.reply(`${term}: ${data[list][term - 1]}`);
  }
  else if (command === 'save') {

    for (const [list] of Object.entries(data)) {
      for (var i = data[list].length - 1; i >= 0; i--) {
        if (data[list][i].substring(0, 3) === '^v^') {
          data[list].splice(i, 1);
        }
      }

      data[list].sort();
    }

    const now = new Date();

    const bu = now.toISOString().substring(0, 10);

    try {
      fs.copyFileSync(`./data/data.json`, `./data/data_bu_${bu}.json`,
        fs.constants.COPYFILE_EXCL);
      reply = reply + `\ndata backed-up to data_bu_${bu}.json.`;
    }
    catch (err) {
      reply = reply + '\ndata not backed-up because a backup for today has already been made.'
    }

    try {
      fs.writeFileSync('./data/data.json', JSON.stringify(data, null, 2), 'utf-8');
      reply = reply + `\ndata saved to data.json`;

      log.send(`${message.author} saved changes permanently`);

      this.setup();
    }
    catch (e) {
      reply = reply + `\nsave of data to data.json failed`;
    }

    if (reply) {
      message.channel.send(reply);
    }
  }
  else if (command === 'revert') {
    this.setup();

    log.send(`${message.author} reverted to the previously saved data`);
  }
  else if (command === 'backups') {
    fs.readdirSync('./data/').forEach(file => {
      if (file.substring(0, 9) === 'data_bu_2') {
        const filex = file.split(/[_\.]+/)[2];
        console.log(filex);
        reply = reply + '\n' + file.split(/[_\.]+/)[2];
      }
    });
    if (reply) {
      message.channel.send(reply);
    }
  }
  else if (command === 'restore') {
    const now = new Date();

    const bu = now.toISOString().substring(0, 10);

    try {
      fs.copyFileSync(`./data/data.json`, `./data/data_bu_${bu}.json`,
        fs.constants.COPYFILE_EXCL);
      reply = reply + `\ndata backed-up to data_bu_${bu}.json.`;
    }
    catch (err) {
      reply = reply + '\ndata not backed-up because a backup for today has already been made.'
    }

    try {
      var fileContent = fs.readFileSync(`./data/data_bu_${list}.json`);
      data = JSON.parse(fileContent);

      reply = reply + `\ndata restored from data_bu_${list}.json.`;

      log.send(`${message.author} restored from the ${list} backup`);
    }
    catch (err) {
      reply = reply + `\ndata not restored from backup ${list}. Maybe it doesn't exist?`;
      console.log(err);
    }

    if (reply) {
      message.channel.send(reply);
    }
  }
  else {
    message.reply(`unknown command '${command}'`)
  }
}