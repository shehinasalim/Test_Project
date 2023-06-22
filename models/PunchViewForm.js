const db = require("../database/connection");


exports.fetchAllData = (id) => {
  return new Promise((resolve, reject) => {
   // const id = req.body.id;
   console.log(id);

   const fetchDataQuery = `SELECT  DATE_FORMAT(\`Att. Date\`, '%Y-%m-%d') AS \`Att. Date\`, id,InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`,\`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration FROM data WHERE id = ? ORDER BY \`Att. Date\` ASC`;
    //const fetchDataQuery = `select Status from data`;
    //const fetchDataQuery = `SELECT  \`S. InTime\`, \`S. OutTime\` FROM data `;
    //const fetchDataQuery =['SELECT InTime, OutTime,S. InTime,S. OutTime FROM data WHERE id = ?', [id]]
    //"select * from books where id=" + id
    // const fetchDataQuery = `SELECT id, \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration FROM data WHERE id = ?`;



    //const fetchDataQuery = `SELECT id, \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration FROM data WHERE id = ? `;
    // const fetchDataQuery = `${selectDataQuery} WHERE id = ?`;

    console.log(fetchDataQuery);

    db.query(fetchDataQuery,[id], (err, rows, fields) => {
      //console.log(rows)
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};












































































/* exports.fetchDataByEmployeeCode = (employeeCode) => {
  return new Promise((resolve, reject) => {
    const fetchDataQuery = `SELECT DATE_FORMAT(\`Att. Date\`, '%Y-%m-%d') AS \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration FROM data WHERE employeeCode = ? ORDER BY \`Att. Date\` ASC`;

    db.query(fetchDataQuery, [employeeCode], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
 */
