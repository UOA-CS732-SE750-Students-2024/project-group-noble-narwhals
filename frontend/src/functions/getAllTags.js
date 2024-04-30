/**
 * Get all group tags from the backend
 * @param {String} baseUrl - Strapi API base URL
 * @returns {Array} - Array of group tag names
 * example:
 * const tags = await getAllTags("http://localhost:1337");
 */
import axios from "axios";

async function getAllTags(baseUrl) {
  try {
    const response = await axios.get(`${baseUrl}/api/tag`);
    const tags = response.data;
    if (!tags || tags.length === 0) {
      console.warn("No tags found");
      return [];
    }
    const groupTagNames = tags
      .filter((tag) => tag.isGroupTag)
      .map((tag) => tag.name);
    return groupTagNames;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default getAllTags;
