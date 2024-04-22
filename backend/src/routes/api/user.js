import express from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/userModel.js';
import { getUser } from '../../middleware/entityMiddleware.js';
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

router.post('/', async (req, res) => {
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
        res.status(400).json({ message: "Error creating user" });
    }
});





// update user
router.patch('/update/:id', getUser, async (req, res) => {
    // Get the user object from the response
    const user = res.user;

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
