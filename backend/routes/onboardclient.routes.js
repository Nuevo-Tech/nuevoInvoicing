import express from "express";
import {
  createClient,
  getClient,
  getAllClients,
  getClientInfoByID,
  updateClient,
} from "../controllers/onboardclient.controller.js";

const router = express.Router();

router.route("/").get(getAllClients);
router.route("/getClient").get(getClient);
router.route("/").post(createClient);
router.route("/:id").patch(updateClient);
router.route("/:id").get(getClientInfoByID);

export default router;
