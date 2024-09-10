"use strict";

const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");
const { additionalAmericanToBritish, additionalBritishToAmerican } = require("./additional-words.js");

// Helper function to reverse dictionary keys and values
const reverseDict = (obj) => {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
};

class Translator {
  toBritishEnglish(text) {
    // Combine dictionaries for translation
    const dict = { ...americanOnly, ...americanToBritishSpelling, ...additionalAmericanToBritish };
    const titles = americanToBritishTitles;
    const timeRegex = /([1-9]|1[012]):[0-5][0-9]/g; // Time format for British
    return this.translate(text, dict, titles, timeRegex, "toBritish");
  }

  toAmericanEnglish(text) {
    // Combine dictionaries for translation
    const dict = { ...britishOnly, ...reverseDict(americanToBritishSpelling), ...additionalBritishToAmerican };
    const titles = reverseDict(americanToBritishTitles);
    const timeRegex = /([1-9]|1[012])\.[0-5][0-9]/g; // Time format for American
    return this.translate(text, dict, titles, timeRegex, "toAmerican");
  }

  translate(text, dict, titles, timeRegex, locale) {
    let translation = text;
    let highlighted = text;

    // Handle titles first
    Object.entries(titles).forEach(([k, v]) => {
      const titleRegex = new RegExp(`\\b${k}\\b\\.?`, 'gi'); // Match titles with optional period
      if (titleRegex.test(text)) {
        translation = translation.replace(titleRegex, (match) => {
          // Preserve the original capitalization
          return match.charAt(0).toUpperCase() + v.slice(1);
        });
        highlighted = highlighted.replace(titleRegex, (match) => {
          const replacement = match.charAt(0).toUpperCase() + v.slice(1);
          return `<span class="highlight">${replacement}</span>`;
        });
      }
    });

    // Handle multi-word phrases
    Object.entries(dict).filter(([k]) => k.includes(' ')).forEach(([k, v]) => {
      const phraseRegex = new RegExp(`\\b${k}\\b`, 'gi');
      if (phraseRegex.test(text)) {
        translation = translation.replace(phraseRegex, v);
        highlighted = highlighted.replace(phraseRegex, match => `<span class="highlight">${v}</span>`);
      }
    });

    // Handle single words
    Object.entries(dict).filter(([k]) => !k.includes(' ')).forEach(([k, v]) => {
      const wordRegex = new RegExp(`\\b${k}\\b`, 'gi');
      if (wordRegex.test(text)) {
        translation = translation.replace(wordRegex, v);
        highlighted = highlighted.replace(wordRegex, match => `<span class="highlight">${v}</span>`);
      }
    });

    // Handle time
    const times = text.match(timeRegex);
    if (times) {
      times.forEach(time => {
        const formattedTime = locale === 'toBritish' ? time.replace(':', '.') : time.replace('.', ':');
        translation = translation.replace(time, formattedTime);
        highlighted = highlighted.replace(time, `<span class="highlight">${formattedTime}</span>`);
      });
    }

    // Check if translation is unchanged
    return highlighted !== text ? highlighted : "Everything looks good to me!";
}

}

module.exports = Translator;
