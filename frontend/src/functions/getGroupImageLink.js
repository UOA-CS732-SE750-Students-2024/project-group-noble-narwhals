/**
 * This function takes a group object and an API_BASE_URL as input and returns an array of image links for the group members.
 * @param {Object} group - Group object
 * @param {String} API_BASE_URL - Strapi API base URL
 * @returns {Array} - Array of image links for the group members
 */
function getGroupImageLink(group) {
  if (!group || !group.groupMembers) {
    console.error("Invalid group data");
    return []; // Return an empty array if there's no group data or members
  }
  const members_imageLink = [];
  group.groupMembers.map((member) => {
    members_imageLink.push(member.avatar);
  });
  return members_imageLink; // This will be an array of strings, each being an avatar URL or an empty string
}

export default getGroupImageLink;
