import { useEffect, useState } from 'react'
import { api, type SubmissionResult } from '../../lib/api'

export default function WrongNotesPage() {
  const [results, setResults] = useState<SubmissionResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all assignments, then fetch each submission's results
    async function load() {
      const assignments = await api.getAssignments() as unknown as Array<{ id: string; my_submission: { id: string; status: string } | null }>
      const doneSubmissionIds = assignments
        .filter(a => a.my_submission?.status === 'done')
        .map(a => a.my_submission!.id)

      const allResults: SubmissionResult[] = []
      for (const id of doneSubmissionIds) {
        const sub = await api.getSubmission(id)
        allResults.push(...sub.results.filter(r => !r.is_correct))
      }
      setResults(allResults)
    }
    load().finally(() => setLoading(false))
  }, [])

  const byTag: Record<string, SubmissionResult[]> = {}
  for (const r of results) {
    const tags = r.problem?.concept_tags ?? ['기타']
    for (const tag of tags) {
      if (!byTag[tag]) byTag[tag] = []
      byTag[tag].push(r)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><p style={{ color: 'var(--lemma-ink-3)' }}>불러오는 중...</p></div>

  return (
    <div>
      <div className="grid-bg px-5 pt-6 pb-5 border-b" style={{ borderColor: 'var(--lemma-cream-2)' }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--lemma-ink)' }}>오답 노트</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--lemma-ink-3)' }}>총 {results.length}개 오답</p>
      </div>
      <div className="px-5 py-4 space-y-6">
        {Object.entries(byTag).map(([tag, rs]) => (
          <div key={tag}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'var(--lemma-ink)', color: 'var(--lemma-cream)' }}>{tag}</span>
              <span className="text-xs" style={{ color: 'var(--lemma-ink-3)' }}>{rs.length}개</span>
            </div>
            <div className="space-y-3">
              {rs.map(r => (
                <div key={r.id} className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: 'var(--lemma-cream-2)' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--lemma-cream-2)', background: 'oklch(98% 0.005 90)' }}>
                    <p className="text-sm font-bold" style={{ color: 'var(--lemma-ink)' }}>{r.problem.title}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--lemma-ink-3)' }}>{r.problem.body}</p>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    <div className="flex gap-2 text-xs"><span className="font-bold" style={{ color: 'var(--lemma-red)' }}>내 답:</span><span style={{ color: 'var(--lemma-ink-2)' }}>{r.student_answer ?? '—'}</span></div>
                    {r.ai_feedback && <p className="text-xs leading-relaxed" style={{ color: 'var(--lemma-ink-2)', borderLeft: '2px solid var(--lemma-gold)', paddingLeft: '8px' }}>{r.ai_feedback}</p>}
                    {r.similar_problem && (
                      <div className="mt-2 p-3 rounded-xl" style={{ background: 'oklch(97% 0.012 255)', border: '1px solid oklch(88% 0.05 255)' }}>
                        <p className="text-xs font-bold mb-1" style={{ color: 'oklch(38% 0.14 255)' }}>✦ 유사 연습문제</p>
                        <p className="text-xs" style={{ color: 'var(--lemma-ink)' }}>{r.similar_problem.body}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {results.length === 0 && <div className="text-center py-16" style={{ color: 'var(--lemma-ink-3)' }}><p className="text-4xl mb-3">🎉</p><p className="text-sm">오답이 없어요!</p></div>}
      </div>
    </div>
  )
}
