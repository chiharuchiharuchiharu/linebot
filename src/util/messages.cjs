const { getWeekdates, getWeekLastDate, getUserInfo } = require("./util.cjs");

// テキストメッセージを送信する
function getReplayTextMessages(event, texts) {
  const message = texts.map((text) => {
    return {
      type: "text",
      text: text,
    };
  });
  return global.client.replyMessage(event.replyToken, message);
}
exports.getReplayTextMessages = getReplayTextMessages;

// どの週かを選択するバブルメッセージを送信する
exports.getWeekBubbleMessage = function (event) {
  const weeks = ["6/26", "7/3", "7/10", "7/17", "7/24", "7/31"];
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
    };
  });

  return global.client.replyMessage(event.replyToken, [
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
};

// どの日かを選択するバブルメッセージを送信する
exports.getDayBubbleMessage = function (event) {
  const selectedFirstDate = event.postback.data.split(" ")[1];
  const dates = getWeekdates(selectedFirstDate);

  const days = ["月", "火", "水", "木", "金", "土", "日"];
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

  return global.client.replyMessage(event.replyToken, [
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
};

// 時間を選択するバブルメッセージを送信する
exports.getTimeBubbleMessage = function (event, state) {
  let data = {};

  const times = [];
  let startTime = 8;
  let endTime = 21;

  if (state == 2) {
    data.date = event.postback.data.split(" ")[1];
  } else {
    const start = parseInt(event.postback.data.split(" ")[1]);
    data = JSON.parse(event.postback.data.split(" ")[2]);
    data.start = start;
    startTime = start + 1;
    endTime = 22;
  }

  for (let i = startTime; i <= endTime; i++) times.push(i);

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

  return global.client.replyMessage(event.replyToken, [
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
};

// 登録をするかどうかの確認するバブルメッセージを送信する
exports.getRegisterBubbleMessage = function (event) {
  const data = JSON.parse(event.postback.data.split(" ")[2]);
  data.end = parseInt(event.postback.data.split(" ")[1]);

  return global.client.replyMessage(event.replyToken, [
    {
      type: "text",
      text: `以下の内容で登録しますか?\n> ${data.date} ${data.start}時 - ${data.end}時`,
    },
    {
      type: "flex",
      altText: "以上の内容で登録しますか?",
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
                  contents: [
                    {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: "はい",
                          size: "lg",
                        },
                      ],
                      backgroundColor: "#FFD876",
                      justifyContent: "center",
                      alignItems: "center",
                      cornerRadius: "lg",
                      offsetEnd: "none",
                      width: "165px",
                      action: {
                        type: "postback",
                        label: "register",
                        data: `#5 yes ${JSON.stringify(data)}`,
                        displayText: "はい",
                      },
                    },
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
                      width: "165px",
                      action: {
                        type: "postback",
                        label: "register",
                        data: "#5 cancel",
                        displayText: "キャンセル",
                      },
                    },
                  ],
                  height: "40px",
                  justifyContent: "space-evenly",
                },
              ],
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
};

// 確定メッセージを送信する
exports.getConfirmMessage = async function (event) {
  const operation = event.postback.data.split(" ")[1];

  if (operation == "cancel") {
    return getReplayTextMessages(event, ["キャンセルしました"]);
  } else {
    const data = JSON.parse(event.postback.data.split(" ")[2]);
    const userId = event.source.userId;
    console.log("登録", data);

    // nickname  を取得
    const { nickname } = await getUserInfo(userId);

    // 同じ日に同じユーザーが登録しているか
    const { count } = await global.pool
      .query(
        `select count(*) from shifts where user_id='${userId}' and date='${data.date}'`
      )
      .then((result) => {
        return result.rows[0];
      });

    if (count > 0) {
      // 上書きする
      global.pool
        .query(
          `update shifts set 
            start_time=${data.start},
            end_time=${data.end}
          where
            user_id='${userId}'
            and date='${data.date}'`
        )
        .then(() => {
          return getReplayTextMessages(event, ["上書きしました"]);
        })
        .catch((err) => {
          console.log("err", err);
          return getReplayTextMessages(event, ["登録に失敗しました"]);
        });
    } else {
      global.pool
        .query(
          `insert into shifts (
            user_id,
            nickname,
            date,
            start_time,
            end_time
          ) values (
            '${userId}',
            '${nickname}',
            '${data.date}',
            ${data.start},
            ${data.end}
          )`
        )
        .then(() => {
          return getReplayTextMessages(event, ["登録が完了しました"]);
        })
        .catch((err) => {
          console.log("err", err);
          return getReplayTextMessages(event, ["登録に失敗しました"]);
        });
    }
  }
};
