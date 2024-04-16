import React from "react";

export function GroupTableRow(props) {
    return (
      <tr>
        <td className="border-b border-gray-700 text-left py-2 px-3 max-w-xs truncate">{props.groupName}</td>
        <td className="border-b border-gray-700 text-left py-2 px-3 max-w-xs truncate">{props.category}</td>
        <td className="border-b border-gray-700 text-left py-2 px-3 max-w-xs truncate">{props.due}</td>
        <td className="border-b border-gray-700 text-left py-2 px-3 max-w-xs truncate">{props.groupOwner}</td>
        <td className="border-b border-gray-700 text-left py-2 px-3 max-w-xs truncate">{props.members}</td>
        <td className="border-b border-gray-700 text-left py-2 px-3 max-w-xs truncate">{props.status}</td>
      </tr>
    );
  }

  
