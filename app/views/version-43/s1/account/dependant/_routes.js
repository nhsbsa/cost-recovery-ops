// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// Entitlements and treatments section //

// Dependant record //
// Add a note
router.post([/add-note-dependant/], function(req, res) {
  console.log('Adding note to Dependant record...');
  console.log('Note Type:', req.body['dr-note-type']);
  console.log('Note:', req.body['dr-note']);

  req.session.data['dr-note-type'] = req.body['dr-note-type'];
  req.session.data['dr-note'] = req.body['dr-note'];
  req.session.data['dr-new-note'] = 'yes';

  console.log('Redirecting to Dependant notes...');
  res.redirect('/version-43/s1/account/dependant/notes');
});

// Link a Main - from the Dependant's record //
// Check you're linking to the correct Main insurer and S1/S072 entitlement
router.post([/dr-link-to-entitlement-cya/], function(req, res){

  req.session.data['dr-add-main'] = 'yes'
  req.session.data['add-dependant'] = 'yes'

  res.redirect('/version-43/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
})

// How is the Dependant related to the Main Insured?
router.post([/dr-select-relationship/], function(req, res) {

  req.session.data['dr-add-main'] = 'yes'
  
  res.redirect('/version-43/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
});

// Change dependant relationship to Main Insured
router.post([/dr-change-relationship/], function(req, res) {

  req.session.data['dr-add-main'] = 'yes'

  req.session.data['dr-change-main-relationship'] = 'yes'

  // Save the new relationship temporarily in session data
  req.session.data['dr-new-relationship'] = req.body['dr-new-relationship'];
  
  res.redirect('/version-43/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
});



// S1/S072 entitlement registration - Dependant //

// Select entitlement
router.post([/which-entitlement/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/which-s1-entitlement');
})

// Select type of S1 entitlement
router.post([/which-s1-entitlement/], function(req, res) {
  var s1EntitlementType = req.session.data['s1-entitlement-type'];
  
  if (s1EntitlementType === 'E109') {
    res.redirect('/version-43/s1/account/dependant/s072-registration/entitlement-details');
  } else {
    res.redirect('/version-43/s1/account/dependant/s072-registration/entitlement-for');
  }
})


// Select who the entitlement is for
router.post([/entitlement-for/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/entitlement-details');
})

// Input entitlement details
router.post([/entitlement-details/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/search-institution-ID');
})

// Search by institution ID (to show functionality)
router.post([/search-institution-ID/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/institution-ID-search-results');
})

// Search by institution name (to show functionality)
router.post([/search-institution-name/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/institution-name-search-results');
})

// Institution ID search results
router.post([/institution-ID-search-results/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/entitlement-details-cya');
})

// Institution name search results
router.post([/institution-name-search-results/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/entitlement-details-cya');
})

// Institution ID search results - not found (to show functionality)
router.post([/institution-ID-search-results-none/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/add-new-institution-details');
})

// Institution ID search results - not found (to show functionality)
router.post([/institution-name-search-results-none/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/add-new-institution-details');
})

// Institution ID search results - not found (to show functionality)
router.post([/add-new-institution-details/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/entitlement-details-cya');
})

// Check your answers
router.post([/entitlement-details-cya/], function(req, res){
  req.session.data['dr-add-s1-entitlement'] = 'yes'
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/confirmation-s1-s072-added');
})



















// S1 Cancellations //

// Dependant's record
// Enter cancellation details
router.post([/dr-cancellation-details/], (req, res) => {
  // Save the source in session data
  req.session.data['dr-cancelled-by'] = req.body['dr-cancelled-by'];

  // Extract the cancellation source from the request body
  const drCancellationSource = req.body['dr-cancelled-by'];
  
  // Extract day, month, and year from the request body
  const day = req.body['dr-entitlement-end-date-day'];
  const month = req.body['dr-entitlement-end-date-month'];
  const year = req.body['dr-entitlement-end-date-year'];

  // Combine to form the full date (or use a default if not provided)
  const drEntitlementEndDate = day && month && year ? `${day}/${month}/${year}` : '13/01/2025';

  // Save the formatted date in session data
  req.session.data['dr-entitlement-end-date'] = drEntitlementEndDate;

  // Extract and save the cancellation reason in session data
  const drCancellationReason = req.body['dr-cancellation-reason']; // FIX: Define this before using it
  req.session.data['dr-cancellation-reason'] = drCancellationReason;

  // Reasons requiring a dynamic date capture
  const drDateCaptureReasons = [
    'The entitlement holder is no longer insured by the Member State',
    'The entitlement holder is no longer entitled to sickness benefit from the Member State',
    'The entitlement holder no longer lives in the UK',
    'The entitlement holder lives in another Member State',
    'The entitlement holder has died',
    'The dependant’s main insured has died'
  ];

  // Extract the selected country from the request body
  const drStatePensionCountry = req.body['dr-state-pension-country'];

  // Save the country in session data
  req.session.data['dr-state-pension-country'] = drStatePensionCountry;

  // Redirect to the next page
  res.redirect('/version-43/s1/account/dependant/cancellations/dr-additional-comments-optional');
});



// Enter additional comments (optional)
router.post([/dr-additional-comments-optional/], function (req, res) {
  // Retrieve and trim additional comments (default to empty string if not provided)
  const drComments = (req.body['dr-cancellation-additional-comments'] || '').trim();

  // Store comments in session data
  req.session.data['dr-cancellation-additional-comments'] = drComments;

  // Set flag based on whether a comment was entered
  req.session.data['dr-add-cancellation-additional-comments'] = drComments ? 'yes' : 'no';

  res.redirect('/version-43/s1/account/dependant/cancellations/dr-cancellation-cya');

});
  

// Check your answers
router.post([/dr-cancellation-cya/], function(req, res){

    // Mark the entitlement as cancelled
    req.session.data['dr-cancel-s1-entitlement'] = 'yes';

  res.redirect('/version-43/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
})

// Change the end date of the S1 entitlement
router.post([/dr-change-s1-entitlement-end-date/], function(req, res){

  // Extract day, month, and year from the request body
  const day = req.body['dr-updated-s1-entitlement-end-date-day'];
  const month = req.body['dr-updated-s1-entitlement-end-date-month'];
  const year = req.body['dr-updated-s1-entitlement-end-date-year'];
  
  // Combine to form the full date (or use a default if not provided)
  const drUpdatedS1EntitlementEndDate = day && month && year ? `${day}/${month}/${year}` : '17/03/2025';
  
  // Save the formatted date in session data
  req.session.data['dr-updated-s1-entitlement-end-date'] = drUpdatedS1EntitlementEndDate;

  // Mark end date of S1 entitlement as updated
  req.session.data['dr-update-s1-entitlement-end-date'] = 'yes';

res.redirect('/version-43/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');

})


// Personal details tabs //


// Change the person's names and/or date of birth
// Step 1 - change names and/or date of birth
router.post([/dr-change-personal-details/], function(req, res) {
  req.session.data['dr-new-first-names'] = req.body['dr-new-first-names'];
  req.session.data['dr-new-birth-first-names'] = req.body['dr-new-birth-first-names'];
  req.session.data['dr-new-last-name'] = req.body['dr-new-last-name'];
  req.session.data['dr-new-birth-last-name'] = req.body['dr-new-birth-last-name'];

  // Store the new date of birth
  const drDobDay = req.body['new-date-of-birth-day'];
  const drDobMonth = req.body['new-date-of-birth-month'];
  const drDobYear = req.body['new-date-of-birth-year'];

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let drDobDate;
  if (drDobDay && drDobMonth && drDobYear) {
    const monthIndex = parseInt(drDobMonth, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      const monthName = monthNames[monthIndex];
      drDobDate = `${parseInt(drDobDay, 10)} ${monthName} ${drDobYear}`;
    } else {
      drDobDate = `${parseInt(drDobDay, 10)} ${drDobMonth} ${drDobYear}`; // fallback if invalid month
    }
  } else {
    drDobDate = '29 December 1975'; // default if not provided
}

  res.redirect('/version-43/s1/account/dependant/dr-reason-for-personal-details-change');
})

// Step 2 - add reason for changing personal details
router.post([/dr-reason-for-personal-details-change/], function(req, res) {
  req.session.data['dr-reason-for-changing-personal-details'] = req.body['dr-reason-for-changing-personal-details'];
  res.redirect('/version-43/s1/account/dependant/dr-check-before-changing-personal-details');
})

// Step 3 - check your answers
router.post([/dr-check-before-changing-personal-details/], function(req, res) {
  req.session.data['dr-change-personal-details'] = 'yes';
  res.redirect('/version-43/s1/account/dependant/personal-details');
})


// Add additional details to person record
// Step 1 — Add additional personal details
router.post([/dr-add-additional-personal-details/], function(req, res){

  req.session.data['dr-sex'] = req.body['dr-sex'];
  req.session.data['dr-nationality'] = req.body['dr-nationality'];
  req.session.data['dr-UK-national-insurance-number'] = req.body['dr-UK-national-insurance-number'];
  req.session.data['dr-email-address'] = req.body['dr-email-address'];
  req.session.data['dr-contact-number'] = req.body['dr-contact-number'];

  res.redirect('/version-43/s1/account/dependant/dr-additional-personal-details-cya');
})

// Step 2 - Check your answers before adding additional personal details
router.post([/dr-additional-personal-details-cya/], function(req, res){
  req.session.data['dr-add-additional-personal-details'] = 'yes'

  res.redirect('/version-43/s1/account/dependant/personal-details');
})


// Change additional details on person record
// Step 1 — Change additional personal details
router.post([/dr-change-additional-personal-details/], function (req, res) {
  req.session.data['dr-updated-sex'] = req.body['dr-updated-sex'];
  req.session.data['dr-updated-nationality'] = req.body['dr-updated-nationality'];
  req.session.data['dr-updated-UK-national-insurance-number'] = req.body['dr-updated-UK-national-insurance-number'];
  req.session.data['dr-updated-email-address'] = req.body['dr-updated-email-address'];
  req.session.data['dr-updated-contact-number'] = req.body['dr-updated-contact-number'];

  res.redirect('/version-43/s1/account/dependant/dr-reason-for-changing-additional-details');
});

// Step 2 — Enter reason for the change
router.post([/dr-reason-for-changing-additional-details/], function (req, res) {
  req.session.data['dr-reason-for-changing-additional-details'] =
    req.body['dr-reason-for-changing-additional-details']; 

  res.redirect('/version-43/s1/account/dependant/dr-check-before-changing-additional-details');
});

// Step 3 — Confirm on CYA page
router.post([/dr-check-before-changing-additional-details/], function (req, res) {
  req.session.data['dr-change-additional-personal-details'] = 'yes';

  res.redirect('/version-43/s1/account/dependant/personal-details');
});


// Change current address 
// Step 1 - Change the current address
router.post([/dr-change-current-address/], function (req, res) {

  // Build the new address from individual form fields
  req.session.data['dr-new-current-address'] = {
    line1: req.body['dr-new-current-address-line-1'] || '',
    line2: req.body['dr-new-current-address-line-2'] || '',
    line3: req.body['dr-new-current-address-line-3'] || '',
    town: req.body['dr-new-current-address-town'] || '',
    region: req.body['dr-new-current-address-region'] || '',
    postcode: req.body['dr-new-current-address-postcode'] || '',
    country: req.body['dr-new-current-address-country'] || ''
  };

  // Redirect to the check-your-answers screen
  res.redirect('/version-43/s1/account/dependant/dr-reason-for-current-address-change');
});

// Step 2 - add reason for changing current address
router.post([/dr-reason-for-current-address-change/], function(req, res) {
  req.session.data['dr-reason-for-changing-current-address'] = req.body['dr-reason-for-changing-current-address'];
  res.redirect('/version-43/s1/account/dependant/dr-check-before-changing-current-address');
})

// Step 3 - Check your answers before changing current address
router.post([/dr-check-before-changing-current-address/], function (req, res) {
  // Set session variable indicating the address change process has started
  req.session.data['dr-change-current-address'] = 'yes';

  // Redirect back to address details with updated data
  res.redirect('/version-43/s1/account/dependant/personal-details');
});
module.exports = router;