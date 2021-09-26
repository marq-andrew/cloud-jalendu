
const fs = require('fs');

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

module.exports.bumper = function(bot, message, action) {

  var fileContent = fs.readFileSync('./bumpers.json');
  bumpers = JSON.parse(fileContent);

  const result = new Object();

  let bumpbot;

  if (action === 'bump') {
    if (bumpers[bot]) {
      bumpbot = bumpers[bot];
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

    bumpers[bot] = bumpbot;

    fs.writeFileSync('./bumpers.json', JSON.stringify(bumpers, null, 2), 'utf-8');

    result.name = bumpbot[message.author.id].name;
    result.bumps = bumpbot[message.author.id].bumps;

    return result;
  }
  else {
    if (!bumpers[bot]) {
      result.name = 'unknown';
      result.bumps = 0;

      return result;
    }
    else {
      bumpbot = bumpers[bot];

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

        bumpers[bot] = bumpbot;

        fs.writeFileSync('./bumpers.json', JSON.stringify(bumpers, null, 2), 'utf-8');
      }

      result.name = bumpbot[lastbumper].name;
      result.bumps = bumpbot[lastbumper].bumps;

      return result;
    }
  }
}

module.exports.bumpbot = function(message) {

  var fileContent = fs.readFileSync('./bumpbots.json');
  bumpbots = JSON.parse(fileContent);

  if (bumpbots[message.author.id]) {
    const bumpbot = bumpbots[message.author.id];

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
      bumpbots[message.author.id] = bumpbot;
      fs.writeFileSync('./bumpbots.json', JSON.stringify(bumpbots, null, 2), 'utf-8');
    }

    if (result === "success") {
      return true;
    }
    else {
      return false;
    }
  }
  else {
    console.log(`${message.author.id} ${message.author.username} is not a recognised bumpbot`);
  }
}

module.exports.bumpremind = function(client) {

  var fileContent = fs.readFileSync('./bumpbots.json');
  bumpbots = JSON.parse(fileContent);

  for (const [id, bumpbot] of Object.entries(bumpbots)) {
    const currenttime = new Date();
    const nextbumptime = new Date(bumpbot.nextbumptime);
    const until = (nextbumptime - currenttime) / 60000;
    if (currenttime > nextbumptime) {
      if (bumpbot.reminder_sent) {
        console.log(`${bumpbot.name} reminder sent. Waiting for bump. (Lost ${until.toFixed(0)} minutes)`)
      }
      else {
        const channel = client.channels.cache.get(bumpbot.bump_channel);
        channel.send(`Time to bump ${bumpbot.name} (${bumpbot.bump_command})`);
        bumpbot.reminder_sent = true;

        bumpbots[id] = bumpbot;
        fs.writeFileSync('./bumpbots.json', JSON.stringify(bumpbots, null, 2), 'utf-8');
      }
    }
    else {
      console.log(`${bumpbot.name} reminder active. Waiting for ${nextbumptime} (${until.toFixed(0)} minutes)`)
    }
  }
}
