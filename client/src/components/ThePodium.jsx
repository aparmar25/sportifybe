"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Star, Award } from "lucide-react";
import { newsletterData } from "../lib/data.js";

const NewsletterComponent = () => {
  const [currentEdition, setCurrentEdition] = useState(0);

  const handlePrevious = () => {
    setCurrentEdition((prev) =>
      prev === 0 ? newsletterData.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentEdition((prev) =>
      prev === newsletterData.length - 1 ? 0 : prev + 1
    );
  };

  const currentNewsletter = newsletterData[currentEdition];

  return (
    <div
      className="relative w-full min-h-screen pt-4 pb-4 md:pt-10 md:pb-10 px-4 md:px-8 rounded"
      style={{
        background: "transparent",
      }}
    >
      {/* Top-left corner border */}
      {/* <div className="absolute top-0 left-0 w-32 h-32">
        <div className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-b from-red-500 via-orange-400 to-transparent rounded-tl"></div>
        <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-red-500 via-orange-400 to-transparent rounded-tl"></div>
      </div> */}

      {/* Top-right corner border */}
      <div className="absolute top-0 right-0 w-32 h-32">
        <div className="absolute top-0 right-0 w-1 h-32 bg-gradient-to-b from-red-500 via-orange-400 to-transparent rounded-tr"></div>
        <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-r from-transparent via-orange-400 to-red-500 rounded-tr"></div>
      </div>

      {/* Bottom-left corner border */}
      <div className="absolute bottom-0 left-0 w-32 h-32">
        <div className="absolute bottom-0 left-0 w-1 h-32 bg-gradient-to-t from-red-500 via-orange-400 to-transparent rounded-bl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-1 bg-gradient-to-r from-red-500 via-orange-400 to-transparent rounded-bl"></div>
      </div>

      {/* Bottom-right corner border */}
      {/* <div className="absolute bottom-0 right-0 w-32 h-32">
        <div className="absolute bottom-0 right-0 w-1 h-32 bg-gradient-to-t from-red-500 via-orange-400 to-transparent rounded-br"></div>
        <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-r from-transparent via-orange-400 to-red-500 rounded-br"></div>
      </div> */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section - Introduction and Carousel */}
        <div
          className="lg:col-span-5 backdrop-blur-md rounded-3xl p-6 shadow-xl overflow-hidden hover:border-gray-800 transition-all duration-300"
          style={{
            backgroundColor: "rgba(17, 24, 39, 0.6)", // gray-900 at 70% opacity
            border: "2px solid rgba(31, 41, 55, 1)", // gray-800 border, 2px thick
          }}
        >
          <div className="space-y-6">
            {/* Welcome text with improved typography */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-center tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400">
                  Welcome to The Podium
                </h2>
                <div className="w-44 h-1 bg-yellow-400 mx-auto rounded mt-2"></div>
              </div>
              <p className="text-gray-300 leading-relaxed text-center">
                Your ultimate source for everything sports! Each edition
                delivers comprehensive coverage on and off the field, including
                thrilling match analyses, athlete spotlights, expert commentary
                on emerging trends, and exclusive behind-the-scenes access to
                Sportify's premier events and community activities.
              </p>
            </div>

            {/* Newsletter Carousel with enhanced visual design */}
            <div className="relative mt-6 bg-gradient-to-br from-gray-800/70 to-black/70 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePrevious}
                  className="bg-black/60 hover:bg-black/40 p-3 rounded-full shadow-lg transition-all duration-300 border border-gray-700"
                  aria-label="Previous edition"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>

                <div className="text-center">
                  <span className="text-xs uppercase tracking-wider text-gray-400">
                    Browse editions
                  </span>
                </div>

                <button
                  onClick={handleNext}
                  className="bg-black/60 hover:bg-black/40 p-3 rounded-full shadow-lg transition-all duration-300 border border-gray-700"
                  aria-label="Next edition"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Newsletter Cover with more polished design */}
              <div className="mt-2 relative h-72 w-full overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/40 to-black/90 z-10"></div>

                {/* Custom diagonal stripes pattern */}
                <div className="absolute inset-0 z-0 opacity-10 bg-black">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 25px, transparent 25px, transparent 50px)`,
                    }}
                  ></div>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-4">
                  <div className="bg-black/40 px-4 py-1 rounded-full mb-4">
                    <p className="text-gray-300 text-xs tracking-wider">
                      MONTHLY NEWSLETTER
                    </p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="text-white font-bold text-3xl bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 text-transparent bg-clip-text">
                      {currentNewsletter.month}
                    </div>
                    <div className="text-white font-medium text-lg">
                      Edition {currentNewsletter.edition}
                    </div>
                    <div className="h-px w-16 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 mx-auto"></div>
                    <div
                      className="text-gray-300 text-sm max-w-xs line-clamp-3"
                      style={{ minHeight: "3.8rem" }}
                    >
                      {currentNewsletter.aboutEdition}
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-gray-400 text-xs">
                      BY THE SPORTIFY SOCIETY
                    </p>
                  </div>
                </div>
              </div>

              {/* Edition indicator dots with enhanced visual appearance */}
              <div className="flex justify-center mt-6 space-x-1.5">
                {newsletterData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentEdition(index)}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                      index === currentEdition
                        ? "bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 w-8"
                        : "bg-gray-700 hover:bg-gray-600 w-2"
                    }`}
                    aria-label={`Go to edition ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Newsletter PDF Viewer */}
        <div
          className="lg:col-span-7 bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300 flex flex-col"
          style={{
            backgroundColor: "rgba(17, 24, 39, 0.6)",
            border: "2px solid rgba(31, 41, 55, 1)", 
          }}
        >
          {/* Header bar */}
          <div className="bg-black/40 p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500"></div>
              </div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400">
                {currentNewsletter.month} - Edition {currentNewsletter.edition}
              </h2>
              <div className="w-16"></div> {/* Empty div for alignment */}
            </div>
          </div>

          {/* PDF Viewer with stylized frame */}
          <div className="relative flex-grow p-4">
            <div className="relative flex-grow rounded-xl overflow-hidden border border-gray-700 bg-black/30 h-full min-h-[500px]">
              <iframe
                src={currentNewsletter.pdfLink}
                className="w-full h-full"
                title={`The Podium - Edition ${currentNewsletter.edition}`}
                allow="autoplay"
                loading="lazy"
              ></iframe>

              {/* Improved fallback message */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="text-center p-6 bg-black/80 rounded-xl border border-gray-700 max-w-sm">
                  <p className="text-white mb-4">
                    If the newsletter doesn't load, you can view it directly:
                  </p>
                  <a
                    href={currentNewsletter.pdfLink.replace(
                      "/preview",
                      "/view"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-orange-600 to-yellow-500 px-4 py-2 rounded-lg text-white font-medium pointer-events-auto hover:from-orange-500 hover:to-yellow-400 transition-all duration-300"
                  >
                    Open in Google Drive
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Edition information with enhanced visual presentation */}
          <div className="bg-black/40 rounded-xl p-4">
            <h3 className="flex items-center text-lg font-medium text-white mb-3">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              About this edition
            </h3>
            <p
              className="text-gray-300 line-clamp-3"
              style={{ minHeight: "4.6rem" }}
            >
              {currentNewsletter.highlights}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterComponent;
