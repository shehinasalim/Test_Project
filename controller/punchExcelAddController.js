// const xlsx = require('xlsx');
// const path = require('path');
// const db = require('../database/connection');
// const moment = require('moment');


const xlsx = require('xlsx');
const path = require('path');
const moment = require('moment');
const PunchExcelAddModel = require('../models/punchExcelAddModel');

exports.uploadFile = (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  const uploadFolder = path.resolve(__dirname, '../upload');
  const filePath = path.join(uploadFolder, file.filename);

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { raw: false });

  const insertPromises = [];

  data.forEach((row) => {
    const id = req.body.employeeCode;
    const attDate = new Date(row['Att. Date']);

    const punchRecords = row['Punch Records'];
    const punchTimesArray = punchRecords ? punchRecords.split(',') : [];
    const format = 'hh:mm:ss A';
    const durations = [];
    let totalDuration = moment.duration();

    for (let i = 0; i < punchTimesArray.length; i += 2) {
      const punchInTime = punchTimesArray[i];
      const punchOutTime = punchTimesArray[i + 1];

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

    const values = [
      id,
      attDate,
      row['InTime'] || null,
      row['OutTime'] || null,
      row['Shift'] || null,
      row['S. InTime'] || null,
      row['S. OutTime'] || null,
      row['Work Dur.'] || null,
      row['OT'] || null,
      row['Tot. Dur.'] || null,
      row['LateBy'] || null,
      row['EarlyGoingBy'] || null,
      row['Status'] || null,
      punchTimesData.join(',') || null,
      totalDurationString || null,
    ];

    const insertPromise = new Promise((resolve, reject) => {
      PunchExcelAddModel.selectData(id, attDate)
        .then(([selectResults]) => {
          if (selectResults.length === 0) {
            // Data doesn't exist for the same ID and Att. Date, insert it
            return PunchExcelAddModel.insertData(values);
          } else {
            // Data already exists for the same ID and Att. Date, skip insertion
            resolve(`Skipping duplicate data for id: ${id} and Att. Date: ${attDate}`);
          }
        })
        .then(([insertResult]) => {
          resolve(insertResult);
        })
        .catch((error) => {
          reject(error);
        });
    });

    insertPromises.push(insertPromise);
  });

  Promise.all(insertPromises)
    .then((results) => {
      const insertedCount = results.filter((result) => typeof result !== 'string').length;
      const skippedCount = results.filter((result) => typeof result === 'string').length;

      console.log('Data insertion completed:', results);
      console.log('Inserted records:', insertedCount);
      console.log('Skipped records:', skippedCount);

      results.forEach((result) => {
        if (typeof result === 'string') {
          console.log(result);
        }
      });

      if (insertedCount > 0) {
        return res.status(200).send('File uploaded successfully');
      } else {
        return res.status(200).send('No new records to insert');
      }
    })
    .catch((error) => {
      console.error('Error occurred while inserting data:', error);
      return res.status(500).send('Error occurred while uploading the file');
    });
};









// Handle the file upload and data insertion
/* exports.uploadFile = (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  const uploadFolder = path.resolve(__dirname, '../upload');
  const filePath = path.join(uploadFolder, file.filename);

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { raw: false });

  const selectQuery = 'SELECT id FROM data WHERE id = ? AND `Att. Date` = ?';
  const insertQuery = `INSERT IGNORE INTO data (id, \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const insertPromises = [];

  data.forEach((row) => {
    const id = req.body.employeeCode;
    const attDate = new Date(row['Att. Date']);

    const punchRecords = row['Punch Records'];
    const punchTimesArray = punchRecords ? punchRecords.split(',') : [];
    const format = 'hh:mm:ss A';
    const durations = [];
    let totalDuration = moment.duration();

    for (let i = 0; i < punchTimesArray.length; i += 2) {
      const punchInTime = punchTimesArray[i];
      const punchOutTime = punchTimesArray[i + 1];

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

    const values = [
      id,
      attDate,
      row['InTime'] || null,
      row['OutTime'] || null,
      row['Shift'] || null,
      row['S. InTime'] || null,
      row['S. OutTime'] || null,
      row['Work Dur.'] || null,
      row['OT'] || null,
      row['Tot. Dur.'] || null,
      row['LateBy'] || null,
      row['EarlyGoingBy'] || null,
      row['Status'] || null,
      punchTimesData.join(',') || null,
      totalDurationString || null,
    ];
    

    const insertPromise = new Promise((resolve, reject) => {
      db.execute(selectQuery, [id, attDate])
        .then(([selectResults]) => {
          if (selectResults.length === 0) {
            // Data doesn't exist for the same ID and Att. Date, insert it
            return db.execute(insertQuery, values);
          } else {
            // Data already exists for the same ID and Att. Date, skip insertion
            resolve(`Skipping duplicate data for id: ${id} and Att. Date: ${attDate}`);
          }
        })

        .then(([insertResult]) => {
          resolve(insertResult);
        })
        .catch((error) => {
          reject(error);
        });
    });
  
    insertPromises.push(insertPromise);
  });
  
  Promise.all(insertPromises)
  .then((results) => {
    const insertedCount = results.filter((result) => typeof result !== 'string').length;
    const skippedCount = results.filter((result) => typeof result === 'string').length;

    console.log('Data insertion completed:', results);
    console.log('Inserted records:', insertedCount);
    console.log('Skipped records:', skippedCount);

    results.forEach((result) => {
      if (typeof result === 'string') {
        console.log(result);
      }
    });

    if (insertedCount > 0) {
      return res.status(200).send('File uploaded successfully');
    } else {
      return res.status(200).send('No new records to insert');
    }
  })
  .catch((error) => {
    console.error('Error occurred while inserting data:', error);
    return res.status(500).send('Error occurred while uploading the file');
  });


  };
 */



































/////////////////////////////////////////////////////////////////////////////////////////////
 /* const xlsx = require('xlsx');
const path = require('path');
const db = require('../database/connection');
const moment = require('moment');

// Handle the file upload and data insertion
exports.uploadFile = (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  const uploadFolder = path.resolve(__dirname, '../upload');
  const filePath = path.join(uploadFolder, file.filename);

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { raw: false });

  const query = `INSERT IGNORE INTO data (id,\`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    //'SELECT `Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration FROM data WHERE id = ?'

  data.forEach((row) => {
    //const id = row.id; // Assuming the unique identifier is the 'id' field
    const attDate = new Date(row['Att. Date']);
    const employeeCode = req.body.employeeCode;
    //const id=row['id'];

    // Check if the row already exists in the database
    const selectQuery = 'SELECT `Att. Date`, InTime, OutTime, Shift, `S. InTime`, `S. OutTime`, `Work Dur.`, OT, `Tot. Dur.`, LateBy, EarlyGoingBy, Status, `Punch Records`, workDuration FROM data WHERE id = ?';
    console.log(selectQuery);
    db.query(selectQuery, [id], (selectError, selectResults) => {
      if (selectError) {
        console.error('Error occurred while checking existing data:', employeeCode);
      } else {
        if (selectResults.length>0) {
          // Row already exists, skip insertion
          console.log('Skipping duplicate data for id:', employeeCode);
        } else {
          // Perform the insertion
          const punchRecords = row['Punch Records'];
          const punchTimesArray = punchRecords ? punchRecords.split(",") : [];
          const format = "hh:mm:ss A";
          const durations = [];
          let totalDuration = moment.duration();

          for (let i = 0; i < punchTimesArray.length; i += 2) {
            const punchInTime = punchTimesArray[i];
            const punchOutTime = punchTimesArray[i + 1];

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

          const values = [
            employeeCode,
            attDate,
            row['InTime'],
            row['OutTime'],
            row['Shift'],
            row['S. InTime'],
            row['S. OutTime'],
            row['Work Dur.'],
            row['OT'],
            row['Tot. Dur.'],
            row['LateBy'],
            row['EarlyGoingBy'],
            row['Status'],
            punchTimesData.join(","),
            totalDurationString,
          ];

          db.query(query, values, (insertError, insertResult) => {
            if (insertError) {
              console.error('Error occurred while inserting data:', insertError);
            } else {
              console.log('Data inserted successfully:', insertResult);
            }
          });
        }
      }
    });
  });

  return res.status(200).send('File uploaded successfully');
};
  */




/* const xlsx = require('xlsx');
const path = require('path');
const db = require('../database/connection');
const moment = require('moment');

// Handle the file upload and data insertion
exports.uploadFile = (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  const uploadFolder = path.resolve(__dirname, '../upload');
  const filePath = path.join(uploadFolder, file.filename);

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { raw: false });

  data.forEach((row) => {
    const attDate = new Date(row['Att. Date']);
    const employeeCode = req.body.employeeCode;

    // Compare the row data with existing data in the table
    const selectQuery = 'SELECT COUNT(*) AS count FROM data WHERE id = ?';//`Att. Date` = ? AND attDate,
    db.query(selectQuery, [ employeeCode], (selectError, selectResults) => {
      if (selectError) {
        console.error('Error occurred while checking existing data:', selectError);
      } else {
        const count = selectResults[0].count;
        if (count > 0) {
          // Row already exists, skip insertion
          console.log('Skipping duplicate data for id:', employeeCode);
        } else {
          // Perform the insertion
          const query = `INSERT IGNORE INTO data (id, \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

          const punchRecords = row['Punch Records'];
          const punchTimesArray = punchRecords ? punchRecords.split(",") : [];
          const format = "hh:mm:ss A";
          const durations = [];
          let totalDuration = moment.duration();

          for (let i = 0; i < punchTimesArray.length; i += 2) {
            const punchInTime = punchTimesArray[i];
            const punchOutTime = punchTimesArray[i + 1];

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

          const values = [
            employeeCode,
            attDate,
            row['InTime'],
            row['OutTime'],
            row['Shift'],
            row['S. InTime'],
            row['S. OutTime'],
            row['Work Dur.'],
            row['OT'],
            row['Tot. Dur.'],
            row['LateBy'],
            row['EarlyGoingBy'],
            row['Status'],
            punchTimesData.join(","),
            totalDurationString,
          ];

          db.query(query, values, (insertError, insertResult) => {
            if (insertError) {
              console.error('Error occurred while inserting data:', insertError);
            } else {
              console.log('Data inserted successfully:', insertResult);
            }
          });
        }
      }
    });
  });

  return res.status(200).send('File uploaded successfully');
}; */


/* const xlsx = require('xlsx');
const path = require('path');
const db = require('../database/connection');
const moment = require('moment');

// Handle the file upload and data insertion
exports.uploadFile = (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  const uploadFolder = path.resolve(__dirname, '../upload');
  const filePath = path.join(uploadFolder, file.filename);

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { raw: false });

  const selectQuery = 'SELECT id FROM data WHERE id = ?';
  const insertQuery = `INSERT IGNORE INTO data (id, \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`,workDuration)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

    const punchRecords = row['Punch Records'];
          const punchTimesArray = punchRecords ? punchRecords.split(",") : [];
          const format = "hh:mm:ss A";
          const durations = [];
          let totalDuration = moment.duration();

          for (let i = 0; i < punchTimesArray.length; i += 2) {
            const punchInTime = punchTimesArray[i];
            const punchOutTime = punchTimesArray[i + 1];

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

  const insertPromises = [];

  data.forEach((row) => {
    const id = req.body.employeeCode;
    const attDate = new Date(row['Att. Date']);
    const values = [
      id,
      attDate,
      row['InTime'],
      row['OutTime'],
      row['Shift'],
      row['S. InTime'],
      row['S. OutTime'],
      row['Work Dur.'],
      row['OT'],
      row['Tot. Dur.'],
      row['LateBy'],
      row['EarlyGoingBy'],
      row['Status'],
      row['Punch Records'],
      punchTimesData.join(","),
      totalDurationString
    ];

    const insertPromise = new Promise((resolve, reject) => {
      db.query(selectQuery, [id], (selectError, selectResults) => {
        if (selectError) {
          reject(selectError);
        } else {
          if (selectResults.length === 0) {
            // No data exists for the given ID, insert it
            db.query(insertQuery, values, (insertError, insertResult) => {
              if (insertError) {
                reject(insertError);
              } else {
                resolve(insertResult);
              }
            });
          } else {
            // Check if the data already exists for the same ID and Att. Date
            const existingDataQuery = 'SELECT id FROM data WHERE id = ? AND `Att. Date` = ?';
db.query(existingDataQuery, [id, attDate], (existingDataError, existingDataResults) => {
  if (existingDataError) {
    reject(existingDataError);
  } else {
    if (existingDataResults.length === 0) {
      // Data doesn't exist for the same ID and Att. Date, insert it
      db.query(insertQuery, values, (insertError, insertResult) => {
        if (insertError) {
          reject(insertError);
        } else {
          resolve(insertResult);
        }
      });
    } else {
      // Data already exists for the same ID and Att. Date, skip insertion
      resolve('Skipping duplicate data for id: ' + id + ' and Att. Date: ' + attDate);
    }
  }
});

            
          }
        }
      });
    });

    insertPromises.push(insertPromise);
  });

  Promise.all(insertPromises)
  .then((results) => {
    console.log('Data insertion completed:', results);
    return res.status(200).send('File uploaded successfully');
    })
    .catch((error) => {
    console.error('Error occurred while inserting data:', error);
    return res.status(500).send('Error occurred while uploading the file');
    });
    }; 
 
 */

   