import { Router, type IRouter } from "express";
import { db, contactsTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: "Invalid submission data" });
    return;
  }

  const { name, email, businessName, message, packageInterest } = parsed.data;

  const [contact] = await db
    .insert(contactsTable)
    .values({
      name,
      email,
      businessName: businessName,
      message,
      packageInterest: packageInterest ?? "general",
    })
    .returning({ id: contactsTable.id });

  res.status(201).json({
    id: contact.id,
    message: "Thank you! We'll be in touch shortly.",
  });
});

export default router;
