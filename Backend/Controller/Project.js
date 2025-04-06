const ProjectDetails = require("../Model/Project.model");
const log = require("../Model/Log.model")
const userDetails = require("../Model/User.model");
const path = require('path');


// Create Project
const createProject = async (req, res) => {
  try {
    const createdById = req.user.id;
    const { projectName } = req.body;
    const projectLogo = req.file;
    const base64String = projectLogo.buffer.toString('base64');

    const proj = await ProjectDetails.findOne({ projectName });

    if (!req.file) {
      return res.status(400).json({ msg: "Please upload a project logo" });
    }

    if (proj) {
      return res.json({ msg: "Project already exists" });
    }
    else {
      const creat = await ProjectDetails.create({
        projectName: projectName,
        createdBy: createdById,
        projectLogo: base64String
      });

    const UserName = await userDetails.findById(createdById).populate('Name'); 


      try {
       const a =  await log.create({
          action: "Created",
          entityType: "Project",
          entityId: creat._id,
          user: UserName.Name,
          timestamp: Date.now(),
          path: projectName,
          projectId : creat._id,
          details: `Created Project : ${projectName}`,
        })
      
      }
      catch (err) {
        console.log(err);

      }
      // console.log("Project Created log"+ logDetails);
   
   

      return res.json({ msg: "Project Created Successfully", data: creat });
    }
  }
  catch (err) {
    console.log("Error :" + err);
  }
}


//Update Project
const updateProject = async (req, res) => {
  const updatedBy = req.user.id;

  try {
    const { projectId, newProjectName } = req.body;
    const projectLogo = req.file;

    const proj = await ProjectDetails.findById(projectId);
    if (!proj) {
      return res.json({ msg: "Project does not exist" });
    } else {
      const oldProjectName = proj.projectName;
      proj.projectName = newProjectName;
      
      if (projectLogo) {
        const base64String = projectLogo.buffer.toString('base64');
        proj.projectLogo = base64String;
      }
      
      await proj.save();

      const UserName = await userDetails.findById(updatedBy).populate('Name'); 

      try {
        await log.create({
          action: "Updated",
          entityType: "Project",
          entityId: projectId,
          user: UserName.Name,
          path: proj.projectName,
          projectId: projectId,
          details: `${oldProjectName} updated to ${newProjectName}`
        });
      } catch (err) {
        console.log(err);
      }
      
      return res.json({ 
        msg: "Project updated successfully", 
        data: {
          ...proj.toObject(),
          projectLogo: proj.projectLogo ? Buffer.from(proj.projectLogo, 'base64').toString('base64') : null
        }
      });
    }
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ msg: "Failed to update project" });
  }
};

//get project based on Role
const getProject = async (req, res) => {
  try {
    
    const userId = req.user.id; // userId extraction from jwt
    const user = await userDetails.findById(userId);
    const role = user.Role;
    // console.log("Role : " + role);

    if (role == 'admin' || role == 'user') {
      const projects = await ProjectDetails.find({ assignedTo: userId }).select('projectName _id');
      return res.status(200).json({ projects });
    }

    const projects = await ProjectDetails.find().select('projectName projectLogo _id'); 
    // superAdmin
  

    const processedProjects = projects.map(project => {
      // Process project data
      let logoBuffer = null;
      if (project.projectLogo) {
        logoBuffer = Buffer.from(project.projectLogo, 'base64');
      }

      return {
        projectId: project._id,  // Include projectId
        projectName: project.projectName,
        projectLogo: logoBuffer ? logoBuffer.toString('base64') : null,
      };
    });
    

    // console.log(processedProjects);
    res.status(200).json({ projects: processedProjects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ msg: "Failed to fetch projects" });
  }
};

// delete Project
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const Role = req.user.role;
    const deletedById = req.user.id;
    const projectName = await ProjectDetails.findById(projectId);
    if (!Role === "SuperAdmin") {
      res.status(401).json({ msg: "Only Authorized Person Can Remove the Project" });
    }
    const project = await ProjectDetails.findById(projectId);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    await ProjectDetails.findByIdAndDelete(projectId);
    const UserName = await userDetails.findById(deletedById).populate('Name'); 

    //log 

    try {
      await log.create({
        action: "Deleted",
        entityType: "Project",
        entityId: projectId,
        user: UserName.Name,
        path: projectName,
        projectId:projectId,
        details: ` Project Deleted : ${projectName}`

      })
    }
    catch (err) {
      console.log(err);
    }

    return res.status(200).json({ msg: 'Project deleted successfully' });


  } catch (err) {
    console.error("Error deleting project:", err);
    return res.status(500).json({ msg: 'Failed to delete project' });
  }
};


//get Images

const getImage = async (req, res) => {

  try {
    const filePath = path.join(__dirname, '../uploads/images', req.params.pic);
    res.sendFile(filePath);
  } catch (err) {
    console.log("Error: " + err);
  }
}

//assign users 

const assignUsers = async (req, res) => {

  try {

    const userId = req.user.id;
    const { projectId, userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ msg: 'Please provide an array of userIds.' });
    }

    const project = await ProjectDetails.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.assignedTo = [...new Set([...project.assignedTo, ...userIds])];

    await project.save();
    const UserName = await userDetails.findById(userId).populate('Name'); 

    await log.create({
      action: "Assigned",
      entityType: "Project",
      entityId: projectId,
      user: UserName.Name,
      projectId : projectId,
      path: project.projectName,
      details: "Users Assigned"

    })

    res.status(200).json({ msg: 'Users assigned to the project successfully', project });
  }
  catch (err) {

    console.log(err);

  }
}

module.exports = { createProject, updateProject, getProject, deleteProject, getImage, assignUsers };