
import { type ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboardIcon, Newspaper, Briefcase, Cog, Bitcoin } from 'lucide-react'; // Changed LayoutDashboard to LayoutDashboardIcon (Bug: potential non-existent icon or typo)

interface LayoutProps {
  children?: ReactNode;
}

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboardIcon }, // Bug: Using the potentially incorrect icon
  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/settings', label: 'Settings', icon: Cog },
];

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Bitcoin className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">CryptoHub</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="transition-colors hover:text-primary text-muted-foreground data-[active=true]:text-primary"
              >
                <item.icon className="inline-block w-4 h-4 mr-1 mb-0.5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children ? children : <Outlet />}
      </main>
      <footer className="py-6 md:px-8 md:py-0 bg-background border-t border-border/40">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by App Prototyper.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
