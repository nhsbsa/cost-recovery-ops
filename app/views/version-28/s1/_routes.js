// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


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

// Update personal details
router.post([/update-personal-details/], function(req, res){

  req.session.data['updated-personal-details'] = 'yes'

  res.redirect('/version-28/s1/account/patient-details#tab-personal-details');

})

// Change current address
router.post([/change-current-address/], function(req, res){

  req.session.data['change-current-address'] = 'yes'

  res.redirect('/version-28/s1/account/patient-details#tab-addresses');

})

// Add a new address
router.post([/add-new-address/], function(req, res){

  req.session.data['add-new-address'] = 'yes'

  res.redirect('/version-28/s1/account/patient-details#tab-addresses');

})

// Add contact details
router.post([/add-contact-details/], function(req, res){

  req.session.data['add-contact-details'] = 'yes'

  res.redirect('/version-28/s1/account/patient-details#tab-contact-details');

})

// Upload a new document
router.post([/upload-personal-details-document/], function(req, res){

  req.session.data['upload-new-document'] = 'yes'

  res.redirect('/version-28/s1/account/patient-details#tab-documents');

})

// Add note to personal details
router.post([/personal-details-note/], function(req, res){

  req.session.data['new-personal-details-note'] = 'yes'

  res.redirect('/version-28/s1/account/patient-details#tab-Notes');

})

// Add note to entitlements section
router.post([/entitlements-note/], function(req, res){

  req.session.data['new-entitlement-note'] = 'yes'

  res.redirect('/version-28/s1/account/entitlement-details#tab-notes');

})


// Add a new entitlement to a person's record //

// Select entitlement 
router.post([/which-entitlement/], function(req, res){
  res.redirect('which-source');
})

// Select source
router.post([/which-source/], function(req, res){
  res.redirect('entitlement-details');
})

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

// Check your answers so far
router.post([/new-s1-s072-entitlement-cya/], function(req, res){
  res.redirect('add-dependant');
})

// Do you want to add dependants?
router.post([/add-dependant/], function(req, res){
  var addDependant = req.session.data['add-dependant'];
  
  if (addDependant == 'Yes'){
      res.redirect('dependant-details');
  } else {
      res.redirect('confirmation-S1-S072-added');
  }
})

// Enter dependant's address
router.post([/dependant-details/], function(req, res){
  res.redirect('same-address');
})

// Does the dependant live at the same address as the Main?
router.post([/same-address/], function(req, res){
  var sameAddress = req.session.data['same-address-as-Main'];
  
  if (sameAddress == 'Yes'){
      res.redirect('dependant-details-cya');
  } else {
      res.redirect('dependant-address');
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


// DL1609 screens //

// Print and send DL1609, alongside adding a note to record
router.post([/print-DL1609/], function(req, res){

  req.session.data['DL1609-note'] = 'yes'

  res.redirect('/version-28/s1/account/entitlement-details#tab-Notes');

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
      res.redirect('/version-28/s1/account/patient-details#tab-Documents')
  } else {
      res.redirect('/version-28/s1/account/patient-details#tab-Documents')
  }


})

// Remove document from Entitlements section
router.post([/remove-entitlements-document/], function(req, res){

  const removeDocument = req.session.data['remove-document']

  if (removeDocument === 'yes') {
      res.redirect('/version-28/s1/account/entitlements-details#tab-Documents')
  } else {
      res.redirect('/version-28/s1/account/entitlements-details#tab-Documents')
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