import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getAuth, isTokenExpired } from './lib/auth'

import LoginPage from './pages/Login'
import StudentLayout from './pages/student/Layout'
import StudentHome from './pages/student/Home'
import StudentHistory from './pages/student/History'
import StudentWrong from './pages/student/Wrong'
import SubmitPage from './pages/student/assignments/Submit'
import FeedbackPage from './pages/student/assignments/Feedback'

import TeacherLayout from './pages/teacher/Layout'
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherAssignments from './pages/teacher/Assignments'
import NewAssignment from './pages/teacher/NewAssignment'
import TeacherProblems from './pages/teacher/Problems'
import NewProblem from './pages/teacher/NewProblem'
import TeacherStudents from './pages/teacher/Students'
import StudentDetail from './pages/teacher/StudentDetail'
import NewProblemSet from './pages/teacher/NewProblemSet'

function RequireAuth({ children, role }: { children: React.ReactNode; role?: 'admin' | 'student' }) {
  const auth = getAuth()
  if (!auth || isTokenExpired(auth.token)) return <Navigate to="/login" replace />
  if (role && auth.user.role !== role) {
    return <Navigate to={auth.user.role === 'admin' ? '/teacher' : '/student'} replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter basename="/lemma">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RootRedirect />} />

        <Route path="/student" element={<RequireAuth role="student"><StudentLayout /></RequireAuth>}>
          <Route index element={<StudentHome />} />
          <Route path="history" element={<StudentHistory />} />
          <Route path="wrong" element={<StudentWrong />} />
          <Route path="assignments/:id/submit" element={<SubmitPage />} />
          <Route path="assignments/:id/feedback" element={<FeedbackPage />} />
        </Route>

        <Route path="/teacher" element={<RequireAuth role="admin"><TeacherLayout /></RequireAuth>}>
          <Route index element={<TeacherDashboard />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="assignments/new" element={<NewAssignment />} />
          <Route path="problems" element={<TeacherProblems />} />
          <Route path="problems/new" element={<NewProblem />} />
          <Route path="problem-sets/new" element={<NewProblemSet />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="students/:id" element={<StudentDetail />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function RootRedirect() {
  const auth = getAuth()
  if (!auth || isTokenExpired(auth.token)) return <Navigate to="/login" replace />
  return <Navigate to={auth.user.role === 'admin' ? '/teacher' : '/student'} replace />
}
