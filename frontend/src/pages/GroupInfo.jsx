import React from "react";
import Navbar from "../components/Navbar";
import { MdPeople } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { IoPricetag } from "react-icons/io5";
import ActivityDetail from "../components/ActivityDetail";
import Member from "../components/Member";
import Applicant from "../components/Applicant";
import Description from "../components/Description";
import HeaderContent from "../components/HeaderContent";
import Footer from "../components/Footer";

function GroupInfo() {

  const activityDetails = [
    { icon: IoMdTime, text: "2024-03-30" },
    { icon: MdPeople, text: "5 people wanted" },
    { icon: IoPricetag, text: "fishing, BBQ" },
  ];
  return (
    <>
      <Navbar />
      <div className="content">
        <HeaderContent />
        <ActivityDetail details={activityDetails} />
        <Description />
        <MemberList />
        <ApplicantList />
      </div>
      <Footer />

    </>
  );
}


function MemberList() {
  const members = [
    { username: "username1", role: "Host", avatar: "bg-yellow-400" },
    { username: "username2", avatar: "bg-pink-600" },
    { username: "username3", avatar: "bg-blue-400" },
    { username: "username4", avatar: "bg-yellow-400" }
  ];

  return (
    <div className="member-list p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-2xl">
          Members
          <span className="ml-2 text-gray-500">{members.length}/5</span>
        </h3>

      </div>
      <div className="flex space-x-4 overflow-x-auto">
        {members.map((member, index) => (
          <Member key={index} {...member} />
        ))}
      </div>
    </div>
  );
}

function ApplicantList() {
  const applicants = [
    { username: "username1", message: "Hi! my name is Chris, I love fishing and BBQ", avatar: "bg-blue-800" },
    { username: "username2", message: " Hi! my name is Chris, I love fishing and BBQHi! my name is Chris, I love fishing and BBQHi! my name is Chris, I love fishing and BBQHi! my name is Chris, I love fishing and BBQHi! my name is Chris, I love fishing and BBQHi! my name is Chris, I love fishing and BBQHi! my name is Chris, I love fishing and BBQdsaijosda", avatar: "bg-red-400" },
    { username: "username3", message: "Message Message Message Message Message Message Message Message Message MessageMessage Message Message Message Message Message Message Message MessageMessage Message Message Message Message Message Message Message Message Message Message Message Message Message Message Message Message Message MessageMessage Message Message Message Message Message3", avatar: "bg-blue-200" },
    { username: "username4", message: "null", avatar: "bg-yellow-400" },
    { username: "username5", message: "Message 5", avatar: "bg-green-400" },
    { username: "username6", message: "Message 6", avatar: "bg-pink-600" },
    { username: "username7", message: "Message 7", avatar: "bg-blue-400" },
    { username: "username8", message: "Message 8", avatar: "bg-yellow-400" },
    { username: "username9", message: "Message 9", avatar: "bg-green-400" },
    { username: "username10", message: "Message 10", avatar: "bg-blue-800" },
    { username: "username11", message: "Message 11", avatar: "bg-red-400" },
    { username: "username12", message: "Message 12", avatar: "bg-blue-200" },
    { username: "username13", message: "Message 13", avatar: "bg-yellow-400" },
    { username: "username14", message: "Message 14", avatar: "bg-green-400" },
    { username: "username15", message: "Message 15", avatar: "bg-pink-600" },
    { username: "username16", message: "Message 16", avatar: "bg-blue-400" },
    { username: "username17", message: "Message 17", avatar: "bg-yellow-400" },
    { username: "username18", message: "Message 18", avatar: "bg-green-400" },
    { username: "username19", message: "Message 19", avatar: "bg-blue-800" },
    { username: "username20", message: "Message 20", avatar: "bg-red-400" }
  ];

  return (
    <div className="applicant-list p-6 mt-6">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white"> {/* 使标题和人数固定 */}
        <h3 className="font-semibold text-2xl">Applicants
          <span className="ml-2 text-gray-500">{applicants.length}</span>
        </h3>

      </div>
      <div className="flex overflow-x-auto">
        {applicants.map((applicant, index) => (
          <div key={index} className="first:ml-0 ">
            <Applicant {...applicant} />
          </div>
        ))}
      </div>
    </div>
  );
}





export default GroupInfo;
