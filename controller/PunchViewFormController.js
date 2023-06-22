
// PunchViewFormController.js
const db = require('../database/connection');
const uploadModel = require('../models/PunchViewForm');
exports.selectAllData = async (req, res) => {
  try {
    //console.log(id);
    console.log("now:",req);
    const id = req.body.id;
    console.log("ID:",id);
    // const { employeeCode } = req.body;
    // console.log("ID:",employeeCode);

    const rows = await uploadModel.fetchAllData(id);
    res.render('upload.ejs', { data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

//const db = require('../database/db');

//  exports.selectAllData = (req, res) => {
//   const employeeCode = req.body.employeeCode;
//   console.log(employeeCode);
//   const fetchDataQuery = `SELECT * FROM data `;
//   console.log(fetchDataQuery);

//   db.query(fetchDataQuery, [employeeCode], (err, rows) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Internal Server Error');
//     } else {
//       res.render('view-excel-view.ejs', { data: rows, id: employeeCode });
//     }
//   });
// }; 


/* exports.selectAllData = (req, res) => {
  const employeeCode = req.body.employeeCode;
  console.log("Employee Code:", employeeCode);

  if (!employeeCode) {
    console.log("Invalid Employee Code");
    res.status(400).send("Invalid Employee Code");
    return;
  }

  const fetchDataQuery = `SELECT * FROM data WHERE id = ?`;
  console.log("Fetch Data Query:", fetchDataQuery);

  db.query(fetchDataQuery, [employeeCode], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Fetched Rows:", rows);
      res.render("view-excel-view.ejs", { data: rows, id: employeeCode });
    }
  });
};

 */








































// Controller function to select all data from the data table
/* exports.selectAllData = async (req, res) => {
  try {
   const id = req.body.id;
    const rows = await uploadModel.fetchAllData();
    res.render('upload.ejs', { data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}; 
 */





















// PunchViewFormController.js
// const db = require('../database/connection');
// const PunchViewFormExcel = require('../models/PunchViewForm');

// Controller function to select data from the data table based on ID




/* const db = require('../database/connection');
const PunchViewFormExcel = require('../models/PunchViewForm');

// Controller function to select data from the data table based on Employee Code
exports.selectDataById = async (req, res) => {
  const employeeCode = req.body.employeeCode; // Get the employee code from the submitted form data

  try {
    const rows = await PunchViewFormExcel.fetchDataByEmployeeCode(employeeCode);
    res.render('upload.ejs', { data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

 */