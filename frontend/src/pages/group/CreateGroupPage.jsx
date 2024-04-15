import React, { useState } from "react";
import Button from "../../components/Button";

function CreatGroupPage() {
  const [selectedButton, setSelectedButton] = useState("");

  const [tags, setTags] = useState([]); // Used to store all tags
  const [input, setInput] = useState(""); //Used to store the value of the input box
  const [inputError, setInputError] = useState(''); 

  // Random color generation function
  const randomColor = () => {
    let color = "#FFFFFF";
    while (color === "#FFFFFF") {
      let hex = Math.floor(Math.random() * 0xffffff);
      color = "#" + hex.toString(16).padStart(6, "0");
    }
    return color;
  };
  //Handle tag event
  const addTag = (e) => {
    e.preventDefault();
    const trimInput = input.trim();
    console.log(input);
    if (trimInput) {
      setTags([...tags, { text: trimInput, color: randomColor() }]);
      setInput(""); // Clear input box
      setInputError('');
    }
    else{
      setInputError('Please enter a tag');
    }
  };
  // Change event handler of input box
  const handleChange = (e) => {
    setInput(e.target.value);
  };
  // Handle tag deletion events
  const removeTag = (index) => {
    setTags(tags.filter((_, idx) => idx !== index));
  };

  // Label key event handler function
  const handleKeyPress = (e) => {
    // Add label when enter key is pressed
    if (e.key === "Enter") {
      addTag();
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
  };

  const handleCancel = async (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex justify-center items-center h-createImageHeight">
      <div
        className=" bg-cover h-screen  absolute inset-0 -z-10 "
        style={{
          backgroundImage: "url('../../../public/image/creategroup_bg.jpg')",
          filter: "blur(1px)",
        }}
      ></div>

      <div className="bg-white max-w-mainContent w-2/3 lg:w-4/5  relative m-auto flex flex-col items-center ">
        <div>
          <h1 className="text-center text-5xl font-black text-primary pt-12 ">
            Create A New Group/Activity
          </h1>
        </div>
        <form action="" className=" w-4/5">
          <div className=" flex pt-12 pb-8 w-4/5 mx-auto items-center">
            <label className=" text-xl text-primary font-title w-1/4 ">
              Title
            </label>
            <input
              type="text"
              className="border-2 border-primary w-3/5 rounded-full h-9 px-4"
              placeholder="Enter a title"
            />
          </div>
          <div className="flex pb-8 w-4/5 mx-auto items-center">
            <label className="text-xl text-primary font-title w-1/4">
              Type
            </label>
            <button
              className={`h-9 border-2 border-primary w-1/6 h-7 mr-4 rounded-full p-0 ${
                selectedButton === "group" ? "bg-primary text-white" : ""
              } `}
              onClick={(e) => {
                e.preventDefault();
                setSelectedButton("group");
              }}
            >
              Group
            </button>
            <button
              className={`h-9 border-2 border-primary w-1/6 h-7 mr-4 rounded-full p-0 ${
                selectedButton === "activity" ? "bg-primary text-white" : ""
              } `}
              onClick={(e) => {
                e.preventDefault();
                setSelectedButton("activity");
              }}
            >
              Activity
            </button>
          </div>
          <div className="flex pb-8 w-4/5 mx-auto items-center">
            <label className=" text-xl text-primary font-title w-1/4 ">
              Due Date
            </label>
            <input
              type="date"
              className="border-2 border-primary w-2/5 rounded-full h-9 px-4"
            />
          </div>
          <div className="flex pb-2 w-4/5 mx-auto ">
            <div className="flex flex-col w-1/4 ">
              <label className="text-xl text-primary font-title w-1/4 flex-initial pt-1 ">
                Tags
              </label>
              <span className="text-xs pr-2 text-slate-500 ">
                *To make it easier for others to find your group, we recommand
                adding the course name as a tag
              </span>
            </div>
            <div className="w-3/4">
              <input
                type="text"
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="border-2 border-primary w-2/5 rounded-full h-9 px-4"
                placeholder="Enter a tag"
              />
              <button
                className="h-9 w-1/6 mr-4 rounded-full bg-primary text-white ml-2 p-0 hover:bg-pink-600"
                onClick={addTag}
              >
                Add
              </button>
              {inputError && <div className="text-red-500 text-xs italic">{inputError}</div>}
              <div className="flex flex-wrap pt-2 gap-2 ">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center  flex-row px-2 rounded-full "
                    style={{ backgroundColor: tag.color }}
                  >
                    <span className="rounded-full  text-white">{tag.text}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeTag(index);
                      }}
                      className=" text-black text-m  ml-2 p-0 w-3 h-3 flex justify-center"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className=" flex pb-8 w-4/5 mx-auto items-center">
            <label className=" text-xl text-primary font-title w-1/4">
              Members
            </label>
            <input
              type="number"
              min={0}
              className="border-2 border-primary w-1/5 rounded-full h-9 text-center p-0"
            />
          </div>
          <div className=" flex pb-8 w-4/5 mx-auto">
            <label className="text-xl text-primary font-title w-1/4 ">
              Description
            </label>
            <textarea
              type="text"
              className="border-2 border-primary w-3/5 rounded-2xl h-32 px-3"
              min={0}
             
              placeholder="Write a description of the group/activity"
            />
          </div>
          <div className=" flex pb-12 w-1/2 mx-auto justify-between ">
            <Button className="w-28" style_type="fill" onClick={handleCreate}>
              Create
            </Button>
            <Button className="w-28" style_type="fill" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
          <div></div>
        </form>
      </div>
    </div>
  );
}

export default CreatGroupPage;
