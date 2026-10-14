// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

// Enter annual published costs //


 // Enter published costs for article 63, 2.a
 router.post([/enter-published-costs-for-article-632a/], function (req, res) {

    // Store the annual costs for each age bracket
    req.session.data['019-annual-cost-632a'] =
      req.body['019-annual-cost-632a'];
  
    req.session.data['2064-annual-cost-632a'] =
      req.body['2064-annual-cost-632a'];
  
    req.session.data['65-annual-cost-632a'] =
      req.body['65-annual-cost-632a'];
  
    // Calculate average monthly costs inclusive of a 20% discount
    const annualCosts = {
      '019': req.session.data['019-annual-cost-632a'] || 1118.87,
      '2064': req.session.data['2064-annual-cost-632a'] || 2475.84,
      '65': req.session.data['65-annual-cost-632a'] || 6790.06
    };
  
    Object.keys(annualCosts).forEach(age => {
      const annualCost = parseFloat(
        String(annualCosts[age]).replace(/,/g, '')
      );
  
      const monthlyCost = (annualCost * 0.8) / 12;
  
      req.session.data[`monthly-cost-${age}-632a`] =
        (Math.round((monthlyCost + Number.EPSILON) * 100) / 100).toFixed(2);
    });
  
    // Continue to Article 63, 2.b
    res.redirect('/version-47/published-costs/enter-published-costs-for-article-632b');
  });
  


 // Enter published costs for article 63, 2.b
 router.post([/enter-published-costs-for-article-632b/], function (req, res) {

    // Store the annual costs for each age bracket
    req.session.data['019-annual-cost-632b'] =
      req.body['019-annual-cost-632b'];
  
    req.session.data['2064-annual-cost-632b'] =
      req.body['2064-annual-cost-632b'];
  
    req.session.data['65-annual-cost-632b'] =
      req.body['65-annual-cost-632b'];
  
    // Default annual costs if no amount has been entered
    const annualCosts = {
      '019': req.session.data['019-annual-cost-632b'] || 1118.87,
      '2064': req.session.data['2064-annual-cost-632b'] || 2475.84,
      '65': req.session.data['65-annual-cost-632b'] || 6790.06
    };
  
    // Calculate average monthly costs with 20% and 15% discounts
    Object.keys(annualCosts).forEach(age => {
  
      const annualCost = parseFloat(
        String(annualCosts[age]).replace(/,/g, '')
      );
  
      // 20% discount
      const monthlyCost20 = (annualCost * 0.80) / 12;
  
      req.session.data[`monthly-cost-${age}-632b-20`] =
        (Math.round((monthlyCost20 + Number.EPSILON) * 100) / 100).toFixed(2);
  
      // 15% discount
      const monthlyCost15 = (annualCost * 0.85) / 12;
  
      req.session.data[`monthly-cost-${age}-632b-15`] =
        (Math.round((monthlyCost15 + Number.EPSILON) * 100) / 100).toFixed(2);
  
    });
  
    // Continue to the publication date screen
    res.redirect('/version-47/published-costs/enter-date-costs-published');
  });
  

// Enter date the costs were published
router.post([/enter-date-costs-published/], function(req, res) {

    const costsPublishedDay =
      req.body['date-costs-published-day'];
  
    const costsPublishedMonth =
      req.body['date-costs-published-month'];
  
    const costsPublishedYear =
      req.body['date-costs-published-year'];
  
    // Store individual date fields
    req.session.data['date-costs-published-day'] = costsPublishedDay;
    req.session.data['date-costs-published-month'] = costsPublishedMonth;
    req.session.data['date-costs-published-year'] = costsPublishedYear;
  
    // Store the combined publication date
    if (
      costsPublishedDay &&
      costsPublishedMonth &&
      costsPublishedYear
    ) {
      req.session.data['date-costs-published'] =
        `${costsPublishedDay}/${costsPublishedMonth}/${costsPublishedYear}`;
    }
   
  
    res.redirect(
      '/version-47/published-costs/cya-before-submitting-published-costs'
    );
  
});

// Confirm published costs before submitting
router.post([/cya-before-submitting-published-costs/], function (req, res) {

   req.session.data['published-costs-for-2023-submitted'] = 'Yes';
  
res.redirect('/version-47/published-costs/published-costs');
});
module.exports = router;