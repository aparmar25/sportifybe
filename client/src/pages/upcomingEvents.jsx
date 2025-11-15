import { useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import EventsList from "../components/upcomingEventsList";
import { upcomingEvents } from "../lib/data";
import eventBgImage from "../assets/Event-BG.jpeg";
import Loader from "../components/loader"; // ✅ Import the new Loader component

export default function UpcomingEventsPage() {
  
  // Scroll to the top of the page whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top when the component mounts or route changes
  }, []); // Dependency on location ensures this happens on route change

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black dark:bg-gray-950">
      <Navbar />
      <div className="container mx-auto px-10 sm:px-20 py-16">
        {/* Page Header */}
        <h1 className="text-4xl font-bold text-center mb-16 mt-12 text-white relative">
          Upcoming{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a00] to-[#ffe808]">Events</span>
          <div className="absolute -bottom-4 left-0 right-0 flex justify-center w-full">
            <div className="relative h-[2px] w-3/5 sm:w-1/5">
              {/* Main gradient underline */}
              <div className="absolute inset-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a00] to-transparent rounded-full"></div>

              {/* Glow effect */}
              <div className="absolute inset-0 h-[1px] bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 rounded-full blur-sm"></div>

              {/* Extra subtle reflection */}
              <div className="absolute inset-0 h-[1px] top-[3px] bg-gradient-to-r from-transparent via-white to-transparent opacity-30 blur-[0.5px]"></div>
            </div>
          </div>
        </h1>

        {/* Events List with Background Image */}
        <div className="relative rounded-xl overflow-hidden min-h-[600px] flex justify-center align-middle py-4">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-screen"
            style={{ 
              backgroundImage: `url(${eventBgImage})`,
              minHeight: "600px"
            }} 
          />
          
          {/* Content container */}
          <div className="relative z-10 p-8">
            <Loader />
            {/* <EventsList events={upcomingEvents} /> */}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}