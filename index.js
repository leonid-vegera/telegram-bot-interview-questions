const {getQuestion} = require('./utils/index');
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');
require('dotenv').config();

const bot = new Bot(process.env.BOT_TOKEN_KEY);

const sections = ["HTML", "CSS", "JavaScript", "React", "Vue", "Node"]

bot.api.setMyCommands([
  { command: "start", description: "Запустити бот" },
  { command: "about", description: "Загальний опис боту" },
  { command: "help", description: "Показати допоміжний текст" },
  { command: "settings", description: "Відкрити налаштування" },
]);

bot.command('start', async (ctx) => {
  // const startKeyBoard = new Keyboard().(sections.map(section => `.text(${section})`))
  const startKeyBoard = new Keyboard()
    .text("HTML")
    .text("CSS")
    .text("JavaScript").row()
    .text("React")
    .text("Vue")
    .text("Node")
    .resized();
  await ctx.reply('Вітаємо в чат-боті фронтенду! 🍻 \nТут ти зможеш перевірити свої знання і вивчити щось новеньке')
  await ctx.reply('Обери тему, яку хочеш перевірити', {
    reply_markup: startKeyBoard,
  })
})

bot.command('about', async (ctx) => {
  await ctx.reply('Ми допоможемо тобі краще розібратись в основних технологіях ВЕБ-розробки')
})

// bot.on("message", async (ctx) => {
//   await ctx.reply('Hi')
// })

bot.hears(sections, async (ctx) => {
  const topic = ctx.message.text;
  const question = getQuestion(topic);

  const inlineKeyboard = !!question.hasOptions ? (
    new InlineKeyboard()
    .text(`${question.options[0].text}`, JSON.stringify({type: ctx.message.text, questionId: 1}))
    .text(`${question.options[1].text}`, JSON.stringify({type: ctx.message.text, questionId: 1})).row()
    .text(`${question.options[2].text}`, JSON.stringify({type: ctx.message.text, questionId: 1}))
    .text(`${question.options[3].text}`, JSON.stringify({type: ctx.message.text, questionId: 1}))
  ) : (
    new InlineKeyboard()
    .text("Дізнатись відповідь", JSON.stringify({type: ctx.message.text, questionId: 1}))
  );

  await ctx.reply(`${question.text}`,
    {reply_markup: inlineKeyboard})
})

bot.on('callback_query:data', async (ctx) => {
  if (ctx.callbackQuery.data === 'Cancel') {
    await ctx.reply('Відміна!')
    await ctx.answerCallbackQuery()
    return;
  }
  const callbackData = JSON.parse(ctx.callbackQuery.data);
  await ctx.reply(`${callbackData.type} - це складова частина Фронтенду`);
  await ctx.answerCallbackQuery();
})

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start()
