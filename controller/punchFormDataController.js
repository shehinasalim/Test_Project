// const moment = require("moment");
// const PunchFormDataModel = require('../models/punchFormData');
// const mysql = require("mysql");
// const pool = require('../database/connection');

// Handle the form submission
/* const submitForm = async (req, res) => {
  try {
    
    const{ employeeCode,employeeName,date,inTime,outTime,shift,sinTime,souTime,workDuration,ot,totalDuration,lateBy,earlyGoing,status_s,punchRecords } = req.body;
    console.log(employeeCode);
    await PunchFormDataModel.saveFormData(employeeCode,employeeName,date,inTime,outTime,shift,sinTime,souTime,workDuration,ot,totalDuration,lateBy,earlyGoing,status_s,punchRecords);

    res.status(200).json({ message: 'Form data saved successfully.' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  submitForm
}; */

const moment = require("moment");
const PunchFormDataModel = require('../models/punchFormData');
const mysql = require("mysql");
const pool = require('../database/connection');

const submitForm = async (req, res) => {
  try {
    const {
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
      lateBy,
      earlyGoing,
      status_s,
      punchRecords
    } = req.body;

    const punchTimesArray = punchRecords.split(",");
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

    // Check if data already exists with the given "Att. Date"
    const checkQuery = 'SELECT COUNT(*) AS count FROM data1 WHERE `Att. Date` = ?';
    const checkValues = [date];
    const [rows] = await pool.execute(checkQuery, checkValues);

    if (rows[0].count > 0) {
     // console.log('Data already exists for the given "Att. Date".');
     //console.log(`Data already exists for Att.Date:${attDateString} empCode: ${empCode} and empName: ${empName}`);
     res.status(400).json({ message: `Data already exists for Att.Date:${date} empCode: ${employeeCode} and empName: ${employeeName}` });
      return; // Exit the function without saving the data
    }

    await PunchFormDataModel.saveFormData(
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
      totalDurationString,
      lateBy,
      earlyGoing,
      status_s,
      punchTimesData.join(", "),
      totalDurationString
    );

    res.status(200).json({ message: 'Form data saved successfully.' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  submitForm
};

























