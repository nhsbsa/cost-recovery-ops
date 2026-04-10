// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// Generate an S071 document //

// Do you want to continue generating an S071 using these personal details?
router.post('/continue-generating-s071', function(req, res) {
  const continueToGenerateS071 = req.session.data['continue-generating-s071']

  if (continueToGenerateS071 === 'Yes') {
    res.redirect('enter-date-of-uk-residency')
  } else {
    res.redirect('/version-44/s1/account/s1-requests')
  }
})

// Enter the date of residency in UK
router.post('/enter-date-of-uk-residency', function(req, res) {
  
  // Store the date of residency in the UK
  const dateResidencyInUKDay = req.body['date-of-residency-in-uk-day'];
  const dateResidencyInUKMonth = req.body['date-of-residency-in-uk-month'];
  const dateResidencyInUKYear = req.body['date-of-residency-in-uk-year'];

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let dateResidencyInUK;
  if (dateResidencyInUKDay && dateResidencyInUKMonth && dateResidencyInUKYear) {
    const monthIndex = parseInt(dateResidencyInUKMonth, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      const monthName = monthNames[monthIndex];
      dateResidencyInUK = `${parseInt(dateResidencyInUKDay, 10)} ${monthName} ${dateResidencyInUKYear}`;
    } else {
      dateResidencyInUK = `${parseInt(dateResidencyInUKDay, 10)} ${dateResidencyInUKMonth} ${dateResidencyInUKYear}`; // fallback if invalid month
    }
  } else {
    dateResidencyInUK = '21 August 2024'; // default if not provided
}

  req.session.data['date-of-residency-in-uk'] = dateResidencyInUK;


  res.redirect('/version-44/s1/account/generate-S071/select-citizen-status');
})


// Enter the date of residency in UK
router.post('/select-citizen-status', function(req, res) {
  
  // Store the citizen status
  req.session.data['s1-request-citizen-status'] = req.body['s1-request-citizen-status'];

  res.redirect('/version-44/s1/account/generate-S071/enter-member-state-details');
})

// Enter the date of residency in UK
router.post('/enter-member-state-details', function(req, res) {
  
  // Store the issuing country
  req.session.data['s1-request-issuing-country'] = req.body['s1-request-issuing-country'];

  // Store the Personal Identification Number (PIN)
  req.session.data['s1-request-pin'] = req.body['s1-request-pin'];

  res.redirect('/version-44/s1/account/generate-S071/search-for-institution-by-id');
})


module.exports = router;