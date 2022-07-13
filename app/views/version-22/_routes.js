// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies



//pb6/reasons-for-editing-radio-1.html
router.post('/person-details-edit', function (req, res) {

  const selectedRadio = req.body.editReason; 

  if (selectedRadio === "Data input error"){
    res.redirect('/version-22/pb6/update-list-1')
  }

  if (selectedRadio === "Official name change"){
    res.redirect('/version-22/pb6/update-list-2')
  }

  else {
    res.redirect('')
  }

})



module.exports = router;