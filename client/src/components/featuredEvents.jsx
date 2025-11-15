import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/buttons";
import featEve1 from "../assets/Featured-events/Event-1.jpg";
import featEve2 from "../assets/Featured-events/Event-2.png";
import featureBG from '../assets/FeaturedBG.jpg';


const pastEvents = [
  {
    id: "featured-1",
    title: "Ultimate IPL Auction",
    image: featEve1,
    date: "24 April - 27 April, 2025",
    location: "Google Meet",
    category: "Strategy Competition",
    description:
      "Participants stepped into the shoes of franchise owners, bidding strategically to build their dream teams under a fixed budget. The event was filled with intense bidding wars, clever tactics, and loads of cricket banter.",
    isPast: true,
    tags: ["Cricket", "Auction", "Strategy", "Teamwork"],
  },
  {
    id: "featured-2",
    title: "Ultimate Sports Quizz",
    image: featEve2,
    date: "5 June - 6 June, 2025",
    location: "BioTech Hall, IIT Madras",
    category: "Quiz Competition",
    description:
      "Get ready to put your sports knowledge to the ultimate test! The Ultimate Sports Quiz at Paradox’25 is a high-energy competition designed for sports lovers. From legendary moments and record-breaking feats to mind-bending trivia, this quiz will challenge even the most passionate fans.",
    isPast: true,
    tags: ["Quiz", "Sports", "Trivia"],
  },
];

export default function PastEvents() {
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

  return (
    <section
      ref={sectionRef}
      className="py-10 md:py-20 bg-gradient-to-br from-black via-[#1a1a1a] to-black dark:bg-gray-950 px-4 sm:px-6 md:px-16 relative"
      id="past-events"
      style={{
        backgroundImage: `url(${featureBG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 1,
      }}
    >
      <div className="container mx-auto px-0 sm:px-4">
        <div className="text-center mb-8 md:mb-12 scroll-reveal">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-white">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a00] via-[#ffce00] to-[#ffe808]">
              Events
            </span>
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
            Check out the highlights and achievements from our past competitions.
          </p>
        </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-28 scroll-reveal place-items-center">
          {pastEvents.slice(0, 2).map((event, index) => {
            // Trim description to 200 chars for uniformity
            const trimmedDesc = event.description.length > 200
              ? event.description.slice(0, 200) + "..."
              : event.description;
            return (
              <div
                key={event.id}
                className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row transform hover:scale-[1.02] transition-all duration-300 animate-glow-card max-w-[22rem] sm:max-w-sm md:max-w-[36rem] w-full"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="w-full md:w-2/5 h-[24rem] sm:h-[32rem] md:h-auto relative flex items-center justify-center">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="object-cover w-[85%] h-[95%] sm:w-[90%] sm:h-[90%] transition-all duration-300 rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="w-full md:w-3/5 p-4 sm:p-6 md:p-7 flex flex-col justify-center gap-2 sm:gap-3">
                  {/* Title + Date */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1 sm:gap-0">
                    <h3 className="text-base sm:text-lg font-bold text-white">{event.title}</h3>
                    <span className="text-xs text-white px-2 py-1 rounded bg-gradient-to-r from-[#ff4500]/20 via-[#ff6a00]/30 to-[#ffce00]/40 mt-1 sm:mt-0">
                      {event.date}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-1">
                    {trimmedDesc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-gray-800 text-[#f69e34]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
