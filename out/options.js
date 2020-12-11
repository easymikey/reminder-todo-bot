"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateOptions = exports.botOptions = void 0;
var botOptions = {
    greeting: 'Привет, имя, я твой персональный бот ❤️',
    noTodoTask: 'У тебя нет записей! Но ты можешь их добавить просто ввести новую запись.',
    help: {
        greeting: '<b>Напоминалкин</b> идет на помощь!',
        botInfo: 'Я - твой персональный бот, буду вести список твоих дел.\nЧтобы добавить новую запись необходимо просто ввести его, например, купить билет в кино',
        commands: 'Так же у меня есть 2 команды, одной ты уже воспользовался /help - это помощь и /get - для получения списка твоих дел.',
    },
    addTodoTask: 'Добавлена новая запись ',
    taskError: 'Ошибка при добавлении ',
    buttons: {
        completeTodoTask: {
            displayedText: 'Завершить',
            command: 'completeTask',
        },
    },
};
exports.botOptions = botOptions;
var dateOptions = {
    hour12: false,
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
};
exports.dateOptions = dateOptions;
//# sourceMappingURL=options.js.map