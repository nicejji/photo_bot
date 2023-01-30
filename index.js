import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { processFromUrl } from './utils/io.js';

dotenv.config();
const bot = new Telegraf(process.env.TOKEN);

const imageReply = async ctx => {
  const file_id = ctx?.message?.document?.file_id || ctx?.message?.photo?.slice(-1)?.[0]?.file_id;
  if (file_id) {
    try {
      ctx.telegram.sendMessage(ctx.from.id, '🕜 Идет обработка фото...')
      const link = (await ctx.telegram.getFileLink(file_id)).href;
      const processed = await processFromUrl(link);
      ctx.telegram.sendMessage(ctx.from.id, '✅ Фото обработано!')
      ctx.telegram.sendDocument(ctx.from.id, {source: processed, filename: 'result.png'});
    }
    catch {
      ctx.telegram.sendMessage(ctx.from.id, '❌ Неподдерживаемый формат или слишком большое изображение.')
    }
  }
  else {
      ctx.telegram.sendMessage(ctx.from.id, '🤨 Отправьте фото в виде картинки или документа.')
  }
};

bot.on('message', async ctx => {
  await imageReply(ctx);
});

bot.launch();

