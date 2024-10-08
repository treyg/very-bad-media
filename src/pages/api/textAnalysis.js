import { Configuration, OpenAIApi } from "openai";
import yaml from "js-yaml";
import dotenv from "dotenv";

dotenv.config({
  path: "../../../.env.development.local",
});

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});

async function analyzeText(text) {
  console.log("Analyzing text...");
  const openai = new OpenAIApi(configuration);
  const conversation = [
    {
      role: "system",
      content: `You are a helpful assistant that parses text and identifies references to movies/films, TV shows, books, short stories, articles, essays. If the author for a book isn't directly mentioned, but you know who it is, feel free to add it. You should respond with nothing other than YAML. Organize the identified references into separate lists, each keyed by category in the response. Include the episode title and link in the response. Follow this exact format for the response. If you aren't sure if something is an article or an essay, just put it in the articles list. Make sure you return only valid YAML. Only include categories that are explicitly mentioned in the following example format. Remember, each category should appear only once in the mapping. The links for movies should be to letterboxd.com. Article links are found in the text being analyzed. Tv show, books, and short story links are not necessary. It's very important you return only valid YAML without any markdown formatting.
      Example format:
      movies:
        - title: "John Wick"
          director: "Chad Stahelski"
          link: 'https://letterboxd.com/film/john-wick/'
      tvshows:
        - title: "The office"
          director: "Greg Daniels"
      books:
        - title: "The Hobbit"
          author: "J.R.R. Tolkien"
      shortstories:
        - title: "The Last Question"
          author: "Isaac Asimov"
      articles:
        - title: "The AI Revolution: The Road to Superintelligence - Tim Urban"
          link: "https://waitbutwhy.com/2015/01/artificial-intelligence-revolution-1.html"
        - title: "Another Article"
          link: "https://another.link"
      essays:
        - title: "This is Water"
          author: "David Foster Wallace"`,
    },
    { role: "user", content: `Text: ${text}` },
  ];

  try {
    const result = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: conversation,
      max_tokens: 3000,
      temperature: 0.3,
    });

    console.log("Text analysis complete!");

    let content = result.data.choices[0].message.content.trim();

    // Remove any markdown formatting
    if (content.startsWith("```yaml")) {
      content = content.replace(/^```yaml\n/, "").replace(/\n```$/, "");
    }

    const yamlData = yaml.load(content);
    const jsonData = JSON.stringify(yamlData);
    return jsonData;
  } catch (error) {
    if (error instanceof yaml.YAMLException) {
      console.error("Error parsing YAML:", error.message);
      console.error(
        "Problematic content:",
        error.mark ? error.mark.buffer : "N/A"
      );
    } else if (error.response) {
      console.error("OpenAI API error:", error.response.data);
    } else {
      console.error("Unexpected error:", error.message);
    }
    // Return an empty object instead of undefined
    return JSON.stringify({});
  }
}

export default analyzeText;
