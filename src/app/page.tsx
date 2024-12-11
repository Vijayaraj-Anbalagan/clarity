'use client';

import React, { useState } from "react";
import { FaRobot, FaCogs, FaDatabase, FaChartLine } from "react-icons/fa";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FlickeringGrid from "@/components/ui/flickering-grid";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { ChevronRight } from "lucide-react";

const navItems = ["Features", "About", "Contact"]

const LandingPage: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col">
      <FlickeringGrid
        className="absolute inset-0 w-full h-full z-0"
        squareSize={2}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.3}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-20 bg-black/90 backdrop-blur-lg border-b border-gray-700 flex justify-between items-center p-4">
      <div className="text-2xl font-bold text-yellow-400">Clarity</div>
      <div className="flex space-x-4">
        {navItems.map((item) => (
          <Link
        key={item}
        href={`#${item.toLowerCase()}`}
        className="relative"
        onMouseEnter={() => setHoveredItem(item)}
        onMouseLeave={() => setHoveredItem(null)}
          >
        <span className="relative z-10 text-white transition-colors duration-300 ease-in-out px-4 py-2 rounded-full">
          {item}
        </span>
        <span
          className={`absolute inset-0 rounded-full transition-all duration-300 ease-in-out ${
          hoveredItem === item
        ? 'opacity-100 border border-yellow-400 p-1'
        : 'opacity-0 border border-transparent'
          }`}
        />
        <span
          className={`absolute inset-0 rounded-full transition-all duration-300 ease-in-out ${
          hoveredItem === item
        ? 'opacity-60 bg-gradient-to-t from-yellow-400 to-black p-2'
        : 'opacity-0'
          }`}
        />
          </Link>
        ))}
      </div>
        </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center py-20 px-4 relative z-10">
        <div className="z-10 flex items-center justify-center">
          <div
            className={cn(
              "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            )}
          >
            <AnimatedGradientText>
              🎉 <hr className="mx-2 h-4 w-px shrink-0" />{""}
              <span
                className={cn(
                  `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#ffa04f] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
                )}
              >
               Introducing Clarity
              </span>
              <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedGradientText>
          </div>
        </div>
        <h1 className="text-5xl font-extrabold mb-4 mt-6">
          Enhance Your Enterprise with <span className="text-yellow-400">Clarity</span>
        </h1>
        <p className="text-lg max-w-2xl mb-8">
          AI-driven assistant for seamless employee engagement, real-time insights, and automated workflows.
        </p>
        <Link
          className="border-2 border-yellow-400 text-yellow-400 px-6 py-3 rounded-md font-bold shadow-lg transform hover:scale-105 transition-transform duration-300 hover:bg-yellow-400 hover:text-black"
          href={"/login"}
        >
          Get Started
        </Link>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[{ Icon: FaRobot, title: "AI-Powered Chatbot", description: "Interact with an intelligent, context-aware assistant designed to provide precise information and support." },
            { Icon: FaCogs, title: "Workflow Automation", description: "Automate repetitive tasks and workflows, freeing up time for more critical activities." },
            { Icon: FaDatabase, title: "Real-Time Data Integration", description: "Seamlessly integrate and synchronize data using powerful tools like Firebase and Pinecone." },
            { Icon: FaChartLine, title: "Analytics Dashboard", description: "Gain insights into employee engagement and sentiment with comprehensive analytics and visualization." }].map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group transition-transform duration-300 transform hover:scale-105"
            >
              <feature.Icon className="text-6xl text-yellow-400 mb-4 group-hover:scale-125 transition-transform duration-300" />
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-yellow-400">{feature.title}</h3>
              <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-black">
        <h2 className="text-4xl font-bold text-center mb-12">About Clarity</h2>
        <p className="max-w-3xl mx-auto text-center mb-8 leading-relaxed text-gray-300">
          Clarity is a state-of-the-art AI assistant that leverages the power of Google Gemini, Pinecone, and LangChain to
          provide enterprises with intelligent, real-time support and insights. Whether you are looking to streamline
          operations or enhance employee engagement, Clarity is designed to adapt to your organizational needs.
        </p>
        <div className="flex justify-center">
          <Link href="/about"
          className="bg-yellow-400 text-black px-6 py-3 rounded-md font-bold shadow-lg transform hover:scale-105 transition-transform duration-300">
          Learn More
        </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black py-10 px-6">
        <p className="text-center mt-8 text-gray-500">© 2024 Clarity. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
