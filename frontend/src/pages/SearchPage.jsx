import React, { useEffect, useRef, useState } from "react";
import LongSearchingBar from "../components/LongSearchingBar";
import { useLocation } from "react-router-dom";
import SingleSearchedGroup from "../components/SingleSearchedGroup";

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
      (group) =>
        group.groupType === typeName &&
        !["closed", "dismissed"].includes(group.groupStatus)
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
                  groupTypes.find((t) => t.id == activeTab).name &&
                !["closed", "dismissed"].includes(group.groupStatus)
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
      <div className="sticky top-navHeight border-b-4 border-b-hmblue-700 bg-white pt-1 z-10">
        {/* search box */}
        <div className="w-4/5 mx-auto my-4 md:my-16">
          <LongSearchingBar
            searchBtnClick={handleSearchBthClick}
            value={mykeywords}
          />
        </div>
        {/* <input className="appearance-none" max="99" type="number" /> */}
        {/* tab control */}
        <div className="flex space-x-5">
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
      </div>
      {/* search result list */}
      <div className="min-h-96">
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
