function splitNormalizeAndRemoveUselessParts(name) {
  const prepositions = ['de', 'da', 'e', 'das', 'dos', 'do'];

  return name
    .split(' ')
    .map(part =>
      part
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    )
    .filter(part => !prepositions.includes(part));
}

function compareNameByCharBothWays(name1, name2) {
  let similarity = 0;
  const lengthCoefficient =
    Math.min(name1.length, name2.length) / Math.max(name1.length, name2.length);

  let i;
  for (i = 0; i < name1.length; i++) {
    if (name1.charAt(i) !== name2.charAt(i)) break;
    similarity++;
  }
  for (i = 0; i < name2.length; i++) {
    if (name2.charAt(name2.length - i) !== name1.charAt(name1.length - i)) break;
    similarity++;
  }

  return (lengthCoefficient * similarity) / Math.max(name1.length, name2.length);
}

function matchSurnames(surnames1, surnames2, requiredSimilarity = 0.8) {
  let lastMatchIndex = -1;
  let matchIndex = 0;
  let surnameMatches = 0;

  surnames1.forEach(surname1 => {
    matchIndex = surnames2.findIndex((surname2, id) => {
      if (id <= lastMatchIndex) return false;
      return compareNameByCharBothWays(surname1, surname2) >= requiredSimilarity;
    });

    if (matchIndex !== -1) {
      surnameMatches++;
      lastMatchIndex = matchIndex;
    }
  });

  return surnameMatches;
}

/* exported compareOneToManyNames */
function compareOneToManyNames(name1, namesList, requiredSimilarity = 0.9, matchesPerMismatch = 2) {
  const name1NormalizedList = splitNormalizeAndRemoveUselessParts(name1);
  const [firstname1, ...surnames1] = name1NormalizedList;

  const nameMatches = namesList.filter(row => {
    const [name2] = row;
    if (!name2) return false;
    const name2NormalizedList = splitNormalizeAndRemoveUselessParts(name2);
    const [firstname2, ...surnames2] = name2NormalizedList;

    const similarityOfFirstName = compareNameByCharBothWays(firstname1, firstname2);

    if (Math.min(surnames1.length, surnames2.length) === 0) {
      return similarityOfFirstName >= 1;
    }
    if (similarityOfFirstName < requiredSimilarity) return false;

    const surnameMatchCount = matchSurnames(surnames1, surnames2, requiredSimilarity);
    const minimumSurnameMatches =
      Math.min(surnames1.length, surnames2.length) -
      Math.floor(surnameMatchCount / matchesPerMismatch);

    return surnameMatchCount >= minimumSurnameMatches;
  });

  if (!nameMatches[0]) throw 'No matches';
  return nameMatches;
}

/* exported compareNames */
function compareNames(name1, name2, requiredSimilarity = 0.9, matchesPerMismatch = 2) {
  const name1NormalizedList = splitNormalizeAndRemoveUselessParts(name1);
  const name2NormalizedList = splitNormalizeAndRemoveUselessParts(name2);
  const [firstname1, ...surnames1] = name1NormalizedList;
  const [firstname2, ...surnames2] = name2NormalizedList;
  const similarityOfFirstName = compareNameByCharBothWays(firstname1, firstname2);

  if (Math.min(surnames1.length, surnames2.length) === 0) {
    return similarityOfFirstName >= 1;
  }
  if (similarityOfFirstName < requiredSimilarity) return false;

  const surnameMatchCount = matchSurnames(surnames1, surnames2, requiredSimilarity);
  const minimumSurnameMatches =
    Math.min(surnames1.length, surnames2.length) -
    Math.floor(surnameMatchCount / matchesPerMismatch);

  return surnameMatchCount >= minimumSurnameMatches;
}
