import React from "react";
import { IoMdSearch } from "react-icons/io";

const LongSearchingBar = () => {
  return (
    <div className="flex items-center w-96 bg-white border-2 border-sky-900 h-12 rounded-3xl">
      <IoMdSearch className="size-10 text-sky-900 ml-0.5" />
      <input className="w-96 h-10" />
      <button className="bg-sky-900 text-white rounded-3xl mr-0.5">
        Search
      </button>
    </div>
  );
};

export default LongSearchingBar;
