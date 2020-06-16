/**
 * @OnlyCurrentDoc
 */

function splitNormalizeAndRemoveUselessParts(name) {
  const prepositions = ['de', 'da', 'e', 'das', 'dos', 'do'];
  
  return name
          .split(' ')
          .map(part => part.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
          .filter(part => !(prepositions.includes(part)));
}

function compareNameByCharBothWays(name1, name2) {
  let similarity = 0;
  const lengthCoefficient = Math.min(name1.length, name2.length) / Math.max(name1.length, name2.length);
  
  let i;
  for (i = 0; i < name1.length; i++) {
    if (name1.charAt(i) !== name2.charAt(i)) break;
    similarity++;
  }
  for (i = 0; i < name2.length; i++) {
    if (name2.charAt(name2.length - i) !== name1.charAt(name1.length - i)) break;
    similarity++;
  }
  
  return lengthCoefficient * similarity / Math.max(name1.length, name2.length);
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