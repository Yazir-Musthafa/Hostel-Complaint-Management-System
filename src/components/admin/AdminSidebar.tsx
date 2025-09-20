import React from 'react';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Users, 
  Settings,
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  complaintsCount: number;
  feedbackCount?: number;
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & Statistics' },
  { id: 'complaints', label: 'All Complaints', icon: FileText, desc: 'Manage All Issues' },
  { id: 'parent-feedback', label: 'Parent Feedback', icon: MessageSquare, desc: 'Manage Parent Feedback' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, desc: 'Reports & Insights' },
  { id: 'students', label: 'Student Management', icon: Users, desc: 'Manage Student Accounts' },
  { id: 'settings', label: 'System Settings', icon: Settings, desc: 'Configure System' }
];

export const AdminSidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  complaintsCount,
  feedbackCount = 4
}) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 bg-gradient-to-b from-muted/30 to-muted/10 border-r border-border/50 min-h-screen sticky top-16">
        <div className="p-4 lg:p-6">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 group ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  activeTab === item.id ? '' : 'text-muted-foreground/60'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold truncate text-sm">
                      {item.label}
                    </span>
                    {item.id === 'complaints' && (
                      <Badge 
                        variant={activeTab === item.id ? "secondary" : "outline"} 
                        className={`text-xs flex-shrink-0 font-semibold ${
                          activeTab === item.id 
                            ? 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20' 
                            : 'bg-primary/10 text-primary border-primary/20'
                        }`}
                      >
                        {complaintsCount}
                      </Badge>
                    )}
                    {item.id === 'parent-feedback' && (
                      <Badge 
                        variant={activeTab === item.id ? "secondary" : "outline"} 
                        className={`text-xs flex-shrink-0 font-semibold ${
                          activeTab === item.id 
                            ? 'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20' 
                            : 'bg-green-100 text-green-700 border-green-200'
                        }`}
                      >
                        {feedbackCount}
                      </Badge>
                    )}
                  </div>
                  <p className={`text-xs truncate leading-tight ${
                    activeTab === item.id ? 'text-primary-foreground/70' : 'text-muted-foreground/80'
                  }`}>
                    {item.desc}
                  </p>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-border/50 px-4 py-3 sticky top-16 z-30">
        <Select value={activeTab} onValueChange={onTabChange}>
          <SelectTrigger className="w-full h-12 bg-muted/30 border-border/50 rounded-lg font-medium">
            <SelectValue className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {(() => {
                  const currentItem = navigation.find(nav => nav.id === activeTab);
                  return currentItem ? (
                    <>
                      <currentItem.icon className="w-4 h-4 text-primary" />
                      <span className="font-medium">{currentItem.label}</span>
                      {currentItem.id === 'complaints' && (
                        <Badge variant="secondary" className="text-xs">
                          {complaintsCount}
                        </Badge>
                      )}
                    </>
                  ) : null;
                })()}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-md border-border/50">
            {navigation.map((item) => (
              <SelectItem 
                key={item.id} 
                value={item.id}
                className="py-3 px-4 focus:bg-accent/50"
              >
                <div className="flex items-center gap-3 w-full">
                  <item.icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{item.label}</span>
                      {item.id === 'complaints' && (
                        <Badge variant="secondary" className="text-xs">
                          {complaintsCount}
                        </Badge>
                      )}
                      {item.id === 'parent-feedback' && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          {feedbackCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};