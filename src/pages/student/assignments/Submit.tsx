import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../../lib/api'

export default function SubmitPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    setPhotos(p => [...p, ...newFiles])
    setPreviews(p => [...p, ...newFiles.map(f => URL.createObjectURL(f))])
  }

  const removePhoto = (i: number) => {
    setPhotos(p => p.filter((_, j) => j !== i))
    setPreviews(p => p.filter((_, j) => j !== i))
  }

  const handleSubmit = async () => {
    if (photos.length === 0) { setError('사진을 1장 이상 업로드해주세요'); return }
    setLoading(true); setError('')
    try {
      const formData = new FormData()
      formData.append('assignmentId', id!)
      photos.forEach(f => formData.append('photos', f))
      const { submissionId } = await api.submitAssignment(formData)
      navigate(`/student/assignments/${id}/feedback?submissionId=${submissionId}`)
    } catch (e) {
      // 409 = already submitted — fetch the existing submission and navigate to it
      if (e instanceof Error && e.message.includes('Already submitted')) {
        try {
          const assignment = await api.getAssignment(id!)
          const sub = (assignment as unknown as { my_submission: { id: string } | null }).my_submission
          if (sub?.id) {
            navigate(`/student/assignments/${id}/feedback?submissionId=${sub.id}`)
            return
          }
        } catch { /* fall through to error */ }
      }
      setError(e instanceof Error ? e.message : '제출에 실패했어요')
    } finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--lemma-cream)' }}>
      <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--lemma-cream-2)', background: 'white' }}>
        <button onClick={() => navigate(-1)} className="text-sm px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--lemma-cream-2)', color: 'var(--lemma-ink-2)' }}>← 뒤로</button>
        <div>
          <p className="font-bold text-sm" style={{ color: 'var(--lemma-ink)' }}>숙제 제출</p>
          <p className="text-xs" style={{ color: 'var(--lemma-ink-3)' }}>사진 한 장에 모든 문제가 담겨도 됩니다</p>
        </div>
      </div>

      <div className="flex-1 px-5 py-5 space-y-5">
        <div className="px-4 py-3 rounded-xl text-xs leading-relaxed" style={{ background: 'oklch(96% 0.012 75)', borderLeft: '3px solid var(--lemma-gold)', color: 'var(--lemma-ink-2)' }}>
          💡 <strong>팁:</strong> 밝은 곳에서, 풀이 전체가 보이도록 수평으로 찍어주세요
        </div>

        {previews.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--lemma-ink-3)' }}>업로드된 사진</p>
            {previews.map((src, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--lemma-cream-2)' }}>
                <img src={src} alt={`사진 ${i + 1}`} className="w-full object-cover max-h-64" />
                <button onClick={() => removePhoto(i)} className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--lemma-ink)', color: 'white' }}>✕</button>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => fileRef.current?.click()}
          className="w-full py-10 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2"
          style={{ borderColor: 'var(--lemma-cream-2)', background: 'white' }}>
          <span className="text-3xl">📷</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--lemma-ink-2)' }}>{photos.length > 0 ? '사진 추가' : '사진 촬영 또는 선택'}</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />

        {error && <p className="text-sm text-center" style={{ color: 'var(--lemma-red)' }}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading || photos.length === 0}
          className="w-full py-4 rounded-2xl text-base font-bold transition-all disabled:opacity-40"
          style={{ background: 'var(--lemma-ink)', color: 'var(--lemma-cream)' }}>
          {loading ? 'AI 채점 요청 중...' : `제출하기 (${photos.length}장)`}
        </button>
      </div>
    </div>
  )
}
