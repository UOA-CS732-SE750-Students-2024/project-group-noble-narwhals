import React from "react";
import { IoMdSearch } from "react-icons/io";

const LongSearchingBar = ({ searchBtnClick, value }) => {
  return (
    <div className="flex justify-between items-center bg-white border-2 border-sky-900 h-12 rounded-3xl">
      <div className="flex flex-row items-center justify-start gap-2 w-full">
        <IoMdSearch className="ml-3 size-8 text-sky-900 ml-0.5" />
        <input
          placeholder="Search"
          id="Search"
          className="w-full h-10 outline-none"
          defaultValue={value}
        />
      </div>
      <button
        className="bg-sky-900 text-white rounded-3xl mr-0.5 hover:bg-sky-700"
        onClick={searchBtnClick}
      >
        Search
      </button>
    </div>
  );
};
LongSearchingBar.defaultProps = {
  searchBtnClick: () => {},
  value: "",
};

export default LongSearchingBar;
