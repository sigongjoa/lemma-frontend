import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { saveAuth } from '../lib/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDigit = (d: string) => { if (pin.length < 4) setPin(p => p + d) }
  const handleDelete = () => setPin(p => p.slice(0, -1))

  const handleSubmit = async () => {
    if (!name.trim()) { setError('이름을 입력해주세요'); return }
    if (pin.length !== 4) { setError('PIN 4자리를 입력해주세요'); return }
    setLoading(true); setError('')
    try {
      const { token, user } = await api.login(name.trim(), pin)
      saveAuth(token, user as Parameters<typeof saveAuth>[1])
      navigate(user.role === 'admin' ? '/teacher' : '/student', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : '로그인 실패')
      setPin('')
    } finally { setLoading(false) }
  }

  return (
    <div className="grid-bg min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 font-brand-italic text-3xl"
            style={{ background: 'var(--lemma-ink)', color: 'var(--lemma-gold)' }}>λ</div>
          <h1 className="font-brand text-3xl tracking-tight" style={{ color: 'var(--lemma-ink)' }}>Lemma</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--lemma-ink-3)' }}>수학 학원 AI 학습관리</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--lemma-ink-2)' }}>이름</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="홍길동"
              className="w-full px-4 py-3 rounded-xl text-sm border outline-none transition-colors"
              style={{ background: 'white', borderColor: 'var(--lemma-cream-2)', color: 'var(--lemma-ink)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--lemma-gold)')}
              onBlur={e => (e.target.style.borderColor = 'var(--lemma-cream-2)')} />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--lemma-ink-2)' }}>PIN 번호</label>
            <div className="flex gap-3 justify-center mb-2">
              {[0,1,2,3].map(i => (
                <div key={i} className="w-14 h-16 rounded-xl flex items-center justify-center text-2xl font-bold transition-all"
                  style={{
                    border: `2px solid ${i < pin.length ? 'var(--lemma-gold)' : i === pin.length ? 'var(--lemma-ink)' : 'var(--lemma-cream-2)'}`,
                    background: i < pin.length ? 'oklch(96% 0.012 75)' : 'white',
                    color: 'var(--lemma-ink)',
                  }}>
                  {i < pin.length ? '●' : ''}
                </div>
              ))}
            </div>
            <p className="text-center text-xs" style={{ color: 'var(--lemma-ink-3)' }}>선생님이 알려준 4자리 번호를 입력하세요</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['1','2','3','4','5','6','7','8','9'].map(d => (
              <button key={d} onClick={() => handleDigit(d)}
                className="py-4 rounded-xl text-xl font-semibold transition-all active:scale-95"
                style={{ background: 'white', border: '1px solid var(--lemma-cream-2)', color: 'var(--lemma-ink)' }}>{d}</button>
            ))}
            <div />
            <button onClick={() => handleDigit('0')}
              className="py-4 rounded-xl text-xl font-semibold transition-all active:scale-95"
              style={{ background: 'white', border: '1px solid var(--lemma-cream-2)', color: 'var(--lemma-ink)' }}>0</button>
            <button onClick={handleDelete}
              className="py-4 rounded-xl text-sm transition-all active:scale-95"
              style={{ background: 'oklch(93% 0.02 265)', border: '1px solid var(--lemma-cream-2)', color: 'var(--lemma-ink-2)' }}>⌫</button>
          </div>

          {error && <p className="text-sm text-center font-medium" style={{ color: 'var(--lemma-red)' }}>{error}</p>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 rounded-xl text-base font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ background: 'var(--lemma-ink)', color: 'var(--lemma-cream)' }}>
            {loading ? '확인 중...' : '로그인'}
          </button>
        </div>
      </div>
    </div>
  )
}
