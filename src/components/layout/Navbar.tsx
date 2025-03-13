
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Settings, 
  Box, 
  BarChart3, 
  Package, 
  TrendingUp, 
  Calculator, 
  Home,
  SunMoon,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

type NavItem = {
  name: string;
  icon: JSX.Element;
  path: string;
};

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: <Home size={20} />, path: '/' },
  { name: 'Machines', icon: <Settings size={20} />, path: '/machines' },
  { name: 'Parts', icon: <Box size={20} />, path: '/parts' },
  { name: 'OEE', icon: <BarChart3 size={20} />, path: '/oee' },
  { name: 'Consumables', icon: <Package size={20} />, path: '/consumables' },
  { name: 'Raw Materials', icon: <Layers size={20} />, path: '/raw-materials' },
  { name: 'Forecast', icon: <TrendingUp size={20} />, path: '/forecast' },
  { name: 'Cost Analysis', icon: <Calculator size={20} />, path: '/cost-breakdown' },
];

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-8 py-4",
        scrolled ? "bg-background/80 shadow-sm backdrop-blur-lg" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-primary">Factory Planner 360</h1>
        </div>
        
        <div className="hidden lg:flex">
          <ul className="flex space-x-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    location.pathname === item.path 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="ml-2 rounded-full"
            aria-label="Toggle theme"
          >
            <SunMoon className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="lg:hidden">
          {/* Mobile menu button would go here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
