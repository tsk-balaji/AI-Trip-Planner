
import {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "google-generative-ai";

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const { startLocation, destination, startDate, endDate, persons, budgetType } = req.body;

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({

  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `generate a travel plan from ${location} to ${destination} from ${startDate}  till [end date] for [no of persons] with a [budget-type].\n\ngive me hotel stay options with rating , pricing , hotel image url , geo coordinates, rating , description, and suggest the map route and also  suggest highly visited places and must try places with place coordinates , image url and also suggest the ideal fuel stops with average of 250kms in json format `,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: 'Okay, I\'m ready to help you plan your trip! To give you the best and most accurate results, I need you to fill in the bracketed information.  Please provide:\n\n*   **`[start Location]`**:  Your origin city/area (e.g., "New York City", "London", "Los Angeles")\n*   **`[destination]`**:  Your destination city/area (e.g., "Miami", "Paris", "San Francisco")\n*   **`[start date]`**:  The starting date of your trip (e.g., "2024-03-15")\n*   **`[end date]`**:  The ending date of your trip (e.g., "2024-03-22")\n*   **`[no of persons]`**:  The number of travelers (e.g., "2", "4", "1")\n*   **`[budget-type]`**:  Your budget type (e.g., "Budget", "Mid-Range", "Luxury")\n\nOnce you provide that information, I will generate a JSON-formatted itinerary including:\n\n*   **Hotel Options:**  Multiple hotels based on your `[budget-type]`, with:\n    *   `name`: Hotel name\n    *   `rating`: Hotel star rating (e.g., 3.5, 4.0, 5.0)\n    *   `pricing`: Average nightly price (e.g., "$150", "€200")\n    *   `image_url`: URL of a hotel image\n    *   `geo`: { `latitude`: (decimal), `longitude`: (decimal) }\n    *   `description`: A brief description of the hotel and its amenities.\n*   **Map Route Suggestion:** A summary of the suggested route (if applicable, particularly for driving trips), highlighting major highways and approximate travel time. I\'ll rely on external mapping services to determine the best route, but I\'ll summarize it for you.\n*   **Highly Visited Places (Must-See):**\n    *   `name`: Name of the attraction\n    *   `geo`: { `latitude`: (decimal), `longitude`: (decimal) }\n    *   `image_url`: URL of an image of the attraction\n    *   `description`: A short description of the place and why it\'s a must-see.\n*   **Must-Try Places (Food/Experiences):**\n    *   `name`: Name of the restaurant/experience\n    *   `cuisine`: Type of food/experience (e.g., "Italian", "Sunset Cruise")\n    *   `geo`: { `latitude`: (decimal), `longitude`: (decimal) }\n    *   `image_url`: URL of an image representing the place/experience\n    *   `description`: A brief description of what to expect.\n*   **Ideal Fuel Stops (for Driving Trips):**  (Every 250km, if driving)\n    *   `location`: Name of a town/city where a fuel stop is recommended\n    *   `geo`: { `latitude`: (decimal), `longitude`: (decimal) }\n    *   `notes`: "Fuel stop recommended. Consider also rest and refreshments."\n\n**Example Response (Illustrative - actual content will vary based on your inputs):**\n\n```json\n{\n  "trip_details": {\n    "start_location": "New York City",\n    "destination": "Miami",\n    "start_date": "2024-03-15",\n    "end_date": "2024-03-22",\n    "number_of_persons": 2,\n    "budget_type": "Mid-Range"\n  },\n  "hotel_options": [\n    {\n      "name": "The Marlin Hotel South Beach",\n      "rating": 4.0,\n      "pricing": "$250",\n      "image_url": "https://example.com/marlin_hotel.jpg",\n      "geo": {\n        "latitude": 25.790654,\n        "longitude": -80.130045\n      },\n      "description": "Stylish hotel in South Beach, close to the beach and nightlife. Offers modern rooms and a rooftop pool."\n    },\n    {\n      "name": "Hotel Gaythering - Gay Hotel - All Male",\n      "rating": 3.5,\n      "pricing": "$200",\n      "image_url": "https://example.com/gaythering_hotel.jpg",\n      "geo": {\n        "latitude": 25.8033,\n        "longitude": -80.1299\n      },\n      "description": "Welcoming, stylish place for male travelers, offering a sauna, and a bar."\n    }\n\n  ],\n  "map_route": "Driving from New York City to Miami is approximately 1,300 miles.  The most common route is via I-95 South.  Expect around 20-24 hours of driving time, excluding stops.",\n  "must_see_places": [\n    {\n      "name": "South Beach",\n      "geo": {\n        "latitude": 25.790654,\n        "longitude": -80.130045\n      },\n      "image_url": "https://example.com/south_beach.jpg",\n      "description": "Iconic beach with Art Deco architecture, vibrant nightlife, and a lively atmosphere."\n    },\n    {\n      "name": "Everglades National Park",\n      "geo": {\n        "latitude": 25.3008,\n        "longitude": -80.9312\n      },\n      "image_url": "https://example.com/everglades.jpg",\n      "description": "Unique ecosystem with alligators, birds, and diverse wildlife. Offers airboat tours and hiking trails."\n    }\n  ],\n  "must_try_places": [\n    {\n      "name": "Joe\'s Stone Crab",\n      "cuisine": "Seafood",\n      "geo": {\n        "latitude": 25.7793,\n        "longitude": -80.1300\n      },\n      "image_url": "https://example.com/joes_crab.jpg",\n      "description": "Famous for its stone crab claws, a Miami institution."\n    },\n    {\n      "name": "Versace Mansion",\n      "cuisine": "Italian",\n      "geo": {\n        "latitude": 25.7800,\n        "longitude": -80.1299\n      },\n      "image_url": "https://example.com/versace_mansion.jpg",\n      "description": "Iconic mansion that serves authentic Italian cuisine."\n    }\n  ],\n  "fuel_stops": [\n    {\n      "location": "Florence, SC",\n      "geo": {\n        "latitude": 34.1954,\n        "longitude": -79.7603\n      },\n      "notes": "Fuel stop recommended. Consider also rest and refreshments."\n    },\n    {\n      "location": "Savannah, GA",\n      "geo": {\n        "latitude": 32.0835,\n        "longitude": -81.0998\n      },\n      "notes": "Fuel stop recommended. Consider also rest and refreshments."\n    }\n  ]\n}\n```\n\n**Important Considerations:**\n\n*   **Real-time Data:** Hotel availability, pricing, and route conditions change constantly. The data I provide is based on general information and should be confirmed closer to your travel dates using dedicated travel websites and apps (e.g., Booking.com, Expedia, Google Maps, etc.).\n*   **Image URLs:** I will provide placeholder image URLs (e.g., `https://example.com/`). You\'ll need to replace these with actual image URLs from Google Images, hotel websites, or other sources.\n*   **Geolocation:**  I will do my best to provide accurate coordinates, but always double-check them using a mapping service before your trip.\n*   **Specific Preferences:** Let me know if you have any specific interests (e.g., "historical sites," "beaches," "nightlife") so I can tailor the recommendations accordingly.\n*   **Driving Route Options**: I will generate one driving route , you may need to compare other driving routes on google maps.\n\nI look forward to helping you create a fantastic trip! Provide the requested information so I can start planning.\n',
        },
      ],
    },
  ],
});
