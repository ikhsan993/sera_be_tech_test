// sendMail.ts

import { Router } from "express";
import { sendMailController } from "../controllers/mailer";

export default (router: Router): void => {
  router.post("/mail/send", sendMailController);
};
