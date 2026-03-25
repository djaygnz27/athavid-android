import { Webhook } from "https://deno.land/x/fresh@1.6.8/src/server.ts";

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { message } = body;

  if (!message) {
    return new Response("No message provided", { status: 400 });
  }

  // Send to user's WhatsApp via Base44 messaging bridge
  try {
    const response = await fetch("https://api.base44.com/v1/messaging/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("BASE44_API_TOKEN")}`,
      },
      body: JSON.stringify({
        channels: ["whatsapp"],
        message: message,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send WhatsApp message:", response.statusText);
      return new Response(`Failed: ${response.statusText}`, { status: 500 });
    }

    return new Response("WhatsApp message sent", { status: 200 });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
