"use strict";

// Import the Translator class to handle translation logic
const Translator = require("../components/translator.js");

// Export a function to define routes for the application
module.exports = function (app) {
  // Create an instance of the Translator class
  const translator = new Translator();

  // Define the /api/translate route with a POST request
  app.route("/api/translate").post((req, res) => {
    // Extract text and locale from the request body
    const { text, locale } = req.body;

    // Check if either the text or locale is missing
    if (text === undefined || locale === undefined) {
      return res.status(400).json({ error: "Required field(s) missing" });
    }

    // Check if the text is empty
    if (text === "") {
      return res.status(400).json({ error: "No text to translate" });
    }

    // Check if the locale value is valid
    if (locale !== "american-to-british" && locale !== "british-to-american") {
      return res.status(400).json({ error: "Invalid value for locale field" });
    }

    let translation = "";

    // Perform translation based on the locale value
    if (locale === "american-to-british") {
      // Translate from American to British English
      translation = translator.toBritishEnglish(text);
    } else if (locale === "british-to-american") {
      // Translate from British to American English
      translation = translator.toAmericanEnglish(text);
    }

    // If the translation is unchanged or the text is already correct
    if (translation === text || translation === "Everything looks good to me!") {
      return res.json({ text, translation: "Everything looks good to me!" });
    }

    // Return the original text and the translation
    return res.json({ text, translation });
  });
};
