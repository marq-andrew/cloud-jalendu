  const channel = message.client.channels.cache.get('874900065142046720');

      channel.messages.fetch({ limit: 100 }).then(async messages => {
        messages.forEach(message => {

          let urlrx1 = new RegExp("$(http:\/\/|https:\/\/|ftp:\/\/|email:\/\/|file:\/\/)?([a-z0-9]+\.?)+");

          let urlrx2 = new RegExp("([a-z0-9]+\.)+(com|co|org|edu|gov|biz|info)$");

          let words = message.content.split(' ');
          for (let i = 0; i < words.length; i++) {
            if (urlrx1.test(words[i]) || urlrx2.test(words[i])) {
              console.log(words[i]);
            }
          }
        });
      });


      // if (message.author.username === 'marq_andrew') {
      //   const channel = message.client.channels.cache.get('837570108745580574');

      //   channel.messages.fetch({ limit: 100 }).then(async messages => {
      //     messages.forEach(message => {
      //       if (message.author.username === 'Jalendu') {
      //         message.delete();
      //       }
      //     });
      //   });
      // }