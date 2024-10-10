// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// Entitlements and enquiries section //

// Add a dependant journey //

// Search for a dependant
router.post([/s1-dependant-search/], function(req, res){
  res.redirect('s1-dependant-search-results');
})



// Check dependant's details
router.post([/s1-dependant-personal-details/], function(req, res) {
  // Log the value of the action field
  console.log(req.body.action);

  // Mark the dependant as added
  req.session.data['s1-add-dependant'] = 'Yes';

  // Check the button action and redirect accordingly
  res.redirect('/version-29/s1/account/entitlement-content/s1-confirmation-dependant-added');
});

// Enter dependant's details
router.post([/s1-create-new-dependant-record/], function(req, res){
  res.redirect('s1-dependant-address-same');
})

// Does the dependant live at the same address as the Main?
router.post([/s1-dependant-address-same/], function(req, res) {
  const sameAddressAsMain = req.session.data['dependant-address-same-as-main'];
  
  if (sameAddressAsMain === 'Yes'){
    res.redirect('/version-29/s1/account/entitlement-content/s1-dependant-details-check');
  } else {
    res.redirect('/version-29/s1/account/entitlement-content/s1-manual-dependant-address');
  }
})

// Enter dependant's address
router.post([/s1-manual-dependant-address/], function(req, res){
  res.redirect('s1-dependant-details-check');
})

// Check dependant's details
router.post([/s1-dependant-details-check/], function(req, res) {
  // Log the value of the action field
  console.log(req.body.action);

  // Mark the dependant as added
  req.session.data['s1-add-dependant'] = 'Yes';

  // Check the button action and redirect accordingly
  if (req.body.action === 'add') {
    res.redirect('/version-29/s1/account/entitlement-content/s1-create-new-dependant-record?number-of-dependants=2');
  } else {
    res.redirect('/version-29/s1/account/entitlement-content/s1-confirmation-dependant-added');
  }
});




// Search for a person & create a new person record // 

// Enter person's name, DOB and address
router.post([/create-person-record/], function(req, res){
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

  res.redirect('/version-29/s1/account/basic-personal-details-comment');
})

// Add comments alongside change made to basic personal details
router.post([/basic-personal-details-comment/], function(req, res){

  req.session.data['add-basic-personal-details-comment'] = 'yes'

  res.redirect('/version-29/s1/account/personal-details');

})

// Change additional personal details
router.post([/change-additional-personal-details/], function(req, res){

  req.session.data['change-additional-personal-details'] = 'yes'

  res.redirect('/version-29/s1/account/additional-personal-details-change-reason');
})

// Select the reason for the change to the additional personal details
router.post([/additional-personal-details-change-reason/], function(req, res){

  res.redirect('/version-29/s1/account/additional-personal-details-comment');

})

// Add comments alongside change made to basic personal details
router.post([/additional-personal-details-comment/], function(req, res){

  req.session.data['add-additional-personal-details-comment'] = 'yes'

  res.redirect('/version-29/s1/account/personal-details');

})

// Change current address
router.post([/change-current-address/], function(req, res){

  req.session.data['change-address'] = 'yes'

  res.redirect('/version-29/s1/account/change-current-address-comment');

})

// Add comments alongside change to current address
router.post([/change-current-address-comment/], function(req, res){

  req.session.data['add-address-change-comment'] = 'yes'

  res.redirect('/version-29/s1/account/case-history');

})

// Change date of residency in UK
router.post([/change-date-of-residency-uk/], function(req, res){

  req.session.data['change-date-of-residency-uk'] = 'yes'

  res.redirect('/version-29/s1/account/change-date-of-residency-uk-comment');

})

// Add comments alongside change to residency in UK date
router.post([/change-date-of-residency-uk-comment/], function(req, res){

  req.session.data['add-residency-change-comment'] = 'yes'

  res.redirect('/version-29/s1/account/case-history');

})


// Add contact details
router.post([/add-contact-details/], function(req, res){

  req.session.data['add-contact-details'] = 'yes'

  res.redirect('/version-29/s1/account/personal-details#tab-contact-details');

})

// Upload a new document
router.post([/upload-personal-details-document/], function(req, res){

  req.session.data['upload-new-document'] = 'yes'

  res.redirect('/version-29/s1/account/personal-details#tab-documents');

})

// Add note to personal details
router.post([/personal-details-note/], function(req, res){

  req.session.data['new-personal-details-note'] = 'yes'

  res.redirect('/version-29/s1/account/personal-details#tab-Notes');

})

// Add note to entitlements section
router.post([/s1-entitlement-note/], function(req, res){

  // Retrieve the submitted note and note type
  const noteType = req.body['note-type'];
  const note = req.body['note'];

  // Store these in the session or database
  req.session.data['note-type'] = noteType;
  req.session.data['note'] = note;

  // Set flag that a new S1 entitlement note was added
  req.session.data['new-s1-entitlement-note'] = 'yes';

  // Redirect to the S1/S072 entitlement details screen and the tab that displays the notes table
  res.redirect('/version-29/s1/account/entitlement-content/s1-entitlement-details#tab-notes');

})


// Add a new entitlement to a person's record //

// Select entitlement
router.post([/which-entitlement/], function(req, res){
  res.redirect('which-s1-entitlement');
})

// Select specific S1 entitlement
router.post([/which-s1-entitlement/], function(req, res){
  var s1EntitlementType = req.session.data['s1-entitlement-type'];
  
  if (s1EntitlementType == 'S1/S072'){
      res.redirect('which-source');
  } else {
      res.redirect('/version-29/s1/s072-registration/entitlement-details');
  }
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
  res.redirect('entitlement-details');
});

// Input entitlement details
router.post([/entitlement-details/], function(req, res){
  res.redirect('search-institution-ID');
})

// Search by institution ID (to show functionality)
router.post([/search-institution-ID/], function(req, res){
  res.redirect('institution-ID-search-results');
})

// Search by institution name (to show functionality)
router.post([/search-institution-name/], function(req, res){
  res.redirect('institution-name-search-results');
})

// Institution ID search results
router.post([/institution-ID-search-results/], function(req, res){
  res.redirect('new-s1-s073-entitlement-cya');
})

// Institution name search results
router.post([/institution-name-search-results/], function(req, res){
  res.redirect('new-s1-s073-entitlement-cya');
})

// Institution ID search results - not found (to show functionality)
router.post([/institution-ID-search-results-none/], function(req, res){
  res.redirect('add-new-institution-details');
})

// Institution ID search results - not found (to show functionality)
router.post([/institution-name-search-results-none/], function(req, res){
  res.redirect('add-new-institution-details');
})

// Institution ID search results - not found (to show functionality)
router.post([/add-new-institution-details/], function(req, res){
  res.redirect('new-s1-s072-entitlement-cya');
})

// Check your answers so far
router.post([/new-s1-s072-entitlement-cya/], function(req, res){
  res.redirect('add-dependant');
})

// Do you want to add dependants?
router.post([/add-dependant/], function(req, res){
  var addDependant = req.session.data['add-dependant'];
  
  if (addDependant == 'Yes'){
      res.redirect('search-for-dependant');
  } else {
      res.redirect('/version-29/s1/s072-registration/confirmation-s1-s072-added');
  }
})

// Search for a dependant
router.post([/search-for-dependant/], function(req, res){
  res.redirect('search-for-dependant-results');
})

// View dependant's personal details and add dependant to entitlement
router.post([/dependant-personal-details/], function(req, res){
  res.redirect('confirmation-s1-s072-added');
})

// Enter dependant's address
router.post([/dependant-details/], function(req, res){
  res.redirect('same-address');
})

// Does the dependant live at the same address as the Main?
router.post([/same-address/], function(req, res){
  const sameAddress = req.session.data['same-address-as-main'];
  
  if (sameAddress === 'Yes'){
    res.redirect('/version-29/s1/s072-registration/dependant-details-cya');
  } else {
    res.redirect('/version-29/s1/s072-registration/dependant-address');
  }
})

// Enter dependant's address
router.post([/dependant-address/], function(req, res){
  res.redirect('dependant-details-cya');
})

// Remove dependant
router.post([/remove-dependant/], (req, res) => {

  const removeDependant = req.session.data['remove-dependant']

  if (removeDependant === 'Yes') {
    res.redirect('dependant-details-cya')
  } else {
    res.redirect('dependant-details-cya')
  }

})




// Entitlements section - S1 Entitlement //

// Change S1 entitlement details
router.post([/change-s1-entitlement-details/], function(req, res){

  req.session.data['update-s1-entitlement-details'] = 'yes'

  res.redirect('/version-29/s1/account/entitlement-content/s1-entitlement-details#tab-entitlement-details');

})

// Change S1 entitlement institution details
router.post([/change-s1-entitlement-institution-details/], function(req, res){

  req.session.data['update-s1-entitlement-institution-details'] = 'yes'

  res.redirect('/version-29/s1/account/entitlement-content/s1-entitlement-details#tab-institution-details');

})


// Add notes for various items //

// Send the S073 registration confirmation, record the RINA reference number and add a note (optional)
router.post([/s073-record-rina-reference/], function(req, res){

// Mark the S073 task as completed
req.session.data['send-s073'] = "completed";

// Retrieve the submitted RINA reference number and optional comments
const rinaReferenceNumber = req.body['rina-reference-number'];
const rinaReferenceComments = req.body['s073-rina-reference-comments'];

// Store these values in the session
req.session.data['rina-reference-number'] = rinaReferenceNumber;
req.session.data['s073-rina-reference-comments'] = rinaReferenceComments;

// Set flag that a new S073 RINA reference note was added
req.session.data['new-s073-rina-reference-note'] = 'yes';

// Redirect to the S1 entitlement details screen with the "completed" tag and open the notes tab where RINA reference number and optional comments should display in the notes table
  res.redirect('/version-29/s1/account/entitlement-content/s1-entitlement-details');

})


// Send the DL1609, and add a note (optional)
router.post([/download-dl1609/], function(req, res){

  // Mark the DL1609 task as completed
  req.session.data['send-dl1609'] = "completed";
  
  // Retrieve the submitted DL1609 comments (if any)
  const dl1609Comments = req.body['dl1609-comments'];
  
  // Store these values in the session
  req.session.data['dl1609-comments'] = dl1609Comments;
  
  // Set flag that a new DL1609 note was added
  req.session.data['new-dl1609-note'] = 'yes';

  // Set dl1609-sent flag to "Yes" to enable the "Confirm entitlement details" link and update status
  req.session.data['dl1609-sent'] = 'Yes';
  
  // Redirect to the S1 entitlement details screen
  res.redirect('/version-29/s1/account/entitlement-content/s1-entitlement-details');
  
});








// Remove dependant
router.post([/s1-remove-dependant/], (req, res) => {

  const removeDependant = req.session.data['remove-dependant']

  if (removeDependant === 'Yes') {
    res.redirect('s1-dependant-details-cya')
  } else {
    res.redirect('s1-dependant-details-cya')
  }

})


// Tasklist - After s072 registration

// Send S073 to member state 
router.post([/s073-confirm/], function(req, res){
  const data = req.session.data;
  data.sendS073 = 'true';
  res.redirect('../../s1-entitlement');
})

// Send DL1609 
router.post([/dl1609-print/], function(req, res){
  const data = req.session.data;
  data.sendDl1609 = 'true';
  res.redirect('../../../s1-entitlement');
})
// resendSend DL1609 
router.post([/resend-dl1609-new/], function(req, res){
  const data = req.session.data;
  data.secondResendDl1609 = 'true';
  res.redirect('../../../s1-entitlement');
})
// Have we received the DL1609?
router.post([/received-dl1609/], function(req, res){
  var hasDL1609 = req.session.data['dl1609'];
  
  if (hasDL1609 == 'yes'){
      res.redirect('s1-eligible');
  } else if (hasDL1609 == 'no'){
      res.redirect('resend-dl1609');
  } else {
      
  }
})
// Is the applicant eligible for dl1609?
router.post([/s1-eligible/], function(req, res){
  var isEligible = req.session.data['s1Eligble'];
  
  if (isEligible == 'yes'){
      res.redirect('enter-details-main');
  } else if (isEligible == 'no'){
      res.redirect('cancel-s1');
  } else {
      
  }
})
// Enter and add to main S1 holder details  
router.post([/enter-details-main/], function(req, res){
  const data = req.session.data;

  res.redirect('address-dl1609');
})
// confirm or change address  
router.post([/address-dl1609/], function(req, res){
  const data = req.session.data;

  res.redirect('enter-employment-details-main');
})
// Enter and add to main S1 holder details  
router.post([/enter-employment-details-main/], function(req, res){
  const data = req.session.data;

  res.redirect('dependants-dl1609');
})
// Add dependants to s1  
router.post([/dependants-dl1609/], function(req, res){
  res.redirect('cya-1609');

})
// Dl1609 answers  
router.post([/cya-1609/], function(req, res){
  res.redirect('confirm-dl1609');

})

// // Dl1609 answers  
router.post([/confirm-dl1609/], function(req, res){
  const data = req.session.data;
  data.dl1609Complete = 'true';
  res.redirect('../../../s1-entitlement');

})

// Resend DL1609 
router.post([/resend-dl1609/], function(req, res){
  const data = req.session.data;
  data.resendDl1609 = 'true';
  res.redirect('../../../s1-entitlement');
})

// cancel S1 
router.post([/cancel-s1/], function(req, res){
  const data = req.session.data;
  data.cancelS1 = 'true';
  res.redirect('../../../s1-entitlement');
})


// Remove document from Personal Details section
router.post([/remove-personal-details-document/], function(req, res){

  const removeDocument = req.session.data['remove-document']

  if (removeDocument === 'yes') {
      res.redirect('/version-29/s1/account/personal-details#tab-Documents')
  } else {
      res.redirect('/version-29/s1/account/personal-details#tab-Documents')
  }


})

// Remove document from Entitlements section
router.post([/remove-entitlements-document/], function(req, res){

  const removeDocument = req.session.data['remove-document']

  if (removeDocument === 'yes') {
      res.redirect('/version-29/s1/account/entitlements-details#tab-Documents')
  } else {
      res.redirect('/version-29/s1/account/entitlements-details#tab-Documents')
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