import { Outlet, Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/online', label: '在线' },
  { to: '/ranking', label: '排行' },
  { to: '/hardcore', label: '硬核' },
  { to: '/achievement', label: '成就' },
  { to: '/banlist', label: '封禁' },
];

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
