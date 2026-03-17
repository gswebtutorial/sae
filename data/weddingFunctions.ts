export interface WeddingFunction {
  id: string;
  name: string;
  emoji: string;
  description: string;
  items: string[];
}

export const weddingFunctions: WeddingFunction[] = [
  {
    id: "welcome",
    name: "Welcome",
    emoji: "🪄",
    description: "Grand arrival welcome ceremony for guests",
    items: [
      "Dhol",
      "Vehicle Decoration",
      "Phataka / Fireworks",
      "Flower Petals",
      "Welcome Gate / Torana",
      "Security Staff",
      "Valet Parking",
      "Welcome Drink Stall",
      "Entry Carpet",
      "Photography"
    ]
  },
  {
    id: "maayra",
    name: "Maayra",
    emoji: "🎁",
    description: "Gift-giving ritual by maternal family",
    items: [
      "Decoration",
      "Seating Arrangement",
      "Sound System",
      "Gift Display Table",
      "Photography",
      "Videography",
      "Catering / Snacks",
      "Anchor / Host",
      "Flower Decoration"
    ]
  },
  {
    id: "haldi",
    name: "Haldi",
    emoji: "💛",
    description: "Turmeric ceremony for bride and groom",
    items: [
      "Haldi Decoration (Yellow Theme)",
      "Flower Setup",
      "Dhol",
      "Photography",
      "Videography",
      "Haldi Kit & Bowls",
      "Catering / Snacks",
      "Seating Arrangement",
      "DJ / Music"
    ]
  },
  {
    id: "mehendi",
    name: "Mehendi",
    emoji: "🌿",
    description: "Henna ceremony for the bride",
    items: [
      "Mehendi Artist",
      "Decoration",
      "Seating",
      "DJ / Music",
      "Photography",
      "Videography",
      "Catering",
      "Anchor"
    ]
  },
  {
    id: "sangeet",
    name: "Sangeet",
    emoji: "🎶",
    description: "Music and dance night celebration",
    items: [
      "Anchor / Host",
      "DJ / Sound System",
      "LED Screen",
      "Stage Decoration",
      "Lighting Setup",
      "Live Band",
      "Dance Performance Arrangement",
      "Photography",
      "Videography",
      "Catering",
      "Truss Setup",
      "Smoke Machine",
      "Fog Effect"
    ]
  },
  {
    id: "baarat",
    name: "Baarat",
    emoji: "🐴",
    description: "Groom's wedding procession",
    items: [
      "Horse / Ghodi",
      "Decorated Car / Rath",
      "Dhol Party",
      "Band Party",
      "Phataka / Fireworks",
      "Flower Petals / Shower",
      "DJ",
      "Lighting on Route",
      "Photography",
      "Videography",
      "Security"
    ]
  },
  {
    id: "wedding",
    name: "Wedding Ceremony",
    emoji: "💍",
    description: "Main wedding ritual and pheras",
    items: [
      "Mandap Decoration",
      "Seating Arrangement",
      "Pandit / Priest",
      "Sound System",
      "LED Screen",
      "Stage Decoration",
      "Flower Decoration",
      "Photography",
      "Videography",
      "Catering / Full Meal",
      "Lighting",
      "Generator Backup",
      "Venue Booking Assistance"
    ]
  },
  {
    id: "reception",
    name: "Reception",
    emoji: "✨",
    description: "Post-wedding reception party",
    items: [
      "Stage Decoration",
      "LED Screen",
      "DJ / Music",
      "Anchor / Host",
      "Lighting Setup",
      "Catering",
      "Photography",
      "Videography",
      "Welcome Gate",
      "Flower Decoration",
      "Truss Setup",
      "Cake Ceremony Setup",
      "Photo Booth"
    ]
  },
  {
    id: "vidaai",
    name: "Vidaai",
    emoji: "🌸",
    description: "Bride's farewell ceremony",
    items: [
      "Decorated Car",
      "Flower Petals",
      "Photography",
      "Videography",
      "Dhol",
      "Emotional Moment Cinematography"
    ]
  }
];
