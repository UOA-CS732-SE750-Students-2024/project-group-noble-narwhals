import { useNavigate } from "react-router-dom";

/**
 * Single item of search result
 */
function SingleSearchedGroup({ group, keywords = "" }) {
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
    if (kwords != "") {
      const regstr = kwords.join("|");
      const regex = new RegExp(`(${regstr})`, "gi");
      return text.replace(
        regex,
        '<span style="background-color: yellow">$1</span>'
      );
    } else {
      return text;
    }
  }

  return (
    <div
      className="group flex flex-col border-2 border-hmblue-100 hover:border-hmblue-300 hover:shadow-md m-4 rounded-lg px-4 py-2 cursor-pointer"
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
      <div className="flex flex-row justify-between text-xs mt-2 relative">
        {/* member numbers */}
        <div className="space-x-1">
          {group.groupTags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-full inline-block px-2 py-[2px] bg-hmblue-100 text-hmblue-800 border-hmblue-800 border-[1px]"
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

export default SingleSearchedGroup;
