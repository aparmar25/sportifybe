import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import logo from "../assets/sportify_logo1.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Featured Events", path: "/featured-events" },
  { name: "Past Events", path: "/past-events" },
  { name: "The Podium", path: "/the-podium" },
  { name: "Team", path: "/team" },
  { name: "Helpdesk", path: "/helpdesk" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md shadow-lg"
          : "bg-black/90 backdrop-blur-md shadow-lg"
      }`}
    >
      {/* Stylish white reflection border that's thicker in center and fades to edges */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] w-full">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-70"></div>
          <div className="absolute inset-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent blur-[0.5px] opacity-60"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 
             outline-none ring-0 focus:outline-none focus:ring-0 
             active:outline-none active:ring-0 
             focus-visible:outline-none focus-visible:ring-0"
          >
            <img
              src={logo || "/placeholder.svg"}
              alt="Sportify Logo"
              className="w-10 h-10 md:w-12 md:h-12"
            />
            <span className="font-bold text-xl md:text-2xl text-white">
              THE SPORTIFY
            </span>
          </Link>

          {/* Desktop Navigation shifted to the right */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium py-2 transition-all duration-200 group focus:outline-none active:outline-none active:ring-0 ${
                    pathname === link.path
                      ? "text-transparent bg-clip-text bg-[linear-gradient(90deg,#ff0000,#ff5a00,#ff9a00,#ffce00,#ffe808)]"
                      : "text-white hover:text-transparent hover:bg-clip-text hover:bg-[linear-gradient(90deg,#ff0000,#ff5a00,#ff9a00,#ffce00,#ffe808)]"
                  }`}
                >
                  {link.name}

                  {/* Enhanced hover effect with flame gradient underline */}
                  <span
                    className={`absolute left-0 -bottom-0 h-[2px] bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 rounded-full transition-all duration-300 ${
                      pathname === link.path
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>

                  {/* Subtle glow effect on hover */}
                </Link>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-black/20 focus:outline-none">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black text-white pt-10">
                <div className="flex flex-col space-y-6 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`text-lg font-medium transition-all duration-300 relative ${
                        pathname === link.path
                          ? "text-transparent bg-clip-text bg-[linear-gradient(90deg,#ff0000,#ff5a00,#ff9a00,#ffce00,#ffe808)]"
                          : "text-white hover:text-transparent hover:bg-clip-text hover:bg-[linear-gradient(90deg,#ff0000,#ff5a00,#ff9a00,#ffce00,#ffe808)]"
                      }`}
                    >
                      {link.name}
                      {/* Stylish underline for mobile menu too */}
                      <span
                        className={`absolute left-0 -bottom-1 h-[2px] bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 transition-all duration-300 ${
                          pathname === link.path ? "w-full" : "w-0"
                        }`}
                      ></span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
