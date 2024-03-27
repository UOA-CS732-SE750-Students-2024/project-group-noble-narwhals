// import React from 'react';
// import { GroupTableRow } from '../components/GroupTableRow';

// function ApplyInProgressPage() {

//     const userName = "Rainman96"; // dummy data for user name
    
//     const groups = [ // dummy data for groups
//     { id: 1, groupName: "Group 1", category: "Project", due: "1 day left", groupOwner: "Owner 1", members: "2/4", status: "Open" },
//     { id: 2, groupName: "Group 2", category: "Activity", due: "1 day left", groupOwner: "Owner 2", members: "5/5", status: "Close" },
//     { id: 3, groupName: "Group 3", category: "Study", due: "1 day left", groupOwner: "Rainman96", members: "3/3", status: "Open" },
// ];
//     return (
//         <div className="flex flex-col m-4 p-4">
//             <div className="text-3xl mb-8">Apply in Progress</div>
//             {/* Groups table */}
//             <table className="w-full border-collapse border-spacing-7 ">
//                 <thead>
//                     <tr>
//                         <th className="border-b border-gray-700 text-left py-2 px-3 ">Group Name</th>
//                         <th className="border-b border-gray-700 text-left py-2  px-3">Category</th>
//                         <th className="border-b border-gray-700 text-left py-2  px-3">Due</th>
//                         <th className="border-b border-gray-700 text-left py-2  px-3">Group Owner</th>
//                         <th className="border-b border-gray-700 text-left py-2  px-3">Member</th>
//                         <th className="border-b border-gray-700 text-left py-2 px-3 ">Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {groups.map((group) => (
//                                     <GroupTableRow
//                                         key={group.id}
//                                         groupName={group.groupName}
//                                         category={group.category}
//                                         due={group.due}
//                                         groupOwner={group.groupOwner == userName ? "You" : group.groupOwner}
//                                         members={group.members}
//                                         status={group.status}
//                                     />
//                                 ))    
//                                 }
//                 </tbody>
//             </table>
//         </div>
//     )
// }

// export default ApplyInProgressPage;