/**
 * Extracts the top three tags from the tagData and returns a flat list of tags
 * @param {Array} tagData - Array of tag data
 * @returns {Array} - Flat list of tags
 * example:
 * const tagData = [
 *  {
 *   tag: "tag1",
 *   similarity: {
 *    tag2: 0.8,
 *    tag3: 0.6,
 *    tag4: 0.4,
 *   },
 *  },
 *  {
 *   tag: "tag2",
 *   similarity: {
 *    tag1: 0.8,
 *    tag3: 0.6,
 *    tag4: 0.4,
 *   },
 *  },
 * ];
 * const flatList = extractTopTagsFlatList(tagData);
 * console.log(flatList);
 * // Output: ["tag1", "tag2", "tag3", "tag2", "tag1", "tag3"]
 */
function extractTopTagsFlatList(tagData) {
  let flatList = [];

  tagData.forEach((data) => {
    const allTagsWithScore = Object.entries(data.similarity)
      .map(([key, value]) => ({ name: key, score: value }))
      .sort((a, b) => b.score - a.score)
      .filter((_, index) => index < 3); // Get the top three including the main tag

    // Push the main tag and the top two similar tags into flatList
    if (allTagsWithScore[0].name === data.tag) {
      flatList.push(
        data.tag,
        allTagsWithScore[1].name,
        allTagsWithScore[2].name
      );
    } else {
      // If the main tag is not the highest score, adjust accordingly
      flatList.push(
        data.tag,
        allTagsWithScore[0].name,
        allTagsWithScore[1].name
      );
    }
  });

  return flatList;
}
export default extractTopTagsFlatList;
