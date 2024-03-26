import React from "react";

export function GroupTableRow({ groupName, category, due, groupOwner, members, status }) {
    return (
      <tr>
        <td className="border-b border-gray-700 text-left py-2 px-3 max-w-xs truncate">{groupName}</td>
        <td className="border-b border-gray-700 text-left py-2 px-3 max-w-xs truncate">{category}</td>
        <td className="border-b border-gray-700 text-left py-2 px-3 max-w-xs truncate">{due}</td>
        <td className="border-b border-gray-700 text-left py-2 px-3 max-w-xs truncate">{groupOwner}</td>
        <td className="border-b border-gray-700 text-left py-2 px-3 max-w-xs truncate">{members}</td>
        <td className="border-b border-gray-700 text-left py-2 px-3 max-w-xs truncate">{status}</td>
      </tr>
    );
  }

  
