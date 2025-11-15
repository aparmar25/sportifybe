// src/components/Footer.jsx

import {
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import logo from "../assets/sportify_logo1.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#111111] via-[#1a1a1a] to-black text-white pt-16 pb-8 border-t border-gray-800 px-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 mb-8 gap-12 items-start justify-between">
          {/* Logo & About */}
          <div className="flex flex-col justify-start">
            {/* Heading: Logo & Title */}
            <div className="flex items-center mb-4">
              <img
                src={logo}
                alt="Sportify Logo"
                width={50}
                height={50}
                className="mr-3 drop-shadow-md"
              />
              <h3 className="text-2xl font-extrabold tracking-wide text-[#f8f8f8]">
                THE SPORTIFY
              </h3>
            </div>

            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              IIT Madras BS Degree Sports Society — spreading the joy of sports
              and fostering a community of athletes.
            </p>

            <div className="flex space-x-4">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/sportify_iitm/" },
                {
                  Icon: Linkedin,
                  href: " https://www.linkedin.com/company/the-sportify-society/",
                },
                { Icon: Youtube, href: "https://www.youtube.com/@thesportifyiitmbs/" },
              ].map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors hover:scale-110 duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-start md:items-end">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a00] via-[#ff9a00] to-[#ffe808] relative inline-block">
                Contact Us
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-[#ff5a00] via-[#ff9a00] to-[#ffe808]" />
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-400 text-left md:text-right">
              <li className="flex items-start md:justify-end">
                <MapPin className="h-5 w-5 mr-2 text-[#ff9a00] mt-0.5" />
                <span>IIT Madras Campus, Chennai, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center md:justify-end">
                <Phone className="h-5 w-5 mr-2 text-[#ff9a00]" />
                <span>+91 9878449480, +91 7870825906</span>
              </li>
              <li className="flex items-center md:justify-end">
                <Mail className="h-5 w-5 mr-2 text-[#ff9a00]" />
                <span>thesportify.society@study.iitm.ac.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 text-sm text-gray-500 flex flex-col justify-between items-center">
          <p className="mb-4 md:mb-0">
            © {currentYear}{" "}
            <span className="text-white font-semibold">THE SPORTIFY</span>. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
