const User = require('../model/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.AddUser = async (req, res) => {
    const { userId, username, email, password, channels } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User Already Existed" })
        }

        if (!req.files || !req.files.avatar) {
            return res.status(400).json({ message: 'avatar is required.' });
        }

        const avatar = req.files.avatar[0].path;

        const hasPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            userId, username, email, password: hasPassword, avatar, channels
        })

        const savedUser = await newUser.save();

        return res.status(201).json({ message: "User Created Successfully !", user: savedUser })
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
    }
}

exports.GetUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id);
        return res.status(200).json({ message: "User Fetched Successfully !", user: user })

    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error });
        
    }
}

exports.SignIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please sign up." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials. Please try again." });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.SECRET_KEY
        );

        return res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                userId: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                channels: user.channels,
            },
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.', error });
    }
};
