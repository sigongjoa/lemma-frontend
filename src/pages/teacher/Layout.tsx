import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { clearAuth } from '../../lib/auth'

export default function TeacherLayout() {
  const navigate = useNavigate()
  const handleLogout = () => { clearAuth(); navigate('/login', { replace: true }) }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--lemma-cream)' }}>
      <aside className="w-56 flex-shrink-0 border-r flex flex-col"
        style={{ background: 'oklch(96% 0.008 90)', borderColor: 'var(--lemma-cream-2)' }}>
        <div className="px-5 py-6 border-b" style={{ borderColor: 'var(--lemma-cream-2)' }}>
          <span className="font-brand text-xl" style={{ color: 'var(--lemma-ink)' }}>
            Lemma <span className="font-brand-italic" style={{ color: 'var(--lemma-gold)' }}>λ</span>
          </span>
        </div>
        <nav className="flex-1 py-4">
          <p className="px-5 py-2 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--lemma-ink-3)' }}>메뉴</p>
          {[
            { to: '/teacher',                 icon: '📊', label: '대시보드', end: true },
            { to: '/teacher/assignments',      icon: '📋', label: '숙제 관리' },
            { to: '/teacher/problems',         icon: '📝', label: '문제 관리' },
            { to: '/teacher/problem-sets/new', icon: '📦', label: '문제 세트' },
            { to: '/teacher/students',         icon: '👥', label: '학생 목록' },
          ].map(({ to, icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className="flex items-center gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-white/60"
              style={({ isActive }) => ({ color: isActive ? 'var(--lemma-ink)' : 'var(--lemma-ink-2)', fontWeight: isActive ? '600' : undefined })}>
              <span>{icon}</span><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: 'var(--lemma-cream-2)' }}>
          <button onClick={handleLogout}
            className="w-full text-xs py-2 rounded-lg border transition-colors"
            style={{ borderColor: 'var(--lemma-cream-2)', color: 'var(--lemma-ink-3)' }}>
            로그아웃
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto"><Outlet /></main>
    </div>
  )
}
