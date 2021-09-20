_Thankyou for you interest in the Jalendu bot._

_Contents_
1. Overview.
2. Application commands.
3. Other commands.
4. Functions.

_1. Overview._

Jalendu is a bot specifically designed for the Gay Men Meditating Discord. He is written in Node.js (Node Javascript) using the Discord.js library (among others). Jalendu was written by Mark Andrew, the Gay Men Meditating founder and admin. He is running on the cloud computing platform Replit. The Jalendu Replit is private (because some sensitive files must be hidden) but the Jalendu code can be found in Mark's github: 

```https://github.com/marq-andrew/cloud-jalendu```

In the documentation of commands below, [parameter] means an optional parameter and [[parameter]] means it is not optional. Don't include the square brackets in your actual command.


_2. Application commands._

Application commands are accessed by typing / in the message field. To use them, type / and you can select the command from the list or keep typing the command name to narrow the list. Type TAB to move to the selections for each option.

**/avatar** [user]

Displays a large version of the [user]'s avatar. If [user] is not selected, your own avatar is displayed.

**/joke** [term]

Replies with a random joke. If [term] is added, Jalendu will search for a joke containing that term.

**/define** [[result]] [[term]]

Replies with the urban dictionary definition/s or [[term]]. [[result]] controls which definition to return when there are more than one. 

  *first* returns the first (most upvoted) definition.
  *all* returns all definitions (warning, there may be many). 
  *random* returns a random definition.

**/moderate** [[command]] [[user]] implements commands required by moderators. Only people with the @moderator role can use these commands.

  *verify* verifies the [[user]] by adding the @verified role, removing the @newcomer role and sending the [[user]] a welcoming and instructional direct message.

  *unverify* unverifies the [[user]] by adding the @newcomer role, and removing the @verified role. That revokes all access to the server except for landing zone.

  *mute newcomer* applies only when [[user]] is a @newcomer. It adds the @newcomer-mutes role so that the [[user]] nolonger has permission to post messages to #landing-zone (or anywhere).

  *unmute newcomer* removes the @newcomer-muted role so that the [[user]] has permission to post messages to #landing-zone.

  *kick* kicks the [[user]] off the server.

  *ban* bans the [[user]] from the server. Banned members are banned by IP and can no longer join even if they change their IDs.

**/readme** sends you a direct message containing the instructions and information about the Jalendu bot that you are reading right now.


_3. Other commands._

Other commands are also accessed by typing /[command] as a message but they are not implemented as application commands and they are mostly only of use to the server Admins and the bot developers. They are included here for transparency.

**/welcome** re-generates the welcome message for the #landing-zone channel. WARNING: this command will delete all other messages in the channel. Therefor it is restricted to only moderators.

**/newcomer** replies with a report on the newcomers waiting in the landing zone channel and their status at the last newcomer check performed by Jalendu. See below in functions. (newcomers are reminded of the entry requirements after two days and kicked after 7 days).

**/mclear** [number] is a moderator only command that deletes the last [number] of messages from the channel.

**/channel** regenerates the channel directories.

**/test** [message] tests the phrase in Jalendu's auto-moderation functions (see below) that is applied to the messages of unverified members in landing zone. It replies with the auto-moderation function that would be triggered and the first word in the message that would have triggered it.

**/setup** re-reads the JSON containing the auto-moderation trigger words and phrases into memory. It doesn't reply with anything and shoould only be of interest to Admins.

**/datacheck** checks the auto-moderation trigger words and phrases for duplication and redundancy. These are used to not only check the newcomers messages for words and phrases that trigger auto-verification but also for homophobic and racist language, other forms of abuse or attemps to hack our server. Since to command responds with words and phrases that may be offensive as well as those that can be used to automatically trigger verification, this command is restricted to moderators.


_4. Functions._

**Automoderation** Automoderation only applies to the messages of unverified newcomers in the #landing-zone channel. All messages by unverified newcomers as well as any auto-moderation action are logged into the #landing-zone-log channel. The messages are scanned and compared to a set of lists of key words and phrases that trigger an auto-moderation command. Messages that trigger an auto-moderation command are immediately deleted and then the command activates. The commands are:

  *verify* The message author is verified in the same way as when the /moderate verify application command is activated as described above.

  *homophobic*, *racist*, *profanity*, *URLs or file links* result in the message author being warned in a direct message. If they write another message that triggers these commands, they are sent a final warning. If they write a third message, the @newcomer-muted role is assigned to them and they lose permission to write messages in the #landing-zone channel, which is the only channel they have access to.

**Newcomer reminder and exclusion** Every 120 minutes, Jalendu scans through the list of unverified newcomers. If they joined more that 2 days ago, they are sent a direct message reminding them of the entry requirements. If they joined more than 7 days ago, they are kicked off the server. This reduces the exposure of legitimate members and their entry messages to potential abusers.

This code also cleans up the newcomer roles for verified members if they are still applied and adds the @member role that is used to tell us that they were previously a verified member if they leave and return.

**Landing zone channel message clean-up**. Every 120 minutes, Jalendu scans the messages in the landing zone channel. Messages in the landing zone more than three days old are deleted. Messages written by people who have left the server are immediately deleted. Messages by verified members or messages by moderators mentioning (to or replying to) verified members are immediately deleted. Therefor after this action, the landing zone only contains the pinned welcome message plus messaged by newcomers or moderators that are less than three days old. This protects verified members and their landing zone messages from exposure to potential abusers.

**Extraneous reaction roles in #roles.** The #roles channel has a set of reaction roles questions that self-set roles and channel permissions. New discord users are easliy confused about how to properly respond to these questoins and this confusioin is increased by members adding additonal reaction emojis to these questions. There for every 120 minutes, Jalendu checks the questions in #roles and removes any additional reaction emojis.

**DISBOARD bump reminders.** Jalendu keeps track of bumps to the Disboard bot and reminds users when it is time to bump again. He then sends a thankyou message when they do. (The Disboard bot ignores messages from other bots so Jalendu can't bump himself.) This will be expanded to other bump bots as they are added.

**Application commands permissions.** Jalendu sets permiissions on application commands because this needs to be done programmatically. Discord has not yet completed the full functionality of application commands.

**Member join and leave** When a member joins the server, Jalendu sends a message to the #system-messages channel with an enlarged version of their avatar. The avatar can tell moderators a lot about a prospective member. Jalendu also logs a member leaving.

**Voice channel usage logging**. Jalendu DOES NOT record the content of voice channels on the server however he does record who joined what channel, when, how long they were there and the percentage of the time that they had their camera on. I understand that this information is highly sensitive and so server owner @marq_andrew has any access to it and would only be accessed in case there was a complaint about something that happened in a vc room that required investigation by moderators.

**Jalendu chat bot**. This is some experimentation I am doing with the idea of a chat bot. It only relates to direct messages that users send to Jalendu as a user. The aim of this code is to program Jalendo to respond to your direct messages to him.