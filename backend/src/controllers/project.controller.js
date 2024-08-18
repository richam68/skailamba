const Project = require("../models/project.model");
const User = require("../models/user.model");
const Episode = require("../models/episode.model");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");

//create a project
const createProject = catchAsync(async (req, res) => {
  const { title } = req.body;

  try {
    const project = new Project({ title, user: req.user._id });
    const saveProject = await project.save();

    req.user.project.push(saveProject._id);
    await req.user.save(); // Save the user with the updated project array

    res.status(httpStatus.OK).json(saveProject);
  } catch (err) {
    res.status(httpStatus["400_NAME"], "Failed to create project");
  }
});

// Read all Projects for a User
const getProjects = catchAsync(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "projects",
      populate: { path: "episodes" },
    });

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    // Return the user's projects
    res.status(httpStatus.OK).json(user.projects);
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch projects" });
  }
});

//update a project
const updateProject = catchAsync(async (req, res) => {
    const { title } = req.body;
    const projectId = req.params.id;

    if (!title) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Title is required" });
    }

    try {
        // Find the project by ID
        const project = await User.findById(projectId);
        if (!project) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "Project not found" });
        }

        // Check if the user is authorized
        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Not authorized" });
        }

        // Update the project title
        project.title = title;
        const updatedProject = await project.save();
        res.json(updatedProject);

    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to update project" });
    }
});


//delete a project
const deleteProject = catchAsync(async (req, res) => {
    try{
        const project = await Project.findById(req.params.id);
        if(project.user.toString() !== req.user._id.toString()){
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Not authorized" });
        }

        await project.remove();
        // Remove project from user's project array
        req.user.projects.pull(project._id);
        await req.user.save(); // Save user after removal

        res.json({ message: "Project removed" });
    }catch(err){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to delete project" });
    }
});

// Add Episode to a Project
const addEpisode = catchAsync(async (req, res) => {
    const { title, content } = req.body;
    try {
      const project = await Project.findById(req.params.projectId);
      if (project.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }
      const episode = new Episode({
        title,
        content,
        project: req.params.projectId,
      });
      const savedEpisode = await episode.save();
      project.episodes.push(savedEpisode._id);
      await project.save();
      res.status(201).json(savedEpisode);
    } catch (err) {
      res.status(400).json({ message: "Failed to add episode" });
    }
  });

  //get all projects
  const getAllProject = catchAsync(async (req, res) => {
    let { username } = req.params;
  
    let projects = await User.find({ username })
      .populate("projects")
      .select("projects");
  
    return res.status(200).json(projects);
  });

  //get all episode
  const getAllEpisodes = catchAsync(async (req, res) => {
    try {
      let { projectId } = req.params;
      // Find all episodes where the `project` field matches the given `projectId`
      // and populate the `project` field with the corresponding Project document
      const episodes = await Episode.find({ project: projectId });
  
      return res.status(200).json({ episodes });
    } catch (error) {
      console.error("Error fetching episodes:", error);
      throw new Error("Could not retrieve episodes");
    }
  });

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getAllProject,
  addEpisode,
  getAllEpisodes
};
