// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


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