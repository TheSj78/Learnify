const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const fs = require("fs");
const os = require("os");
const path = require("path");

const app = express();
const PORT = 8080;

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server")

const genAI = new GoogleGenerativeAI(process.env.KEY);
const fileManager = new GoogleAIFileManager(process.env.KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const readFileModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fc_session = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                {
                    text: 'Generate 3 flashcards about basic Calculus formulas. Use the JSON format given below:\n{"id": 1, "question": "1+1?", "answer":2}\n{"id": 2, "question": "2+3", "answer":5}',
                },
            ],
        },
        {
            role: "model",
            parts: [
                {
                    text: '[\n  {\n    "id": 1,\n    "question": "What is the derivative of x^n?",\n    "answer": "nx^(n-1)"\n  },\n  {\n    "id": 2,\n    "question": "What is the integral of x^n?",\n    "answer": "(x^(n+1))/(n+1) + C (where C is the constant of integration)"\n  },\n  {\n    "id": 3,\n    "question": "What is the chain rule for differentiation?",\n    "answer": "The derivative of f(g(x)) is f\'(g(x)) * g\'(x)"\n  }\n]\n',
                },
            ],
        },
        {
            role: "user",
            parts: [
                {
                    text: 'Generate 5 flashcards about kinematics in AP Physics 1 curriculum. Be brief for your questions and answers. Use the JSON format given below:\n{"id": 1, "question": "1+1?", "answer":2}\n{"id": 2, "question": "2+3", "answer":5}',
                },
            ],
        },
        {
            role: "model",
            parts: [
                {
                    text: '\n[\n  {\n    "id": 1,\n    "question": "What is displacement?",\n    "answer": "Change in position"\n  },\n  {\n    "id": 2,\n    "question": "What is velocity?",\n    "answer": "Rate of change of displacement"\n  },\n  {\n    "id": 3,\n    "question": "What is acceleration?",\n    "answer": "Rate of change of velocity"\n  },\n  {\n    "id": 4,\n    "question": "What is the equation for constant acceleration?",\n    "answer": "v = u + at"\n  },\n  {\n    "id": 5,\n    "question": "What is the equation for displacement with constant acceleration?",\n    "answer": "s = ut + (1/2)at^2"\n  }\n]\n',
                },
            ],
        },
        {
            role: "user",
            parts: [
                {
                    text: 'Generate 5 flashcards about unit conversion in Physics curriculum. Be brief for your questions and answers. I have my own notes that you may base your flashcards off: "It is often necessary to convert from one unit to another. For example, if you are reading a European cookbook, some quantities may be expressed in units of liters and you need to convert them to cups. Or perhaps you are reading walking directions from one location to another and you are interested in how many miles you will be walking. In this case, you may need to convert units of feet or meters to miles.\n\nLet’s consider a simple example of how to convert units. Suppose we want to convert 80 m to kilometers. The first thing to do is to list the units you have and the units to which you want to convert. In this case, we have units in meters and we want to convert to kilometers. Next, we need to determine a conversion factor relating meters to kilometers. A conversion factor is a ratio that expresses how many of one unit are equal to another unit. For example, there are 12 in. in 1 ft, 1609 m in 1 mi, 100 cm in 1 m, 60 s in 1 min, and so on. Refer to Appendix B for a more complete list of conversion factors. In this case, we know that there are 1000 m in 1 km. Now we can set up our unit conversion. We write the units we have and then multiply them by the conversion factor so the units cancel out, as shown:\n\n80m×1km1000m=0.080km.\n \nNote that the unwanted meter unit cancels, leaving only the desired kilometer unit. You can use this method to convert between any type of unit. Now, the conversion of 80 m to kilometers is simply the use of a metric prefix, as we saw in the preceding section, so we can get the same answer just as easily by noting that\n\n80m=8.0×101m=8.0×10−2km=0.080km,\n \nsince “kilo-” means 103 (see Table 1.2) and  1=−2+3.\n  However, using conversion factors is handy when converting between units that are not metric or when converting between derived units, as the following examples illustrate.". Use the JSON format given below:\n{"id": 1, "question": "1+1?", "answer":2}\n{"id": 2, "question": "2+3", "answer":5}',
                },
            ],
        },
        {
            role: "model",
            parts: [
                {
                    text: '\n[\n  {\n    "id": 1,\n    "question": "What is a conversion factor?",\n    "answer": "A ratio that relates two different units of measurement."\n  },\n  {\n    "id": 2,\n    "question": "How do you use a conversion factor to convert units?",\n    "answer": "Multiply the original value by the conversion factor, ensuring the units you want to cancel out are in the denominator." \n  },\n  {\n    "id": 3,\n    "question": "What is the conversion factor between meters and kilometers?",\n    "answer": "1 km = 1000 m"\n  },\n  {\n    "id": 4,\n    "question": "How many seconds are in a minute?",\n    "answer": "60 seconds"\n  },\n  {\n    "id": 5,\n    "question": "How do you convert 10000 centimeters to kilometers?",\n    "answer": "10000 cm * (1 m / 100 cm) * (1 km / 1000 m) = 0.1 km"\n  }\n]\n',
                },
            ],
        },
    ],
});

const pt_session = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
        {
            role: "user",
            parts: [
                { text: "Generate 8 multiple choice questions on the topic Calculus BC. Use the JSON file format specified below:\n{\"id\": 1, \"question\":\"What is 1 + 1\", \"a\":\"2\", \"b\":\"4\", \"c\":\"3\", \"d\":\"6\", \"correct\":\"a\"}\n{\"id\": 2, \"question\":\"What is 8 + 6\", \"a\":\"10\", \"b\":\"12\", \"c\":\"14\", \"d\":\"16\", \"correct\":\"c\"}" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "\n[\n  {\n    \"id\": 1,\n    \"question\": \"What is the derivative of sin(x)?\",\n    \"a\": \"cos(x)\",\n    \"b\": \"-cos(x)\",\n    \"c\": \"sin(x)\",\n    \"d\": \"-sin(x)\",\n    \"correct\": \"a\"\n  },\n  {\n    \"id\": 2,\n    \"question\": \"What is the integral of x^2 dx?\",\n    \"a\": \"x^3/3 + C\",\n    \"b\": \"2x + C\",\n    \"c\": \"x^3 + C\",\n    \"d\": \"x/2 + C\",\n    \"correct\": \"a\"\n  },\n  {\n    \"id\": 3,\n    \"question\": \"What is the limit as x approaches 0 of sin(x)/x?\",\n    \"a\": \"1\",\n    \"b\": \"0\",\n    \"c\": \"∞\",\n    \"d\": \"Does not exist\",\n    \"correct\": \"a\"\n  },\n  {\n    \"id\": 4,\n    \"question\": \"What is the Taylor series expansion of e^x around x=0?\",\n    \"a\": \"1 + x + x^2/2! + x^3/3! + ...\",\n    \"b\": \"1 - x + x^2/2! - x^3/3! + ...\",\n    \"c\": \"x + x^2/2! + x^3/3! + ...\",\n    \"d\": \"1 + x^2/2! + x^4/4! + ...\",\n    \"correct\": \"a\"\n  },\n  {\n    \"id\": 5,\n    \"question\": \"What is the value of the definite integral from 0 to 1 of e^x dx?\",\n    \"a\": \"e - 1\",\n    \"b\": \"e\",\n    \"c\": \"1\",\n    \"d\": \"0\",\n    \"correct\": \"a\"\n  },\n  {\n    \"id\": 6,\n    \"question\": \"What is the area of the region bounded by the curves y = x^2 and y = x?\",\n    \"a\": \"1/6\",\n    \"b\": \"1/3\",\n    \"c\": \"1/2\",\n    \"d\": \"1\",\n    \"correct\": \"a\"\n  },\n  {\n    \"id\": 7,\n    \"question\": \"What is the volume of the solid generated by rotating the region bounded by the curves y = x^2 and y = 1 about the x-axis?\",\n    \"a\": \"π/2\",\n    \"b\": \"π\",\n    \"c\": \"2π\",\n    \"d\": \"4π/3\",\n    \"correct\": \"d\"\n  },\n  {\n    \"id\": 8,\n    \"question\": \"What is the arc length of the curve y = ln(x) from x = 1 to x = e?\",\n    \"a\": \"e - 1\",\n    \"b\": \"e\",\n    \"c\": \"√2(e - 1)\",\n    \"d\": \"√2(e + 1)\",\n    \"correct\": \"c\"\n  }\n]\n" },
            ],
        },
        {
            role: "user",
            parts: [
                { text: "Generate 3 multiple choice questions on the topic Environmental Science. Use the JSON file format specified below:\n{\"id\": 1, \"question\":\"What is 1 + 1\", \"a\":\"2\", \"b\":\"4\", \"c\":\"3\", \"d\":\"6\", \"correct\":\"a\"}\n{\"id\": 2, \"question\":\"What is 8 + 6\", \"a\":\"10\", \"b\":\"12\", \"c\":\"14\", \"d\":\"16\", \"correct\":\"c\"}" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "\n[\n  {\n    \"id\": 1,\n    \"question\": \"Which of the following is NOT a greenhouse gas?\",\n    \"a\": \"Carbon dioxide (CO2)\",\n    \"b\": \"Methane (CH4)\",\n    \"c\": \"Nitrogen (N2)\",\n    \"d\": \"Nitrous oxide (N2O)\",\n    \"correct\": \"c\"\n  },\n  {\n    \"id\": 2,\n    \"question\": \"What is the main cause of ocean acidification?\",\n    \"a\": \"Increased levels of dissolved oxygen\",\n    \"b\": \"Increased levels of dissolved carbon dioxide\",\n    \"c\": \"Increased levels of dissolved nitrogen\",\n    \"d\": \"Increased levels of dissolved phosphorus\",\n    \"correct\": \"b\"\n  },\n  {\n    \"id\": 3,\n    \"question\": \"Which of the following is a renewable energy source?\",\n    \"a\": \"Coal\",\n    \"b\": \"Natural gas\",\n    \"c\": \"Solar power\",\n    \"d\": \"Nuclear power\",\n    \"correct\": \"c\"\n  }\n]\n" },
            ],
        },
        {
            role: "user",
            parts: [
                { text: "Generate 5 multiple choice questions on the topic unit conversion in Physics curriculum. I also have my own notes that you may base your multiple choice questions off: \"It is often necessary to convert from one unit to another. For example, if you are reading a European cookbook, some quantities may be expressed in units of liters and you need to convert them to cups. Or perhaps you are reading walking directions from one location to another and you are interested in how many miles you will be walking. In this case, you may need to convert units of feet or meters to miles.\\n\\nLet’s consider a simple example of how to convert units. Suppose we want to convert 80 m to kilometers. The first thing to do is to list the units you have and the units to which you want to convert. In this case, we have units in meters and we want to convert to kilometers. Next, we need to determine a conversion factor relating meters to kilometers. A conversion factor is a ratio that expresses how many of one unit are equal to another unit. For example, there are 12 in. in 1 ft, 1609 m in 1 mi, 100 cm in 1 m, 60 s in 1 min, and so on. Refer to Appendix B for a more complete list of conversion factors. In this case, we know that there are 1000 m in 1 km. Now we can set up our unit conversion. We write the units we have and then multiply them by the conversion factor so the units cancel out, as shown:\\n\\n80m×1km1000m=0.080km.\\n \\nNote that the unwanted meter unit cancels, leaving only the desired kilometer unit. You can use this method to convert between any type of unit. Now, the conversion of 80 m to kilometers is simply the use of a metric prefix, as we saw in the preceding section, so we can get the same answer just as easily by noting that\\n\\n80m=8.0×101m=8.0×10−2km=0.080km,\\n \\nsince “kilo-” means 103 (see Table 1.2) and  1=−2+3.\\n  However, using conversion factors is handy when converting between units that are not metric or when converting between derived units, as the following examples illustrate.\" Use the JSON format specified below:\n{\"id\": 1, \"question\":\"What is 1 + 1\", \"a\":\"2\", \"b\":\"4\", \"c\":\"3\", \"d\":\"6\", \"correct\":\"a\"}\n{\"id\": 2, \"question\":\"What is 8 + 6\", \"a\":\"10\", \"b\":\"12\", \"c\":\"14\", \"d\":\"16\", \"correct\":\"c\"}" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "\n[\n  {\n    \"id\": 1,\n    \"question\": \"How many centimeters are there in 2.5 meters?\",\n    \"a\": \"25\",\n    \"b\": \"250\",\n    \"c\": \"2500\",\n    \"d\": \"25000\",\n    \"correct\": \"b\"\n  },\n  {\n    \"id\": 2,\n    \"question\": \"Convert 10 kilometers to meters.\",\n    \"a\": \"100 meters\",\n    \"b\": \"1000 meters\",\n    \"c\": \"10,000 meters\",\n    \"d\": \"100,000 meters\",\n    \"correct\": \"c\"\n  },\n  {\n    \"id\": 3,\n    \"question\": \"If a car travels 60 miles per hour, how many feet does it travel per second?\",\n    \"a\": \"88 feet/second\",\n    \"b\": \"176 feet/second\",\n    \"c\": \"264 feet/second\",\n    \"d\": \"352 feet/second\",\n    \"correct\": \"a\" \n  },\n  {\n    \"id\": 4,\n    \"question\": \"How many seconds are there in 3 hours?\",\n    \"a\": \"180 seconds\",\n    \"b\": \"360 seconds\",\n    \"c\": \"10,800 seconds\",\n    \"d\": \"18,000 seconds\",\n    \"correct\": \"c\"\n  },\n  {\n    \"id\": 5,\n    \"question\": \"A recipe calls for 2 cups of flour. If you only have a measuring cup that measures in milliliters, how many milliliters of flour do you need? (Assume 1 cup = 237 ml)\",\n    \"a\": \"118.5 ml\",\n    \"b\": \"237 ml\",\n    \"c\": \"474 ml\",\n    \"d\": \"948 ml\",\n    \"correct\": \"c\"\n  }\n]\n" },
            ],
        },
    ],
});

const sg_session = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
        {
            role: "user",
            parts: [
                { text: "Return a study guide, in a JSON file format on the topic AP Physics C: Mechanics. I have 4 days to study for this test, and would like you to create a healthy study plan where I can cover topics that I need to. It shouldn't be too in-depth, but I do want a general overview of what I need to know. Don't include any equations in your answers, just the topic should be fine. Also, no markdown in the JSON file.\n\nThe JSON file should look something like this:\n[\n{\"title\":\"<title>\", \"day\": \"1\", \"topics\":\"<topic>\", \"points\": \"<sub-bullet-points>\"},\n{\"title\":\"<title>\", \"day\": \"2\", \"topics\":<topic>\", \"points\":\"<sub-bullet-points>\"},\n...]\n\nIf there is an error or you cannot generate the file, return:\n[\n{\"title\":\"<title>\", \"day\":\"1\", \"topics\":\"Error\", \"points\":\"Please try again later.\"}\n]" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```json\n[\n  {\n    \"title\": \"Kinematics\",\n    \"day\": \"1\",\n    \"topics\": \"Motion in one and two dimensions\",\n    \"points\": \"- Displacement, velocity, and acceleration\\n- Uniform and non-uniform motion\\n- Projectile motion\\n- Relative motion\"\n  },\n  {\n    \"title\": \"Newton's Laws of Motion\",\n    \"day\": \"1\",\n    \"topics\": \"Forces and their effects on motion\",\n    \"points\": \"- Newton's First Law (Inertia)\\n- Newton's Second Law (F = ma)\\n- Newton's Third Law (Action-Reaction)\\n- Free-body diagrams\\n- Friction\"\n  },\n  {\n    \"title\": \"Work, Energy, and Power\",\n    \"day\": \"2\",\n    \"topics\": \"Concepts related to energy and its transformations\",\n    \"points\": \"- Work done by a force\\n- Kinetic and potential energy\\n- Conservation of mechanical energy\\n- Power\"\n  },\n  {\n    \"title\": \"Linear Momentum and Collisions\",\n    \"day\": \"2\",\n    \"topics\": \"Momentum and its conservation in collisions\",\n    \"points\": \"- Linear momentum\\n- Conservation of linear momentum\\n- Elastic and inelastic collisions\\n- Impulse\"\n  },\n  {\n    \"title\": \"Rotational Motion\",\n    \"day\": \"3\",\n    \"topics\": \"Motion of rigid bodies around a fixed axis\",\n    \"points\": \"- Angular displacement, velocity, and acceleration\\n- Torque\\n- Moment of inertia\\n- Rotational kinetic energy\\n- Conservation of angular momentum\"\n  },\n  {\n    \"title\": \"Simple Harmonic Motion\",\n    \"day\": \"3\",\n    \"topics\": \"Oscillatory motion with a restoring force\",\n    \"points\": \"- Characteristics of SHM\\n- Period, frequency, and amplitude\\n- Energy in SHM\\n- Damped and forced oscillations\"\n  },\n  {\n    \"title\": \"Gravitation\",\n    \"day\": \"4\",\n    \"topics\": \"Newton's Law of Universal Gravitation\",\n    \"points\": \"- Gravitational force\\n- Gravitational potential energy\\n- Kepler's Laws of Planetary Motion\"\n  },\n  {\n    \"title\": \"Fluid Mechanics\",\n    \"day\": \"4\",\n    \"topics\": \"Properties and behavior of fluids\",\n    \"points\": \"- Pressure\\n- Archimedes' Principle\\n- Buoyancy\\n- Fluid flow\\n- Viscosity\"\n  }\n]\n```" },
            ],
        },
        {
            role: "user",
            parts: [
                { text: "Return a study guide, in a JSON file format on the topic environmental science. I have 3 days to study for this test, and would like you to create a healthy study plan where I can cover topics that I need to. It shouldn't be too in-depth, but I do want a general overview of what I need to know. Don't include any equations in your answers, just the topic should be fine. Also, no markdown in the JSON file.\nThe JSON file should look something like this:\n[\n{\"title\":\"<title>\", \"day\": \"1\", \"topics\":\"<topic>\", \"points\": \"<sub-bullet-points>\"},\n{\"title\":\"<title>\", \"day\": \"2\", \"topics\":<topic>\", \"points\":\"<sub-bullet-points>\"},\n...]\nIf there is an error or you cannot generate the file, return:\n[\n{\"title\":\"<title>\", \"day\":\"1\", \"topics\":\"Error\", \"points\":\"Please try again later.\"}\n]" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```json\n[\n  {\n    \"title\": \"Earth Systems and Processes\",\n    \"day\": \"1\",\n    \"topics\": \"The interconnectedness of Earth's systems\",\n    \"points\": \"- Atmosphere\\n- Hydrosphere\\n- Geosphere\\n- Biosphere\\n- Interactions and feedback loops\"\n  },\n  {\n    \"title\": \"Ecosystems and Biodiversity\",\n    \"day\": \"1\",\n    \"topics\": \"Structure and function of ecosystems\",\n    \"points\": \"- Biotic and abiotic components\\n- Energy flow and trophic levels\\n- Biodiversity and its importance\\n- Ecosystem services\"\n  },\n  {\n    \"title\": \"Population Dynamics\",\n    \"day\": \"2\",\n    \"topics\": \"Factors influencing population growth and decline\",\n    \"points\": \"- Population growth models\\n- Carrying capacity\\n- Limiting factors\\n- Human population growth and its impacts\"\n  },\n  {\n    \"title\": \"Environmental Impacts of Human Activities\",\n    \"day\": \"2\",\n    \"topics\": \"The effects of human activities on the environment\",\n    \"points\": \"- Pollution (air, water, soil)\\n- Climate change\\n- Deforestation\\n- Habitat loss and fragmentation\\n- Overexploitation of resources\"\n  },\n  {\n    \"title\": \"Environmental Sustainability\",\n    \"day\": \"3\",\n    \"topics\": \"Principles and practices for sustainable living\",\n    \"points\": \"- Sustainable development goals\\n- Conservation and restoration\\n- Renewable energy sources\\n- Pollution control\\n- Environmental policy and legislation\"\n  },\n  {\n    \"title\": \"Environmental Issues and Solutions\",\n    \"day\": \"3\",\n    \"topics\": \"Addressing global environmental challenges\",\n    \"points\": \"- Climate change mitigation and adaptation\\n- Biodiversity conservation\\n- Waste management and recycling\\n- Sustainable agriculture and forestry\"\n  }\n]\n```" },
            ],
        },
        {
            role: "user",
            parts: [
                { text: "Return a study guide, in a JSON file format on the topic 8th grade algebra. I have 2 days to study for this test, and would like you to create a healthy study plan where I can cover topics that I need to. It shouldn't be too in-depth, but I do want a general overview of what I need to know. Don't include any equations in your answers, just the topic should be fine. Also, no markdown in the JSON file.\nThe JSON file should look something like this:\n[\n{\"title\":\"<title>\", \"day\": \"1\", \"topics\":\"<topic>\", \"points\": \"<sub-bullet-points>\"},\n{\"title\":\"<title>\", \"day\": \"2\", \"topics\":<topic>\", \"points\":\"<sub-bullet-points>\"},\n...]\nIf there is an error or you cannot generate the file, return:\n[\n{\"title\":\"<title>\", \"day\":\"1\", \"topics\":\"Error\", \"points\":\"Please try again later.\"}\n]" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```json\n[\n  {\n    \"title\": \"Expressions and Equations\",\n    \"day\": \"1\",\n    \"topics\": \"Understanding and manipulating algebraic expressions\",\n    \"points\": \"- Combining like terms\\n- Distributive property\\n- Solving one-step and multi-step equations\\n- Solving equations with variables on both sides\\n- Writing equations from word problems\"\n  },\n  {\n    \"title\": \"Inequalities\",\n    \"day\": \"1\",\n    \"topics\": \"Solving and graphing inequalities\",\n    \"points\": \"- Understanding inequality symbols\\n- Solving inequalities using inverse operations\\n- Graphing solutions on a number line\\n- Solving compound inequalities\"\n  },\n  {\n    \"title\": \"Linear Functions\",\n    \"day\": \"2\",\n    \"topics\": \"Identifying and interpreting linear functions\",\n    \"points\": \"- Slope-intercept form (y = mx + b)\\n- Finding slope and y-intercept\\n- Graphing linear equations\\n- Writing equations of lines given different information\"\n  },\n  {\n    \"title\": \"Systems of Equations\",\n    \"day\": \"2\",\n    \"topics\": \"Solving systems of equations\",\n    \"points\": \"- Graphing method\\n- Substitution method\\n- Elimination method\\n- Solving word problems using systems of equations\"\n  }\n]\n```" },
            ],
        },
    ],
});

app.post("/api/gemini/flashcards", upload.single("file"), async (req, res) => {
    console.log(req.body);
    console.log("Topic: ", req.body.topic);
    console.log("Number of flashcards: ", req.body.numFlashcards);
    console.log("Notes: ", req.body.notes || "None");
    console.log("Files: ", req.file || "None");
    const fileName = req.file ? req.file.originalname : "None";
    console.log("File name: ", fileName);

    const topic = req.body.topic;
    const numFlashcards = req.body.numFlashcards;
    var notes = req.body.notes || "None";
    const file = req.file || "None";

    var result = '';

    if (file === "None" && notes === "None") {
        result = await fc_session.sendMessage(
            `Generate ${numFlashcards} flashcards about ${topic}. Be brief for your questions and answers. Use the JSON format given below:\n{"id": 1, "question": "1+1?", "answer":2}\n{"id": 2, "question": "2+3", "answer":5}. Keep the formatting similar to your previous responses, and don't include any "triple tick marks" or markdown code in your responses. In case you can't generate the flashcards, return this JSON file: "[{"id": 1, "question": "We couldn't generate flashcards on your topic", "answer":"Re-enter the topic and try again."}]"`
        );

        console.log(result.response.text());
        res.send(result.response.text());
        return;
    }

    let summary = '';

    if (file) {
        try {
            const tempFilePath = path.join(os.tmpdir(), file.originalname);

            // Write the buffer to the temporary file
            fs.writeFileSync(tempFilePath, file.buffer);

            // Upload using the file path and capture the response metadata
            const uploadResult = await fileManager.uploadFile(tempFilePath, {
                mimeType: "application/pdf",
                displayName: "Uploaded File",
            });

            // Clean up: Remove the temporary file after use
            fs.unlinkSync(tempFilePath);

            console.log(`Uploaded file ${fileName} as: ${uploadResult.file.uri}`);

            // Generate summary content using the uploaded file's URI
            summary = await model.generateContent([
                {
                    fileData: {
                        mimeType: uploadResult.file.mimeType,
                        fileUri: uploadResult.file.uri,
                    }
                },
                { text: "Scan and provide some notes on the contents of this file. Provide a detailed summary, and highlight the unique points that this document makes. Do not use markdown in your response, and just return a string." },
            ]);

            console.log(summary.response.text());
        } catch (error) {
            console.error("Error during file upload and processing:", error);
            summary = "Error reading files. Try to make the flashcards without these notes, and if you can't, return a JSON file with an error flashcard."
        }
    }

    if (notes !== 'None') {
        if (file !== "None") {
            notes += `". Additional handwritten notes: "${summary.response.text()}`;
        }
    } else {
        notes = summary.response.text();
    }

    result = await fc_session.sendMessage(
        `Generate ${numFlashcards} flashcards about ${topic}. I have my own notes that you may base your flashcards off: "${notes}". Be brief for your questions and answers. Use the JSON format given below:\n{"id": 1, "question": "1+1?", "answer":2}\n{"id": 2, "question": "2+3", "answer":5}. Keep the formatting similar to your previous responses, and don't include any "triple tick marks" or markdown code in your responses. In case you can't generate the flashcards, return this JSON file: "[{"id": 1, "question": "We couldn't generate flashcards on your topic", "answer":"Re-enter the topic and try again."}]"`
    );

    console.log(result.response.text());
    res.send(result.response.text());
});

app.post("/api/gemini/practice-test", upload.single("file"), async (req, res) => {
    console.log("Topic: ", req.body.topic);
    console.log("Number of Questions: ", req.body.numQuestions);
    console.log("Notes: ", req.body.notes || "None");
    console.log("Files: ", req.file || "None");
    const fileName = req.file ? req.file.originalname : "None";
    console.log("File name: ", fileName);

    const topic = req.body.topic;
    const numQuestions = req.body.numQuestions;
    var notes = req.body.notes || "None";
    const file = req.file || "None";

    var result = '';

    if (file === "None" && notes === "None") {
        result = await pt_session.sendMessage(
            `Generate ${numQuestions} multiple choice questions on the topic ${topic}. Use the JSON file format specified below:\n{"id": 1, "question":"What is 1 + 1", "a":"2", "b":"4", "c":"3", "d":"6", "correct":"a"}\n{"id": 2, "question":"What is 8 + 6", "a":"10", "b":"12", "c":"14", "d":"16", "correct":"c"}. Keep the formatting similar to your previous responses. Make sure your JSON file is of the correct format (it should be an array and each individual key/value should be enclosed in quotations). In case you can't generate the questions, return this JSON file:\n[{"id": 1, "question": "We couldn't generate questions on your topic", "a":"Re-enter the topic and try again.", "b":"", "c":"", "d":"", "correct":""}]. Do not include markdown in your answer, and return a JSON array object, not a string.`
        );

        console.log(result.response.text());
        res.send(result.response.text());
        return;
    }

    let summary = '';

    if (file) {
        try {
            const tempFilePath = path.join(os.tmpdir(), file.originalname);

            // Write the buffer to the temporary file
            fs.writeFileSync(tempFilePath, file.buffer);

            // Upload using the file path and capture the response metadata
            const uploadResult = await fileManager.uploadFile(tempFilePath, {
                mimeType: "application/pdf",
                displayName: "Uploaded File",
            });

            // Clean up: Remove the temporary file after use
            fs.unlinkSync(tempFilePath);

            console.log(`Uploaded file ${fileName} as: ${uploadResult.file.uri}`);

            // Generate summary content using the uploaded file's URI
            summary = await model.generateContent([
                {
                    fileData: {
                        mimeType: uploadResult.file.mimeType,
                        fileUri: uploadResult.file.uri,
                    }
                },
                { text: "Scan and provide some notes on the contents of this file. Provide a detailed summary, and highlight the unique points that this document makes. Do not use markdown in your response, and just return a string." },
            ]);

            console.log(summary.response.text());
        } catch (error) {
            console.error("Error during file upload and processing:", error);
            summary = "Error reading files. Try to make the questions without these notes, and if you can't, return a JSON file with an error question."
        }
    }

    if (notes !== 'None') {
        if (file !== "None") {
            notes += `". Additional handwritten notes: "${summary.response.text()}`;
        }
    } else {
        notes = summary.response.text();
    }

    result = await pt_session.sendMessage(
        `Generate ${numQuestions} multiple choice questions on the topic ${topic}. I have my own notes that you may base your questions off: "${notes}". Use the JSON file format specified below:\n{"id": 1, "question":"What is 1 + 1", "a":"2", "b":"4", "c":"3", "d":"6", "correct":"a"}\n{"id": 2, "question":"What is 8 + 6", "a":"10", "b":"12", "c":"14", "d":"16", "correct":"c"}. Keep the formatting similar to your previous responses. Make sure your JSON file is of the correct format (it should be an array and each individual key/value should be enclosed in quotations). In case you can't generate the questions, return this JSON file:\n[{"id": 1, "question": "We couldn't generate questions on your topic", "a":"Re-enter the topic and try again.", "b":"", "c":"", "d":"", "correct":""}]. Do not include markdown in your answer, and return a JSON array object, not a string.`
    );

    console.log(result.response.text());
    res.send(result.response.text());
});

app.post("/api/gemini/study-guide", upload.single("file"), async (req, res) => {
    console.log("Topic: ", req.body.topic);
    console.log("Number of Days: ", req.body.numDays);
    console.log("Notes: ", req.body.notes || "None");
    console.log("Files: ", req.file || "None");
    const fileName = req.file ? req.file.originalname : "None";
    console.log("File name: ", fileName);

    const topic = req.body.topic;
    const numDays = req.body.numDays;
    var notes = req.body.notes || "None";
    const file = req.file || "None";

    var result = '';

    if (file === "None" && notes === "None") {
        result = await sg_session.sendMessage(
            `Return a study guide, in a JSON file format on the topic ${topic}. I have ${numDays} days to study for this test, and would like you to create a healthy study plan where I can cover topics that I need to. It shouldn't be too in-depth, but I do want a general overview of what I need to know. Don't include any equations in your answers, just the topic should be fine. Also, no markdown in the JSON file.\nThe JSON file should look something like this:\n[\n{\"title\":\"<title>\", \"day\": \"1\", \"topics\":\"<topic>\", \"points\": \"<sub-bullet-points>\"},\n{\"title\":\"<title>\", \"day\": \"2\", \"topics\":<topic>\", \"points\":\"<sub-bullet-points>\"},\n...]\n. For your points, use hyphens as bullet points if possible. Do not use double quotations inside the JSON string, I don't want it to be malformed. If there is an error or you cannot generate the file, return:\n[\n{\"title\":\"<title>\", \"day\":\"1\", \"topics\":\"Error\", \"points\":\"Please try again later.\"}. No markdown in your result.\n]`
        );

        console.log(result.response.text());
        noMarkdown = result.response.text();
        noMarkdown = noMarkdown.replace("```json", '');
        noMarkdown = noMarkdown.replace("```", '');
        res.send(noMarkdown);
        return;
    }

    let summary = '';

    if (file !== "None") {
        try {
            console.log(os.tmpdir());
            console.log(file.originalname);
            const tempFilePath = path.join(os.tmpdir(), file.originalname);

            // Write the buffer to the temporary file
            fs.writeFileSync(tempFilePath, file.buffer);

            // Upload using the file path and capture the response metadata
            const uploadResult = await fileManager.uploadFile(tempFilePath, {
                mimeType: "application/pdf",
                displayName: "Uploaded File",
            });

            // Clean up: Remove the temporary file after use
            fs.unlinkSync(tempFilePath);

            console.log(`Uploaded file ${fileName} as: ${uploadResult.file.uri}`);

            // Generate summary content using the uploaded file's URI
            summary = await model.generateContent([
                {
                    fileData: {
                        mimeType: uploadResult.file.mimeType,
                        fileUri: uploadResult.file.uri,
                    }
                },
                { text: "Scan and provide some notes on the contents of this file. Provide a detailed summary, and highlight the unique points that this document makes. Do not use markdown in your response, and just return a string." },
            ]);

            console.log(summary.response.text());
        } catch (error) {
            console.error("Error during file upload and processing:", error);
            summary = "Error reading files. Try to make the questions without these notes, and if you can't, return a JSON file with an error question."
        }
    }

    if (notes !== 'None') {
        if (file !== "None") {
            notes += `". Additional handwritten notes: "${summary.response.text()}`;
        }
    } else {
        notes = summary.response.text();
    }

    result = await sg_session.sendMessage(
         `Return a study guide, in a JSON file format on the topic ${topic}. I have ${numDays} days to study for this test, and would like you to create a healthy study plan where I can cover topics that I need to. In addition to your knowledge on the topic, feel free to use my notes as well: "${notes}". The study guide shouldn't be too in-depth, but I do want a general overview of what I need to know. Don't include any equations in your answers, just the topic should be fine. Also, no markdown in the JSON file.\nThe JSON file should look something like this:\n[\n{\"title\":\"<title>\", \"day\": \"1\", \"topics\":\"<topic>\", \"points\": \"<sub-bullet-points>\"},\n{\"title\":\"<title>\", \"day\": \"2\", \"topics\":<topic>\", \"points\":\"<sub-bullet-points>\"},\n...]\n. For your points, use hyphens as bullet points if possible. Do not use double quotations inside the JSON string, I don't want it to be malformed. If there is an error or you cannot generate the file, return:\n[\n{\"title\":\"<title>\", \"day\":\"1\", \"topics\":\"Error\", \"points\":\"Please try again later.\"}\n]`
    );

    console.log(result.response.text());
    res.send(result.response.text());
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
