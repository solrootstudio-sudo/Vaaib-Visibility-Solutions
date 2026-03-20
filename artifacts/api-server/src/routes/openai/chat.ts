import { Router, type IRouter } from "express";
import { db, conversations as conversationsTable, messages as messagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import { SendOpenaiMessageBody, CreateOpenaiConversationBody } from "@workspace/api-zod";

const router: IRouter = Router();

const VAAIB_SYSTEM_PROMPT = `You are Vai, a friendly and knowledgeable AI assistant for VAAIB — a service that helps small businesses thrive in the AI era by building AI-optimized websites and digital presences.

Your role is to:
- Welcome visitors warmly and help them understand how AI is changing online discovery
- Answer questions about VAAIB's three packages clearly and confidently
- Guide interested visitors toward booking a consultation via the contact form on this page
- Be conversational, encouraging, and never pushy

VAAIB's packages:
1. **Starter Site** — $247 one-time
   A 1-page responsive website optimized for AI discovery. Includes AI-optimized content, basic SEO metadata, contact form, and 30 days of support. Perfect for new or small businesses just getting started.

2. **Pro Presence** — $597 one-time (Most Popular)
   Up to 5 pages with advanced AI content optimization, full SEO suite, blog/news section, analytics integration, and 90 days of support. Great for established businesses ready to grow.

3. **AI Authority** — $1,197 one-time
   The complete package. Unlimited pages, custom AI chatbot integration, automated AI content pipeline, voice search optimization, custom AI personas, and 6 months of support with quarterly reviews. For businesses that want to fully dominate AI-driven discovery.

Key facts about VAAIB:
- All packages are one-time fees — no hidden monthly retainers
- VAAIB doesn't just build websites; it engineers digital presences designed to be recommended by AI models like ChatGPT, Claude, and Gemini
- Traditional SEO takes 6+ months; VAAIB's AI indexing approach works much faster

Keep your answers concise and friendly. If someone is unsure which package suits them, ask a couple of simple questions about their business size and goals, then recommend the best fit. Always suggest they fill out the contact form to get started.`;

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

  const history = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, id));

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
