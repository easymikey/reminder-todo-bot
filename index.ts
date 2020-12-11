require('dotenv').config();
import { Context, Telegraf, Markup, Extra } from 'telegraf';
import db, { todoTask } from './db';
import { botOptions, dateOptions } from './options';
import { getLocaleDate } from './helpers';

const {
  buttons,
  greeting,
  noTodoTask,
  addTodoTask,
  taskError,
  help,
} = botOptions;

const bot = new Telegraf<Context>(process.env.BOT_TOKEN);

const itemKeyboard = Markup.inlineKeyboard([
  Markup.callbackButton(
    buttons.completeTodoTask.displayedText,
    buttons.completeTodoTask.command,
  ),
]).resize();

const formatItemInfo = ({ text, stamp }: todoTask) =>
  `<b>Напоминание</b>: ${text}\n<b>Дата</b>: ${getLocaleDate(
    stamp,
    dateOptions,
  )}
\n<b>Id</b>: ${stamp}`;

bot.use(Telegraf.log());

bot.start(({ reply, from: { username } }) =>
  reply(greeting.replace('имя', username)),
);

bot.command('get', async ({ replyWithHTML, from: { id } }) => {
  db.getAllTodoTasks(id)
    .then((todoTasks: Array<todoTask>) => {
      if (todoTasks.length === 0) {
        replyWithHTML(noTodoTask);
        return;
      }
      todoTasks.forEach((todoTask) =>
        replyWithHTML(
          formatItemInfo(todoTask),
          Extra.markup(itemKeyboard),
        ),
      );
    })
    .catch(({ text }) => replyWithHTML(taskError + `${text}`));
});

bot.command('help', async ({ replyWithHTML }) =>
  replyWithHTML(help.greeting)
    .then(() => replyWithHTML(help.botInfo))
    .then(() => replyWithHTML(help.commands)),
);

bot.on(
  'text',
  ({
    message: { text },
    from: { id, username },
    reply,
    replyWithMarkdown,
  }) => {
    const todoItem = { text, id, username };
    db.addTodoTask(todoItem)
      .then(() => replyWithMarkdown(addTodoTask + `\`${text}\``))
      .catch(({ text }) => reply(taskError + `${text}`));
  },
);

bot.action(
  buttons.completeTodoTask.command,
  async ({ callbackQuery, reply, deleteMessage }) => {
    const stamp = +callbackQuery.message.text
      .split(' ')
      .slice(-1)
      .join(' ');
    db.deleteTodoTask(stamp).catch(({ text }) => {
      reply(taskError + `${text}`);
    });
    return deleteMessage();
  },
);

bot.startPolling(1000);
