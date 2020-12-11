"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var telegraf_1 = require("telegraf");
var db_1 = require("./db");
var options_1 = require("./options");
var helpers_1 = require("./helpers");
var buttons = options_1.botOptions.buttons, greeting = options_1.botOptions.greeting, noTodoTask = options_1.botOptions.noTodoTask, addTodoTask = options_1.botOptions.addTodoTask, taskError = options_1.botOptions.taskError, help = options_1.botOptions.help;
var bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
var itemKeyboard = telegraf_1.Markup.inlineKeyboard([
    telegraf_1.Markup.callbackButton(buttons.completeTodoTask.displayedText, buttons.completeTodoTask.command),
]).resize();
var formatItemInfo = function (_a) {
    var text = _a.text, stamp = _a.stamp;
    return "<b>\u041D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u0435</b>: " + text + "\n<b>\u0414\u0430\u0442\u0430</b>: " + helpers_1.getLocaleDate(stamp, options_1.dateOptions) + "\n\n<b>Id</b>: " + stamp;
};
bot.use(telegraf_1.Telegraf.log());
bot.start(function (_a) {
    var reply = _a.reply, username = _a.from.username;
    return reply(greeting.replace('имя', username));
});
bot.command('get', function (_a) {
    var replyWithHTML = _a.replyWithHTML, id = _a.from.id;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            db_1.default.getAllTodoTasks(id)
                .then(function (todoTasks) {
                if (todoTasks.length === 0) {
                    replyWithHTML(noTodoTask);
                    return;
                }
                todoTasks.forEach(function (todoTask) {
                    return replyWithHTML(formatItemInfo(todoTask), telegraf_1.Extra.markup(itemKeyboard));
                });
            })
                .catch(function (_a) {
                var text = _a.text;
                return replyWithHTML(taskError + ("" + text));
            });
            return [2 /*return*/];
        });
    });
});
bot.command('help', function (_a) {
    var replyWithHTML = _a.replyWithHTML;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            return [2 /*return*/, replyWithHTML(help.greeting)
                    .then(function () { return replyWithHTML(help.botInfo); })
                    .then(function () { return replyWithHTML(help.commands); })];
        });
    });
});
bot.on('text', function (_a) {
    var text = _a.message.text, _b = _a.from, id = _b.id, username = _b.username, reply = _a.reply, replyWithMarkdown = _a.replyWithMarkdown;
    var todoItem = { text: text, id: id, username: username };
    db_1.default.addTodoTask(todoItem)
        .then(function () { return replyWithMarkdown(addTodoTask + ("`" + text + "`")); })
        .catch(function (_a) {
        var text = _a.text;
        return reply(taskError + ("" + text));
    });
});
bot.action(buttons.completeTodoTask.command, function (_a) {
    var callbackQuery = _a.callbackQuery, reply = _a.reply, deleteMessage = _a.deleteMessage;
    return __awaiter(void 0, void 0, void 0, function () {
        var stamp;
        return __generator(this, function (_b) {
            stamp = +callbackQuery.message.text
                .split(' ')
                .slice(-1)
                .join(' ');
            db_1.default.deleteTodoTask(stamp).catch(function (_a) {
                var text = _a.text;
                reply(taskError + ("" + text));
            });
            return [2 /*return*/, deleteMessage()];
        });
    });
});
bot.startPolling(1000);
//# sourceMappingURL=index.js.map