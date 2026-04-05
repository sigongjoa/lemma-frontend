import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'

const CONCEPT_PRESETS = ['이차방정식', '인수분해', '근의 공식', '판별식', '완전제곱식', '일차함수', '확률', '좌표평면', '수열', '미적분']

export default function NewProblemPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', problemBody: '', answer: '', solution: '', conceptTags: [] as string[], z3Formula: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleTag = (tag: string) => setForm(f => ({ ...f, conceptTags: f.conceptTags.includes(tag) ? f.conceptTags.filter(t => t !== tag) : [...f.conceptTags, tag] }))

  const handleSubmit = async () => {
    if (!form.title || !form.problemBody || !form.answer) { setError('제목, 문제, 정답은 필수입니다'); return }
    setLoading(true); setError('')
    try { await api.createProblem(form); navigate('/teacher/problems') }
    catch (e) { setError(e instanceof Error ? e.message : '등록 실패') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div className="px-7 py-5 border-b flex items-center gap-4" style={{ borderColor: 'var(--lemma-cream-2)' }}>
        <button onClick={() => navigate(-1)} className="text-sm px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--lemma-cream-2)', color: 'var(--lemma-ink-2)' }}>← 뒤로</button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--lemma-ink)' }}>문제 등록</h1>
      </div>
      <div className="p-7 max-w-2xl space-y-5">
        {([['title', '제목 *', 'ex) 이차방정식 근의 공식 #1', false], ['problemBody', '문제 본문 *', '2x² + 3x - 2 = 0의 근을 구하시오', true], ['answer', '정답 *', 'x = 1/2 또는 x = -2', false], ['solution', '풀이 설명', '근의 공식 x = (-b ± √(b²-4ac)) / 2a 를 적용...', true], ['z3Formula', 'Z3 수식 (선택)', '2*x**2 + 3*x - 2 == 0', false]] as const).map(([key, label, placeholder, textarea]) => (
          <div key={key}>
            <label className="block text-xs font-bold mb-2" style={{ color: 'var(--lemma-ink-2)' }}>{label}</label>
            {textarea ? (
              <textarea value={form[key as 'title']} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} rows={3} className="w-full px-4 py-3 rounded-xl border text-sm resize-none outline-none" style={{ borderColor: 'var(--lemma-cream-2)', background: 'white', color: 'var(--lemma-ink)' }} />
            ) : (
              <input value={form[key as 'title']} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: 'var(--lemma-cream-2)', background: 'white', color: 'var(--lemma-ink)' }} />
            )}
          </div>
        ))}

        <div>
          <label className="block text-xs font-bold mb-2" style={{ color: 'var(--lemma-ink-2)' }}>개념 태그</label>
          <div className="flex flex-wrap gap-2">
            {CONCEPT_PRESETS.map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)}
                className="text-xs px-3 py-1.5 rounded-full border transition-all"
                style={{ background: form.conceptTags.includes(tag) ? 'var(--lemma-ink)' : 'white', color: form.conceptTags.includes(tag) ? 'var(--lemma-cream)' : 'var(--lemma-ink-2)', borderColor: form.conceptTags.includes(tag) ? 'var(--lemma-ink)' : 'var(--lemma-cream-2)' }}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-center" style={{ color: 'var(--lemma-red)' }}>{error}</p>}
        <button onClick={handleSubmit} disabled={loading} className="w-full py-4 rounded-xl text-base font-semibold disabled:opacity-50" style={{ background: 'var(--lemma-ink)', color: 'var(--lemma-cream)' }}>
          {loading ? '등록 중...' : '문제 등록하기'}
        </button>
      </div>
    </div>
  )
}
