import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import axios from "axios";
import { useAuth } from "../../store/AuthContext";
import { WiStars } from "react-icons/wi";
import { AiOutlineLoading } from "react-icons/ai";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function CreatGroupPage() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const [inputTitle, setInputTitle] = useState("");
  const [selectedButton, setSelectedButton] = useState("");
  const [tags, setTags] = useState([]); // Used to store all tags
  const [inputTag, setInputTag] = useState(""); //Used to store the value of the input box tag
  const [inputError, setInputError] = useState("");
  const [submitError, setSubmitError] = useState(""); // Used to store the error message when submit
  const [inputMemNum, setInputMemNum] = useState("");
  const [inputDueDate, setInputDueDate] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [generateStatus, setGenerateStatus] = useState(false);

  if (window.localStorage.getItem("isLoggedIn") == "false") {
    window.location.href = "/login";
  }

  if (user && !user.isVerification) {
    alert("Please verify your email before creating a group");
    window.location.href = `/user/settings/${user._id}`;
  }

  // Handle title change event
  const handleChangeTitle = (e) => {
    setInputTitle(e.target.value);
  };

  // Handle due date change event
  const handleChangeDueDate = (e) => {
    setInputDueDate(e.target.value);
  };
  // Handle description change event
  const handleChangeDescription = (e) => {
    setInputDescription(e.target.value);
  };
  // Random color generation function
  const randomColor = () => {
    const h = Math.floor(Math.random() * 360);
    const s = 30 + Math.floor(Math.random() * 10);
    const l = 40 + Math.floor(Math.random() * 10);
    return `hsl(${h}, ${s}%, ${l}%)`;
  };
  //Handle tag event
  const addTag = async (e) => {
    e.preventDefault();

    if (tags.length >= 6) {
      setInputError("You can only add up to 6 tags");
      return;
    }
    const trimInput = inputTag.trim().replace(/\s+/g, "-").toLowerCase();
    const tagExists = tags.some((tag) => tag.name.toLowerCase() === trimInput);

    if (tagExists) {
      setInputError("Tag already exists");
      return;
    }

    if (trimInput) {
      //check if tag is already exist in DB
      setTags([...tags, { name: trimInput, color: randomColor() }]);
      setInputTag("");
      setInputError("");
    } else {
      setInputError("Please enter a tag");
    }
  };

  const generateTag = async (e) => {
    e.preventDefault();

    //  ** how to get automate tags from openAI API **
    // get the content of the textarea
    const content = document.getElementsByName("content")[0].value;
    // if the content is not empty, send it to the azure openai api
    if (content !== "") {
      setGenerateStatus(true);
      try {
        axios
          .post(`${API_BASE_URL}/api/autoTagger`, { messages: content })
          .then((res) => {
            const AItags = JSON.parse(res.data[0].message.content).keywords;
            setGenerateStatus(false);
            const newTags = AItags.map((element) => ({
              name: element.toLowerCase(),
              color: randomColor(),
            }));
            setTags([...newTags]);
            setInputError("");
          });
      } catch (error) {
        setInputError("Failed to generate tags");
        setGenerateStatus(false);
        return;
      }
    }
  };

  const handleChangeNum = (e) => {
    const value = e.target.value;
    // Check if value is a number and within range 0-99
    if (
      (!isNaN(value) && parseInt(value) >= 0 && parseInt(value) <= 99) ||
      value == ""
    ) {
      setInputMemNum(parseInt(value));
    }
  };

  // Change event handler of input box of tag
  const handleChangeTag = (e) => {
    setInputTag(e.target.value);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Simple form validation check
    if (
      tags.length === 0 ||
      !inputMemNum ||
      !inputTitle ||
      !selectedButton ||
      !inputDueDate ||
      !inputDescription
    ) {
      setSubmitError("Please fill out all fields");
      return;
    }
    setSubmitError("");
    // Prepare data object to send to server
    const formData = {
      title: inputTitle,
      type: selectedButton,
      dueDate: inputDueDate,
      tags: tags,
      members: inputMemNum,
      description: inputDescription,
    };

    if(groupId){
      await axios
      .patch(`${API_BASE_URL}/api/groups/update/${groupId}`, formData)
      .then((res) => {
        window.location.href = `/group/${res.data._id}`;
      })
      .catch((err) => {
        setSubmitError("Failed to update group");
      });
    }
    else{
    // Use Axios to POST request to server
    await axios
      .post(`${API_BASE_URL}/api/groups/creategroup`, formData)
      .then((res) => {
        window.location.href = `/group/${res.data._id}`;
      })
      .catch((err) => {
        setSubmitError("Failed to create group");
      });
    }
  };

  const handleCancel = async (event) => {
    event.preventDefault();
    window.history.back();
  };

  useEffect(() => {
    if (groupId) {
      axios
        .get(`${API_BASE_URL}/api/group/${groupId}/detail`)
        .then((res) => {
          setInputTitle(res.data.groupName);
          setSelectedButton(res.data.groupType);
          setInputDueDate(res.data.deadlineDate.split("T")[0]);
          setTags(
            res.data.groupTags.map((tag) => ({
              name: tag.name,
              color: randomColor(),
            }))
          );
          setInputMemNum(res.data.maxNumber);
          setInputDescription(res.data.groupDescription);
        })
        .catch((err) => {
          console.error("Error fetching group details", err);
        });
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-createImageHeight">
      <div
        className="bg-cover h-screen absolute inset-0 -z-10 "
        style={{
          backgroundImage: "url('../../../image/creategroup_bg.jpg')",
          filter: "blur(1px)",
        }}
      ></div>

      <div className="bg-white max-w-mainContent w-full lg:w-4/5  relative m-auto flex flex-col items-center ">
        <div>
          <h1 className="text-center text-2xl sm:text-4xl md:text-5xl font-black text-primary pt-12 ">
          {groupId ? "Update " :"Create "}A New Group/Activity
          </h1>
        </div>
        <form action="" className="w:5/6  lg:w-4/5 ">
          <div className=" flex pt-12 pb-8 w-11/12 sm:w-4/5 mx-auto items-center">
            <label className=" text-xl text-primary font-title w-1/4 ">
              Title
            </label>
            <input
              type="text"
              className="border-2 border-primary w-3/5 rounded-full h-9 px-4"
              placeholder="Enter a title"
              value={inputTitle}
              onChange={handleChangeTitle}
              maxLength={60}
            />
          </div>
          <div className="flex pb-8  w-11/12 sm:w-4/5 mx-auto items-center">
            <label className="text-xl text-primary font-title w-1/4">
              Type
            </label>
            <button
              className={`h-9 border-2 border-primary w-1/4 sm:w-1/6 h-7 mr-4 rounded-full p-0 ${
                selectedButton == "group" ? "bg-primary text-white" : ""
              } `}
              onClick={(e) => {
                e.preventDefault();
                setSelectedButton("group");
              }}
            >
              Group
            </button>
            <button
              className={`h-9 border-2 border-primary w-1/4 sm:w-1/6 h-7 mr-4 rounded-full p-0 ${
                selectedButton == "activity" ? "bg-primary text-white" : ""
              } `}
              onClick={(e) => {
                e.preventDefault();
                setSelectedButton("activity");
              }}
            >
              Activity
            </button>
          </div>
          <div className="flex pb-8  w-11/12 sm:w-4/5 mx-auto items-center">
            <label className="text-md sm:text-xl text-primary font-title w-1/4  ">
              Due Date
            </label>
            <input
              min={new Date().toISOString().split("T")[0]}
              type="date"
              className="border-2 border-primary w-3/5 sm:w-2/5 rounded-full h-9 px-4"
              value={inputDueDate}
              onChange={handleChangeDueDate}
            />
          </div>

          <div className="flex pb-8  w-11/12 sm:w-4/5 mx-auto items-center">
            <label className="text-md sm:text-xl text-primary font-title w-1/4">
              Members
            </label>
            <input
              type="number"
              value={inputMemNum}
              name="members"
              min={0}
              max={99}
              onChange={handleChangeNum}
              className="border-2 border-primary w-2/6 sm:w-1/6 rounded-full h-9 text-center p-0 appearance-none "
              placeholder="0"
            />
          </div>
          <div className=" flex pb-6  w-11/12 sm:w-4/5 mx-auto">
            <label className="text-sm sm:text-xl text-primary font-title w-1/4 ">
              Description
            </label>
            <textarea
              type="text"
              name="content"
              className="border-2 border-primary w-4/6 sm:w-3/5 rounded-2xl h-32 px-3"
              min={0}
              placeholder="Write a description of the group/activity"
              value={inputDescription}
              onChange={handleChangeDescription}
            />
          </div>
          <div className="flex pb-2  w-11/12 sm:w-4/5 mx-auto ">
            <div className="flex flex-col w-1/4 ">
              <label className="text-xl text-primary font-title w-1/4 flex-initial pt-1 ">
                Tags
              </label>
              <span className="text-xs pr-2 text-slate-500 ">
                *To make it easier for others to find your group, we recommand
                adding the course name as a tag
              </span>
            </div>
            <div className="w-3/4 ">
              <div className="flex flex-row items-center flex-wrap gap-4">
                <input
                  type="text"
                  value={inputTag}
                  onChange={handleChangeTag}
                  onKeyDown={handleKeyPress}
                  className="border-2 border-primary w-2/5 rounded-full h-9 px-4"
                  placeholder="Enter a tag"
                  maxLength={20}
                />
                <button
                  className="h-9 w-2/6 sm:w-1/6 mr-0 rounded-full bg-primary text-white  p-0 hover:bg-pink-600"
                  onClick={addTag}
                >
                  Add
                </button>
                <button
                  title="Extract tags from Description by OpenAI"
                  className="flex flex-row items-center h-9 px-4 pr-3 rounded-full bg-openai text-white  hover:bg-pink-600"
                  onClick={generateTag}
                >
                  <span>AI Tag</span>
                  <WiStars className="inline-block" />
                  {generateStatus && (
                    <AiOutlineLoading className="ml-1 animate-spin-slow" />
                  )}
                </button>
              </div>
              {inputError && (
                <div className="text-red-500 text-xs italic pl-4">
                  {inputError}
                </div>
              )}
              <div className="flex flex-wrap pt-2 gap-2 ">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex flex-row px-2 rounded-full items-baseline"
                    style={{ backgroundColor: tag.color }}
                  >
                    <span className="rounded-full  text-white">{tag.name}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeTag(index);
                      }}
                      className=" text-white text-m  ml-1 p-0 w-3 h-3 flex justify-center"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-red-500 text-xs italic mx-auto h-3 flex justify-center mb-3">
            {submitError}
          </div>
          <div className=" flex pb-12 w-2/3 sm:w-1/2 mx-auto justify-between gap-4 ">
            <Button className="w-28" style_type="fill" onClick={handleSubmit}>
              {groupId ? "Update" :"Create"}
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
