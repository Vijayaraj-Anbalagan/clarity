'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Mic, Paperclip, Send, Heart, Smile, ChevronLeft, ChevronRight, MoreVertical, User } from 'lucide-react'

export function ChatInterface() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat History Panel */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Input type="text" placeholder="Search conversations" className="w-full pl-10" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>
        <ScrollArea className="flex-grow">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
              <div className="font-semibold">Chat Session {i}</div>
              <div className="text-sm text-gray-500">Last message snippet...</div>
              <div className="text-xs text-gray-400 mt-1">2023-06-{10 + i}</div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Clarity</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Toggle aria-label="Toggle empathy mode">
              <Heart className="h-4 w-4" />
              Empathy Mode
            </Toggle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">Account Settings</Button>
                  <Button variant="ghost" className="w-full justify-start">Logout</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* Chat Messages */}
        <ScrollArea className="flex-grow p-4 space-y-4">
          <div className="flex justify-start">
            <div className="bg-yellow-100 rounded-lg p-3 max-w-[70%]">
              <p>Hello! How can I assist you today?</p>
              <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                <span>10:00 AM</span>
                <Heart className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-white rounded-lg p-3 max-w-[70%] shadow">
              <p>I have a question about our companys vacation policy.</p>
              <div className="text-xs text-gray-500 mt-1">10:01 AM</div>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-yellow-100 rounded-lg p-3 max-w-[70%]">
              <p>Of course! Id be happy to help you with information about our vacation policy. What specific aspect would you like to know more about?</p>
              <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                <span>10:02 AM</span>
                <Smile className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Quick Action Buttons */}
        <div className="bg-white p-2 border-t border-gray-200 flex justify-center space-x-2">
          <Button variant="outline" size="sm">Connect to HR</Button>
          <Button variant="outline" size="sm">View Policy</Button>
          <Button variant="outline" size="sm">Request Time Off</Button>
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Input type="text" placeholder="Type your message..." className="flex-grow" />
            <Button variant="ghost" size="icon">
              <Mic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}