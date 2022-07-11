// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

// Run this code when a form is submitted to 'update-patient-details'
router.post('/update-patient-details', function (req, res) {

  // Make a variable and give it the value from 'reasons-for-contestation-update'
  var updatePatientDetails = req.session.data['update-details']

  // Check whether the variable matches a condition
  if (updatePatientDetails == "Yes"){
    // Send user to next page
    res.redirect('/version-22/pb6/01/reasons-for-contestation-update-1')
  } else {
    // Send user to ineligible page
    res.redirect('/search')
  }

})

module.exports = router;
