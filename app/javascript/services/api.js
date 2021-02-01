import axios from 'axios'

const api = axios.create({
    baseURL: 'https://secure-castle-56600.herokuapp.com/'
    //baseURL: 'http://localhost:3000'
})

export default api;