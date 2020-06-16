// Utils
function stringifyQuery(queryParams = {}) {
  return Object.entries(queryParams).reduce(
    (acc, [key, value], i) => acc + (i > 0 ? '&' : '') + `${key}=${value}`,
    '?'
  );
}

// HTTP requests
function fetchUrl(reqUrl, params) {
  return new Promise((resolve, reject) => {
    const res = UrlFetchApp.fetch(reqUrl, { ...params, muteHttpExceptions: true });
    if (res.getResponseCode() >= 200 && res.getResponseCode() < 300) {
      resolve(JSON.parse(res));
    } else {
      reject(JSON.parse(res));
    }
  });
}

async function batchFetch(reqUrlList = [], params) {
  let networkErrors = [];
  const responses = await Promise.all(
    reqUrlList.map(reqUrl =>
      fetchUrl(reqUrl, params)
        .catch(err => networkErrors.push(err.error)) // avoids stopping the chain
        .then(res => res)
    )
  );

  return { responses, errors: networkErrors };
}
