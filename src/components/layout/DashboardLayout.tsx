
import { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const DashboardLayout = ({ children, title, description }: DashboardLayoutProps) => {
  const location = useLocation();
  
  // Effect for page transitions
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Animation for new content
    const content = document.getElementById('page-content');
    if (content) {
      content.classList.add('opacity-0', 'translate-y-4');
      
      setTimeout(() => {
        content.classList.remove('opacity-0', 'translate-y-4');
        content.classList.add('opacity-100', 'translate-y-0');
      }, 10);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div 
          id="page-content"
          className="transition-all duration-500 ease-out"
        >
          <header className="mb-8 animate-slide-down">
            <div className="inline-block bg-primary/10 px-3 py-1 rounded-full text-primary text-xs font-medium mb-2">
              {title}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            {description && (
              <p className="mt-2 text-lg text-muted-foreground max-w-3xl">
                {description}
              </p>
            )}
          </header>
          
          <div className="animate-scale-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
