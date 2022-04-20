// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

//resub-cancel-journey.html

router.post('/resubCancelFlow', function (req, res) {
  var resubCancelFlowChoice = req.session.data['cancelFlow']

  if (resubCancelFlowChoice == "Yes") {
    res.redirect('/version-20/resub-view-details')
  } else {
    res.redirect('/version-20/resub-view-details')
  }
})

module.exports = router;
