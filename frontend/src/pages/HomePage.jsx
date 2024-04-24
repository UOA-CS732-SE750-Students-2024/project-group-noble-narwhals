import React, { useState, useEffect } from "react";
import backgroundImage from "../../public/image/homePage_search_bg.jpg";
import LongSearchingBar from "../components/LongSearchingBar";
import Gallery from "../components/Gallery";
import axios from "axios";
import { useAuth } from "../store/AuthContext";

function HomePage() {
  const { isLoggedIn, user } = useAuth();
  console.log("login状态", isLoggedIn);
  console.log("user", user);
  const [groupData, setGroupData] = useState([]);
  const dummyData = [
    {
      title: "Let's test",
      id: "1kes",
      dayNum: 5,
      isFavorite: true,
      imageLink: [
        "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      ],
      num: 5,
      description:
        "Type in the group name or course name you are looking for. Type in the group name or course name you are looking for. Type in the group name or course name you are looking for. Type in the group name or course name you are looking for.",
    },
    {
      title: "Go to fishing",
      id: "4hjdh",
      dayNum: 1,
      isFavorite: false,
      imageLink: [
        "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk",
        "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
        "https://eu.ui-avatars.com/api/?name=John+Doe&size=250",
        "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=mail@ashallendesign.co.uk",
        "https://robohash.org/mail@ashallendesign.co.uk",
      ],
      num: 5,
      description:
        "Type in the group name or course name you are looking for. Type in the group name or course name you are looking for. Type in the group name or course name you are looking for. Type in the group name or course name you are looking for.",
    },
    {
      title: "Final lucky",
      id: "3hjdh",
      dayNum: 3,
      isFavorite: true,
      imageLink: [
        "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk",
        "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
        "https://eu.ui-avatars.com/api/?name=John+Doe&size=250",
        "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=mail@ashallendesign.co.uk",
        "https://robohash.org/mail@ashallendesign.co.uk",
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      ],
      num: 6,
      description:
        "Type in the group name or course name you are looking for. Type in the group name or course name you are looking for. Type in the group name or course name you are looking for. Type in the group name or course name you are looking for.",
    },
  ];
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const getGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/group`);
        setGroupData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getGroups();
  }, []);
  async function getGroupImageLink(group) {
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

    console.log("members_imageLink", members_imageLink);
    return members_imageLink; // This will be an array of strings, each being an avatar URL or an empty string
  }

  // handle the groupData to make it like dummyData structure
  function handleGroupData(groupData) {
    let isFavorite = false;
    const data = groupData.map((group) => {
      const deadlineDate = group.deadlineDate;
      const now = new Date();
      const deadlineDateObj = new Date(deadlineDate);
      const dayNum =
        (deadlineDateObj - now) / (1000 * 60 * 60 * 24) > 0
          ? Math.floor((deadlineDateObj - now) / (1000 * 60 * 60 * 24))
          : 0;

      const imageLink = getGroupImageLink(group);
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
        imageLink: imageLink,
        num: num,
        description: group.description,
        groupType: group.groupType,
        groupTags: group.groupTags,
        numLimit: group.number0fGroupMember,
        groupStatus: group.groupStatus,
      };
    });
    return data;
  }
  console.log("handleGroupData", handleGroupData(groupData));
  // get the data in groupData which type is group and status is available
  const groupDataGroup = handleGroupData(groupData).filter(
    (item) => item.groupType === "group" && item.groupStatus === "available"
  );
  // get the top 3 data in groupDataGroup by dayNum
  const top3GroupDataGroup = groupDataGroup
    .sort((a, b) => a.dayNum - b.dayNum)
    .slice(0, 3);
  // get the data in groupData which type is activity and status is available
  const groupDataActivity = handleGroupData(groupData).filter(
    (item) => item.groupType === "activity" && item.groupStatus === "available"
  );
  // get the top 3 data in groupDataActivity by dayNum
  const top3GroupDataActivity = groupDataActivity
    .sort((a, b) => a.dayNum - b.dayNum)
    .slice(0, 3);
  console.log("top3GroupDataGroup", top3GroupDataGroup);
  console.log("top3GroupDataActivity", top3GroupDataActivity);
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
        <Gallery name="Recommendation" data={dummyData} />
        <Gallery name="Groups" data={dummyData} />
        <Gallery name="Activities" data={dummyData} />
      </div>
    </>
  );
}

export default HomePage;
