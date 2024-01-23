const {getQuestion} = require('./utils/index');
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');
const { getCorrectAnswer } = require('./utils');
require('dotenv').config();

const bot = new Bot(process.env.BOT_TOKEN_KEY);

const sections = ["HTML", "CSS", "JavaScript", "React", "Випадкове питання"]

bot.api.setMyCommands([
  { command: "start", description: "Запустити бот" },
  { command: "about", description: "Загальний опис боту" },
  // { command: "help", description: "Показати допоміжний текст" },
  // { command: "settings", description: "Відкрити налаштування" },
]);

bot.command('start', async (ctx) => {
  const startKeyBoard = new Keyboard()
    .text("HTML")
    .text("CSS").row()
    .text("JavaScript")
    .text("React").row()
    .text("Випадкове питання")
    .resized();
  await ctx.reply('Вітаємо в чат-боті фронтенду! 🍻 \nТут ти зможеш перевірити свої знання і вивчити щось новеньке')
  await ctx.reply('Обери тему, яку хочеш перевірити', {
    reply_markup: startKeyBoard,
  })
})

bot.command('about', async (ctx) => {
  await ctx.reply('Ми допоможемо тобі краще розібратись в основних технологіях ВЕБ-розробки')
})

bot.hears(sections, async (ctx) => {
  const topic = ctx.message.text;
  const { question, questionTopic } = getQuestion(topic);

  let inlineKeyboard;

  if (!!question.hasOptions) {
    const buttonRows = question.options.map((option) => [
      InlineKeyboard.text(
        option.text,
        JSON.stringify({
          questionId: question.id,
          type: `${questionTopic}-option`,
          isCorrect: option.isCorrect,
        })
      )
    ])
    inlineKeyboard = InlineKeyboard.from(buttonRows);
  } else {
    inlineKeyboard = new InlineKeyboard()
      .text("Дізнатись відповідь", JSON.stringify({type: questionTopic, questionId: question.id}));
  }

  await ctx.reply(`${question.text}`,
    {reply_markup: inlineKeyboard})
})

bot.on('callback_query:data', async (ctx) => {
  const callbackData = JSON.parse(ctx.callbackQuery.data);

  if (!callbackData.type.endsWith('option')) {
    const { questionId, type } = callbackData;
    const answer = getCorrectAnswer(questionId, type);
    await ctx.reply(answer, {
      parse_mode: "HTML",
    });
    await ctx.answerCallbackQuery();
    return;
  }
  const normalizedType = callbackData.type.split('-')[0];
  const correctAnswer = getCorrectAnswer(callbackData.questionId, normalizedType);
  const showResult = callbackData.isCorrect ? 'Вірно!✅' : `Не вірно!⛔\nВірна відповідь: ${correctAnswer}`;
  await ctx.reply(showResult);
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
