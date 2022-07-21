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
    res.redirect('')
  }

})

//pb6/data-input-error/cancel-journey.html
router.post('/data-input-error-cancel-journey', function (req, res) {

  const selectedRadio = req.body.cancelJourney; 

  if (selectedRadio === "Yes"){
    res.redirect('/version-22/pb6/data-input-error/person-details')
  }

  if (selectedRadio === "No"){
    res.redirect('/version-22/pb6/data-input-error/update-details-confirmation')
  }

  else {
    res.redirect('')
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
    res.redirect('')
  }

})

//pb6/change-of-address/cancel-journey.html
router.post('/change-of-address-cancel-journey', function (req, res) {

  const selectedRadio = req.body.cancelJourney; 

  if (selectedRadio === "Yes"){
    res.redirect('/version-22/pb6/change-of-address/person-details')
  }

  if (selectedRadio === "No"){
    res.redirect('/version-22/pb6/change-of-address/update-details-confirmation')
  }

  else {
    res.redirect('')
  }

})






module.exports = router;