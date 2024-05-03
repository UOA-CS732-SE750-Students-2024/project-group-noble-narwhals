import React, { useEffect, useRef, useState } from "react";
import LongSearchingBar from "../components/LongSearchingBar";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * Search group page
 *
 * To navigate to this page with a default keyword or a group:
 *
 * import { useNavigate } from "react-router-dom";
 * const navigate = useNavigate();
 * const word = "tech";
 * navigate(`/search`, { state: { keywords: word, grouptype: type["group", "activaty"] } });
 */
function SearchPage() {
  const location = useLocation();
  let mykeywords = location.state?.keywords || "";
  let srcGroupType = location.state?.groupType || "group";

  // clear the state in location
  window.history.replaceState({}, document.title);

  // Now there are two tpyes of group. We may extend in the future.
  const groupTypes = [
    { id: 1, name: "group" },
    { id: 2, name: "activity" },
  ];

  // find tab id by group name
  let srcGroupTabId = (
    groupTypes.find((g) => g.name === srcGroupType) || groupTypes[0]
  ).id;

  let fetchedData = useRef([]);

  const [activeTab, setActiveTab] = useState(srcGroupTabId);
  const [displayedGroups, setDisplayedGroups] = useState([]);
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
    const filteredData = fetchedData.current.filter(
      (group) => group.groupType === typeName
    );
    setDisplayedGroups([...filteredData]);
  }

  /**
   * Handler when search btn is clicked
   */
  async function handleSearchBthClick() {
    mykeywords = encodeURIComponent(document.getElementById("Search").value);
    // get data from database
    try {
      await fetch(`${API_BASE_URL}/api/group/search/${mykeywords}`)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error("Fail");
          }
        })
        .then((json) => {
          fetchedData.current = json;
          setDisplayedGroups(
            fetchedData.current.filter(
              (group) =>
                group.groupType ===
                groupTypes.find((t) => t.id == activeTab).name
            )
          );
          // set keywords to highlight
          setKeywordList(splitKeywords(mykeywords));
        });
    } catch (error) {
      return;
    }
  }

  useEffect(() => {
    // default search when page loaded
    handleSearchBthClick();
  }, []);

  return (
    <>
      {/* search box */}
      <div className="w-4/5 mx-auto my-16">
        <LongSearchingBar
          searchBtnClick={handleSearchBthClick}
          value={mykeywords}
        />
      </div>
      <input className="appearance-none" max="99" type="number" />
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
      <div className="border-t-4 border-t-hmblue-700 min-h-96">
        {displayedGroups.length === 0 ? (
          <p className="mt-10 text-xl">
            No groups found, try some other key words. You can separete keywords
            with blank.
          </p>
        ) : (
          ""
        )}
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
  const navigate = useNavigate();
  const pickStatusColor = () => {
    switch (group.groupStatus) {
      case "available":
        return "bg-green-400";
      case "full":
        return "bg-red-400";
      case "closed":
        return "bg-gray-400";
      case "dismissed":
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
    <div
      className="group flex flex-col border-2 border-hmblue-100 m-4 rounded-lg px-4 py-2 cursor-pointer"
      onClick={() => {
        navigate(`/group/${group._id}`);
      }}
    >
      <div className="flex flex-row font-bold">
        <div>
          <span
            className={`${statusColor} inline-block font-thin text-xs text-white p-[2px] w-14 text-center rounded-md mr-1`}
          >
            {group.groupStatus}
          </span>
        </div>
        <div
          className="flex-grow group-hover:underline"
          dangerouslySetInnerHTML={{
            __html: highlightKeywords(group.groupName, keywords),
          }}
        ></div>
        <div className="font-thin text-gray-400 text-sm">
          {`Members: ${group.groupMembers.length}/${group.maxNumber}`}
        </div>
      </div>
      <div className="flex flex-row justify-between space-x-1 text-xs mt-2 relative">
        {/* member numbers */}
        <div>
          {group.groupTags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-full inline-block px-2 py-1 h-auto bg-hmblue-100 text-hmblue-800 border-hmblue-800 border-[1px]"
            >
              {tag.name}
            </span>
          ))}
        </div>
        {/* Avatar */}
        <div className="flex flex-row-reverse -space-x-3 relative pl-3 items-center">
          <div className="w-8 -ml-8"></div>
          {group.groupMembers
            .slice()
            .reverse()
            .map((member, idx) => (
              <div
                key={idx}
                className="group/member items-center text-center hover:z-50 relative"
              >
                <div className="w-8 rounded-full ring-2 ring-white relative bg-white overflow-hidden">
                  <img src={member.avatar} alt={member.name} />
                </div>
                <div className="invisible group-hover/member:visible absolute whitespace-nowrap -bottom-4 text-xs left-1/2 transform -translate-x-1/2 text-white bg-hmblue-700 rounded-md px-1">
                  {member.name}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
