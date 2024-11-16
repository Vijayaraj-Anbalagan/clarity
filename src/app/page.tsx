// src/app/page.tsx
import React from "react";
import { FaRobot, FaCogs, FaDatabase, FaChartLine } from "react-icons/fa";
import { AiFillRocket } from "react-icons/ai";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
 
import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";

const LandingPage: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-yellow-400">Clarity</div>
        <div className="space-x-8">
          <a href="#features" className="hover:text-yellow-400">
            Features
          </a>
          <a href="#about" className="hover:text-yellow-400">
            About
          </a>
          <a href="#contact" className="hover:text-yellow-400">
            Contact
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="z-10 flex items-center justify-center">
      <div
        className={cn(
          "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
        )}
      >
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span>✨ Introducing Clarity</span>
          <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </div>
    </div>
        <h1 className="text-5xl font-extrabold mb-4 mt-6">

          Enhance Your Enterprise with <span className="text-yellow-400">Clarity</span>
        </h1>
        <p className="text-lg max-w-2xl mb-8">
          AI-driven assistant for seamless employee engagement, real-time insights, and automated workflows.
        </p>
        <Link className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition-transform duration-300" href={'/login'}>
          Get Started
        </Link>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="flex flex-col items-center text-center">
            <FaRobot className="text-6xl text-yellow-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">AI-Powered Chatbot</h3>
            <p>Interact with an intelligent, context-aware assistant designed to provide precise information and support.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaCogs className="text-6xl text-yellow-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Workflow Automation</h3>
            <p>Automate repetitive tasks and workflows, freeing up time for more critical activities.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaDatabase className="text-6xl text-yellow-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Real-Time Data Integration</h3>
            <p>Seamlessly integrate and synchronize data using powerful tools like Firebase and Pinecone.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaChartLine className="text-6xl text-yellow-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Analytics Dashboard</h3>
            <p>Gain insights into employee engagement and sentiment with comprehensive analytics and visualization.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-black">
        <h2 className="text-4xl font-bold text-center mb-12">About Clarity</h2>
        <p className="max-w-3xl mx-auto text-center mb-8">
          Clarity is a state-of-the-art AI assistant that leverages the power of Google Gemini, Pinecone, and LangChain to provide
          enterprises with intelligent, real-time support and insights. Whether you are looking to streamline operations or enhance
          employee engagement, Clarity is designed to adapt to your organizational needs.
        </p>
        <div className="flex justify-center">
          <button className="bg-yellow-400 text-black px-6 py-3 rounded-md font-bold shadow-lg transform hover:scale-105 transition-transform duration-300">
            Learn More
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black py-10 px-6">

        <p className="text-center mt-8">© 2023 Clarity. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
