import axios from 'axios';

export async function deepSeekFunctionCall(prompt) {
  const result = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a helpful assistant with function calling." },
        { role: "user", content: prompt }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "get_time",
            description: "Get the current time",
            parameters: {
              type: "object",
              properties: {}
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

  const message = result.data.choices[0].message;
  if (message.tool_calls) {
    return `Function Called: ${message.tool_calls[0].function.name}`;
  }
  return message.content;
}
