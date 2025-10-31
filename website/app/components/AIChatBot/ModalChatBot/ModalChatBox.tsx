"use client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import { CHATBOT_BASE } from "@/src/config/api.config";
interface Message {
    type: "user" | "bot";
    text: string;
    image?: string;
    question?: string;
}
export default function ModalChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
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
            setMessages((prev) => [...prev, { type: "user", text: input }]);
            setInput("");
            setIsLoading(true);
            try {
                const response = await fetch(CHATBOT_BASE, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        prompt: input,
                        sessionId: sessionId,
                    }),
                });
                if (!response.ok)
                    throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                console.log(data);
                const botMessage: Message = {
                    type: "bot",
                    text: data.text || data.message || "",
                    image: data.image || undefined,
                    question: data?.question || undefined,
                };
                setMessages((prev) => [...prev, botMessage]);
            } catch (error) {
                console.error("Detailed error:", error);
                let errorMessage =
                    "Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn.";
                if (error instanceof Error) {
                    errorMessage += " Chi tiết: " + error.message;
                }
                setMessages((prev) => [
                    ...prev,
                    { type: "bot", text: errorMessage },
                ]);
            } finally {
                setIsLoading(false);
                setInput("");
            }
        }
    };

    return (
        <div className="z-[3000]">
            {/* Nút chat nổi */}
            <div className="fixed bottom-[60px] right-4">
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

            {/* Khung chat */}
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
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="font-bold">UI BOT</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <img
                                src="https://img.icons8.com/ios-filled/24/ffffff/external-link.png"
                                alt="expand"
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => setIsExpanded(!isExpanded)}
                            />
                            <span
                                className="text-xl font-bold cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                ×
                            </span>
                        </div>
                    </div>

                    {/* Nội dung chat */}
                    <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden space-y-2 bg-white">
                        {messages.map((msg, index) => (
                            <div key={index} className="flex items-start mb-3">
                                {msg.type === "bot" && (
                                    <img
                                        src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg"
                                        alt="Bot Avatar"
                                        className="w-8 h-8 mr-4 rounded-full"
                                    />
                                )}
                                <div
                                    className={`flex flex-col justify-center max-w-[85%] px-4 py-2 rounded-lg text-sm shadow ${
                                        msg.type === "bot"
                                            ? "bg-cyan-900 text-white self-start"
                                            : "bg-gray-200 text-black ml-auto"
                                    }`}
                                >
                                    {msg.type === "bot" ? (
                                        <div>
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ node, children }) => (
                                                        <p className="mb-2 leading-relaxed text-white">
                                                            {children}
                                                        </p>
                                                    ),
                                                    ul: ({
                                                        node,
                                                        children,
                                                    }) => (
                                                        <ul className="list-disc list-inside ml-4 text-white">
                                                            {children}
                                                        </ul>
                                                    ),
                                                    li: ({
                                                        node,
                                                        children,
                                                    }) => (
                                                        <li className="mb-1">
                                                            {children}
                                                        </li>
                                                    ),
                                                    strong: ({
                                                        node,
                                                        children,
                                                    }) => (
                                                        <strong className="font-semibold">
                                                            {children}
                                                        </strong>
                                                    ),
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>

                                            {/* Hiển thị ảnh nếu có */}
                                            {msg.image &&
                                                typeof msg.image ===
                                                    "string" && (
                                                    <img
                                                        src={msg.image}
                                                        alt=""
                                                        className="mt-2 w-full max-w-sm rounded-xl shadow-lg mx-auto"
                                                    />
                                                )}

                                            {msg?.question &&
                                                typeof msg?.question ===
                                                    "string" && (
                                                    <span>{msg?.question}</span>
                                                )}
                                        </div>
                                    ) : (
                                        <>
                                            <span>{msg.text}</span>
                                            <span>{msg.question}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="text-sm text-gray-500 italic">
                                Đang xử lý...
                            </div>
                        )}
                    </div>

                    {/* Ô nhập */}
                    <div className="p-3 border-t flex items-center gap-1">
                        <img
                            src="https://img.icons8.com/ios/50/007BFF/attach.png"
                            alt="attachment"
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => alert("Đính kèm tệp (demo)!")}
                        />

                        <TextareaAutosize
                            placeholder="Nhập tin nhắn ..."
                            className="flex-1 max-h-36 min-h-[40px] border border-cyan-900 rounded-l-full px-4 py-2 text-sm outline-none resize-none overflow-y-auto"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault(); // không xuống dòng nếu không giữ shift
                                    handleSend();
                                }
                            }}
                        />

                        <button
                            className="bg-cyan-900 text-white px-4 py-2 rounded-r-full"
                            onClick={handleSend}
                            disabled={isLoading}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
