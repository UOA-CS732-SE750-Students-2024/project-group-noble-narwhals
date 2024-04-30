import { useState, useEffect } from "react";
import backgroundImage from "../../public/image/homePage_search_bg.jpg";
import LongSearchingBar from "../components/LongSearchingBar";
import Gallery from "../components/Gallery";
import axios from "axios";
import { useAuth } from "../store/AuthContext";
import getAllTags from "../functions/getAllTags";
import tagSimulator from "../functions/tagSimulator";
import extractTopTagsFlatList from "../functions/extractTopTagsFlatList";
import handleGroupData from "../functions/hanldeGroupData";
import { useNavigate } from "react-router-dom";
function HomePage() {
  const { isLoggedIn, user } = useAuth();
  const [groupData, setGroupData] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [tagRecommendation, setTagRecommendation] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  let word = "";
  const handleSearchBthClick = () => {
    word = encodeURIComponent(document.getElementById("Search").value);
    navigate(`/search`, { state: { keywords: word } });
    word = "";
  };
  useEffect(() => {
    const getGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/group`);
        setGroupData(handleGroupData(response.data, isLoggedIn, user));
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
    if (user && isLoggedIn && user.profileTags) {
      const tags = [];
      user.profileTags.map((tag) => {
        tags.push(tag.name);
      });
      setUserTags(tags);
    }
    getGroups();
    fetchAllTags();
  }, [isLoggedIn, user]);
  // Get the data in groupData which type is group and status is available
  const groupDataGroup = groupData.filter(
    (item) => item.groupType === "group" && item.groupStatus === "available"
  );
  // Get the latest 3 data in groupDataGroup by dayNum
  const latest3GroupDataGroups = [...groupDataGroup]
    .sort((a, b) => a.dayNum - b.dayNum)
    .slice(0, 3);

  // Get the data in groupData which type is activity and status is available
  const groupDataActivity = groupData.filter(
    (item) => item.groupType === "activity" && item.groupStatus === "available"
  );
  // Get the top 3 data in groupDataActivity by dayNum
  const latest3GroupDataActivities = [...groupDataActivity]
    .sort((a, b) => a.dayNum - b.dayNum)
    .slice(0, 3);

  // Calculate the popularity of each group based on the number of likes, number of members, and days until the deadline
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

  useEffect(() => {
    // Assume the user is logged in and needs to get tag recommendations
    if (user && isLoggedIn) {
      tagSimulator(userTags, allTags, setTagRecommendation);
    }
  }, [userTags, allTags]);

  // Take the top three tags of each group's tagRecommendation, put all tags into an array
  const flatTagList = extractTopTagsFlatList(tagRecommendation);

  // Find popularGroupData containing flatTagList, select the top three groups with the highest popularity
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
  return (
    <>
      <div id="main_content" className="">
        <div
          className="bg-cover bg-center flex flex-col items-center justify-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            // BackgroundSize: "cover",
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
              <LongSearchingBar
                searchBtnClick={handleSearchBthClick}
                value={word}
              />
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
