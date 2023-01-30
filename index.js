import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { processFromUrl } from './utils/io.js';

dotenv.config();
const bot = new Telegraf(process.env.TOKEN);

const users = {};

const imageReply = async ctx => {
  const file_id = ctx?.message?.document?.file_id || ctx?.message?.photo?.slice(-1)?.[0]?.file_id;
  if (file_id) {
    try {
      const clusters = users[ctx.from.id] || 3;
      ctx.telegram.sendMessage(ctx.from.id, `🕜 Идет обработка фото на ${clusters} кластеров...`)
      const link = (await ctx.telegram.getFileLink(file_id)).href;
      const processed = await processFromUrl(link, clusters);
      ctx.telegram.sendMessage(ctx.from.id, '✅ Фото обработано!')
      ctx.telegram.sendDocument(ctx.from.id, {source: processed, filename: 'result.png'});
    }
    catch {
      ctx.telegram.sendMessage(ctx.from.id, '❌ Неподдерживаемый формат или слишком большое изображение.')
    }
  }
  else {
      ctx.telegram.sendMessage(ctx.from.id, '❔ Отправьте фото в виде картинки или документа.')
  }
};


bot.command('set', async ctx => {
  // const user_id = ctx?.from.id;
  const clusters = parseInt(ctx.message.text.split(" ").slice(-1)[0]);
  if (!clusters || clusters > 15 || clusters <= 0) {ctx.telegram.sendMessage(ctx.from.id, '🙋 Выберите количество кластеров командой в формате /set n')}
  else {
    users[ctx.from.id] = clusters;
    ctx.telegram.sendMessage(ctx.from.id, `👍 Установлено ${clusters} кластеров.`)
  }
})

bot.on('message', async ctx => {
  await imageReply(ctx);
});

bot.launch();

