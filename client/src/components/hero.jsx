import { useEffect, useRef } from "react";
import { Button } from "../ui/buttons";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import logo from "../assets/sportify_logo1.png";
import { Link } from "react-router-dom";
import HeroBG from '../assets/SportifyHero.jpg';

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
  <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-8 px-2 sm:pt-12 sm:px-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center sm:bg-center"
          style={{
            backgroundImage: `url(${HeroBG})`,
            backgroundPosition: 'center 0px',
            filter: 'brightness(1.2)',
            minHeight: '100vh',
          }}
        />
      </div>

      {/* Flame Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[
          // { top: "33%", left: "25%" },
          // { top: "50%", right: "33%" },
          // { bottom: "27%", left: "13%" },
          // { top: "25%", right: "20%" },
          // { bottom: "30%", right: "15%" },
        ].map((pos, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 rounded-full animate-flicker"
            style={{
              backgroundColor: [
                "#ffce00",
                "#ff5a00",
                "#ff9a00",
                "#ffe808",
                "#ff0000",
              ][index],
              opacity: 0.6,
              ...pos,
            }}
          />
        ))}
      </div>

      {/* Floating Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 animate-float mb-2"
      >
        <div className="w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 mx-auto">
          <img
            src={logo}
            alt="Sportify Logo"
            className="object-contain w-full h-full"
            loading="lazy"
          />
        </div>
      </motion.div>

      {/* Central Text & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10 max-w-5xl px-2"
      >
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
          Spreading the{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300">
            Flame of Sports
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12">
          Join IIT Madras BS Degree Sports Society and be part of a community
          that celebrates athleticism, teamwork, and the undying spirit of
          competition.
        </p>
  <div className="flex flex-col sm:flex-row sm:justify-center gap-4 w-full">
          {/* Join Sportify Button (Google Form Link) */}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSf-uGRSW6krWftInt8yia8iFajoLbrwqBHiBnq6ZfKyclV7DA/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300 text-black font-semibold hover:brightness-110 hover:shadow-yellow-300/40 focus:outline-none transition-all transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <Flame className="h-5 w-5" />
              <span>Join Sportify</span>
            </Button>
          </a>

          {/* Explore Events Button (Internal Link) */}
          <div className="w-full sm:w-auto p-[2px] rounded-md bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400">
            <Link to="/past-events" className="block w-full h-full">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-black text-amber-500 font-semibold hover:brightness-110 hover:shadow-yellow-300/40 focus:outline-none active:outline-none transform active:scale-95 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
