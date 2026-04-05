import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Problem } from '../../lib/api'

export default function TeacherProblems() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getProblems().then(setProblems).finally(() => setLoading(false)) }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><p style={{ color: 'var(--lemma-ink-3)' }}>불러오는 중...</p></div>

  return (
    <div>
      <div className="px-7 py-5 border-b flex justify-between items-center" style={{ borderColor: 'var(--lemma-cream-2)' }}>
        <h1 className="text-xl font-bold" style={{ color: 'var(--lemma-ink)' }}>문제 관리</h1>
        <Link to="/teacher/problems/new" className="text-sm font-semibold px-4 py-2 rounded-xl" style={{ background: 'var(--lemma-gold)', color: 'var(--lemma-ink)' }}>+ 문제 등록</Link>
      </div>
      <div className="p-7 space-y-3">
        {problems.map(p => (
          <div key={p.id} className="rounded-2xl p-4 border" style={{ background: 'white', borderColor: 'var(--lemma-cream-2)' }}>
            <p className="font-bold text-sm" style={{ color: 'var(--lemma-ink)' }}>{p.title}</p>
            <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--lemma-ink-3)' }}>{p.body}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {p.concept_tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--lemma-cream-2)', color: 'var(--lemma-ink-2)' }}>{t}</span>)}
            </div>
          </div>
        ))}
        {problems.length === 0 && <div className="text-center py-16" style={{ color: 'var(--lemma-ink-3)' }}><p className="text-4xl mb-3">📝</p><p className="text-sm">등록된 문제가 없어요</p></div>}
      </div>
    </div>
  )
}
