import express from "express";

import {
  getMyOrgProfileDetail,
  updateMyOrgProfile,
} from "../controllers/myorgprofile.controller.js";

const router = express.Router();

router.route("/").get(getMyOrgProfileDetail);
router.route("/:id").get(getMyOrgProfileDetail);
router.route("/").post(updateMyOrgProfile);

export default router;
