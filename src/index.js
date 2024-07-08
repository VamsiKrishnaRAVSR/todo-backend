const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 8000;

let todos = [];

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "todos"
});

db.connect(function(err) {
  if (err) throw err;
  console.log("connected");
   //   con.destroy()
});

app.get("/todos", (req, res) => {
  db.query(`select * from todoList;`, (err, result) => {
    if (err) throw err
    const todoList  = result.map((ele) => ({
      id: ele.id,
      text: ele.item,
      isCompleted: ele.isCompleted
    }));
    res.json(todoList)
  })
  // res.json(todos);
});

app.post("/todos", (req, res) => {
  const todo = req.body;
  // const newTodo = {
  //   text: todo.text,
  //   isCompleted: todo.isCompleted,
  // };
  const query = `insert into todoList(isCompleted, item) values (${todo.isCompleted}, "${todo.text}")`
  db.query(query, (err, result) => {
    if(err) {
      res.json(err.sqlMessage);
      throw err
    }
    res.json("Successfully added into the database")
  })
});

app.delete("/todos/:id", (req, res) => {
  const todoId = req.params.id;
  db.query(`delete from todoList where id=${todoId}`, (err, result) => {
    if(err) throw err;
    res.send(`Successfully deleted ${todoId} from the database`);
  })
});

app.patch("/todos/:id", (req, res) => {
  const todoId = req.params.id;
  var todoItem = {}
  db.query(`select * from todoList where id =${todoId}`, (err, result) => {
    if (err) {
      throw err
    }
    todoItem['id'] = result[0].id;
    todoItem['isCompleted'] = !result[0].isCompleted
    todoItem['text'] = result[0].item
    db.query(`update todoList set isCompleted= ${todoItem.isCompleted} where id=${todoId}`, (err, result) => {
      if(err) throw err
      res.send("Todo is updated");
    });
  })

});

app.listen(port, () => console.log(`The app is listening on a port ${port}!`));
