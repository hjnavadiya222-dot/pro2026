import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

export default API;

// ── User / Auth ──────────────────────────────────────────────────
export const loginUser = (data: { email: string; password: string }) =>
  API.post("/user/login", data);

export const logoutUser = () => API.get("/user/logout");

export const registerStudent = (data: {
  fullname: string;
  email: string;
  password: string;
  department: string;
  semester: number;
  phoneNumber: string;
}) => API.post("/user/signup", data);

export const registerFaculty = (data: {
  fullname: string;
  email: string;
  password: string;
  designation: string;
  department: string;
}) => API.post("/user/register-faculty", data);

export const updateProfile = (id: string, formData: FormData) =>
  API.post(`/user/profile/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ── Faculty Directory ────────────────────────────────────────────
export const getAllFaculty = () => API.get("/user/faculty/all");

export const getFacultyBySubject = (subject: string) =>
  API.get(`/user/faculty?subject=${encodeURIComponent(subject)}`);

// ── Subjects ─────────────────────────────────────────────────────
export const getSubjects = (semester?: number) =>
  API.get(`/user/subjects${semester ? `?semester=${semester}` : ""}`);

// ── Questions ─────────────────────────────────────────────────────
export const askQuestion = (formData: FormData) =>
  API.post("/question/ask", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const answerQuestion = (questionId: string, formData: FormData) =>
  API.post(`/question/answer/${questionId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getStudentQuestions = (userId: string) =>
  API.get(`/question/student/${userId}`);

export const getFacultyQuestions = (facultyId: string) =>
  API.get(`/question/faculty/${facultyId}`);

export const getQuestionById = (id: string) => API.get(`/question/${id}`);
