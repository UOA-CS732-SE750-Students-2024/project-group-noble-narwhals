import React from "react";
import GalleryCard from "./GalleryCard";
import { useNavigate } from "react-router-dom";
const Gallery = ({ name, data }) => {
  const navigate = useNavigate();
  // const type = ["group", "activity"];
  let displayName = name;
  switch (name) {
    case "Groups":
      displayName = "group";
      break;
    case "Activities":
      displayName = "activity";
      break;
    case "Recommendation":
      displayName = "search";
      break;
    default:
      break;
  }
  const handleMore = () => {
    if (displayName === "search") {
      return navigate(`/search`);
    } else {
      navigate(`/search`, { state: { groupType: displayName } });
    }
  };
  return (
    <div className="my-8 min-w-64">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-sky-800">{name}</h2>
        <button
          className="text-sky-800 text-sm font-bold hover:underline"
          onClick={handleMore}
        >
          More
        </button>
      </div>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4 mx-px">
          {data.map((item, index) => (
            <GalleryCard
              key={index}
              title={item.title}
              id={item.id}
              dayNum={item.dayNum}
              isFavorite={item.isFavorite}
              imageLink={item.imageLink}
              num={item.num}
              numLimit={item.numLimit}
              description={item.description}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          Sorry, no information is currently available on the platform
        </p>
      )}
    </div>
  );
};

export default Gallery;
