/// <reference path="./_config.js" />
/// <reference path="./dependencies.js" />
/* global fetchUrl stringifyQuery */

function getParams_() {
  const params = {
    method: 'get',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${PropertiesService.getScriptProperties().getProperty('AUTH_KEY')}`,
      'Content-type': 'application/json'
    }
  };

  return params;
}

async function get(subpage, admin = true) {
  const queryParams = { page: 1, pagesize: 99999, pageSize: 99999, role: 'instructor' };
  const params = getParams_();
  const sourceUrl = `https://api-ssl.simsave.com.br/v1/${
    admin ? 'admin/' : ''
  }${subpage}${stringifyQuery(queryParams)}`;

  return await fetchUrl(sourceUrl, { ...params });
}

async function getAll(subpage, admin = true) {
  const queryParams = { page: 1, pagesize: 99999, pageSize: 99999, role: 'instructor' };
  const sourceUrl = `https://api-ssl.simsave.com.br/v1/${admin ? 'admin/' : ''}${subpage}`;
  const params = getParams_();

  const { data } = await fetchUrl(`${sourceUrl}${stringifyQuery(queryParams)}`, { ...params });

  const networkErrors = [];
  const responses = await Promise.all(
    data.map(datum =>
      fetchUrl(`${sourceUrl}/${datum.id}`, params)
        .catch(err => networkErrors.push(err.error)) // avoids stopping the chain
        .then(res => res)
    )
  );

  return { responses, errors: networkErrors };
}

async function post(subpage, data) {
  const sourceUrl = `https://api-ssl.simsave.com.br/v1/admin/${subpage}`;
  const params = getParams_();

  if (!data || data.length === 0) return { responses: [], errors: ['Empty data'] };
  // eslint-disable-next-line no-param-reassign
  if (!(Symbol.iterator in data)) data = [data];

  const networkErrors = [];
  const responses = await Promise.all(
    data.map(datum =>
      fetchUrl(sourceUrl, { ...params, method: 'post', payload: JSON.stringify(datum) })
        .catch(err => networkErrors.push(err)) // avoids stopping of the chain
        .then(res => res)
    )
  );

  return { responses, errors: networkErrors };
}

async function edit(subpage, newData) {
  const sourceUrl = `https://api-ssl.simsave.com.br/v1/admin/${subpage}`;
  const params = getParams_();

  if (!newData || newData.length === 0) return { responses: [], errors: ['Empty data'] };
  // eslint-disable-next-line no-param-reassign
  if (!(Symbol.iterator in newData)) newData = [newData];

  const networkErrors = [];
  const responses = await Promise.all(
    newData.map(datum => {
      return fetchUrl(`${sourceUrl}/${datum.id}`, {
        ...params,
        method: 'post',
        payload: JSON.stringify(datum)
      })
        .catch(err => networkErrors.push({ [datum.id]: err.error })) // avoids stopping the chain
        .then(res => res);
    })
  );

  return { responses, errors: networkErrors };
}

async function deleteAllEntries_(subpage) {
  const queryParams = { page: 1, pagesize: 99999, pageSize: 99999, role: 'instructor' };
  const sourceUrl = `https://api-ssl.simsave.com.br/v1/admin/${subpage}${stringifyQuery(
    queryParams
  )}`;
  const params = getParams_();

  const { data } = await fetchUrl(sourceUrl, { ...params });

  const response = await Promise.all(
    data.forEach(datum => {
      fetchUrl(`https://api-ssl.simsave.com.br/v1/admin/${subpage}/${datum.id}`, {
        ...params,
        method: 'delete'
      });
    })
  );

  return response;
}

async function deleteBetween_(subpage, range) {
  const Config = PropertiesService.getScriptProperties().getProperties();
  const response = await Promise.all(
    range.forEach(id => {
      fetchUrl(`https://api-ssl.simsave.com.br/v1/admin/${subpage}/${id}`, {
        method: 'delete',
        headers: { Authorization: `Bearer ${Config.AUTH_KEY}` }
      });
    })
  );

  return response;
}
