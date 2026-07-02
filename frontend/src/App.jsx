import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Login } from './components/auth/Login'
import { Signup } from './components/auth/Signup'
import { RouterProvider } from 'react-router'
import Home from './components/pages/Home'
import { SolvedQuestion } from './components/pages/SolvedQuestion'
import { UnSolvedQuestions } from './components/pages/UnSolvedQuestions'
import { AllQuestions } from './components/pages/AllQustions'
import { Footer } from "./components/pages/Footer"
import { Toaster } from 'sonner'
import Profile from './components/profilePages/Profile'
import EditProfile from './components/profilePages/EditProfile'
import { UserHome } from './components/pages/UserHome'
import AskQuestion from './components/pages/AskQuestion'
import Answer from './components/facultyPages/Answer'
import FacultyAllQuestion from './components/facultyPages/FacultyAllQuestion'
import FacultyUnsolvedQuestion from './components/facultyPages/FacultyUnsolvedQuestion'
import FacultySolvedQuestion from './components/facultyPages/FacultySolvedQuestion'
import { FacultyHome } from './components/pages/FacultyHome'
import AdminHome from './components/Admin/adminhome'
import FacultyDirectory from './components/pages/FacultyDirectory'
import FacultyLogin from './components/auth/FacultyLogin'
import FacultySignup from './components/auth/FacultySignup'
import ProtectedRoute from './components/auth/ProtectedRoute'

const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/faculty/login", element: <FacultyLogin /> },
  { path: "/faculty/signup", element: <FacultySignup /> },
  
  // public/shared directory
  { path: "/faculty", element: <FacultyDirectory /> },

  // student routes
  { path: "/homepage", element: <ProtectedRoute allowedRoles={["Student"]}><UserHome /></ProtectedRoute> },
  { path: "/askquestion", element: <ProtectedRoute allowedRoles={["Student"]}><AskQuestion /></ProtectedRoute> },
  { path: "/solvedquestions", element: <ProtectedRoute allowedRoles={["Student"]}><SolvedQuestion /></ProtectedRoute> },
  { path: "/unsolvedquestions", element: <ProtectedRoute allowedRoles={["Student"]}><UnSolvedQuestions /></ProtectedRoute> },
  { path: "/allquestions", element: <ProtectedRoute allowedRoles={["Student"]}><AllQuestions /></ProtectedRoute> },
  { path: "/profile", element: <ProtectedRoute allowedRoles={["Student", "Faculty"]}><Profile /></ProtectedRoute> },
  { path: "/edit/profile", element: <ProtectedRoute allowedRoles={["Student", "Faculty"]}><EditProfile /></ProtectedRoute> },

  // faculty routes
  { path: "/faculty/homepage", element: <ProtectedRoute allowedRoles={["Faculty"]}><FacultyHome /></ProtectedRoute> },
  { path: "/faculty/allquestions", element: <ProtectedRoute allowedRoles={["Faculty"]}><FacultyAllQuestion /></ProtectedRoute> },
  { path: "/faculty/unsolved/questions", element: <ProtectedRoute allowedRoles={["Faculty"]}><FacultyUnsolvedQuestion /></ProtectedRoute> },
  { path: "/faculty/solved/questions", element: <ProtectedRoute allowedRoles={["Faculty"]}><FacultySolvedQuestion /></ProtectedRoute> },
  { path: "/answer/:id", element: <ProtectedRoute allowedRoles={["Faculty"]}><Answer /></ProtectedRoute> },

  // admin routes
  { path: "/admin/homepage", element: <ProtectedRoute allowedRoles={["Admin"]}><AdminHome /></ProtectedRoute> },
])

export function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <RouterProvider router={appRouter} />
    </>
  );
}
