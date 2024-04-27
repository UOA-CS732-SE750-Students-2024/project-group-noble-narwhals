import React, { useEffect } from "react";
import axios from "axios";

function getAllTags() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [tags, setTags] = React.useState([]);
  useEffect(() => {
    const getTags = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tag`);
        console.log(response.data);
        setTags(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getTags();
  }, []);

  return tags;
}

export default getAllTags;
