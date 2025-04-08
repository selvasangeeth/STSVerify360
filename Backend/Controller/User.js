//import models

const userDetails = require("../Model/User.model");
const log = require("../Model/Log.model")

//import authentication
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


// register
const registerUser = async (req, res) => {

  try {

    const { Name, Email, Password, Role } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const user = await userDetails.findOne({ Email });

    if (user) {
      return res.json({ msg: "User already exists" });
    }

    else {

      // registerUser
      const createUser = await userDetails.create({
        Name,
        Email,
        Password: hashedPassword,
        Role: Role
      });

      return res.status(201).json({ msg: "User created successfully", data: createUser });

    }
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "An error occurred while processing your request. Please try again later", error: err });
  }
}

//Login

const loginUser = async (req, res) => {

  try {

    const { Email, Password } = req.body;
    const user = await userDetails.findOne({ Email });

    if (!user) {
      return res.status(200).json({ msg: "User not found. Please Register!" });
    }

    const paswd = user.Password;
    const match = await bcrypt.compare(Password, paswd);

    if (!match) {
      return res.status(401).json({ msg: "Invalid details" });
    }

    //jwt auth
    const token = jwt.sign({ id: user._id, email: user.Email, role: user.Role }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

    // Send user data in response
    return res.status(200).json({
      msg: "LoginSuccess",
      user: {
        Name: user.Name,
        Email: user.Email,
        Role: user.Role
      }
    });
  }
  catch (err) {
    return res.status(500).json({ msg: "An error occurred while processing your request. Please try again later", error: err });
  }
}



//update User

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { Name, Email } = req.body;
    const Profileimg = req.files?.Profileimg?.[0]
    const user = await userDetails.findById(userId);
    if (!user) {
      return res.status(200).json({ message: 'User not found' });
    }
    if (Name) {
      user.Name = Name;
    }
    if (Email) {
      user.Email = Email;
    }

    user.Profileimg = Profileimg;

    res.status(200).json({ msg: 'User updated successfully', data: user });

  }
  catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
}

//logout

const logout = (req, res) => {
  // Clear the JWT cookie by setting it with an expired date
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
      path: '/'
    });
    res.status(200).send({ msg: "Logged out successfully" });
  }
  catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });

  }
};


module.exports = { registerUser, loginUser, updateUser, logout };