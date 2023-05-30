import fetch from 'node-fetch'

export async function logAllData() {
  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env

  try {
    // Fetch all keys from the KV store
    const keysResponse = await fetch(`${KV_REST_API_URL}/keys/*`, {
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`
      }
    })

    console.log(
      `Response status: ${keysResponse.status}, status text: ${keysResponse.statusText}`
    )

    const keysData = await keysResponse.json()
    const keys = keysData.result

    console.log(`Response: ${JSON.stringify(keys)}`)

    // Fetch the value of each key
    for (const key of keys) {
      const valueResponse = await fetch(`${KV_REST_API_URL}/get/${key}`, {
        headers: {
          Authorization: `Bearer ${KV_REST_API_TOKEN}`
        }
      })
      const value = await valueResponse.json()

      console.log(value)
    }
  } catch (error) {
    console.error(`Error fetching data from KV: ${error}`)
  }
}
