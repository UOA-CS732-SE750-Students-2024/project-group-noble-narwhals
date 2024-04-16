import React, { useState } from "react";
import Button from "../components/Button";
import LongSearchingBar from "../components/LongSearchingBar";

/**
 * Search group page
 * @param {*} keywords if navigate form other page with a keyword
 */
function SearchPage({ keywords }) {
  // TODO: fetch data by keywords
  // for test
  let mykeywords = "CS 732";

  // Now there are two tpyes of group. We may extend in the future.
  const groupTypes = [
    { id: 1, name: "Course" },
    { id: 2, name: "Activity" },
  ];

  const fetchedData = DummyGroups;

  const [activeTab, setActiveTab] = useState(groupTypes[0].id);
  const [displayedGroups, setDisplayedGroups] = useState(
    fetchedData.filter((group) => group.type === "Course")
  );
  const [keywordList, setKeywordList] = useState(splitKeywords(mykeywords));

  /**
   * Split search content to keyword list by space.
   */
  function splitKeywords(str) {
    // Replace multiple Spaces with one and trim
    const newstr = str.replace(/\s+/g, " ").trim();
    return newstr.split(" ");
  }

  /**
   * Handler when tab is clicked.
   * - Set the tab active
   * - Show group list under this type
   */
  function handleTabBtnClick(tabId, typeName) {
    setActiveTab(tabId);

    const filteredData = fetchedData.filter((group) => group.type === typeName);
    setDisplayedGroups([...filteredData]);
  }

  function handleSearchBthClick() {
    //TODO: get data from database
    // !!! Dummy Data!!!

    //TODO: render result list
    setActiveTab(groupTypes[0].id);
    mykeywords = document.getElementById("Search").value;
    setDisplayedGroups(fetchedData.filter((group) => group.type === "Course"));
    setKeywordList(splitKeywords(mykeywords));
  }

  return (
    <>
      {/* search box */}
      <div className="w-4/5 mx-auto my-16">
        <LongSearchingBar />
      </div>

      {/* tab control */}
      <div className="mt-5 flex space-x-5">
        {groupTypes.map((type) => (
          <TabButton
            key={type.id}
            tabId={type.id}
            typeName={type.name}
            activeTab={activeTab}
            handleTabBtnClick={handleTabBtnClick}
          >
            {type.name}
          </TabButton>
        ))}
      </div>
      {/* search result list */}
      <div className="border-t-4 border-t-hmblue-700">
        {displayedGroups.map((group, idx) => (
          <SingleSearchedGroup key={idx} group={group} keywords={keywordList} />
        ))}
      </div>
    </>
  );
}
export default SearchPage;

/**
 * Tab control button, used for switch type of group in search page
 * */
function TabButton({
  children,
  tabId,
  typeName,
  activeTab,
  handleTabBtnClick,
}) {
  return (
    <button
      className={
        (tabId === activeTab
          ? "bg-hmblue-700 text-white"
          : "bg-hmblue-100 text-black") +
        " w-40 font-bold rounded-b-none rounded-t-lg"
      }
      onClick={() => {
        handleTabBtnClick(tabId, typeName);
      }}
    >
      {children}
    </button>
  );
}

/**
 * Single item of search result
 */
function SingleSearchedGroup({ group, keywords }) {
  const pickStatusColor = () => {
    switch (group.status) {
      case "Available":
        return "bg-green-400";
      case "Full":
        return "bg-red-400";
      case "Closed":
        return "bg-gray-400";
    }
  };
  const statusColor = pickStatusColor();

  function highlightKeywords(text, kwords) {
    const regstr = kwords.join("|");
    const regex = new RegExp(`(${regstr})`, "gi");
    return text.replace(
      regex,
      '<span style="background-color: yellow">$1</span>'
    );
  }

  return (
    <div className="flex flex-col border-2 border-hmblue-100 m-4 rounded-lg px-4 py-2">
      <div className="flex font-bold">
        <div>
          <span
            className={`${statusColor} inline-block font-thin text-xs text-white p-[2px] w-14 text-center rounded-md mr-1`}
          >
            {group.status}
          </span>
        </div>
        <div
          className="flex-grow"
          dangerouslySetInnerHTML={{
            __html: highlightKeywords(group.title, keywords),
          }}
        ></div>
        <div className="font-thin text-gray-400 text-sm">
          {`Members: ${group.currentMember}/${group.maxMember}`}
        </div>
      </div>
      <div className="flex justify-start space-x-1 text-xs mt-2 overflow-hidden">
        {group.tags.map((tag, idx) => (
          <span
            key={idx}
            className="rounded-full px-2 py-1 h-auto bg-hmblue-100 text-hmblue-800 border-hmblue-800 border-[1px]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// Dummy data
const DummyGroups = [
  {
    type: "Course",
    status: "Available",
    maxMember: 6,
    minMember: 5,
    currentMember: 4,
    title: "Hey, CS732 need members here!",
    content: "We already have a project topic, we still need a tester",
    tags: ["React", "MongoDB", "COMPSCI732"],
  },
  {
    type: "Activity",
    status: "Full",
    maxMember: 6,
    minMember: 6,
    currentMember: 6,
    title: "Hiking Trip",
    content:
      "Join us for a fun hiking trip to Mount XYZ. All skill levels welcome!",
    tags: ["Outdoor", "Hiking", "Nature"],
  },
  {
    type: "Course",
    status: "Closed",
    maxMember: 10,
    minMember: 8,
    currentMember: 9,
    title: "Introduction to Python Programming",
    content:
      "Learn Python programming language from scratch. No prior experience required.",
    tags: ["Python", "Programming", "COMPSCI732"],
  },
  {
    type: "Activity",
    status: "Available",
    maxMember: 10,
    minMember: 8,
    currentMember: 9,
    title: "Board Game Night",
    content: "Join us for a night of fun board games and friendly competition.",
    tags: ["Board Games", "Social", "Fun"],
  },
  {
    type: "Course",
    status: "Full",
    maxMember: 8,
    minMember: 6,
    currentMember: 8,
    title: "Advanced JavaScript Workshop",
    content:
      "Take your JavaScript skills to the next level with this advanced workshop.",
    tags: ["JavaScript", "Advanced", "Workshop"],
  },
  {
    type: "Activity",
    status: "Closed",
    maxMember: 8,
    minMember: 8,
    currentMember: 4,
    title: "Cooking Class",
    content:
      "Learn to cook delicious meals from expert chefs. Limited spots available.",
    tags: ["Cooking", "Class", "Food"],
  },
  {
    type: "Course",
    status: "Available",
    maxMember: 15,
    minMember: 10,
    currentMember: 7,
    title: "Data Science Bootcamp",
    content:
      "Join our comprehensive data science bootcamp and kickstart your career.",
    tags: ["DataScience", "Bootcamp", "Career"],
  },
  {
    type: "Activity",
    status: "Full",
    maxMember: 15,
    minMember: 15,
    currentMember: 15,
    title: "Yoga Session",
    content: "Relax your mind and body with our yoga session. Mats provided.",
    tags: ["Yoga", "Relaxation", "Health"],
  },
  {
    type: "Course",
    status: "Closed",
    maxMember: 20,
    minMember: 15,
    currentMember: 20,
    title: "Artificial Intelligence Masterclass",
    content:
      "Explore the latest advancements in AI technology in this masterclass.",
    tags: ["AI", "Masterclass", "Technology"],
  },
  {
    type: "Activity",
    status: "Available",
    maxMember: 20,
    minMember: 15,
    currentMember: 15,
    title: "Photography Workshop",
    content:
      "Learn photography techniques from professional photographers. Bring your camera!",
    tags: ["Photography", "Workshop", "Skills"],
  },
];
