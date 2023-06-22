/* const moment = require("moment");
const punchExcelViewModel = require("../models/punchExcelViewModel");
const mysql = require("mysql");
const db = require("../database/connection");

// Controller action to handle form submission
const viewExcelView = (req, res) => {
  const employeeCode = req.body.id;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  // Call the model function to fetch employee data
  punchExcelViewModel.getEmployeeData(
    employeeCode,
    startDate,
    endDate,
    (err, results) => {
      if (err) {
        // Handle the error
        return res.status(500).send("Internal Server Error");
      }

      // Render the view and pass the fetched data

      if (!results || results.length === 0) {
        // No results found
        return res.render("view-excel-view.ejs", { error: "No data found." });
      }
      res.render("view-excel-view.ejs", { data: results });
    }
  );
};

module.exports = {
  viewExcelView,
};
 */
const db = require("../database/connection");
const punchExcelViewModel = require("../models/punchExcelViewModel");
const viewExcelView = async (req, res) => {
  try {
    const { id, startDate, endDate } = req.body;
    const results = await punchExcelViewModel.getEmployeeData(
      id,
      startDate,
      endDate
    );
    const empCode = results[0]['Emp Code']; // Extract the empCode from the first record
    const empName = results[0]['Employee Name'];
    // res.render("view-excel-view.ejs", { data: results, empCode, empName });

    if (!results || results.length === 0) {
      return res.render("view-excel-view.ejs", { data: results });
      // return res.render("view-excel-view.ejs", { data: results, empCode: empCode, empName: empName });

    }
    const employeeNames = results.map(result => result['Employee Name']);

  res.render("excel-view.ejs", { data: results, employeeNames });
    res.render("view-excel-view.ejs", { data: results, empCode, empName });

   // res.render("excel-view.ejs", { data: results, employeeNames });


  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  viewExcelView,
};
