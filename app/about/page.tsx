"use client";

import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="bg-[#f0f4f8] min-h-screen text-[#063376] font-sans">
      {/* Hero Section */}
      <section className="bg-[#0B4D97] text-white py-20 px-8 text-center shadow-lg">
        <h1 className="text-6xl font-black mb-4">About Us</h1>
        <p className="text-xl max-w-3xl mx-auto leading-relaxed">
          Validator.ai is more than just a platform — it’s a movement to empower dreamers, 
          entrepreneurs, and innovators to transform ideas into reality. Here you’ll discover 
          our mission, vision, and answers to the most common questions.
        </p>
      </section>
      {/* Mission Statement */}
      <section className="px-12 py-16 max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-[#063376]">Our Mission</h2>
        <p className="text-lg leading-relaxed text-gray-700 mb-6">
          At <span className="font-bold text-[#0B4D97]">Validator.ai</span>, our mission is simple yet powerful:
          to give every idea a chance to grow. We combine artificial intelligence with business 
          strategy to help innovators refine their concepts into actionable plans.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Provide instant AI-powered feedback on ideas.</li>
          <li>Help entrepreneurs identify strengths and weaknesses.</li>
          <li>Encourage creativity while reducing risks.</li>
          <li>Support decision-making with clear, structured insights.</li>
        </ul>
      </section>
      {/* Vision for the Future */}
      <section className="px-12 py-16 max-w-5xl mx-auto bg-white rounded-2xl shadow-md mb-12">
        <h2 className="text-4xl font-bold mb-6 text-[#063376]">Vision for the Future</h2>
        <p className="text-lg leading-relaxed text-gray-700 mb-6">
          We envision a world where innovation is accessible to everyone. Our long-term vision 
          is to build a global hub where ideas can be tested, validated, and improved instantly.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Expand Validator.ai into a collaborative ecosystem.</li>
          <li>Introduce funding opportunities for validated ideas.</li>
          <li>Enable community-driven growth and peer feedback.</li>
          <li>Integrate with global networks of entrepreneurs and investors.</li>
        </ul>
      </section>
      {/* FAQ Section */}
      <section className="px-12 py-16 max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-[#063376]">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-[#0B4D97]">What is Validator.ai?</h3>
            <p className="text-gray-700">
              Validator.ai is an AI-powered platform that helps you refine and validate business ideas quickly and effectively.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#0B4D97]">Is it free to use?</h3>
            <p className="text-gray-700">
              We offer a free tier for basic idea validation, with premium features available for advanced analysis and collaboration.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#0B4D97]">Can I collaborate with others?</h3>
            <p className="text-gray-700">
              Yes! Our upcoming features will allow you to share ideas, get feedback, and work together with other innovators.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#0B4D97]">What makes Validator.ai unique?</h3>
            <p className="text-gray-700">
              Unlike traditional consulting, Validator.ai provides instant, AI-driven insights 
              tailored to your idea, saving time and resources while boosting creativity.
            </p>
          </div>
        </div>
      </section>

      {/* Back to Home Button */}
      <div className="text-center py-12">
        <button 
          onClick={() => router.push("/")}
          className="px-6 py-3 rounded-xl bg-[#063376] text-white font-bold hover:bg-[#0B4D97] transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
