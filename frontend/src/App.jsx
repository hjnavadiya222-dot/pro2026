import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Login } from './components/auth/login'
import { Signup } from './components/auth/signup'
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

const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/homepage", element: <UserHome /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/askquestion", element: <AskQuestion /> },
  { path: "/solvedquestions", element: <SolvedQuestion /> },
  { path: "/unsolvedquestions", element: <UnSolvedQuestions /> },
  { path: "/allquestions", element: <AllQuestions /> },
  { path: "/profile", element: <Profile /> },
  { path: "/edit/profile", element: <EditProfile /> },
  { path: "/answer/:id", element: <Answer /> },

  // faculty routes
  { path: "/faculty/homepage", element: <FacultyHome /> },
  { path: "/faculty/allquestions", element: <FacultyAllQuestion /> },
  { path: "/faculty/unsolved/questions", element: <FacultyUnsolvedQuestion /> },
  { path: "/faculty/solved/questions", element: <FacultySolvedQuestion /> },

  // admin routes
  { path: "/admin/homepage", element: <AdminHome /> },
])

export function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <RouterProvider router={appRouter} />
    </>
  );
}
