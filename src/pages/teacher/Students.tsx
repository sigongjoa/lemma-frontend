import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Student } from '../../lib/api'

export default function TeacherStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPin, setNewPin] = useState('')
  const [addError, setAddError] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => { api.getStudents().then(setStudents).finally(() => setLoading(false)) }, [])

  const handleAdd = async () => {
    if (!newName.trim() || !/^\d{4}$/.test(newPin)) { setAddError('이름과 4자리 PIN을 입력해주세요'); return }
    setAdding(true); setAddError('')
    try {
      const student = await api.createStudent({ name: newName.trim(), pin: newPin })
      setStudents(s => [...s, student])
      setShowAdd(false); setNewName(''); setNewPin('')
    } catch (e) { setAddError(e instanceof Error ? e.message : '추가 실패') }
    finally { setAdding(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제할까요?')) return
    await api.deleteStudent(id)
    setStudents(s => s.filter(x => x.id !== id))
  }

  if (loading) return <div className="flex items-center justify-center h-64"><p style={{ color: 'var(--lemma-ink-3)' }}>불러오는 중...</p></div>

  return (
    <div>
      <div className="px-7 py-5 border-b flex justify-between items-center" style={{ borderColor: 'var(--lemma-cream-2)' }}>
        <h1 className="text-xl font-bold" style={{ color: 'var(--lemma-ink)' }}>학생 목록 ({students.length}명)</h1>
        <button onClick={() => setShowAdd(true)} className="text-sm font-semibold px-4 py-2 rounded-xl" style={{ background: 'var(--lemma-gold)', color: 'var(--lemma-ink)' }}>+ 학생 추가</button>
      </div>

      {showAdd && (
        <div className="px-7 py-5 border-b" style={{ borderColor: 'var(--lemma-cream-2)', background: 'oklch(98% 0.005 90)' }}>
          <div className="flex gap-3 items-end max-w-md">
            <div className="flex-1"><label className="block text-xs font-bold mb-1" style={{ color: 'var(--lemma-ink-2)' }}>이름</label><input value={newName} onChange={e => setNewName(e.target.value)} placeholder="홍길동" className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: 'var(--lemma-cream-2)', background: 'white' }} /></div>
            <div><label className="block text-xs font-bold mb-1" style={{ color: 'var(--lemma-ink-2)' }}>PIN</label><input value={newPin} onChange={e => setNewPin(e.target.value)} placeholder="1234" maxLength={4} className="w-20 px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: 'var(--lemma-cream-2)', background: 'white' }} /></div>
            <button onClick={handleAdd} disabled={adding} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: 'var(--lemma-ink)', color: 'var(--lemma-cream)' }}>{adding ? '추가 중' : '추가'}</button>
            <button onClick={() => { setShowAdd(false); setAddError('') }} className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--lemma-cream-2)', color: 'var(--lemma-ink-3)' }}>취소</button>
          </div>
          {addError && <p className="text-xs mt-2" style={{ color: 'var(--lemma-red)' }}>{addError}</p>}
        </div>
      )}

      <div className="p-7">
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'white', borderColor: 'var(--lemma-cream-2)' }}>
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid var(--lemma-cream-2)' }}>
              {['이름', '등록일', ''].map((h, i) => <th key={i} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--lemma-ink-3)' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="hover:bg-stone-50" style={{ borderBottom: '1px solid oklch(95% 0.005 90)' }}>
                  <td className="px-5 py-3"><Link to={`/teacher/students/${s.id}`} className="text-sm font-semibold hover:underline" style={{ color: 'var(--lemma-ink)' }}>{s.name}</Link></td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--lemma-ink-2)' }}>{new Date(s.created_at).toLocaleDateString('ko-KR')}</td>
                  <td className="px-5 py-3 text-right"><button onClick={() => handleDelete(s.id)} className="text-xs px-2 py-1 rounded border" style={{ borderColor: 'var(--lemma-cream-2)', color: 'var(--lemma-ink-3)' }}>삭제</button></td>
                </tr>
              ))}
              {students.length === 0 && <tr><td colSpan={3} className="px-5 py-10 text-center text-sm" style={{ color: 'var(--lemma-ink-3)' }}>등록된 학생이 없어요</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
