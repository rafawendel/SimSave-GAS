/* eslint-disable no-unused-vars */
/* global Config */
class SimSave {
  static async get(subpage) {
    const queryParams = { page: 1, pagesize: 99999, pageSize: 99999, role: 'instructor' };
    const sourceUrl = `https://api-ssl.simsave.com.br/v1/admin/${subpage}${stringifyQuery(
      queryParams
    )}`;

    const params = {
      method: 'get',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${Config.AUTH_KEY}`,
        'Content-type': 'application/json'
      }
    };

    return await fetchUrl(sourceUrl, params);
  }

  static async getAll(subpage, admin = true) {
    const queryParams = { page: 1, pagesize: 99999, pageSize: 99999, role: 'instructor' };
    const sourceUrl = `https://api-ssl.simsave.com.br/v1/${admin ? 'admin/' : ''}${subpage}`;
    const params = {
      method: 'get',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${Config.AUTH_KEY}`,
        'Content-type': 'application/json'
      }
    };

    const { data } = await fetchUrl(`${sourceUrl}${stringifyQuery(queryParams)}`, params);

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

  static async post(subpage, data) {
    const sourceUrl = `https://api-ssl.simsave.com.br/v1/admin/${subpage}`;
    const params = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${Config.AUTH_KEY}`,
        'Content-type': 'application/json'
      }
    };

    //    if (data instanceof Array && data.length === 0) return { responses: [] };
    if (!(data instanceof Array))
      return await fetchUrl(sourceUrl, { ...params, payload: JSON.stringify(data) });

    const networkErrors = [];
    const responses = await Promise.all(
      data.map(datum =>
        fetchUrl(sourceUrl, { ...params, payload: JSON.stringify(datum) })
          .catch(err => networkErrors.push(err)) // avoids stopping of the chain
          .then(res => res)
      )
    );

    return { responses, errors: networkErrors };
  }

  static async edit(subpage, newData) {
    const sourceUrl = `https://api-ssl.simsave.com.br/v1/admin/${subpage}`;
    const params = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${Config.AUTH_KEY}`,
        'Content-type': 'application/json'
      }
    };

    if (!(newData instanceof Array))
      return await fetchUrl(`${sourceUrl}/${newData.id}`, {
        ...params,
        payload: JSON.stringify(newData)
      });

    const networkErrors = [];
    const responses = await Promise.all(
      newData.map(datum => {
        return fetchUrl(`${sourceUrl}/${datum.id}`, { ...params, payload: JSON.stringify(datum) })
          .catch(err => networkErrors.push(err.error)) // avoids stopping the chain
          .then(res => res);
      })
    );

    return { responses, errors: networkErrors };
  }

  static async deleteAllEntries(subpage) {
    const queryParams = { page: 1, pagesize: 99999, pageSize: 99999, role: 'instructor' };
    const sourceUrl = `https://api-ssl.simsave.com.br/v1/admin/${subpage}${stringifyQuery(
      queryParams
    )}`;

    const { data } = await fetchUrl(sourceUrl, {
      method: 'get',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${Config.AUTH_KEY}`,
        'Content-type': 'application/json'
      }
    });

    const response = await Promise.all(
      data.forEach(datum => {
        fetchUrl(`https://api-ssl.simsave.com.br/v1/admin/${subpage}/${datum.id}`, {
          method: 'delete',
          headers: { Authorization: `Bearer ${Config.AUTH_KEY}` }
        });
      })
    );

    return response;
  }

  static async deleteBetween(subpage, range) {
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
}
