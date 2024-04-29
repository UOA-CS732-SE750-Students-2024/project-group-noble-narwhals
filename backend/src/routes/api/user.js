import express from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/userModel.js';
import Group from '../../models/groupModel.js';
import { getUser } from '../../middleware/entityMiddleware.js';
import { getUserData } from '../../middleware/userPageDao.js';
import isLoggedIn from '../../middleware/authMiddleware.js';

const router = express.Router();

// Define the array of avatar styles
export const avatarStyles = ['thumbs', 'fun-emoji', 'adventurer', 'pixel-art-neutral', 'open-peeps', 'lorelei', 'croodles-neutral', 'croodles', 'miniavs', 'avataaars', 'icons', 'micah'];


// get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get user by ID
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
});

router.get('/userData/:id', getUserData(User, "User"), (req, res) => {
    res.json(res.user);
});


router.post('/', async (req, res) => {
    console.log(req.body); 
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Creating a new user instance without the avatar
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            accountType: req.body.accountType,
            isVerification: req.body.isVerification || false,
            gender: req.body.gender,
            profileTags: req.body.profileTags || [],
            participatingGroups: req.body.participatingGroups || [],
            likedGroups: req.body.likedGroups || [],
            appliedGroups: req.body.appliedGroups || [],

        });

        // First saving the user to generate the MongoDB _id
        await user.save();

        // Randomly select an avatar style
        const selectedStyle = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];

        // Construct the DiceBear avatar URL with the randomly selected style
        const avatarUrl = `https://api.dicebear.com/8.x/${selectedStyle}/svg?seed=${user._id}`;

        // Update the user record with the avatar
        user.avatar = avatarUrl;
        await user.save();

        // Responding to the client
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                accountType: user.accountType,
                isVerification: user.isVerification,
                avatar: user.avatar,
                profileTags: user.profileTags,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error creating user", error: err.message });
    }
});


// initial state about if user likes group or not
router.get('/:id/likes/:groupId', async (req, res) => {
    const { id, groupId } = req.params;

    try {
        const user = await User.findById(id).populate('likedGroups');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isLiked = user.likedGroups.some(group => group._id.toString() === groupId);
        res.json({ liked: isLiked });
    } catch (err) {
        console.error('Error checking if group is liked:', err);
        res.status(500).json({ message: 'Error processing request', error: err });
    }
});


// Route to like a group
router.post('/like/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user._id;


    try {
        const group = await Group.findById(groupId);
        const user = await User.findById(userId);
        console.log("user", user);
        console.log("group", group);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if the group is already liked by the user
        if (user.likedGroups.includes(groupId)) {
            return res.status(400).json({ message: 'Group already liked' });
        }

        // Add group to user's liked groups
        user.likedGroups.push(groupId);
        await user.save();

        // Increment the like count on the group
        group.likeNumber = (group.likeNumber || 0) + 1;
        await group.save();

        res.status(200).json({ message: 'Group liked successfully' });
    } catch (error) {
        console.error('Error liking the group:', error);
        res.status(500).json({ message: 'Error liking the group', error });
    }
});


// Route to unlike a group
router.post('/unlike/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user._id;
   
    try {
        const group = await Group.findById(groupId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if the group is in user's liked groups
        if (!user.likedGroups.includes(groupId)) {
            return res.status(400).json({ message: 'Group not previously liked' });
        }

        // Remove group from user's liked groups
        user.likedGroups.pull(groupId);
        await user.save();

        // Decrement the like count on the group, ensuring it does not go below zero
        group.likeNumber = (group.likeNumber > 0) ? group.likeNumber - 1 : 0;
        await group.save();

        res.status(200).json({ message: 'Group unliked successfully' });
    } catch (error) {
        console.error('Error unliking the group:', error);
        res.status(500).json({ message: 'Error unliking the group', error });
    }
});



// update user
router.patch('/update/:id', getUser, async (req, res) => {
    // Get the user object from the response
    const user = res.user;
    // if the user is not the owner of the account, return 403
    if (req.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized to update this user." });
    }

    // Loop over the fields in the request body
    for (const [key, value] of Object.entries(req.body)) {
        // Check if the user has the key and the value is not null
        if (user[key] !== undefined && value !== null) {
            user[key] = value;
        }
    }

    // If password is in the request, hash it before saving
    if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10);
    }

    try {
        // Save the updated user information
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// delete user
router.delete('/delete/:id', isLoggedIn, getUser, async (req, res) => {
    console.log("ready to delete user");
    const userId = req.params.id;
    
    if (req.user._id.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized to delete this user." });
    }

    try {
        console.log("delete user", res.user);

        // Step 1: Retrieve all group IDs that the user has liked
        const userDoc = await User.findById(userId).select('likedGroups');
        if (!userDoc) {
            return res.status(404).json({ message: "User not found." });
        }
        const likedGroupIds = userDoc.likedGroups;

        // Step 2: Decrement the likeNumber for each group the user has liked
        const decrementLikesPromises = likedGroupIds.map(groupId => {
            return Group.findByIdAndUpdate(groupId, { $inc: { likeNumber: -1 } });
        });
        await Promise.all(decrementLikesPromises);

        // Step 3: Perform deletion and updates after ensuring the liked groups are updated
        const ownedGroupsDeletion = Group.deleteMany({ ownerId: userId });
        const removeFromMembers = Group.updateMany({ groupMembers: userId }, { $pull: { groupMembers: userId } });
        const removeFromApplicants = Group.updateMany({ groupApplicants: userId }, { $pull: { groupApplicants: userId } });

        await Promise.all([ownedGroupsDeletion, removeFromMembers, removeFromApplicants]);

        // Finally, delete the user
        await res.user.deleteOne();
        req.logout(function(err) {
            if (err) {
                console.error("Error during logout:", err);
                return res.status(500).json({ message: err.message });
            }
            console.log("User has been deleted and logged out");
            res.json({ message: 'Deleted User' });
        });

    } catch (err) {
        console.error("Error during user deletion:", err);
        res.status(500).json({ message: err.message });
    }
});

// if users don't like avatar, they can regenerate it
router.post('/regenerate-avatar/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Randomly select an avatar style
        const selectedStyle = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];

        const newSeed = Date.now().toString();
        const newAvatarUrl = `https://api.dicebear.com/8.x/${selectedStyle}/svg?seed=${newSeed}`;

        user.avatar = newAvatarUrl;
        await user.save();

        res.json({ message: 'Avatar updated successfully', avatar: newAvatarUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});




export default router;
