//import models

const userDetails = require("../Model/User.model");
const log = require("../Model/Log.model")
const projectModel = require("../Model/Project.model");

//import authentication
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


// register
const registerUser = async (req, res) => {

  try {

    const { Name, Email, Password, Role, projectIds, position} = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const user = await userDetails.findOne({ Email });
    const projectIdList = Array.isArray(projectIds) ? projectIds : [projectIds]; // Array Handling
    const projects = await projectModel.find({ _id: { $in: projectIdList } });

    if (projects.length !== projectIdList.length) {
      return res.status(400).json({ msg: "Some project IDs are invalid or not found" });
    }


    if (user) {
      return res.status(200).json({ msg: "User already exists" });
    }

    // registerUser
    const createUser = await userDetails.create({
      Name,
      Email,
      Password: hashedPassword,
      Role: Role,
      position : position,
    });


    await Promise.all(
      projectIdList.map(async (projectId) => {
        const project = await projectModel.findById(projectId);
        if (project && !project.assignedTo.includes(createUser._id)) {
          project.assignedTo.push(createUser._id);
          await project.save();
        }
      })
    );

    return res.status(201).json({ msg: "User created successfully", data: createUser });


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

//getUser Role based Details
const getUserRoleDetails = async (req, res) => {
  try {
    const { role } = req.query;
    if (!role) {
      return res.status(400).json({ msg: "Role is required" });
    }
    const users = await userDetails.find({ Role: role });
    const userIds = users.map(user => user._id);
    const projects = await projectModel.find({ assignedTo: { $in: userIds } });

    const result = users.map(user => {
      const userProjects = projects.filter(project =>
        project.assignedTo.some(id => id.equals(user._id))
      );
      return {
        user,
        assignedProjects: userProjects
      };
    });
    res.status(200).json(result);
  }
  catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
}

//updateRole Based User

const updatedRole = async (req, res) => {
  try {

    const { userId, role, name, email, password, projectIds,position} = req.body;
    const user = await userDetails.findById(userId);
    if (password) {
      user.Password = await bcrypt.hash(password, 10);
    }
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const projectIdList = Array.isArray(projectIds) ? projectIds : [projectIds]; // Array Handling
    const projects = await projectModel.find({ _id: { $in: projectIdList } });

    if (projects.length !== projectIdList.length) {
      return res.status(400).json({ msg: "Some project IDs are invalid or not found" });
    }

    user.Role = role;
    user.Name = name;
    user.Email = email;
    user.position = position;
    await user.save();

    //projectUpdate

    await Promise.all(
      projectIdList.map(async (projectId) => {
        const project = await projectModel.findById(projectId);
        if (project && !project.assignedTo.some(id => id.equals(user._id))) {
          project.assignedTo.push(user._id);
          await project.save();
        }
      })
    );

    res.status(200).json({ msg: 'User updated successfully', data: user });


  }
  catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
}

//fetch project for assigning users
const getProjectforRole = async (req, res) => {
  try {

    const projects = await projectModel.find().select('projectName projectLogo _id');

    const formatProjects = (projects) => {
      return projects.map(project => ({
        projectId: project._id,
        projectName: project.projectName,
        projectLogo: project.projectLogo || null,
      }));
    };

    const formattedProjects = formatProjects(projects);

    res.status(200).json({ projects: formattedProjects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ msg: "Failed to fetch projects" });
  }
};

//delete User

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userDetails.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await projectModel.updateMany(
      { assignedTo: userId },
      { $pull: { assignedTo: userId } }
    );

    await user.remove();
    res.status(200).json({ msg: 'User deleted successfully' });

  }
  catch (err) {
    res.status(500).json({ msg: 'Internal Server Error' });
  }


}

module.exports = { registerUser, loginUser, updateUser, logout, getUserRoleDetails, updatedRole, getProjectforRole, deleteUser};