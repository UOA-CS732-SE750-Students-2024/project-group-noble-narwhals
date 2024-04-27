/**getTagByIds
 * 通过标签 ID 获取标签名称
 * @param {Array} tagIds - 标签 ID 数组
 * @param {String} baseUrl - Strapi API 的基本 URL
 * @returns {Array} - 包含标签名称的数组
 * example:
 * const tagIds = [1, 2, 3];
 * const baseUrl = "http://localhost:1337";
 * const tags = await getTagsByIds(tagIds, baseUrl);
 */
import axios from "axios";

async function getTagsByIds(tagIds, baseUrl) {
  if (!tagIds || tagIds.length === 0) {
    console.error("Invalid or empty tag IDs");
    return []; // 返回一个空数组，如果没有标签 ID
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
          return ""; // 返回空字符串或者选择不返回任何内容
        }
      } catch (error) {
        console.error(`Error retrieving tag data for tagId: ${tagId}`, error);
        return ""; // 处理错误情况下返回空字符串或者相应的错误信息
      }
    });

    // 使用 Promise.all 等待所有 Promise 完成
    const tags = await Promise.all(tagPromises);
    return tags.filter((tag) => tag); // 过滤掉空字符串或不正确的值
  } catch (error) {
    console.error("Error processing tags", error);
    return [];
  }
}

export default getTagsByIds;
