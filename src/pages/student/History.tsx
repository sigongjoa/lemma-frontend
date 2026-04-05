import { useEffect, useState } from 'react'
import { api, type SubmissionDetail } from '../../lib/api'

export default function HistoryPage() {
  const [submissions, setSubmissions] = useState<SubmissionDetail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use assignments API which includes submissions
    api.getAssignments().then(async (assignments) => {
      // Collect all done submissions via assignment data
      const done: SubmissionDetail[] = []
      for (const a of assignments) {
        // We'll use a simpler approach: fetch from dashboard-style data
        // But since we don't have a student submissions list endpoint,
        // we fetch each assignment and check my_submission
      }
      setSubmissions(done)
    }).finally(() => setLoading(false))
  }, [])

  // Simpler: re-use the student assignment list which includes submission status
  const [data, setData] = useState<Array<{ title: string; score: number | null; date: string }>>([])

  useEffect(() => {
    api.getAssignments().then(async (assignments) => {
      const withSubs = assignments as Array<{ title: string; my_submission: { total_score: number; submitted_at: string; status: string } | null }>
      const done = withSubs
        .filter(a => a.my_submission?.status === 'done')
        .map(a => ({ title: a.title, score: a.my_submission!.total_score, date: a.my_submission!.submitted_at }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setData(done)
    }).finally(() => setLoading(false))
  }, [])

  const avg = data.length > 0 ? Math.round(data.reduce((a, b) => a + (b.score ?? 0), 0) / data.length) : 0

  if (loading) return <div className="flex items-center justify-center h-64"><p style={{ color: 'var(--lemma-ink-3)' }}>불러오는 중...</p></div>

  return (
    <div>
      <div className="grid-bg px-5 pt-6 pb-5 border-b" style={{ borderColor: 'var(--lemma-cream-2)' }}>
        <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--lemma-ink)' }}>성적 이력</h2>
        <p className="text-sm" style={{ color: 'var(--lemma-ink-3)' }}>총 {data.length}회 제출 · 평균 <strong style={{ color: 'var(--lemma-gold-d)' }}>{avg}점</strong></p>
      </div>
      <div className="px-5 py-4 space-y-3">
        {data.map((s, i) => (
          <div key={i} className="rounded-2xl p-4 border" style={{ background: 'white', borderColor: 'var(--lemma-cream-2)' }}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--lemma-ink)' }}>{s.title}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--lemma-ink-3)' }}>{new Date(s.date).toLocaleDateString('ko-KR')}</p>
              </div>
              <span className="text-2xl font-bold" style={{ color: 'var(--lemma-gold-d)' }}>{s.score}점</span>
            </div>
          </div>
        ))}
        {data.length === 0 && <div className="text-center py-16" style={{ color: 'var(--lemma-ink-3)' }}><p className="text-4xl mb-3">📊</p><p className="text-sm">아직 채점된 숙제가 없어요</p></div>}
      </div>
    </div>
  )
}
