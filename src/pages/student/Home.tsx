import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Assignment, type Submission } from '../../lib/api'
import { getAuth } from '../../lib/auth'

type AssignmentWithSub = Assignment & { my_submission: Submission | null }

function getStatusInfo(a: AssignmentWithSub) {
  const sub = a.my_submission
  const overdue = !sub && new Date() > new Date(a.due_date)
  if (!sub) return { label: overdue ? '기한 초과' : '미제출', color: overdue ? 'var(--lemma-red)' : 'var(--lemma-ink-3)', bg: overdue ? 'oklch(95% 0.06 25)' : 'var(--lemma-cream-2)', border: overdue ? 'var(--lemma-red)' : 'var(--lemma-cream-2)', action: '제출하기', href: `/student/assignments/${a.id}/submit` }
  if (sub.status === 'processing' || sub.status === 'pending') return { label: 'AI 채점 중', color: 'oklch(45% 0.12 75)', bg: 'oklch(93% 0.04 75)', border: 'var(--lemma-gold)', action: '결과 확인', href: `/student/assignments/${a.id}/feedback?submissionId=${sub.id}` }
  if (sub.status === 'done') return { label: '피드백 도착', color: 'oklch(38% 0.14 255)', bg: 'oklch(92% 0.05 255)', border: 'oklch(75% 0.12 255)', action: '결과 보기', href: `/student/assignments/${a.id}/feedback?submissionId=${sub.id}` }
  return { label: '오류', color: 'var(--lemma-red)', bg: 'oklch(95% 0.06 25)', border: 'var(--lemma-red)', action: '다시 제출', href: `/student/assignments/${a.id}/submit` }
}

export default function StudentHome() {
  const auth = getAuth()
  const [assignments, setAssignments] = useState<AssignmentWithSub[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAssignments().then(data => setAssignments(data as AssignmentWithSub[])).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><p style={{ color: 'var(--lemma-ink-3)' }}>불러오는 중...</p></div>

  const pending = assignments.filter(a => !a.my_submission).length
  const feedback = assignments.filter(a => a.my_submission?.status === 'done').length

  return (
    <div>
      <div className="grid-bg px-5 pt-6 pb-5 border-b" style={{ borderColor: 'var(--lemma-cream-2)' }}>
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--lemma-ink-3)' }}>안녕하세요 👋</p>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--lemma-ink)' }}>{auth?.user.name}</h1>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{ num: pending, label: '미제출', color: 'var(--lemma-red)' }, { num: feedback, label: '피드백 도착', color: 'oklch(45% 0.14 255)' }, { num: assignments.filter(a => a.my_submission?.status === 'done').length, label: '완료', color: 'var(--lemma-green)' }].map(({ num, label, color }) => (
            <div key={label} className="rounded-xl p-3 text-center border" style={{ background: 'white', borderColor: 'var(--lemma-cream-2)' }}>
              <p className="text-2xl font-bold" style={{ color }}>{num}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--lemma-ink-3)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--lemma-ink-3)' }}>숙제 목록</p>
        {assignments.length === 0 && <div className="text-center py-16" style={{ color: 'var(--lemma-ink-3)' }}><p className="text-4xl mb-3">📭</p><p className="text-sm">아직 출제된 숙제가 없어요</p></div>}
        {assignments.map(a => {
          const s = getStatusInfo(a)
          return (
            <div key={a.id} className="rounded-2xl p-4 border" style={{ background: 'white', borderColor: s.border, borderLeftWidth: '3px' }}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 mr-3">
                  <p className="font-bold text-sm" style={{ color: 'var(--lemma-ink)' }}>{a.title}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--lemma-ink-3)' }}>마감 {new Date(a.due_date).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric', weekday: 'short' })}{a.my_submission?.total_score != null && ` · ${a.my_submission.total_score}점`}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap" style={{ background: s.bg, color: s.color }}>● {s.label}</span>
              </div>
              <div className="flex justify-end">
                <Link to={s.href} className="text-xs font-semibold px-4 py-2 rounded-lg transition-all active:scale-95"
                  style={{ background: a.my_submission?.status === 'done' ? 'var(--lemma-gold)' : 'var(--lemma-ink)', color: a.my_submission?.status === 'done' ? 'var(--lemma-ink)' : 'var(--lemma-cream)' }}>
                  {s.action} →
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
