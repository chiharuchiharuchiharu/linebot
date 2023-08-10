const { default: e } = require("express");
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
  //const selectedFirstDate = event.postback.data.split(" ")[1];
  //const dates = getWeekdates(selectedFirstDate);
  const dates = [
    "8/22",
    "8/23",
    "8/24",
    "8/25",
    "8/26",
    "8/27",
    "8/28",
    "8/29",
    "8/30",
    "8/31",
  ];
  const days = dates.map((date) => {
    const day = new Date(date).getDay();
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
    return dayOfWeek[day];
  });

  const dayBubbles = dates.map((date, i) => {
    return {
      type: "bubble",
      size: "micro",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `${date}(${days[i]})`,
            color: "#ffffff",
            size: "xl",
            margin: "sm",
          },
        ],
        action: {
          type: "postback",
          label: "day",
          data: `#2 ${date}`,
          displayText: `${date}(${days[i]})`,
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
      text: "どの日のシフトを登録しますか?",
    },
    {
      type: "flex",
      altText: "週を選択してください",
      contents: {
        type: "carousel",
        contents: dayBubbles,
      },
    },
  ]);
};

// 時間を選択するバブルメッセージを送信する
exports.getTimeBubbleMessage = function (event, state) {
  let data = {};

  let startTime = 8;
  let endTime = 21;
  const range = [8, 18];

  if (state == 2) {
    data.date = event.postback.data.split(" ")[1];
  } else {
    data = JSON.parse(event.postback.data.split(" ")[2]);
    data.start = parseInt(event.postback.data.split(" ")[1]);
    range[0] = data.start + 1;
    range[1] = 19;
  }

  const times = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20];

  const content = times.map((time) => {
    let text = `${time}時`;

    if (time == 8) text = "8時半";
    else if (time == 19) text = "18時半";

if (time == 20){
data.start = 19;
      return {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "夜プロ",
            color: "#ffffff",
          },
        ],
        backgroundColor: "#393e46",
        justifyContent: "center",
        alignItems: "center",
        height: "50px",
        cornerRadius: "lg",
        action: {
          type: "postback",
          label: "time",
          data: `#4 21 ${JSON.stringify(data)}`,
          displayText: "夜プロ",
        },
      };
}else if (range[0] <= time && time <= range[1])
      return {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `${time}時`,
            color: "#ffffff",
          },
        ],
        backgroundColor: "#393e46",
        justifyContent: "center",
        alignItems: "center",
        height: "50px",
        cornerRadius: "lg",
        action: {
          type: "postback",
          label: "time",
          data: `#${state + 1} ${time} ${JSON.stringify(data)}`,
          displayText: `${time}時`,
        },
      };
    else
      return {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `${time}時`,
            color: "#888888",
          },
        ],
        backgroundColor: "#393e46",
        justifyContent: "center",
        alignItems: "center",
        height: "50px",
        cornerRadius: "lg",
      };
  });

  // content を半分に分ける
  const half = Math.ceil(content.length / 2);
  const leftContent = content.slice(0, half);
  const rightContent = content.slice(half);

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
            body: {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "box",
                  layout: "vertical",
                  contents: leftContent,
                  width: "50%",
                  spacing: "md",
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: rightContent,
                  spacing: "md",
                },
              ],
              spacing: "md",
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
            body: {
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
                      color: "#ffffff",
                    },
                  ],
                  backgroundColor: "#393e46",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50px",
                  cornerRadius: "lg",
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
                      color: "#ffffff",
                    },
                  ],
                  backgroundColor: "#393e46",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50px",
                  cornerRadius: "lg",
                  action: {
                    type: "postback",
                    label: "register",
                    data: "#5 cancel",
                    displayText: "キャンセル",
                  },
                },
              ],
              spacing: "md",
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
};

exports.getShiftsBubbleMessage = function (event, shifts, canDelete) {
  const shiftsBubbele = shifts.map((shift) => {
    const text = `${shift.date.replace("/", "月")}日 ${shift.start_time}時-${
      shift.end_time
    }時`;
    if (canDelete) {
      return {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: text,
            color: "#ffffff",
          },
        ],
        backgroundColor: "#393e46",
        justifyContent: "center",
        alignItems: "center",
        cornerRadius: "xl",
        action: {
          type: "postback",
          label: "del",
          data: `#9 ${shift.shift_id}`,
          displayText: text,
        },
        height: "40px",
      };
    } else {
      return {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: text,
            color: "#ffffff",
          },
        ],
        backgroundColor: "#393e46",
        justifyContent: "center",
        alignItems: "center",
        cornerRadius: "xl",
        height: "40px",
      };
    }
  });
  return global.client.replyMessage(event.replyToken, [
    {
      type: "flex",
      altText: "以上の内容で登録しますか?",
      contents: {
        type: "carousel",
        contents: [
          {
            type: "bubble",
            size: "deca",
            body: {
              type: "box",
              layout: "vertical",
              contents: shiftsBubbele,
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
