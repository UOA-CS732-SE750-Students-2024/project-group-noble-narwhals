import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';


dayjs.extend(relativeTime);

export default function UserGroupBar({ group }) {
  const navigate = useNavigate();
  console.log("enter userGroupBar, group: ", group);

  const pickStatusColor = () => {
    switch (group.groupStatus) {
      case "available":
        return "bg-green-400";
      case "full":
        return "bg-red-400";
      case "closed":
        return "bg-gray-400";
    }
  };
  const statusColor = pickStatusColor();

  const calculateTimeLeft = () => {
    // use dayjs to calculate the time left
    const deadline = dayjs(group.deadlineDate);
    const now = dayjs();

    if (deadline.isBefore(now)) {
      return 'Expired';
    } else {
      return deadline.from(now);
    }
  };

  const timeLeft = calculateTimeLeft();

  const handleGroupClick = () => {
    navigate(`/group/${group._id}`);
  };

  return (
    <>
      <div className="w-[90%] flex flex-col border-2 border-hmblue-100 m-1 rounded-lg px-4 py-2 cursor-pointer
       hover:border-hmblue-300 hover:shadow-md transition duration-300 ease-in-out"
        onClick={handleGroupClick}>
        <div className="flex flex-row gap-2 items-center">
          <div className="flex flex-col w-1/2 flex-grow">
            <div id="statusAndTitle" className="flex flex-row items-center">
              <div
                className={`${statusColor} flex items-center justify-center font-thin text-xs text-white p-[2px] w-14 text-center rounded-md mr-1`}
              >
                {group.groupStatus}
              </div>

              <div className="font-bold ml-1 flex-wrap truncate">{group.groupName}</div>
            </div>

            <div className="flex flex-wrap gap-1 justify-start space-x-1 text-xs mt-2 overflow-hidden">
              {group.groupTags && group.groupTags.map((tag) => (
                <span
                  key={tag._id}
                  className="truncate rounded-full px-2 py-1 h-auto bg-hmblue-100
                   text-hmblue-800 border-hmblue-800 border-[1px]
                   whitespace-nowrap overflow-hidden"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          {" "}
          {/* Flex container for Owner */}
          <div className="w-1/2 max-w-full">
       
              <div className="max-w-full flex flex-row justify-center items-center gap-3">
                <span>
                  <img className="w-8 h-8 rounded-full"
                    src={group.ownerId.avatar} />
                </span>
                <span className="text-gray-400 flex-wrap ">{group.ownerId.name}</span>
                {/* </div>



          <div className="flex flex-col items-center font-thin text-gray-400 text-sm gap-4"> Flex container for Members */}
                <span className='text-gray-400'>{`[${group.groupMembers.length}/${group.maxNumber}]`}</span>
                <div className="flex flex-col items-center">
                  {" "}
                  {/* Flex container for Deadline */}
                  <span className='text-gray-400'>{timeLeft}</span>
                </div>
              </div>
         
          </div>
        </div>
      </div>
    </>
  );
}
