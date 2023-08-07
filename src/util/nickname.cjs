const { getReplayTextMessages } = require("./messages.cjs");

// カウンセラーネームを登録する
exports.registerNickname = async function (event) {
  const text = event.message.text;

  if (text.match(/キャンセル/)) {
    return registerNicknameCancel(event);
  } else {
    return registerNicknameConfirm(event, text);
  }
};

// カウンセラーネーム登録をキャンセルすsる
async function registerNicknameCancel(event) {
  const userId = event.source.userId;
  await global.pool.query(
    `update users set status='none' where user_id='${userId}'`
  );
  return getReplayTextMessages(event, ["キャンセルしました"]);
}

// カウンセラーネーム登録を確定する
async function registerNicknameConfirm(event, nickname) {
  const userId = event.source.userId;
  // nickname がすでに使用されているかどうかを確認
  const { count } = await global.pool
    .query(`select count(*) from users where nickname='${nickname}'`)
    .then((result) => {
      return result.rows[0];
    });

  if (count > 0) {
    return getReplayTextMessages(event, [
      "すでに使用されているカウンセラーネームです",
    ]);
  } else {
    // カウンセラーネームを登録
    global.pool
      .query(
        `update users set nickname='${nickname}', status='rged-nick' where user_id='${userId}'`
      )
      .then(() => {
        return getReplayTextMessages(event, [
          `カウンセラーネームを登録しました\n> ${nickname}`,
        ]);
      })
      .catch((err) => {
        console.log(err);
        return getReplayTextMessages(event, [
          `カウンセラーネームの登録に失敗しました\n> ${nickname}`,
        ]);
      });
  }
}

// カウンセラーネームを聞く
exports.askNickname = async function (event, nickname = "") {
  const userId = event.source.userId;
  if (nickname) {
    await global.pool.query(
      `update users set status='rg-nick' where user_id='${userId}'`
    );
    return getReplayTextMessages(event, [
      `カウンセラーネームを教えてください\nキャンセルする場合は「キャンセル」と送信してください\n現在のカウンセラーネーム「${nickname}」`,
    ]);
  } else {
    await global.pool.query(
      `update users set status='rg-nick' where user_id='${userId}'`
    );
    return getReplayTextMessages(event, ["カウンセラーネームを教えてください"]);
  }
};
