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
  res.redirect('/version-34/s1/account/dependant/notes');
});

// Link a Main - from the Dependant's record //
// Check you're linking to the correct Main insurer and S1/S072 entitlement
router.post([/dr-link-to-entitlement-cya/], function(req, res){

  req.session.data['dr-add-main'] = 'yes'
  req.session.data['add-dependant'] = 'yes'

  res.redirect('/version-34/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
})

// How is the Dependant related to the Main Insured?
router.post([/dr-select-relationship/], function(req, res) {

  req.session.data['dr-add-main'] = 'yes'
  
  res.redirect('/version-34/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
});

// Change dependant relationship to Main Insured
router.post([/dr-change-relationship/], function(req, res) {

  req.session.data['dr-add-main'] = 'yes'

  req.session.data['dr-change-main-relationship'] = 'yes'

  // Save the new relationship temporarily in session data
  req.session.data['dr-new-relationship'] = req.body['dr-new-relationship'];
  
  res.redirect('/version-34/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
});


// S1/S072 Registration - Main //

// Select entitlement
router.post(/which-entitlement/, function(req, res){
  res.redirect('/version-34/s1/s072-registration/which-s1-entitlement');
})

// Select type of S1 entitlement
router.post([/which-s1-entitlement/], function(req, res) {
  var s1EntitlementType = req.session.data['s1-entitlement-type'];
  
  if (s1EntitlementType === 'E109') {
    res.redirect('/version-34/s1/s072-registration/entitlement-details');
  } else {
    res.redirect('/version-34/s1/s072-registration/entitlement-for');
  }
})


// Select who the entitlement is for
router.post([/entitlement-for/], function(req, res){
  res.redirect('/version-34/s1/s072-registration/entitlement-details');
})

// Select source
router.post([/which-source/], function(req, res) {
  // Capture form data from the POST request
  const sourceOfInformation = req.body['source-of-information'];
  const otherSourceOfInformationName = req.body['other-source-of-information-name'];

  // Store the data in the session object
  req.session.data = req.session.data || {}; // Initialize session data if not already present
  req.session.data['source-of-information'] = sourceOfInformation;

  // If 'Other' is selected, store the additional input field data
  if (sourceOfInformation === 'Other') {
    req.session.data['other-source-of-information-name'] = otherSourceOfInformationName;
  } else {
    // Clear previous "Other" field data if a different option is selected
    req.session.data['other-source-of-information-name'] = '';
  }

  // Redirect to the next step
  res.redirect('/version-34/s1/s072-registration/entitlement-details');
});

// Input entitlement details
router.post([/entitlement-details/], function(req, res){
  res.redirect('/version-34/s1/s072-registration/search-institution-ID');
})

// Search by institution ID (to show functionality)
router.post([/search-institution-ID/], function(req, res){
  res.redirect('/version-34/s1/s072-registration/institution-ID-search-results');
})

// Search by institution name (to show functionality)
router.post([/search-institution-name/], function(req, res){
  res.redirect('/version-34/s1/s072-registration/institution-name-search-results');
})

// Institution ID search results
router.post([/institution-ID-search-results/], function(req, res){
  res.redirect('/version-34/s1/s072-registration/new-s1-s073-entitlement-cya');
})

// Institution name search results
router.post([/institution-name-search-results/], function(req, res){
  res.redirect('/version-34/s1/s072-registration/new-s1-s073-entitlement-cya');
})

// Institution ID search results - not found (to show functionality)
router.post([/institution-ID-search-results-none/], function(req, res){
  res.redirect('/version-34/s1/s072-registration/add-new-institution-details');
})

// Institution ID search results - not found (to show functionality)
router.post([/institution-name-search-results-none/], function(req, res){
  res.redirect('/version-34/s1/s072-registration/add-new-institution-details');
})

// Institution ID search results - not found (to show functionality)
router.post([/add-new-institution-details/], function(req, res){
  res.redirect('/version-34/s1/s072-registration/new-s1-s072-entitlement-cya');
})

// Check your answers
router.post([/new-s1-s072-entitlement-cya/], function(req, res){
  req.session.data['dr-add-s1-entitlement'] = 'yes'
  res.redirect('/version-34/s1/s072-registration/confirmation-s1-s072-added');
})


// Main record //
// Add a new note
router.post([/add-note/], function(req, res) {
  // Retrieve the submitted note and note type
  const noteType = req.body['note-type'];
  const note = req.body['note'];

  // Store these in the session or database
  req.session.data['note-type'] = noteType;
  req.session.data['note'] = note;

  // Set flag that a new note was added
  req.session.data['new-note'] = 'yes';

  // Redirect back to the Main record notes screen
  res.redirect('/version-34/s1/account/notes');
});


// Link a Dependant - from the Main insured person's record
// Search for person
router.post([/person-search/], function(req, res){
  res.redirect('/version-34/s1/account/entitlement-content/person-search-results');
})

// Search results
router.post([/person-search-results/], function(req, res){
  res.redirect('/version-34/s1/account/entitlement-content/dependant-person-summary');
})

// Check you're linking to the correct dependant and S1/S072 entitlement
router.post([/link-to-entitlement-cya/], function(req, res){

  req.session.data['add-dependant'] = 'yes'
  req.session.data['dr-add-main'] = 'yes'

  res.redirect('/version-34/s1/account/entitlement-content/s1-entitlement-details');
})






// S1/S072 entitlement registration - Dependant //

// Select entitlement
router.post([/which-entitlement/], function(req, res){
  res.redirect('/version-34/s1/account/dependant/s1-s072-registration/which-s1-entitlement');
})

// Select type of S1 entitlement
router.post([/which-s1-entitlement/], function(req, res) {
  var s1EntitlementType = req.session.data['s1-entitlement-type'];
  
  if (s1EntitlementType === 'E109') {
    res.redirect('/version-34/s1/account/dependant/s072-registration/entitlement-details');
  } else {
    res.redirect('/version-34/s1/account/dependant/s072-registration/entitlement-for');
  }
})


// Select who the entitlement is for
router.post([/entitlement-for/], function(req, res){
  res.redirect('/version-34/s1/account/dependant/s1-s072-registration/entitlement-details');
})

// Input entitlement details
router.post([/entitlement-details/], function(req, res){
  res.redirect('/version-34/s1/account/dependant/s1-s072-registration/search-institution-ID');
})

// Search by institution ID (to show functionality)
router.post([/search-institution-ID/], function(req, res){
  res.redirect('/version-34/s1/account/dependant/s1-s072-registration/institution-ID-search-results');
})

// Search by institution name (to show functionality)
router.post([/search-institution-name/], function(req, res){
  res.redirect('/version-34/s1/account/dependant/s1-s072-registration/institution-name-search-results');
})

// Institution ID search results
router.post([/institution-ID-search-results/], function(req, res){
  res.redirect('/version-34/s1/account/dependant/s1-s072-registration/entitlement-details-cya');
})

// Institution name search results
router.post([/institution-name-search-results/], function(req, res){
  res.redirect('/version-34/s1/account/dependant/s1-s072-registration/entitlement-details-cya');
})

// Institution ID search results - not found (to show functionality)
router.post([/institution-ID-search-results-none/], function(req, res){
  res.redirect('/version-34/s1/account/dependant/s1-s072-registration/add-new-institution-details');
})

// Institution ID search results - not found (to show functionality)
router.post([/institution-name-search-results-none/], function(req, res){
  res.redirect('/version-34/s1/account/dependant/s1-s072-registration/add-new-institution-details');
})

// Institution ID search results - not found (to show functionality)
router.post([/add-new-institution-details/], function(req, res){
  res.redirect('/version-34/s1/account/dependant/s1-s072-registration/entitlement-details-cya');
})

// Check your answers
router.post([/entitlement-details-cya/], function(req, res){
  req.session.data['dr-add-s1-entitlement'] = 'yes'
  res.redirect('/version-34/s1/account/dependant/s1-s072-registration/confirmation-s1-s072-added');
})










// Check dependant's details
router.post([/s1-dependant-personal-details/], function(req, res) {
  // Log the value of the action field
  console.log(req.body.action);

  // Mark the dependant as added
  req.session.data['s1-add-dependant'] = 'yes';

  // Check the button action and redirect accordingly
  res.redirect('/version-34/s1/account/entitlement-content/s1-confirmation-dependant-added');
});

// Enter dependant's details
router.post([/s1-create-new-dependant-record/], function(req, res){
  res.redirect('add-dependant-address');
})

// Does the dependant live at the same address as the Main?
router.post([/add-dependant-address/], function(req, res) {
  const addDependantAddress = req.session.data['add-dependant-address'];
  
  if (addDependantAddress === 'yes'){
    res.redirect('/version-34/s1/account/entitlement-content/enter-dependant-address');
  } else {
    res.redirect('/version-34/s1/account/entitlement-content/s1-dependant-details-check');
  }
})

// Enter dependant's address
router.post([/enter-dependant-address/], function(req, res){
  res.redirect('s1-dependant-details-check');
})


// Check dependant's details
router.post([/s1-dependant-details-check/], function(req, res) {
  // Log the value of the action field
  console.log(req.body.action);

  // Mark the dependant as added
  req.session.data['s1-add-dependant'] = 'yes';

  // Check the button action and redirect accordingly
  if (req.body.action === 'add') {
    res.redirect('/version-34/s1/account/entitlement-content/s1-create-new-dependant-record?number-of-dependants=2');
  } else {
    res.redirect('/version-34/s1/account/entitlement-content/s1-confirmation-dependant-added');
  }
});




// Search for a person & create a new person record // 

// Enter person's name, DOB and address
router.post([/create-person-record/], function(req, res){
  res.redirect('add-address');
})

// Do you know the person's address?
router.post([/add-address/], (req, res) => {

  const knowAddress = req.session.data['know-address']

  if (knowAddress === 'yes') {
    res.redirect('enter-address')
  } else {
    res.redirect('create-person-record-cya')
  }

})

// Enter person's name, DOB and address
router.post([/enter-address/], function(req, res){
  res.redirect('create-person-record-cya');
})

// Check your answers
router.post([/create-person-record-cya/], function(req, res){
      res.redirect('confirmation-person-record-created');
})



// Personal details tabs //

// Change basic personal details
router.post([/change-basic-personal-details/], function(req, res){

  req.session.data['change-basic-personal-details'] = 'yes'

  res.redirect('/version-34/s1/account/basic-personal-details-comment');
})

// Add comments alongside change made to basic personal details
router.post([/basic-personal-details-comment/], function(req, res){

  req.session.data['add-basic-personal-details-comment'] = 'yes'

  res.redirect('/version-34/s1/account/personal-details');

})

// Change additional personal details
router.post([/change-additional-personal-details/], function(req, res){

  req.session.data['change-additional-personal-details'] = 'yes'

  res.redirect('/version-34/s1/account/additional-personal-details-change-reason');
})

// Select the reason for the change to the additional personal details
router.post([/additional-personal-details-change-reason/], function(req, res){

  res.redirect('/version-34/s1/account/additional-personal-details-comment');

})

// Add comments alongside change made to additional personal details
router.post([/additional-personal-details-comment/], function(req, res){

  req.session.data['add-additional-personal-details-comment'] = 'yes'

  res.redirect('/version-34/s1/account/personal-details');

})

router.post([/change-current-address/], function (req, res) {
  // Set session variable indicating the address change process has started
  req.session.data['change-address'] = 'yes';

  // Save the new address temporarily in session data
  req.session.data['new-address'] = req.body['new-address'];

  // Redirect to the comment screen
  res.redirect('/version-34/s1/account/change-current-address-comment');
});

// Add comments alongside change to current address
router.post([/change-current-address-comment/], function (req, res) {
  // Save the comment for the address change
  req.session.data['address-change-comment'] = req.body['address-change-comment'];

  // Update the current address with the new address
  req.session.data['current-address'] = req.session.data['new-address'];

  // Add a log entry in the case history
  const caseHistoryEntry = {
    action: 'Address changed',
    details: {
      oldAddress: req.session.data['previous-address'],
      newAddress: req.session.data['current-address'],
      comment: req.session.data['address-change-comment']
    },
    timestamp: new Date().toISOString()
  };
  req.session.data['case-history-person'] = req.session.data['case-history-person'] || [];
  req.session.data['case-history-person'].push(caseHistoryEntry);

  // Redirect back to address details with updated data
  res.redirect('/version-34/s1/account/personal-details');
});

// View case history section
router.get('/version-34/s1/account/case-history-person', function (req, res) {
  res.render('version-34/s1/account/case-history-person', {
    history: req.session.data['case-history-person']
  });
});



router.post([/change-date-of-residency-uk/], function (req, res) {
  // Set session variable indicating the address change process has started
  req.session.data['change-date-of-residency-uk'] = 'yes';

  // Save the new address temporarily in session data
  req.session.data['new-date-of-residency-uk'] = req.body['new-date-of-residency-uk'];

  // Redirect to the comment screen
  res.redirect('/version-34/s1/account/change-current-address-comment');
});

// Add comments alongside change to current UK residency date
router.post([/change-date-of-residency-uk-comment/], function (req, res) {
  // Save the comment for the address change
  req.session.data['uk-residency-change-comment'] = req.body['uk-residency-change-comment'];

  // Update the current UK residency date with the new UK residency date
  req.session.data['current-uk-residency-date'] = req.session.data['new-uk-residency-date'];

  // Add a log entry in the case history
  const caseHistoryEntry = {
    action: 'Date of UK residency changed',
    details: {
      oldUKResidencyDate: req.session.data['previous-uk-residency-date'],
      newUKResidencyDate: req.session.data['current-uk-residency-date'],
      comment: req.session.data['uk-residency-date-change-comment']
    },
    timestamp: new Date().toISOString()
  };
  req.session.data['case-history-person'] = req.session.data['case-history-person'] || [];
  req.session.data['case-history-person'].push(caseHistoryEntry);

  // Redirect back to personal details with updated data
  res.redirect('/version-34/s1/account/personal-details');
});

// View case history section
router.get('/version-34/s1/account/case-history-person', function (req, res) {
  res.render('version-34/s1/account/case-history-person', {
    history: req.session.data['case-history-person']
  });
});





// Entitlements section - S1 Entitlement //

// Change S1 entitlement details
router.post([/change-s1-entitlement-details/], function(req, res){

  req.session.data['update-s1-entitlement-details'] = 'yes'

  // Save the new PIN temporarily in session data
  req.session.data['updated-s1-entitlement-pin'] = req.body['updated-s1-entitlement-pin'];

  res.redirect('/version-34/s1/account/entitlement-content/s1-entitlement-details');

})

// Change S1 entitlement institution details
router.post([/change-s1-entitlement-institution-details/], function(req, res){

  req.session.data['change-s1-entitlement-institution-details'] = 'yes'

  res.redirect('/version-34/s1/account/entitlement-content/s1-entitlement-details');

})


// S1 Cancellations //

// Dependant's record
// Select who is cancelling the entitlement
router.post([/dr-cancellation-source/], function(req, res) {

  // Save the source in session data
  req.session.data['dr-cancelled-by'] = req.body['dr-cancelled-by'];

  // Extract the cancellation source from the request body
  const drCancellationSource = req.body['dr-cancelled-by'];

  // Redirection logic based on the cancellation source
  if (drCancellationSource === 'UK') {
    res.redirect('/version-34/s1/account/dependant/cancellations/dr-entitlement-end-date');
  } else 
    res.redirect('/version-34/s1/account/dependant/cancellations/dr-date-s016-issued');
  
});

// Enter the date the S016 was issued by the MS
router.post([/dr-date-s016-issued/], function(req, res) {
  // Extract day, month, and year from the request body
  const day = req.body['dr-date-s016-issued-day'];
  const month = req.body['dr-date-s016-issued-month'];
  const year = req.body['dr-date-s016-issued-year'];

  // Combine to form the full date (or use a default if not provided)
  const drDateS016Issued = day && month && year ? `${day}/${month}/${year}` : '13/01/2025';

  // Save the formatted date in session data
  req.session.data['dr-date-s016-issued'] = drDateS016Issued;

  // Redirect to the next step in the journey
  res.redirect('/version-34/s1/account/dependant/cancellations/dr-entitlement-end-date');
});

// Enter the end date of the entitlement
router.post([/dr-entitlement-end-date/], function(req, res) {
  // Extract day, month, and year from the request body
  const day = req.body['dr-entitlement-end-date-day'];
  const month = req.body['dr-entitlement-end-date-month'];
  const year = req.body['dr-entitlement-end-date-year'];

  // Combine to form the full date (or use a default if not provided)
  const drEntitlementEndDate = day && month && year ? `${day}/${month}/${year}` : '13/01/2025';

  // Save the formatted date in session data
  req.session.data['dr-entitlement-end-date'] = drEntitlementEndDate;

  // Redirect to the next step in the journey
  res.redirect('/version-34/s1/account/dependant/cancellations/dr-cancellation-reason');
});

// Select the cancellation reason
router.post([/dr-cancellation-reason/], (req, res) => {
  const { 'dr-cancellation-reason': drCancellationReason } = req.body; // Destructure cancellation reason from the request body

  // Save the cancellation reason in session data
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

  if (drDateCaptureReasons.includes(drCancellationReason)) {
    res.redirect('/version-34/s1/account/dependant/cancellations/dr-enter-date-dynamic'); // Redirect to dynamic date capture screen
  } else if (drCancellationReason === 'The entitlement holder is insured in another country because they have a pension there') {
    res.redirect('/version-34/s1/account/dependant/cancellations/dr-country-pension-awarded');
  } else if ([
    'The status of the entitlement holder has changed',
    'The institution issuing the entitlement has changed',
    'The dependant has applied for their own S1'
  ].includes(drCancellationReason)) {
    res.redirect('/version-34/s1/account/dependant/cancellations/dr-additional-comments-optional');
  } else if (drCancellationReason === 'Other') {
    res.redirect('/version-34/s1/account/dependant/cancellations/dr-other-cancellation-reason');
  }
});

// Enter date dynamic
router.post([/dr-enter-date-dynamic/], function(req, res){

res.redirect('/version-34/s1/account/dependant/cancellations/dr-additional-comments-optional');

});


// Select the country where the state pension was awarded
router.post([/dr-country-pension-awarded/], function(req, res) {

  // Extract the selected country from the request body
  const drStatePensionCountry = req.body['dr-state-pension-country'];

  // Save the country in session data
  req.session.data['dr-state-pension-country'] = drStatePensionCountry;
    
  res.redirect('/version-34/s1/account/dependant/cancellations/dr-date-state-pension-awarded');
});


// Enter the date the state pension was awarded (optional)
router.post([/dr-date-state-pension-awarded/], function(req, res) {

  // Extract day, month, and year from the request body
  const day = req.body['dr-state-pension-awarded-date-day'];
  const month = req.body['dr-state-pension-awarded-date-month'];
  const year = req.body['dr-state-pension-awarded-date-year'];
  
  // Combine to form the full date (or use a default if not provided)
  const drStatePensionAwardedDate = day && month && year ? `${day}/${month}/${year}` : '14/01/2025';
  
  // Save the formatted date in session data
  req.session.data['dr-state-pension-awarded-date'] = drStatePensionAwardedDate;
    
  res.redirect('/version-34/s1/account/dependant/cancellations/dr-additional-comments-optional');
});


// Enter additional comments (optional)
router.post([/dr-additional-comments-optional/], function (req, res) {
  // Retrieve and trim additional comments (default to empty string if not provided)
  const comments = (req.body['dr-cancellation-additional-comments'] || '').trim();

  // Store comments in session data
  req.session.data['dr-cancellation-additional-comments'] = comments;

  // Set flag based on whether a comment was entered
  req.session.data['dr-add-cancellation-additional-comments'] = comments ? 'yes' : 'no';

  // Redirect based on who cancelled the entitlement
  const redirectPath = req.session.data['cancelled-by'] === 'UK' 
    ? '/version-34/s1/account/dependant/cancellations/dr-date-s018-sent' 
    : '/version-34/s1/account/dependant/cancellations/dr-date-s017-sent';

  res.redirect(redirectPath);
});
  

// Enter the date the S018 was sent to the Member State
router.post([/dr-date-s018-sent/], function(req, res) {

  // Extract day, month, and year from the request body
  const day = req.body['dr-date-s018-sent-day'];
  const month = req.body['dr-date-s018-sent-month'];
  const year = req.body['dr-date-s018-sent-year'];
  
  // Combine to form the full date (or use a default if not provided)
  const dateS018Sent = day && month && year ? `${day}/${month}/${year}` : '14/01/2025';
  
  // Save the formatted date in session data
  req.session.data['dr-date-s018-sent-date'] = dateS018Sent;
    
    res.redirect('/version-34/s1/account/dependant/cancellations/dr-cancellation-cya');
});

// Enter the date the S017 was sent to the Member State
router.post([/dr-date-s017-sent/], function(req, res) {

  // Extract day, month, and year from the request body
  const day = req.body['dr-date-s017-sent-day'];
  const month = req.body['dr-date-s017-sent-month'];
  const year = req.body['dr-date-s017-sent-year'];
  
  // Combine to form the full date (or use a default if not provided)
  const dateS017Sent = day && month && year ? `${day}/${month}/${year}` : '14/01/2025';
  
  // Save the formatted date in session data
  req.session.data['date-s017-sent-date'] = dateS017Sent;
    
    res.redirect('/version-34/s1/account/dependant/cancellations/dr-cancellation-cya');
});

// Check your answers
router.post([/dr-cancellation-cya/], function(req, res){

    // Mark the entitlement as cancelled
    req.session.data['dr-cancel-s1-entitlement'] = 'yes';

  res.redirect('/version-34/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
})

// Date S019 received from the Member State
router.post([/dr-date-s019-received/], function(req, res){

  // Extract day, month, and year from the request body
  const day = req.body['dr-date-s019-received-day'];
  const month = req.body['dr-date-s019-received-month'];
  const year = req.body['dr-date-s019-received-year'];
  
  // Combine to form the full date (or use a default if not provided)
  const drDateS019Received = day && month && year ? `${day}/${month}/${year}` : '17/03/2025';
  
  // Save the formatted date in session data
  req.session.data['dr-date-s019-received'] = drDateS019Received;

  // Mark S019 as received
  req.session.data['dr-update-date-s019-received'] = 'yes';

res.redirect('/version-34/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');

})


// Main's record

// Enter cancellation details
router.post([/cancellation-details/], (req, res) => {
  // Save the source in session data
  req.session.data['cancelled-by'] = req.body['cancelled-by'];

  // Extract the cancellation source from the request body
  const cancellationSource = req.body['cancelled-by'];
  
  // Extract day, month, and year from the request body
  const day = req.body['entitlement-end-date-day'];
  const month = req.body['entitlement-end-date-month'];
  const year = req.body['entitlement-end-date-year'];

  // Combine to form the full date (or use a default if not provided)
  const entitlementEndDate = day && month && year ? `${day}/${month}/${year}` : '13/01/2025';

  // Save the formatted date in session data
  req.session.data['entitlement-end-date'] = entitlementEndDate;

  // Extract and save the cancellation reason in session data
  const cancellationReason = req.body['cancellation-reason']; // FIX: Define this before using it
  req.session.data['cancellation-reason'] = cancellationReason;

  // Reasons requiring a dynamic date capture
  const dateCaptureReasons = [
    'The entitlement holder is no longer insured by the Member State',
    'The entitlement holder is no longer entitled to sickness benefit from the Member State',
    'The entitlement holder no longer lives in the UK',
    'The entitlement holder lives in another Member State',
    'The entitlement holder has died',
    'The dependant’s main insured has died'
  ];

  // Extract the selected country from the request body
  const statePensionCountry = req.body['state-pension-country'];

  // Save the country in session data
  req.session.data['state-pension-country'] = statePensionCountry;

  // Redirect to the next page
  res.redirect('/version-34/s1/account/cancellations/additional-comments-optional');
});



// Enter additional comments (optional)
router.post([/additional-comments-optional/], function (req, res) {
  // Retrieve and trim additional comments (default to empty string if not provided)
  const comments = (req.body['cancellation-additional-comments'] || '').trim();

  // Store comments in session data
  req.session.data['cancellation-additional-comments'] = comments;

  // Set flag based on whether a comment was entered
  req.session.data['add-cancellation-additional-comments'] = comments ? 'yes' : 'no';

  res.redirect('/version-34/s1/account/cancellations/cancellation-cya');

});
  

// Check your answers
router.post([/cancellation-cya/], function(req, res){

    // Mark the entitlement as cancelled
    req.session.data['cancel-s1-entitlement'] = 'yes';

  res.redirect('/version-34/s1/account/entitlement-content/s1-entitlement-details');
})

// Change the end date of the S1 entitlement
router.post([/change-s1-entitlement-end-date/], function(req, res){

  // Extract day, month, and year from the request body
  const day = req.body['updated-s1-entitlement-end-date-day'];
  const month = req.body['updated-s1-entitlement-end-date-month'];
  const year = req.body['updated-s1-entitlement-end-date-year'];
  
  // Combine to form the full date (or use a default if not provided)
  const updatedS1EntitlementEndDate = day && month && year ? `${day}/${month}/${year}` : '17/03/2025';
  
  // Save the formatted date in session data
  req.session.data['updated-s1-entitlement-end-date'] = updatedS1EntitlementEndDate;

  // Mark end date of S1 entitlement as updated
  req.session.data['update-s1-entitlement-end-date'] = 'yes';

res.redirect('/version-34/s1/account/entitlement-content/s1-entitlement-details');

})



// Upload documents //

// Upload document
router.post([/upload-document/], function(req, res){

  // Retrieve the document type
  const documentType = req.body['document-type'];

  // Store the document type in the session or database
  req.session.data['document-type'] = documentType;

res.redirect('/version-34/s1/account/document-comments');

})


// Upload a new document - comments
router.post([/document-comments/], function(req, res){

  // Retrieve the document comments
  const comments = req.body['document-comments'];

  // Store these in the session or database
  req.session.data['document-comments'] = comments;

  // Set flag that a new document was uploaded
  req.session.data['upload-new-document'] = 'yes'

  // Redirect to the S1/S072 entitlement details screen and the tab that displays the notes table
  res.redirect('/version-34/s1/account/documents');

})








// Remove dependant
router.post([/s1-remove-dependant/], (req, res) => {

  const removeDependant = req.session.data['remove-dependant']

  if (removeDependant === 'yes') {
    res.redirect('s1-dependant-details-cya')
  } else {
    res.redirect('s1-dependant-details-cya')
  }

})


// Remove document from Personal Details section
router.post([/remove-document/], function(req, res){

  const removeDocument = req.session.data['remove-document']

  if (removeDocument === 'yes') {
      res.redirect('/version-34/s1/account/documents')
  } else {
      res.redirect('/version-34/s1/account/documents')
  }


})





// Communication module for OVMs to resubs


// OVM
router.post([/contacted-the-ovm-additional-info/], function(req, res){
  var ovm = req.session.data['ovm'];
  
  if (ovm == 'yes'){
      res.redirect('enter-details');
  } else if (hasDL1609 == 'no'){
      res.redirect('send-another-form');
  } else {
      
  }
})


module.exports = router;