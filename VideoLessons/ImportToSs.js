/* global SimSave toHHMMSS addToSpreadsheet arraySplitter batchFetch */
/// <reference path="./utils.js">
function interpretData_(contentList, reference) {
  return contentList.map(content =>
    reference.map(ref => {
      const [prop, cb] = ref;
      const val = cb ? cb(content[prop]) : content[prop];
      return Array.isArray(val) ? val.join(', ') : val;
    })
  );
}

async function mutateInstructorIdsIntoProducts_(dataMatrix, col) {
  const { data: instructors } = await SimSave.get('user', { role: 'instructor' });
  let instructorProducts = new Map();
  instructors.forEach(instructor => {
    if (!instructor || !instructor.products) return;
    instructorProducts.set(instructor.id, instructor.products.map(p => p.name || '').join(','));
  });

  for (let i = 0; i <= dataMatrix.length; i++) {
    if (!dataMatrix[i]) continue;
    dataMatrix[i][col] = instructorProducts.get(dataMatrix[i][col]);
  }
}

async function updateSpreadsheetFromSimSave() {
  const { data } = await SimSave.get('content');

  const propMapper = property => list => list.map(item => item[property]);
  const mapNames = propMapper('name');

  /**
   * [displayName, propertyName, callback?]
   */
  const reference = [
    ['ID', 'id'],
    ['Padronizada?', 'short_description', sd => !!sd],
    ['Título', 'title'],
    ['Professor', 'instructor', i => i['name']],
    ['Tópicos', 'topics', mapNames],
    ['Publico Alvo', 'target_audiences', mapNames],
    ['Palavras Chave', 'keywords'],
    ['Jornadas', 'journeys', mapNames],
    ['Produtos', 'products', mapNames],
    ['Tipo', 'type'],
    ['Descrição', 'short_description'],
    ['Publicado?', 'published', p => !!p],
    ['Status', 'status'],
    ['Duração', 'total_time', toHHMMSS],
    ['Vídeos?', 'videos', vs => vs.reduce((ac, c) => ac || !!c['uri'], false)],
    ['Anexos', 'files', propMapper('url')],
    [
      'Link',
      'title',
      t => `https://admin.simsave.com.br/minhas_aulas?query=${t.replace(/\s/g, '%20')}`
    ],
    ['Imagem', 'image', i => i && i.replace('{size}/', '')],
    ['Thumbnail?', 'image', i => /simsave/.test(i)],
    ['Prod. Prof.', 'instructor', i => i['id']]
  ];

  const [header, headlessRef] = arraySplitter(reference);
  const interpretedData = interpretData_(data, headlessRef);

  // Will mutate the ids into a list of product names
  await mutateInstructorIdsIntoProducts_(interpretedData, header.indexOf('Prod. Prof.'));

  addToSpreadsheet([header], interpretedData);
}
