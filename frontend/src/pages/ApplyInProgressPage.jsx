import React from 'react';
import '../index.css';

function ApplyInProgressPage() {
    return (
        <div className="flex flex-col m-4 p-4">
            <div className="text-3xl mb-8">Apply in progress</div>
            {/* Groups table */}
            <table className="w-full border-collapse border-spacing-7 ">
                <thead>
                    <tr>
                        <th className="border-b border-gray-700 text-left py-2 px-3 ">Group Name</th>
                        <th className="border-b border-gray-700 text-left py-2  px-3">Category</th>
                        <th className="border-b border-gray-700 text-left py-2  px-3">Due</th>
                        <th className="border-b border-gray-700 text-left py-2  px-3">Group Owner</th>
                        <th className="border-b border-gray-700 text-left py-2  px-3">Member</th>
                        <th className="border-b border-gray-700 text-left py-2 px-3 ">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border-b border-gray-700 text-left py-2  px-3 max-w-xs truncate">$GROUP_sadsaadadasdasdsadasdasdsdassppppppppppppppNAME$</td>
                        <td className="border-b border-gray-700 text-left py-2  px-3 max-w-xs truncate">Project</td>
                        <td className="border-b border-gray-700 text-left py-2  px-3 max-w-xs truncate">1 day left</td>
                        <td className="border-b border-gray-700 text-left py-2  px-3 max-w-xs truncate">$GROUP_OWNER$</td>
                        <td className="border-b border-gray-700 text-left py-2  px-3 max-w-xs truncate">2/4</td>
                        <td className="border-b border-gray-700 text-left py-2  px-3 max-w-xs truncate">Open</td>
                    </tr>
                    <tr>
                        <td className="border-b border-gray-700 text-left py-2  px-3 max-w-xs truncate">$GROUP_NAME$</td>
                        <td className="border-b border-gray-700 text-left py-2  px-3 max-w-xs truncate">Activity</td>
                        <td className="border-b border-gray-700 text-left py-2  px-3 max-w-xs truncate">1 day left</td>
                        <td className="border-b border-gray-700 text-left py-2  px-3 max-w-xs truncate">$GROUP_OWNER$</td>
                        <td className="border-b border-gray-700 text-left py-2  px-3 max-w-xs truncate">5/5</td>
                        <td className="border-b border-gray-700 text-left py-2  px-3 max-w-xs truncate">Close</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ApplyInProgressPage;