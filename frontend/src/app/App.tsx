import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogoIcon } from '@/shared/components/ui/LogoIcon';
import { SHORT_VERSION } from '@/shared/config/version';

const navItems = [
  { to: '/online', label: '在线' },
  { to: '/ranking', label: '排行' },
  { to: '/hardcore', label: '硬核' },
  { to: '/playermap', label: '地图' },
  { to: '/auction', label: '拍卖行' },
];

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2">
          <Link to="/" className="flex items-center gap-2 mr-4">
            <div className="flex h-8 w-8 items-center justify-center">
              <LogoIcon className="h-8 w-8" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold">泰坦之眼</span>
              <span className="text-[10px] text-muted-foreground">{SHORT_VERSION}</span>
            </div>
          </Link>
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
