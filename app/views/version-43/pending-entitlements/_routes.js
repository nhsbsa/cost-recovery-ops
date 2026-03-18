const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

// Edit the institution details
router.post([/view-pending-entitlement/], function(req, res){

// Set flag that the entitlement status has been set as 'Actioned'
req.session.data['set-entitlement-status-to-actioned'] = 'Yes'
   
res.redirect('/version-43/pending-entitlements/actioned-entitlements');
        
})

// Edit the institution details
router.post([/edit-institution-details/], function(req, res){

// Set flag that the pending accounts have been filtered
req.session.data['institution-details-updated'] = 'Yes'

res.redirect('/version-43/pending-entitlements/view-pending-entitlement');
    
})



module.exports = router