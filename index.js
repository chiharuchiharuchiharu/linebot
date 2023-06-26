"use strict";

const express = require("express");
const line = require("@line/bot-sdk");
const sqlite3 = require("sqlite3");

const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};
const client = new line.Client(config);
const PORT = process.env.PORT || 3000;
const app = express();
const db = new sqlite3.Database("./main.db");
db.run(`
    create table if not exists users(
      userId text primary key, 
      nickname text
    )`);
db.run(`
    create table if not exists shifts(
      shift_id integer primary key autoincrement,
      userId text,
      start_date text,
      start_time text,
      end_date text,
      end_time text
    )`);

app.post("/", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

async function handleEvent(event) {
  switch (event.type) {
    case "message":
      if (event.message.type !== "text") return Promise.resolve(null);
      return handleMassageEvent(event);

    case "postback":
      return handlePostbackEvent(event);

    default:
      return Promise.resolve(null);
  }
}

function handleMassageEvent(event) {
  const userId = event.source.userId;
  const text = event.message.text;

  db.serialize(() => {
    db.run(`insert or ignore into users values("${userId}", "")`);

    if (text.match(/登録/)) {
      return getWeekBubbleMassage(event);
    } else {
      return getReplayTextMessage(event, `${text} とは？`);
    }
  });
}

function getWeekBubbleMassage(event) {
  const userId = event.source.userId;
  const data = event.postback.data;

  db.serialize(() => {
    db.run(`insert or ignore into users values("${userId}", "")`);

    if (data.match(/^#[0-9]/)) {
      const state = data[1];

      switch (state) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
      }
    } else {
      return getReplayTextMessage(event, `${text} とは？`);
    }
  });
}

function getReplayTextMessage(event, text) {
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: text,
  });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);