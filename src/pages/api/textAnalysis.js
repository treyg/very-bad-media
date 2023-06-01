import { Configuration, OpenAIApi } from 'openai'
import yaml from 'js-yaml'

import dotenv from 'dotenv'
dotenv.config({
  path: '../../../.env.development.local'
})

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY
})

async function analyzeText(text) {
  console.log('Analyzing text...')
  const openai = new OpenAIApi(configuration)

  const conversation = [
    {
      role: 'system',
      content: `You are a helpful assistant that parses text and identifies references to movies/films, TV shows, books, short stories, articles, essays. You should respond with nothing other than YAML. Organize the identified references into separate lists, each keyed by category in the response. Include the episode title and link in the response. Follow this exact format for the response. Don't include anything else. If you aren't sure if something is an article or an essay, just put it in the articles list. Make sure you return only valid YAML. Don't include any other text in the response and only include categories that are explicitly mentioned in the following example.
 
       Example format:
       movies:
         - "John Wick"
         - "The Lion King"
       tvshows:
         - "The Office"
         - "The Simpsons"
       books:
         - title: "The Hobbit"
           author: "J.R.R. Tolkien"
       shortStories:
         - title: "The Last Question"
           author: "Isaac Asimov"
       articles:
         - title: "The AI Revolution: The Road to Superintelligence - Tim Urban"
           link: "https://waitbutwhy.com/2015/01/artificial-intelligence-revolution-1.html"
       essays:
         - title: "This is Water"
           author: "David Foster Wallace"
     `
    },
    { role: 'user', content: `Text: ${text}` }
  ]

  const result = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: conversation,
    max_tokens: 2500,
    temperature: 0.2
  })

  console.log('Text analyzed successfully!')
  const yamlData = yaml.load(result.data.choices[0].message.content)
  const jsonData = JSON.stringify(yamlData)
  return jsonData
}

export default analyzeText
