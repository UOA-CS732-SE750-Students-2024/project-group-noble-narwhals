import React, { useState, useEffect } from "react";
import backgroundImage from "../../public/image/homePage_search_bg.jpg";
import LongSearchingBar from "../components/LongSearchingBar";
import Gallery from "../components/Gallery";
import axios from "axios";
import { useAuth } from "../store/AuthContext";
import getTagsByIds from "../functions/getTagsByIds";
import getAllTags from "../functions/getAllTags";
import getSimilarityTags from "../functions/tagSimulator";

function HomePage() {
  const { isLoggedIn, user } = useAuth();
  const [groupData, setGroupData] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const getGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/group`);
        const groupsWithImagesAndTags = await Promise.all(
          response.data.map(async (group) => {
            const imageLinks = await getGroupImageLink(group, API_BASE_URL);
            const groupTags = await getTagsByIds(group.groupTags, API_BASE_URL);
            return { ...group, imageLinks, groupTags };
          })
        );
        setGroupData(
          handleGroupData(groupsWithImagesAndTags, isLoggedIn, user)
        );
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAllTags = async () => {
      try {
        const tags = await getAllTags(API_BASE_URL);
        setAllTags(tags);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchUserTags = async () => {
      if (user && isLoggedIn && user.profileTags) {
        try {
          const tags = await getTagsByIds(user.profileTags, API_BASE_URL);
          setUserTags(tags);
        } catch (error) {
          console.error("Error fetching user tags:", error);
        }
      }
    };
    fetchUserTags();
    getGroups();
    fetchAllTags();
  }, [isLoggedIn, user]);
  // get the data in groupData which type is group and status is available
  const groupDataGroup = groupData.filter(
    (item) => item.groupType === "group" && item.groupStatus === "available"
  );
  // get the latest 3 data in groupDataGroup by dayNum
  const latest3GroupDataGroups = [...groupDataGroup]
    .sort((a, b) => a.dayNum - b.dayNum)
    .slice(0, 3);
  // get the data in groupData which type is activity and status is available
  const groupDataActivity = groupData.filter(
    (item) => item.groupType === "activity" && item.groupStatus === "available"
  );
  // get the top 3 data in groupDataActivity by dayNum
  const latest3GroupDataActivities = [...groupDataActivity]
    .sort((a, b) => a.dayNum - b.dayNum)
    .slice(0, 3);

  const popularGroupData = groupData
    .filter((item) => item.groupStatus === "available")
    .map((item) => {
      const popular =
        item.likeNumber * 0.5 +
        item.num * 0.3 +
        0.2 / (item.dayNum === 0 ? 1 : item.dayNum);
      return {
        ...item,
        popular: popular,
      };
    });
  // Get the top three groups with the highest popularity
  const top3PopularGroupData = popularGroupData
    .sort((a, b) => b.popular - a.popular)
    .slice(0, 3);

  const [tagRecommendation, setTagRecommendation] = useState([]);

  useEffect(() => {
    // Assume the user is logged in and needs to get tag recommendations
    if (user && isLoggedIn) {
      getSimilarityTags(userTags, allTags, setTagRecommendation);
    }
  }, [userTags, allTags]);
  // 取每组tagRecommendation的前三个tag,将所有tag放入一个数组
  const extractTopTagsFlatList = (tagData) => {
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
  };

  // Then call this function with your data
  const flatTagList = extractTopTagsFlatList(tagRecommendation); // Replace 'tagRecommendationData' with the actual data

  // 查找包含flatTagList的popularGroupData,选取popular最高的三个group
  const top3RecommendationGroupData = popularGroupData
    .map((group) => {
      // Calculate a weight for each group based on how many tags it contains that are in flatTagList
      const weight = group.groupTags.reduce((acc, tag) => {
        if (flatTagList.includes(tag)) {
          // Increase the accumulator if the tag is found, adjust the increment as needed
          return acc + 10;
        }
        return acc;
      }, 0);

      // Return the group with an updated popular score based on the weight
      return {
        ...group,
        popular: group.popular + weight,
      };
    })
    // After mapping, sort the groups by their new popular score and take the top three
    .sort((a, b) => b.popular - a.popular)
    .slice(0, 3);

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

  return (
    <>
      <div id="main_content" className="">
        <div
          className="bg-cover bg-center flex flex-col items-center justify-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            // backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#f5f5f5",
            height: "50vh",
          }}
        >
          {/* Blurred overlay div */}
          <div className="w-full h-full bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center">
            <h1 className="text-sky-800 my-4">
              <b className="text-4xl">Need Group/ Activities?</b>
            </h1>
            <p className="text-lg font-black text-sky-700 mb-4">
              Type in the group name, course name, find your group!
            </p>
            <div className="w-1/2">
              <LongSearchingBar />
            </div>
          </div>
        </div>
        <Gallery
          name="Recommendation"
          data={isLoggedIn ? top3RecommendationGroupData : top3PopularGroupData}
        />
        <Gallery name="Groups" data={latest3GroupDataGroups} />
        <Gallery name="Activities" data={latest3GroupDataActivities} />
      </div>
    </>
  );
}

export default HomePage;

// handle the groupData to make it like dummyData structure
function handleGroupData(groupData, isLoggedIn, user) {
  let isFavorite = false;
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
      // find user's likedGroups property to check if the group id is in the likedGroups
      isFavorite = user.likedGroups.includes(group._id);
    }
    return {
      title: group.groupName,
      id: group._id,
      dayNum: dayNum,
      isFavorite: isFavorite,
      imageLink: group.imageLinks,
      num: num,
      description: group.description ? group.description : "No content.",
      groupType: group.groupType,
      groupTags: group.groupTags,
      numLimit: group.number0fGroupMember ? group.number0fGroupMember : 0,
      groupStatus: group.groupStatus,
      likeNumber: group.likeNumber ? group.likeNumber : 0,
    };
  });
  return data;
}
