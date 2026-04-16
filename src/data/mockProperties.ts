import { Property } from "../types";

export const mockProperties: Property[] = [
  {
    id: "prop-001",
    title: "Sunlit Penthouse with Skyline Views",
    price: 185000,
    category: "rent",
    type: "Penthouse",
    location: "Bole",
    city: "Addis Ababa",
    description:
      "A modern penthouse with floor-to-ceiling windows, warm finishes, and a private terrace overlooking the city skyline.",
    images: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448075-bb4caa6ee8f4?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    bedrooms: 4,
    bathrooms: 3,
    area: 230,
    latitude: 8.9806,
    longitude: 38.7578,
    agentName: "Mikael Tesfaye",
    agentPhone: "+251 911 223 344",
    createdAt: "2026-02-14T09:00:00.000Z"
  },
  {
    id: "prop-002",
    title: "Contemporary Family Villa",
    price: 34500000,
    category: "sale",
    type: "Villa",
    location: "Cazanchise",
    city: "Addis Ababa",
    description:
      "Private villa living with landscaped gardens, generous rooms, and a bright open-plan kitchen for easy entertaining.",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    bedrooms: 5,
    bathrooms: 4,
    area: 410,
    latitude: 8.995,
    longitude: 38.79,
    agentName: "Selam Abebe",
    agentPhone: "+251 912 333 780",
    createdAt: "2026-01-22T12:10:00.000Z"
  },
  {
    id: "prop-003",
    title: "Minimal Studio Near Business District",
    price: 42000,
    category: "rent",
    type: "Studio",
    location: "Kazanchis",
    city: "Addis Ababa",
    description:
      "Compact, efficient, and fully furnished. Ideal for professionals who want walkable access to work and nightlife.",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    bedrooms: 1,
    bathrooms: 1,
    area: 42,
    latitude: 8.9908,
    longitude: 38.76,
    agentName: "Hana Girma",
    agentPhone: "+251 911 880 120",
    createdAt: "2026-03-01T15:40:00.000Z"
  },
  {
    id: "prop-004",
    title: "Elegant Townhouse with Private Courtyard",
    price: 120000,
    category: "rent",
    type: "Townhouse",
    location: "CMC",
    city: "Addis Ababa",
    description:
      "A quiet townhouse with premium finishes, a private courtyard, and a flexible layout for families or remote work.",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    bedrooms: 3,
    bathrooms: 3,
    area: 175,
    latitude: 9.0405,
    longitude: 38.8151,
    agentName: "Dagmawi Solomon",
    agentPhone: "+251 913 440 551",
    createdAt: "2026-02-10T08:20:00.000Z"
  },
  {
    id: "prop-005",
    title: "Executive Office Suite",
    price: 165000,
    category: "rent",
    type: "Office",
    location: "Sarbet",
    city: "Addis Ababa",
    description:
      "A polished office suite in a prime commercial corridor with flexible open space and meeting rooms.",
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    bedrooms: 0,
    bathrooms: 2,
    area: 260,
    latitude: 8.987,
    longitude: 38.71,
    agentName: "Mulugeta Kebede",
    agentPhone: "+251 911 009 091",
    createdAt: "2026-03-15T11:15:00.000Z"
  },
  {
    id: "prop-006",
    title: "Bright Apartment with Rooftop Access",
    price: 92000,
    category: "rent",
    type: "Apartment",
    location: "Lideta",
    city: "Addis Ababa",
    description:
      "A polished apartment with a rooftop lounge, secure parking, and plenty of natural light throughout the day.",
    images: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    bedrooms: 2,
    bathrooms: 2,
    area: 112,
    latitude: 8.99,
    longitude: 38.72,
    agentName: "Rahel Bekele",
    agentPhone: "+251 912 222 776",
    createdAt: "2026-04-02T16:10:00.000Z"
  },
  {
    id: "prop-007",
    title: "Luxury Villa in Quiet Neighborhood",
    price: 28500000,
    category: "sale",
    type: "Villa",
    location: "Ayat",
    city: "Addis Ababa",
    description:
      "A high-end villa designed for privacy and entertaining, with a garden, multiple balconies, and a spacious master suite.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    bedrooms: 6,
    bathrooms: 5,
    area: 500,
    latitude: 9.073,
    longitude: 38.845,
    agentName: "Tadesse Ayalew",
    agentPhone: "+251 911 145 678",
    createdAt: "2026-03-21T13:55:00.000Z"
  },
  {
    id: "prop-008",
    title: "Boutique Apartment Near Everything",
    price: 58000,
    category: "rent",
    type: "Apartment",
    location: "Piassa",
    city: "Addis Ababa",
    description:
      "A charming apartment with boutique style, smart storage, and quick access to cafes, shops, and transport.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    bedrooms: 2,
    bathrooms: 1,
    area: 86,
    latitude: 9.03,
    longitude: 38.74,
    agentName: "Meron Fikru",
    agentPhone: "+251 911 332 211",
    createdAt: "2026-04-05T10:30:00.000Z"
  }
];
