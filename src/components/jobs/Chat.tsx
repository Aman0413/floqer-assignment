// src/components/Chat.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages([...messages, userMessage]);
        setInput('');

        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [...messages, userMessage],
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            });

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.data.choices[0].message.content,
            };

            setMessages([...messages, userMessage, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto border rounded-lg overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-3 my-2 rounded-md ${msg.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-900 self-start'}`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="flex p-4 border-t">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 p-2 border rounded-md"
                />
                <button onClick={handleSend} className="ml-4 p-2 bg-green-500 text-white rounded-md">Send</button>
            </div>
        </div>
    );
};

export default Chat;
