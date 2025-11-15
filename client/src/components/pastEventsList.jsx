import {
  Calendar,
  MapPin,
  Tag,
  Star,
  Music,
  Zap,
  Sparkles,
  Loader,
  Filter
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import bg1 from "../assets/PasteveBG1.jpeg";
import bg2 from "../assets/PasteveBG2.jpeg";

// API Configuration
const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api';

// Enhanced wavy border
const WavyBorder = () => (
  <div className="relative w-full h-20 overflow-hidden opacity-70">
    <svg
      className="absolute w-full h-full"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        className="fill-gray-800/40"
      />
      <path
        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
        className="fill-gray-800/60"
      />
      <path
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
        className="fill-gray-800/20"
      />
    </svg>
  </div>
);

const Reflection = ({ children }) => (
  <div className="relative overflow-hidden group">
    {children}
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
    <div className="absolute -inset-full top-0 z-50 block bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
  </div>
);

const ParticleField = () => {
  const particles = Array(10)
    .fill()
    .map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.3,
    }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white animate-particle-float"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animationDelay: `${particle.id * 0.5}s`,
            animationDuration: `${Math.random() * 10 + 15}s`,
          }}
        />
      ))}
    </div>
  );
};

const Spotlight = ({ active }) => (
  <div
    className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${active ? "opacity-100" : "opacity-0"}`}
  >
    <div className="absolute -top-24 left-1/3 w-40 h-40 bg-gradient-radial from-yellow-500/20 via-yellow-500/5 to-transparent rounded-full blur-xl transform -rotate-12" />
    <div className="absolute -bottom-16 right-1/4 w-32 h-32 bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent rounded-full blur-xl" />
  </div>
);

const HolographicIcon = ({ icon: Icon, color = "text-white" }) => (
  <div className="relative group cursor-pointer">
    <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative bg-gray-900/60 p-2 rounded-full backdrop-blur-sm">
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
  </div>
);

export default function EventsList() {
  const [allEvents, setAllEvents] = useState([]);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    fetchEvents('All');
  }, []);

  useEffect(() => {
    fetchEvents(selectedCategory);
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      const categoryNames = data.map(cat => cat.name);
      setCategories(['All', ...categoryNames]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchEvents = async (category) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = category === 'All' 
        ? `${API_URL}/events`
        : `${API_URL}/events?category=${encodeURIComponent(category)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setAllEvents(data);
      setDisplayedEvents(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const elements = containerRef.current.querySelectorAll(".event-card");
      const windowHeight = window.innerHeight;

      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const inViewport =
          rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2;

        if (inViewport && activeIndex !== index) {
          setActiveIndex(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeIndex]);

  const getDecorativeIcon = (index) => {
    const icons = [
      <HolographicIcon key="star" icon={Star} color="text-yellow-400" />,
      <HolographicIcon key="music" icon={Music} color="text-purple-400" />,
      <HolographicIcon key="zap" icon={Zap} color="text-blue-400" />,
      <HolographicIcon
        key="sparkles"
        icon={Sparkles}
        color="text-orange-400"
      />,
    ];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-white text-xl">Loading past events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center bg-red-500/20 border border-red-500 p-8 rounded-lg max-w-md">
          <p className="text-red-300 text-lg mb-4">Failed to load events</p>
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button 
            onClick={() => fetchEvents(selectedCategory)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-24 relative py-12" ref={containerRef}>
      {/* Background mesh gradient */}
      <div className="fixed -z-10 px-80 inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black"></div>
      
      {/* Category Filter */}
      <div className=" top-24 z-40 bg-gradient-to-br from-gray-900/80 via-[#1a1a1a]/90 to-black/80 p-4 mb-8 rounded-lg mx-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 text-white whitespace-nowrap">
            <Filter size={20} className="text-orange-500" />
            <span className="font-semibold">Filter:</span>
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#ff5a00] to-[#ffe808] text-black shadow-lg transform scale-105'
                    : 'bg-gradient-to-br from-gray-800/50 via-[#1a1a1a]/50 to-black/90 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Display */}
      {displayedEvents.length === 0 ? (
        <div className="text-center py-20 relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center">
          <div>
            <WavyBorder />
            <div className="relative">
              <ParticleField />
              <Calendar size={64} className="mx-auto text-orange-500 opacity-50 mb-4" />
              <p className="text-white text-xl animate-pulse">
                No events found in "{selectedCategory}" category
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition"
              >
                View All Events
              </button>
            </div>
            <WavyBorder />
          </div>
        </div>
      ) : (
        displayedEvents.map((event, index) => {
          const bgImage = index % 2 === 0 ? bg1 : bg2;
          return (
            <div 
              key={event._id || event.id}
              className="relative event-card my-16 px-12 py-16"
              style={{            
                backgroundImage: `url(${bgImage})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '1rem',
              }}
            >
              <Spotlight active={activeIndex === index} />
              
              {/* Orbital decorative elements */}
              <div className="absolute -z-10 w-full h-full pointer-events-none overflow-hidden">
                <div
                  className={`absolute w-64 h-64 rounded-full border border-gray-700/30 ${index % 2 === 0 ? "-left-32" : "-right-32"} top-1/4 animate-slow-spin`}
                />
                <div
                  className={`absolute w-40 h-40 rounded-full border border-gray-700/20 ${index % 2 === 0 ? "-right-20" : "-left-20"} bottom-1/4 animate-slow-spin-reverse`}
                />
              </div>

              <div
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-8 lg:gap-16 items-center opacity-0 transition-all duration-700 ease-out transform ${
                  true ? "opacity-100 translate-y-0" : "translate-y-8"
                }`}
                style={{ transitionDelay: `${(index % 5) * 150}ms` }}
              >
                {/* Event Image */}
                <div className="w-full lg:w-2/5 rounded-xl overflow-hidden group">
                  <Reflection>
                    <div className="overflow-hidden rounded-xl relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ff5a00]/30 to-[#ffe808]/20 z-10 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                      <img
                        src={event.image || "/api/placeholder/400/600"}
                        alt={event.title}
                        className="w-full h-[500px] object-cover transform transition-all duration-700 ease-in-out"
                      />
                      {/* Corner accents */}
                      <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
                        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-white/40" />
                      </div>
                      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-white/40" />
                      </div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
                        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-white/40" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
                        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-white/40" />
                      </div>
                    </div>
                  </Reflection>
                </div>

                {/* Event Details */}
                <div className="w-full lg:w-3/5 space-y-4 relative p-6 group backdrop-blur-sm bg-gray-900/20 rounded-xl border border-gray-800/50">
                  {/* Fancy animated corners */}
                  <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none">
                    <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-[#ff5a00] to-transparent transform origin-top-left transition-all duration-300 group-hover:h-32" />
                    <div className="absolute top-0 left-0 w-12 h-1 bg-gradient-to-r from-[#ff5a00] to-transparent transform origin-top-left transition-all duration-300 group-hover:w-32" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none">
                    <div className="absolute bottom-0 right-0 w-1 h-12 bg-gradient-to-t from-[#ffe808] to-transparent transform origin-bottom-right transition-all duration-300 group-hover:h-32" />
                    <div className="absolute bottom-0 right-0 w-12 h-1 bg-gradient-to-l from-[#ffe808] to-transparent transform origin-bottom-right transition-all duration-300 group-hover:w-32" />
                  </div>

                  {/* Category badge and icon */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-[#ff5a00] to-[#ffe808] text-black transform transition-transform duration-300 hover:scale-105">
                      {event.category || 'All'}
                    </span>
                    <div className="flex space-x-2">{getDecorativeIcon(index)}</div>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-300">
                    {event.title}
                  </h2>

                  {/* Info items */}
                  <div className="flex flex-wrap gap-4 text-gray-300">
                    <div className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1 hover:text-white group/item">
                      <span className="p-1 rounded-full bg-gray-800/50 group-hover/item:bg-[#ff5a00]/20">
                        <Calendar className="w-4 h-4 text-[#ff5a00]" />
                      </span>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1 hover:text-white group/item">
                      <span className="p-1 rounded-full bg-gray-800/50 group-hover/item:bg-[#ff5a00]/20">
                        <MapPin className="w-4 h-4 text-[#ff5a00]" />
                      </span>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="relative overflow-hidden rounded-lg p-4 bg-gray-800/30">
                    <div className="absolute -inset-full h-full w-1/2 z-10 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-40 animate-shine pointer-events-none" />
                    <p className="text-gray-300 leading-relaxed relative z-20">
                      {event.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      {event.tags &&
                        event.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-gray-800/70 text-gray-300 transition-all duration-300 hover:bg-gray-700 hover:text-white hover:translate-y-1 backdrop-blur-sm"
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            <Tag className="w-3 h-3 mr-1 text-[#ff5a00]" />
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Progress indicator */}
      {displayedEvents.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-gray-900/80 backdrop-blur-md px-3 py-2 rounded-full text-sm text-white/70 border border-gray-800/50">
          {displayedEvents.length} / {allEvents.length} events
        </div>
      )}

      {/* Enhanced background floating elements */}
      <div className="fixed -z-10 top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="blur-3xl opacity-10 absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#ff5a00] animate-float" />
        <div className="blur-3xl opacity-10 absolute top-1/2 -left-20 w-60 h-60 rounded-full bg-[#ffe808] animate-float-delayed" />
        <div className="blur-3xl opacity-5 absolute bottom-20 right-1/4 w-40 h-40 rounded-full bg-blue-500 animate-float-slow" />
        <div className="blur-3xl opacity-5 absolute top-1/3 right-1/3 w-32 h-32 rounded-full bg-purple-500 animate-float-reverse" />
        <div className="blur-3xl opacity-5 absolute bottom-1/4 left-1/4 w-24 h-24 rounded-full bg-pink-500 animate-float-slow-reverse" />
      </div>
    </div>
  );
}

// Add CSS animations
const styleTag = document.createElement("style");
styleTag.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(-20px) translateX(10px); }
  }
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(20px) translateX(-10px); }
  }
  @keyframes float-slow {
    0%, 100% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(-10px) translateX(20px); }
  }
  @keyframes float-reverse {
    0%, 100% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(15px) translateX(-15px); }
  }
  @keyframes float-slow-reverse {
    0%, 100% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(12px) translateX(8px); }
  }
  @keyframes shine {
    from {transform: translateX(-100%) skewX(-12deg);}
    to {transform: translateX(150%) skewX(-12deg);}
  }
  @keyframes shimmer {
    from {transform: translateX(-150%);}
    to {transform: translateX(150%);}
  }
  @keyframes particle-float {
    0%, 100% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-30px) translateX(10px); }
    50% { transform: translateY(0) translateX(20px); }
    75% { transform: translateY(30px) translateX(10px); }
  }
  @keyframes slow-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes slow-spin-reverse {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
  }
  
  .animate-float {
    animation: float 15s ease-in-out infinite;
  }
  .animate-float-delayed {
    animation: float-delayed 20s ease-in-out infinite;
  }
  .animate-float-slow {
    animation: float-slow 25s ease-in-out infinite;
  }
  .animate-float-reverse {
    animation: float-reverse 18s ease-in-out infinite;
  }
  .animate-float-slow-reverse {
    animation: float-slow-reverse 22s ease-in-out infinite;
  }
  .animate-shine {
    animation: shine 8s ease-in-out infinite;
  }
  .animate-shimmer {
    animation: shimmer 2s linear forwards;
  }
  .animate-particle-float {
    animation: particle-float 25s ease-in-out infinite;
  }
  .animate-slow-spin {
    animation: slow-spin 30s linear infinite;
  }
  .animate-slow-spin-reverse {
    animation: slow-spin-reverse 20s linear infinite;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
if (!document.querySelector('style[data-past-events]')) {
  styleTag.setAttribute('data-past-events', 'true');
  document.head.appendChild(styleTag);
}
