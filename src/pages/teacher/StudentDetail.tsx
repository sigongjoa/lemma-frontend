import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api, type StudentDetail } from '../../lib/api'

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<StudentDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getStudent(id!).then(setData).finally(() => setLoading(false)) }, [id])

  if (loading) return <div className="flex items-center justify-center h-64"><p style={{ color: 'var(--lemma-ink-3)' }}>불러오는 중...</p></div>
  if (!data) return <div className="flex items-center justify-center h-64"><p style={{ color: 'var(--lemma-red)' }}>학생을 찾을 수 없어요</p></div>

  const avgScore = data.scoreHistory.length > 0
    ? Math.round(data.scoreHistory.reduce((a, b) => a + b.score, 0) / data.scoreHistory.length) : 0

  return (
    <div>
      <div className="px-7 py-5 border-b flex items-center gap-4" style={{ borderColor: 'var(--lemma-cream-2)' }}>
        <button onClick={() => navigate(-1)} className="text-sm px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--lemma-cream-2)', color: 'var(--lemma-ink-2)' }}>← 뒤로</button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--lemma-ink)' }}>{data.student.name}</h1>
          <p className="text-xs" style={{ color: 'var(--lemma-ink-3)' }}>등록일 {new Date(data.student.created_at).toLocaleDateString('ko-KR')}</p>
        </div>
      </div>

      <div className="p-7 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '총 제출', value: data.submissions.length, unit: '회' },
            { label: '평균 점수', value: avgScore, unit: '점' },
            { label: '오답 유형', value: data.conceptStats.filter(c => c.rate < 70).length, unit: '개' },
          ].map(({ label, value, unit }) => (
            <div key={label} className="rounded-2xl p-4 border text-center" style={{ background: 'white', borderColor: 'var(--lemma-cream-2)' }}>
              <p className="text-3xl font-bold" style={{ color: 'var(--lemma-ink)' }}>{value}<span className="text-lg ml-0.5" style={{ color: 'var(--lemma-ink-3)' }}>{unit}</span></p>
              <p className="text-xs mt-1" style={{ color: 'var(--lemma-ink-3)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Score history */}
        {data.scoreHistory.length > 0 && (
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: 'var(--lemma-cream-2)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--lemma-cream-2)' }}>
              <h2 className="text-sm font-bold" style={{ color: 'var(--lemma-ink)' }}>성적 이력</h2>
            </div>
            <div className="divide-y" style={{ borderColor: 'oklch(95% 0.005 90)' }}>
              {data.scoreHistory.map((s, i) => (
                <div key={i} className="px-5 py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--lemma-ink)' }}>{s.title}</p>
                    <p className="text-xs" style={{ color: 'var(--lemma-ink-3)' }}>{new Date(s.date).toLocaleDateString('ko-KR')}</p>
                  </div>
                  <span className="text-xl font-bold" style={{ color: 'var(--lemma-gold-d)' }}>{s.score}점</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Concept stats */}
        {data.conceptStats.length > 0 && (
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: 'var(--lemma-cream-2)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--lemma-cream-2)' }}>
              <h2 className="text-sm font-bold" style={{ color: 'var(--lemma-ink)' }}>개념별 정답률</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              {data.conceptStats.map(c => (
                <div key={c.tag}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium" style={{ color: 'var(--lemma-ink)' }}>{c.tag}</span>
                    <span className="text-xs" style={{ color: c.rate >= 70 ? 'var(--lemma-green)' : 'var(--lemma-red)' }}>{c.rate}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--lemma-cream-2)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${c.rate}%`, background: c.rate >= 70 ? 'var(--lemma-green)' : 'var(--lemma-red)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
