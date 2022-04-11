import { Context, Markup, Telegraf, Telegram } from 'telegraf';
import { Update } from 'typegram';

const token: string = process.env.BOT_TOKEN as string;
const telegram: Telegram = new Telegram(token);
const bot: Telegraf<Context<Update>> = new Telegraf(token);

bot.start((ctx) => {
  ctx.reply(`Hello ${ctx.from.first_name} ${ctx.chat.id}!`);
});

bot.help((ctx) => {
  ctx.reply('Send /start to receive a greeting');
  ctx.reply('Send /keyboard to receive a message with a keyboard');
  ctx.reply('Send /quit to stop the bot');
});

bot.command('quit', (ctx) => {
  ctx.telegram.leaveChat(ctx.message.chat.id);
  ctx.leaveChat();
});

bot.command('keyboard', (ctx) => {
  ctx.reply(
    'Keyboard',
    Markup.inlineKeyboard([
      Markup.button.callback('Add RSS source', 'AddRssSource'),
      Markup.button.callback('Remove RSS source', 'RemoveRssSource'),
    ])
  );
});

bot.action('AddRssSource', (ctx) =>
  ctx.reply('AddRssSource')
);

bot.action('RemoveRssSource', (ctx) =>
  ctx.reply('RemoveRssSource')
);

export {
  bot,
  telegram
};
