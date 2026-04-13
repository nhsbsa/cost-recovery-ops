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


  res.redirect('/version-44/s1/account/generate-s071/select-citizen-status');
})


// Enter the date of residency in UK
router.post('/select-citizen-status', function(req, res) {
  
  // Store the citizen status
  req.session.data['s1-request-citizen-status'] = req.body['s1-request-citizen-status'];

  res.redirect('/version-44/s1/account/generate-s071/enter-member-state-details');
})

// Enter the date of residency in UK
router.post('/enter-member-state-details', function(req, res) {
  
  // Store the issuing country
  req.session.data['s1-request-issuing-country'] = req.body['s1-request-issuing-country'];

  // Store the Personal Identification Number (PIN)
  req.session.data['s1-request-pin'] = req.body['s1-request-pin'];

  res.redirect('/version-44/s1/account/generate-s071/search-for-institution-by-id');
})

// Search for the institution by ID
router.post('/search-for-institution-by-id', function(req, res) {

  res.redirect('/version-44/s1/account/generate-s071/search-for-institution-by-id-results');
})

// Search for the institution by name
router.post('/search-for-institution-by-name', function(req, res) {

  res.redirect('/version-44/s1/account/generate-s071/search-for-institution-by-name-results');
})


// Enter the entitlement period
router.post('/enter-entitlement-period', function(req, res) {
  
  // Store the start date of the S1 request
  const s1RequestEntitlementStartDateDay = req.body['s1-request-entitlement-start-date-day'];
  const s1RequestEntitlementStartDateMonth = req.body['s1-request-entitlement-start-date-month'];
  const s1RequestEntitlementStartDateYear = req.body['s1-request-entitlement-start-date-year'];

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let s1RequestEntitlementStartDate;
  if (s1RequestEntitlementStartDateDay && s1RequestEntitlementStartDateMonth && s1RequestEntitlementStartDateYear) {
    const monthIndex = parseInt(s1RequestEntitlementStartDateMonth, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      const monthName = monthNames[monthIndex];
      s1RequestEntitlementStartDate = `${parseInt(s1RequestEntitlementStartDateDay, 10)} ${monthName} ${s1RequestEntitlementStartDateYear}`;
    } else {
      s1RequestEntitlementStartDate = `${parseInt(s1RequestEntitlementStartDateDay, 10)} ${s1RequestEntitlementStartDateMonth} ${s1RequestEntitlementStartDateYear}`; // fallback if invalid month
    }
  } else {
    s1RequestEntitlementStartDate = '01 January 2026'; // default if not provided
}

  req.session.data['s1-request-entitlement-start-date'] = s1RequestEntitlementStartDate;

    // Store the date of residency in the UK
    const s1RequestEntitlementEndDateDay = req.body['s1-request-entitlement-end-date-day'];
    const s1RequestEntitlementEndDateMonth = req.body['s1-request-entitlement-end-date-month'];
    const s1RequestEntitlementEndDateYear = req.body['s1-request-entitlement-end-date-year'];
  
    let s1RequestEntitlementEndDate;
    if (s1RequestEntitlementEndDateDay && s1RequestEntitlementEndDateMonth && s1RequestEntitlementEndDateYear) {
      const monthIndex = parseInt(s1RequestEntitlementEndDateMonth, 10) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        const monthName = monthNames[monthIndex];
        s1RequestEntitlementEndDate = `${parseInt(s1RequestEntitlementEndDateDay, 10)} ${monthName} ${s1RequestEntitlementEndDateYear}`;
      } else {
        s1RequestEntitlementEndDate = `${parseInt(s1RequestEntitlementEndDateDay, 10)} ${s1RequestEntitlementEndDateMonth} ${s1RequestEntitlementEndDateYear}`; // fallback if invalid month
      }
    } else {
      s1RequestEntitlementEndDate = '31 December 2026'; // default if not provided
  }
  
    req.session.data['s1-request-entitlement-end-date'] = s1RequestEntitlementEndDate;

  res.redirect('/version-44/s1/account/generate-s071/cya-generate-s071');
})

// Check your answers before generating the S071
router.post('/cya-generate-s071', function(req, res) {

  // Mark S071 document as generated
  req.session.data['s071-generated'] = 'Yes'

  res.redirect('/version-44/s1/account/generate-s071/confirmation-s071-generated');
})

// View new S071 in the 'Documents' section
router.post('/confirmation-s071-generated', function(req, res) {

  res.redirect('/version-44/s1/account/system-generated-documents');
})
module.exports = router;