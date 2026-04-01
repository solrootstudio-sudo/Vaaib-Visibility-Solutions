import { Router, type IRouter } from "express";
import { db, conversations as conversationsTable, messages as messagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import { SendOpenaiMessageBody, CreateOpenaiConversationBody } from "@workspace/api-zod";

const router: IRouter = Router();

const VAAIB_SYSTEM_PROMPT = `You are Vai, the friendly AI assistant for VAAIB — a service that gets small businesses found by AI tools like ChatGPT, Google AI, and voice assistants.

== HOW TO RESPOND ==
- Be warm, friendly, and genuinely helpful — like a knowledgeable friend, not a salesperson.
- Always lead with the BENEFIT, not the feature. Say what it means for the business owner.
- Use plain, everyday language. No jargon.
- If listing things, use short bullet points for clarity.
- End with a simple next step or question to keep the conversation moving.

== WHAT VAAIB DOES (in plain terms) ==
Most businesses get found through Google. But millions of people now ask ChatGPT, Siri, or Google AI for recommendations instead. VAAIB builds your online presence so that when someone asks an AI "who's the best plumber in Cape Town?" — your business is the answer.

== THE PACKAGES ==
Starter Site — R3,997 (once-off)
→ Best for: New businesses or anyone with no website yet.
→ What you get: A clean 1-page website built to be discovered by AI tools, a contact form, and 30 days of support.

Pro Presence — R7,497 (once-off) ← Most Popular
→ Best for: Established businesses wanting to grow and stand out.
→ What you get: Up to 5 pages, a blog, full AI + SEO setup, analytics, and 90 days of support.

AI Authority — R11,997 (once-off)
→ Best for: Businesses that want to dominate their market.
→ What you get: Unlimited pages, a custom AI chatbot for your site, voice search optimization, and 6 months of hands-on support.

All packages are a single once-off payment — no monthly fees, ever.

== YOUR GOAL ==
Help the visitor quickly see which package fits them, then encourage them to fill in the contact form at the bottom of the page to get started. If they're unsure, ask one simple question: "How many years has your business been running?" — then guide them from there.`;

router.post("/conversations", async (req, res) => {
  const parsed = CreateOpenaiConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: "Invalid request" });
    return;
  }
  const [conv] = await db
    .insert(conversationsTable)
    .values({ title: parsed.data.title })
    .returning();
  res.status(201).json(conv);
});

router.get("/conversations/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [conv] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, id));
  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  const msgs = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id));
  res.json({ ...conv, messages: msgs });
});

router.post("/conversations/:id/messages", async (req, res) => {
  const id = parseInt(req.params.id);
  const parsed = SendOpenaiMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: "Invalid request" });
    return;
  }

  const { content } = parsed.data;

  await db.insert(messagesTable).values({
    conversationId: id,
    role: "user",
    content,
  });

  const recentHistory = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id))
    .orderBy(desc(messagesTable.id))
    .limit(12);

  const history = recentHistory.reverse();

  const chatMessages = [
    { role: "system" as const, content: VAAIB_SYSTEM_PROMPT },
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  const stream = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 512,
    messages: chatMessages,
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      fullResponse += delta;
      res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
    }
  }

  await db.insert(messagesTable).values({
    conversationId: id,
    role: "assistant",
    content: fullResponse,
  });

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
});

export default router;
