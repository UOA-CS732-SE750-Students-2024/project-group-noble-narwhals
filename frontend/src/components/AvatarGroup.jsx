import React from "react";

const AvatarGroup = ({ imageSources, num, numLimit }) => {
  const linkNum = imageSources.length;
  const imagesToShow =
    typeof num === "number" ? imageSources.slice(0, linkNum) : imageSources;

  return (
    <div className="flex justify-between items-center">
      <div className="flex -space-x-4 overflow-hidden">
        {imagesToShow.map((src, index) => (
          <img
            key={index}
            className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-500"
            src={src}
            alt={`Avatar ${index + 1}`}
          />
        ))}
      </div>
      <p className="inline-block font-bold ml-1">
        <span className={`${linkNum < num ? "text-sky-800" : "text-sky-800"}`}>
          {num}
        </span>
        /{numLimit}
      </p>
    </div>
  );
};

export default AvatarGroup;
