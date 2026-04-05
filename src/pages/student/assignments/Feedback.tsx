import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api, type SubmissionDetail } from '../../../lib/api'

export default function FeedbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const submissionId = searchParams.get('submissionId')
  const [data, setData] = useState<SubmissionDetail | null>(null)
  const [polling, setPolling] = useState(true)

  const fetchSubmission = useCallback(async () => {
    if (!submissionId) return
    try {
      const json = await api.getSubmission(submissionId)
      setData(json)
      if (json.status === 'done' || json.status === 'error') setPolling(false)
    } catch { /* ignore */ }
  }, [submissionId])

  useEffect(() => { fetchSubmission() }, [fetchSubmission])

  useEffect(() => {
    if (!polling) return
    const interval = setInterval(fetchSubmission, 2000)
    const timeout = setTimeout(() => setPolling(false), 60000)
    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [polling, fetchSubmission])

  const totalProblems = data?.results?.length ?? 0
  const correct = data?.results?.filter(r => r.is_correct).length ?? 0
  const pct = totalProblems > 0 ? Math.round((correct / totalProblems) * 100) : 0

  if (!data || data.status === 'pending' || data.status === 'processing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-8" style={{ background: 'var(--lemma-cream)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl animate-pulse" style={{ background: 'var(--lemma-gold)', color: 'var(--lemma-ink)' }}>λ</div>
        <div className="text-center">
          <p className="font-bold text-lg" style={{ color: 'var(--lemma-ink)' }}>AI가 채점하고 있어요</p>
          <p className="text-sm mt-1" style={{ color: 'var(--lemma-ink-3)' }}>잠시만 기다려주세요...</p>
        </div>
      </div>
    )
  }

  if (data.status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8" style={{ background: 'var(--lemma-cream)' }}>
        <p className="text-4xl">⚠️</p>
        <p className="font-bold" style={{ color: 'var(--lemma-ink)' }}>채점 중 오류가 발생했어요</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 rounded-xl text-sm font-semibold" style={{ background: 'var(--lemma-ink)', color: 'var(--lemma-cream)' }}>다시 제출하기</button>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--lemma-cream)', minHeight: '100vh' }}>
      <div className="grid-bg px-5 pt-6 pb-6 border-b" style={{ borderColor: 'var(--lemma-cream-2)' }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl font-bold" style={{ background: pct >= 70 ? 'var(--lemma-gold)' : 'var(--lemma-cream-2)', color: 'var(--lemma-ink)' }}>
            {data.total_score ?? correct}
          </div>
          <p className="font-bold text-lg" style={{ color: 'var(--lemma-ink)' }}>{correct}/{totalProblems} 정답</p>
          <p className="text-sm mt-1" style={{ color: 'var(--lemma-ink-3)' }}>{pct >= 90 ? '🎉 훌륭해요!' : pct >= 70 ? '😊 잘했어요!' : '💪 다음엔 더 잘할 수 있어요'}</p>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--lemma-ink-3)' }}>문제별 결과</p>
        {data.results.map((r, i) => (
          <div key={r.id} className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: r.is_correct ? 'oklch(75% 0.15 155)' : 'var(--lemma-red)' }}>
            <div className="px-4 py-3 flex justify-between items-start border-b" style={{ borderColor: 'var(--lemma-cream-2)', background: r.is_correct ? 'oklch(96% 0.05 155)' : 'oklch(97% 0.04 25)' }}>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--lemma-ink)' }}>문제 {i + 1}</p>
                {r.problem && <p className="text-xs mt-0.5" style={{ color: 'var(--lemma-ink-3)' }}>{r.problem.body.slice(0, 60)}{r.problem.body.length > 60 ? '…' : ''}</p>}
              </div>
              <span className="text-xl">{r.is_correct ? '⭕' : '❌'}</span>
            </div>
            <div className="px-4 py-3 space-y-2">
              {r.student_answer && <div className="flex gap-2 text-xs"><span className="font-bold" style={{ color: 'var(--lemma-ink-3)' }}>내 답:</span><span>{r.student_answer}</span></div>}
              {r.ai_feedback && <p className="text-xs leading-relaxed" style={{ color: 'var(--lemma-ink-2)', borderLeft: '2px solid var(--lemma-gold)', paddingLeft: '8px' }}>{r.ai_feedback}</p>}
              {!r.is_correct && r.similar_problem && (
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
  )
}
