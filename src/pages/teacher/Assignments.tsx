import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Assignment } from '../../lib/api'

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getAssignments().then(setAssignments).finally(() => setLoading(false)) }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><p style={{ color: 'var(--lemma-ink-3)' }}>불러오는 중...</p></div>

  return (
    <div>
      <div className="px-7 py-5 border-b flex justify-between items-center" style={{ borderColor: 'var(--lemma-cream-2)' }}>
        <h1 className="text-xl font-bold" style={{ color: 'var(--lemma-ink)' }}>숙제 관리</h1>
        <Link to="/teacher/assignments/new" className="text-sm font-semibold px-4 py-2 rounded-xl" style={{ background: 'var(--lemma-gold)', color: 'var(--lemma-ink)' }}>+ 숙제 출제</Link>
      </div>
      <div className="p-7">
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: 'var(--lemma-cream-2)' }}>
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid var(--lemma-cream-2)' }}>
              {['숙제명', '마감일', '학생 수'].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--lemma-ink-3)' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id} className="hover:bg-stone-50" style={{ borderBottom: '1px solid oklch(95% 0.005 90)' }}>
                  <td className="px-5 py-3 text-sm font-semibold" style={{ color: 'var(--lemma-ink)' }}>{a.title}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--lemma-ink-2)' }}>{new Date(a.due_date).toLocaleDateString('ko-KR')}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--lemma-ink-2)' }}>{a.student_ids.length}명</td>
                </tr>
              ))}
              {assignments.length === 0 && <tr><td colSpan={3} className="px-5 py-10 text-center text-sm" style={{ color: 'var(--lemma-ink-3)' }}>아직 출제된 숙제가 없어요</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
