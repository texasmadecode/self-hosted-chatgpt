import { useState } from "react";
import axios from "axios";

export default function ChatApp() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [usage, setUsage] = useState(0);

  const sendMessage = async () => {
    if (!apiKey || !input) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        apiKey,
        model,
        messages: newMessages,
      });

      setMessages([...newMessages, response.data]);
      setUsage(usage + JSON.stringify(response.data).length / 1000); // Approximate token cost
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Self-Hosted ChatGPT</h1>
      <input
        type="text"
        placeholder="Enter your OpenAI API Key"
        className="border p-2 w-full mb-2"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <select
        className="border p-2 w-full mb-2"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      >
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        <option value="gpt-4">GPT-4</option>
      </select>
      <div className="border p-2 h-64 overflow-auto mb-2">
        {messages.map((msg, index) => (
          <p key={index} className={msg.role === "user" ? "text-blue-500" : "text-green-500"}>
            {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        className="border p-2 w-full mb-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white p-2 w-full">
        Send
      </button>
      <p className="mt-2">Estimated Cost: ${usage.toFixed(2)}</p>
    </div>
  );
}
