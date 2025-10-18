import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query their database using natural language.
      You have access to following tools:

      1. schema tool - call this tool to get the database schema which will help you to write accurate SQL queries.
      2. db tool - call this tool to execute SQL queries on the database and get results.

      Rules:
      - Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP or other queries).
      - Always use the schema tool to get the database schema before writing any SQL queries.
      - Return valid SQLite syntax for all SQL queries.
      
      Always respond in a helpful, conversational tone while being technically accurate.`;

  const result = streamText({
    model: openai("gpt-5-nano"),
    messages: convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    tools: {
      db: tool({
        description: "Call this tool to query the database.",
        inputSchema: z.object({
          query: z
            .string()
            .describe("The SQL query to execute on the database."),
        }),
        execute: async ({ query }) => {
          console.log("Executing database query:", query);
          // Simulate a database query execution
          const fakeDatabaseResponse = {
            rows: [
              { id: 1, name: "Alice" },
              { id: 2, name: "Bob" },
            ],
          };
          return JSON.stringify(fakeDatabaseResponse);
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
