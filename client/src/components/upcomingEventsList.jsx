import { Link } from "react-router-dom";
import { Button } from "../ui/buttons";
import { Card } from "../ui/card";
import { Calendar, MapPin, Clock, AlarmClock } from "lucide-react";

export default function EventsList({ events }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-20">
      {events.map((event) => (
        <Card
          key={event.id}
          className="group relative overflow-hidden transition-all duration-500 ease-out border-0 rounded-xl bg-gradient-to-br from-gray-900/80 via-[#1a1a1a]/90 to-black/80 hover:shadow-2xl hover:shadow-[#ff6a00]/20 max-w-md mx-auto min-h-[32rem]"
        >
          {/* Creative Corner Borders */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#ff7f50] rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#ffb84d] rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#ffb84d] rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#ff7f50] rounded-br-xl"></div>

          {/* Diagonal Accent Line */}
          <div className="absolute w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 -right-12 w-24 h-[200%] bg-gradient-to-b from-[#ff7f50]/20 via-[#ffb84d]/6 to-transparent rotate-12 transform-gpu"></div>
          </div>

          {/* Enhanced Image Container with Balanced Aspect Ratio */}
          <div className="relative overflow-hidden rounded-t-xl h-80">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              className="object-contain object-center w-full h-full scale-100 transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
            />

            {/* Subtle Overlay Gradient for Better Text Visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            {/* Registration Deadline Badge */}
            <div className="absolute top-2 right-2 bg-gradient-to-r from-[#ff7f50] to-[#ffb84d] text-[#111] px-3 py-1 rounded-full text-xs font-medium shadow-lg border border-[#ff9a00]/30 backdrop-blur-sm transition-transform duration-300 ease-out transform group-hover:scale-105 group-hover:-translate-y-1">
              <div className="flex items-center space-x-1.5">
                <AlarmClock className="w-3.5 h-3.5" />
                <span>Register by {event.deadline}</span>
              </div>
            </div>

            {/* Event Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-bold text-white text-shadow-sm">
                {event.title}
              </h3>
            </div>
          </div>

          {/* Card Content with Balanced Space */}
          <div className="p-4 space-y-3">
            {/* Date, Time, Location Section */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center text-gray-100 group-hover:text-[#ff9a00] transition-colors duration-300">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span className="text-sm">{event.date}</span>
              </div>
              <div className="flex items-center text-gray-100 group-hover:text-[#ff9a00] transition-colors duration-300">
                <MapPin className="h-4 w-4 mr-1.5" />
                <a
                  href={event.meetlink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm truncate hover:text-blue-300 underline"
                >
                  {event.location}
                </a>
              </div>
            </div>

            {/* Description with Moderate Height */}
            <p className="text-gray-300 text-[13px] pt-4 leading-relaxed line-clamp-3 group-hover:text-gray-200 transition-colors duration-300">
              {event.description}
            </p>

            {/* Register Button */}
            <div className="pt-1.5">
              <a
                href={event.registrationform} // Access the external registration link from the event object
                target="_blank" // Open the link in a new tab
                rel="noopener noreferrer" // Security best practices for opening new tabs
                className="block w-full" // Make the link full width
              >
                <Button className="relative w-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-[#ff4500]/80 via-[#ff6a00]/80 to-[#ffce00]/80 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group/btn">
                  {/* Button text */}
                  <span className="relative z-10 font-medium tracking-wide flex items-center space-x-2 transition-transform duration-500 ease-out group-hover/btn:translate-y-px">
                    <span>Register Now</span>
                    <span className="transform transition-transform duration-300 group-hover/btn:translate-x-1">
                      →
                    </span>
                  </span>

                  {/* Gradient sweep effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 bg-gradient-to-r from-[#ffce00]/20 via-[#ff6a00]/20 to-[#ff4500]/20 transition-transform duration-700 ease-out"></div>

                  {/* Pulse glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 bg-gradient-to-r from-[#ff4500]/0 via-[#ff6a00]/30 to-[#ffce00]/0 blur-md transition-opacity duration-1000 ease-in-out animate-pulse-slow"></div>

                  {/* Bottom highlight */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff6a00] to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 ease-out"></div>
                </Button>
              </a>
            </div>
          </div>

          {/* Reflections/Glow Effects */}
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[#ff7f50]/30 rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"></div>
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#ffb84d]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"></div>
        </Card>
      ))}
    </div>
  );
}
