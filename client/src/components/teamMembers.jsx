import { useState, useEffect, useRef } from "react";
import { teamMembers } from "../lib/data";
import {
  Github,
  Linkedin,
  Mail,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Flame,
} from "lucide-react";

export default function TeamMembersCarousel() {
  // Updated category order - split Core into Founders and Secretaries
  const categoryOrder = [
    "Secretaries",
    "Women's Wing",
    "Events & Operations",
    "Design & Media",
    "Tech & Analytics",
    "PR & Outreach",
    /*"Sponsorship",
    "Research & Publication",
    "Content & Documentation",
    "Social Media",*/
  ];

  // Create normalized category mapping
  const categoryMapping = {};
  categoryOrder.forEach((category) => {
    categoryMapping[category.toLowerCase()] = category;
  });

  // Special mapping for Core members to Founders or Secretaries
  const coreMapping = (member) => {
    return member.category;
  };

  // State for active category and active member index
  const [activeCategory, setActiveCategory] = useState(categoryOrder[0]);
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  // Refs for scrolling functionality
  const scrollContainerRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: true
  });

  // Calculate if we can scroll in either direction
  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    
    setScrollState({
      canScrollLeft: scrollLeft > 1,
      canScrollRight: scrollLeft < scrollWidth - clientWidth - 1
    });
  };

  // Initialize scroll state
  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    
    return () => {
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  // Smooth scroll to the active category
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const activeElement = container.querySelector(`[data-category="${activeCategory}"]`);
    
    if (!activeElement) return;
    
    // Calculate the position to center the element
    const containerRect = container.getBoundingClientRect();
    const elementRect = activeElement.getBoundingClientRect();
    
    const leftPosition = elementRect.left + window.scrollX;
    const containerLeftPosition = containerRect.left + window.scrollX;
    
    const elementCenter = leftPosition + elementRect.width / 2;
    const containerCenter = containerLeftPosition + containerRect.width / 2;
    const scrollAmount = elementCenter - containerCenter;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
    // Update scroll buttons after scrolling
    setTimeout(updateScrollButtons, 300);
  }, [activeCategory]);

  // Scroll handlers
  const scrollLeft = () => {
    if (!scrollContainerRef.current || !scrollState.canScrollLeft) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    
    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
    
    // Update scroll buttons after scrolling
    setTimeout(updateScrollButtons, 300);
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current || !scrollState.canScrollRight) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
    // Update scroll buttons after scrolling
    setTimeout(updateScrollButtons, 300);
  };

  // Handle container scroll events
  const handleScroll = () => {
    updateScrollButtons();
  };
  const carouselRef = useRef(null);
  const categoryNavRef = useRef(null);
  const containerRef = useRef(null);

  // Filter members by active category
  const filteredMembers = teamMembers.filter((member) => {
    const mappedCategory = coreMapping(member);
    const normalizedCategory = mappedCategory && mappedCategory.toLowerCase();
    const displayCategory =
      categoryMapping[normalizedCategory] ||
      (mappedCategory &&
        mappedCategory.charAt(0).toUpperCase() +
          mappedCategory.slice(1).toLowerCase());

    return displayCategory === activeCategory;
  });

  // Reset active member index when category changes
  useEffect(() => {
    setActiveMemberIndex(0);
    // Close mobile menu when category changes
    setIsMobileMenuOpen(false);
  }, [activeCategory]);

  // Handle scroll events for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;

      // Calculate parallax effect based on scroll position relative to container
      if (
        scrollTop > containerTop - window.innerHeight &&
        scrollTop < containerTop + containerHeight
      ) {
        const relativePosition =
          scrollTop - (containerTop - window.innerHeight);
        const parallaxValue = relativePosition * 0.1; // Adjust speed factor as needed
        setParallaxOffset(parallaxValue);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll active category into view when it changes
  useEffect(() => {
    if (categoryNavRef.current) {
      const activeButton =
        categoryNavRef.current.querySelector(".active-category");
      if (activeButton) {
        const navScroll = categoryNavRef.current;
        const buttonRect = activeButton.getBoundingClientRect();
        const navRect = navScroll.getBoundingClientRect();

        // Calculate scroll position to center the button
        const scrollLeft =
          activeButton.offsetLeft -
          navScroll.offsetLeft -
          navRect.width / 2 +
          buttonRect.width / 2;

        navScroll.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [activeCategory]);

  // Navigation functions with transition state
  const nextMember = () => {
    if (isTransitioning || activeMemberIndex === filteredMembers.length - 1)
      return;

    setIsTransitioning(true);
    setActiveMemberIndex((prevIndex) => prevIndex + 1);

    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevMember = () => {
    if (isTransitioning || activeMemberIndex === 0) return;

    setIsTransitioning(true);
    setActiveMemberIndex((prevIndex) => prevIndex - 1);

    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Function to select a specific member
  const selectMember = (index) => {
    if (isTransitioning || index === activeMemberIndex) return;

    setIsTransitioning(true);
    setActiveMemberIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Calculate indices for carousel items
  const getCarouselIndices = () => {
    const total = filteredMembers.length;

    // For mobile view, show fewer items
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const visibleItems = isMobile ? 1 : 3;

    if (total <= visibleItems)
      return Array.from({ length: total }, (_, i) => i);

    // Show only visibleItems with active in the middle
    const indices = [];
    const halfVisible = Math.floor(visibleItems / 2);

    for (let i = -halfVisible; i <= halfVisible; i++) {
      // Handle cases where we're at the edges
      if (activeMemberIndex + i < 0 || activeMemberIndex + i >= total) continue;
      indices.push(activeMemberIndex + i);
    }

    // Add extra items for mobile if needed to maintain visibleItems
    if (indices.length < visibleItems && total >= visibleItems) {
      if (activeMemberIndex === 0) {
        // At the start, add more from the right
        for (let i = indices.length; i < visibleItems; i++) {
          if (activeMemberIndex + i < total) {
            indices.push(activeMemberIndex + i);
          }
        }
      } else if (activeMemberIndex === total - 1) {
        // At the end, add more from the left
        for (let i = indices.length; i < visibleItems; i++) {
          if (activeMemberIndex - i >= 0) {
            indices.unshift(activeMemberIndex - i);
          }
        }
      }
    }

    return indices;
  };

  // Check if carousel is at start or end
  const isFirstMember = activeMemberIndex === 0;
  const isLastMember = activeMemberIndex === filteredMembers.length - 1;

  // Get active member
  const activeMember = filteredMembers[activeMemberIndex] || {};

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex flex-col bg-black mb-8"
    >
      {/* Enhanced Navbar with 3D effect and flame accent */}
      <div className="w-full border-b border-orange-900/30 py-2 shadow-lg bg-gradient-to-b from-gray-900 to-black backdrop-blur-md relative">
      {/* Subtle flame accents for navbar */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-600/30 to-transparent"></div>
      <div className="absolute -bottom-3 left-1/4 w-1 h-3 bg-gradient-to-b from-orange-500/40 to-transparent blur-sm"></div>
      <div className="absolute -bottom-2 left-2/4 w-1 h-2 bg-gradient-to-b from-orange-500/30 to-transparent blur-sm"></div>
      <div className="absolute -bottom-4 left-3/4 w-1 h-4 bg-gradient-to-b from-orange-500/50 to-transparent blur-sm"></div>

      <div className="container mx-auto px-4">
        {/* Mobile toggle button - Enhanced with flame icon */}
          <div className="md:hidden flex justify-between items-center py-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 border border-orange-900/40 rounded-lg flex items-center bg-black/30 shadow-inner shadow-orange-900/10"
              aria-label="Toggle category menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="ml-2 text-sm font-medium">
                {isMobileMenuOpen ? "Close" : "Categories"}
              </span>
            </button>

            <div className="flex items-center">
              <span className="text-white font-bold text-sm bg-gradient-to-r from-[#ff5a00] to-[#ffb700] bg-clip-text text-transparent">
                {activeCategory}
              </span>
            </div>
          </div>

          {/* Mobile dropdown menu - Enhanced with glossy effect */}
          <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
            <div className="py-2 bg-gradient-to-b from-gray-900 to-black rounded-lg shadow-xl my-2 max-h-80 overflow-y-auto border border-gray-800 relative">
              {/* Corner accents for mobile menu */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-orange-600/40 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-orange-600/40 rounded-tr-lg"></div>

            {categoryOrder.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-[#ff5a00] to-[#ffb700] text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop horizontal scrolling categories with enhanced scroll logic */}
        <div className="hidden md:flex items-center justify-center relative px-8">
          {/* Left scroll button - visible only when content is scrollable to the left */}
          <button 
            onClick={scrollLeft}
            disabled={!scrollState.canScrollLeft}
            className={`absolute left-0 z-10 bg-gray-900/80 text-white rounded-full p-1 backdrop-blur-sm shadow-lg transform transition-all duration-200 ${
              scrollState.canScrollLeft 
                ? "opacity-100 hover:bg-gray-800 hover:scale-110 cursor-pointer" 
                : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          
          {/* Categories container with scroll event handler */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex items-center justify-start overflow-x-auto py-2 scrollbar-hide w-full"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="flex items-center space-x-2 px-4">
              {categoryOrder.map((category) => (
                <button
                  key={category}
                  data-category={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                    activeCategory === category
                      ? "active-category bg-gradient-to-r from-[#ff5a00] to-[#ffb700] text-white shadow-lg shadow-orange-900/30 scale-105"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <span className="relative z-10">{category}</span>

                  {/* Enhanced underline indicator for active category */}
                  {activeCategory === category && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff5a00] to-[#ffb700]"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Right scroll button - visible only when content is scrollable to the right */}
          <button 
            onClick={scrollRight}
            disabled={!scrollState.canScrollRight}
            className={`absolute right-0 z-10 bg-gray-900/80 text-white rounded-full p-1 backdrop-blur-sm shadow-lg transform transition-all duration-200 ${
              scrollState.canScrollRight 
                ? "opacity-100 hover:bg-gray-800 hover:scale-110 cursor-pointer" 
                : "opacity-0 pointer-events-none"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>

      {/* Main Content: Carousel + Details - with enhanced parallax effect */}
      <div
        className="flex-1 flex flex-col items-center justify-center relative overflow-hidden py-6"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Category Title with parallax counter-effect for depth */}
        <div
          className="w-full text-center"
          style={{
            transform: `translateY(${-parallaxOffset * 0.3}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff5a00] via-[#ffb700] to-[#ffe808] relative inline-block">
            <Flame
              size={20}
              className="absolute -left-6 top-1/2 -translate-y-1/2 text-orange-500 animate-float-slow opacity-70"
            />
            {activeCategory} Team
            <Flame
              size={20}
              className="absolute -right-6 top-1/2 -translate-y-1/2 text-orange-500 animate-float-medium opacity-70"
            />
          </p>
          <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-[#ff8c14] to-transparent mt-2" />
        </div>

        {/* Enhanced Carousel Section with additional flame effects and corner borders */}
        <div className="w-full relative" style={{ height: "min(70vh, 480px)" }}>
          {/* Navigation Arrows - Responsive size with enhanced flame effects */}
          {!isFirstMember && (
            <button
              className="opacity-70 absolute left-2 sm:left-32 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-transparent via-gray-200 to-gray-200/80 backdrop-blur-sm p-2 sm:p-4 rounded-full text-gray-700 hover:bg-white hover:bg-opacity-80 transition-all hover:scale-105 sm:hover:scale-110 border border-gray-300/50 sm:border-2 hover:border-[#ff8c14] group shadow-sm sm:shadow-md"
              onClick={prevMember}
              disabled={isTransitioning}
              aria-label="Previous team member"
            >
              <ChevronLeft size={20} className="stroke-2 text-gray-700 sm:hidden" />
              <ChevronLeft size={28} className="stroke-2 text-gray-700 hidden sm:block" />
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity"></div>
            </button>
          )}

          {!isLastMember && (
            <button
              className="opacity-70 absolute right-2 sm:right-32 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-l from-transparent via-gray-200 to-gray-200/80 backdrop-blur-sm p-2 sm:p-4 rounded-full text-gray-700 hover:bg-white hover:bg-opacity-80 transition-all hover:scale-105 sm:hover:scale-110 border border-gray-300/50 sm:border-2 hover:border-[#ff8c14] group shadow-sm sm:shadow-md"
              onClick={nextMember}
              disabled={isTransitioning}
              aria-label="Next team member"
            >
              <ChevronRight size={20} className="stroke-2 text-gray-700 sm:hidden" />
              <ChevronRight size={28} className="stroke-2 text-gray-700 hidden sm:block" />
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity"></div>
            </button>
          )}

          {/* Enhanced background with more flame effects */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Base gradient background */}
            <div className="absolute inset-0 bg-gradient-radial from-gray-900/30 to-black/0"></div>

            {/* Additional flame elements in the background */}
            <div className="absolute left-1/4 top-1/4 w-28 h-28 rounded-full bg-orange-500/5 blur-xl animate-pulse"></div>
            <div className="absolute right-1/4 bottom-1/4 w-24 h-24 rounded-full bg-yellow-500/5 blur-xl animate-pulse-slow"></div>

            {/* Top corners flame ornaments */}
            <div className="absolute top-0 left-6 w-32 h-32 opacity-20 bg-gradient-to-b from-[#ff5a00] to-transparent rounded-full blur-xl"></div>
            <div className="absolute top-0 right-6 w-24 h-24 opacity-15 bg-gradient-to-b from-[#ffb700] to-transparent rounded-full blur-xl"></div>

            {/* Center subtle glow - activated when member is selected */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5 bg-gradient-radial from-[#ff8c14] to-transparent rounded-full blur-xl"></div>

            {/* Animated flame particles - enhanced with more particles */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 opacity-30 bg-[#ffb700] rounded-full blur-md animate-float-slow"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 opacity-20 bg-[#ff5a00] rounded-full blur-md animate-float-slower"></div>
            <div className="absolute bottom-1/3 left-1/5 w-2 h-2 opacity-25 bg-[#ff8c14] rounded-full blur-md animate-float-medium"></div>
            <div className="absolute bottom-1/4 right-1/3 w-3 h-3 opacity-20 bg-[#ffb700] rounded-full blur-md animate-float-fast"></div>

            {/* Additional flame particles */}
            <div className="absolute top-1/2 left-1/6 w-2 h-2 opacity-30 bg-[#ff5a00] rounded-full blur-md animate-float-random1"></div>
            <div className="absolute top-2/3 right-1/5 w-1.5 h-1.5 opacity-25 bg-[#ffb700] rounded-full blur-md animate-float-random2"></div>

            {/* Enhanced Edge flame line accents - made more prominent */}
            <div className="absolute left-12 top-1/2 -translate-y-1/2 h-48 w-0.5 opacity-40 bg-gradient-to-b from-transparent via-[#ff5a00] to-transparent"></div>
            <div className="absolute right-12 top-1/2 -translate-y-1/2 h-48 w-0.5 opacity-40 bg-gradient-to-b from-transparent via-[#ff5a00] to-transparent"></div>

            {/* Enhanced Diagonal flame accents - made more prominent */}
            <div className="absolute left-24 top-1/4 h-64 w-1 opacity-35 bg-gradient-to-b from-transparent via-[#ffb700] to-transparent transform rotate-45"></div>
            <div className="absolute right-24 top-1/4 h-64 w-1 opacity-35 bg-gradient-to-b from-transparent via-[#ffb700] to-transparent transform -rotate-45"></div>
          </div>

          {/* Carousel */}
          <div
            ref={carouselRef}
            className="absolute w-full h-full flex items-center justify-center"
            style={{
              transform: `translateY(${-parallaxOffset * 0.05}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            {filteredMembers.length > 0 ? (
              getCarouselIndices().map((index) => {
                const member = filteredMembers[index];
                const isActive = index === activeMemberIndex;

                // Calculate position based on difference from active
                const diff = index - activeMemberIndex;

                // Adjust transforms for mobile vs desktop
                const isMobile =
                  typeof window !== "undefined" && window.innerWidth < 640;
                const translateX = isMobile
                  ? diff * 220 // Smaller spacing for mobile
                  : diff * 280; // Original spacing for desktop

                const scale = isActive
                  ? isMobile
                    ? 1
                    : 1.1
                  : isMobile
                    ? 0.8
                    : 0.7;
                const zIndex = isActive ? 10 : 5 - Math.abs(diff);
                const opacity = isActive ? 1 : Math.abs(diff) === 1 ? 0.5 : 0;

                // Don't render items that are too far away
                if (isMobile && Math.abs(diff) > 0) return null;
                if (!isMobile && Math.abs(diff) > 1) return null;

                return (
                  <div
                    key={member.id}
                    onClick={() => selectMember(index)}
                    className={`absolute cursor-pointer transition-all mb-10 duration-500 ease-out transform-gpu`}
                    style={{
                      transform: `translateX(${translateX}px) scale(${scale})`,
                      zIndex,
                      opacity,
                    }}
                  >
                    {/* Active card glow effect - enhanced */}
                    {isActive && (
                      <div className="absolute -inset-4 bg-gradient-to-b from-[#ff5a00]/10 via-[#ffb700]/10 to-[#ff5a00]/10 rounded-2xl blur-xl opacity-70"></div>
                    )}

                    <div
                      className={`rounded-xl overflow-hidden ${
                        isActive
                          ? "shadow-2xl shadow-orange-900/30"
                          : "shadow-lg"
                      } relative`}
                      style={{
                        width: isActive
                          ? isMobile
                            ? "220px"
                            : "260px"
                          : isMobile
                            ? "180px"
                            : "220px",
                      }}
                    >
                      {/* Corner borders - Added for all cards but more prominent on active */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-orange-500/30 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange-500/30 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-orange-500/30 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-orange-500/30 rounded-br-lg"></div>

                      {/* Image container - reduced heights and responsive */}
                      <div
                        className="relative"
                        style={{
                          height: isActive
                            ? isMobile
                              ? "320px"
                              : "360px"
                            : isMobile
                              ? "280px"
                              : "320px",
                        }}
                      >
                        <img
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />

                        {/* Enhanced gradient overlay with subtle flames at edges */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent">
                          {/* Add subtle flame flickers at the edges for active card */}
                          {isActive && (
                            <>
                              <div className="absolute bottom-0 left-0 w-10 h-32 bg-gradient-to-tr from-[#ff5a00]/20 to-transparent opacity-30 blur-md"></div>
                              <div className="absolute bottom-0 right-0 w-10 h-32 bg-gradient-to-tl from-[#ffb700]/20 to-transparent opacity-30 blur-md"></div>

                              {/* Additional flame accents for active card */}
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-16 bg-gradient-to-b from-[#ff8c14]/20 to-transparent opacity-20 blur-md"></div>
                              <div className="absolute top-8 left-8 w-2 h-2 bg-orange-500/40 rounded-full blur-sm animate-float-slow"></div>
                              <div className="absolute top-6 right-10 w-1.5 h-1.5 bg-yellow-500/40 rounded-full blur-sm animate-float-medium"></div>
                            </>
                          )}
                        </div>

                        {/* Active state indicators - improved with animated border */}
                        {isActive && (
                          <>
                            <div className="absolute inset-0 ring-1 ring-[#ff8c14] ring-opacity-60 rounded-xl"></div>
                            <div className="absolute -bottom-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#ff8c14]/70 to-transparent"></div>

                            {/* Animated border effect for active card */}
                            <div className="absolute inset-0 border border-orange-500/20 rounded-xl animate-border-pulse"></div>
                          </>
                        )}

                        {/* Bottom info panel - enhanced styling with corner accents */}
                        <div
                          className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-center transition-all duration-500 ${
                            isActive
                              ? "bg-gradient-to-t from-black via-black/90 to-transparent pt-10 sm:pt-12"
                              : "bg-black/80"
                          }`}
                        >
                          <h3
                            className={`font-bold text-white transition-all duration-300 ${
                              isActive
                                ? "text-lg sm:text-xl mb-1"
                                : "text-sm sm:text-base mb-0.5"
                            }`}
                          >
                            {member.name}
                          </h3>

                          <p
                            className={`font-medium transition-all duration-300 ${
                              isActive
                                ? "text-gray-200 text-xs sm:text-sm"
                                : "text-gray-400 text-xs"
                            }`}
                          >
                            {member.position}
                          </p>

                          {/* Social links - enhanced with better hover effects */}
                          {isActive && (
                            <div className="flex justify-center space-x-4 mt-2 sm:mt-3">
                              {member.linkedin && (
                                <a
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-300 hover:text-[#ff9a00] transition-all duration-200 hover:scale-125 group"
                                  aria-label={`${member.name}'s LinkedIn`}
                                >
                                  <Linkedin className="h-4 w-4" />
                                  <span className="absolute w-4 h-4 bg-orange-500/30 rounded-full opacity-0 group-hover:opacity-100 blur-sm -z-10 transition-opacity"></span>
                                </a>
                              )}
                              {member.github && (
                                <a
                                  href={member.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-300 hover:text-[#ff9a00] transition-all duration-200 hover:scale-125 group"
                                  aria-label={`${member.name}'s GitHub`}
                                >
                                  <Github className="h-4 w-4" />
                                  <span className="absolute w-4 h-4 bg-orange-500/30 rounded-full opacity-0 group-hover:opacity-100 blur-sm -z-10 transition-opacity"></span>
                                </a>
                              )}
                              {member.email && (
                                <a
                                  href={`mailto:${member.email}`}
                                  className="text-gray-300 hover:text-[#ff9a00] transition-all duration-200 hover:scale-125 group"
                                  aria-label={`Email ${member.name}`}
                                >
                                  <Mail className="h-4 w-4" />
                                  <span className="absolute w-4 h-4 bg-orange-500/30 rounded-full opacity-0 group-hover:opacity-100 blur-sm -z-10 transition-opacity"></span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-400 bg-gray-900/50 p-6 rounded-xl">
                No team members found in this category
              </div>
            )}
          </div>
        </div>

        {/* Carousel Indicators - Redesigned and responsive */}
        {filteredMembers.length > 0 && (
          <div
            className="flex justify-center mt-6 sm:mt-8 space-x-1.5 sm:space-x-2"
            style={{
              transform: `translateY(${-parallaxOffset * 0.15}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            {filteredMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => selectMember(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === activeMemberIndex
                    ? "bg-gradient-to-r from-[#ff5a00] to-[#ffb700] w-5 sm:w-6 h-1.5"
                    : "bg-gray-700 w-2 sm:w-2.5 h-1.5 hover:bg-gray-500"
                }`}
                aria-label={`View team member ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Custom CSS to hide scrollbars */}
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        /* Add smooth scrolling to the whole document */
        html {
          scroll-behavior: smooth;
        }

        /* Add radial gradient support */
        .bg-gradient-radial {
          background-image: radial-gradient(var(--tw-gradient-stops));
        }

        /* Floating animation for flame particles */
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-10px) translateX(5px);
          }
        }

        @keyframes float-slower {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-15px) translateX(-7px);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-7px) translateX(3px);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-5px) translateX(-2px);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 12s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }

        /* Improve touch handling for mobile */
        @media (max-width: 640px) {
          .transform-gpu {
            will-change: transform;
            transform: translateZ(0);
          }
        }
      `}</style>
    </div>
  );
}
