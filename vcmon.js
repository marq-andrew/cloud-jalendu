
const Database = require("@replit/database");

const db = new Database();

const fs = require('fs');

const table = require('text-table');

const format = require('format-duration');


module.exports.vcmon_sessions = {};
module.exports.vcmon_usage = {};


function reviver(key, value) {
  if (typeof value === "string" && (key.includes('time') || key.includes('start') || key.includes('end'))) {
    return new Date(value);
  }
  return value;
}


module.exports.init = function() {

  db.get('vcmon_usage')
    .then(value => {
      this.vcmon_usage = JSON.parse(value, reviver);
    })
    .catch(err => { console.log(err) });

  db.get('vcmon_sessions')
    .then(value => {
      this.vcmon_sessions = JSON.parse(value, reviver);
    })
    .catch(err => { console.log(err) });
}


module.exports.commands = function(message) {
  if (message.content === '/vcmon dump') {
    fs.writeFileSync('./data/vcmon_usage.json', JSON.stringify(this.vcmon_usage, null, 2), 'utf-8');

    fs.writeFileSync('./data/vcmon_sessions.json', JSON.stringify(this.vcmon_sessions, null, 2), 'utf-8');
  }
  else if (message.content === '/vcmon summary') {
    console.log(this.summary(message.client));
  }
  else if (message.content === '/vcmon reset sessions') {
    this.vcmon_sessions = new Object();

    db.set('vcmon_sessions', JSON.stringify(this.vcmon_sessions))
      .then(() => { })
      .catch(err => { console.log(err) });
  }
  else if (message.content === '/vcmon reset usage') {
    this.vcmon_usage = new Object();

    db.set('vcmon_usage', JSON.stringify(this.vcmon_usage))
      .then(() => { })
      .catch(err => { console.log(err) });
  }
}


module.exports.summary = async function(client) {

  const date = new Date();

  let summary = [];

  for (let i = 0; i < 48; i++) {
    summary[i] = new Object();
    summary[i].UTC = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, i * 30, 0, 0));
  }

  var name;

  for (const [channelId, vc] of Object.entries(this.vcmon_usage)) {

    name = (vc.name || channelId);

    for (let i = 0; i < 48; i++) {
      summary[i][name] = 0;
    }

    for (const [id, duration] of Object.entries(vc)) {
      let time = new Date(id);
      if (id !== 'name') {
        if (time < Date.now() - 14 * 24 * 60 * 60 * 1000) {
          delete vc[id];
        }
        else {
          index = Math.floor(time.getUTCHours() * 2) + (time.getUTCMinutes() === 30);

          summary[index][name] = (summary[index][name] || 0) + (duration || 0);
        }
      }
    }
  }

  return summary;
}


module.exports.calendar = async function() {
  var array = await this.summary();

  var html = '<!DOCTYPE html>\n<html>\n<head>\n';

  html = html + '<style>\n' + fs.readFileSync(`./public/css/css.css`) + '</style>\n';

  html = html + '<script type="text/javascript">\n' + fs.readFileSync(`./public/js/js.js`) + '</script>\n';

  html = html + '</head>\n<body onload="onload();">\n';

  html = html + '<h1><div>G+MM Discord - Practice Times</div><div></div></h1>\n';

  var head = '', cols = 1;

  for (const [id, data] of Object.entries(array[0])) {
    if (!id.includes('test')) {
      head = head + `<th style="width:60px">${id.replace(/-/g, '<br>')}</th>`;
      if (id === 'UTC') {
        head = head + `<th style="width:80px">Local<br>Time</th>`;
      }
      cols = cols + 1;
    }
  }

  html = html + '<table class="j-table">\n';

  html = html + `<tfoot><tr><td colspan="${cols}">Rolling 14 days activity in the vc rooms. Numbers are the total minutes in each half-hour period.</td></tr></tfoot>\n`;

  html = html + `<thead>\n<tr>\n${head}\n</tr>\n</thead>\n`;


  html = html + `<tbody >\n`;

  for (var i = 0; i < array.length; i++) {
    html = html + `<tr>`;
    for (const [id, data] of Object.entries(array[i])) {
      if (!id.includes('test')) {
        if (id === 'UTC') {
          let hhmmss = ("0" + data.getUTCHours()).slice(-2) + ":" + ("0" + data.getUTCMinutes()).slice(-2);

          html = html + `<td><div class="iso" hidden>${data.toISOString()}</div><div>${hhmmss}</div></td>`;
          html = html + `<td><div class="local"></div></td > `;
        }
        else {
          html = html + `<td> ${Math.round(data / (1000 * 60))}</td>`;
        }
      }
    }
    html = html + `</tr>\n`;
  }
  html = html + '</tbody>\n</table>\n</body>\n<html>';

  return html;
}


module.exports.usagecount = async function(client, channelId, start, end, duration) {

  if (duration < 5 * 60 * 1000) {
    //return;
  }

  const guild = await client.guilds.cache.get('827888294100074516');

  const channel = await guild.channels.cache.get(channelId);

  let vc, mins, oehr, bohr, stime, etime;

  if (!this.vcmon_usage[channelId]) {
    vc = new Object();
  }
  else {
    vc = this.vcmon_usage[channelId];
  }

  vc.name = channel.name;

  if (start.getUTCMinutes() < 30) {
    mins = 0;
  }
  else {
    mins = 30
  }

  stime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), start.getUTCHours(), start.getUTCMinutes(), start.getUTCSeconds(), start.getUTCMilliseconds()));

  do {
    if (mins === 0) {
      bohr = new Date(Date.UTC(stime.getUTCFullYear(), stime.getUTCMonth(), stime.getUTCDate(), stime.getUTCHours(), 0, 0, 0));
      eohr = new Date(Date.UTC(stime.getUTCFullYear(), stime.getUTCMonth(), stime.getUTCDate(), stime.getUTCHours(), 29, 59, 999));
      mins = 30;
    }
    else {
      bohr = new Date(Date.UTC(stime.getUTCFullYear(), stime.getUTCMonth(), stime.getUTCDate(), stime.getUTCHours(), 30, 0, 0));
      eohr = new Date(Date.UTC(stime.getUTCFullYear(), stime.getUTCMonth(), stime.getUTCDate(), stime.getUTCHours() + 1, 0, 0, 0));
      mins = 0;
    }

    etime = new Date(Math.min(Number(end), Number(eohr)));

    split = Number(etime) - Number(stime);

    vc[bohr.toISOString()] = (vc[bohr.toISOString()] || 0) + split;

    stime = new Date(Number(etime) + 1);

  } while (etime < end);

  this.vcmon_usage[channelId] = vc;

  console.log(this.vcmon_usage);

  db.set('vcmon_usage', JSON.stringify(this.vcmon_usage))
    .then(() => { })
    .catch(err => { console.log(err) });
}


module.exports.log = async function(client, member) {

  const guild = await client.guilds.cache.get('827888294100074516');

  const logs = client.channels.cache.get('880223898413695046');

  const channel = await guild.channels.cache.get(member.channelId);

  if (channel.members.size === 0) {

    if (!this.vcmon_sessions[member.channelId]) {
      console.log('vcmon error sessions end but no sessions');
      return;
    }

    let init = true;
    let title = '';
    const rows = new Array();

    for (const [id, session] of Object.entries(this.vcmon_sessions[member.channelId])) {

      if (init) {
        title = 'Voice session in ' + channel.name + ' has ended.\n';

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
      cols[0] = session.username;
      cols[1] = session.start.toLocaleTimeString('en-US', { hour12: false });
      cols[2] = format(session.duration);
      cols[3] = format(session.selfVideo_duration);
      cols[4] = (session.selfVideo_duration / session.duration)
        .toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 });

      rows.push(cols);
    }

    if (!init) {
      const tab = table(rows);
      logs.send('```' + title + tab + '```');
    }

    delete this.vcmon_sessions[member.channelId];
  }
}


module.exports.session_start = async function(client, member) {

  // const guild = await client.guilds.cache.get('827888294100074516');

  // const newchannel = await guild.channels.cache.get(member.channelId);

  let vc;

  if (!this.vcmon_sessions[member.channelId]) {
    vc = new Object();
  }
  else {
    vc = this.vcmon_sessions[member.channelId];
  }

  let session;

  if (!vc[member.sessionId]) {
    session = new Object();
    const user = client.users.cache.get(member.id);

    session.username = member.id;

    if (user) {
      session.username = user.username;
    }

    session.start = new Date();
    session.end = null;

    session.selfVideo = member.selfVideo;

    if (member.selfVideo) {
      session.selfVideo_on = session.start;
    }
    else {
      session.selfVideo_on = null;
    }

    session.selfVideo_off = null;

    session.streaming = member.streaming;

    if (member.streaming) {
      session.streaming_on = session.start;
    }
    else {
      session.streaming_on = null;
    }

    session.streaming_off = null;

    session.duration = 0;
    session.selfVideo_duration = 0;
    session.streaming_duration = 0;

    vc[member.sessionId] = session;

    this.vcmon_sessions[member.channelId] = vc;

    //console.log(this.vcmon_sessions);
  }
  else {
    this.session_change(client, member);
  }
}


module.exports.session_change = async function(client, member) {

  if (!this.vcmon_sessions[member.channelId]) {
    console.log('vcmon unexpected session_change but no session');
    this.session_begin(client, member);
    return;
  }

  let vc = this.vcmon_sessions[member.channelId];

  if (!vc[member.sessionId]) {
    console.log('vcmon unexpected session_change but no session');
    this.session_begin(client, member);
    return;
  }

  let session = vc[member.sessionId];

  if (!session.selfVideo && member.selfVideo) {
    session.selfVideo_on = new Date();
  }
  else if (session.selfVideo && !member.selfVideo) {
    session.selfVideo_off = new Date();
    session.selfVideo_duration = session.selfVideo_duration + (session.selfVideo_off - session.selfVideo_on);
  }

  session.selfVideo = member.selfVideo;

  if (!session.streaming && member.streaming) {
    session.streaming_on = new Date();
  }
  else if (session.streaming && !member.streaming) {
    session.streaming_off = new Date();
    session.streaming_duration = session.streaming_duration + (session.streaming_off - session.streaming_on);
  }

  session.streaming = member.streaming;

  vc[member.sessionId] = session;

  this.vcmon_sessions[member.channelId] = vc;

  //console.log(this.vcmon_sessions);
}


module.exports.session_end = async function(client, member) {

  if (!this.vcmon_sessions[member.channelId]) {
    console.log('vcmon unexpected session_end but no session');
    return;
  }

  let vc = this.vcmon_sessions[member.channelId];

  if (!vc[member.sessionId]) {
    console.log('vcmon unexpected session_change but no session');
    return;
  }

  let session = vc[member.sessionId];

  if (session.selfVideo) {
    session.selfVideo_off = new Date();
    session.selfVideo_duration = session.selfVideo_duration + (session.selfVideo_off - session.selfVideo_on);
  }

  session.selfVideo = false;

  if (session.streaming) {
    session.streaming_off = new Date();
    session.streaming_duration = session.streaming_duration + (session.streaming_off - session.streaming_on);
  }

  session.streaming = false;

  session.end = new Date();

  session.duration = session.duration + (session.end - session.start);

  vc[member.sessionId] = session;

  this.vcmon_sessions[member.channelId] = vc;

  //console.log(this.vcmon_sessions);

  this.log(client, member);

  this.usagecount(client, member.channelId, session.start, session.end, session.selfVideo_duration);
}


module.exports.update = async function(client, oldmember, newmember) {
  if (newmember.channelId) {
    if (oldmember.channelId) {
      if (newmember.channelId === oldmember.channelId) {
        this.session_change(client, newmember);
      }
      else {
        this.session_end(client, oldmember);
        this.session_start(client, newmember);
      }
    }
    else {
      this.session_start(client, newmember);
    }
  }
  else {
    this.session_end(client, oldmember);
  }

  db.set('vcmon_sessions', JSON.stringify(this.vcmon_sessions))
    .then(() => { })
    .catch(err => { console.log(err) });
}
