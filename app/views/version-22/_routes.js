// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


//pb6/data-input-error/update-details-confirmation.html
router.post('/data-input-error-update-details', function (req, res) {

  const selectedRadio = req.body.updateDetails; 

  if (selectedRadio === "Yes"){
    res.redirect('/version-22/pb6/data-input-error/check-your-answers')
  }

  if (selectedRadio === "No"){
    res.redirect('/version-22/pb6/data-input-error/cancel-journey')
  }

  else {
    res.redirect('/version-22/pb6/data-input-error/update-details-confirmation')
  }

})


//pb6/change-of-address/update-details-confirmation.html
router.post('/change-of-address-update-details', function (req, res) {

  const selectedRadio = req.body.updateDetails;  

  if (selectedRadio === "Yes"){
    res.redirect('/version-22/pb6/change-of-address/check-your-answers')
  }

  if (selectedRadio === "No"){
    res.redirect('/version-22/pb6/change-of-address/cancel-journey')
  }

  else {
    res.redirect('/version-22/pb6/change-of-address/update-details-confirmation')
  }

})

module.exports = router;