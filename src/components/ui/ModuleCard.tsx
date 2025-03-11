
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  className?: string;
  metric?: {
    value: string | number;
    label: string;
  };
}

const ModuleCard = ({
  title,
  description,
  icon,
  path,
  metric,
  className,
}: ModuleCardProps) => {
  return (
    <Link 
      to={path}
      className={cn(
        "block group rounded-xl p-6",
        "bg-white dark:bg-slate-800 border border-border",
        "shadow-sm hover:shadow-md transition-all duration-300",
        "hover:bg-slate-50 dark:hover:bg-slate-700 card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-lg",
          "bg-primary/10 text-primary",
          "dark:bg-primary/20 dark:text-primary-foreground",
          "group-hover:bg-primary group-hover:text-white",
          "transition-colors duration-300"
        )}>
          {icon}
        </div>
        
        {metric && (
          <div className="text-right">
            <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
            <p className="text-xs text-muted-foreground">{metric.label}</p>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <span className="inline-flex items-center text-sm font-medium text-primary">
          View Details
          <svg 
            className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </span>
      </div>
    </Link>
  );
};

export default ModuleCard;
