require('dotenv').config({ path: '../../.env.development.local' })

const Configuration = require('openai').Configuration
const OpenAIApi = require('openai').OpenAIApi

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY
})

async function analyzeText(text) {
  console.log('Analyzing text...')
  const openai = new OpenAIApi(configuration)

  const conversation = [
    {
      role: 'system',
      content: `You are a helpful assistant that parses text and identifies references to movies, films, books (with the author), short stories (with the author), and articles. You should respond with nothing other than JSON. Organize the identified references into separate lists, each keyed by category in the response. Include the episode title and link in the response.

        Example format:
         {
            "movies": [
                  "John Wick",
                  "The lion king"
            },
            "books": [
                  {
                  'title':"The Hobbit",
                  'author':"J.R.R. Tolkien"
                  }
            },
            "shortStories": [
                  {
                  'title':"The Last Question",
                  'author':"Isaac Asimov"
                  }
            },
            "articles": [
                  {
                  'title':"The AI Revolution: The Road to Superintelligence - Tim Urban",
                  'link':"https://waitbutwhy.com/2015/01/artificial-intelligence-revolution-1.html"
                  }
            ]
         }
        `
    },
    { role: 'user', content: `Text: ${text}` }
  ]

  const result = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: conversation,
    max_tokens: 2000,
    temperature: 0.7
  })

  console.log('Text analyzed successfully!')
  return result.data['choices'][0]['message']['content']
}

module.exports = analyzeText
