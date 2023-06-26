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
      return getWeekBubbleMessage(event);
    } else {
      return getReplayTextMessage(event, `${text} とは？`);
    }
  });
}

function handlePostbackEvent(event) {
  const userId = event.source.userId;
  const data = event.postback.data;

  db.serialize(() => {
    db.run(`insert or ignore into users values("${userId}", "")`);

    if (data.match(/^#[0-9]/)) {
      const state = data[1];

      switch (state) {
        case "0":
          return getWeekBubbleMessage(event);
        case "1":
          return getDayBubbleMessage(event);
        case "2":
        case "3":
          return getTimeBubbleMessage(event, parseInt(state));
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

function getWeekBubbleMessage(event) {
  const weeks = ["6/26", "7/3", "7/10"];
  const weekBubbles = weeks.map((first) => {
    const last = getWeekLastDate(first);

    return {
      type: "bubble",
      size: "micro",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `${first}(月)`,
            color: "#ffffff",
            size: "xl",
            align: "start",
            gravity: "center",
            wrap: true,
            margin: "sm",
          },
          {
            type: "text",
            text: `~${last}(日)`,
            color: "#ffffff",
            size: "xl",
            margin: "sm",
          },
        ],
        action: {
          type: "postback",
          label: "action",
          data: `#1 ${first} ${last}`,
          displayText: `${first} - ${last}`,
        },
        spacing: "sm",
        height: "150px",
        alignItems: "center",
        justifyContent: "center",
      },
      styles: {
        body: {
          backgroundColor: "#393e46",
        },
        footer: {
          separator: false,
        },
      },
    }
  })
  return client.replyMessage(event.replyToken, [
    {
      type: "text",
      text: "どの週のシフトを登録しますか?",
    },
    {
      type: "flex",
      altText: "週を選択してください",
      contents: {
        type: "carousel",
        contents: weekBubbles,
      },
    },
  ]);
}

function getDayBubbleMessage(event) {
  const selectedFirstDate = event.postback.data.split(" ")[1];
  const dates = getWeekdates(selectedFirstDate);

  const days = ["月", "火", "水", "木","金","土","日",];
  const content = dates.map((date, i) => {
    return {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `${date}(${days[i]})`,
          size: "lg",
        },
      ],
      backgroundColor: "#FFD876",
      justifyContent: "center",
      alignItems: "center",
      cornerRadius: "lg",
      offsetEnd: "none",
      width: "160px",
      action: {
        type: "postback",
        label: "day",
        data: `#2 ${date}`,
        displayText: `${date}(${days[i]})`,
      },
    };
  });

  return client.replyMessage(event.replyToken, [
    {
      type: "text",
      text: "どの日のシフトを登録しますか?",
    },
    {
      type: "flex",
      altText: "日を選択してください",
      contents: {
        type: "carousel",
        contents: [
          {
            type: "bubble",
            size: "giga",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [content[0], content[1]],
                  height: "160px",
                  justifyContent: "space-evenly",
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [content[2], content[3]],
                  height: "160px",
                  justifyContent: "space-evenly",
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [content[4], content[5]],
                  height: "160px",
                  justifyContent: "space-evenly",
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    content[6],
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: "キャンセル",
                          size: "lg",
                        },
                      ],
                      backgroundColor: "#FFD876",
                      justifyContent: "center",
                      alignItems: "center",
                      cornerRadius: "lg",
                      offsetStart: "none",
                      width: "160px",
                      action: {
                        type: "postback",
                        label: "day",
                        data: "#2 cancel",
                        displayText: "キャンセル",
                      },
                    },
                  ],
                  height: "160px",
                  justifyContent: "space-evenly",
                },
              ],
              spacing: "md",
            },
            styles: {
              footer: {
                separator: false,
              },
            },
          },
        ],
      },
    },
  ]);
}

function getTimeBubbleMessage(event, state) {
  let data = {};

  const times = {};
  let startTime = 8;
  let endTime = 21;

  if(state == 2){
    data.date = event.postback.data.split(" ")[1];
  }else{
    const start = parseInt(event.postback.data.split(" ")[2]);
    data = JSON.parse(event.postback.data.split(" ")[2]);
    data.start = start;
    startTime = start + 1;
    endTime = 22;
  }

  for(let i = startTime; i <= endTime; i++) times.push(i);

  const content = times.map((time) => {
    return {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `${time}時`,
        },
      ],
      backgroundColor: "#ffd876",
      justifyContent: "center",
      alignItems: "center",
      cornerRadius: "xxl",
      action: {
        type: "postback",
        label: "time",
        data: `#${state + 1} ${time} ${JSON.stringify(data)}`,
        displayText: `${time}時`,
      },
    };
  });

  return client.replyMessage(event.replyToken, [
    {
      type: "text",
      text: `${state == 2 ? "開始" : "終了"}時間を選択してください`,
    },
    {
      type: "flex",
      altText: `${state == 2 ? "開始" : "終了"}時間を選択してください`,
      contents: {
        type: "carousel",
        contents: [
          {
            type: "bubble",
            size: "micro",
            body: {
              type: "box",
              layout: "vertical",
              contents: content,
              spacing: "md",
            },
            styles: {
              footer: {
                separator: false,
              },
            },
          },
        ],
      },
    },
  ]);
}

function getWeekLastDate(date) {
  const first = new Date(date);
  const last = new Date(first.getTime() + 6 * 24 * 60 * 60 * 1000);

  return `${last.getMonth() + 1}/${last.getDate()}`;
}

// 一週間分の日付を取得
function getWeekdates(firstDate) {
  const specifiedDate = new Date(firstDate);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(
      specifiedDate.getTime() + i * 24 * 60 * 60 * 1000
    );
    dates.push(`${currentDate.getMonth() + 1}/${currentDate.getDate()}`);
  }

  return dates;
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);