const request = require('request')
const { config } = require('../config')

/**
 * 
 * @param {string} message to send to in response
 * @param {boolean} isSuccess boolean for success true or false default true
 */
function sendJSON(message, isSuccess = true,) {
    return {
        success: isSuccess,
        message
    }
}

/**
 * 
 * @param {string} method method for placing request GET or POST default sets to GET
 * @param {string} url URL to place request
 * @param {string} token authorization token from yelp, default value to be chosen from environment
 */
function makeHTTPRequest(method = "GET", url, token = config.yelpToken) {
    var options = {
        'method': method,
        'url': url,
        'headers': {
            'Authorization': `Bearer ${token}`
        }
    };
    return placeRequest(options)
}

/**
 * 
 * @param {Object} options options to pass in request 
 */
function placeRequest(options) {
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return resolve(body)
            }
            return reject(error)
        });
    })
}

/**
 * 
 * @param {string} queryString query string to fed to yelpSearch API as per docs https://www.yelp.com/developers/documentation/v3/business_search
 */
function placeYelpSearchRequest(queryString) {
    let url = config.yelpURL + queryString
    console.log(url)
    return makeHTTPRequest("GET", url)
}

/**
 * 
 * @param {string} businessId businessId provide by reponse of search API or from reponse of placeYelpSearchRequest
 * @param {string} locale locale as per https://www.yelp.com/developers/documentation/v3/supported_locales if not provided then en_US
 */
function getBusinessReviewExcerpts(businessId, locale) {
    let url = config.yelpURL + `/${businessId}/reviews`
    console.log(url)
    return makeHTTPRequest("GET", url)
}

/**
 * 
 * @param {array} topBusiness array of objects contain response of search API, from which business id will be ised for fetching review
 */
async function getReviewForAllBusiness(topBusiness) {
    let objectToSend = []
    for (let iterator = 0, businessCount = topBusiness.length; iterator < businessCount; iterator++) {
        let requiredDetails = {}
        let thisBusiness = topBusiness[iterator]
        requiredDetails.name = thisBusiness.name
        requiredDetails.business_address = thisBusiness.location.display_address.join(', ')
        let review = await getBusinessReviewExcerpts(thisBusiness.id)
        review = JSON.parse(review).reviews
        let requiredReviewDetail = []
        review.forEach((thisReview => requiredReviewDetail.push({ review: thisReview.text, personName: thisReview.user.name })))
        requiredDetails.reviews = requiredReviewDetail
        console.log("requiredDetails",requiredDetails)
        objectToSend.push(requiredDetails)
    }
    return Promise.resolve(objectToSend)
}

exports.sendJSON = sendJSON
exports.makeHTTPRequest = makeHTTPRequest
exports.placeYelpSearchRequest = placeYelpSearchRequest
exports.getBusinessReviewExcerpts = getBusinessReviewExcerpts
exports.getReviewForAllBusiness = getReviewForAllBusiness