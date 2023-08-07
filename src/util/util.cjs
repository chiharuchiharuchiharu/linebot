// 一週間分の日付を取得
exports.getWeekdates = function (firstDate) {
  const specifiedDate = new Date(firstDate);

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(
      specifiedDate.getTime() + i * 24 * 60 * 60 * 1000
    );
    dates.push(`${currentDate.getMonth() + 1}/${currentDate.getDate()}`);
  }

  return dates;
};

// 週の初めの日から終わりの日を取得
exports.getWeekLastDate = function (date) {
  const first = new Date(date);
  const last = new Date(first.getTime() + 6 * 24 * 60 * 60 * 1000);

  return `${last.getMonth() + 1}/${last.getDate()}`;
};

// DB を初期化する
exports.initDB = function () {
  global.pool.query(
    `create table if not exists users(
      user_id varchar(40) primary key,
      nickname varchar(20) DEFAULT NULL,
      status varchar(10) DEFAULT NULL
    )`
  );
  global.pool.query(
    `create table if not exists shifts(
      shift_id serial primary key,
      user_id varchar(40),
      nickname varchar(20),
      date varchar(5),
      start_time integer,
      end_time integer
    )`
  );
};

// ユーザーを追加する
exports.addUser = async function (userId) {
  const res = await global.pool
    .query(`insert into users(user_id) values('${userId}')`)
    .then((result) => result)
    .catch((err) => err);

  return res;
};

//ユーザーを削除する
exports.deleteUser = async function (userId) {
  await global.pool
    .query(`delete from users where user_id='${userId}'`)
    .then((result) => result)
    .catch((err) => err);
};

// ユーザー情報を取得する
exports.getUserInfo = async function (userId) {
  const user = await global.pool
    .query(`select * from users where user_id='${userId}'`)
    .then((result) => {
      return result.rows[0];
    });

  return {
    userId: user.user_id,
    nickname: user.nickname,
    status: user.status,
  };
};
