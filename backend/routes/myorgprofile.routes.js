import express from "express";

import {
  createMyOrgProfile,
  getMyOrgProfileDetail,
  updateMyOrgProfile,
} from "../controllers/myorgprofile.controller.js";

const router = express.Router();

router.route("/").get(getMyOrgProfileDetail);
router.route("/:id").get(getMyOrgProfileDetail);
router.route("/:id").patch(updateMyOrgProfile);
router.route("/create").post(createMyOrgProfile);

export default router;
