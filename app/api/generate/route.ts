import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { angerTriggers, frequency, severity, physicalSymptoms, previousAttempts, supportSystem, courtOrdered } = body;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are a professional anger management program assistant. Generate a comprehensive, structured anger management program based on the provided information. Include all sections below in well-structured markdown format.

Output must include ALL of the following:
1. Trigger Awareness Plan
2. Warning Sign Identification
3. De-escalation Techniques
4. Coping Strategies by Situation Type
5. Progress Tracking Chart
6. Referral Resources

Be evidence-based, use clinical terminology appropriately, and format everything in clear markdown with headers and bullet points.`,
        },
        {
          role: "user",
          content: `Generate an anger management plan with the following details:

Anger Triggers: ${angerTriggers || "Not specified"}
Frequency of Episodes: ${frequency || "Not specified"}
Severity Level (1-10): ${severity || "Not specified"}
Physical Symptoms: ${physicalSymptoms || "Not specified"}
Previous Attempts: ${previousAttempts || "Not specified"}
Support System: ${supportSystem || "Not specified"}
Court-Ordered or Voluntary: ${courtOrdered || "Not specified"}`,
        },
      ],
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || "No response generated.";
    return Response.json({ result });
  } catch (error: unknown) {
    console.error("Generate error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
