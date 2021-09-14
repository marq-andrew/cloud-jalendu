const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const token = process.env['TOKEN'];
const clientId = process.env['clientID'];
const guildId = process.env['guildID'];

const commands = [
  // new SlashCommandBuilder()
  // .setName('nothing')
  // .setDescription('nothing'),

  new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Displays an enlarged user avatar')
    .addUserOption(option =>
      option.setName('username')
        .setDescription('The username to show')
        .setRequired(false))
    .setDefaultPermission(false),

  // new SlashCommandBuilder()
  //   .setName('verify')
  //   .setDescription('Verifies a newcomer')
  //   .addUserOption(option =>
  //     option.setName('username')
  //       .setDescription('The username to verify')
  //       .setRequired(true))
  //   .setDefaultPermission(false),

  new SlashCommandBuilder()
    .setName('moderate')
    .setDescription('Select a moderation command')
    .setDefaultPermission(false)
    .addStringOption(option =>
      option.setName('command')
        .setDescription('The moderation command')
        .setRequired(true)
        .addChoice('verify', 'verify')
        .addChoice('unverify', 'unverify')
        .addChoice('mute newcomer', 'mute')
        .addChoice('unmute newcomer', 'unmute')
        .addChoice('kick', 'kick')
        .addChoice('ban', 'ban'))
    .addUserOption(option =>
      option.setName('username')
        .setDescription('The username to apply')
        .setRequired(true))
]
  .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully registered application commands.');
  } catch (error) {
    console.error(error);
  }
})();