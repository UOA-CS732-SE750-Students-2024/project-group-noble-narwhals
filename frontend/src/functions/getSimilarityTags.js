import { useState } from "react";
import axios from "axios";

function TagSimulator(tags, tagList) {
  const API_TAG_SIMILARITY_URL = import.meta.env.VITE_API_TAG_SIMILARITY_URL;
  const [response, setResponse] = useState("");

  const handleFetchData = async () => {
    const url = `${API_TAG_SIMILARITY_URL}/tagsim`;
    const data = {
      tag: tags,
      taglist: tagList,
      topn: 20,
    };

    try {
      const response = await axios.post(url, data);
      setResponse(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
  return response;
}

export default TagSimulator;
