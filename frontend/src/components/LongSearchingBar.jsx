import React from "react";
import { IoMdSearch } from "react-icons/io";

const LongSearchingBar = () => {
  return (
    <div className="flex justify-between items-center w-1/2 bg-white border-2 border-sky-900 h-12 rounded-3xl">
      <IoMdSearch className="size-10 text-sky-900 ml-0.5" />
      <input className="w-96 h-10 outline-none" />
      <button className="bg-sky-900 text-white rounded-3xl mr-0.5">
        Search
      </button>
    </div>
  );
};

export default LongSearchingBar;
