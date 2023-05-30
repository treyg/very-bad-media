import fetch from 'node-fetch'

async function storeDataInKV(key, data) {
  try {
    const response = await fetch(`${process.env.KV_REST_API_URL}/set/${key}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const result = await response.json()
    console.dir(result, { depth: null })
  } catch (error) {
    console.error(`Error storing data in KV: ${error}`)
    throw new Error('Error storing data in KV')
  }
}

export default storeDataInKV
