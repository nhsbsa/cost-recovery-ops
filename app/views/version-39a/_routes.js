// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


//pb7/v3/add-prc-duplicate.html
router.post('/duplicate-prc', function (req, res) {

  const selectedRadio = req.body.duplicatePRC; 

  if (selectedRadio === "yes"){
    res.redirect('/version-39a/pb7/v3/add-prc-institution-details-duplicate')
  }ƒ

  if (selectedRadio === "no"){
    res.redirect('/version-39a/pb7/v3/entitlements-treatments-with-prc')
  }


  else {
    res.redirect('/version-39a/pb7/v3/add-prc-duplicate')
  }

})

//pb7/v5/add-new-entitlement-duplicate.html
router.post('/entitlement-type-duplicate-v4', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "S2/E112"){
    res.redirect('add-new-entitlement-duplicate')
  }

  if (selectedRadio === "EHIC"){
    res.redirect('add-new-entitlement-duplicate')
  }

  if (selectedRadio === "PRC"){
    res.redirect('add-prc-details-duplicate')
  }

  else {
    res.redirect('add-new-entitlement-duplicate')
  }

})

//pb7/v3/add-new-entitlement-duplicate.html
router.post('/entitlement-type-duplicate-v3', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "S2/E112"){
    res.redirect('/version-39a/pb7/v3/add-new-entitlement-duplicate')
  }

  if (selectedRadio === "EHIC"){
    res.redirect('/version-39a/pb7/v3/add-new-entitlement-duplicate')
  }

  if (selectedRadio === "PRC"){
    res.redirect('/version-39a/pb7/v3/add-prc-details-duplicate')
  }

  else {
    res.redirect('/version-39a/pb7/v3/add-new-entitlement-duplicate')
  }

})

//pb7/v4/add-new-entitlement.html
router.post('/entitlement-type-v4', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "S2/E112"){
    res.redirect('/version-39a/s2-details')
  }

  if (selectedRadio === "EHIC"){
    res.redirect('add-new-entitlement')
  }

  if (selectedRadio === "PRC"){
    res.redirect('add-prc-details')
  }

  else {
    res.redirect('add-new-entitlement')
  }

})

//pb7/v3/add-new-entitlement.html
router.post('/entitlement-type-v3', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "S2/E112"){
    res.redirect('/version-39a/pb7/v3/add-new-entitlement')
  }

  if (selectedRadio === "EHIC"){
    res.redirect('/version-39a/pb7/v3/add-new-entitlement')
  }

  if (selectedRadio === "PRC"){
    res.redirect('/version-39a/pb7/v3/add-prc-details')
  }

  else {
    res.redirect('/version-39a/pb7/v3/add-new-entitlement')
  }

})

//pb7/v2/add-new-entitlement.html
router.post('/entitlement-type-v2', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "S2/E112"){
    res.redirect('/version-39a/pb7/v2/add-new-entitlement')
  }

  if (selectedRadio === "EHIC"){
    res.redirect('/version-39a/pb7/v2/add-new-entitlement')
  }

  if (selectedRadio === "PRC"){
    res.redirect('/version-39a/pb7/v2/add-prc-details')
  }

  else {
    res.redirect('/version-39a/pb7/v2/add-new-entitlement')
  }

})

//pb7/v1/add-new-entitlement.html
router.post('/entitlement-type', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "S2/E112"){
    res.redirect('/version-39a/pb7/v1/add-new-entitlement')
  }

  if (selectedRadio === "EHIC"){
    res.redirect('/version-39a/pb7/v1/add-new-entitlement')
  }

  if (selectedRadio === "PRC"){
    res.redirect('/version-39a/pb7/v1/add-prc-details')
  }

  else {
    res.redirect('/version-39a/pb7/v1/add-new-entitlement')
  }

})

//pb7/v4/suspend-ovm-account.html
router.post('/suspend-account', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "Yes"){
    res.redirect('suspend-account-requests-suspended')
  }

  if (selectedRadio === "No"){
    res.redirect('suspend-account-requests-view-accepted')
  }

})

//pb7/v4/add-new-entitlement.html
router.post('/uk-claims-search', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "EHICandPRC"){
    res.redirect('search-results-uk-claims')
  }

  if (selectedRadio === "S2/E112"){
    res.redirect('XXX-SET THIS UP-XXX')
  }

  else {
    res.redirect('search-results-uk-claims')
  }

})

//v1/suspend-ovm-account.html
router.post('/remove-treatment', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "Yes"){
    res.redirect('resubs-contested-treatments-removed')
  }

  if (selectedRadio === "No"){
    res.redirect('resubs-contested-treatments-add')
  }

})

module.exports = router;