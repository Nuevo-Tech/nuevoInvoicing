import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";

import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";
import clientRouter from "./routes/client.routes.js";
import accountRouter from "./routes/account.routes.js";
import fileUploadRouter from "./middleware/fileUpload.middleware.js";
import currencyRouter from "./routes/currency.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import invoiceRouter from "./routes/invoice.routes.js";
import eventRouter from "./routes/event.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import zatcaXmlInvoiceRouter from "./zatca/zatcaInvoiceXMLGenerate.js";
import clientMediaRouter from "./routes/clientmedia.routes.js";
import onboardClientRouter from "./routes/onboardclient.routes.js";
import myorgprofileRouter from "./routes/myorgprofile.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/upload", fileUploadRouter);
app.use("/api/v1/clients", clientRouter);
app.use("/api/v1/accounts", accountRouter);
app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1/currencies", currencyRouter);
app.use("/api/v1/invoices", invoiceRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/monthly-income", analyticsRouter);
app.use("/api/v1/generateXMLInvoices", zatcaXmlInvoiceRouter);
app.use("/api/v1/clientmedias", clientMediaRouter);
app.use("/api/v1/myorgprofile", myorgprofileRouter);
app.use("/api/zatca/onboardClient", onboardClientRouter);

const startServer = async () => {
  try {
    //connect to database
    connectDB(process.env.MONGODB_URL);

    const port = process.env.PORT || 8080;

    app.listen(port, () => console.log(`Server has started on port: ${port}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
