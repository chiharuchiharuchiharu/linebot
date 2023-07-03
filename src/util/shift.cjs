const { getReplayTextMessages } = require("./messages.cjs");

// シフト一覧メッセージを取得する
exports.getShiftListMessage = async function (event) {
  const text = await getShiftListText(event);

  if (!text)
    return getReplayTextMessages(event, ["シフトが登録されていません"]);
  else return getReplayTextMessages(event, [text]);
};

// シフト一覧を取得する
async function getShiftListText(event) {
  const shifts = await getShiftList(event);
  const text = shifts.map((shift, i) => {
    return `${i + 1}. ${shift.date} ${shift.start_time}時 - ${
      shift.end_time
    }時`;
  });

  return text.join("\n");
}
exports.getShiftListText = getShiftListText;

// シフト一覧を取得する
async function getShiftList(event) {
  // 日付順,start_time 順にソートして取得
  const userId = event.source.userId;
  const shifts = await global.pool
    .query(
      `select * from shifts where user_id='${userId}' order by date asc, start_time asc`
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log("getShiftList", err);
      return [];
    });

  return shifts;
}
exports.getShiftList = getShiftList;

// シフトを削除する
async function deleteShifts(event) {
  const userId = event.source.userId;
  const shifts = await getShiftList(event);

  // status を none に変更
  await global.pool
    .query(`update users set status='none' where user_id='${userId}'`)
    .catch((err) => {
      console.log(err);
    });

  const shift_ids = event.message.text.split(",").map((index) => {
    return shifts[parseInt(index) - 1].shift_id;
  });

  if (shift_ids.length === 0) {
    return getReplayTextMessages(event, ["削除するシフトがありませんでした"]);
  }

  // 削除
  await global.pool
    .query(
      `delete from shifts where user_id='${userId}' and shift_id in (${shift_ids.join(
        ","
      )})`
    )
    .catch((err) => {
      console.log(err);
    });

  return getReplayTextMessages(event, ["削除しました"]);
}
exports.deleteShifts = deleteShifts;

// 削除するシフトを聞く
exports.askDeleteShifts = async function (event) {
  const userId = event.source.userId;
  // status を削除モードに変更
  await global.pool
    .query(`update users set status='del-shifts' where user_id='${userId}'`)
    .catch((err) => {
      console.log(err);
    });

  return getReplayTextMessages(event, [
    "削除したいシフトを選択してください",
    await getShiftListText(event),
  ]);
};
