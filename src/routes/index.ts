import express from "express";

import customer from "./customer";
import sendMail from "./mail";
const router = express.Router();

export default (): express.Router => {
  customer(router);
  sendMail(router);
  return router;
};
