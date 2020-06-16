function listRelevantSigners(responseList) {
  const signers = [];
  const lowerCaseSigners = [];

  responseList.forEach(response => {
    if (!response.document) return;
    const { events } = response.document;

    events.forEach(event => {
      const { name, data } = event;
      if (name !== 'sign') return; // skips useless events

      const { signer } = data;
      if (
        signer.sign_as !== 'party' || // skips uninteresting signers
        signer.name.toLowerCase().includes('levindo') ||
        signer.name.toLowerCase().includes('denúbila')
      )
        return;

      if (lowerCaseSigners.includes(signer.name.toLowerCase())) return; // clears duplicates
      lowerCaseSigners.push(signer.name.toLowerCase()); // dummy array, to avoid remapping of every value

      signers.push(signer.name);
    });
  });

  return signers.sort((a, b) => a.localeCompare(b));
}

async function fetchClicksign() {
  const baseUrl = 'https://app.clicksign.com/api/v1';

  const { documents } = await fetchUrl(
    `${baseUrl}/documents?access_token=${Config.CLICKSIGN_TOKEN}`
  );
  const keys = documents.map(document => document.key);
  const requestUrlList = keys.map(
    key => `${baseUrl}/documents/${key}?access_token=${Config.CLICKSIGN_TOKEN}`
  );

  const { responses: responseList } = await batchFetch(requestUrlList);

  return responseList;
}

async function fetchSignersAndAddToSpreadsheet() {
  const responseList = await fetchClicksign();
  const signers = listRelevantSigners(responseList);
  const signersAsMatrix = signers.map(row => [row]);
  addToSpreadsheet(signersAsMatrix, 'Clicksign');
}
