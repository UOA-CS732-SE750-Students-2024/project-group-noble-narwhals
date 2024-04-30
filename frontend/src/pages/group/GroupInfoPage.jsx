import React, { useState, useEffect } from "react";
import { MdPeople } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { IoPricetag } from "react-icons/io5";
import Member from "../../components/Member";
import Applicant from "../../components/Applicant";
import Description from "../../components/Description";
import HeaderContent from "../../components/HeaderContent";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";


function GroupInfoPage() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { groupId } = useParams();
  const [groupDetails, setGroupDetails] = useState(null);
  const [applications, setApplications] = useState([]);
  const { user } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {


        const response = await axios.get(`${apiBaseUrl}/api/groups/${groupId}/detail`);

        const data = response.data || {};
        const tagsText = data.groupTags
          ? data.groupTags.map((tag) => tag.name).join(", ")
          : "No tags";
        const ownerId = data.ownerId ? data.ownerId._id : null;

        const isCurrentUserHost = user && user._id === ownerId;

        let members = data.groupMembers || [];
        if (ownerId && !members.some((member) => member._id === ownerId)) {
          members.unshift({
            _id: ownerId,
            name: data.ownerId.name,
            avatar: data.ownerId.avatar,
          });
        }
        if (data.application) {
          setApplications(data.application);
        }

        const activityDetails = [

          { icon: <IoMdTime />, text: new Date(data.deadlineDate).toLocaleDateString() },
          { icon: <MdPeople />, text: `${data.maxNumber} people wanted` },
          { icon: <IoPricetag />, text: tagsText }

        ];

        setGroupDetails({
          ...data,
          activityDetails,
          ownerId,
          isCurrentUserHost,
        });
      } catch (error) {
        console.error("Error fetching group details", error);
        setGroupDetails(null);
      }
    };

    fetchGroupDetails();
  }, [groupId, user]);

  const handleApplicationUpdate = (applicationId, status) => {
    setApplications((prevApplications) =>
      prevApplications.filter((app) => app._id !== applicationId)
    );
  };

  if (!groupDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <HeaderContent
        groupName={groupDetails.groupName}
        groupTags={groupDetails.tagsText}
        postedDate={new Date(groupDetails.createDate).toLocaleDateString()}
        activityDetails={groupDetails.activityDetails}
        isHost={groupDetails.isCurrentUserHost}
        groupId={groupId}
        groupMembers={groupDetails.groupMembers}
        deadlineDate={groupDetails.deadlineDate}
        groupStatus={groupDetails.groupStatus}
      />
      <Description description={groupDetails.groupDescription} />
      <MemberList
        members={groupDetails.groupMembers || []}
        ownerId={groupDetails.ownerId}
        isCurrentUserHost={groupDetails.isCurrentUserHost}
        groupId={groupId}
      />
      <ApplicantList
        applications={groupDetails.application || []}
        isCurrentUserHost={groupDetails.isCurrentUserHost}
        groupId={groupId}
        onApplicationHandled={handleApplicationUpdate}
      />
    </div>
  );
}

function MemberList({ members, ownerId, isCurrentUserHost, groupId }) {
  return (
    <div className="member-list p-6 mt-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-2xl">
          Members<span className="ml-2 text-gray-500">{members.length}</span>
        </h3>
      </div>
      <div className="flex justify space-x-2 overflow-x-auto">
        {members.map((member) => (
          <Member
            key={member._id}
            username={member.name}
            avatar={member.avatar}
            role={member._id === ownerId ? "Host" : "Member"}
            ownerId={ownerId}
            memberId={member._id}
            isCurrentUserHost={isCurrentUserHost}
            groupId={groupId}
          />
        ))}
      </div>
    </div>
  );
}

function ApplicantList({
  applications,
  isCurrentUserHost,
  onApplicationHandled,
  groupId,
}) {
  return (
    <div className="applicant-list p-6 mt-6">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white">
        <h3 className="font-semibold text-2xl">
          Applicants
          <span className="ml-2 text-gray-500">{applications.length}</span>
        </h3>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {applications.map((application) => (
          <Applicant
            key={application._id}
            username={application.applicantId.name}
            message={application.message}
            avatar={application.applicantId.avatar}
            userId={application.applicantId._id}
            isHost={isCurrentUserHost}
            applicationId={application._id}
            groupId={groupId}
            onApplicationHandled={onApplicationHandled}
          />
        ))}
      </div>
    </div>
  );
}

export default GroupInfoPage;
