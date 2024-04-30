import React from "react";
import "../../index.css";
import Button from "../../components/Button";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../../store/AuthContext";
import axios from "axios";

function AccountSettingsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, setUser, isLoading, setIsLoading, isLoggedIn } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);


  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user._id !== userId)) {
      // if the user is not logged in, or logged in but not the user ID to be viewed
      // then he/she should be redirected to the home page
      navigate('/');
    }
    if (!isLoading) {
      setUsername(user.name);
      setAvatar(user.avatar);
      setGender(user.gender);
      setEmail(user.email);
      setPassword(user.password || "");
      setTags(user.profileTags);

    }
  }, [user, isLoading, isLoggedIn]);


  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <img src="/image/Spinner.svg" alt="Loading..." />
      </div>
    );
  } else {
    console.log("user from accountsetting: ", user);
  }

  // if user is not found (is null)
  if (!user) {
    return <div>User not found</div>;
  }

  /* if the user's account type is "google", then the password field should be hidden,
   because google account doesn't need password */
  const isGoogleAccount = user.accountType === "google";
  console.log("isGoogleAccount: ", isGoogleAccount);

  const handleEditClick = () => {
    setIsEditing(!isEditing); // toggle isEditing state
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value); // for updating username
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value); // for updating gender
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setIsPasswordChanged(true);
    // User has modified the password field
    // this is a flag to check if the user has changed the password field to prevent user submitting mistakenly
    // but now I have added a restriction to the password length, so this flag is not necessary
    // it remains because it hard to find all the places where it is used
  };


  const handleChangeAvatar = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/regenerate-avatar/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`HTTP error when avatar changes! Status: ${response.status}`);
      }
      const data = await response.json();

      setAvatar(data.avatar);
      console.log('Avatar changed to:', data.avatar);
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
    // Format input: trim whitespace, replace spaces with hyphens, convert to lower case
    const formattedTag = newTagName.trim().replace(/\s+/g, '-').toLowerCase();
    if (tags.length >= 6) {
      alert('You can only have 6 tags maximum.');
      return;
    }

    // Check tag length constraint
    if (formattedTag.length > 20) {
      alert('The tag length should be within 20 characters.');
      return;
    }

    // Check if the formatted tag is already in the profileTags
    if (tags.some(tag => tag.name.toLowerCase() === formattedTag)) {
      alert('Please add a unique tag.');
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formattedTag, isProfileTag: true, isGroupTag: false })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to add tag:', errorData.errors);
        return;
      }

      const newTag = await response.json();
      setTags(prevTags => [...prevTags, newTag]);
      console.log('Tag added successfully, now tags are:', tags);
      setNewTag('');
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      setTags(prevTags => prevTags.filter(tag => tag._id !== tagId));
    } catch (error) {
      console.error('Failed to delete tag:', error.message);
    }
  };

  const handleSubmit = async () => {
    const updatedUserData = {
      name: username,
      profileTags: tags,
    };
    console.log("gender is changed to ", gender)

    if (gender !== 'Not specified') {
      updatedUserData.gender = gender;
    }

    if (isPasswordChanged && password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    console.log('Updated user data is:', updatedUserData)

    setIsEditing(false); // Disable editing mode after submitting the form

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/update/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (isPasswordChanged) {
        setPassword(''); // Reset password field after successful update
        setIsPasswordChanged(false); // Reset password changed state
      }

      alert('Profile updated successfully!')
      // Fetch user data from the server (in case of unable to get user data from AuthContext)
      await fetchUserData();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };


  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/userData/${user._id}`);
      setUser(res.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUsername(user.name);
    setAvatar(user.avatar);
    setGender(user.gender || 'Not specified');
    setPassword(user.password); // Reset password field
    setTags(user.profileTags || []);
    setIsPasswordChanged(false);
  };


  const deleteAccount = async () => {
    // Confirm the user's intention to delete the account
    console.log('Delete account clicked.account ID: ', userId);
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/delete/${userId}`, {
          method: 'DELETE',
          credentials: 'include',
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
        alert('Account deleted successfully. Redirecting to the login page.');
        navigate('/login');

      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    } else {
      console.log('Account deletion canceled.');
    }
  };

  const handleVerifyAccount = async () => {
    console.log('Verify account clicked.');
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };


  return (
    <div className="w-4/5 m-4 p-4">
      <div className="text-3xl mb-5">Account Settings</div>
      {user.isVerification ? (
        <p className="text-gray-400 mb-2">Your account has been verified</p>
      ) : (
        <div className="flex flex-row mb-2 gap-2">
          <Button className="" onClick={handleVerifyAccount}>Verify Account</Button>
          <p className="ml-2 w-32 text-gray-400 text-xs">Verifying your account with your UoA google account can allow you create groups at HeyMate.</p>
        </div>
      )}
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

            <Button className="mt-6 ml-6" onClick={handleChangeAvatar}> Change Avatar</Button>

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
              <p className="text-gray-500 ml-1">{gender}</p>
            )}
          </div>
        </div>

        <div>
          {" "}
          {/**Email - not allowed to change*/}
          <p className="font-bold text-xl mb-3">Email</p>
          <div className="flex flex-row mb-3 items-center">
            <p className="px-2 py-1 border-transparent text-gray-500 cursor-not-allowed"
            >{email}</p>
          </div>
        </div>

        {/* Password - Hidden for Google accounts */}
        {/* if the user's account type is "google", then the password field should be hidden,
        because google account doesn't need password */}
        {!isGoogleAccount && (
          <div className="mb-3">
            <p className="font-bold text-xl">Password</p>
            <input type="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={!isEditing}
              minLength="8"
              className="border rounded px-2 py-1" />
          </div>
        )}

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
          <div className="mr-4 flex flex-row flex-wrap">
            {" "}
            {/**user's tags list */}
            {tags && tags.map((tag, index) => (
              <div
                key={index}
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
        {isEditing && (
          <Button onClick={handleCancelEdit} className="mt-6 ml-2">
            Cancel
          </Button>
        )}
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
