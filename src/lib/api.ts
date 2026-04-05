const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8787'

function getToken(): string | null {
  return localStorage.getItem('lemma_token')
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(init.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers as Record<string, string> ?? {}),
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText })) as { error: string }
    throw new Error(err.error ?? res.statusText)
  }
  return res.json() as Promise<T>
}

export const api = {
  // Auth
  login: (name: string, pin: string) =>
    request<{ token: string; user: { id: string; name: string; role: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ name, pin }),
    }),

  // Assignments
  getAssignments: () => request<Assignment[]>('/api/assignments'),
  getAssignment: (id: string) => request<AssignmentDetail>(`/api/assignments/${id}`),
  createAssignment: (body: CreateAssignmentBody) =>
    request<Assignment>('/api/assignments', { method: 'POST', body: JSON.stringify(body) }),

  // Submissions
  submitAssignment: (formData: FormData) =>
    request<{ submissionId: string; status: string }>('/api/submissions', { method: 'POST', body: formData }),
  getSubmission: (id: string) => request<SubmissionDetail>(`/api/submissions/${id}`),

  // Problems
  getProblems: () => request<Problem[]>('/api/problems'),
  createProblem: (body: CreateProblemBody) =>
    request<Problem>('/api/problems', { method: 'POST', body: JSON.stringify(body) }),

  // Problem sets
  getProblemSets: () => request<ProblemSet[]>('/api/problem-sets'),
  createProblemSet: (body: { name: string; problemIds: string[] }) =>
    request<ProblemSet>('/api/problem-sets', { method: 'POST', body: JSON.stringify(body) }),

  // Students
  getStudents: () => request<Student[]>('/api/students'),
  getStudent: (id: string) => request<StudentDetail>(`/api/students/${id}`),
  createStudent: (body: { name: string; pin: string }) =>
    request<Student>('/api/students', { method: 'POST', body: JSON.stringify(body) }),
  deleteStudent: (id: string) =>
    request<{ ok: boolean }>(`/api/students/${id}`, { method: 'DELETE' }),

  // Dashboard
  getDashboard: () => request<DashboardData>('/api/dashboard'),

  // AI
  generateSimilar: (problemId: string) =>
    request<SimilarProblem>('/api/ai/generate', { method: 'POST', body: JSON.stringify({ problemId }) }),
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Assignment {
  id: string; title: string; due_date: string; student_ids: string[]
  problem_set_id: string; created_at: string; created_by: string
}

export interface AssignmentDetail extends Assignment {
  problem_set: ProblemSet; problems: Problem[]; my_submission: Submission | null
}

export interface Submission {
  id: string; assignment_id: string; student_id: string
  photo_urls: string[]; status: 'pending' | 'processing' | 'done' | 'error'
  total_score: number | null; submitted_at: string
}

export interface SubmissionResult {
  id: string; problem_id: string; is_correct: boolean
  student_answer: string | null; ai_feedback: string; z3_verified: boolean | null
  similar_problem_id: string | null
  problem: Pick<Problem, 'id' | 'title' | 'body' | 'concept_tags'>
  similar_problem: SimilarProblem | null
}

export interface SubmissionDetail extends Submission {
  results: SubmissionResult[]; signed_photo_urls: (string | null)[]
}

export interface Problem {
  id: string; title: string; body: string; answer: string
  solution: string | null; concept_tags: string[]
  z3_formula: string | null; created_at: string
}

export interface ProblemSet {
  id: string; name: string; problem_ids: string[]; created_at: string
}

export interface Student {
  id: string; name: string; created_at: string
}

export interface StudentDetail {
  student: Student
  scoreHistory: { date: string; title: string; score: number }[]
  conceptStats: { tag: string; correct: number; total: number; rate: number }[]
  submissions: Submission[]
}

export interface SimilarProblem {
  id: string; body: string; answer: string; concept_tags: string[]
  original_problem_id: string
}

export interface CreateAssignmentBody {
  problemSetId: string; studentIds: string[]; dueDate: string; title: string
}

export interface CreateProblemBody {
  title: string; problemBody: string; answer: string
  solution?: string; conceptTags?: string[]; z3Formula?: string
}

export interface DashboardData {
  totalStudents: number; submittedToday: number; avgScore: number; pendingCount: number
  recentAssignments: Assignment[]; submissions: Submission[]
  problemStats: Record<string, { correct: number; total: number }>
  conceptStats: Record<string, { correct: number; total: number }>
}
