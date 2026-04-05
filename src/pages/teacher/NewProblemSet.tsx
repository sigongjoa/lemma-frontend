import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, type Problem } from '../../lib/api'

export default function NewProblemSetPage() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState<Problem[]>([])
  const [name, setName] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { api.getProblems().then(setProblems) }, [])

  const toggle = (id: string) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const handleSubmit = async () => {
    if (!name.trim() || selectedIds.length === 0) { setError('이름과 문제를 1개 이상 선택해주세요'); return }
    setLoading(true); setError('')
    try { await api.createProblemSet({ name: name.trim(), problemIds: selectedIds }); navigate('/teacher') }
    catch (e) { setError(e instanceof Error ? e.message : '생성 실패') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="px-7 py-5 border-b flex items-center gap-4" style={{ borderColor: 'var(--lemma-cream-2)' }}>
        <button onClick={() => navigate(-1)} className="text-sm px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--lemma-cream-2)', color: 'var(--lemma-ink-2)' }}>← 뒤로</button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--lemma-ink)' }}>문제 세트 만들기</h1>
      </div>
      <div className="p-7 max-w-2xl space-y-6">
        <div>
          <label className="block text-xs font-bold mb-2" style={{ color: 'var(--lemma-ink-2)' }}>세트 이름 *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="ex) 이차방정식 종합" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--lemma-cream-2)', background: 'white', color: 'var(--lemma-ink)' }} />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2" style={{ color: 'var(--lemma-ink-2)' }}>문제 선택 * ({selectedIds.length}개)</label>
          <div className="space-y-2">
            {problems.map(p => (
              <button key={p.id} onClick={() => toggle(p.id)}
                className="w-full text-left px-4 py-3 rounded-xl border transition-all"
                style={{ background: selectedIds.includes(p.id) ? 'var(--lemma-ink)' : 'white', borderColor: selectedIds.includes(p.id) ? 'var(--lemma-ink)' : 'var(--lemma-cream-2)', color: selectedIds.includes(p.id) ? 'var(--lemma-cream)' : 'var(--lemma-ink)' }}>
                <p className="text-sm font-semibold">{p.title}</p>
                <p className="text-xs mt-0.5 opacity-70 line-clamp-1">{p.body}</p>
              </button>
            ))}
            {problems.length === 0 && <p className="text-sm text-center py-4" style={{ color: 'var(--lemma-ink-3)' }}>먼저 문제를 등록해주세요</p>}
          </div>
        </div>
        {error && <p className="text-sm text-center" style={{ color: 'var(--lemma-red)' }}>{error}</p>}
        <button onClick={handleSubmit} disabled={loading} className="w-full py-4 rounded-xl text-base font-semibold disabled:opacity-50" style={{ background: 'var(--lemma-ink)', color: 'var(--lemma-cream)' }}>
          {loading ? '생성 중...' : '문제 세트 만들기'}
        </button>
      </div>
    </div>
  )
}
