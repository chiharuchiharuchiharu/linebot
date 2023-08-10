const { getReplayTextMessages, getShiftsBubbleMessage} = require("./messages.cjs");

// シフト一覧メッセージを取得する
exports.getShiftListMessage = async function (event, canDelete = false) {
  const shifts = await getShiftList(event);

  if (shifts.length === 0)
    return getReplayTextMessages(event, ["シフトが登録されていません"]);
  else return getShiftsBubbleMessage(event, shifts, canDelete);
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
    .then((result) => result.rows)
    .catch((err) => {
      console.log("getShiftList", err);
      return [];
    });

  return shifts;
}
exports.getShiftList = getShiftList;

// シフトを削除する
async function deleteShifts(event, data) {
  const shiftId = data.split(" ")[1];
  const userId = event.source.userId;
  const shifts = await getShiftList(event);

  // 削除
  await global.pool
    .query(
      `delete from shifts where user_id='${userId}' and shift_id = ${shiftId}`)
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
