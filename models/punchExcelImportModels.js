const mysql = require('mysql2');
const moment=require('moment');
const db = require("../database/connection");
const path = require('path');
const { Console } = require('console');


class punchExcelImportModels {
  static insertEmployeeData(empCode, empName, empData, callback) {
    const query = `INSERT INTO data1 (\`Emp Code\`, \`Employee Name\`, \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    empData.forEach(async (tableRow) => {
      const attDateString = tableRow[1];
      const attDate = new Date(attDateString);
      const inTime = tableRow[2];
      const outTime = tableRow[3];
      const shift = tableRow[4];
      const sInTime = tableRow[6];
      const sOutTime = tableRow[7];
      const workDur = tableRow[9];
      const OT = tableRow[10];
      const totDur = tableRow[11];
      const lateBy = tableRow[12];
      const earlyGoingBy = tableRow[13];
      const status = tableRow[14];
      const punchRecords = tableRow[15];

      const punchTimesArray = punchRecords ? punchRecords.split(",") : [];
      const format = "hh:mm:ss";
      const durations = [];
      let totalDuration = moment.duration();

for (let k = 0; k < punchTimesArray.length; k += 2) {
  const punchInTime = punchTimesArray[k];
  const punchOutTime = punchTimesArray[k + 1];

  // Calculate the duration only if both punch in and punch out times are available
  if (punchInTime && punchOutTime) {
    const punchInMoment = moment(punchInTime, format);
    const punchOutMoment = moment(punchOutTime, format);
    const duration = moment.duration(punchOutMoment.diff(punchInMoment));
   

    durations.push({
      punchIn: punchInTime,
      punchOut: punchOutTime,
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    });

    totalDuration = totalDuration.add(duration);
  }
}

const punchTimesData = durations.map((duration) => {
  const durationString = `${duration.hours} hours ${duration.minutes} minutes ${duration.seconds} seconds`;
  return `${duration.punchIn} - ${duration.punchOut} (${durationString})`;
 // console.log("result:",durationString);
});
const totalDurationString = `${totalDuration.hours()} hours ${totalDuration.minutes()} minutes ${totalDuration.seconds()} seconds`;

      // Check if any of the required fields are null or empty
      const requiredFields = [empCode, empName, attDate, inTime, outTime, shift, sInTime, sOutTime, workDur, OT, totDur, lateBy, earlyGoingBy, status, punchRecords];
      if (requiredFields.some((field) => !field)) {
        // Skip insertion if any required field is missing
        return;
      }

      try {
        const checkQuery = `SELECT COUNT(*) AS count FROM data1 WHERE \`Att. Date\` = ?`;
        const checkValues = [attDate];
        const [checkResult] = await db.query(checkQuery, checkValues);
        const existingCount = checkResult[0].count;
      
        if (existingCount === 0) {
          // Insert the data into the MySQL table
          const query = `INSERT INTO data1 (\`Emp Code\`, \`Employee Name\`, \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          
          const values = [
            empCode,
            empName,
            attDate,
            inTime,
            outTime,
            shift,
            sInTime,
            sOutTime,
            workDur,
            OT,
            totDur,
            lateBy,
            earlyGoingBy,
            status,
            punchTimesData.join(","),
            totalDurationString,
          ];

          try {
            const [insertResult] = await db.query(query, values);
            // Data inserted successfully
            // You can perform any additional logic or callback here if needed
          } catch (error) {
            console.error("Error inserting data:", error);
            // Handle the error or pass it to the callback if needed
          }
        } else {
          console.log(`Data already exists for Att.Date:${attDateString} empCode: ${empCode} and empName: ${empName}`);
          return
          // Handle the case when data already exists
          // You can choose to skip inserting the data or take any other action
        }
      } catch (error) {
        console.error("Error checking existing data:", error);
        // Handle the error or pass it to the callback if needed
      }
      
    });
  }
}

module.exports = punchExcelImportModels;







/* const insertEmployeeData = async (empCode, empName, empData) => {
  // Process and insert employee data into the database
  const query = `INSERT INTO data1 (\`Emp Code\`, \`Employee Name\`, \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    console.log();

  for (const tableRow of empData) {
    const attDateString = tableRow[1];
    const attDate = new Date(attDateString);
    const inTime = tableRow[2];
    const outTime = tableRow[3];
    const shift = tableRow[4];
    const sInTime = tableRow[6];
    const sOutTime = tableRow[7];
    const workDur = tableRow[9];
    const OT = tableRow[10];
    const totDur = tableRow[11];
    const lateBy = tableRow[12];
    const earlyGoingBy = tableRow[13];
    const status = tableRow[14];
    const punchRecords = tableRow[15];

    const punchTimesArray = punchRecords ? punchRecords.split(",") : [];
    const format = "hh:mm:ss A";
    const durations = [];
    const totalDuration = moment.duration();

    for (let k = 0; k < punchTimesArray.length; k += 2) {
      const punchInTime = punchTimesArray[k];
      const punchOutTime = punchTimesArray[k + 1];
      const punchInMoment = moment(punchInTime, format);
      const punchOutMoment = moment(punchOutTime, format);
      const duration = moment.duration(punchOutMoment.diff(punchInMoment));

      durations.push({
        punchIn: punchInTime,
        punchOut: punchOutTime,
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      });

      totalDuration.add(duration);
    }

    const punchTimesData = durations.map((duration) => {
      const durationString = `${duration.hours} hours ${duration.minutes} minutes ${duration.seconds} seconds`;
      return `${duration.punchIn} - ${duration.punchOut} (${durationString})`;
    });
    const totalDurationString = `${totalDuration.hours()} hours ${totalDuration.minutes()} minutes ${totalDuration.seconds()} seconds`;

    // Check if any of the required fields are null or empty
    const requiredFields = [empCode, empName, attDate, inTime, outTime, shift, sInTime, sOutTime, workDur, OT, totDur, lateBy, earlyGoingBy, status, punchRecords];
    if (requiredFields.some((field) => !field)) {
      // Skip insertion if any required field is missing
      return;
    }

    // Check if empCode and empName already exist in the table
    const checkQuery = `SELECT COUNT(*) AS count FROM data1 WHERE \`Att. Date\` = ?`;
    const checkValues = [attDate];

    try {
      const [checkResult] = await db.query(checkQuery, checkValues);
      const existingCount = checkResult[0].count;

      if (existingCount === 0) {
        // Insert the data into the MySQL table
        const values = [
          empCode,
          empName,
          attDate,
          inTime,
          outTime,
          shift,
          sInTime,
          sOutTime,
          workDur,
          OT,
          totDur,
          lateBy,
          earlyGoingBy,
          status,
          punchTimesData.join(","),
          totalDurationString,
        ];

        await db.query(query, values);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  }
};

module.exports = { insertEmployeeData }; */





















































































/* const insertEmployeeData = async (empCode, empName, empData) => {
  // Process and insert employee data into the database
  const query = `INSERT INTO data1 (\`Emp Code\`, \`Employee Name\`, \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  for (const tableRow of empData) {
    const attDateString = tableRow[1];
    const attDate = new Date(attDateString);
    const inTime = tableRow[2];
    const outTime = tableRow[3];
    const shift = tableRow[4];
    const sInTime = tableRow[6];
    const sOutTime = tableRow[7];
    const workDur = tableRow[9];
    const OT = tableRow[10];
    const totDur = tableRow[11];
    const lateBy = tableRow[12];
    const earlyGoingBy = tableRow[13];
    const status = tableRow[14];
    const punchRecords = tableRow[15];

    const punchTimesArray = punchRecords ? punchRecords.split(",") : [];
    const format = "hh:mm:ss A";
    const durations = [];
    const totalDuration = moment.duration();

    for (let k = 0; k < punchTimesArray.length; k += 2) {
      const punchInTime = punchTimesArray[k];
      const punchOutTime = punchTimesArray[k + 1];
      const punchInMoment = moment(punchInTime, format);
      const punchOutMoment = moment(punchOutTime, format);
      const duration = moment.duration(punchOutMoment.diff(punchInMoment));
      
    
      durations.push({
        punchIn: punchInTime,
        punchOut: punchOutTime,
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      });
    
      totalDuration.add(duration);
    }
    
    const punchTimesData = durations.map((duration) => {
      const durationString = `${duration.hours} hours ${duration.minutes} minutes ${duration.seconds} seconds`;
      return `${duration.punchIn} - ${duration.punchOut} (${durationString})`;
    });
    const totalDurationString = `${totalDuration.hours()} hours ${totalDuration.minutes()} minutes ${totalDuration.seconds()} seconds`;
    


    // ...

    // Check if any of the required fields are null or empty
    const requiredFields = [empCode, empName, attDate, inTime, outTime, shift, sInTime, sOutTime, workDur, OT, totDur, lateBy, earlyGoingBy, status, punchRecords];
    if (requiredFields.some((field) => !field)) {
      // Skip insertion if any required field is missing
      return;
    }

    // Check if empCode and empName already exist in the table
    const checkQuery = `SELECT COUNT(*) AS count FROM data1 WHERE \`Att. Date\` = ?`;
    const checkValues = [attDate];

    try {
      const [checkResult] = await db.query(checkQuery, checkValues);
      const existingCount = checkResult[0].count;

      if (existingCount === 0) {
        // Insert the data into the MySQL table
        const values = [
          empCode,
          empName,
          attDate,
          inTime,
          outTime,
          shift,
          sInTime,
          sOutTime,
          workDur,
          OT,
          totDur,
          lateBy,
          earlyGoingBy,
          status,
          punchTimesData.join(","),
          totalDurationString,
        ];

        await db.query(query, values);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  }
};

module.exports = { insertEmployeeData }; */



























































































































