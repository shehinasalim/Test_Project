/* const db = require("../database/connection");
const mysql = require("mysql");
const express = require("express");

// Function to fetch employee data based on code and date range
const getEmployeeData = (employeeCode, startDate, endDate, callback) => {
  // Construct the SQL query
  //const query =`SELECT DATE_FORMAT(\`Att. Date\`, '%Y-%m-%d') AS \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, workDuration FROM data WHERE \`Att. Date\` BETWEEN '${startDate}' AND '${endDate}' ORDER BY \`Att. Date\` ASC`;

  //const query = `SELECT DATE_FORMAT(\`Att. Date\`, '%Y-%m-%d') AS \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration FROM data ORDER BY \`Att. Date\` ASC`;
  const query = `SELECT DATE_FORMAT(\`Att. Date\`, '%Y-%m-%d') AS \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, workDuration FROM data ORDER BY \`Att. Date\` ASC`;

  // Execute the query with parameters
  db.query(query, [employeeCode, startDate, endDate], (err, results) => {
    if (err) {
      console.error("Error executing the query: " + err.stack);
      return callback(err, null);
    }

    // Return the fetched data
    callback(null, results);
  });
};

module.exports = {
  getEmployeeData,
}; */

const db = require("../database/connection");
//const moment=require("momet");
const { format } = require("sqlstring");
const getEmployeeData = async (id, startDate, endDate) => {
  //const query = `SELECT  DATE_FORMAT(\`Att. Date\`, '%Y-%m-%d') AS \`Att. Date\`, id,InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`,\`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration FROM data WHERE id = ? ORDER BY \`Att. Date\` ASC`;

  //const query = `SELECT DATE_FORMAT(\`Att. Date\`, '%d-%m-%Y') AS \`Att. Date\`, \`Emp Code\`,\`Employee Name\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, workDuration FROM data1  WHERE \`Emp Code\` = ? AND \`Att. Date\` BETWEEN ? AND ? ORDER BY \`Att. Date\` ASC`;

  const query = `SELECT DATE_FORMAT(\`Att. Date\`, '%d-%m-%Y') AS \`Att. Date\`, \`Emp Code\`,\`Employee Name\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, workDuration 
               FROM data1 
               WHERE \`Emp Code\` = ? AND MONTH(\`Att. Date\`) IN (1,2,3,4,5,6,7,8,9,10,11,12) 
               ORDER BY YEAR(\`Att. Date\`) ASC, MONTH(\`Att. Date\`) ASC, \`Att. Date\` ASC`;



  const formattedQuery = format(query, [id, startDate, endDate]);
  try {
    const results = await db.query(formattedQuery);
    return results[0];
  } catch (err) {
    console.error("Error executing the query: " + err.stack);
    throw err;
  }
};
module.exports = {
  getEmployeeData,
};











// const db = require("../database/connection");
// const getEmployeeData = async (id, startDate, endDate) => {
//   const query = `
//     SELECT DATE_FORMAT(\`Att. Date\`, '%Y-%m-%d') AS \`Att. Date\`,
//            InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`,
//            \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status,
//            workDuration
//     FROM data

//   `;

//   try {
//     const results = await db.query(query, [startDate, endDate]);
//     return results || []; // Return an empty array if results is falsy
//   } catch (err) {
//     console.error("Error executing the query: " + err.stack);
//     throw err; // Throw the error to be caught in the calling function
//   }
// };
// module.exports = {
//     getEmployeeData,
//  };

/* const query = 
`SELECT DATE_FORMAT(\`Att. Date\`, '%Y-%m-%d') AS \`Att. Date\`,
         InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`,
         \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status,
         workDuration
  FROM data ORDER BY \`Att. Date\` ASC `; */

// `SELECT * FROM data `//WHERE id = ? `//AND Att. Date >= ? AND Att. Date <= ?`;
//const query= `SELECT * FROM data WHERE id = ? AND Att. Date >= ? AND Att. Date <= ?`;

// const query = `
// SELECT
//   DATE_FORMAT(\`Att. Date\`, '%Y-%m-%d') AS \`Att. Date\`,
//   InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`,
//   OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status,
//   workDuration
// FROM data
// WHERE id = ? AND \`Att. Date\` BETWEEN ? AND ?
// ORDER BY \`Att. Date\` ASC`;



//const formattedStartDate = moment(startDate, "DD-MM-YYYY").format("YYYY-MM-DD");
  //const formattedEndDate = moment(endDate, "DD-MM-YYYY").format("YYYY-MM-DD");
  //const formattedQuery = format(query, [id,formattedStartDate, formattedEndDate]);


  
  // const query= `SELECT DATE_FORMAT(\`Att. Date\`, '%Y-%m-%d') AS \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, workDuration FROM data
  // WHERE \`Att. Date\` BETWEEN '${startDate}' AND '${endDate}'`;