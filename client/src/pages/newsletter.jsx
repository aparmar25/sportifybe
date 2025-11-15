import { useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import NewsletterComponent from "../components/ThePodium";
import podiumBG from "../assets/PodiumBG.jpeg";

export default function ThePodiumPage() {
  // Scroll to the top of the page whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top when the component mounts or route changes
  }, []); // Dependency array ensures this happens on route change

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black dark:bg-gray-950"
      style={{
        backgroundImage: `url(${podiumBG})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        zIndex: 1,
      }}
    >
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 lg:px-20 py-16">
        {/* Page Header */}
        <h1 className="text-4xl font-bold text-center mb-16 mt-12 text-white relative">
          The{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a00] to-[#ffe808]">
            Podium
          </span>
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

        {/* Newsletter Component */}
        <NewsletterComponent />
      </div>
      <Footer />
    </main>
  );
}
