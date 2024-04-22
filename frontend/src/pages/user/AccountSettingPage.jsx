import React from "react";
import "../../index.css";
import Button from "../../components/Button";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";


function AccountSettingsPage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(""); 
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {

    //get user data from backend
    const fetchUser = async () => {

      try {
        console.log("userId: ", userId);
        const response = await fetch(`http://localhost:3000/api/user/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("fetch user data from database", data);
        setUser(data);
        setTags(data.profileTags || []);
        setUsername(data.name || "");
        setAvatar(data.avatar || "");
        setGender(data.gender || "");
        setEmail(data.email || "");
        setPassword(data.password || "");
      } catch (e) {
        setError(e);
      }
    };
    if (userId) {
      fetchUser();
    }

  }, [userId]);

  if (error) {
    return <div>Error fetching data when fetching data: {error.message}</div>;
  }

  // if user is not found (is null)
  if (!user) {
    return <div>User not found</div>;
  }


  const handleEditClick = () => {
    setIsEditing(!isEditing); // toggle isEditing state
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value); // for updating username
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value); // for updating gender
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value); // for updating email
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value); // for updating password
  };

  const handleChangeAvatar = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/user/regenerate-avatar/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error when avatar changes! Status: ${response.status}`);
        }
        const data = await response.json();
      
        setAvatar(data.avatar);
        setUser(prevUser => ({ ...prevUser, avatar: data.avatar }));

        console.log('Avatar changed successfully:', data.message);
    } catch (error) {
        console.error('Failed to change avatar:', error);
    }
};

  const handleAddNewTag = async (newTagName) => {
    if (!newTagName.trim()) {
      console.error('Tag name is required.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName.trim(), isProfileTag: true, isGroupTag: false })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to add tag:', errorData.errors);
        return;
      }

      const newTag = await response.json();
      setTags([...tags, newTag]);

    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };


  const handleDeleteTag = async (tagId) => {
    try {
      await fetch(`http://localhost:3000/api/tag/${tagId}`, {
        method: 'DELETE'
      });
      setTags(tags.filter(tag => tag._id !== tagId));
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  };


  const handleSubmit = async () => {
    setIsEditing(false); // 首先停止编辑状态

    // 准备发送到服务器的数据
    const updatedUserData = {
      name: username,
      gender: gender,
      email: email,
      password: password,
      profileTags: tags,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/user/update/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer your-auth-token', if we need to authenticate
        },
        body: JSON.stringify(updatedUserData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Update user data successful:', data);
      setUser(data);


    } catch (error) {
      console.error('Update failed:', error);

    }
  };

  const deleteAccount = async () => {
    // Confirm the user's intention to delete the account
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:3000/api/user/delete/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer your-auth-token', if we need to authenticate
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        console.log('Account deleted successfully.');
        // Redirect to the login page or home page
        history.push('/login');
  
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    } else {
      console.log('Account deletion canceled.');
    }
  };
  

  return (
    <div className="w-4/5 m-4 p-4">
      <div className="text-3xl mb-5">Account Settings</div>
      <div>
        <div>
          {" "}
          {/* Avatar*/}
          <p className="font-bold text-xl mb-3">Avatar</p>
          <div className="flex flex-row">
            <img
              className="w-24 h-24 rounded-full mb-2"
              src={avatar}
            />
            {isEditing && ( // when editing is active, show the change avatar button}
              <Button className="mt-6 ml-6" onClick={handleChangeAvatar}> Change Avatar</Button>
            )}
          </div>
        </div>
        <div>
          {" "}
          {/* username*/}
          <p className="font-bold text-xl mb-3">Username</p>
          <div className="flex flex-row mb-3 items-center">
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              disabled={!isEditing}
              className={`border rounded px-2 py-1 ${isEditing
                  ? "border-black text-black"
                  : "border-transparent text-gray-500"
                }`}
            />
          </div>
        </div>

        <div>
          {" "}
          {/**Gender */}
          <p className="font-bold text-xl mb-3">Gender</p>
          <div className="flex flex-row mb-3 items-center gap-5">
            {isEditing ? ( // when editing is active, show the radio buttons
              <>
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
              </>
            ) : (
              <p className="text-gray-500">{gender}</p>
            )}
          </div>
        </div>

        <div>
          {" "}
          {/**Email */}
          <p className="font-bold text-xl mb-3">Email</p>
          <div className="flex flex-row mb-3 items-center">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              disabled={!isEditing}
              className={`border rounded px-2 py-1 ${isEditing
                  ? "border-black text-black"
                  : "border-transparent text-gray-500"
                }`}
            />
          </div>
        </div>

        <div>
          {" "}
          {/**Password */}
          <p className="font-bold text-xl mb-3">Password</p>
          <div className="flex flex-row mb-3 items-center">
            <input
              type="password"
              value={password}
              disabled={!isEditing}
              className={`border rounded px-2 py-1 ${isEditing
                  ? "border-black text-black"
                  : "border-transparent text-gray-500"
                }`}
              onChange={handlePasswordChange}
            />
          </div>
        </div>

        <div>
          {" "}
          {/**tags */}
          <p className="font-bold text-xl mb-3">Tags</p>
          {isEditing && (
            <>
              <p className="text-gray-500">Add tags to help others find you.</p>
              <p className="text-gray-500">
                Type your tag names into the textbox and press "Add" button.
              </p>
              <div>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  disabled={!isEditing}
                  className={`border-black border-2 rounded w-1/3 px-2 py-1 ${isEditing
                      ? "border-black text-black"
                      : "border-transparent text-gray-500"
                    }`}
                />

                <Button className="ml-6" onClick={() => handleAddNewTag(newTag)}>
                  Add
                </Button>
              </div>
            </>
          )}
          {/**user's current tags */}
          <div className="max-w-lg mr-4 flex flex-row">
            {" "}
            {/**user's tags list */}
            {tags.map((tag) => (
              <div
                key={tag._id}
                className={`mt-2 mr-2 pr-1 pl-1 rounded-3xl border-2 ${isEditing
                    ? "text-black border-black"
                    : "border-gray-500 text-gray-500"
                  } text-sm flex flex-row`}
              >
                <div>{tag.name}</div>
                {isEditing && (
                  <IoClose
                    onClick={() => handleDeleteTag(tag._id)}
                    size={20}
                    className="cursor-pointer"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <Button
          onClick={isEditing ? handleSubmit : handleEditClick}
          className="mt-6"
        >
          {isEditing ? "Update profile" : "Edit Profile"}
        </Button>
        <div>
          <Button
            onClick={deleteAccount}
            className="mt-10 border-transparent font-bold text-white bg-red-500"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AccountSettingsPage;
