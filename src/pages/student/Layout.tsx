import { Outlet, NavLink } from 'react-router-dom'

export default function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto" style={{ background: 'var(--lemma-cream)' }}>
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md flex border-t"
        style={{ background: 'white', borderColor: 'var(--lemma-cream-2)' }}>
        {[
          { to: '/student',         icon: '📋', label: '숙제' },
          { to: '/student/history', icon: '📈', label: '성적' },
          { to: '/student/wrong',   icon: '📝', label: '오답노트' },
        ].map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to === '/student'}
            className="flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-colors"
            style={({ isActive }) => ({ color: isActive ? 'var(--lemma-ink)' : 'var(--lemma-ink-3)' })}>
            <span className="text-lg">{icon}</span>
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
