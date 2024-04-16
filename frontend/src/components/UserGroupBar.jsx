export default function UserGroupBar({ group }) {

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

  return (
    <>
      <div className="flex flex-col border-2 border-hmblue-100 m-1 rounded-lg px-4 py-2">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col w-1/3 min-w-0">
            <div id="statusAndTitle" className="flex flex-row items-center">
              <div className={`${statusColor} flex items-center justify-center font-thin text-xs text-white p-[2px] w-14 text-center rounded-md mr-1`}
              >
                {group.status}
              </div>

              <div className="font-bold ml-1 truncate">{group.title}</div>
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

          <div className="flex flex-row items-center gap-2 "> {/* Flex container for Owner */}
            <span ><img className="w-8 h-8 rounded-full" src={group.avatar} /></span>
            <span className="text-gray-400">{`${group.owner}`}</span>
          </div>



          <div className="flex flex-col items-center font-thin text-gray-400 text-sm gap-4"> {/* Flex container for Members */}
            <span>{`${group.currentMember}/[${group.minMember}-${group.maxMember}]`}</span>
            <div className="flex flex-col items-center"> {/* Flex container for Deadline */}
              <span>{`${group.deadlineDate}`}</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
