import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import getUser from '../middleware/userMiddleware.js';
const router = express.Router();



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

router.post('/', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Define the array of avatar styles
        const avatarStyles = ['thumbs', 'fun-emoji', 'adventurer', 'avataaars','bottts-neutra','icons','micah'];

        // Creating a new user instance without the avatar
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            accountType: req.body.accountType,
            isVerification: req.body.isVerification || false,
            gender: req.body.gender,
            profileTags: req.body.profileTags || [],
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
                avatar: user.avatar, // Including the avatar
                profileTags: user.profileTags,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error creating user" });
    }
});




// update user
router.patch('/update/:id', getUser, async (req, res) => {
    if (req.body.name != null) {
        res.user.name = req.body.name;
    }
    if (req.body.accountType != null) {
        res.user.accountType = req.body.accountType;
    }
    if (req.body.email != null) {
        res.user.email = req.body.email;
    }
    if (req.body.isVerification != null) {
        res.user.isVerification = req.body.isVerification;
    }
    if (req.body.gender != null) {
        res.user.gender = req.body.gender;
    }
    if (req.body.profileTags != null) {
        res.user.profileTags = req.body.profileTags;
    }
    if (req.body.avatar != null) {
        res.user.avatar = req.body.avatar;
    }
    if (req.body.participatingGroups != null) {
        res.user.participatingGroups = req.body.participatingGroups;
    }
    if (req.body.likedGroups != null) {
        res.user.likedGroups = req.body.likedGroups;
    }
    if (req.body.appliedGroups != null) {
        res.user.appliedGroups = req.body.appliedGroups;
    }


    // update password
    if (req.body.password != null) {
        res.user.password = await bcrypt.hash(req.body.password, 10);
    }

    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// delete user
router.delete('/delete/:id', getUser, async (req, res) => {
    try {
        await res.user.remove();
        res.json({ message: 'Deleted User' });
    } catch (err) {
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

        const newSeed = Date.now().toString();
        const newAvatarUrl = `https://api.dicebear.com/8.x/thumbs/svg?seed=${newSeed}`;

        user.avatar = newAvatarUrl;
        await user.save();

        res.json({ message: 'Avatar updated successfully', avatar: newAvatarUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});




export default router;
