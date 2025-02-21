'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, ChevronLeft, User, LogOut, Shield } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TypeAnimation } from 'react-type-animation';

export default function ChatInterface() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { role: string; message: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [isEmpathyMode, setisEmpathyMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleLogout = async () => {
    try {
      await axios.get('api/logout');
      router.replace('/');
    } catch (error: any) {
      console.error(error);
    }
  };

  const [sessionId, setSessionId] = useState<string | null>(null); // Store session ID

  const startNewChat = async () => {
    setChatHistory([]);
    await axios
      .get('/api/gemini/new-session')
      .then((response) => {
        console.log(response.data);
        setSessionId(response.data.sessionId); // Store new session ID
      })
      .catch((error) => {
        console.error('Error starting new chat:', error);
      });
  };

  useEffect(() => {}, [userId]);

  // const sendMessageToAPI = async (query: string) => {
  //   setChatHistory((prevChatHistory) => [
  //     ...prevChatHistory,
  //     { role: 'user', message: query },
  //   ]);
  //   setIsLoading(true);

  //   try {
  //     // Define the payloads for the requests
  //     const langGraphPayload = JSON.stringify({
  //       query,
  //       history: chatHistory,
  //       sessionId,
  //     });

  //     const chunksRetrievalPayload = JSON.stringify({
  //       query,
  //     });

  //     // Trigger both API requests simultaneously using Promise.all
  //     const [langGraphResponse, chunksRetrievalResponse] = await Promise.all([
  //       fetch('/api/langgraph', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: langGraphPayload,
  //       }),
  //       fetch('https://80a7-117-96-40-60.ngrok-free.app/query', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: chunksRetrievalPayload,
  //       }),
  //     ]);

  //     // Check if both responses are successful
  //     if (!langGraphResponse.ok || !chunksRetrievalResponse.ok) {
  //       throw new Error('Failed to fetch one or more APIs');
  //     }

  //     // Parse JSON responses
  //     const langGraphData = await langGraphResponse.json();
  //     const chunksRetrievalData = await chunksRetrievalResponse.json();

  //     // Extract responses
  //     const botResponse = langGraphData.response;
  //     const chunksResponse = chunksRetrievalData.response;

  //     // Update the chat history with the bot's response
  //     setChatHistory((prevChatHistory) => [
  //       ...prevChatHistory,
  //       { role: 'model', message: botResponse },
  //     ]);

  //     // Optionally handle the chunks response
  //     console.log('Chunks retrieval response:', chunksResponse);

  //     // Update session ID if needed
  //     if (langGraphData.sessionId) {
  //       setSessionId(langGraphData.sessionId);
  //     }
  //   } catch (error) {
  //     console.error('Error communicating with the APIs:', error);

  //     // Add an error message to the chat history
  //     setChatHistory((prevChatHistory) => [
  //       ...prevChatHistory,
  //       {
  //         role: 'model',
  //         message: 'Sorry, something went wrong. Please try again.',
  //       },
  //     ]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const sendMessageToAPI = async (query: string) => {
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { role: 'user', message: query },
    ]);
    setIsLoading(true);

    const ragPayload = JSON.stringify({
      prompt: query,
      sessionId,
    });
    try {
      const botResponse = await axios.post('/api/llm', ragPayload);
      if (!botResponse) {
        throw new Error('Failed to fetch one or more APIs');
      }
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { role: 'model', message: botResponse.data.response },
      ]);
      if (botResponse.data.sessionId) {
        setSessionId(botResponse.data.sessionId);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error communicating with the APIs:', error);
      // Add an error message to the chat history
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
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
      const response = await axios.get(`/api/chat/sessions`);
      const user = await axios.get('/api/getCurrentUser');
      console.log('userid', user.data.user._id);
      setChatSessions(response.data.sessions);
      setChatHistory(response.data.sessions[0].messages);
      setUserId(user.data.user._id);
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

  const handleEmpathyModeToggle = () => {
    setisEmpathyMode((prev) => !prev);
  };

  return (
    <div
      className={`flex h-screen ${
        isEmpathyMode ? 'bg-[#FFE4E1] text-[#6D214F]' : 'bg-black text-white'
      }`}
    >
      {/* Sidebar for Chat History */}
      <div className="md:hidden absolute top-4 left-4 z-30">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`${
            isEmpathyMode
              ? 'bg-[#FFB6C1] hover:bg-[#FF8FAF] text-white'
              : 'bg-yellow-400 hover:bg-yellow-500 text-black'
          }`}
        >
          ☰
        </Button>
      </div>
      <div
        className={`fixed inset-y-0 left-0 z-30 min-w-80 transform transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isEmpathyMode
            ? 'bg-pink-100 border-pink-300'
            : 'bg-stone-950 border-stone-800'
        }`}
      >
        <div
          className={`p-4 ${
            isEmpathyMode ? 'border-pink-500' : 'border-stone-800'
          } flex items-center justify-between`}
        >
          <Button
            onClick={startNewChat}
            className={`${
              isEmpathyMode
                ? 'bg-[#FFB6C1] hover:bg-[#FF8FAF] text-white'
                : 'bg-yellow-400 hover:bg-yellow-500 text-black'
            }`}
          >
            +
          </Button>
          <Input
            type="text"
            placeholder="Search conversations"
            className={`w-full ${
              isEmpathyMode
                ? 'bg-pink-50 text-pink-900 border-pink-300 placeholder-pink-400 focus:ring-pink-400 focus:border-pink-400'
                : 'bg-stone-900 text-white border-stone-700 placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400'
            }`}
          />
        </div>
        <ScrollArea className="flex-grow">
          {chatSessions.map((query) => (
            <div
              key={query._id}
              onClick={() => handleChatSessionClick(query.sessionId)}
              className={`p-4 border-b ${
                isEmpathyMode
                  ? 'border-pink-300 hover:bg-pink-100'
                  : 'border-stone-800 hover:bg-stone-900'
              } cursor-pointer`}
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
      <div className="max-w-7xl flex-grow flex flex-col ml-0 ">
        {/* Header */}
        <header
          className={`p-4 border-b flex items-center justify-between ${
            isEmpathyMode
              ? 'bg-pink-100 border-pink-300'
              : 'bg-stone-950 border-stone-800'
          }`}
        >
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft
                className={`h-4 w-4 ${
                  isEmpathyMode
                    ? 'text-pink-900 hover:text-pink-500'
                    : 'text-white hover:text-yellow-400'
                }`}
              />
            </Button>
            <h1
              className={`text-2xl font-bold ${
                isEmpathyMode ? 'text-pink-700' : 'text-yellow-400'
              }`}
            >
              Clarity
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={
                    isEmpathyMode
                      ? 'text-pink-700 hover:text-pink-500'
                      : 'text-white hover:text-yellow-400'
                  }
                >
                  <User className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent
                className={`sm:max-w-[425px] ${
                  isEmpathyMode ? 'bg-pink-50' : 'bg-stone-900'
                }`}
              >
                <DialogHeader>
                  <DialogTitle
                    className={
                      isEmpathyMode ? 'text-pink-700' : 'text-yellow-400'
                    }
                  >
                    Profile Options
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Button
                    variant="ghost"
                    className={`flex justify-start items-center space-x-2 ${
                      isEmpathyMode
                        ? 'text-pink-700 hover:bg-pink-100'
                        : 'text-white hover:bg-yellow-400'
                    }`}
                    onClick={() => {
                      console.log('View profile');
                      setIsDialogOpen(false);
                    }}
                  >
                    <User className="h-5 w-5" />
                    <span>View Profile</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className={`flex justify-start items-center space-x-2 ${
                      isEmpathyMode
                        ? 'text-pink-700 hover:bg-pink-100'
                        : 'text-white hover:bg-yellow-400'
                    }`}
                    onClick={() => {
                      router.push('/2fa');
                      setIsDialogOpen(false);
                    }}
                  >
                    <Shield className="h-5 w-5" />
                    <span>Enable Two-Step Auth</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className={`flex justify-start items-center space-x-2 ${
                      isEmpathyMode
                        ? 'text-pink-700 hover:bg-pink-100'
                        : 'text-white hover:bg-yellow-400'
                    }`}
                    onClick={() => {
                      handleLogout();
                      setIsDialogOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Chat Messages */}
        <ScrollArea className="flex-grow p-4 space-y-4">
          <div className="bg-stone-800 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-yellow-400">
              Welcome to Clarity! 🎉
            </h2>
            <p className="text-sm text-gray-300">
              Im your AI assistant, here to help you with any questions or
              tasks. Heres how you can get started:
            </p>
            <ul className="list-disc list-inside mt-3 text-sm text-gray-400">
              <li>Type Tell me about the companys policy to learn more.</li>
              <li>Ask What are the common team rules? for team guidelines.</li>
              <li>
                Say Help me with project ideas for brainstorming assistance.
              </li>
            </ul>
            <p className="mt-3 text-sm text-gray-300">
              Feel free to ask anything or click the examples to get started!
            </p>
          </div>
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex mb-3 ${
                chat.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg shadow-md ${
                  chat.role === 'user'
                    ? isEmpathyMode
                      ? 'bg-[#FFB6C1] text-[#6D214F]'
                      : 'bg-yellow-600 text-black'
                    : isEmpathyMode
                    ? 'bg-[#F4A7B9] text-[#4A4A4A]'
                    : 'bg-stone-800 text-white'
                }`}
              >
                {chat.role === 'model' && index === chatHistory.length - 1 ? (
                  <TypeAnimation
                    sequence={[
                      chat.message, // Message to type out
                      () => {
                        // Callback to scroll to the bottom after typing
                        scrollToBottom();
                      },
                    ]}
                    speed={90} // Typing speed
                    wrapper="span"
                    repeat={0} // Do not repeat
                  />
                ) : (
                  <ReactMarkdown
                    // eslint-disable-next-line react/no-children-prop
                    children={chat.message}
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-sm prose-invert"
                  />
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="text-yellow-400 mt-3 animate-pulse">Typing...</div>
          )}
          <div ref={chatEndRef} />
        </ScrollArea>

        {/* Input Area */}
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleSendMessage();
              }
            }}
            className={`flex-grow ${
              isEmpathyMode
                ? 'bg-pink-50 text-pink-900 border-pink-300 placeholder-pink-400 focus:ring-pink-400 focus:border-pink-400'
                : 'bg-stone-900 text-white border border-stone-700 placeholder-gray-500 focus:ring-yellow-400 focus:border-yellow-400'
            }`}
          />
          <Button
            onClick={handleSendMessage}
            className={`${
              isEmpathyMode
                ? 'bg-[#FFB6C1] hover:bg-[#FF8FAF] text-white'
                : 'bg-yellow-400 hover:bg-yellow-500 text-black'
            }`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
