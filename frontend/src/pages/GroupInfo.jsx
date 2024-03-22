import React from "react";
import { Link } from "react-router-dom";

function GroupInfo() {
  return (
    <div className="group-info-container max-w-4xl mx-auto mt-10">
      <NavBar />
      <ActivityDetail />
      <MemberList />
      <ApplicantList />
      <Description />
    </div>
  );
}

function NavBar() {
  return (
    <nav className="nav-bar bg-blue-500 text-white p-4 rounded shadow">
      <Link to="/" className="text-lg font-semibold">Home</Link>
    </nav>
  );
}

function ActivityDetail() {
  return (
    <div className="activity-detail bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Let us go fishing</h2>
      <p className="mb-2">Date: 2024-03-30</p>
      <p className="mb-2">5 people wanted</p>
      <p className="mb-4">Activities: fishing, BBQ</p>
      <div className="actions flex space-x-4">
        <button className="join-btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Join</button>
        <button className="edit-btn bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition">Edit</button>
      </div>
    </div>
  );
}

function MemberList() {
  return (
    <div className="member-list bg-white p-6 rounded shadow mt-6">
      <h3 className="font-semibold mb-4">Members 3/5</h3>
      <ul className="list-none">
        <li className="mb-2">username (host)</li>
        <li className="mb-2 flex justify-between items-center">username <button className="remove-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition">X</button></li>
        <li className="flex justify-between items-center">username <button className="remove-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition">X</button></li>
      </ul>
    </div>
  );
}

function ApplicantList() {
  return (
    <div className="applicant-list bg-white p-6 rounded shadow mt-6">
      <h3 className="font-semibold mb-4">Applicants 35</h3>
      <ul className="list-none">
        <li className="flex justify-between items-center mb-2">username <span><button className="allow-btn bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-700 transition">Allow</button><button className="reject-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition">Reject</button></span></li>
        {/* 其他申请者 */}
      </ul>
    </div>
  );
}

function Description() {
  return (
    <div className="description bg-white p-6 rounded shadow mt-6">
      <p>Here is a detailed description of the event...</p>
    </div>
  );
}

export default GroupInfo;
