const modulee = require("../Model/Module.model");
const project = require("../Model/Project.model")
const log = require("../Model/Module.model");

const createModule = async (req, res) => {
    try {
        const createdById = req.user.id;
        const { moduleName, subModule, projectId } = req.body;
        const mod = await modulee.findOne({ moduleName });
        if (mod) {
            return res.json({ msg: "Module already Exist" });
        }
        else {
            const creat = await modulee.create({
                moduleName: moduleName,
                subModule: subModule,
                projectId: projectId,
                createdBy: createdById,
            })
            const associatedProject = await project.findById(projectId);
            if (!associatedProject) {
                return res.status(404).json({ msg: "Project not found" });
            }
            const path = `${associatedProject.projectName}/${creat.moduleName}`;
            try {
                await log.create({
                    action: "Created",
                    entityType: "Module",
                    entityId: creat._id,
                    user: createdById,
                    timestamp: Date.now(),
                    path :path,
                    details: `Created Module : ${moduleName}`,

                })
            }
            catch (err) {
                console.log(err);

            }

            return res.json({ msg: "Module Created Successfully", data: creat });
        }
    }
    catch (err) {
        console.log("Error :" + err);
    }
}

//getModule

const getModules= async (req, res) => {
  try {
    const projectId = req.params.projectId; 

    const proj = await project.findById(projectId);
    if (!proj) {
      return res.status(404).json({ msg: "Project not found" });
    }
    const modules = await modulee.find({ project: projectId });

    if (modules.length === 0) {
      return res.status(404).json({ msg: "No modules found for this project" });
    }
    res.status(200).json({ modules });
  } catch (err) {
    console.error("Error fetching modules:", err);
    res.status(500).json({ msg: "Failed to fetch modules" });
  }
};




module.exports = { createModule,getModules };