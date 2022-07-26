// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

//pb6/reason-for-editing.html
router.post('/update-person-details', function (req, res) {

  const selectedRadio = req.body.editReason; 

  if (selectedRadio === "Data input error"){
    res.redirect('/version-22/pb6/data-input-error/update-details')
  }

  if (selectedRadio === "Legal name change"){
    res.redirect('/version-22/pb6/legal-name-change/update-details')
  }

  if (selectedRadio === "Change of address"){
    res.redirect('/version-22/pb6/change-of-address/update-details')
  }

  else {
    res.redirect('/version-22/pb6/reason-for-editing')
  }

})


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