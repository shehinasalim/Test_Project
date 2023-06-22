const db = require('../database/connection');

class PunchExcelAddModel {
  static selectData(id, attDate) {
    const selectQuery = 'SELECT id FROM data WHERE id = ? AND `Att. Date` = ?';
    return db.execute(selectQuery, [id, attDate]);
  }

  static insertData(values) {
    const insertQuery = `INSERT IGNORE INTO data (id, \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    return db.execute(insertQuery, values);
  }
}

module.exports = PunchExcelAddModel;
