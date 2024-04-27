/**
 * This function takes a group object and an API_BASE_URL as input and returns an array of image links for the group members.
 * @param {Object} group - Group object
 * @param {String} API_BASE_URL - Strapi API base URL
 * @returns {Array} - Array of image links for the group members
 */
import axios from "axios";
async function getGroupImageLink(group, API_BASE_URL) {
  if (!group || !group.groupMembers) {
    console.error("Invalid group data");
    return []; // Return an empty array if there's no group data or members
  }

  const groupMembers = group.groupMembers;
  const members_imageLink = await Promise.all(
    groupMembers.map(async (memberId) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/user/${memberId}`
        );
        const user = response.data;

        // Check if user data exists and has the avatar property
        if (user && user.avatar) {
          return user.avatar;
        } else {
          console.warn(`No avatar found for user: ${memberId}`);
          return ""; // Return empty string if no avatar
        }
      } catch (error) {
        console.error(
          `Error retrieving user data for memberId: ${memberId}`,
          error
        );
        return ""; // Return empty string if the request fails
      }
    })
  );

  return members_imageLink; // This will be an array of strings, each being an avatar URL or an empty string
}

export default getGroupImageLink;
