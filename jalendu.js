
// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed } = require('discord.js');

const fs = require('fs');

const table = require('text-table');

const format = require('format-duration');

const querystring = require('querystring');

const token = process.env['TOKEN'];

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


client.once('ready', () => {
  console.log('Ready!');
});

// Login to Discord with your client's token
client.login(token);

client.on('interactionCreate', async interaction => {

  //console.log(interaction);

  if (interaction.isCommand()) {

    if (interaction.commandName === 'avatar') {
      const username = interaction.options.getString('username');

      if(!username) {
				const embed = new MessageEmbed()
					.setTitle(interaction.user.tag)
					.setColor(0x00ffff)
          .setImage(interaction.user.displayAvatarURL({ format: 'png', size: 2048 }));

        const messageId = await interaction.reply({ embeds: [ embed ], });
      }
			else if(username === 'server') {
				const embed = new MessageEmbed()
					.setTitle(interaction.guild.name)
						.setColor(0x00ffff)
						.setImage(interaction.guild.iconURL({ format: 'png', size: 2048 }));

        const messageId = await interaction.reply({ embeds: [ embed ], });
			}
			else {
        const parse = username.split(/[<>@!]+/);

        const member = interaction.guild.members.cache.get(parse[1]);

        if(!member) {
          interaction.reply(`Can't find a member called "${username}".`);
        }
        else {
          const embed = new MessageEmbed()
            .setTitle(member.user.username)
            .setColor(0x00ffff)
            .setImage(member.user.displayAvatarURL({ format: 'png', size: 2048 }));

          const messageId = await interaction.reply({ embeds: [ embed ], });
        }
			}
    }
  }
});