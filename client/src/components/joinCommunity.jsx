import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/buttons";
import { MessageCircle, ArrowRight, UserPlus } from "lucide-react";
import meetupBG from "../assets/MeetupBG.png";

export default function JoinCommunity() {
  const sectionRef = useRef(null);

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

  // Add global CSS for holographic animation
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      
      @keyframes scanLine {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
      }
      
      .holographic-line {
        position: absolute;
        height: 1px;
        width: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 90, 0, 0.2), rgba(255, 232, 8, 0.2), transparent);
        animation: scanLine 4s linear infinite;
        opacity: 0.2;
        z-index: 1;
      }
      
      .card-3d {
        transform-style: preserve-3d;
        perspective: 1000px;
      }
      
      @keyframes rotateGlow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const communityPlatforms = [
    {
      id: 1,
      title: "Join the Community",
      description:
        "Become a member to access exclusive updates, shape upcoming features, and be part of a growing network of sports enthusiasts.",
      icon: <UserPlus className="h-10 w-10" />, 
      link: "https://forms.gle/7SXKC73TnWmT5GZ96", 
      buttonText: "Become a Member",
      primaryGlow: "#0070f3", 
      secondaryGlow: "#a0f0ff", 
    },

    {
      id: 2,
      title: "WhatsApp Community",
      description:
        "Stay updated with the latest events, announcements, and connect with other members.",
      icon: <MessageCircle className="h-10 w-10" />,
      link: "https://forms.gle/7SXKC73TnWmT5GZ96",
      buttonText: "Join Community",
      primaryGlow: "#ff5a00",
      secondaryGlow: "#ffe808",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-black via-[#1a1a1a] to-black dark:bg-gray-950 px-4 md:px-16 relative"
      id="community"
      style={{
        backgroundImage: `url(${meetupBG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 1,
      }}
    >
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Join Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a00] via-[#ffce00] to-[#ffe808]">
              Community
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Connect with fellow sports enthusiasts, stay updated with events,
            and become part of our growing community.
          </p>
        </div>

        {/* Community Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {communityPlatforms.map((platform, index) => (
            <div
              key={platform.id}
              className="relative scroll-reveal card-3d rounded-xl overflow-hidden transform transition-all duration-500 hover:scale-105 card-border-glow"
              style={{
                transitionDelay: `${index * 150}ms`,
                animation: `float ${4 + index * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.3}s`,
              }}
            >
              {/* Base Card with Dark Glass Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-xl"></div>

              {/* Holographic Glow Effect - Always Visible but Toned Down */}
              <div className="absolute inset-0 rounded-xl opacity-30">
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${platform.primaryGlow}35, ${platform.secondaryGlow}20, transparent 70%)`,
                    filter: "blur(10px)",
                  }}
                ></div>
              </div>

              {/* Edge Highlight - Enhanced but Less Intense */}
              <div
                className="absolute inset-0 rounded-xl border-2 border-gray-600 overflow-hidden"
                style={{
                  boxShadow: `0 0 30px 4px ${platform.primaryGlow}25 inset`,
                }}
              ></div>

              {/* Scanning Line Effect */}
              <div className="holographic-line"></div>

              {/* Animated Floating Particles - Always Visible but Less Intense */}
              <div className="absolute inset-0 overflow-hidden floating-particles">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="opacity-30 transition-opacity duration-700"
                    style={{
                      width: `${Math.random() * 10 + 5}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${Math.random() * 4 + 3}s`,
                    }}
                  />
                ))}
              </div>

              {/* Sci-Fi Circuit Lines */}
              <div className="absolute inset-0">
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-20"
                >
                  <pattern
                    id={`grid-${platform.id}`}
                    width="30"
                    height="30"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 30 0 L 0 0 0 30"
                      fill="none"
                      stroke={platform.primaryGlow}
                      strokeWidth="0.8"
                      opacity="0.8"
                    />
                  </pattern>
                  <rect
                    width="100%"
                    height="100%"
                    fill={`url(#grid-${platform.id})`}
                  />
                </svg>
              </div>

              {/* Rotating Glow Ring - Always Visible but Less Intense */}
              <div
                className="absolute w-full h-full opacity-25"
                style={{
                  animation: "rotateGlow 20s linear infinite",
                  background: `conic-gradient(from 0deg, transparent, ${platform.primaryGlow}25, ${platform.secondaryGlow}30, transparent)`,
                }}
              ></div>

              {/* Card Content */}
              <div className="relative p-8 h-full flex flex-col z-10">
                <div
                  className="mb-6 text-white"
                  style={{
                    filter: `drop-shadow(0 0 5px ${platform.primaryGlow}66)`,
                  }}
                >
                  {platform.icon}
                </div>
                <h3
                  className="text-2xl font-bold mb-3 text-white"
                  style={{ textShadow: "0 0 6px rgba(255, 255, 255, 0.3)" }}
                >
                  {platform.title}
                </h3>
                <p className="text-gray-300 mb-8 flex-grow">
                  {platform.description}
                </p>
                <a
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto block"
                >
                  <Button
                    className="w-full py-4 text-white font-bold rounded-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2 group text-lg shadow-lg"
                    style={{
                      background: `linear-gradient(90deg, ${platform.primaryGlow}aa, ${platform.secondaryGlow}aa)`,
                      boxShadow: `0 0 20px ${platform.primaryGlow}55, 0 8px 10px -3px rgba(0, 0, 0, 0.3)`,
                      transform: "translateY(-1px)",
                    }}
                  >
                    {platform.buttonText}
                    <ArrowRight className="h-5 w-5 transform transition-transform group-hover:translate-x-2" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Creative Tip Section */}
        <div className="text-center mt-16 scroll-reveal">
          <div className="relative max-w-2xl mx-auto px-8 py-6 rounded-lg overflow-hidden">
            {/* Background and effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black rounded-lg opacity-80"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff5a00] to-transparent opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-[#ffe808] via-transparent to-transparent opacity-30"></div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#ff5a00] opacity-40 rounded-tl"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#ffe808] opacity-40 rounded-br"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-3">
                <div className="w-8 h-1 bg-gradient-to-r from-transparent to-[#ff5a00] opacity-50 mr-3"></div>
                <span className="text-[#ffe808] text-sm font-semibold tracking-wider opacity-70">
                  PRO TIP
                </span>
                <div className="w-8 h-1 bg-gradient-to-l from-transparent to-[#ffe808] opacity-50 ml-3"></div>
              </div>
              <p className="text-gray-200 text-sm ml-6 ">
                Want to be part of something bigger? Join our community to stay
                updated, share feedback, and help shape the future of our
                platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
