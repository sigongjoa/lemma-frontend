import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type DashboardData } from '../../lib/api'

export default function TeacherDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDashboard().then(setData).finally(() => setLoading(false))
  }, [])

  if (loading || !data) return <div className="flex items-center justify-center h-64"><p style={{ color: 'var(--lemma-ink-3)' }}>불러오는 중...</p></div>

  const today = new Date()
  const dueTodayCount = data.recentAssignments.filter(a => new Date(a.due_date).toDateString() === today.toDateString()).length

  return (
    <div>
      <div className="px-7 py-5 border-b flex justify-between items-center" style={{ borderColor: 'var(--lemma-cream-2)' }}>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--lemma-ink)' }}>대시보드</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--lemma-ink-3)' }}>{today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })} · 학생 {data.totalStudents}명</p>
        </div>
        <Link to="/teacher/assignments/new" className="text-sm font-semibold px-4 py-2 rounded-xl" style={{ background: 'var(--lemma-gold)', color: 'var(--lemma-ink)' }}>+ 숙제 출제</Link>
      </div>

      <div className="p-7 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '오늘 제출', value: data.submittedToday, unit: '건', color: 'var(--lemma-ink)' },
            { label: '오늘 마감', value: dueTodayCount, unit: '개', color: 'var(--lemma-gold-d)' },
            { label: '최근 평균 점수', value: data.avgScore, unit: '점', color: 'var(--lemma-green)' },
          ].map(({ label, value, unit, color }) => (
            <div key={label} className="rounded-2xl p-5 border text-center" style={{ background: 'white', borderColor: 'var(--lemma-cream-2)' }}>
              <p className="text-4xl font-bold" style={{ color }}>{value}<span className="text-xl ml-1" style={{ color: 'var(--lemma-ink-3)' }}>{unit}</span></p>
              <p className="text-xs mt-2" style={{ color: 'var(--lemma-ink-3)' }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: 'var(--lemma-cream-2)' }}>
          <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--lemma-cream-2)' }}>
            <h2 className="text-sm font-bold" style={{ color: 'var(--lemma-ink)' }}>최근 숙제</h2>
            <Link to="/teacher/assignments" className="text-xs" style={{ color: 'var(--lemma-ink-3)' }}>전체 보기 →</Link>
          </div>
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid var(--lemma-cream-2)' }}>
              {['숙제명', '마감일', '대상', '제출 현황'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--lemma-ink-3)' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {data.recentAssignments.map(a => {
                const submitted = data.submissions.filter(s => s.assignment_id === a.id).length
                const total = a.student_ids.length
                return (
                  <tr key={a.id} className="hover:bg-stone-50" style={{ borderBottom: '1px solid oklch(95% 0.005 90)' }}>
                    <td className="px-5 py-3 text-sm font-semibold" style={{ color: 'var(--lemma-ink)' }}>{a.title}</td>
                    <td className="px-5 py-3 text-sm" style={{ color: 'var(--lemma-ink-2)' }}>{new Date(a.due_date).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}</td>
                    <td className="px-5 py-3 text-sm" style={{ color: 'var(--lemma-ink-2)' }}>{total}명</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--lemma-cream-2)', maxWidth: '80px' }}>
                          <div className="h-full rounded-full" style={{ width: `${total > 0 ? (submitted / total) * 100 : 0}%`, background: 'var(--lemma-gold)' }} />
                        </div>
                        <span className="text-xs" style={{ color: 'var(--lemma-ink-3)' }}>{submitted}/{total}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {data.recentAssignments.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-sm" style={{ color: 'var(--lemma-ink-3)' }}>아직 출제된 숙제가 없어요</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
