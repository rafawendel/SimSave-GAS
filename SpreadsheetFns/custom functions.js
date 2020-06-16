/**
 * @OnlyCurrentDoc
 */

/**
 * Returns the background color of own cell or reference.
 *
 * @param {string} A1 [optional] A1 notation of cell.
 * @return Background color of own cell or referenced cell.
 * @customFunction
 */
function COR(A1) {
  if(A1) {
    return A1.indexOf(':') > -1 
    ? SpreadsheetApp.getActiveSheet().getRange(A1).getBackgrounds()
    : SpreadsheetApp.getActiveSheet().getRange(A1).getBackground();
  } else {
    return SpreadsheetApp.getActiveSheet().getCurrentCell().getBackground();
  }
}

/**
 * Returns the input as a single column, ignoring empty values.
 *
 * @param {range} range The range of values to be linearized.
 * @return Vertical array containing linearized input.
 * @customFunction
 */
function SINGLECOLUMN(range) {
  var singleDimensionList = [];
  for (var i = 0; i < range.length; i++) {
    for (var j = 0; j < range[i].length; j++) {
      if (!range[i][j]) continue;
      singleDimensionList.push(range[i][j])
    }
  }
  return singleDimensionList;
}

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
    const minimumSurnameMatches = Math.min(surnames1.length, surnames2.length) - Math.floor(surnameMatchCount / matchesPerMismatch);

    return surnameMatchCount >= minimumSurnameMatches;
  });

  if (!nameMatches[0]) throw 'No matches';
  return nameMatches;
}

function compareNames(name1, name2, requiredSimilarity = 0.9, matchesPerMismatch = 2) {
  const name1NormalizedList = splitNormalizeAndRemoveUselessParts(name1);
  const name2NormalizedList = splitNormalizeAndRemoveUselessParts(name2);
  const [firstname1, ...surnames1] = name1NormalizedList;
  const [firstname2, ...surnames2] = name2NormalizedList;
  const similarityOfFirstName = compareNameByCharBothWays(firstname1, firstname2);
  
  if (Math.min(surnames1.length, surnames2.length) === 0) {
    return similarityOfFirstName >= 1;
  }
  if (similarityOfFirstname < requiredSimilarity) return false;

  const surnameMatchCount = matchSurnames(surnames1, surnames2, requiredSimilarity);
  const minimumSurnameMatches = Math.min(surnames1.length, surnames2.length) - Math.floor(surnameMatchCount / matchesPerMismatch);

  return surnameMatchCount >= minimumSurnameMatches;
}

/**
 * Returns if two names are the same, or, in case a list is passed as comparison_name value,
 * returns a list of the matching names or an error, if no match is found.
 *
 * @param {string} name The reference name to be compared.
 * @param {string|range} comparison_name The name to be compared or list of names.
 * @param {number} required_similarity [optional] A number between 0 ~ 1 which will be the reference of similarity between the names.
 * @param {number} matches_per_mismatch [optional] An integer number which represents the number of matches required to allow a mismatch.
 * @return Vertical array containing linearized input.
 * @customFunction
 */
function COMPARE_NAMES(name, comparison_name, required_similarity, matches_per_mismatch) {
  if (!name || !comparison_name) throw 'Empty entry';
  if (typeof name !== 'string') throw 'The first argument must be a string';
  if (required_similarity > 1) required_similarity = 1;
  if (matches_per_mismatch <= 0 || matches_per_mismatch > 6) matches_per_mismatch = undefined;
  if (typeof comparison_name !== 'string') {
    if (comparison_name instanceof Array) return compareOneToManyNames(name, comparison_name, required_similarity, matches_per_mismatch);
    throw 'The second argument must be either a string or a range of strings'
  }
  return compareNames(name, comparison_name, required_similarity, matches_per_mismatch);
}
