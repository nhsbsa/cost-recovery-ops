// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// Link a Main Insured from the Dependant's record //

// Check you're linking to the correct Main insurer and S1/S072 entitlement
router.post([/dr-link-to-entitlement-cya/], function(req, res){

  req.session.data['dr-add-main'] = 'yes'
  req.session.data['add-dependant'] = 'yes'

  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
})

// How is the Dependant related to the Main Insured?
router.post([/dr-select-relationship/], function(req, res) {

  req.session.data['dr-add-main'] = 'yes'
  
  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
});

// Change dependant relationship to Main Insured
router.post([/dr-change-relationship/], function(req, res) {

  req.session.data['dr-add-main'] = 'yes'

  req.session.data['dr-change-main-relationship'] = 'yes'

  // Save the new relationship temporarily in session data
  req.session.data['dr-new-relationship'] = req.body['dr-new-relationship'];
  
  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
});



module.exports = router;