import { getGroup } from "../../../backend/src/middleware/entityMiddleware";

/**
 * Handle the groupData to make it like dummyData structure
 * @param {Array} groupData - Array of group data
 * @param {Boolean} isLoggedIn - User login status
 * @param {Object} user - User data
 * @returns {Array} - Array of group data
 * example:
 * const groupData = [
 * {
 *   groupName: "group1",
 *  _id: "1",
 *  deadlineDate: "2022-12-31T23:59:59.999Z",
 *  groupMembers: ["user1", "user2"],
 *  imageLinks: ["image1", "image2"],
 *  description: "description1",
 *  groupType: "group",
 *  groupTags: ["tag1", "tag2"],
 *  number0fGroupMember: 3,
 *  groupStatus: "available",
 *  likeNumber: 2,
 * },
 * {
 *  groupName: "group2",
 *  _id: "2",
 *  deadlineDate: "2022-12-31T23:59:59.999Z",
 *  groupMembers: ["user1", "user2"],
 *  imageLinks: ["image1", "image2"],
 *  description: "description2",
 *  groupType: "group",
 *  groupTags: ["tag1", "tag2"],
 *  number0fGroupMember: 3,
 *  groupStatus: "available",
 *  likeNumber: 2,
 * },
 * ];
 * const isLoggedIn = true;
 * const user = {
 * likedGroups: ["1"],
 * };
 * const data = handleGroupData(groupData, isLoggedIn, user);
 * console.log(data);
 */
import getGroupImageLink from "./getGroupImageLink";
function handleGroupData(groupData, isLoggedIn, user) {
  if (!Array.isArray(groupData)) {
    console.error("Invalid groupData: ", groupData);
    return []; // Return an empty array or handle the error as appropriate
  }
  let isFavorite = false;
  const members_imageLinks = [];
  const data = groupData.map((group) => {
    const deadlineDate = group.deadlineDate;
    const now = new Date();
    const deadlineDateObj = new Date(deadlineDate);
    const dayNum =
      (deadlineDateObj - now) / (1000 * 60 * 60 * 24) > 0
        ? Math.floor((deadlineDateObj - now) / (1000 * 60 * 60 * 24))
        : 0;
    const num = group.groupMembers.length;
    if (isLoggedIn) {
      // Find user's likedGroups property to check if the group id is in the likedGroups
      isFavorite = user.likedGroups.some(
        (likedGroup) => likedGroup._id === group._id
      );
    }
    const members_imageLink = getGroupImageLink(group);
    return {
      title: group.groupName,
      id: group._id,
      dayNum: dayNum,
      isFavorite: isFavorite,
      imageLink: members_imageLink,
      num: num,
      description: group.groupDescription
        ? group.groupDescription
        : "No content.",
      groupType: group.groupType,
      groupTags: group.groupTags,
      numLimit: group.maxNumber ? group.maxNumber : 0,
      groupStatus: group.groupStatus,
      likeNumber: group.likeNumber ? group.likeNumber : 0,
    };
  });
  return data;
}
export default handleGroupData;
