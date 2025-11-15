import { useState, useEffect } from "react";
import { Flame, Calendar, Clock } from "lucide-react";

export default function Loader() {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Igniting the excitement...",
    "Preparing epic events...",
    "Stay tuned for updates...",
    "Something amazing is coming..."
  ];

  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4);
    }, 1000);

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-4">
      {/* Main Loader Container */}
      <div className="relative flex flex-col items-center space-y-8">
        
        {/* Flame Animation Container */}
        <div className="relative">
          {/* Background Glow Effects */}
          <div className="absolute -inset-8 bg-gradient-radial from-[#ff4500]/30 via-[#ff6a00]/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -inset-6 bg-gradient-radial from-[#ffce00]/20 via-[#ff7f50]/15 to-transparent rounded-full blur-xl animate-pulse delay-500"></div>
          
          {/* Central Flame Icon */}
          <div className="relative z-10 p-8 bg-gradient-to-br from-gray-900/80 via-[#1a1a1a]/90 to-black/80 rounded-full border-2 border-gradient-to-r from-[#ff7f50] to-[#ffb84d]">
            <Flame 
              className={`w-16 h-16 text-[#ff6a00] transition-all duration-1000 ${
                animationPhase === 0 ? 'scale-100 rotate-0' :
                animationPhase === 1 ? 'scale-110 rotate-12' :
                animationPhase === 2 ? 'scale-105 rotate-6' :
                'scale-100 rotate-0'
              }`}
            />
          </div>

          {/* Orbiting Elements */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Calendar className="w-6 h-6 text-[#ff7f50] opacity-60" />
            </div>
            <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
              <Clock className="w-5 h-5 text-[#ffb84d] opacity-60" />
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <Flame className="w-4 h-4 text-[#ffce00] opacity-60" />
            </div>
            <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
              <Calendar className="w-5 h-5 text-[#ff4500] opacity-60" />
            </div>
          </div>
        </div>

        {/* Animated Progress Bars */}
        <div className="space-y-3 w-80">
          {[0, 1, 2].map((index) => (
            <div key={index} className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`absolute left-0 top-0 h-full bg-gradient-to-r from-[#ff4500] via-[#ff6a00] to-[#ffce00] rounded-full transition-all duration-2000 ease-in-out ${
                  animationPhase >= index ? 'w-full opacity-100' : 'w-0 opacity-50'
                }`}
                style={{
                  animationDelay: `${index * 300}ms`
                }}
              />
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer"></div>
            </div>
          ))}
        </div>

        {/* Main Message */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            No Scheduled Events
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7f50] to-[#ffb84d]"> Right Now</span>
          </h3>
          
          {/* Animated Message */}
          <div className="relative h-8">
            <p 
              className={`absolute inset-0 text-gray-300 text-lg transition-all duration-500 transform ${
                messageIndex === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {messages[messageIndex]}
            </p>
          </div>
          
          <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
            We're working hard to bring you exciting sports events and competitions. 
            Follow us on social media and check back soon for updates!
          </p>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-[#f9bb2c] rounded-full opacity-100 animate-float-${(i % 3) + 1}`}
              style={{
                left: `${10 + (i * 10)}%`,
                animationDelay: `${i * 100}ms`,
                animationDuration: `${3 + (i % 2)}s`
              }}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-8 p-6 bg-gradient-to-br from-gray-900/60 via-[#1a1a1a]/70 to-black/60 rounded-xl border border-[#ff6a00]/20 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className="w-3 h-3 bg-[#ff4500] rounded-full animate-pulse"></div>
            <span className="text-[#ff7f50] font-medium">Stay Connected</span>
            <div className="w-3 h-3 bg-[#ffce00] rounded-full animate-pulse delay-500"></div>
          </div>
          <p className="text-gray-300 text-center text-sm">
            Be the first to know when new events are announced
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(270deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(90deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float-1 { animation: float-1 3s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 4s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 3.5s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .bg-gradient-radial { background: radial-gradient(circle, var(--tw-gradient-stops)); }
      `}</style>
    </div>
  );
}