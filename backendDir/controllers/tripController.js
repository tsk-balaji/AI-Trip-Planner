require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing in the .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
// Consider using a model that might be better suited for structured data if available
// or stick with gemini-1.5-flash if it works well enough.
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using 1.5 flash as requested

const generationConfig = {
  temperature: 0.8, // Slightly lower temp might help with structure adherence
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseFormat: "json", // Use responseFormat for explicit JSON output control
};

exports.geminiAI = async (req, res) => {
  try {
    const {
      startLocation,
      destination,
      startDate,
      endDate,
      persons,
      budgetType,
    } = req.body;

    // Validate input
    if (
      !startLocation ||
      !destination ||
      !startDate ||
      !endDate ||
      !persons ||
      !budgetType
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // --- Refined Prompt ---
    const prompt = `
      Generate a detailed travel plan based on the following user requirements. Respond STRICTLY with a valid JSON object that follows the specified schema. Do not include any text outside the JSON object (like "json\`\`\`" or "\`\`\`").

      User Requirements:
      - Start Location: ${startLocation}
      - Destination: ${destination}
      - Travel Dates: ${startDate} to ${endDate}
      - Number of Travelers: ${persons}
      - Budget Type: ${budgetType} (e.g., Budget, Mid-range, Luxury)

      JSON Schema Requirements:
      {
        "tripDetails": {
          "startCity": "${startLocation}",
          "endCity": "${destination}",
          "startDate": "${startDate}",
          "endDate": "${endDate}",
          "travelers": ${persons},
          "budget": "${budgetType}"
        },
        "itinerary": {
          // Dynamically generate keys like "day1", "day2", etc., based on dates
          // Example for one day:
          "day1": {
            "date": "YYYY-MM-DD", // Calculate actual date based on startDate
            "activities": [
              {
                "time": "Approximate Time (e.g., 8:00 AM)",
                "description": "Activity description (e.g., Depart from ${startLocation}.)"
              },
              {
                "time": "Approximate Time (e.g., 1:00 PM)",
                "description": "Activity description (e.g., Arrive in ${destination} and check into hotel.)"
              }
              // Add more activities for the day
            ]
          }
          // Add more days as needed for the duration (endDate - startDate)
        },
        "hotelOptions": [
          // Provide 1-3 hotel suggestions fitting the budgetType
          {
            "name": "Suggested Hotel Name",
            "rating": "Estimated rating (e.g., 4.0 or 'Budget-friendly')", // Use string or number
            "estimatedPricePerNight": "Approximate price range or description (e.g., '$$,' '₹2000-₹3000', 'Affordable')", // Use string
            "representativeImageUrl": "URL of a representative image (e.g., related to the city, hotel style, or a placeholder like 'https://via.placeholder.com/300') OR null if unavailable", // Be clear this might be a placeholder
            "gmapSearchLink": "Generated Google Maps search URL based on hotel name and destination (e.g., https://www.google.com/maps/search/?api=1&query=Hotel+Name+${destination})",
            "coordinates": { // Estimated coordinates for the general area or city center if specific hotel isn't known
               "latitude": 12.3456, // Provide reasonable estimate for destination
               "longitude": 78.9012 // Provide reasonable estimate for destination
             },
            "description": "Brief description of the suggested hotel and why it fits the criteria."
          }
          // Add more hotel options if appropriate
        ],
        "mapUIData": { // Optional: If feasible, provide route data, otherwise keep structure minimal
           "start": {
               "latitude": null, // Attempt to find coordinates for startLocation
               "longitude": null,
               "label": "${startLocation}"
             },
           "end": {
               "latitude": null, // Attempt to find coordinates for destination
               "longitude": null,
               "label": "${destination}"
           },
           "waypoints": [ // Suggest potential waypoints like major towns or points of interest if a road trip
             // Example: { "latitude": null, "longitude": null, "label": "Interesting Town" }
           ],
           "routeCoordinates": [ // Only if waypoints/route is well-defined, otherwise keep empty or omit
             // Example: [ [start_lat, start_lon], [waypoint1_lat, waypoint1_lon], [end_lat, end_lon] ]
           ]
         },
         "disclaimer": "Hotel details (ratings, prices, images, map links) are suggestions based on AI analysis and may not be exact or real-time. Please verify all details independently before booking."
      }

      Generate the JSON response now based on the requirements and schema.
    `;

    console.log("✅ Gemini API request started...");
    // console.log("Request data:", req.body); // Keep for debugging if needed
    // console.log("Prompt:", prompt); // Log the prompt for debugging

    const result = await model.generateContent(prompt, generationConfig); // Pass config here
    const response = result.response; // Access response directly

    console.log("✅ API Response received.");
    // console.log("Raw AI Response Text:", response.text()); // Log raw text for debugging

    // Extract and parse response
    let tripPlan;
    try {
      // The response.text() should directly contain the JSON string
      // because we used responseFormat: "json"
      const jsonText = response.text();
      tripPlan = JSON.parse(jsonText);
    } catch (error) {
      console.error("❌ Failed to parse AI response:", error);
      console.error("Raw Text Received:", response.text()); // Log the text that failed parsing
      return res.status(500).json({
        error: "Invalid AI response format. Failed to parse JSON.",
        rawResponse: response.text(), // Optionally send raw response back for debugging
      });
    }

    // Optional: Add validation here to ensure the parsed tripPlan matches the expected structure

    res.status(200).json({ tripPlan }); // Send the parsed object directly
  } catch (error) {
    console.error("❌ Error generating trip:", error);
    // Log specific details about the error if possible
    if (error.response) {
      console.error("API Error Response:", error.response.data);
    }
    res.status(500).json({ error: "Failed to generate trip" });
  }
};
