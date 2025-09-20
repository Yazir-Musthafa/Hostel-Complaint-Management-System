import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { LogOut } from 'lucide-react';
import { User } from '../../types';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  user: User;
  role: 'admin' | 'student' | 'parent';
  onLogout: () => void;
  badges?: Array<{
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  }>;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  user,
  role,
  onLogout,
  badges = [],
  actions
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/50 safe-top">
      <div className="container-custom">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 py-4">
          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-responsive-lg font-semibold text-primary text-balance truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-responsive-sm text-muted-foreground mt-1 hidden sm:block text-balance">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Right Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            {/* Status Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant={badge.variant || "outline"}
                    className={`text-xs font-medium px-2.5 py-1 ${badge.className || ''}`}
                  >
                    {badge.text}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Action Buttons */}
            {actions && (
              <div className="flex items-center gap-2 flex-wrap">
                {actions}
              </div>
            )}
            
            {/* User Profile & Logout */}
            <div className="flex items-center gap-3 bg-muted/30 rounded-lg px-3 py-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground truncate max-w-32">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {role}
                </p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onLogout} 
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 p-2 h-auto"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};