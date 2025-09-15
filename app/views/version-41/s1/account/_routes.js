// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// Person record (Main insured) //


// Notes section //

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
  res.redirect('/version-41/s1/account/notes');
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


// Change the person's first and/or last names
// Step 1 - change personal details
router.post([/change-personal-details/], function(req, res) {
  req.session.data['new-first-names'] = req.body['new-first-names'];
  req.session.data['new-birth-first-names'] = req.body['new-birth-first-names'];
  req.session.data['new-last-name'] = req.body['new-last-name'];
  req.session.data['new-birth-last-name'] = req.body['new-birth-last-name'];
  
  // Store the new date of birth
  const dobDay = req.body['new-date-of-birth-day'];
  const dobMonth = req.body['new-date-of-birth-month'];
  const dobYear = req.body['new-date-of-birth-year'];

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let dobDate;
  if (dobDay && dobMonth && dobYear) {
    const monthIndex = parseInt(dobMonth, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      const monthName = monthNames[monthIndex];
      dobDate = `${parseInt(dobDay, 10)} ${monthName} ${dobYear}`;
    } else {
      dobDate = `${parseInt(dobDay, 10)} ${dobMonth} ${dobYear}`; // fallback if invalid month
    }
  } else {
    dobDate = '1 July 1951'; // default if not provided
}

req.session.data['new-date-of-birth'] = dobDate;


  res.redirect('/version-41/s1/account/reason-for-personal-details-change');
})

// Step 2 - add reason for changing names
router.post([/reason-for-personal-details-change/], function(req, res) {
  req.session.data['reason-for-changing-personal-details'] = req.body['reason-for-changing-personal-details'];
  res.redirect('/version-41/s1/account/check-before-changing-personal-details');
})

// Step 3 - check your answers
router.post([/check-before-changing-personal-details/], function(req, res) {
  req.session.data['change-personal-details'] = 'yes';
  res.redirect('/version-41/s1/account/personal-details');
})



// Add additional details to person record
// Step 1 — Add additional personal details
router.post([/add-additional-personal-details/], function(req, res){

  req.session.data['sex'] = req.body['sex'];
  req.session.data['nationality'] = req.body['nationality'];
  req.session.data['UK-national-insurance-number'] = req.body['UK-national-insurance-number'];
  req.session.data['email-address'] = req.body['email-address'];
  req.session.data['contact-number'] = req.body['contact-number'];

  res.redirect('/version-41/s1/account/additional-personal-details-cya');
})

// Step 2 - Check your answers before adding additional personal details
router.post([/additional-personal-details-cya/], function(req, res){
  req.session.data['add-additional-personal-details'] = 'yes'

  res.redirect('/version-41/s1/account/personal-details');
})


// Change additional details on person record
// Step 1 — Change additional personal details
router.post([/change-additional-personal-details/], function (req, res) {
  req.session.data['updated-sex'] = req.body['updated-sex'];
  req.session.data['updated-nationality'] = req.body['updated-nationality'];
  req.session.data['updated-UK-national-insurance-number'] = req.body['updated-UK-national-insurance-number'];
  req.session.data['updated-email-address'] = req.body['updated-email-address'];
  req.session.data['updated-contact-number'] = req.body['updated-contact-number'];

  res.redirect('/version-41/s1/account/reason-for-changing-additional-details');
});

// Step 2 — Enter reason for the change
router.post([/reason-for-changing-additional-details/], function (req, res) {
  req.session.data['reason-for-changing-additional-details'] =
    req.body['reason-for-changing-additional-details']; 

  res.redirect('/version-41/s1/account/check-before-changing-additional-details');
});

// Step 3 — Confirm on CYA page
router.post([/check-before-changing-additional-details/], function (req, res) {
  req.session.data['change-additional-personal-details'] = 'yes';

  res.redirect('/version-41/s1/account/personal-details');
});



// Change current address 
// Step 1 - Change the current address
router.post([/change-current-address/], function (req, res) {

  // Build the new address from individual form fields
  req.session.data['new-address'] = {
    line1: req.body['new-address-line-1'] || '',
    line2: req.body['new-address-line-2'] || '',
    line3: req.body['new-address-line-3'] || '',
    town: req.body['new-address-town'] || '',
    region: req.body['new-address-region'] || '',
    postcode: req.body['new-address-postcode'] || '',
    country: req.body['new-address-country'] || ''
  };

  // Redirect to the check-your-answers screen
  res.redirect('/version-41/s1/account/check-before-changing-current-address');
});

// Step 2 - Check your answers before changing current address
router.post([/check-before-changing-current-address/], function (req, res) {
  // Set session variable indicating the address change process has started
  req.session.data['change-current-address'] = 'yes';

  // Redirect back to address details with updated data
  res.redirect('/version-41/s1/account/personal-details');
});






// Upload documents //

// Upload document
router.post([/upload-document/], function(req, res){

  // Retrieve the document type
  const documentType = req.body['document-type'];

  // Store the document type in the session or database
  req.session.data['document-type'] = documentType;

res.redirect('/version-41/s1/account/document-comments');

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
  res.redirect('/version-41/s1/account/documents');

})


// Remove document from Personal Details section
router.post([/remove-personal-details-document/], function(req, res){

  const removeDocument = req.session.data['remove-document']

  if (removeDocument === 'yes') {
      res.redirect('/version-41/s1/account/documents')
  } else {
      res.redirect('/version-41/s1/account/documents')
  }


})


module.exports = router;