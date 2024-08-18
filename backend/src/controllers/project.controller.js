const Project = require("../models/project.model");
const User = require("../models/user.model");
const Episode = require("../models/episode.model");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");

//create a project
const createProject = catchAsync(async (req, res) => {
  const { title, _id } = req.body;
console.log("title", title, _id);
  try {
    const project = await new Project({ title, userId:_id });
    const saveProject = await project.save();

    console.log("save controller", saveProject)
    console.log("project user", req.user)
    const findUser = await User.findById(_id);
    console.log("findUser", findUser)

    findUser.projects.push(saveProject._id);
    await findUser.save(); // Save the user with the updated project array

    res.status(httpStatus.OK).json(findUser.projects);
  } catch (err) {
    res.status(httpStatus["400_NAME"], "Failed to create project");
  }
});

// Read Projects for a User
const getIndividualProject = catchAsync(async (req, res) => {
  try {
    console.log("req.userId._id", req.body._id)
    const project = await Project.findById(req.body._id).populate({
     path: "episodes" ,
    });

    if (!project) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Project not found" });
    }

    // Return the user's projects
    res.status(httpStatus.OK).json(project);
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch projects" });
  }
});

//update a project
//hold
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
//hold
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
    console.log("title episode", title, content)
    try {
      const project = await Project.findById(req.params.projectId);
  
      // if (project.user.toString() !== req.user._id.toString()) {
      //   return res.status(401).json({ message: "Not authorized" });
      // }
      const episode = new Episode({
        title,
        content,
        project: req.params.projectId,
      });
      console.log("episode", episode)
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

  const getContentByEpisodeId = catchAsync(async (req, res) => {
    let { episodeId } = req.params;
    let episode = await Episode.findById(episodeId);
    if (!episode) {
      return res.status(404).json({ message: "episode not found" });
    }
    let content = episode.content;
    return res.status(200).json({ content });
  });

  const updateContentById = catchAsync(async (req, res) => {
    let { episodeId } = req.params;
    let episode = await Episode.findById(episodeId);
    if (!episode) {
      return res.status(404).json({ message: "episode not found" });
    }
  
    let newContent = req.body.content;
    episode.content = newContent;
    episode.updatedAt = new Date();
    await episode.save();
    await Project.findByIdAndUpdate(episode.project, { updatedAt: new Date() });
    return res.status(200).json({ message: "successful" });
  });

  const deleteEpisode = catchAsync(async (req, res) => {
    const { episodeId, projectId } = req.params;
  
    // Find the project
    const project = await Project.findById(projectId);
  
    // Ensure the project belongs to the authenticated user
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
  
    // Find the episode
    const episode = await Episode.findById(episodeId);
  
    // Ensure the episode exists and belongs to the project
    if (!episode || episode.project.toString() !== projectId) {
      return res.status(404).json({ message: "Episode not found" });
    }
  
    // Remove the episode from the project's episodes array
    project.episodes.pull(episodeId);
    await project.save();
  
    // Delete the episode from the Episode collection
    await Episode.findByIdAndDelete(episodeId)
  
    res.json({ message: "Episode removed successfully" });
  });

module.exports = {
  createProject,
  getIndividualProject,
  updateProject,
  deleteProject,
  getAllProject,
  addEpisode,
  getAllEpisodes,
  getContentByEpisodeId,
  updateContentById,
  deleteEpisode
};
