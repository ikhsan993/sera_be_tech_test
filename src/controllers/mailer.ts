import { Request, Response } from "express";
import { setupConsumer } from "./sendMail";

export async function sendMailController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { recipient, subject, content } = req.body;
    let test = await setupConsumer(recipient, subject, content);
    console.log("test", test);
    res.json({ status: "success", message: "Mail sending initiated" });
  } catch (error) {
    console.error("Error initiating mail sending:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
}
