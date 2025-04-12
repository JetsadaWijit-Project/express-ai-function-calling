import axios from 'axios';

function get_time(timezone = "Asia/Bangkok") {
  try {
    const now = new Date();
    const localTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
    return `Current time in ${timezone}: ${localTime.toLocaleTimeString()}`;
  } catch (err) {
    return `Invalid timezone "${timezone}". Try something like "Asia/Bangkok" or "America/New_York".`;
  }
}

export async function deepSeekFunctionCall(prompt) {
  const response = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a helpful assistant. You may call tools to get the current time based on timezone." },
        { role: "user", content: prompt }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "get_time",
            description: "Get the current time of a given timezone",
            parameters: {
              type: "object",
              properties: {
                timezone: {
                  type: "string",
                  description: "The IANA timezone string like Asia/Bangkok or America/New_York"
                }
              },
              required: ["timezone"]
            }
          }
        }
      ],
      tool_choice: "auto"
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const message = response.data.choices[0].message;

  if (message.tool_calls) {
    const toolCall = message.tool_calls[0];
    const functionName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments || "{}");

    if (functionName === "get_time") {
      return get_time(args.timezone);
    } else {
      return `Function called: ${functionName} — but it is not implemented.`;
    }
  }

  return message.content;
}
