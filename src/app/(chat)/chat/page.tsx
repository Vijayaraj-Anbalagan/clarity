'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MetricControlDialogWithToggle } from '@/components/metricControl';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Mic,
  Paperclip,
  Send,
  Heart,
  Smile,
  ChevronLeft,
  User,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const sampleQueries = [
  {
    id: 1,
    title: 'HR Policy Update',
    snippet: 'Can you provide the latest HR policy updates for 2023?',
    date: '2023-06-11',
  },
  {
    id: 2,
    title: 'IT Support Request',
    snippet: 'How do I reset my company email password?',
    date: '2023-06-12',
  },
  {
    id: 3,
    title: 'Leave Policy Clarification',
    snippet: 'How many sick leaves are allowed per year?',
    date: '2023-06-13',
  },
];

export default function ChatInterface() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { role: string; message: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>('user123');

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };
  const [sessionId, setSessionId] = useState<string | null>(null); // Store session ID

  // Function to start a new chat session
  const startNewChat = async () => {
    setChatHistory([]);
    await axios
      .post('/api/gemini/new-session', {
        userId,
      })
      .then((response) => {
        console.log(response.data);
        setSessionId(response.data.sessionId); // Store new session ID
      })
      .catch((error) => {
        console.error('Error starting new chat:', error);
      });
  };

  const sendMessageToAPI = async (prompt: string) => {
    setChatHistory([...chatHistory, { role: 'user', message: prompt }]);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/gemini/chat', {
        prompt,
        history: chatHistory,
        userId,
        sessionId, // Send the session ID with the request
      });

      const botResponse = response.data.response;

      // Append user's prompt and bot's response to the chat history
      setChatHistory([
        ...chatHistory,
        { role: 'user', message: prompt },
        { role: 'model', message: botResponse },
      ]);
    } catch (error) {
      console.error('Error communicating with the API:', error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'model',
          message: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessageToAPI(inputValue);
      setInputValue('');
    }
  };

  useEffect(() => {
    fetchChatSessions();
  }, []);
  
  const fetchChatSessions = async () => {
    try {
      const response = await axios.get(`/api/chat/sessions?userId=${userId}`);
      
      setChatSessions(response.data.sessions);
      setChatHistory(response.data.sessions[0].messages);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    }
  };

  const handleChatSessionClick = async (sessionId: string) => {
    console.log(sessionId);
    try {
      const sessionChatHistory = await axios.get(
        `/api/chat/sessions/${sessionId}`
      );
      console.log(sessionChatHistory.data);
      setChatHistory(sessionChatHistory.data.messages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Chat History Panel */}
      <div className="w-80 bg-stone-950 border-r border-stone-800 flex flex-col">
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <Button
            onClick={startNewChat}
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            +
          </Button>
          <div className="p-4 border-b border-stone-800">
            <Input
              type="text"
              placeholder="Search conversations"
              className="w-full bg-stone-900 text-white border-stone-700 placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400"
            />
          </div>
        </div>
        <ScrollArea className="flex-grow">
          {chatSessions.map((query) => (
            <div
              key={query._id}
              onClick={() => handleChatSessionClick(query.sessionId)}
              className="p-4 border-b border-stone-800 hover:bg-stone-900 cursor-pointer transition-colors duration-200"
            >
              <div className="font-semibold text-white">
                {query.sessionName}
              </div>
              <div className="text-sm text-gray-500">
                {query.messages[0]?.message}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {new Date(query.updatedAt)
                  .toLocaleDateString('en-GB')
                  .replace(/\//g, '/')}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <header className="bg-stone-950 border-b border-stone-800 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4 text-white hover:text-yellow-400" />
            </Button>
            <h1 className="text-2xl font-bold text-yellow-400">Clarity</h1>
          </div>
          <div className="flex items-center space-x-4">
            <MetricControlDialogWithToggle />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4 text-white hover:text-yellow-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 bg-stone-900 border border-stone-700 text-white">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-stone-800"
                  >
                    Account Settings
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-white hover:bg-stone-800"
                  >
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* Chat Messages */}
        <ScrollArea className="flex-grow p-4 space-y-4">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex ${
                chat.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  chat.role === 'user'
                    ? 'bg-yellow-400 text-black'
                    : 'bg-stone-800 text-white'
                }`}
              >
                {chat.message}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-yellow-400">Typing...</div>}
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-stone-950 p-4 border-t border-stone-800">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow bg-stone-900 text-white border border-stone-700 placeholder-gray-500 focus:ring-yellow-400 focus:border-yellow-400"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-yellow-400 hover:bg-yellow-500 text-black"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
