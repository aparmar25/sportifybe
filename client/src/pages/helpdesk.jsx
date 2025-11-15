// src/HelpdeskPage.jsx
import { useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Helpdesk from "../components/helpdesk";
import FeedbackForm from "../components/FeedbackForm";

export default function HelpdeskPage() {
  // Scroll to the top of the page whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top when the component mounts or route changes
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Helpdesk />
      </div>
        {/* <section className="py-16 px-4"> */}
        <FeedbackForm  className="container mx-auto px-4 py-6"/>
        {/* </section> */}
      
      
      <Footer />
    </main>
  );
}
