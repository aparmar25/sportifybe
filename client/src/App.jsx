import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import UpcomingEvents from "./pages/upcomingEvents";
import PastEvents from "./pages/pastEvents";
import Team from "./pages/team";
import Helpdesk from "./pages/helpdesk";
import Newsletter from "./pages/newsletter";
import FeaturedEvents from "./pages/featuredEvents";

import AdminPanel from './pages/AdminPanel';
import FeedbackForm from './components/FeedbackForm';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upcoming-events" element={<UpcomingEvents />} />
        <Route path="/featured-events" element={<FeaturedEvents />} />
        <Route path="/past-events" element={<PastEvents />} />
        <Route path="/team" element={<Team />} />
        <Route path="/helpdesk" element={<Helpdesk />} />
        <Route path="/the-podium" element={<Newsletter />} />

        {/* New Admin Panel Route */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Standalone routes for testing */}
        <Route path="/feedback" element={<FeedbackForm />}/>
        
      </Routes>
    </>
  );
}

export default App;
