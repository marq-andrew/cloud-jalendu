function test() {
    for (var i = 0; i < message.embeds.length; i++) {
      for (var j = 0; j < badwords.length; j++) {
        if (message.embeds[i].title.includes(badwords[j])){
            message.delete();
            message.channel.send(detectedEmbed)
            break
            }
        }
    }
}