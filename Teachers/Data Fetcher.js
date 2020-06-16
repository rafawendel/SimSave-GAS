async function fetchInstructorsFromSimSave() {
  const queryParams = { page: 1, pagesize: 99999, pageSize: 99999, role: 'instructor' };
  const sourceUrl = `https://api-ssl.simsave.com.br/v1/admin/user${Object.entries(
    queryParams
  ).reduce((acc, [key, value]) => `${acc}&${key}=${value}`, '?')}`;
  const fetchParams = {
    method: 'get',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${Config.AUTH_KEY}` }
  };

  const { data: instructors } = await fetchUrl(sourceUrl, fetchParams);

  const reqUrlList = instructors.map(
    instructor => `https://api-ssl.simsave.com.br/v1/user/${instructor.id}`
  );
  const { responses: instructorsInformation } = await batchFetch(reqUrlList, fetchParams);

  return instructorsInformation;
}

function processInstructorsList(instructorsList) {
  const processedInstructors = instructorsList
    .filter(instructor => instructor.name)
    .map(instructor => ({
      Nome: instructor.name,
      'E-mail': instructor.email.includes('simsave') ? 'SIMSAVE (deprecated)' : instructor.email,
      Foto: !!instructor.photo,
      Sexo: instructor.info && instructor.info.gender,
      Telefone:
        instructor.info && (instructor.info.phone.includes('99999') ? null : instructor.info.phone),
      Especialidade: instructor.info && instructor.info.specialty,
      Bio: instructor.info && instructor.info.description,
      Perfil: `https://admin.simsave.com.br/instructors/${instructor.id}/edit`
    }))
    .sort(({ Nome: a }, { Nome: b }) => a.localeCompare(b));

  return processedInstructors;
}

function createMatrixFromObjs(objList, header) {
  return objList.map(obj => header.map(label => obj[Object.keys(obj).find(key => key === label)]));
}

async function fetchContactsAndAddToSpreadsheet() {
  const header = ['Nome', 'Sexo', 'E-mail', 'Telefone', 'Especialidade', 'Foto', 'Bio', 'Perfil'];

  const instructorsRawList = await fetchInstructorsFromSimSave();
  const instructorsProcessedList = processInstructorsList(instructorsRawList);
  const matrix = createMatrixFromObjs(instructorsProcessedList, header);

  addToSpreadsheet([header, ...matrix], 'Imports', true);
}
