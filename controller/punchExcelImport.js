
const path = require('path');
const XLSX = require('xlsx');
const moment=require('moment');
const db = require('../database/connection');


const punchExcelImportModels  = require('../models/punchExcelImportModels');

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const uploadFolder = path.resolve(__dirname, "../uploads");
    const filePath = path.join(uploadFolder, file.filename);

    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;

    const processedEmployees = new Set(); // Set to track processed employees

    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const tableData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      });

      let startRowIndex = 0;

      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i][0] === "Att. Date") {
          startRowIndex = i + 1;
          break;
        }
      }

      let empCode = "";
      let empName = "";
      let empData = [];

      for (let i = startRowIndex; i < tableData.length; i++) {
        const rowData = tableData[i];

        if (rowData[1] === "Emp Code:" && rowData[3] === "Employee Name :") {
          if (empCode && empName && empData.length > 0) {
            // Insert previous employee data
            await punchExcelImportModels.insertEmployeeData(empCode, empName, empData);
          }

          empCode = rowData[2];
          empName = rowData[7];
          empData = [];
        } else {
          empData.push(rowData);
        }
      }

      if (empCode && empName && empData.length > 1) {
        // Insert last employee data
         //punchExcelImportModelsController.insertEmployeeData(empCode, empName, empData);
           await punchExcelImportModels.insertEmployeeData(empCode, empName, empData);

      }
    }

    return res.status(200).send("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file:", error);
    // Handle the error as needed
    res.status(500).send("Error uploading file");
  }
};

 ////////////////////////













































































































































 

// const multer = require('multer');
// const XLSX = require('xlsx');
// const path = require('path');
// const punchExcelImportModels = require('../models/punchExcelImportModels');

// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, 'uploads/'); // Destination folder to store uploaded files
// //   },
// //   filename: (req, file, cb) => {
// //     const fileName =   file.originalname; //Date.now() + '-' +

// //     cb(null, fileName);
// //   }
// // });

// // const uploads = multer({ storage: storage });

// const uploadFile = (req, res) => {
//  // uploads.single("file"),
// /*  const file=req.body;
//  console.log("file",file);
//   try {
//     if (!file) {
//       return res.status(400).send('No file uploaded');
//     }
//     //const uploadFolder = path.resolve(__dirname, '../uploads');
//     //const filePath = path.join(uploadFolder, file.filename);

//     const filePath = file.path;
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const excelData = XLSX.utils.sheet_to_json(worksheet); */

//     const file = req.body;
//       if (!file) {
//         return res.status(400).send('No file uploaded');
//       }

//        const uploadFolder = path.resolve(__dirname, '../uploads');
//        const filePath = path.join(uploadFolder, file.file);
//      // const filePath = file.filename;

//       const workbook = XLSX.readFile(uploadFolder.filePath);
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });

//     // Process and insert data into the database
//     for (const row of excelData) {
//       const id = row['Emp Code:'];
//       const name = row['Employee Name :'];
//       //	Att. Date	InTime	OutTime	Shift		S. InTime	S. OutTime		Work Dur.	OT	Tot. Dur.	LateBy	EarlyGoingBy	Status	Punch Records

//       const tableDate = row['Att. Date'];
//       const InTime = row['InTime'];
//       const OutTime = row['OutTime'];
//       const Shift = row['Shift'];
//       const SInTime = row['S. InTime'];
//       const SOutTime = row['S. OutTime'];
//       const workDuration = row['Work Dur.'];
//       const ot = row['OT'];
//       const total_duration = row['Tot. Dur.'];
//       const lateBy = row['LateBy'];
//       const status = row['Status'];
//       const punch = row['Punch Records'];

//       punchExcelImportModels.insertData(id, name, tableDate,InTime,OutTime,Shift,SInTime,SOutTime,workDuration,ot,total_duration,lateBy,status,punch ,(error, results) => {
//         if (error) {
//           console.error('Error inserting data: ', error);
//           // Handle the error as needed
//         }
//       });
//     }

//     // Delete the uploaded file from the server (optional)
//     // fs.unlinkSync(filePath);

//     res.send('File uploaded and data inserted successfully');
//   } /* catch (error) {
//     console.error('Error uploading file: ', error);
//     // Handle the error as needed
//     res.status(500).send('Error uploading file');
//   }
// }; */

// module.exports = {
//   uploadFile
// };

////////////////////////////////new//////////////////////////////////////|>>>
// const XLSX = require('xlsx');
// const path = require('path');
// const multer = require('multer');
// const punchExcelImportModels = require('../models/punchExcelImportModels');

// // Multer configuration
// const upload = multer({ dest: 'uploads/' });

// exports.uploadFile = (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).send('No file uploaded');
//     }

//     const uploadFolder = path.resolve(__dirname, '../uploads');
//     const filePath = path.join(uploadFolder, file.filename);

//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const excelData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

//     // Process and insert data into the database
//     for (const row of excelData) {
//       const id = row['Emp Code:'];
//       const name = row['Employee Name :'];
//       const tableDate = row['Att. Date'];
//       const InTime = row['InTime'];
//       const OutTime = row['OutTime'];
//       const Shift = row['Shift'];
//       const SInTime = row['S. InTime'];
//       const SOutTime = row['S. OutTime'];
//       const workDuration = row['Work Dur.'];
//       const ot = row['OT'];
//       const total_duration = row['Tot. Dur.'];
//       const lateBy = row['LateBy'];
//       const status = row['Status'];
//       const punch = row['Punch Records'];

//       punchExcelImportModels.insertData(
//         id,
//         name,
//         tableDate,
//         InTime,
//         OutTime,
//         Shift,
//         SInTime,
//         SOutTime,
//         workDuration,
//         ot,
//         total_duration,
//         lateBy,
//         status,
//         punch,
//         (error, results) => {
//           if (error) {
//             console.error('Error inserting data: ', error);
//             // Handle the error as needed
//           }
//         }
//       );
//     }

//     // Delete the uploaded file from the server (optional)
//     // fs.unlinkSync(filePath);

//     res.send('File uploaded and data inserted successfully');
//   } catch (error) {
//     console.error('Error uploading file: ', error);
//     // Handle the error as needed
//     res.status(500).send('Error uploading file');
//   }
// };

// const xlsx = require('xlsx');
//     const path = require('path');
//     const db = require('../database/connection');
//     const moment = require('moment');

//     // Handle the file upload and data insertion
//     exports.uploadFile = (req, res) => {
//       const file = req.file;
//       if (!file) {
//         return res.status(400).send('No file uploaded');
//       }

//       const uploadFolder = path.resolve(__dirname, '../uploads');
//       const filePath = path.join(uploadFolder, file.filename);

//       const workbook = xlsx.readFile(filePath);
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const data = xlsx.utils.sheet_to_json(worksheet, { raw: false });

//     }

// const XLSX = require('xlsx');
// const path = require('path');
// const multer = require('multer');
// const db = require('../database/connection');
// const punchExcelImportModels = require('../models/punchExcelImportModels');

// // Multer configuration
// const upload = multer({ dest: 'uploads/' });


/* const XLSX = require("xlsx");
const path = require("path");
const multer = require("multer");
const db = require("../database/connection");
const moment = require("moment");
const punchExcelImportModels = require("../models/punchExcelImportModels");

// Multer configuration
const upload = multer({ dest: "uploads/" });
 */




// exports.uploadFile = (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).send('No file uploaded');
//     }

//     const uploadFolder = path.resolve(__dirname, '../uploads');
//     const filePath = path.join(uploadFolder, file.filename);

//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//     const headerRow = data[0];
//     const empCodeIndex = headerRow.indexOf('Emp Code');

//     const query = `INSERT INTO data1 (\`Emp Code\`, \`Employee Name\`, \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration)
//       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

//     data.forEach((row) => {
//       const punchRecords = row['Punch Records'];
//       const punchTimesArray = punchRecords ? punchRecords.split(",") : [];
//       const format = "hh:mm:ss A";
//       const durations = [];
//       let totalDuration = moment.duration();

//       for (let i = 0; i < punchTimesArray.length; i += 2) {
//         const punchInTime = punchTimesArray[i];
//         const punchOutTime = punchTimesArray[i + 1];

//         const punchInMoment = moment(punchInTime, format);
//         const punchOutMoment = moment(punchOutTime, format);
//         const duration = moment.duration(punchOutMoment.diff(punchInMoment));

//         durations.push({
//           punchIn: punchInTime,
//           punchOut: punchOutTime,
//           hours: duration.hours(),
//           minutes: duration.minutes(),
//           seconds: duration.seconds(),
//         });

//         totalDuration.add(duration);
//       }

//       const punchTimesData = durations.map((duration) => {
//         const durationString = `${duration.hours} hours ${duration.minutes} minutes ${duration.seconds} seconds`;
//         return `${duration.punchIn} - ${duration.punchOut} (${durationString})`;
//       });

//       const totalDurationString = `${totalDuration.hours()} hours ${totalDuration.minutes()} minutes ${totalDuration.seconds()} seconds`;

//       const attDate = new Date(row['Att. Date']);
//       const EmpCode = row[empCodeIndex];
//       const name = row['Employee Name'];
//       console.log("id:", EmpCode);

//       const values = [
//         EmpCode,
//         name,
//         attDate,
//         row['InTime'],
//         row['OutTime'],
//         row['Shift'],
//         row['S. InTime'],
//         row['S. OutTime'],
//         row['Work Dur.'],
//         row['OT'],
//         row['Tot. Dur.'],
//         row['LateBy'],
//         row['EarlyGoingBy'],
//         row['Status'],
//         punchTimesData.join(","),
//         totalDurationString,
//       ];

//       db.query(query, values, (err, result) => {
//         if (err) {
//           console.error(err);
//         }
//       });
//     });

//     return res.status(200).send('File uploaded successfully');
//   } catch (error) {
//     console.error('Error uploading file: ', error);
//     // Handle the error as needed
//     res.status(500).send('Error uploading file');
//   }
// };

/* const xlsx = require('xlsx');
  exports.uploadFile = (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send('No file uploaded');
      }
  
      const uploadFolder = path.resolve(__dirname, '../uploads');
      const filePath = path.join(uploadFolder, file.filename);
  
      const workbook = XLSX.readFile(filePath);
      const sheetNames = workbook.SheetNames;
  
      sheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const tableData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
  
        let empCode = null;
let empName = null;
let startRowIndex = 0;
for (let i = startRowIndex; i < tableData.length - 1; i++) {
  const rowData = tableData[i];

  // Skip empty rows
  if (rowData.every((cell) => cell === '')) {
    continue;
  }

  // Check if the row contains employee code and name
  // if (rowData[1].includes('Emp Code:') && rowData[3].includes('Employee Name:')) {
  //   empCode = rowData[1]//.trim();
  //   empName = rowData[3]//.trim();
  //   continue; // Move to the next row
  // }
  
          // Extract Emp Code, Employee Name, and Att. Date
          // const empCode = rowData[1];
          // const empName = rowData[0];
          // const attDate = new Date(rowData[1]);
          // const inTime = rowData[3];
          // const outTime = rowData[4];
          // const shift = rowData[4];
          // const sInTime = rowData[6];
          // const sOutTime = rowData[7];
          // const workDur = rowData[8];
          // const OT = rowData[9];
          // const totDur = rowData[10];
          // const lateBy = rowData[11];
          // const earlyGoingBy = rowData[12];
          // const status = rowData[14];
          // const punchRecords = rowData[15];
          // const workDuration = rowData[14];



          const empCode = rowData[0];
          const empName = rowData[0];
          //const attDate = rowData[1];
          const attDateString = rowData[1];
          const attDate = new Date(attDateString);
          const inTime = rowData[2];
          const outTime = rowData[3];
          const shift = rowData[4];
          const sInTime = rowData[6];
          const sOutTime = rowData[7];
          const workDur = rowData[9];
          const OT = rowData[10];
          const totDur = rowData[11];
          const lateBy = rowData[12];
          const earlyGoingBy = rowData[13];
          const status = rowData[14];
          const punchRecords = rowData[15];
          const workDuration = rowData[4];
  
  
          // Insert the data into the MySQL table
          const query = `INSERT INTO data1 (\`Emp Code\`, \`Employee Name\`, \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          const values = [
            empCode || null,
            empName || null,
            attDate || null,
            inTime || null,
            outTime || null,
            shift || null,
            sInTime || null,
            sOutTime || null,
            workDur || null,
            OT || null,
            totDur || null,
            lateBy || null,
            earlyGoingBy || null,
            status || null,
            punchRecords || null,
            workDuration || null,
          ];
  
          db.query(query, values, (error, result) => {
            if (error) {
              console.error('Error inserting data:', error);
              return;
            }
            console.log('Data inserted successfully:', result);
          });
        }
      });
  
      return res.status(200).send('File uploaded successfully');
    } 
   catch (error) {
    console.error('Error uploading file:', error);
    // Handle the error as needed
    res.status(500).send('Error uploading file');
  }
};
 */

///////////////////////mrng/////above correct



 //today mrng



/////////////////lasttime beloe////
/* exports.uploadFile = (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const uploadFolder = path.resolve(__dirname, "../uploads");
    const filePath = path.join(uploadFolder, file.filename);

    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;

    const processedEmployees = new Set(); // Set to track processed employees

    sheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const tableData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      });

      let startRowIndex = 0;
      let empCode = "";
      let empName = "";

      for (let i = 0; i < tableData.length; i++) {
        if (
          tableData[i][1] === "Emp Code:" &&
          tableData[i][3] === "Employee Name :"
        ) {
          empCode = tableData[i][2];
          empName = tableData[i][7];

          // Check if empCode and empName have already been processed
          if (processedEmployees.has(`${empCode}-${empName}`)) {
            continue; // Skip processing if already processed
          }

          startRowIndex = i + 1;
          processedEmployees.add(`${empCode}-${empName}`); // Add to processed employees set

          break;
        }
      }

      for (let i = startRowIndex; i < tableData.length; i++) {
        const tableRow = tableData[i];

        if (tableRow[0] !== "Att. Date") {
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

          // Combine the punch records
          const punchTimesArray = punchRecords ? punchRecords.split(",") : [];
          const format = "hh:mm:ss A";
          const durations = [];
          let totalDuration = moment.duration();

          for (let k = 0; k < punchTimesArray.length; k += 2) {
            const punchInTime = punchTimesArray[k];
            const punchOutTime = punchTimesArray[k + 1];

            const punchInMoment = moment(punchInTime, format);
            const punchOutMoment = moment(punchOutTime, format);
            const duration = moment.duration(
              punchOutMoment.diff(punchInMoment)
            );

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
    
          db.query(query, values, (error, result) => {
            if (error) {
              console.error("Error inserting data:", error);
              return;
            }
            // console.log('Data inserted successfully:', result);
          });
        }
      }
    });
    
    return res.status(200).send("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file:", error);
    // Handle the error as needed
    res.status(500).send("Error uploading file");
    }
    };    
 









































/* exports.uploadFile = (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded');
    }

    const uploadFolder = path.resolve(__dirname, '../uploads');
    const filePath = path.join(uploadFolder, file.filename);

    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;

    sheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const tableData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

      // Find the start row index of the table
      let startRowIndex = 0;

      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i][0] === 'Att. Date') {
          startRowIndex = i + 1;
          break;
        }
      }

      // Get the employee code and name from the first row
      const firstRowData = tableData[startRowIndex + 0];
      let empCode = '';
      let empName = '';

      if (firstRowData[1] === 'Emp Code:' && firstRowData[3] === 'Employee Name :') {
        empCode = firstRowData[2];
        empName = firstRowData[7];
      }

      // Iterate over each row in the table (starting from startRowIndex) and insert data into the database
      for (let i = startRowIndex; i < tableData.length; i++) {
        const rowData = tableData[i];
        console.log("rowData:", rowData);

        const attDateString = rowData[1];
        const attDate = new Date(attDateString);
        const inTime = rowData[2];
        const outTime = rowData[3];
        const shift = rowData[4];
        const sInTime = rowData[6];
        const sOutTime = rowData[7];
        const workDur = rowData[9];
        const OT = rowData[10];
        const totDur = rowData[11];
        const lateBy = rowData[12];
        const earlyGoingBy = rowData[13];
        const status = rowData[14];
        const punchRecords = rowData[15];

        // Combine the punch records
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

        db.query(query, values, (error, result) => {
          if (error) {
            console.error('Error inserting data:', error);
            return;
          }
          // console.log('Data inserted successfully:', result);
        });
      }
    });

    return res.status(200).send('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
    // Handle the error as needed
    res.status(500).send('Error uploading file');
  }
}
 */

/* nalllllllllll */

/* exports.uploadFile = (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded');
    }

    const uploadFolder = path.resolve(__dirname, '../uploads');
    const filePath = path.join(uploadFolder, file.filename);

    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;

    sheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const tableData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

      // Find the start row index of the table
      let startRowIndex = 0;
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i][0] === 'Att. Date') {
          startRowIndex = i + 1;
          break;
        }
        console.log("startRowIndex:", startRowIndex);
      }
let empCode='';
      // Iterate over each row in the table (starting from startRowIndex) and insert data into the database
      for (let i = startRowIndex; i < tableData.length; i++) {
        const rowData = tableData[i];
        console.log("rowData:", rowData);

        const attDateString = rowData[1];
        const attDate = new Date(attDateString);
        const inTime = rowData[2];
        const outTime = rowData[3];
        const shift = rowData[4];
        const sInTime = rowData[5];
        const sOutTime = rowData[6];
        const workDur = rowData[7];
        const OT = rowData[8];
        const totDur = rowData[9];
        const lateBy = rowData[10];
        const earlyGoingBy = rowData[11];
        const status = rowData[14];
        const punchRecords = rowData[15];
        const workDuration = rowData[15];

        // Iterate over each column to extract Emp Code and Employee Name
        for (let j = 0; j < rowData.length; j++) {
          if (rowData[j] === 'Emp Code:' || rowData[j+2] === 'Employee Name :') {
            const empCode = rowData[j + 1];
            const empName = rowData[j + 3];
            // Insert the data into the MySQL table
            const query = `INSERT INTO data1 (\`Emp Code\`, \`Employee Name\`, \`Att. Date\`, InTime, OutTime, Shift, \`S. InTime\`, \`S. OutTime\`, \`Work Dur.\`, OT, \`Tot. Dur.\`, LateBy, EarlyGoingBy, Status, \`Punch Records\`, workDuration)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [
              empCode,
              '',
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
              punchRecords,
              workDuration,
            ];

            db.query(query, values, (error, result) => {
              if (error) {
                console.error('Error inserting data:', error);
                return;
              }
              //console.log('Data inserted successfully:', result);
            });
          // } else if (rowData[j] === 'Employee Name :') {
          //   const empName = rowData[j + 1];
          //   // Update the previously inserted row with the employee name
          //   const updateQuery = `UPDATE data1 SET \`Employee Name\` = ? WHERE \`Emp Code\` = ? AND \`Employee Name\` = ''`;
          //   const updateValues = [empName, empCode];

            // db.query(updateQuery, updateValues, (error, result) => {
            //   if (error) {
            //     console.error('Error updating data:', error);
            //     return;
            //   }
            //   //console.log('Data updated successfully:', result);
            // });
          }
        }
      }
    });

    return res.status(200).send('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
    // Handle the error as needed
    res.status(500).send('Error uploading file');
  }
} */

// Iterate over the row to find the Emp Code and Employee Name columns
// for (let j = 0; j < rowData.length; j++) {
//   if (rowData[j] === 'Emp Code:') {
//     empCode = rowData[j + 1]; // Assuming the code is in the next column
//   } else if (rowData[j] === 'Employee Name:') {
//     empName = rowData[j + 1]; // Assuming the name is in the next column
//   }
// }

// if (rowData[1] === 'Emp Code:' && rowData[3] === 'Employee Name :') {
//   empCode = rowData[2];
//   empName = rowData[7];
// }

//  Skip rows that do not contain employee data
// if (!rowData[1] || !rowData[2]) {
//   console.log("rowData:",rowData);

//   continue;
// }

// Extract Emp Code, Employee Name, and other relevant data
//  const empCode = rowData[j];
//  const empName = rowData[8];
//const attDate = rowData[1];

//         const empCode = rowData['Emp Code:'];
// const empName = rowData['Employee Name:'];
// //const attDate = rowData[1];
// const attDateString = rowData['Att. Date'];
// const attDate = new Date(attDateString);
// const inTime = rowData['InTime'];
// const outTime = rowData['OutTime'];
// const shift = rowData['Shift'];
// const sInTime = rowData['S. InTime'];
// const sOutTime = rowData['S. OutTime'];
// const workDur = rowData['Work Dur.'];
// const OT = rowData['OT'];
// const totDur = rowData['Tot. Dur.'];
// const lateBy = rowData['LateBy'];
// const earlyGoingBy = rowData['EarlyGoingBy'];
// const status = rowData['Status'];
// const punchRecords = rowData['Punch Records'];
// const workDuration = rowData['Work Dur.'];
