require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing in the .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json", // Explicitly requesting JSON format
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

    console.log("✅ Gemini API request started...");
    console.log("Request data:", req.body);

    const prompt = `
      Generate a travel plan in valid JSON format:
      - Start Location: ${startLocation}
      - Destination: ${destination}
      - Travel Dates: ${startDate} to ${endDate}
      - Number of Travelers: ${persons}
      - Budget Type: ${budgetType}
      
      **JSON Format Required:**
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
          "day1": {
            "date": "YYYY-MM-DD",
            "activities": [
              {
                "time": "8:00 AM",
                "description": "Depart from ${startLocation}."
              }
            ]
          }
        },
        "hotelOptions": [
          {
            "name": "Hotel Example",
            "rating": 4.5,
            "price": 2500,
            "imageURL": "https://example.com/hotel.jpg",
            "coordinates": {
              "latitude": 12.3456,
              "longitude": 78.9012
            },
            "description": "A comfortable and budget-friendly hotel."
          }
        ],
        "mapUIData": {
          "start": {
            "latitude": 13.0827,
            "longitude": 80.2707,
            "label": "Chennai"
          },
          "end": {
            "latitude": 12.9716,
            "longitude": 77.5946,
            "label": "Bengaluru"
          },
          "waypoints": [
            {
              "latitude": 12.9716,
              "longitude": 79.1361,
              "label": "Vellore Fuel Stop"
            },
            {
              "latitude": 12.5267,
              "longitude": 78.2389,
              "label": "Krishnagiri Fuel Stop"
            }
          ],
          "routeCoordinates": [
            [
              13.0827,
              80.2707
            ],
            [
              12.9716,
              79.1361
            ],
            [
              12.5267,
              78.2389
            ],
            [
              12.9716,
              77.5946
            ]
          ]
        }
      }
    `;
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    console.log("✅ API Response received.");

    // Extract and parse response
    let tripPlan;
    try {
      const responseText = response.response.text();
      // Remove triple backticks if present
      const cleanedResponseText =
        responseText.startsWith("```json") && responseText.endsWith("```")
          ? responseText.slice(7, -3) // Remove the first 7 characters and the last 3 characters
          : responseText;

      // Check if the response is already valid JSON
      if (typeof cleanedResponseText === "object") {
        tripPlan = cleanedResponseText;
      } else {
        // Attempt to parse the response as JSON
        tripPlan = JSON.parse(cleanedResponseText);
      }
    } catch (error) {
      console.error(
        "❌ Failed to parse AI response:",
        error,
        "Raw response text:",
        response.response.text()
      );
      return res.status(500).json({
        error:
          "Invalid AI response format.  Please check the raw response from the AI.",
        rawResponse: response.response.text(),
      });
    }

    res.status(200).json({ tripPlan });
  } catch (error) {
    console.error("❌ Error generating trip:", error);
    res
      .status(500)
      .json({ error: "Failed to generate trip", detailedError: error.message });
  }
};
