import React from "react";
import { cn } from "../lib/utils.js";

// Card Component - Main card structure
export const Card = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white text-gray-800 shadow-md transition-all duration-300 ease-in-out hover:bg-gray-100", // Adding more refined hover effects and border
        className
      )}
      {...props}
    />
  );
};

// CardHeader Component - The header section of the card (e.g., Title and description)
export const CardHeader = ({ className, ...props }) => {
  return (
    <div className={cn("p-4 border-b border-gray-200", className)} {...props} />
  );
};

// CardTitle Component - Title of the card
export const CardTitle = ({ className, ...props }) => {
  return (
    <h2 className={cn("text-xl font-semibold text-gray-900", className)} {...props} />
  );
};

// CardDescription Component - Subtitle or description of the card
export const CardDescription = ({ className, ...props }) => {
  return (
    <p className={cn("text-sm text-gray-500 mt-1", className)} {...props} />
  );
};

// CardContent Component - The main content section inside the card
export const CardContent = ({ className, ...props }) => {
  return (
    <div className={cn("p-4", className)} {...props} />
  );
};

// CardFooter Component - Optional footer section (for adding buttons or actions)
export const CardFooter = ({ className, ...props }) => {
  return (
    <div className={cn("p-4 border-t border-gray-200", className)} {...props} />
  );
};
