import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MdPeople } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { IoPricetag } from "react-icons/io5";
import Logo from "../assets/logo-no-bg.png";

function GroupInfo() {
  return (
    <>
      <Navbar />
      <div className="group-info-container max-w-4xl mx-auto mt-10">
        <div className="header-content flex justify-between items-start mb-4">
          <div className="header-title space-y-2">
            <div className="text-4xl font-bold mb-2">Let us go fishing</div>
            <Link to="/activity" className="text-primary">Activity</Link>
          </div>
          <div className="actions flex flex-col space-y-2">
            <button className="join-btn bg-primary text-white border-2 border-primary hover:bg-pink-600 hover:text-primary py-3 px-16">Join</button>
            <button className="edit-btn border-2 border-primary text-primary hover:bg-primary hover:text-white py-3 px-16">Edit</button>
          </div>
        </div>


        <div className="content">
          <ActivityDetail />
          <MemberList />
          <ApplicantList />
          <Description />
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

function MemberList() {
  return (
    <div className="member-list p-6 mt-6">
      <h3 className="font-semibold  mb-4">
        <span>Members</span>
        <span className=" ml-2 text-gray-500">3/5</span>
      </h3>
      <ul className="list-none">
        <li className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-yellow-400 mr-2"></div>
            <span>username</span>
            <span className="bg-gray-200 text-gray-800 rounded-full px-2 ml-2 text-xs">Host</span>
          </div>
        </li>
        <li className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-pink-600 mr-2"></div>
            <span>username</span>
          </div>

          <button className="remove-btn text-black px-2 py-1 rounded hover:bg-red-700 transition">X</button>

        </li> <li className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-400 mr-2"></div>
            <span>username</span>
          </div>

          <button className="remove-btn text-black px-2 py-1 rounded hover:bg-red-700 transition">X</button>

        </li>
      </ul>
    </div>
  );

}


function ApplicantList() {
  return (
    <div className="applicant-list p-6 mt-6">
      <h3 className="font-semibold mb-4">
        Applicants <span className="text-gray-500">35</span>
      </h3>
      <ul className="divide-y divide-black">
        {/* Repeat for each applicant */}
        <li className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-800"></div>
              <div>
                <div className="text-base font-medium">username</div>
                <div className="text-sm text-gray-600">Message</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="allow-btn bg-primary text-white border-2 border-primary hover:bg-pink-600 hover:text-primary mr-2 ">
                Allow
              </button><button className="reject-btn border-2 border-primary text-primary hover:bg-primary hover:text-white ">
                Reject</button>
            </div>
          </div>
        </li>

        <li className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-red-400"></div>
              <div>
                <div className="text-base font-medium">username</div>
                <div className="text-sm text-gray-600">Message</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="allow-btn bg-primary text-white border-2 border-primary hover:bg-pink-600 hover:text-primary mr-2 ">
                Allow
              </button><button className="reject-btn border-2 border-primary text-primary hover:bg-primary hover:text-white ">
                Reject</button>
            </div>
          </div>
        </li>

        <li className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-200"></div>
              <div>
                <div className="text-base font-medium">username</div>
                <div className="text-sm text-gray-600">Message</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="allow-btn bg-primary text-white border-2 border-primary hover:bg-pink-600 hover:text-primary mr-2 ">
                Allow
              </button><button className="reject-btn border-2 border-primary text-primary hover:bg-primary hover:text-white ">
                Reject</button>
            </div>
          </div>
        </li>

        <li className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-400"></div>
              <div>
                <div className="text-base font-medium">username</div>
                <div className="text-sm text-gray-600">Message</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="allow-btn bg-primary text-white border-2 border-primary hover:bg-pink-600 hover:text-primary mr-2 ">
                Allow
              </button><button className="reject-btn border-2 border-primary text-primary hover:bg-primary hover:text-white ">
                Reject</button>
            </div>
          </div>
        </li>

        <li className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-orange-400"></div>
              <div>
                <div className="text-base font-medium">username</div>
                <div className="text-sm text-gray-600">Message</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="allow-btn bg-primary text-white border-2 border-primary hover:bg-pink-600 hover:text-primary mr-2 ">
                Allow
              </button><button className="reject-btn border-2 border-primary text-primary hover:bg-primary hover:text-white ">
                Reject</button>
            </div>
          </div>
        </li>
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
      <div className="footer bg-primary text-white p-4 rounded-b shadow flex">
        <img src={Logo} alt="Logo" className="h-12 mr-3" />
        <div>
          <div className="flex items-center mb-1">
            <p className="font-bold text-lg">Hey Mate</p>
          </div>
          <div>
            <p className="text-sm">Uplift your mind</p>
            <p className="text-sm">strengthen your circle</p>
          </div>
        </div>
      </div>



    </>

  );


}

export default GroupInfo;
