//备份用的，不用管

<div className="flex flex-col"> 
                    <div className="text-3xl mb-8">Groups</div>
                    {/* Groups table */}
                    <table className="w-full border-collapse border-spacing-7 ">
                        <thead className=" ">
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
                            {groups.map((group) => (
                                <GroupTableRow
                                    key={group.id}
                                    groupName={group.groupName}
                                    category={group.category}
                                    due={group.due}
                                    groupOwner={group.groupOwner == userName ? "You" : group.groupOwner}
                                    members={group.members}
                                    status={group.status}
                                />
                            ))
                            }
                        </tbody>
                    </table>
                </div> 