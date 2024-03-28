import React from "react";
import GalleryCard from "./GalleryCard";

const Gallery = ({ name, data }) => {
  return (
    <div className="my-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-sky-800">{name}</h2>
        <a href="#" className="text-sky-800 text-sm font-bold hover:underline">
          More
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {data.map((item, index) => (
          <GalleryCard
            key={index}
            title={item.title}
            id={item.id}
            dayNum={item.dayNum}
            isFavorite={item.isFavorite}
            imageLink={item.imageLink}
            num={item.num}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
