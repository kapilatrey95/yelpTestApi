const express = require('express')
  , router = express.Router(),
  { placeYelpSearchRequest, getReviewForAllBusiness, sendJSON } = require('../helpers/helper')

/**
 * API for getting top business based on category 
 * response format { success: boolean, message: Object }
 */
router.get('/', async (req, res) => {
  try {
    let { category, location, limit } = req.query
    if (!limit) {
      limit = 1
    }
    if (!category) {
      category = "icecream"
    }
    if (!location) {
      location = "redwoodcity"
    }
    console.log(req.originalUrl)
    let businesses = await placeYelpSearchRequest(`/search?categories=${category}&location={${location}}&limit=${limit}&sort_by=rating`)
    businesses = JSON.parse(businesses)
    businesses = businesses.businesses
    let dataToSend = await getReviewForAllBusiness(businesses)
    return res.status(200).json(sendJSON(dataToSend))
  } catch (e) {
    res.status(500).json(sendJSON(e, false))
  }
})

module.exports = router
