// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


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


// Register s1 
// Have we received the DL1609?
router.post([/have-dependants/], function(req, res){
  var dependants = req.session.data['dependants'];
  
  if (dependants == 'yes'){
      res.redirect('check-your-answers');
  } else if (dependants == 'no'){
      res.redirect('check-your-answers');
  } else {
      
  }
})


// Have we received the DL1609?
router.post([/received-dl1609/], function(req, res){
  var hasDL1609 = req.session.data['dl1609'];
  
  if (hasDL1609 == 'yes'){
      res.redirect('enter-details');
  } else if (hasDL1609 == 'no'){
      res.redirect('send-another-form');
  } else {
      
  }
})



module.exports = router;