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

module.exports.welcomeDM = function(member) {
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

module.exports.msglc = function(message) {
  if (message.content.startsWith('/')) {
    return message.content.split(' ').slice(1).join(' ').toLowerCase();
  }
  else {
    return message.content.toLowerCase();
  }
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

module.exports.test = function(string) {

  result = new Object();

  for (let i = 0; i < data.verify.length; i++) {
    if (string.includes(data.verify[i])) {
      result.type = 'verify';
      result.rule = data.verify[i];
      return result;
    }
  }

  for (let i = 0; i < data.homophobic.length; i++) {
    if (string.includes(data.homophobic[i])) {
      if (!this.except(string, data.homophobic[i])) {
        result.type = 'homophobic language';
        result.rule = data.homophobic[i];
        return result;
      }
    }
  }

  for (let i = 0; i < data.racist.length; i++) {
    if (string.includes(data.racist[i])) {
      if (!this.except(string, data.racist[i])) {
        result.type = 'racist language';
        result.rule = data.racist[i];
        return result;
      }
    }
  }

  for (let i = 0; i < data.profane.length; i++) {
    if (string.includes(data.profane[i])) {
      if (!this.except(string, data.profane[i])) {
        result.type = 'profanity';
        result.rule = data.profane[i];
        return result;
      }
    }
  }

  if (string.includes('http://')) {
    result.type = 'URL or file links';
    result.rule = 'http://';
    return result;
  }

  if (string.includes('https://')) {
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
    console.log('here');
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

    const automod = this.test(this.msglc(message));

    if (automod.type === 'none') {
      return;
    }

    if (automod.type === 'verify') {
      let role = message.guild.roles.cache.find(rolen => rolen.name === `${test}verified`);
      message.member.roles.add(role);
      role = message.guild.roles.cache.find(rolen => rolen.name === `${test}newcomer`);
      message.member.roles.remove(role);

      message.delete;

      this.welcomeDM(message.author);

      mods.send(`@${message.author.username} has been verified by rule "${automod.rule}".`);
      mods.send(`Their message was:\n${message.content}`);

      return;
    }

    message.delete()
      .then(msgx => console.log(`Deleted message from ${msgx.author.username}`))
      .catch(err => console.log(err));

    message.author.send(`Please refrain from writing homophobic or racist language, profanity and from including URLs or file links in the Gay Men Meditating ${message.channel.name}.\nYour message containing ${automod.type} was deleted.`).catch(err => console.log(err));

    mods.send(`@${message.author.username} wrote ${automod.type} in ${message.channel.name} and their message was deleted.`);

    dels.send(`@${message.author.username} wrote ${automod.type} detected by rule "${automod.rule}".`);

    dels.send(`Their message was >>>${message.content}<<<`);

    const scumbag = this.scumbags.indexOf(message.author.username);

    if (scumbag > -1) {
      this.warnings[scumbag] = this.warnings[scumbag] + 1;
      if (this.warnings[scumbag] > 2) {

        const member = message.guild.members.resolve(message.author);

        if (member) {

          const role = message.guild.roles.cache.find(rolen => rolen.name === `${test}newcomer-muted`);

          message.member.roles.add(role).catch(err => console.log(err));

          message.author.send('**You have been muted.**').catch(err => console.log(err));
          mods.send(`@${message.author.username} has been muted.`).catch(err => console.log(err));
        }
      }
      else {
        message.author.send('**Final Warning - If you continue you will be muted.**').catch(err => console.log(err));
      }
    }
    else {
      this.scumbags.push(message.author.username);
      this.warnings.push(1);
      message.author.send('**First Warning**').catch(err => console.log(err));
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