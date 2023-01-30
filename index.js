import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { processFromUrl } from './utils/io.js';

dotenv.config();
const bot = new Telegraf(process.env.TOKEN);

const imageReply = async ctx => {
  const file_id = ctx?.message?.document?.file_id || ctx?.message?.photo?.slice(-1)?.[0]?.file_id;
  if (file_id) {
    try {
      const link = (await ctx.telegram.getFileLink(file_id)).href;
      const processed = await processFromUrl(link);
      ctx.telegram.sendMessage(ctx.from.id, '✅ Your result is ready!')
      ctx.telegram.sendDocument(ctx.from.id, {source: processed, filename: 'result.png'});
    }
    catch {
      ctx.telegram.sendMessage(ctx.from.id, '❌ Unsupported file type...')
    }
  }
  else {
      ctx.telegram.sendMessage(ctx.from.id, '🤨 Send image by file or document.')
  }
};

bot.on('message', async ctx => {
  await imageReply(ctx);
});

bot.launch();

