/**getTagByIds
 * get tag name by tag id
 * @param {Array} tagIds - tag ID array
 * @param {String} baseUrl - Strapi API base URL
 * @returns {Array} - Array of tag names
 * example:
 * const tagIds = [1, 2, 3];
 * const baseUrl = "http://localhost:1337";
 * const tags = await getTagsByIds(tagIds, baseUrl);
 */
import axios from "axios";

async function getTagsByIds(tagIds, baseUrl) {
  if (!tagIds || tagIds.length === 0) {
    console.error("Invalid or empty tag IDs");
    return []; // return an empty array if there are no tag IDs
  }
  try {
    const tagPromises = tagIds.map(async (tagId) => {
      try {
        const response = await axios.get(`${baseUrl}/api/tag/${tagId}`);
        const tag = response.data;
        if (tag && tag.name) {
          return tag.name;
        } else {
          console.warn(`No tagName found for tag: ${tagId}`);
          return ""; // return empty string or choose not to return anything
        }
      } catch (error) {
        console.error(`Error retrieving tag data for tagId: ${tagId}`, error);
        return ""; // handle error cases by returning an empty string or appropriate error message
      }
    });

    // use Promise.all to wait for all Promises to complete
    const tags = await Promise.all(tagPromises);
    return tags.filter((tag) => tag); // filter out empty strings or incorrect values
  } catch (error) {
    console.error("Error processing tags", error);
    return [];
  }
}

export default getTagsByIds;
