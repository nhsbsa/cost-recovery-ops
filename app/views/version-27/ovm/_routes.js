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
      res.redirect('contacted-the-ovm-additional-information');
  } else if (ovm == 'no'){
      res.redirect('contacted-the-ovm-2-more');
  } else {
      
  }
})





module.exports = router;