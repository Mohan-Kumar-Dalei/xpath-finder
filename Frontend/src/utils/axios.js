import axios from 'axios';

// 1. Environment ke hisaab se URL decide karo
const baseURL = import.meta.env.DEV
    ? "http://localhost:3000"            
    : "https://xpath-finder.onrender.com";

// 2. Axios ka ek custom instance (global setup) banao
const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
        // Agar future mein token bhejna ho toh yahan add kar sakte hain
    }
});

// Optional: Response Interceptor (Agar koi error aaye toh global handle karne ke liye)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Global API Error:", error);
        return Promise.reject(error);
    }
);

export default axiosInstance;