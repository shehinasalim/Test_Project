const moment = require("moment");
const mysql = require("mysql2");
const pool = require('../database/connection');


  const saveFormData = async (employeeCode, employeeName, date, inTime, outTime, shift, sinTime, souTime, workDuration, ot, totalDuration, lateBy, earlyGoing, status_s, punchRecords, totalDurationString) => {
    try {
      console.log(employeeCode, employeeName, date, inTime, outTime, shift, sinTime, souTime, workDuration, ot, totalDuration, lateBy, earlyGoing, status_s, punchRecords, totalDurationString);
      
      // Check if data already exists with the given "Att. Date"
      const checkQuery = 'SELECT COUNT(*) AS count FROM data1 WHERE `Att. Date` = ?';
      const checkValues = [date];
      const [rows] = await pool.execute(checkQuery, checkValues);
  
      if (rows[0].count > 0) {
        console.log('Data already exists for the given "Att. Date".');
        return; // Exit the function without inserting the data
      }
  
      const query = `INSERT INTO data1 (\`Emp Code\`, \`Employee Name\`, \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        employeeCode,
        employeeName,
        date,
        inTime,
        outTime,
        shift,
        sinTime,
        souTime,
        workDuration,
        ot,
        totalDuration,
        lateBy,
        earlyGoing,
        status_s,
        punchRecords,
        totalDurationString
      ];
      console.log(values);
      await pool.execute(query, values); // Execute the query using the pool
  
      console.log('Inserted');
    } catch (error) {
      console.error('Error saving form data:', error);
      throw error;
    }
  };
  
  module.exports = {
    saveFormData
  };
  























