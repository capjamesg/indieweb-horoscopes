const express = require("express");
const ejs = require("ejs");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const PORT = process.env.PORT || 3010;

const app = express();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const PROMPT = `
You are tasked with generating horoscopes for bloggers and open web enthusiasts.

Horoscopes should be 1-3 sentences long and written in the first person. Reference the star sign in the horoscope.

Horoscopes should include one of the following topics:

- Writing
- Blogging
- Making cool projects on the internet
- The web
- The IndieWeb community
- Personal websites

Horoscopes should be whimsical, creative, and unique. Be specific, but not too specific.

Don't always recommend starting something new; sometimes recommend continuing something that is already in progress.

Horoscopes should not be about popularity; they should be focused on the joy of writing and making things on the internet.

Horoscopes should be positive and optimistic.
`;

app.set("view engine", "ejs");
app.use(express.static("public"));
// allow json
app.use(express.json());

app.get("/", async (req, res) => {
    res.render("index");
});

app.post("/", async (req, res) => {
    var star_sign = req.body.starSign;

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: PROMPT},
            {role: "user", content: `I am a ${star_sign}. Provide a horoscope.`}
        ],
    });

    // return json
    res.json({"response": completion.data.choices[0].message});
});

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});