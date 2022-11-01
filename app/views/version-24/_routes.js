// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


//pb7/v3/add-prc-duplicate.html
router.post('/duplicate-prc', function (req, res) {

  const selectedRadio = req.body.duplicatePRC; 

  if (selectedRadio === "yes"){
    res.redirect('/version-23/pb7/v3/add-prc-institution-details-duplicate')
  }

  if (selectedRadio === "no"){
    res.redirect('/version-23/pb7/v3/entitlements-treatments-with-prc')
  }


  else {
    res.redirect('/version-23/pb7/v3/add-prc-duplicate')
  }

})

//pb7/v3/add-new-entitlement-duplicate.html
router.post('/entitlement-type-duplicate-v3', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "S2/E112"){
    res.redirect('/version-23/pb7/v3/add-new-entitlement-duplicate')
  }

  if (selectedRadio === "EHIC"){
    res.redirect('/version-23/pb7/v3/add-new-entitlement-duplicate')
  }

  if (selectedRadio === "PRC"){
    res.redirect('/version-23/pb7/v3/add-prc-details-duplicate')
  }

  else {
    res.redirect('/version-23/pb7/v3/add-new-entitlement-duplicate')
  }

})

//pb7/v4/add-new-entitlement.html
router.post('/entitlement-type-v4', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "S2/E112"){
    res.redirect('/version-24/pb7/v4/add-new-entitlement')
  }

  if (selectedRadio === "EHIC"){
    res.redirect('/version-24/pb7/v4/add-new-entitlement')
  }

  if (selectedRadio === "PRC"){
    res.redirect('/pb7/v4/add-prc-details')
  }

  else {
    res.redirect('/version-24/pb7/v4/add-new-entitlement')
  }

})

//pb7/v3/add-new-entitlement.html
router.post('/entitlement-type-v3', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "S2/E112"){
    res.redirect('/version-23/pb7/v3/add-new-entitlement')
  }

  if (selectedRadio === "EHIC"){
    res.redirect('/version-23/pb7/v3/add-new-entitlement')
  }

  if (selectedRadio === "PRC"){
    res.redirect('/version-23/pb7/v3/add-prc-details')
  }

  else {
    res.redirect('/version-23/pb7/v3/add-new-entitlement')
  }

})

//pb7/v2/add-new-entitlement.html
router.post('/entitlement-type-v2', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "S2/E112"){
    res.redirect('/version-23/pb7/v2/add-new-entitlement')
  }

  if (selectedRadio === "EHIC"){
    res.redirect('/version-23/pb7/v2/add-new-entitlement')
  }

  if (selectedRadio === "PRC"){
    res.redirect('/version-23/pb7/v2/add-prc-details')
  }

  else {
    res.redirect('/version-23/pb7/v2/add-new-entitlement')
  }

})

//pb7/v1/add-new-entitlement.html
router.post('/entitlement-type', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "S2/E112"){
    res.redirect('/version-23/pb7/v1/add-new-entitlement')
  }

  if (selectedRadio === "EHIC"){
    res.redirect('/version-23/pb7/v1/add-new-entitlement')
  }

  if (selectedRadio === "PRC"){
    res.redirect('/version-23/pb7/v1/add-prc-details')
  }

  else {
    res.redirect('/version-23/pb7/v1/add-new-entitlement')
  }

})

module.exports = router;