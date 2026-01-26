const express = require('express');
const router = express.Router();

// Import subfolder routes
router.use('/account', require('./account/cancellations/_routes.js'));
router.use('/account', require('./account/dependant/_routes.js'));
router.use('/account', require('./account/dependant/cancellations/_routes.js'));
router.use('/account', require('./account/dependant/s1-entitlement-content/_routes.js'));
router.use('/account', require('./account/dependant/s1-s072-registration/_routes.js'));
router.use('/account', require('./account/entitlement-content/_routes.js'));
router.use('/account', require('./account/_routes.js'));
router.use('/s072-registration', require('./s072-registration/_routes.js'));

// ... more subfolders

module.exports = router;
