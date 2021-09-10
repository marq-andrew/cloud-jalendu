const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const token = process.env['TOKEN'];
const clientId = process.env['clientID'];
const guildId = process.env['guildID'];

const commands = [
	new SlashCommandBuilder()
  .setName('avatar')
  .setDescription('Displays an enlarged user avatar')
  .addUserOption(option =>
		option.setName('username')
			.setDescription('The username to show')
			.setRequired(false)),
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