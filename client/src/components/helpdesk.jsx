import { getFAQs } from "../lib/data"; // Fetch FAQs
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../ui/card";

export default function Helpdesk() {
  const faqs = getFAQs(); // Retrieve FAQs from data.js
  const sectionRef = useRef(null);


  // State to track which FAQ is open
  const [openFAQ, setOpenFAQ] = useState(null);

  // Toggle FAQ open/close
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Animation for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".scroll-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 bg-gradient-to-br from-black via-[#1a1a1a] to-black"
      id="helpdesk"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 mt-12 scroll-reveal">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white relative">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400">
              Questions
            </span>
            <div className="absolute -bottom-4 left-0 right-0 flex justify-center w-full">
            <div className="relative h-[2px] w-4/5 sm:w-2/5">
              {/* Main gradient underline */}
              <div className="absolute inset-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a00] to-transparent rounded-full"></div>

              {/* Glow effect */}
              <div className="absolute inset-0 h-[1px] bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 rounded-full blur-sm"></div>

              {/* Extra subtle reflection */}
              <div className="absolute inset-0 h-[1px] top-[3px] bg-gradient-to-r from-transparent via-white to-transparent opacity-30 blur-[0.5px]"></div>
            </div>
          </div>
          </h1>
          <p className="mt-10 text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about our events, membership, and more. If you can't find what you're looking for, we are here to help!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-2 border-gradient rounded-lg shadow-xl bg-gradient-to-br from-black to-[#151515] text-white">
            <CardContent className="py-6 px-4 md:px-6">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-800 rounded-md overflow-hidden scroll-reveal hover:shadow-xl transition-shadow duration-300" style={{ transitionDelay: `${index * 50}ms` }}>
                    <div 
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-[#111] to-[#222] cursor-pointer"
                      onClick={() => toggleFAQ(index)}
                    >
                      <h3 className="font-medium text-gray-100">{faq.question}</h3>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 text-xl font-bold">
                        {openFAQ === index ? "−" : "+"}
                      </span>
                    </div>
                    {openFAQ === index && (
                      <div className="p-5 bg-gradient-to-br from-[#1a1a1a] to-[#212121] text-gray-300 whitespace-pre-line">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CSS for gradient border */}
      <style jsx>{`
        .border-gradient {
          position: relative;
        }
        .border-gradient::before {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(to right, #ff4500, #ff6a00, #ffce00);
          border-radius: 0.5rem;
          z-index: -1;
        }
      `}</style>
    </section>
  );
}