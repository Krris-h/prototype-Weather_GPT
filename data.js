/**
 * WeatherGPT — Mock Data Layer
 * -----------------------------------------------------------------------
 * Everything in this file is placeholder data for the SIH26068 prototype.
 * In production, each block below would be replaced by a call into the
 * Weather Data Layer (IMD / satellite / radar / station APIs) described
 * in the architecture section. Look for "// REAL API HERE" comments.
 */

const WGPT_DATA = {

  // -----------------------------------------------------------------
  // Current conditions + forecast for the default demo location
  // REAL API HERE: IMD current-observations + short-range forecast API
  // -----------------------------------------------------------------
  current: {
    city: "Ahmedabad, Gujarat",
    temp: 31,
    feelsLike: 34,
    condition: "Partly Cloudy",
    humidity: 78,
    wind: 14,
    rainChance: 72,
    visibility: 6,
    uv: 7,
    pressure: 1006,
    updated: "2 min ago",
  },

  hourly: [
    { t: "Now", temp: 31, icon: "cloud-sun", rain: 20 },
    { t: "1PM", temp: 32, icon: "cloud-sun", rain: 25 },
    { t: "2PM", temp: 32, icon: "cloud", rain: 35 },
    { t: "3PM", temp: 31, icon: "cloud-rain", rain: 55 },
    { t: "4PM", temp: 30, icon: "cloud-rain", rain: 68 },
    { t: "5PM", temp: 29, icon: "cloud-rain", rain: 72 },
    { t: "6PM", temp: 28, icon: "cloud-drizzle", rain: 60 },
    { t: "7PM", temp: 27, icon: "cloud", rain: 40 },
  ],

  daily: [
    { d: "Today", hi: 32, lo: 25, icon: "cloud-rain", rain: 72 },
    { d: "Thu", hi: 31, lo: 24, icon: "cloud-sun", rain: 40 },
    { d: "Fri", hi: 33, lo: 25, icon: "sun", rain: 10 },
    { d: "Sat", hi: 30, lo: 24, icon: "cloud-rain", rain: 65 },
    { d: "Sun", hi: 29, lo: 23, icon: "cloud-drizzle", rain: 55 },
    { d: "Mon", hi: 31, lo: 24, icon: "cloud-sun", rain: 20 },
    { d: "Tue", hi: 32, lo: 25, icon: "sun", rain: 8 },
  ],

  // -----------------------------------------------------------------
  // AI Chat — canned question/response pairs for the demo
  // REAL API HERE: Retrieval-based weather answering pipeline
  // (validated weather facts -> rule engine -> LLM phrasing)
  // -----------------------------------------------------------------
  chatSamples: [
    {
      id: "commute",
      q: "Will it rain when I go to college tomorrow?",
      steps: ["Retrieving weather data", "Validating sources", "Applying your schedule", "Generating advisory"],
      a: "Rain is expected around your usual commute time near 9:00 AM. Carrying an umbrella would be a good idea.",
      cards: [
        { label: "Rain probability", value: "72%" },
        { label: "Expected time", value: "8:45 – 9:15 AM" },
        { label: "Your schedule", value: "College commute" },
        { label: "Location", value: "Ahmedabad" },
      ],
    },
    {
      id: "irrigate",
      q: "Should I irrigate my field tomorrow?",
      steps: ["Retrieving weather data", "Validating sources", "Checking agromet rules", "Generating advisory"],
      a: "Rain is expected tomorrow morning. You may consider postponing irrigation to avoid unnecessary water use.",
      note: "Weather-based advisory — not a replacement for professional agricultural guidance.",
      cards: [
        { label: "Rain probability", value: "65%" },
        { label: "Expected window", value: "6 – 10 AM" },
        { label: "Field location", value: "Mehsana" },
        { label: "Advisory type", value: "Irrigation timing" },
      ],
    },
    {
      id: "roadtrip",
      q: "Is Ahmedabad to Udaipur travel safe?",
      steps: ["Retrieving route weather", "Validating sources", "Scanning route segments", "Generating advisory"],
      a: "Rain is expected at multiple points along your route. Check the highlighted risk zones before travelling.",
      cards: [
        { label: "Route risk", value: "Moderate" },
        { label: "Risk segment", value: "Shamlaji" },
        { label: "Distance", value: "262 km" },
        { label: "Best window", value: "Before 11 AM" },
      ],
    },
    {
      id: "umbrella",
      q: "Do I need an umbrella today?",
      steps: ["Retrieving weather data", "Validating sources", "Checking your location", "Generating advisory"],
      a: "Yes — rain probability crosses 70% this afternoon in your area. Keep an umbrella handy after 3 PM.",
      cards: [
        { label: "Rain probability", value: "72%" },
        { label: "Peak window", value: "3 – 6 PM" },
        { label: "Location", value: "Ahmedabad" },
        { label: "Confidence", value: "High" },
      ],
    },
    {
      id: "severe",
      q: "Is there any severe weather risk?",
      steps: ["Checking official alerts", "Validating source", "Matching your location", "Generating advisory"],
      a: "A heavy rain warning is active for Ahmedabad East between 4 PM and 8 PM. Avoid unnecessary travel during this window.",
      cards: [
        { label: "Alert level", value: "Warning" },
        { label: "Area", value: "Ahmedabad East" },
        { label: "Time", value: "4 – 8 PM" },
        { label: "Source", value: "Official weather alert" },
      ],
    },
  ],

  // -----------------------------------------------------------------
  // Personalization — same forecast, different persona, different advice
  // -----------------------------------------------------------------
  personas: [
    { id: "student", label: "Student", icon: "graduation-cap",
      advice: "Rain is expected during your college commute. Carry an umbrella and leave a few minutes early." },
    { id: "farmer", label: "Farmer", icon: "sprout",
      advice: "Rain is expected this morning. Consider postponing irrigation and delaying spraying operations." },
    { id: "traveller", label: "Traveller", icon: "map",
      advice: "Rain is expected along parts of your route. Check risk zones before you set off." },
    { id: "professional", label: "Professional", icon: "briefcase",
      advice: "Allow extra travel time for your morning commute — roads near your office may be slower today." },
    { id: "public", label: "General Public", icon: "users",
      advice: "Carry rain protection and avoid low-lying, waterlogged areas this evening." },
  ],

  // -----------------------------------------------------------------
  // Farmer Mode
  // REAL API HERE: IMD Agromet advisory + district-level forecast
  // -----------------------------------------------------------------
  farmer: {
    location: "Mehsana, Gujarat",
    rain: "65% — tomorrow morning",
    temp: "30°C / 24°C",
    humidity: "71%",
    wind: "11 km/h",
    advisory: "Rain expected tomorrow morning.",
    recommendation: "Consider delaying irrigation.",
    cards: [
      { title: "Irrigation Advice", value: "Delay by 1 day", icon: "droplets" },
      { title: "Sowing Window", value: "Favourable, Fri–Sun", icon: "sprout" },
      { title: "Harvesting Risk", value: "Low this week", icon: "wheat" },
      { title: "Rainfall Outlook", value: "Moderate, 3 days", icon: "cloud-rain" },
    ],
  },

  // -----------------------------------------------------------------
  // Travel Weather Planner — route waypoints
  // REAL API HERE: Route weather overlay using geocoded waypoints
  // -----------------------------------------------------------------
  route: {
    from: "Ahmedabad",
    to: "Udaipur",
    risk: "Moderate",
    recommendation: "Carry suitable rain protection and plan your journey accordingly.",
    stops: [
      { name: "Ahmedabad", condition: "Clear", x: 60, y: 300, severity: "low" },
      { name: "Himmatnagar", condition: "Cloudy", x: 230, y: 210, severity: "low" },
      { name: "Shamlaji", condition: "Heavy Rain", x: 400, y: 150, severity: "high" },
      { name: "Udaipur", condition: "Light Rain", x: 560, y: 70, severity: "medium" },
    ],
  },

  // -----------------------------------------------------------------
  // Disaster Alert Center
  // REAL API HERE: Official alert feed (IMD / NDMA) — WeatherGPT only
  // rephrases verified alerts, never originates them.
  // -----------------------------------------------------------------
  alerts: [
    { type: "Heavy Rain", severity: "Warning", area: "Ahmedabad East", time: "4 PM – 8 PM",
      action: "Heavy rainfall is expected. Avoid unnecessary travel and waterlogged areas where possible." },
    { type: "Lightning", severity: "Watch", area: "Gandhinagar District", time: "5 PM – 9 PM",
      action: "Isolated lightning strikes possible. Avoid open fields and tall isolated trees." },
    { type: "Heatwave", severity: "Advisory", area: "Kutch Region", time: "Next 3 days",
      action: "Daytime temperatures may stay high. Stay hydrated and limit outdoor exposure at midday." },
    { type: "Flood Risk", severity: "Watch", area: "Sabarmati Riverbank Areas", time: "Next 24 hrs",
      action: "Rising water levels possible after upstream rain. Low-lying residents should stay alert." },
    { type: "Cyclone", severity: "Advisory", area: "Coastal Saurashtra", time: "Monitoring", 
      action: "A low-pressure system is being monitored. No immediate action needed — updates will follow." },
  ],

  // -----------------------------------------------------------------
  // Hyperlocal map markers (simulated, relative to a city viewbox)
  // -----------------------------------------------------------------
  mapMarkers: [
    { x: 150, y: 120, type: "clear", label: "Navrangpura" },
    { x: 260, y: 90, type: "cloudy", label: "Bopal" },
    { x: 340, y: 180, type: "rain", label: "Maninagar" },
    { x: 200, y: 220, type: "thunder", label: "Vastrapur" },
    { x: 420, y: 130, type: "clear", label: "Gota" },
    { x: 300, y: 260, type: "rain", label: "Isanpur" },
  ],

  // -----------------------------------------------------------------
  // Schedule-aware timeline
  // -----------------------------------------------------------------
  schedule: [
    { time: "7:00 AM", label: "Morning", weather: "Clear", icon: "sun" },
    { time: "9:00 AM", label: "College", weather: "Rain", icon: "cloud-rain", alert: true },
    { time: "1:00 PM", label: "Lunch", weather: "Cloudy", icon: "cloud" },
    { time: "5:00 PM", label: "Return Home", weather: "Light Rain", icon: "cloud-drizzle" },
    { time: "7:00 PM", label: "Outdoor Activity", weather: "Clear", icon: "moon" },
  ],

  notifications: [
    "Rain expected during your commute.",
    "Heat index will be high around your outdoor activity time.",
    "Weather conditions may affect your travel route.",
    "Heavy rain warning issued for your area.",
  ],

  // -----------------------------------------------------------------
  // Multilingual / voice demo
  // REAL API HERE: Speech-to-text -> NLP intent -> weather layer -> TTS
  // -----------------------------------------------------------------
  voice: {
    en: { q: "Will it rain in Ahmedabad tomorrow?", a: "Yes, rain is likely tomorrow morning. If you're heading out around 9 AM, it's best to carry an umbrella." },
    hi: { q: "क्या कल अहमदाबाद में बारिश होगी?", a: "हाँ, कल सुबह बारिश की संभावना है। अगर आप 9 बजे बाहर निकल रहे हैं, तो छाता साथ रखना बेहतर रहेगा।" },
    hinglish: { q: "Kal Ahmedabad mein baarish hogi?", a: "Haan, kal subah baarish ke chances hain. Agar aap 9 baje bahar nikal rahe hain to umbrella carry karna better rahega." },
    gu: { q: "શું કાલે અમદાવાદમાં વરસાદ પડશે?", a: "હા, કાલે સવારે વરસાદની શક્યતા છે. જો તમે 9 વાગ્યે બહાર જાવ છો, તો છત્રી સાથે રાખવી સારું રહેશે." },
  },

  // -----------------------------------------------------------------
  // Weather data sources
  // -----------------------------------------------------------------
  sources: [
    { name: "IMD", desc: "Weather observations, forecasts and warnings" },
    { name: "NDMA", desc: "Disaster management guidance" },
    { name: "ISRO / Bhuvan / NRSC", desc: "Satellite and geospatial information" },
    { name: "IMD Climate Data", desc: "Historical weather records" },
    { name: "IMD Agromet", desc: "Weather-linked agricultural advisory resources" },
  ],

  challenges: [
    { title: "Weather Data Latency", solution: "Caching, timestamps, multiple data sources and fallback mechanisms keep answers current even if one source lags." },
    { title: "Hyperlocal Accuracy", solution: "Forecast, station, radar and satellite data are combined, and uncertainty is clearly communicated rather than hidden." },
    { title: "AI Hallucination", solution: "Weather facts are validated and retrieved before the LLM ever generates a sentence — the model explains, it doesn't invent." },
    { title: "Personalized Notifications", solution: "User profile, location, schedule, weather and a rule engine combine to decide what's worth alerting on." },
    { title: "Multilingual Voice", solution: "Language detection, speech-to-text, multilingual AI and a text fallback keep the assistant usable in more than one language." },
    { title: "Low Connectivity", solution: "Lightweight critical-alert delivery is prioritised so severe warnings can still get through on weak networks." },
  ],

  impact: [
    { title: "General Public", desc: "Simple weather advice and personalized alerts, in plain language." },
    { title: "Students & Professionals", desc: "Commute warnings and schedule-aware weather, tied to when you actually leave the house." },
    { title: "Farmers", desc: "Irrigation planning and sowing/harvesting guidance based on validated forecasts." },
    { title: "Travellers", desc: "Complete route weather analysis before a journey, not just a single city forecast." },
    { title: "Disaster-Prone Communities", desc: "Actionable severe-weather alerts, sourced from official warnings." },
  ],

  architecture: [
    { id: "user", label: "User", detail: "Opens WeatherGPT via web, chat or voice with a location, question or schedule." },
    { id: "interface", label: "Web Interface", detail: "Collects user profile, location and schedule context for the request." },
    { id: "datalayer", label: "Weather Data Layer", detail: "IMD, weather APIs, radar, satellite and weather stations — the only source of weather facts." },
    { id: "validation", label: "Data Validation & Processing", detail: "Cross-checks and timestamps incoming data before anything reaches the AI." },
    { id: "engines", label: "Forecast / Alert / Route Engines", detail: "Deterministic logic turns validated data into forecasts, alerts and route risk." },
    { id: "ai", label: "AI / NLP + Rule Engine", detail: "Understands the question and phrases the already-validated facts as a clear answer." },
    { id: "output", label: "Personalized Recommendation", detail: "Delivered as chat, voice or a proactive notification, tailored to the user's context." },
  ],
};
