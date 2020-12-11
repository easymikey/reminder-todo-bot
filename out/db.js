"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Datastore = require('nedb');
var path = require('path');
var db = new Datastore({
    filename: path.resolve(__dirname, './todo.db'),
    autoload: true,
    corruptAlertThreshold: 1,
});
db.loadDatabase(function (err) {
    if (err) {
        throw err;
    }
});
var newTodoTask = function (todoTask) {
    return new Promise(function (resolve, reject) {
        return db.insert(todoTask, function (err) {
            return err ? reject(err) : resolve(null);
        });
    });
};
var addTodoTask = function (_a) {
    var text = _a.text, id = _a.id, username = _a.username;
    var item = {
        stamp: Date.now(),
        text: text,
        personalInfo: { id: id, username: username },
    };
    return newTodoTask(item);
};
var getAllTodoTasks = function (id) {
    return new Promise(function (resolve, reject) {
        db.find({ 'personalInfo.id': id })
            .sort({ stamp: 1 })
            .exec(function (err, items) {
            return err ? reject(err) : resolve(items);
        });
    });
};
var deleteTodoTask = function (stamp) {
    return new Promise(function (resolve, reject) {
        db.remove({ stamp: stamp }, {}, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(null);
        });
    });
};
exports.default = { addTodoTask: addTodoTask, getAllTodoTasks: getAllTodoTasks, deleteTodoTask: deleteTodoTask };
