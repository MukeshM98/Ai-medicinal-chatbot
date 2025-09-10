
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { startChatSession } from '../services/geminiService';
import type { AnalysisResult, ChatMessage } from '../types';
import { ChatIcon } from './icons/ChatIcon';
import Spinner from './Spinner';

interface ChatbotProps {
  analysisResult: AnalysisResult;
}

const Chatbot: React.FC<ChatbotProps> = ({ analysisResult }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = () => {
      try {
        const chatSession = startChatSession(analysisResult);
        setChat(chatSession);
        setMessages([
          { sender: 'ai', text: `Hi ${analysisResult.patientInfo.name}! I'm here to help. Ask me anything about your health report.` }
        ]);
      } catch (error) {
        console.error("Failed to initialize chat session:", error);
        setMessages([{ sender: 'ai', text: 'Sorry, I am unable to connect right now.' }]);
      }
    };
    initChat();
  }, [analysisResult]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
        const responseStream = await chat.sendMessageStream({ message: userInput });
        
        let aiResponseText = '';
        setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

        for await (const chunk of responseStream) {
            aiResponseText += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { sender: 'ai', text: aiResponseText };
                return newMessages;
            });
        }
    } catch (error) {
        console.error("Error sending message:", error);
        setMessages(prev => [...prev, { sender: 'ai', text: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
        setIsLoading(false);
    }
  }, [userInput, chat, isLoading]);

  return (
    <div className="flex flex-col h-[32rem]">
      <div className="flex items-center p-4 bg-slate-100 border-b border-slate-200 rounded-t-lg">
        <ChatIcon className="h-6 w-6 text-indigo-600" />
        <h3 className="ml-3 text-lg font-semibold text-slate-800">Ask a Question</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-white space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-800'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
         {isLoading && messages[messages.length - 1]?.sender === 'user' && (
           <div className="flex justify-start">
             <div className="max-w-xs md:max-w-md px-4 py-2 rounded-xl bg-slate-100 text-slate-800">
               <Spinner size="sm" />
             </div>
           </div>
         )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-slate-200 rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="What does HDL mean?"
            className="flex-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
