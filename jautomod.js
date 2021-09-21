const fs = require('fs');

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
  var fileContent = fs.readFileSync('./data.json');
  data = JSON.parse(fileContent);

  console.log(data);
}

module.exports.welcomeDM = function(member, client, test = false) {
  var fileContent = fs.readFileSync('./messages.json');
  messages = JSON.parse(fileContent);

  member.send(messages.welcomedm.content).catch(err => console.log(err));

  var memberintro;

  if (test) {
    memberintro = client.channels.cache.get('871627629831290920');
  }
  else {
    memberintro = client.channels.cache.get('833559519611060244');
  }

  memberintro.send(`Please welcome @${member.user.username}.`);
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
    if (msglc.string.includes(data.verify[i])) {
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

  if (msglc.string.length > 50 && msglc.uppercase) {
    result.type = 'all upper case';
    result.rule = msglc.string.length;
    return result;
  }

  for (let i = 0; i < data.homophobic.length; i++) {
    if (msglc.string.includes(data.homophobic[i])) {
      if (!this.except(msglc.string, data.homophobic[i])) {
        result.type = 'homophobic language';
        result.rule = data.homophobic[i];
        return result;
      }
    }
  }

  for (let i = 0; i < data.racist.length; i++) {
    if (msglc.string.includes(data.racist[i])) {
      if (!this.except(msglc.string, data.racist[i])) {
        result.type = 'racist language';
        result.rule = data.racist[i];
        return result;
      }
    }
  }

  for (let i = 0; i < data.profane.length; i++) {
    if (msglc.string.includes(data.profane[i])) {
      if (!this.except(msglc.string, data.profane[i])) {
        result.type = 'profanity';
        result.rule = data.profane[i];
        return result;
      }
    }
  }

  if (msglc.string.includes('http://')) {
    result.type = 'URL or file links';
    result.rule = 'http://';
    return result;
  }

  if (msglc.string.includes('https://')) {
    result.type = 'URL or file links';
    result.rule = 'https://';
    return result;
  }

  result.type = 'none';
  result.rule = 'none';
  return result;
}

module.exports.automod = function(message) {

  if (!message.content) {
    return;
  }

  //let test = 'test_';
  let test = '';

  if (!message.member.roles.cache.some(rolen => rolen.name === `${test}verified`)) {

    let mods;
    let dels;

    if (test === '') {
      mods = message.client.channels.cache.get('827889605994872863');
      dels = message.client.channels.cache.get('874900065142046720');
    }
    else {
      mods = message.client.channels.cache.get('871628022388764672');
      dels = message.client.channels.cache.get('871628022388764672');
    }

    const nsrole = message.guild.roles.cache.find(rolen => rolen.name === 'newcomer-spoke');
    message.member.roles.add(nsrole);

    dels.send(`**@${message.author.username} wrote:**`);
    dels.send(`@${message.content}`);

    const automod = this.test(this.msglc(message));

    dels.send(`**Jalendu automod classified this as type "${automod.type}" by rule "${automod.rule}"**`);

    if (automod.type === 'none') {
      return;
    }

    if (automod.type === 'verify') {
      let role = message.guild.roles.cache.find(rolen => rolen.name === `${test}verified`);
      message.member.roles.add(role);
      role = message.guild.roles.cache.find(rolen => rolen.name === `${test}newcomer`);
      message.member.roles.remove(role);

      message.delete;

      this.welcomeDM(message.author, message.client);

      mods.send(`@${message.author.username} has been verified by rule "${automod.rule}".`);
      mods.send(`Their message was:\n${message.content}`);

      dels.send(`**@${message.author.username} was verified and their message was deleted.**`);

      return;
    }

    message.delete()
      .then(msgx => console.log(`Deleted message from ${msgx.author.username}`))
      .catch(err => console.log(err));

    //message.author.send(`Please refrain from writing homophobic or racist language, profanity and from including URLs or file links in the Gay Men Meditating ${message.channel.name}.\nYour message containing ${automod.type} was deleted.`).catch(err => console.log(err));

    mods.send(`@${message.author.username} wrote ${automod.type} in ${message.channel.name} and their message was deleted.`);

    const scumbag = this.scumbags.indexOf(message.author.username);

    if (scumbag > -1) {
      this.warnings[scumbag] = this.warnings[scumbag] + 1;
      if (this.warnings[scumbag] > 2) {

        const member = message.guild.members.resolve(message.author);

        if (member) {

          const role = message.guild.roles.cache.find(rolen => rolen.name === `${test}newcomer-muted`);

          message.member.roles.add(role).catch(err => console.log(err));

          //message.author.send('**You have been muted.**').catch(err => console.log(err));
          message.author.send('Thanks for joining Gay Men Meditating. You have been muted and your messages were deleted because you repeatedly wrote a message that triggered an auto-moderation function in the #landing-zone channel.').catch(err => console.log(err));

          mods.send(`@${message.author.username} has been muted.`).catch(err => console.log(err));

          dels.send(`**@${message.author.username} has been muted.**`).catch(err => console.log(err));

          this.message_cleanup(message.client);
        }
      }
      else {
        //message.author.send('**Final Warning - If you continue you will be muted.**').catch(err => console.log(err));
        //dels.send(`**@${message.author.username} was sent a final warning in DM and their message was deleted.**`).catch(err => console.log(err));

        dels.send(`**@${message.author.username} - second (final) violation.**`).catch(err => console.log(err));
      }
    }
    else {
      this.scumbags.push(message.author.username);
      this.warnings.push(1);
      //message.author.send('**First Warning**').catch(err => console.log(err));
      //dels.send(`**@${message.author.username} was sent their first warning in DM and their message was deleted.**`).catch(err => console.log(err));

      dels.send(`**@${message.author.username} - first violation.**`).catch(err => console.log(err));
    }

    console.log(this.scumbags);
    console.log(this.warnings);
  }
}

module.exports.datacheck = function(message) {
  let result;
  for (let i = 0; i < data.verify.length; i++) {
    for (let j = 0; j < data.verify.length; j++) {
      if (i != j && data.verify[i].includes(data.verify[j])) {
        result = result + `\n${data.verify[i]} includes ${data.verify[j]}`;
      }
    }
  }
  message.reply('Verify redundancies:\n' + result);

  result = '';
  for (let i = 0; i < data.homophobic.length; i++) {
    for (let j = 0; j < data.homophobic.length; j++) {
      if (i != j && data.homophobic[i].includes(data.homophobic[j])) {
        result = result + `\n${data.homophobic[i]} includes ${data.homophobic[j]}`;
      }
    }
  }
  message.reply('Homophobic language redundancies:\n' + result);

  result = '';
  for (let i = 0; i < data.racist.length; i++) {
    for (let j = 0; j < data.racist.length; j++) {
      if (i != j && data.racist[i].includes(data.racist[j])) {
        result = result + `\n${data.racist[i]} includes ${data.racist[j]}`;
      }
    }
  }
  message.reply('Racist language redundancies:\n' + result);

  result = '';
  for (let i = 0; i < data.profane.length; i++) {
    for (let j = 0; j < data.profane.length; j++) {
      if (i != j && data.profane[i].includes(data.profane[j])) {
        result = result + `\n${data.profane[i]} includes ${data.profane[j]}`;
      }
    }
  }
  message.reply('Profanity redundancies:\n' + result);
}


module.exports.message_cleanup = function(client) {

  console.log('\nLanding zone message cleanup.');
  console.log('-----------------------------');

  const landing_zone = client.channels.cache.get('851056727419256902');

  landing_zone.messages.fetch({ limit: 100 }).then(async messages => {
    messages.forEach(message => {
      if (message.type === 'CHANNEL_PINNED_MESSAGE') {
        message.delete();
      }
      else if (!message.pinned) {

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
          else if (member.roles.cache.some(rolen => rolen.name === 'newcomer-muted')) {
            console.log('Message is from a muted newcomer - delete message.');
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