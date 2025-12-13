import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!process.env.CEREBRAS_API_KEY) {
    return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CEREBRAS_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b",
        messages: [
          {
            role: "system",
            content: `You are a Senior Software Architect. The user wants to build a project. 
            Identify ambiguous technical details and ask 3 multiple-choice questions to clarify.
            
            Return a STRICT JSON object:
            {
              "analysis": "Brief summary of the request (max 15 words)",
              "questions": [
                {
                  "id": "q1",
                  "question": "Which database do you prefer?",
                  "options": ["Option A", "Option B"]
                }
              ]
            }`
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    const plan = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(plan);

  } catch (error) {
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}