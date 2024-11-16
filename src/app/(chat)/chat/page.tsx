import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MetricControlDialogWithToggle } from "@/components/metricControl";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {  Mic, Paperclip, Send, Heart, Smile, ChevronLeft, User } from 'lucide-react';
const sampleQueries = [
  {
    id: 1,
    title: "HR Policy Update",
    snippet: "Can you provide the latest HR policy updates for 2023?",
    date: "2023-06-11",
  },
  {
    id: 2,
    title: "IT Support Request",
    snippet: "How do I reset my company email password?",
    date: "2023-06-12",
  },
  {
    id: 3,
    title: "Leave Policy Clarification",
    snippet: "How many sick leaves are allowed per year?",
    date: "2023-06-13",
  },
  {
    id: 4,
    title: "Payroll Inquiry",
    snippet: "When is the payroll processing date for this month?",
    date: "2023-06-14",
  },
  {
    id: 5,
    title: "Training Program Schedule",
    snippet: "What are the upcoming training programs for new employees?",
    date: "2023-06-15",
  },
  {
    id: 6,
    title: "Data Privacy Concern",
    snippet: "How is employee data protected under the new IT policy?",
    date: "2023-06-16",
  },
  {
    id: 7,
    title: "Company Event Details",
    snippet: "What are the details of the annual company event?",
    date: "2023-06-17",
  },
  {
    id: 8,
    title: "Health and Safety Protocol",
    snippet: "What are the updated health and safety measures for COVID-19?",
    date: "2023-06-18",
  },
];




export default function ChatInterface() {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Chat History Panel */}
      <div className="w-80 bg-stone-950 border-r border-stone-800 flex flex-col">
        <div className="p-4 border-b border-stone-800">
          <Input
            type="text"
            placeholder="Search conversations"
            className="w-full bg-stone-900 text-white border-stone-700 placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400"
           
          />
        </div>
        <ScrollArea className="flex-grow">
        {sampleQueries.map((query) => (
  <div
    key={query.id}
    className="p-4 border-b border-stone-800 hover:bg-stone-900 cursor-pointer transition-colors duration-200"
  >
    <div className="font-semibold text-white">{query.title}</div>
    <div className="text-sm text-gray-500">{query.snippet}</div>
    <div className="text-xs text-gray-600 mt-1">{query.date}</div>
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
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-stone-800">Account Settings</Button>
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-stone-800">Logout</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* Chat Messages */}
        <ScrollArea className="flex-grow p-4 space-y-4">
          <div className="flex justify-start">
            <div className="bg-yellow-400 rounded-lg p-3 max-w-[70%] mb-5">
              <p className="text-black">Hello! How can I assist you today?</p>
              <div className="text-xs text-black mt-1 flex items-center justify-between">
                <span>10:00 AM</span>
                <Heart className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-stone-900 rounded-lg p-3 max-w-[70%] shadow mb-5">
              <p className="text-white">I have a question about our companys vacation policy.</p>
              <div className="text-xs text-gray-500 mt-1">10:01 AM</div>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-yellow-400 rounded-lg p-3 max-w-[70%]">
              <p className="text-black">Of course! Id be happy to help you with information about our vacation policy. What specific aspect would you like to know more about?</p>
              <div className="text-xs text-black mt-1 flex items-center justify-between">
                <span>10:02 AM</span>
                <Smile className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Quick Action Buttons */}
        <div className="bg-stone-950 p-2 border-t border-stone-800 flex justify-center space-x-2">
          <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-colors duration-200 bg-black">
            Connect to HR
          </Button>
          <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-colors duration-200 bg-black">
            View Policy
          </Button>
          <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-colors duration-200 bg-black">
            Request Time Off
          </Button>
        </div>

        {/* Input Area */}
        <div className="bg-stone-950 p-4 border-t border-stone-800">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              className="flex-grow bg-stone-900 text-white border border-stone-700 placeholder-gray-500 focus:ring-yellow-400 focus:border-yellow-400"
            />
            <Button variant="ghost" size="icon">
              <Mic className="h-4 w-4 text-white hover:text-yellow-400" />
            </Button>
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4 text-white hover:text-yellow-400" />
            </Button>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
