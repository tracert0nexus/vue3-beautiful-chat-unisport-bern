// services/chatApi.js
import axios from 'axios'

const API_URL = 'http://localhost:82/index.php/api/ask'

export async function fetchSuggestions(id) {
    const { data } = await axios.post(API_URL, { id })
    return Array.isArray(data) ? data : [data]
}
