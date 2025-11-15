// src/lib/types.js

// Event object schema (used for event data)
export const Event = {
    id: String,
    title: String,
    date: String,
    time: String,
    location: String,
    category: String,
    description: String,
    image: String,
    isPast: Boolean, // Optional boolean flag
    tags: Array, // Optional array of tags
  };
  
  // TeamMember object schema (used for team member data)
  export const TeamMember = {
    id: String,
    name: String,
    position: String,
    bio: String,
    image: String,
    linkedin: String,  // Optional
    github: String,    // Optional
    email: String,     // Optional
  };
  