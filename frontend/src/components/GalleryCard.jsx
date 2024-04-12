import React from "react";
import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";
import AvatarGroup from "./AvatarGroup";
import { Link } from "react-router-dom";

const GalleryCard = ({
  title,
  id,
  dayNum,
  isFavorite,
  imageLink,
  num,
  description,
}) => {
  const hostAvatar = imageLink[0];
  const groupImage = imageLink.slice(1, num);
  return (
    <div className="bg-white p-4 rounded-lg shadow-basic hover:bg-slate-100">
      <div className="flex justify-between">
        <div className="flex flex-row justify-between">
          <img
            key={1}
            className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-500 items-center"
            src={hostAvatar}
            alt={`Host Avatar`}
          />
          <div className="flex flex-col justify-center ml-3">
            <Link
              to={`/group/${id}`}
              className="text-base font-bold text-sky-800 hover:scale-125 hover:text-sky-600"
            >
              {title}
            </Link>
            <div className="text-sm text-sky-700">{dayNum} days left</div>
          </div>
        </div>

        <div className="flex items-center">
          {/* favarite button */}
          <button className="flex justify-center items-center bg-slate-200 rounded-full p-0 h-8 w-8 hover:scale-110">
            {isFavorite ? (
              <MdFavorite size={28} color="red" />
            ) : (
              <MdFavoriteBorder size={28} />
            )}
          </button>
        </div>
      </div>
      <div className="text-base text-sky-700 font-thin m-2">
        <p>
          {description.length > 150 ? (
            <>
              {description.substring(0, 150)}
              <Link to={`/group/${id}`} className="ml-2 hover:text-red-500">
                ...
              </Link>
            </>
          ) : (
            description
          )}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <AvatarGroup imageSources={groupImage} num={num} />
        <button className="flex justify-center items-center text-sky-800 font-bold border-solid border-2 border-sky-800 rounded-xl w-4 h-6 hover:scale-110">
          Join
        </button>
      </div>
    </div>
  );
};

export default GalleryCard;
