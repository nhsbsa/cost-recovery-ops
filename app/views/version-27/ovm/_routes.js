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
// OVM
router.post([/contacted-the-ovm-additional/], function(req, res){
  var ovm2 = req.session.data['ovm2'];
  
  if (ovm2 == 'yes'){
      res.redirect('contacted-the-ovm-additional-information2');
  } else if (ovm2 == 'no'){
      res.redirect('contacted-the-ovm-5-more');
  } else {
      
  }
})





module.exports = router;