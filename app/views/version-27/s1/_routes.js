// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// Register s1  // 


// Create new patient record 
router.post([/search-results-none/], function(req, res){
      res.redirect('../s072-registration/choose-option');
})


// Select entitlement or enquiry  
router.post([/choose-option/], function(req, res){
  res.redirect('choose-entitlement');
})
// Select entitlement 
router.post([/choose-entitlement/], function(req, res){
  res.redirect('create-person');
})
// // Select entitlement 
// router.post([/select-source/], function(req, res){
//   res.redirect('create-person');
// })
// Select entitlement 
router.post([/create-person/], function(req, res){
  res.redirect('address-lookup');
})
// Address lookup 
router.post([/address-lookup/], function(req, res){
  res.redirect('address-confirm');
})
// Manual address lookup 
router.post([/address-manual/,/address-confirm/], function(req, res){
  res.redirect('entitlement-details');
})
// Entitlement details 
router.post([/entitlement-details/], function(req, res){
  res.redirect('institute-details');
})



// Have dependants 
router.post([/have-dependants/], function(req, res){
  var dependants = req.session.data['dependants'];
  
  if (dependants == 'yes'){
      res.redirect('dependant-details');
  } else if (dependants == 'no'){
      res.redirect('check-your-answers');
  } else {
      
  }
})

// Check dependant address 
router.post([/dependant-details/], function(req, res){
  const data = req.session.data;
  data.dependantName = `${req.body['dependantFirstName']} ${req.body['dependantLastName']}`

    res.redirect('dependant-check-address');
    
})

// Add address 
router.post([/dependant-check-address/], function(req, res){
  var address = req.session.data['checkDependantAddress'];
  
  if (address == 'no'){
      res.redirect('dependant-address');
  } else if (address == 'yes'){
      res.redirect('dependant-check-answers');
  } else {
      
  }
})
// Check dependant address 
router.post([/dependant-address/], function(req, res){

    res.redirect('dependant-confirm');
    
})
// Check dependant address 
router.post([/dependant-confirm/], function(req, res){

    res.redirect('dependant-check-answers');
    
})


// Review dependants details before continuing 
router.post([/dependant-check-answers/], function(req, res){
  var addMore = req.session.data['addAnotherDependant'];
  
  if (addMore == 'no'){
      res.redirect('check-your-answers');
  } else if (addMore == 'yes'){
      res.redirect('dependant-details');
  } else {
      
  }
})


// Check your answers 
router.post([/check-your-answers/], function(req, res){
  res.redirect('confirmation');
})

// so72 confirmation 
router.post([/confirmation/], function(req, res){
  res.redirect('../account/s1-entitlement');
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