const Datastore = require('nedb');
const path = require('path');

export type todoTask = {
  text: string;
  stamp: number;
  personalInfo: {
    id: number;
    username: string;
  };
};

type TodoTaskInfo = {
  text: string;
  id: number;
  username: string;
};

const db = new Datastore({
  filename: path.resolve(__dirname, './todo.db'),
  autoload: true,
  corruptAlertThreshold: 1,
});
db.loadDatabase((err) => {
  if (err) {
    throw err;
  }
});
const newTodoTask = (todoTask: todoTask) =>
  new Promise((resolve, reject) =>
    db.insert(todoTask, (err: Error) => {
      return err ? reject(err) : resolve(null);
    }),
  );

const addTodoTask = ({ text, id, username }: TodoTaskInfo) => {
  const item = {
    stamp: Date.now(),
    text,
    personalInfo: { id, username },
  } as todoTask;
  return newTodoTask(item);
};

const getAllTodoTasks = (id: number) =>
  new Promise((resolve, reject) => {
    db.find({ 'personalInfo.id': id })
      .sort({ stamp: 1 })
      .exec((err: Error, items: Array<todoTask>) => {
        return err ? reject(err) : resolve(items);
      });
  });

const deleteTodoTask = (stamp: number) =>
  new Promise((resolve, reject) => {
    db.remove({ stamp }, {}, (err: Error) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(null);
    });
  });

export default { addTodoTask, getAllTodoTasks, deleteTodoTask };
