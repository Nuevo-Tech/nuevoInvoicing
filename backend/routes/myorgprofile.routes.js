import express from "express";

import {
  createMyOrgProfile,
  getMyOrgProfileDetail,
  updateMyOrgProfile,
} from "../controllers/myorgprofile.controller.js";

const router = express.Router();

router.route("/").get(getMyOrgProfileDetail);
router.route("/:id").get(getMyOrgProfileDetail);
router.route("/:id").post(updateMyOrgProfile);
router.route("/:id").patch(updateMyOrgProfile);
router.route("/").post(createMyOrgProfile);

export default router;
