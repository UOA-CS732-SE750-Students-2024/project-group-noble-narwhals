import React, { useRef } from "react"; // Import useRef
import { useNavigate } from "react-router-dom"; // Import useNavigate if you're using react-router v6
import { IoMdSearch } from "react-icons/io";

const LongSearchingBar = () => {
  const inputRef = useRef(null); // Create a ref
  const navigate = useNavigate(); // Get navigate function
  const searchHandler = (e) => {
    e.preventDefault();
    console.log(inputRef.current.value);
    const word = inputRef.current.value;
    inputRef.current.value = "";
    navigate(`/search`, { state: { keywords: word } });
  };
  return (
    <div className="flex justify-between items-center bg-white border-2 border-sky-900 h-12 rounded-3xl">
      <IoMdSearch className="size-10 text-sky-900 ml-0.5" />
      <input
        ref={inputRef}
        id="Search"
        className="w-3/4 h-10 outline-none"
        type="text"
      />
      <button
        className="bg-sky-900 text-white rounded-3xl mr-0.5"
        onClick={searchHandler}
      >
        Search
      </button>
    </div>
  );
};

export default LongSearchingBar;
