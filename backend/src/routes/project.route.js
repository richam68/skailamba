const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const middleware = require("../middleware/auth.middleware");

//get project, episodes
router.get("/allProject/:username", projectController.getAllProject);

router.get("/allEpisodes/:projectId", projectController.getAllEpisodes);

//project routes
router.post("/newProject", projectController.createProject);

router.get("/", projectController.getIndividualProject);

router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

//episode routes
router.post("/:projectId/episodes", projectController.addEpisode);
router.get("/:episodeId",projectController.getContentByEpisodeId);

router.put(":/episodeId", projectController.updateContentById);

router.delete("/:episodeId/:projectId", projectController.deleteEpisode)

module.exports = router;