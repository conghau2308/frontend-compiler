import axios, { AxiosError } from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://measured-dassie-fast.ngrok-free.app/files",
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",  // ← thêm dòng này
    },
    timeout: 10_000,
});

// Global error interceptor — 1 chỗ xử lý tất cả lỗi
api.interceptors.response.use(
    (res) => res,
    (err: AxiosError) => {
        const msg =
            (err.response?.data as string) ||
            err.message ||
            `HTTP ${err.response?.status}`;
        return Promise.reject(new Error(msg));
    }
);

export const listFiles = () => api.get<string[]>("/").then(r => r.data);
export const readFile = (filename: string) => api.get<string>(`/${filename}`).then(r => r.data);
export const createFile = (filename: string) => api.post<string>("/create", { filename }).then(r => r.data);
export const editFile = (filename: string, content: string) => api.post<boolean>(`/edit/${filename}`, { content }).then(r => r.data);
export const deleteFile = (filename: string) => api.delete<boolean>(`/${filename}`).then(r => r.data);
export const buildFile = (filename: string) => api.post<string>(`/build/${filename}`).then(r => r.data);
export const runFile = () => api.get<string>("/run").then(r => r.data);