import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MdPeople } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { IoPricetag } from "react-icons/io5";
import Logo from "../assets/logo-no-bg.png";
import Button from "../components/Button";
import { TiDelete } from "react-icons/ti";

function GroupInfo() {
  return (
    <>
      <Navbar />
      <div className="max-w-main_content mx-auto mt-10">
        <div className="header-content flex justify-between items-start mb-4">
          <div className="header-title space-y-2">
            <div className="text-4xl font-bold mb-2">Let us go fishing</div>
            <Link to="/activity" className="text-primary">Activity</Link>
          </div>
          <div className="actions flex flex-col space-y-2">
            <Button className="py-3 px-16" style_type="fill">Join</Button>
            <Button className="py-3 px-16" style_type="border">Edit</Button>
          </div>
        </div>

        <div className="content">
          <ActivityDetail />
          <MemberList />
          <ApplicantList />
          <Description />
          <Footer />
        </div>
      </div>
    </>
  );
}


function ActivityDetail() {
  return (
    <div className="activity-detail  p-6   mt-6">

      <p className="mb-2 mb-2 flex items-center text-1xl">
        <IoMdTime className="inline mr-2" style={{ fontSize: '24px' }} />
        <span>2024-03-30</span>
      </p>
      <p className="mb-2 mb-2 flex items-center text-1xl">
        <MdPeople className="inline mr-2" style={{ fontSize: '24px' }} />
        <span>5 people wanted</span>
      </p>

      <p className="mb-2 mb-2 flex items-center text-1xl">
        <IoPricetag className="inline mr-2" style={{ fontSize: '24px' }} />
        <span>fishing, BBQ</span>
      </p>
      <p className="mb-2 text-sm text-gray-500">Posted 1d ago</p>


    </div>
  );
}
function Member({ username, role, avatarColor }) {
  return (
    <li className="mb-2 flex items-center justify-between">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full ${avatarColor} mr-2`}></div>
        <span>{username}</span>
        {role && (
          <span className="bg-gray-200 text-gray-800 rounded-full px-2 ml-2 text-xs">{role}</span>
        )}
      </div>
      <button className="remove-btn text-black px-2  py-1 rounded hover:bg-red-400 transition">
        <TiDelete size={24}/>
      </button>
    </li>
  );
}
function MemberList() {
  const members = [
    { username: "username1", role: "Host", avatarColor: "bg-yellow-400" },
    { username: "username2", avatarColor: "bg-pink-600" },
    { username: "username3", avatarColor: "bg-blue-400" },
  ];

  return (
    <div className="member-list p-6 mt-6">
      <h3 className="font-semibold mb-4">
        <span>Members</span>
        <span className="ml-2 text-gray-500">3/5</span>
      </h3>
      <ul className="list-none">
        {members.map((member, index) => (
          <Member key={index} {...member} />
        ))}
      </ul>
    </div>
  );
}
function Applicant({ username, message, avatarColor }) {
  return (
    <li className="py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-2">
          <div className={`w-8 h-8 rounded-full ${avatarColor}`}></div>
          <div>
            <div className="text-base font-medium">{username}</div>
            <div className="text-sm text-gray-600">{message}</div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button className="mr-2" style_type="fill">Allow</Button>
          <Button style_type="border">Reject</Button>
        </div>
      </div>
    </li>
  );
}
function ApplicantList() {
  const applicants = [
    { username: "username1", message: "Message 1", avatarColor: "bg-blue-800" },
    { username: "username2", message: "Message 2", avatarColor: "bg-red-400" },
    { username: "username3", message: "Message 3", avatarColor: "bg-blue-200" },
    { username: "username4", message: "Message 4", avatarColor: "bg-yellow-400" },
    { username: "username5", message: "Message 5", avatarColor: "bg-green-400" },
    { username: "username6", message: "Message 6", avatarColor: "bg-pink-600"},
    { username: "username7", message: "Message 7", avatarColor: "bg-blue-400"},
    { username: "username8", message: "Message 8", avatarColor: "bg-yellow-400"},
    { username: "username9", message: "Message 9", avatarColor: "bg-green-400"}
  ];

  return (
    <div className="applicant-list p-6 mt-6 mt-6 max-h-[500px] overflow-y-auto">
      <h3 className="font-semibold mb-4">
        Applicants <span className="text-gray-500">35</span>
      </h3>
      <ul className="divide-y divide-black">
        {applicants.map((applicant, index) => (
          <Applicant key={index} {...applicant} />
        ))}
      </ul>
    </div>
  );
}





function Description() {
  return (
    <>
      <div className="description p-6 mt-6">
        <h3 className="font-bold text-3xl mb-4"> Description</h3>
        <p>My client is a large multinational business with head offices in Europe, whom have enjoyed a strong presence in the NZ market place for the last 60 years. The business has over 500 staff in three core business units with 7 sites around the country. The business operates in the manufacturing and distribution industry and continues to see growth year on year. They have offices in South and West Auckland so this role could suit someone in either area.</p>
      </div>
    </>
  );
}

function Footer() {
  return (
    <div className="bg-primary text-white p-4 rounded-b shadow flex">
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="h-12 mr-3" />
        <div>
          <p className="font-bold text-lg">Hey Mate</p>
          <p className="text-sm">Uplift your mind</p>
          <p className="text-sm">strengthen your circle</p>
        </div>
      </div>
    </div>
  );
}




export default GroupInfo;
