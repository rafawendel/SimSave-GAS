function parseContentListAsObject(idList, type) {
  if (idList === '') return {};
  return idList.split(',')
    .map(id => typeof id === 'string' ? +(id.trim()) : i)
    .reduce((obj, id) => ({
        ...obj,
        [id]: { type }
      }),
    {});
}

function clearEmptyFields(objArr, keyList) {
  return objArr.filter(obj => {
    for (let key in obj) {
      if (!keyList.includes(key)) continue;
      if (!obj[key]) return false;
    }
    return true;
  });
}
