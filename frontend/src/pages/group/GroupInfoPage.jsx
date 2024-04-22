import React, { useState, useEffect } from "react";
import { MdPeople } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { IoPricetag } from "react-icons/io5";
import Member from "../../components/Member";
import Applicant from "../../components/Applicant";
import Description from "../../components/Description";
import HeaderContent from "../../components/HeaderContent";
import axios from "axios";
import { useParams } from 'react-router-dom';

function GroupInfoPage() {
  const { groupId } = useParams();
  const [groupDetails, setGroupDetails] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/groups/${groupId}`);
        const data = response.data || {};
        const tagsText = data.groupTags ? data.groupTags.map(tag => tag.name).join(', ') : 'No tags';
        const ownerId = data.ownerId ? data.ownerId._id : null; 
        let members = data.groupMembers || [];
        if (ownerId && !members.some(member => member._id === ownerId)) {
          members.unshift({
              _id: ownerId,
              name: data.ownerId.name,
              avatar: data.ownerId.avatar
          });

      }
                const activityDetails = [
          { icon: <IoMdTime />, text: new Date(data.deadlineDate).toLocaleDateString() },
          { icon: <MdPeople />, text: `${data.numberOfGroupMember} people wanted` },
          { icon: <IoPricetag />, text: tagsText }
        ];

        setGroupDetails({ ...data, activityDetails,ownerId });
      } catch (error) {
        console.error('Error fetching group details', error);
        setGroupDetails(null);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

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
      />
      <Description description={groupDetails.groupDescription} />
      <MemberList members={groupDetails.groupMembers || []} ownerId={groupDetails.ownerId} />

      <ApplicantList applicants={groupDetails.groupApplicants || []} />
    </div>
  );
}

function MemberList({ members = [],ownerId}) {
  console.log("Passed Owner ID:", ownerId); 
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
            role={member._id === ownerId ? 'Host' : 'Member'}
            ownerId={ownerId}
            memberId={member._id}

          />
          
        ))}
        
      </div>
      
    </div>
    
  );
}

function ApplicantList({ applicants = [] }) {
  return (
    <div className="applicant-list p-6 mt-6">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white">
        <h3 className="font-semibold text-2xl">Applicants<span className="ml-2 text-gray-500">{applicants.length}</span></h3>
      </div>
      <div className="flex overflow-x-auto">
        {applicants.map((applicant, index) => (
          <Applicant key={index} username={applicant.name} message={applicant.message} avatar={applicant.avatar} />
        ))}
      </div>
    </div>
  );
}

export default GroupInfoPage;
