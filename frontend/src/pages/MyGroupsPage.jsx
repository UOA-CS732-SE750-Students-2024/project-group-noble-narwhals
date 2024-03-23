import React from 'react';
import '../index.css';

function MyGroupsPage(){
    return(
    <div className="flex flex-col m-4 p-4">
        <div className="text-3xl mb-8">My Groups</div>
        {/* Groups table */}
        <table className="w-full">
            <thead>
                <tr>
                    <th className="border-b border-gray-300 text-left">Group Name</th>
                    <th className="border-b border-gray-300 text-left">Category</th>
                    <th className="border-b border-gray-300 text-left">Due</th>
                    <th className="border-b border-gray-300 text-left">Group Owner</th>
                    <th className="border-b border-gray-300 text-left">Member</th>
                    <th className="border-b border-gray-300 text-left">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border-b border-gray-300 text-left">$GROUP_NAME$</td>
                    <td className="border-b border-gray-300 text-left">$CATEGORY$</td>
                    <td className="border-b border-gray-300 text-left">$DUE$</td>
                    <td className="border-b border-gray-300 text-left">$GROUP_OWNER$</td>
                    <td className="border-b border-gray-300 text-left">$MEMBER$</td>
                    <td className="border-b border-gray-300 text-left">$STATUS$</td>
                </tr>
            </tbody>
        </table>
    </div>
)}

export default MyGroupsPage;