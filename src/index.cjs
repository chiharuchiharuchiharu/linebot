const express = require("express");
const line = require("@line/bot-sdk");
const { Pool } = require("pg");

const {
  initDB,
  getUserInfo,
  addUser,
  getWeekdates,
} = require("./util/util.cjs");
const {
  getReplayTextMessages,
  getWeekBubbleMessage,
  getDayBubbleMessage,
  getTimeBubbleMessage,
  getRegisterBubbleMessage,
  getConfirmMessage,
} = require("./util/messages.cjs");
const {
  deleteShifts,
  getShiftListMessage,
  askDeleteShifts,
} = require("./util/shift.cjs");
const { registerNickname, askNickname } = require("./util/nickname.cjs");

const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};
global.client = new line.Client(config);
global.pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DBNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
global.pool.connect();
const PORT = process.env.PORT || 3000;
const app = express();

app.post("/", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

app.get("/gas", (req, res) => {
  console.log("ok");
  res.json({ ok: true });
});

app.get("/users", (req, res) => {
  global.pool
    .query("select * from users")
    .then((result) => {
      res.json(result.rows);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/shifts", (req, res) => {
  global.pool
    .query("select * from shifts")
    .then((result) => {
      res.json(result.rows);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/get", (req, res) => {
  const day = req.query.day;
  const days = getWeekdates(day);
  global.pool
    .query(`select * from shifts where date in ('${days.join("','")}')`)
    .then((result) => {
      const datum = {};

      result.rows.forEach((item) => {
        const date = item.date;
        const start = item.start_time.toString();
        const end = item.end_time.toString();

        if (!(date in datum)) {
          datum[date] = {
            day: 0,
            data: [],
          };
        }

        datum[date].data.push({
          name: item.nickname,
          start: start,
          end: end,
        });
      })

      res.json(datum);
    })
    .catch((err) => {
      res.json(err);
    });
});

async function handleEvent(event) {
  switch (event.type) {
    case "message":
      if (event.message.type !== "text") return Promise.resolve(null);
      return handleMessageEvent(event);

    case "postback":
      return handlePostbackEvent(event);

    default:
      return getReplayTextMessages(event, ["...?"]);
  }
}

// type == "message" の場合
async function handleMessageEvent(event) {
  const userId = event.source.userId;
  const text = event.message.text;

  // DB にユーザーが登録されていない場合は追加
  await addUser(userId);

  // nickname と status を取得
  const { nickname, status } = await getUserInfo(userId);

  if (status === "del-shifts") {
    return await deleteShifts(event);
  } else if (status === "rg-nick") {
    return await registerNickname(event);
  } else if (!nickname) {
    return await askNickname(event);
  } else if (text.match(/ニックネーム/)) {
    return await askNickname(event, nickname);
  } else if (text.match(/登録/)) {
    return getWeekBubbleMessage(event);
  } else if (text.match(/一覧/)) {
    return await getShiftListMessage(event);
  } else if (text.match(/削除/)) {
    return await askDeleteShifts(event);
  } else {
    return getReplayTextMessages(event, [`${text} とは?`]);
  }
}

// type == "postback" の場合
async function handlePostbackEvent(event) {
  const userId = event.source.userId;
  const data = event.postback.data;

  // DB にユーザーが登録されていない場合は追加
  await addUser(userId);

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
        return getRegisterBubbleMessage(event);
      case "5":
        return getConfirmMessage(event);
    }
  } else {
    return getReplayTextMessages(event, [
      `データの形式が正しくないようです`,
      event.postback.data,
    ]);
  }
}

initDB(global.pool);
app.listen(PORT);
console.log(`Server running at ${PORT}`);
