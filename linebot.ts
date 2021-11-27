// DEBUG=* deno run --allow-read --allow-env --allow-net ./linebot.ts
import { linebot } from 'https://deno.land/x/linebot@v1.1.0/mod.ts'
import { opine, json } from 'https://deno.land/x/opine@1.8.0/mod.ts';

const endpointToWebHook = 'https://workingpartner-linebot.deno.dev/';
const options = {
  channelId: Deno.env.get('CHANNEL_ID') || '',
  channelSecret: Deno.env.get('CHANNEL_SECRET') || '',
  channelAccessToken: Deno.env.get("CHANNEL_ACCESS_TOKEN") || '',
  verify: true
};
const bot = linebot(options);
const app = opine();
const linebotParser = bot.parser(JSON);

app.post(`/${endpointToWebHook}`, linebotParser);

// deno-lint-ignore no-explicit-any
bot.on('message', async (event: any) => {
  let result = await event.reply(event.message.text);
  if (event.message.type === 'text') {
    console.log(((`event.message.type = ${event.message.type} - ${event.message.text}`)));
  } else {
    console.log(((`event.message.type = ${event.message.type}`)));
  }

  switch (event.message.type) {
    case 'text':
      return result;

    case 'sticker':
      return event.reply({
        type: 'sticker',
        packageId: 1,
        stickerId: 1
      });

    default:
      return event.reply('Unknown message: ' + JSON.stringify(event));
  }
});

const port: number = function(): number {
  const maybeStr = Deno.env.get('PORT');
  return typeof maybeStr === 'string' ? parseInt(maybeStr) : 80;
}();

app.listen(port, () => console.log('LineBot is running. Port : ' + port));
