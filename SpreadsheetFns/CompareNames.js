/* eslint-disable no-param-reassign */
/* global compareNames compareOneToManyNames */
/**
 * Test whether two names are the same or if a name has a correspondency in a list
 *
 * @param {string} name The reference name to be compared.
 * @param {string|string[]} comparison_name The name to be compared or list of names.
 * @param {number} required_similarity [optional] A number between 0 ~ 1 which will be the reference of similarity between the names.
 * @param {number} matches_per_mismatch [optional] An integer number which represents the number of matches required to allow a mismatch.
 * @return Vertical array containing linearized input.
 * @customFunction
 */
function COMPARE_NAMES(name, comparison_name, required_similarity, matches_per_mismatch) {
  if (!name || !comparison_name) throw 'Empty entry';
  if (typeof name !== 'string') throw 'The first argument must be a string';
  if (typeof required_similarity !== 'number') required_similarity = undefined;
  if (typeof matches_per_mismatch !== 'number') matches_per_mismatch = undefined;
  if (required_similarity > 1) required_similarity = 1;
  if (matches_per_mismatch <= 0 || matches_per_mismatch > 6) matches_per_mismatch = undefined;
  if (typeof comparison_name !== 'string') {
    if (comparison_name instanceof Array)
      return compareOneToManyNames(
        name,
        comparison_name,
        required_similarity,
        matches_per_mismatch
      );
    throw 'The second argument must be either a string or a range of strings';
  }
  return compareNames(name, comparison_name, required_similarity, matches_per_mismatch);
}
