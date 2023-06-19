"use strict";

const express = require("express");
const line = require("@line/bot-sdk");
const PORT = process.env.PORT || 3000;

const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};

const app = express();

app.get("/", (req, res) => res.send("Hello LINE BOT!(GET)")); //ブラウザ確認用(無くても問題ない)
app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

const client = new line.Client(config);

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }
  let repMessage = "";
  const message = event.message.text;

  switch (message) {
    case "week": {
      repMessage = {
        type: "flex",
        altText: "Flex Message",
        contents: {
          type: "carousel",
          contents: [
            {
              type: "bubble",
              size: "micro",
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "7/24(月)",
                    size: "xl",
                  },
                  {
                    type: "text",
                    text: "〜7/30(日)",
                    size: "xl",
                  },
                ],
                height: "150px",
                justifyContent: "center",
                alignItems: "center",
                action: {
                  type: "message",
                  label: "week",
                  text: "7/24-7/30",
                },
              },
              styles: {
                footer: {
                  separator: false,
                },
              },
            },
            {
              type: "bubble",
              size: "micro",
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "7/31(月)",
                    size: "xl",
                  },
                  {
                    type: "text",
                    text: "〜8/6(日)",
                    size: "xl",
                  },
                ],
                height: "150px",
                justifyContent: "center",
                alignItems: "center",
                action: {
                  type: "message",
                  label: "week",
                  text: "7/31-8/6",
                },
              },
              styles: {
                footer: {
                  separator: false,
                },
              },
            },
            {
              type: "bubble",
              size: "micro",
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "8/7(月)",
                    size: "xl",
                  },
                  {
                    type: "text",
                    text: "〜8/13(日)",
                    size: "xl",
                  },
                ],
                height: "150px",
                justifyContent: "center",
                alignItems: "center",
                action: {
                  type: "message",
                  label: "week",
                  text: "8/7-8/13",
                },
              },
              styles: {
                footer: {
                  separator: false,
                },
              },
            },
            {
              type: "bubble",
              size: "micro",
              body: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    text: "8/14(月)",
                    size: "xl",
                  },
                  {
                    type: "text",
                    text: "〜8/20(日)",
                    size: "xl",
                  },
                ],
                height: "150px",
                justifyContent: "center",
                alignItems: "center",
                action: {
                  type: "message",
                  label: "week",
                  text: "8/14-8/20",
                },
              },
              styles: {
                footer: {
                  separator: false,
                },
              },
            },
          ],
        },
      };
      break;
    }
    case "day": {
      repMessage = {
        type: "flex",
        altText: "Flex Message",
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
                            text: "7/24(月)",
                            size: "xxl",
                          },
                        ],
                        backgroundColor: "#FFD876",
                        offsetEnd: "none",
                        cornerRadius: "lg",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "160px",
                        action: {
                          type: "postback",
                          label: "day",
                          data: "7-24",
                          displayText: "7/24(月)",
                        },
                      },
                      {
                        type: "box",
                        layout: "vertical",
                        contents: [
                          {
                            type: "text",
                            text: "7/25(火)",
                            size: "xxl",
                          },
                        ],
                        backgroundColor: "#FFD876",
                        offsetStart: "none",
                        cornerRadius: "lg",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "160px",
                        action: {
                          type: "postback",
                          label: "day",
                          data: "7-25",
                          displayText: "7/25(火)",
                        },
                      },
                    ],
                    height: "160px",
                    justifyContent: "space-evenly",
                  },
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
                            text: "7/26(水)",
                            size: "xxl",
                          },
                        ],
                        backgroundColor: "#FFD876",
                        offsetEnd: "none",
                        cornerRadius: "lg",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "160px",
                        action: {
                          type: "postback",
                          label: "day",
                          data: "7-26",
                          displayText: "7/26(水)",
                        },
                      },
                      {
                        type: "box",
                        layout: "vertical",
                        contents: [
                          {
                            type: "text",
                            text: "7/27(木)",
                            size: "xxl",
                          },
                        ],
                        backgroundColor: "#FFD876",
                        offsetStart: "none",
                        cornerRadius: "lg",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "160px",
                        action: {
                          type: "postback",
                          label: "day",
                          data: "7-27",
                          displayText: "7/27(木)",
                        },
                      },
                    ],
                    height: "160px",
                    justifyContent: "space-evenly",
                  },
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
                            text: "7/28(金)",
                            size: "xxl",
                          },
                        ],
                        backgroundColor: "#FFD876",
                        offsetEnd: "none",
                        cornerRadius: "lg",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "160px",
                        action: {
                          type: "postback",
                          label: "day",
                          data: "7-28",
                          displayText: "7/28(金)",
                        },
                      },
                      {
                        type: "box",
                        layout: "vertical",
                        contents: [
                          {
                            type: "text",
                            text: "7/29(土)",
                            size: "xxl",
                          },
                        ],
                        backgroundColor: "#FFD876",
                        offsetStart: "none",
                        cornerRadius: "lg",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "160px",
                        action: {
                          type: "postback",
                          label: "day",
                          data: "7-29",
                          displayText: "7/29(土)",
                        },
                      },
                    ],
                    height: "160px",
                    justifyContent: "space-evenly",
                  },
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
                            text: "7/30(日)",
                            size: "xxl",
                          },
                        ],
                        backgroundColor: "#FFD876",
                        offsetEnd: "none",
                        cornerRadius: "lg",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "160px",
                        action: {
                          type: "postback",
                          label: "day",
                          data: "7-30",
                          displayText: "7/30(日)",
                        },
                      },
                      {
                        type: "box",
                        layout: "vertical",
                        contents: [
                          {
                            type: "text",
                            text: "キャンセル",
                            size: "xxl",
                          },
                        ],
                        backgroundColor: "#FFD876",
                        offsetStart: "none",
                        cornerRadius: "lg",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "160px",
                        action: {
                          type: "postback",
                          label: "day",
                          data: "cancel",
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
      };

      break;
    }
    case "register": {
      repMessage = {
        type: "flex",
        altText: "Flex Message",
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
                            size: "xl",
                            action: {
                              type: "postback",
                              label: "register",
                              data: "yes",
                              displayText: "はい",
                            },
                          },
                        ],
                        backgroundColor: "#FFD876",
                        offsetEnd: "none",
                        cornerRadius: "lg",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "160px",
                        action: {
                          type: "postback",
                          label: "day",
                          data: "7-24",
                          displayText: "7/24(月)",
                        },
                      },
                      {
                        type: "box",
                        layout: "vertical",
                        contents: [
                          {
                            type: "text",
                            text: "キャンセル",
                            size: "xl",
                            action: {
                              type: "postback",
                              label: "register",
                              data: "cancel",
                              displayText: "キャンセル",
                            },
                          },
                        ],
                        backgroundColor: "#FFD876",
                        offsetStart: "none",
                        cornerRadius: "lg",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "160px",
                        action: {
                          type: "postback",
                          label: "day",
                          data: "7-25",
                          displayText: "7/25(火)",
                        },
                      },
                    ],
                    height: "40px",
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
      };

      break;
    }

    default: {
      repMessage = {
        type: "text",
        text: message,
      };
    }
  }
  return client.replyMessage(event.replyToken, repMessage);
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);
