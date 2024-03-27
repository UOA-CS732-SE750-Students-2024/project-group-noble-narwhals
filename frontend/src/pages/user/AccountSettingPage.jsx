import React from 'react';
import '../../index.css';
import Button from '../../components/Button';
import { useState } from 'react';
import { IoClose } from "react-icons/io5";

function AccountSettingsPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("InitialUsername");
    const [gender, setGender] = useState("Male");
    const [email, setEmail] = useState("InitialEmail");
    const [password, setPassword] = useState("InitialPassword");
    const [tags, setTags] = useState(["exampleTag1", "exampleTag2"]); // 假设这是初始的tags
    const [newTag, setNewTag] = useState(""); // 新增加的tag

    const handleUsernameChange = (event) => {
        setUsername(event.target.value); // 只更新用户名
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value); // 只更新性别
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing); // 切换编辑状态
    };

    const handleEmailChange = (event) => {
        // 这里添加更新邮箱的逻辑
    };

    const handleAddTag = () => {

        if (newTag.trim() && !tags.includes(newTag)) {
            setTags([...tags, newTag.trim()]);
            setNewTag(""); // 清空输入框
        }
    };

    const handleDeleteTag = (index) => {
        setTags(tags.filter((_, i) => i !== index)); // 删除指定index的tag
    };

    const handleSubmit = () => {
        setIsEditing(false);
        console.log("Submitted Username:", username);
        console.log("Submitted Gender:", gender);
        // 这里添加提交到服务器的逻辑
    };

    const deleteAccount = () => {
        // 这里添加删除账户的逻辑
    }


    return (
        <div className="m-5 p-5">
            <div className="text-3xl mb-5">Account Settings</div>
            <div>
                <div> {/* Avatar*/}
                    <p className="font-bold text-xl mb-3">Avatar</p>
                    <div className="flex flex-row">
                        <img className="w-24 h-24 rounded-full mb-2" src="https://www.animesenpai.net/wp-content/uploads/2022/12/Bocchi-The-Rock-21-1024x576.webp" />
                        <Button className="mt-6 ml-6"> Change Avatar</Button>
                    </div>
                </div>
                <div> {/* username*/}
                    <p className='font-bold text-xl mb-3'>Username</p>
                    <div className="flex flex-row mb-3 items-center">
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            disabled={!isEditing}
                            className={`border rounded px-2 py-1 ${isEditing ? "border-black text-black" : "border-transparent text-gray-500"}`}
                        />
                    </div>
                </div>

                <div> {/**Gender */}
                    <p className='font-bold text-xl mb-3'>Gender</p>
                    <div className="flex flex-row mb-3 items-center gap-5">
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={gender === "Male"}
                                onChange={handleGenderChange}
                                disabled={!isEditing}
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={gender === "Female"}
                                onChange={handleGenderChange}
                                disabled={!isEditing}
                            />
                            Female
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Prefer not to say"
                                checked={gender === "Prefer not to say"}
                                onChange={handleGenderChange}
                                disabled={!isEditing}
                            />
                            Prefer not to say
                        </label>
                    </div>
                </div>

                <div> {/**Email */}
                    <p className='font-bold text-xl mb-3'>Email</p>
                    <div className="flex flex-row mb-3 items-center">
                        <input
                            type="email"
                            value="xxx@aa.com"
                            onChange={handleEmailChange}
                            disabled={!isEditing}
                            className={`border rounded px-2 py-1 ${isEditing ? "border-black text-black" : "border-transparent text-gray-500"}`}
                        />
                    </div>
                </div>

                <div> {/**Password */}
                    <p className='font-bold text-xl mb-3'>Password</p>
                    <div className="flex flex-row mb-3 items-center">
                        <input
                            type="password"
                            value={password}
                            disabled={!isEditing}
                            className={`border rounded px-2 py-1 ${isEditing ? "border-black text-black" : "border-transparent text-gray-500"}`}
                        />
                    </div>
                </div>

                <div> {/**tags */}
                    <p className='font-bold text-xl mb-3'>Tags</p>
                    <p className="text-gray-500">Add tags to help others find you.</p>
                    <p className="text-gray-500">Type your tag names into the textbox and press "Add" button.</p>
                    <div>
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            disabled={!isEditing}
                            className={`border-black border-2 rounded w-1/3 px-2 py-1 ${isEditing ? "border-black text-black" : "border-transparent text-gray-500"}`}
                        />
                        {isEditing && (
                            <Button className="ml-6" onClick={() => handleAddTag()}>Add</Button>
                        )}
                        
                        {/**列表的形式显示用户的tags,当编辑模式激活后，在每行右侧有一个按钮可以删除这个tag */}
                        <div className="max-w-lg mr-4 flex flex-row"> {/**user's tags list */}
                            {tags.map((tag, index) => (
                            <div key={index} className={`mt-2 mr-2 pr-1 pl-1 rounded-3xl border-2 ${isEditing ? 'text-black border-black' : 'border-gray-500 text-gray-500'} text-sm flex flex-row`}>
                                
                                <div>{tag}</div>
                                {isEditing && (
                                    <IoClose onClick={() => handleDeleteTag(index)} size={20} className='cursor-pointer'/>
                                )}
                            
                            </div>
                        ))}
                         </div>
                    </div>
                </div>
                <Button onClick={isEditing ? handleSubmit : handleEditClick} className="mt-6">
                    {isEditing ? "Update profile" : "Edit Profile"}
                </Button>
                <div>
                    <Button onClick={deleteAccount()} className="mt-10 border-transparent font-bold text-white bg-red-500">
                        Delete Account
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AccountSettingsPage;