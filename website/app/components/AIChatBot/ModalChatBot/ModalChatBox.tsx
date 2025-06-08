"use client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Message {
    type: "user" | "bot";
    text: string;
    image?: string;
}
export default function ModalChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        let sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
            sessionId = uuidv4();
            localStorage.setItem("sessionId", sessionId);
        }
        setSessionId(sessionId);
    }, []);
    const handleSend = async () => {
        if (input.trim()) {
            // Add message user
            setMessages([...messages, { type: "user", text: input }]);
            setInput("");
            // Add message Bot
            try {
                const response = await fetch(
                    "https://nguyenvanhuyn8n.app.n8n.cloud/webhook/71bc1b76-7c2b-4f16-b54a-6abb092ef0c6",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify({
                            prompt: input,
                            sessionId: sessionId,
                        }),
                    }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Add bot response
                const botMessage: Message = {
                    type: "bot",
                    text: data.text || data.message || "No response text",
                };

                setMessages((prev) => [...prev, botMessage]);
            } catch (error) {
                console.error("Detailed error:", error);
                let errorMessage =
                    "Sorry, there was an error processing your request.";

                if (error instanceof Error) {
                    errorMessage += " Details: " + error.message;
                }

                setMessages((prev) => [
                    ...prev,
                    {
                        type: "bot",
                        text: errorMessage,
                    },
                ]);
            } finally {
                setIsLoading(false);
                setInput("");
            }
        }
    };

    return (
        <div>
            {/* Chat bubble button */}
            <div className="fixed bottom-[60px] right-4 z-50">
                <button
                    className="w-14 h-14 rounded-full bg-slate-900 shadow-lg flex items-center justify-center hover:bg-slate-800 transition"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <span className="text-white text-2xl">×</span>
                    ) : (
                        <img
                            src="https://img.icons8.com/ios-filled/50/ffffff/speech-bubble--v1.png"
                            alt="chat icon"
                            className="w-6 h-6"
                        />
                    )}
                </button>
            </div>

            {/* Chat box */}
            {isOpen && (
                <div
                    className={`fixed bottom-[100px] right-7 ${
                        isExpanded ? "w-[90%] h-[80vh]" : "w-80 h-[28rem]"
                    } bg-white rounded-lg shadow-xl flex flex-col overflow-hidden z-40 transition-all duration-300`}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-500 to-purple-700 text-white p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <img
                                src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg"
                                alt="bot"
                                className="w-8 h-8  rounded-full"
                            />
                            <span className="font-bold">UI BOT</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            {/* Mở rộng */}
                            <img
                                src="https://img.icons8.com/ios-filled/24/ffffff/external-link.png"
                                alt="expand"
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => setIsExpanded(!isExpanded)}
                            />
                            {/* Đóng */}
                            <span
                                className="text-xl font-bold cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                ×
                            </span>
                        </div>
                    </div>

                    {/* Chat content */}
                    <div className="p-4 flex-1 overflow-y-auto space-y-2 bg-white">
                        {messages.map((msg, index) => (
                            <div key={index} className="flex items-start mb-3">
                                {msg.type === "bot" && (
                                    <img
                                        src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg" // Replace with your robot avatar URL
                                        alt="Bot Avatar"
                                        className="w-8 h-8 mr-4  rounded-full" // Increased size of avatar
                                    />
                                )}
                                <div
                                    className={`flex flex-col justify-center max-w-[75%] px-4 py-2 rounded-lg text-sm shadow ${
                                        msg.type === "bot"
                                            ? "bg-cyan-900 text-white self-start"
                                            : "bg-gray-200 text-black ml-auto"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                                {msg.type !== "bot" && (
                                    <img
                                        src="https://via.placeholder.com/30" // Replace with user avatar URL or remove if not needed
                                        alt="User Avatar"
                                        className="w-6 h-6 ml-2 rounded-full hidden" // Hidden for now, can be enabled if needed
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t flex items-center gap-1">
                        <img
                            src="https://img.icons8.com/ios/50/007BFF/attach.png"
                            alt="attachment"
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => alert("Đính kèm tệp (demo)!")}
                        />
                        <input
                            type="text"
                            placeholder="Type a message ..."
                            className="flex-1 border border-cyan-900 rounded-l-full px-4 py-1 text-sm outline-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            autoComplete="off"
                        />
                        <button
                            className="bg-cyan-900 text-white px-4 py-2 rounded-r-full"
                            onClick={handleSend}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
