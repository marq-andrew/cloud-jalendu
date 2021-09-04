
// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');

const fs = require('fs');

const table = require('text-table');

const format = require('format-duration');

const token = process.env['TOKEN'];

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


client.once('ready', () => {
  console.log('Ready!');
});

// Login to Discord with your client's token
client.login(token);

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) {

    if (interaction.commandName === 'ping') {
      //await interaction.reply('Pong!');
      await interaction.reply({ content: 'Pong!', ephemeral: true });
    }
  }
});