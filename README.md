🚀 Business Idea Validator (AI-Powered)
An AI-powered web application that helps users validate business ideas by generating structured feedback, insights, and improvement suggestions.

Built with Next.js, this project simulates a real-world AI SaaS tool that evaluates ideas and returns intelligent responses.

🧠 Features
✍️ Submit a business idea via form input

⏳ Loading state while AI processes request

🤖 AI-generated validation response

📊 Structured feedback (strengths, weaknesses, suggestions)

🧩 Clean and scalable architecture

📜 Idea history saved for 30 days (click to reload)

🛠️ Tech Stack
Next.js (React Framework)

TypeScript

Tailwind CSS

AI API (OpenRouter / LLM integration)

Node.js (API routes)

Supabase

Vercel

📁 Project Structure
app/

page.tsx → Main UI (Form → Loading → Response)

globals.css → Global styles

lib/

AiClient.ts → AI API handler (Singleton Pattern)

ReportFactory.ts → Report generator (Factory Pattern)

supabase.ts → Supabase client setup

🔑 Environment Variables
Create a .env.local file and add:

env
OPENROUTER_API_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
🌐 Live Demo
Live demo is deployed on Vercel and tested for login, submit, and history:
https://ai-business-validator-blerinaduraku-rgbs-projects.vercel.app/

🧩 Design Patterns Implemented
Singleton Pattern
File: lib/AiClient.ts

Ensures only one instance of the AI client exists throughout the application.
This improves performance and avoids multiple unnecessary API connections.

Used for:

Centralized AI API handling

Secure and efficient request management

Factory Pattern
File: lib/ReportFactory.ts

Creates different types of business validation reports dynamically.

Benefits:

Easy to extend with new report types

Keeps code clean and modular

Follows Open/Closed Principle (SOLID)

📌 Project Goal
The goal of this project is to simulate a real AI SaaS product that evaluates business ideas and provides structured feedback using modern full-stack development practices.

📚 What I Learned
Integrating AI APIs into a Next.js app

Managing UI states (loading → response flow)

Structuring scalable full-stack projects

Applying Design Patterns in real projects

Improving application stability and error handling

Debugging and fixing duplicate request issues

🚀 Future Improvements
Export reports as PDF

Better AI response tuning

More advanced dashboard analytics

Optional delete button for history (currently removed per project requirements)

🔐 Authentication
The application includes Login/Register functionality using secure Supabase authentication.

💾 Database
Data is stored using Supabase, including:

User accounts

Business ideas

AI-generated analysis history

🤖 AI Feature
Business idea analysis is generated using OpenRouter AI models with structured responses including:

Summary

Strengths

Weaknesses

Suggestions

Final verdict

🔧 Stability & Edge Cases
As part of the production hardening process, several real-world edge cases were implemented to improve stability and user experience.

✅ Handled Edge Cases
Empty input validation

Very long input protection

API failure / network error handling

Double submit prevention

Protected route handling

🎯 UX Improvements
Clear loading state during AI processing

Human-readable error messages

Disabled submit button during requests

Stable response handling without crashes

🛠️ Debugging, Review & Hardening
🐛 Bug Fix
Fixed duplicate API requests during rapid submit actions

Prevented multiple simultaneous form submissions

Fixed duplicate request bug: submit now triggers only one analysis + one save

🎨 UX / Feedback Improvements
Improved loading state visibility

Added better error feedback

Improved overall application responsiveness

🧹 Refactor / Cleanup
Cleaned submit logic and state handling

Improved component readability

Better separation of validation and request logic

📄 Demo Plan
See docs/demo-plan.md for the full demo presentation plan (flow, technical highlights, and fallback strategy).