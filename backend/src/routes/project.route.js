const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const middleware = require("../middleware/auth.middleware");

// Episode routes
router.put("/episodes/:episodeId", projectController.updateContentById);
router.post("/:projectId/episodes", projectController.addEpisode);
router.get("/:episodeId", projectController.getContentByEpisodeId);
router.delete("/:episodeId/:projectId", projectController.deleteEpisode);

// Project routes
router.get("/allProject/:username", projectController.getAllProject);
router.get("/allEpisodes/:projectId", projectController.getAllEpisodes);
router.post("/newProject", projectController.createProject);
router.get("/", projectController.getIndividualProject);
router.delete("/:id", projectController.deleteProject);
// router.put("/:id", projectController.updateProject);

module.exports = router;
