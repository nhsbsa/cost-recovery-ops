// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// Generate an S071 document //

// Do you want to continue generating an S071 using these personal details?
router.post([/dr-continue-generating-s071/], function(req, res) {
  const drContinueToGenerateS071 = req.session.data['dr-continue-generating-s071']

  if (drContinueToGenerateS071 === 'Yes') {
    res.redirect('/version-45/s1/account/dependant/generate-s071/dr-select-citizen-status')
  } else {
    res.redirect('/version-45/s1/account/dependant/s1-requests')
  }
})

// Enter the date of residency in UK
router.post([/dr-select-citizen-status/], function(req, res) {
  
  // Store the citizen status
  req.session.data['dr-s1-request-citizen-status'] = req.body['dr-s1-request-citizen-status'];

  res.redirect('/version-45/s1/account/dependant/generate-s071/dr-request-for-e109');
})

// Is this request for an E109?
router.post([/dr-request-for-e109/], function (req, res) {
  // Store the user's answer
  const answer = req.body['dr-s1-request-for-e109'];
  req.session.data['dr-s1-request-for-e109'] = answer;

  // Set the request type for the backend
  if (answer === 'Yes') {
    req.session.data['request-type'] = 'E109';
  }

  res.redirect('/version-45/s1/account/dependant/generate-s071/dr-enter-date-of-uk-residency');
});

// Enter the date of residency in UK
router.post([/dr-enter-date-of-uk-residency/], function(req, res) {
  
  // Store the date of residency in the UK
  const drDateResidencyInUKDay = req.body['dr-date-of-residency-in-uk-day'];
  const drDateResidencyInUKMonth = req.body['dr-date-of-residency-in-uk-month'];
  const drDateResidencyInUKYear = req.body['dr-date-of-residency-in-uk-year'];

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let drDateResidencyInUK;
  if (drDateResidencyInUKDay && drDateResidencyInUKMonth && drDateResidencyInUKYear) {
    const monthIndex = parseInt(drDateResidencyInUKMonth, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      const monthName = monthNames[monthIndex];
      drDateResidencyInUK = `${parseInt(drDateResidencyInUKDay, 10)} ${monthName} ${drDateResidencyInUKYear}`;
    } else {
      drDateResidencyInUK = `${parseInt(drDateResidencyInUKDay, 10)} ${drDateResidencyInUKMonth} ${drDateResidencyInUKYear}`; // fallback if invalid month
    }
  } else {
    drDateResidencyInUK = '21 August 2024'; // default if not provided
}

  req.session.data['dr-date-of-residency-in-uk'] = drDateResidencyInUK;


  res.redirect('/version-45/s1/account/dependant/generate-s071/dr-enter-member-state-details');
})



// Enter the date of residency in UK
router.post([/dr-enter-member-state-details/], function(req, res) {
  
  // Store the issuing country
  req.session.data['dr-s1-request-issuing-country'] = req.body['dr-s1-request-issuing-country'];

  // Store the Personal Identification Number (PIN)
  req.session.data['dr-s1-request-pin'] = req.body['dr-s1-request-pin'];

  res.redirect('/version-45/s1/account/dependant/generate-s071/dr-search-for-institution-by-id');
})

// Search for the institution by ID
router.post([/dr-search-for-institution-by-id/], function(req, res) {

  res.redirect('/version-45/s1/account/dependant/generate-s071/dr-search-for-institution-by-id-results');
})

// Search for the institution by name
router.post([/dr-search-for-institution-by-name/], function(req, res) {

  res.redirect('/version-45/s1/account/dependant/generate-s071/dr-search-for-institution-by-name-results');
})


// Enter the entitlement period
router.post([/dr-enter-entitlement-period/], function(req, res) {
  
  // Store the start date of the S1 request
  const drS1RequestEntitlementStartDateDay = req.body['dr-s1-request-entitlement-start-date-day'];
  const drS1RequestEntitlementStartDateMonth = req.body['dr-s1-request-entitlement-start-date-month'];
  const drS1RequestEntitlementStartDateYear = req.body['dr-s1-request-entitlement-start-date-year'];

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let drS1RequestEntitlementStartDate;
  if (drS1RequestEntitlementStartDateDay && drS1RequestEntitlementStartDateMonth && drS1RequestEntitlementStartDateYear) {
    const monthIndex = parseInt(s1RequestEntitlementStartDateMonth, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      const monthName = monthNames[monthIndex];
      drS1RequestEntitlementStartDate = `${parseInt(drS1RequestEntitlementStartDateDay, 10)} ${monthName} ${drS1RequestEntitlementStartDateYear}`;
    } else {
      drS1RequestEntitlementStartDate = `${parseInt(drS1RequestEntitlementStartDateDay, 10)} ${drS1RequestEntitlementStartDateMonth} ${drS1RequestEntitlementStartDateYear}`; // fallback if invalid month
    }
  } else {
    drS1RequestEntitlementStartDate = '01 January 2026'; // default if not provided
}

  req.session.data['dr-s1-request-entitlement-start-date'] = drS1RequestEntitlementStartDate;

    // Store the date of residency in the UK
    const drS1RequestEntitlementEndDateDay = req.body['dr-s1-request-entitlement-end-date-day'];
    const drS1RequestEntitlementEndDateMonth = req.body['dr-s1-request-entitlement-end-date-month'];
    const drS1RequestEntitlementEndDateYear = req.body['dr-s1-request-entitlement-end-date-year'];
  
    let drS1RequestEntitlementEndDate;
    if (drS1RequestEntitlementEndDateDay && drS1RequestEntitlementEndDateMonth && drS1RequestEntitlementEndDateYear) {
      const monthIndex = parseInt(drS1RequestEntitlementEndDateMonth, 10) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        const monthName = monthNames[monthIndex];
        drS1RequestEntitlementEndDate = `${parseInt(drS1RequestEntitlementEndDateDay, 10)} ${monthName} ${drS1RequestEntitlementEndDateYear}`;
      } else {
        drS1RequestEntitlementEndDate = `${parseInt(drS1RequestEntitlementEndDateDay, 10)} ${drS1RequestEntitlementEndDateMonth} ${drS1RequestEntitlementEndDateYear}`; // fallback if invalid month
      }
    } else {
      drS1RequestEntitlementEndDate = '31 December 2026'; // default if not provided
  }
  
    req.session.data['dr-S1-request-entitlement-end-date'] = drS1RequestEntitlementEndDate;

  res.redirect('/version-45/s1/account/dependant/generate-s071/dr-cya-generate-s071');
})

// Check your answers before generating the S071
router.post([/dr-cya-generate-s071/], function(req, res) {

  res.redirect('/version-45/s1/account/dependant/generate-s071/dr-search-for-main-insured');
})

// View new S071 in the 'Documents' section
router.post([/dr-search-for-main-insured/], function(req, res) {

  res.redirect('/version-45/s1/account/dependant/generate-s071/dr-search-for-main-insured-results');
})

// Enter the main insured's PIN (E109 scenario)
router.post([/dr-enter-main-insured-pin/], function(req, res) {
  
  // Store the main insured's Personal Identification Number (PIN)
  req.session.data['dr-main-insured-pin-e109'] = req.body['dr-main-insured-pin-e109'];

  res.redirect('/version-45/s1/account/dependant/generate-s071/dr-cya-link-main-insured');
})

// Check your linking to the correct main insured before generating the S071
router.post([/dr-cya-link-main-insured/], function(req, res) {
  const journeyStartedFromDocumentsSection = req.session.data['from-documents']
 
  // Mark dependant S071 document as generated
  req.session.data['dr-s071-generated'] = 'Yes'

  // Mark dependant S071 document as linked to main
  req.session.data['dr-s071-linked-to-main'] = 'Yes'

if (journeyStartedFromDocumentsSection === 'Yes') {
  res.redirect('/version-45/s1/account/dependant/generate-s071/dr-confirmation-main-insured-linked')
} else {
  res.redirect('/version-45/s1/account/dependant/generate-s071/dr-confirmation-s071-generated')
}
})


// Confirmation dependant S071 generated
router.post([/dr-confirmation-s071-generated/], function(req, res) {

  res.redirect('/version-45/s1/account/dependant/generate-s071/dr-review-institution-details');
})

// Confirmation main insured linked
router.post([/dr-confirmation-main-insured-linked/], function(req, res) {

  res.redirect('/version-45/s1/account/dependant/generate-s071/dr-review-institution-details');
})

// Check your answers before generating the S071
router.post([/dr-review-institution-details/], function(req, res) {
  const drSendS071ToMemberState = req.session.data['dr-send-s071-to-member-state']

  if (drSendS071ToMemberState === 'Yes') {
    // Mark S071 as sent to MS
    req.session.data['dr-s071-sent-to-ms'] = 'Yes'
    res.redirect('/version-45/s1/account/dependant/generate-s071/dr-confirmation-s071-sent-to-ms')
  } else {
    res.redirect('/version-45/s1/account/dependant/system-generated-documents')
  }
})

// Confirmation S071 was sent to the member state
router.post([/dr-confirmation-s071-sent-to-ms/], function(req, res) {

  res.redirect('/version-45/s1/account/dependant/s1-requests');
})

// Are you sure you want to cancel generating an S071?
router.get([/dr-cancel-generate-s071/], function (req, res) {
  req.session.data['return-url'] = req.query.from

  res.render('version-45/s1/account/dependant/generate-s071/dr-cancel-generate-s071')
})

router.post([/dr-cancel-generate-s071/], function (req, res) {
  const drCancelGeneratingS071 =
    req.session.data['dr-cancel-generating-s071']

  if (drCancelGeneratingS071 === 'Yes') {
    res.redirect('/version-45/s1/account/dependant/s1-requests')
  } else {
    res.redirect(req.session.data['return-url'])
  }
})
module.exports = router;