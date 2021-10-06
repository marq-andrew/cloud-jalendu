
const fs = require('fs');

const Database = require("@replit/database");

const db = new Database();


function reviver(key, value) {
  if (typeof value === "string" && key.includes('time')) {
    return new Date(value);
  }
  return value;
}


function dbsync(data) {
  const fileContent = fs.readFileSync(`./data/${data}.json`);
  db.set(data, JSON.stringify(JSON.parse(fileContent), null, 2));
}

module.exports.bumpbots = {};
module.exports.bumpers = {};


module.exports.hearts = function(number) {

  if (isNaN(number) || number < 0) {
    return '';
  }
  else {
    return ":heart:".repeat(number / 5 ** 5) +
      ":orange_heart:".repeat(number % 5 ** 5 / 5 ** 4) +
      ":yellow_heart:".repeat(number % 5 ** 4 / 5 ** 3) +
      ":green_heart:".repeat(number % 5 ** 3 / 5 ** 2) +
      ":blue_heart:".repeat(number % 5 ** 2 / 5 ** 1) +
      ":purple_heart:".repeat(number % 5 ** 1 / 5 ** 0);
  }
}

const hearts = module.exports.hearts;

module.exports.bumper = function(bot, message, action) {

  // var fileContent = fs.readFileSync('./data/bumpers.json');
  // bumpers = JSON.parse(fileContent);

  const result = new Object();

  let bumpbot;

  if (action === 'bump') {
    if (this.bumpers[bot]) {
      bumpbot = this.bumpers[bot];
    }
    else {
      bumpbot = new Object();
    }

    if (bumpbot[message.author.id]) {
      bumpbot[message.author.id].tries = bumpbot[message.author.id].tries + 1;
      bumpbot[message.author.id].lasttime = new Date();
    }
    else {
      const newbumper = new Object();

      newbumper.name = message.author.username;
      newbumper.tries = 1;
      newbumper.bumps = 0;
      newbumper.lasttime = new Date();

      bumpbot[message.author.id] = newbumper;
    }

    this.bumpers[bot] = bumpbot;

    db.set('bumpers', JSON.stringify(this.bumpers))
      .then(() => { })
      .catch(err => { console.log(err) });

    // fs.writeFileSync('./data/bumpers.json', JSON.stringify(bumpers, null, 2), 'utf-8');

    result.name = bumpbot[message.author.id].name;
    result.bumps = bumpbot[message.author.id].bumps;

    return result;
  }
  else {
    if (!this.bumpers[bot]) {
      result.name = 'unknown';
      result.bumps = 0;

      return result;
    }
    else {
      bumpbot = this.bumpers[bot];

      var lastbumptime = '';
      var lastbumper = '';

      for (const [id, bumper] of Object.entries(bumpbot)) {
        if (bumper.lasttime > lastbumptime) {
          lastbumptime = bumper.lasttime;
          lastbumper = id;
        }
      }

      if (action === 'bumped') {
        bumpbot[lastbumper].bumps = bumpbot[lastbumper].bumps + 1;

        this.bumpers[bot] = bumpbot;

        db.set('bumpers', JSON.stringify(this.bumpers))
          .then(() => { })
          .catch(err => { console.log(err) });

        // fs.writeFileSync('./data/bumpers.json', JSON.stringify(bumpers, null, 2), 'utf-8');
      }

      result.name = bumpbot[lastbumper].name;
      result.bumps = bumpbot[lastbumper].bumps;

      return result;
    }
  }
}

module.exports.bumpbot = function(message) {

  // var fileContent = fs.readFileSync('./data/bumpbots.json');
  // bumpbots = JSON.parse(fileContent);

  if (this.bumpbots[message.author.id]) {
    const bumpbot = this.bumpbots[message.author.id];

    let response = '';

    if (bumpbot.response.type === 'embed') {
      if (message.embeds[bumpbot.response.embed_index]) {
        if (message.embeds[bumpbot.response.embed_index][bumpbot.response.embed_field]) {
          response = message.embeds[bumpbot.response.embed_index][bumpbot.response.embed_field];
        }
        else {
          console.error(`bumpbots: message.embeds[${bumpbot.response.embed_index}].${bumpbot.response.embed_field} not found.`);
          return false;
        }
      }
      else {
        console.error(`bumpbots: message.embeds[${bumpbot.response.embed_index}] not found.`);
        return false;
      }
    }
    else if (bumpbot.response.type === 'content') {
      response = message.content;
    }
    else {
      console.error(`bumpbot.response.type '${bumpbot.response.type}' is not implemented.`);
      return false;
    }

    let result = '';

    for (let i = 0; i < bumpbot.success.length; i++) {
      if (response.includes(bumpbot.success[i])) {
        result = 'success';
        console.log(`${bumpbot.success[i]} ${result}`);
        break;
      }
    }

    if (result === '') {
      for (let i = 0; i < bumpbot.failure.length; i++) {
        if (response.includes(bumpbot.failure[i])) {
          result = 'failure';
          console.log(`${bumpbot.failure[i]} ${result}`);
          break;
        }
      }
    }

    if (result === '') {
      for (let i = 0; i < bumpbot.unknown.length; i++) {
        if (response.includes(bumpbot.unknown[i])) {
          result = 'unknown';
          console.log(`${bumpbot.unknown[i]} ${result}`);
          break;
        }
      }
    }

    let rewrite = false;

    if (result === '') {
      result = 'unknown';
      bumpbot.unknown.push(response);
      rewrite = true;
    }
    else if (result === "success") {
      bumpbot.bumptime = message.createdAt;
      bumpbot.nextbumptime = new Date(bumpbot.bumptime.getTime() + bumpbot.delay_minutes * 60000);
      bumpbot.reminder_sent = false;
      rewrite = true;
    }

    if (rewrite) {
      this.bumpbots[message.author.id] = bumpbot;
      // fs.writeFileSync('./data/bumpbots.json', JSON.stringify(bumpbots, null, 2), 'utf-8');
      db.set('bumpbots', JSON.stringify(this.bumpbots))
        .then(() => { })
        .catch(err => { console.log(err) });
    }

    if (result === "success") {
      return true;
    }
    else {
      return false;
    }
  }
}


module.exports.bumpremind = function(client, output) {

  // var fileContent = fs.readFileSync('./data/bumpbots.json');
  // bumpbots = JSON.parse(fileContent);

  for (const [id, bumpbot] of Object.entries(this.bumpbots)) {
    const currenttime = new Date();
    const nextbumptime = new Date(bumpbot.nextbumptime);
    const remindertime = new Date(bumpbot.remindertime);
    const until = Math.abs((nextbumptime - currenttime) / 60000);
    let reply = '';
    if (currenttime > nextbumptime) {
      if (bumpbot.reminder_sent) {
        reply = `Please bump ${bumpbot.name} (${bumpbot.bump_command}). I've been waiting for the bump for ${until.toFixed(0)} minutes :pleading_face:`;
      }
      else {
        const channel = client.channels.cache.get(bumpbot.bump_channel);
        channel.send(`Time to bump ${bumpbot.name} (${bumpbot.bump_command}) :scream:`);
        reply = `Time to bump ${bumpbot.name} (${bumpbot.bump_command}) :scream:`;
        bumpbot.reminder_sent = true;
        bumpbot.remindertime = new Date(currenttime.getTime() + 60 * 60000);

        this.bumpbots[id] = bumpbot;
        // fs.writeFileSync('./data/bumpbots.json', JSON.stringify(bumpbots, null, 2), 'utf-8');
        db.set('bumpbots', JSON.stringify(this.bumpbots))
          .then(() => { })
          .catch(err => { console.log(err) });
      }
    }
    else {
      reply = `Please wait another ${until.toFixed(0)} minutes to bump ${bumpbot.name} :drool:`;
    }

    if (!output) {
      console.log(reply);
    }
    else {
      output.send(reply);
    }
  }
}

module.exports.data = function(message, source = 'data') {
  if (source === 'data') {
    message.channel.send(JSON.stringify(this.bumpbots, null, 2));
    message.channel.send(JSON.stringify(this.bumpers, null, 2));
  }
}

module.exports.init = function(client) {

  // dbsync('bumpers');
  // dbsync('bumpbots');
db.delete("bumpbots.bumpers")
.then(() => {})
.catch(err => { console.log(err) });

  db.list().then(keys => {console.log(keys)});

  const botcom = client.channels.cache.get('834013095805452318');

  db.get('bumpbots')
    .then(value => {
      this.bumpbots = JSON.parse(value, reviver);

      for (const [id, bumpbot] of Object.entries(this.bumpbots)) {
        let insync = false;
        botcom.messages.fetch({ limit: 100 }).then(messages => {
          messages.forEach(message => {
            if (id === message.author.id && !insync) {
              const messagetime = message.createdAt;
              const bumptime = new Date(bumpbot.bumptime);
              const difference = Math.abs(messagetime - bumptime);
              if (difference < 1000) {
                console.log(`${bumpbot.name} in sync (${difference} difference)`);
                insync = true;
              }
              else {
                console.log(`${bumpbot.name} out of sync (${difference} difference - trying to resync)`);
                if (this.bumpbot(message)) {
                  insync = true;
                }
              }
            }
          });
        });
      }
    })
    .catch(err => { console.log(err) });

  db.get('bumpers')
    .then(value => {
      this.bumpers = JSON.parse(value, reviver);
    })
    .catch(err => { console.log(err) });
}

module.exports.bumperlist = function(message) {

  // var fileContent = fs.readFileSync('./data/bumpers.json');
  // bumpbots = JSON.parse(fileContent);

  const players = new Object();

  for (const [bumpbotid, bumpbot] of Object.entries(this.bumpers)) {
    players[bumpbotid] = [];
    for (const [bumperid, bumper] of Object.entries(bumpbot)) {
      if (bumper.bumps > 0) {
        const player = new Object();
        player.name = bumper.name;
        player.bumps = bumper.bumps;
        player.hearts = hearts(bumper.bumps);
        players[bumpbotid].push(player);
      }
      players[bumpbotid].sort((a, b) => b.bumps - a.bumps);
    }
  }

  let reply = '';

  for (const [name, bumpers] of Object.entries(players)) {
    reply = reply + `\n\n__${name}__`;
    for (i = 0; i < bumpers.length; i++) {
      reply = reply + `\n${(bumpers[i].name).padEnd(30,' ')}`;
      reply = reply + `${String(bumpers[i].bumps).padStart(5,' ')}`;
      reply = reply + `   ${bumpers[i].hearts}`;
    }
  }
  message.channel.send(reply);
}

module.exports.fix = function() {
  console.log(this.bumpers['disboard']['679465390841135126'].name);
  console.log(this.bumpers['disboard']['679465390841135126'].lasttime);

  this.bumpers['disboard']['679465390841135126'].bumps = this.bumpers['disboard']['679465390841135126'].bumps - 2;

  console.log(this.bumpers['disboard']['523463175216300042'].name);
  console.log(this.bumpers['disboard']['523463175216300042'].lasttime);
  this.bumpers['disboard']['523463175216300042'].bumps = this.bumpers['disboard']['523463175216300042'].bumps + 2;
  this.bumpers['disboard']['523463175216300042'].lasttime = new Date();

  db.set('bumpers', JSON.stringify(this.bumpers))
    .then(() => { })
    .catch(err => { console.log(err) });
}