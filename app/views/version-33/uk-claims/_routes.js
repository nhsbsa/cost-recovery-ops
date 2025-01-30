// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// S1 Claims //


// Select type of S1 entitlement
router.post([/create-new-uk-claim/], function(req, res) {
  // Capture form data from the POST request
  const entitlementArticleType = req.body['entitlement-article-type'];
  const claimSentBy = req.body['claim-sent-by'];
  
  // Store these in the session or database
  req.session.data['entitlement-article-type'] = entitlementArticleType;
  req.session.data['claim-sent-by'] = claimSentBy;

  res.redirect('/version-33/uk-claims/s1-claim-forms');
})




module.exports = router;