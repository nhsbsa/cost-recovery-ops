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
router.post([/dr-which-entitlement/], function(req, res){
  var drEntitlementType = req.session.data['dr-entitlement-type'];
  
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/dr-which-s1-entitlement');
})

// Select type of S1 entitlement
router.post([/dr-which-s1-entitlement/], function(req, res) {
  var drS1EntitlementType = req.session.data['dr-s1-entitlement-type'];
  
  if (drS1EntitlementType === 'E109') {
    res.redirect('/version-43/s1/account/dependant/s1-s072-registration/dr-entitlement-details');
  } else {
    res.redirect('/version-43/s1/account/dependant/s1-s072-registration/dr-entitlement-for');
  }
})


// Select who the entitlement is for
router.post([/dr-entitlement-for/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/dr-entitlement-details');
})

// Input entitlement details
router.post([/dr-entitlement-details/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/dr-search-institution-ID');
})

// Search by institution ID (to show functionality)
router.post([/dr-search-institution-ID/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/dr-institution-ID-search-results');
})

// Search by institution name (to show functionality)
router.post([/dr-search-institution-name/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/dr-institution-name-search-results');
})

// Institution ID search results
router.post([/dr-institution-ID-search-results/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/dr-entitlement-details-cya');
})

// Institution name search results
router.post([/dr-institution-name-search-results/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/dr-entitlement-details-cya');
})

// Institution ID search results - not found (to show functionality)
router.post([/dr-institution-ID-search-results-none/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/dr-add-new-institution-details');
})

// Institution ID search results - not found (to show functionality)
router.post([/dr-institution-name-search-results-none/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/dr-add-new-institution-details');
})

// Institution ID search results - not found (to show functionality)
router.post([/dr-add-new-institution-details/], function(req, res){
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/dr-entitlement-details-cya');
})

// Check your answers
router.post([/dr-entitlement-details-cya/], function(req, res){
  req.session.data['dr-add-s1-entitlement'] = 'yes'
  res.redirect('/version-43/s1/account/dependant/s1-s072-registration/dr-confirmation-s1-s072-added');
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



module.exports = router;