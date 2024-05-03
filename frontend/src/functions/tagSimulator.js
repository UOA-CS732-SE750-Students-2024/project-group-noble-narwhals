/** tagSimulator(tags, tagList, setTagRecommendation)
 * get tag recommendation based on the tags and tag list
 * @param {Array} tags - tags array
 * @param {Array} tagList - tag list array
 * @param {Function} setTagRecommendation - set tag recommendation function
 * example:
 * const tags = ["tag1", "tag2"];
 * const tagList = ["tag3", "tag4"];
 * const setTagRecommendation = (recommendation) => console.log(recommendation);
 * tagSimulator(tags, tagList, setTagRecommendation);
 */
import axios from "axios";

const API_TAG_SIMILARITY_URL = import.meta.env.VITE_API_TAG_SIMILARITY_URL;

function tagSimulator(tags, tagList, setTagRecommendation) {
  const url = `${API_TAG_SIMILARITY_URL}/tagsim`;
  const data = {
    tag: tags,
    taglist: tagList,
    topn: 5,
  };

  const fetchData = async () => {
    try {
      const response = await axios.post(url, data);
      if (response.data.success) {
        setTagRecommendation(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  fetchData();
}

export default tagSimulator;
