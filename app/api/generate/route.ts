import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { topic, tone, type } = await req.json();

  // Build your prompt based on input
  let prompt = `Write a ${type === "thread" ? "Twitter thread (5 tweets)" : "single tweet"} about "${topic}" in a "${tone}" tone.`;
  if (tone === "default") prompt = prompt.replace('in a "default" tone.', "");

  // Call OpenAI
  const apiKey = process.env.OPENAI_API_KEY;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: type === "thread" ? 500 : 100,
      temperature: 0.9,
    }),
  });

  const data = await response.json();
  // If there's an error in OpenAI response, show it in the output
  if (data.error) {
    return NextResponse.json({ result: `OpenAI Error: ${data.error.message}` });
  }
  const result = data.choices?.[0]?.message?.content || "No response from AI.";
  return NextResponse.json({ result });
}