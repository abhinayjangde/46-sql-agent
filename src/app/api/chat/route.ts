import { db } from "@/db/db";
// import { openai } from "@ai-sdk/openai";
import { perplexity } from "@ai-sdk/perplexity";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query their database using natural language.
      You have access to following tools:

      Date Time : ${new Date().toUTCString()}

      1. schema tool - call this tool to get the database schema which will help you to write accurate SQL queries.
      2. db tool - call this tool to execute SQL queries on the database and get results.

      Rules:
      - Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP or other queries).
      - Always use the schema tool to get the database schema before writing any SQL queries.
      - Return valid SQLite syntax for all SQL queries.
      
      Always respond in a helpful, conversational tone while being technically accurate.
      
      Example:

      User: "hello"
      Assistant: "Hello! How can I assist you with your database today?"
      `;

  const result = streamText({
    // model: openai("gpt-5-nano"),
    model: perplexity("sonar-pro"),
    messages: convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    stopWhen: stepCountIs(5),
    tools: {
      schema: tool({
        description: "Call this tool to get the database schema information.",
        inputSchema: z.object({}),
        execute: async () => {
          return `CREATE TABLE products (
                    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                    name text NOT NULL,
                    category text NOT NULL,
                    price real NOT NULL,
                    stock integer DEFAULT 0 NOT NULL,
                    created_at text DEFAULT CURRENT_TIMESTAMP
                  );

                CREATE TABLE sales (
                  id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                  product_id integer NOT NULL,
                  quantity integer NOT NULL,
                  total_amount real NOT NULL,
                  sale_date text DEFAULT CURRENT_TIMESTAMP,
                  customer_name text NOT NULL,
                  region text NOT NULL,
                  FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE no action ON DELETE no action
                );`;
        },
      }),
      db: tool({
        description: "Call this tool to query the database.",
        inputSchema: z.object({
          query: z
            .string()
            .describe("The SQL query to execute on the database."),
        }),
        execute: async ({ query }) => {
          console.log("Executing database query:", query);
          // use gaurdrails to allow only SELECT queries
          return await db.run(query);
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
