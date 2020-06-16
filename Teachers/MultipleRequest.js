/**
 * Calls provided HTTP requests batch and retries in case of errors
 *
 * @param {object} fetchService - service for performing HTTP requests. Defaults to UrlFetchApp provided by Google.
 * @param {Array<object>} requests - Array of request param objects
 *  (https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#fetchurl-params)
 *
 * @return {object} RetriableRequestsBatch.
 */
function RetriableRequestsBatch(fetchService, requests) {
  this.fetchService = fetchService;

  requests.forEach(function(r) {
    // Make sure URLFetchApp doesn't crash on errors
    r['muteHttpExceptions'] = true;
  });

  this.requests = requests;

  return this;
}

/** @const - Maximum number of times the batch can be called */
RetriableRequestsBatch.MAX_TRIES = 3;

/** @const - Requests will be retried only in case when response payload matches following string */
RetriableRequestsBatch.RETRIABLE_ERROR_STRINGS = [
  'Endpoint request timed out' 
];

/**
 * Calls provided HTTP requests batch and retries in case of errors.
 * If number of allowed retries is exceeded an error will be raised.
 *
 * @return {object} Object with `error` key in case of an error or `responses` containing
 *   array of HTTPResponse (in the same order as requests).
 */
RetriableRequestsBatch.prototype.fetchWithRetries = function fetchWithRetries() {
  var requestObjects = this._initializeRequestObjects();

  return this._performRequests(requestObjects);
};

RetriableRequestsBatch.prototype._performRequests = function _performRequests(requestObjects) {
  var tries = 1;
  var toCall = requestObjects;

  while (tries <= RetriableRequestsBatch.MAX_TRIES && toCall.length) {
    if (tries > 1) {
      console.log('Retrying requests', tries, toCall);
    }

    this._fetchAndPopulateResponses(toCall);

    // If a non-retriable errors happens immediately throw an error
    var failedNonRetriable = requestObjects.filter(this._isFailedNonRetriable.bind(this));
    var nonRetriableError = this._getError(failedNonRetriable);
    if (nonRetriableError) {
      console.error('Non-retriable error happened', nonRetriableError);
      return { error: nonRetriableError };
    }

    toCall = requestObjects.filter(this._isFailedRetriable.bind(this));

    tries++;
  }

  // If retriable errors happens too many times return an error
  var tooManyRetriesError = this._getError(toCall);
  if (tooManyRetriesError) {
    console.error('Retriable error occured too many times', tooManyRetriesError);
    return { error: tooManyRetriesError };
  }

  return { responses: requestObjects.map(function(d) { return d.response; }) };
};

RetriableRequestsBatch.prototype._initializeRequestObjects = function _initializeRequestObjects() {
  var requestObjects = [];

  for (var i = 0; i < this.requests.length; i++) {
    requestObjects.push({ index: i, request: this.requests[i], response: null });
  }

  return requestObjects;
};

RetriableRequestsBatch.prototype._fetchAndPopulateResponses = function _fetchAndPopulateResponses(requestObjects) {
  var requestsToCall = requestObjects.map(function(d) { return d.request; });
  var responses = this.fetchService.fetchAll(requestsToCall);
  for (var i = 0; i < responses.length; i++) {
    requestObjects[i].response = responses[i];
  }
};

RetriableRequestsBatch.prototype._getError = function _getError(requestObjects) {
  if (requestObjects.length) {
    return requestObjects[0].response.getContentText();
  }
};

RetriableRequestsBatch.prototype._isFailedRetriable = function _isFailedRetriable(requestObject) {
  return this._requestDidFail(requestObject) && this._retriableErrorOccured(requestObject);
};

RetriableRequestsBatch.prototype._isFailedNonRetriable = function _isFailedNonRetriable(requestObject) {
  return this._requestDidFail(requestObject) && !this._retriableErrorOccured(requestObject);
};

RetriableRequestsBatch.prototype._retriableErrorOccured = function _retriableErrorOccured(requestObject) {
  var error = requestObject.response.getContentText();
  return RetriableRequestsBatch.RETRIABLE_ERROR_STRINGS.filter(function(s) {
    return error.indexOf(s) >= 0;
  }).length > 0;
};

RetriableRequestsBatch.prototype._requestDidFail = function _requestDidFail(requestObject) {
  return requestObject.response.getResponseCode() >= 400;
};