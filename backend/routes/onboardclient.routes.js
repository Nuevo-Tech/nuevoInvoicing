import express from "express";
import {
  createZatcaEgsClient,
  getZatcaEgsClient,
  getAllZatcaEgsClients,
  getZatcaEgsClientInfoByID,
  updateZatcaEgsClient,
  deleteZatcaEgsClient,
} from "../controllers/onboardZatcaEgsClient.controller.js";

const router = express.Router();

router.route("/").get(getAllZatcaEgsClients);
router.route("/getClient").get(getZatcaEgsClient);
router.route("/").post(createZatcaEgsClient);
router.route("/:id").patch(updateZatcaEgsClient);
router.route("/:id").get(getZatcaEgsClientInfoByID);
// router.route("/:id").delete(deleteZatcaEgsClient);

export default router;
