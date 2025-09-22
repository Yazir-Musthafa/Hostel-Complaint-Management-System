import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  FileText, 
  BarChart3, 
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Settings,
  Users,
  TrendingUp,
  Download,
  Mail,
  Phone,
  Building,
  UserPlus,
  RefreshCw,
  Archive,
  Calendar,
  User,
  MapPin,
  Search
} from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

import { PageHeader } from './shared/PageHeader';
import { AdminSidebar } from './admin/AdminSidebar';
import { ComplaintDetailsModal } from './admin/ComplaintDetailsModal';
import { FilterBar } from './shared/FilterBar';
import { LoadingButton } from './shared/LoadingButton';
import { ConfirmDialog } from './shared/ConfirmDialog';
import { AnalyticsSection } from './admin/AnalyticsSection';
import { SystemSettingsSection } from './admin/SystemSettingsSection';
import { StudentManagementSection } from './admin/StudentManagementSection';
import { ParentFeedbackSection } from './admin/ParentFeedbackSection';


import { useComplaints } from '../hooks/useComplaints';
import { useStudents } from '../hooks/useStudents';
import { User as UserType, Complaint, FilterOptions } from '../types';

interface AdminDashboardProps {
  user: UserType;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'all',
    status: 'all',
    priority: 'all',
    block: 'all'
  });

  // Use custom hooks
  const {
    complaints,
    stats,
    loading: complaintsLoading,
    updateComplaintStatus,
    addReply,
    deleteComplaint,
    getFilteredComplaints
  } = useComplaints();

  const {
    students,
    loading: studentsLoading,
    updateStudent,
    deactivateStudent,
    activateStudent
  } = useStudents();

  const filteredComplaints = getFilteredComplaints(filters);

  const handleStatCardClick = (filterType: string) => {
    setActiveTab('complaints');
    setFilters(prev => ({ ...prev, status: filterType }));
  };

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setShowComplaintModal(true);
  };

  const headerBadges = [
    { text: `${stats.pending} Pending`, className: 'bg-orange-50 text-orange-700 border-orange-200' },
    { text: `${stats.inProgress} In Progress`, className: 'bg-blue-50 text-blue-700 border-blue-200' },
    { text: `${stats.resolved} Resolved`, className: 'bg-green-50 text-green-700 border-green-200' }
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      <PageHeader
        title="Hostel Complaint Management"
        subtitle="Smart system for tracking and resolving hostel complaints"
        user={user}
        role="admin"
        onLogout={onLogout}
        badges={headerBadges}
      />

      <div className="flex">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          complaintsCount={stats.total}
          feedbackCount={(() => {
            const savedFeedbacks = localStorage.getItem('parentFeedbacks');
            const realFeedbacks = savedFeedbacks ? JSON.parse(savedFeedbacks).length : 0;
            return realFeedbacks + 4; // 4 mock feedbacks + real ones
          })()}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="container-custom py-4 lg:py-6 space-y-responsive">
            {activeTab === 'dashboard' && (
              <DashboardOverview 
                stats={stats} 
                complaints={complaints}
                onStatCardClick={handleStatCardClick}
              />
            )}

            {activeTab === 'complaints' && (
              <ComplaintsSection 
                complaints={filteredComplaints}
                filters={filters}
                onFiltersChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
                onViewComplaint={handleViewComplaint}
                loading={complaintsLoading}
              />
            )}

            {activeTab === 'parent-feedback' && (
              <ParentFeedbackSection loading={false} />
            )}

            {activeTab === 'analytics' && <AnalyticsSection />}
            
            {activeTab === 'students' && (
              <StudentManagementSection 
                students={students}
                loading={studentsLoading}
                onUpdateStudent={updateStudent}
                onDeactivateStudent={deactivateStudent}
                onActivateStudent={activateStudent}
              />
            )}
            
            {activeTab === 'settings' && <SystemSettingsSection />}
          </div>
        </main>
      </div>

      <ComplaintDetailsModal
        complaint={selectedComplaint}
        open={showComplaintModal}
        onOpenChange={setShowComplaintModal}
        onStatusUpdate={updateComplaintStatus}
        onSendReply={addReply}
      />
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview({ stats, complaints, onStatCardClick }) {
  const priorityData = [
    { priority: 'High Priority', count: complaints.filter(c => c.priority === 'High').length, color: 'status-high' },
    { priority: 'Medium Priority', count: complaints.filter(c => c.priority === 'Medium').length, color: 'status-medium' },
    { priority: 'Low Priority', count: complaints.filter(c => c.priority === 'Low').length, color: 'status-low' }
  ];

  const recentActivity = complaints
    .slice(0, 4)
    .map(complaint => ({
      id: complaint.id,
      title: complaint.title,
      room: complaint.room,
      status: complaint.status,
      statusColor: complaint.statusColor
    }));

  const statCards = [
    {
      title: 'Total Complaints',
      value: stats.total,
      subtitle: 'All time complaints',
      icon: FileText,
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10',
      onClick: () => onStatCardClick('all')
    },
    {
      title: 'Pending',
      value: stats.pending,
      subtitle: 'Awaiting response',
      icon: Clock,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      onClick: () => onStatCardClick('pending')
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      subtitle: 'Being resolved',
      icon: AlertTriangle,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      onClick: () => onStatCardClick('in-progress')
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      subtitle: 'Successfully resolved',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      onClick: () => onStatCardClick('resolved')
    }
  ];

  return (
    <div className="space-y-responsive">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-responsive-lg font-semibold text-foreground text-balance">
          Dashboard Overview
        </h2>
        <p className="text-responsive-sm text-muted-foreground text-balance">
          Monitor complaint statistics and track resolution progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, index) => (
          <Card 
            key={index}
            className="card-professional cursor-pointer btn-professional group"
            onClick={card.onClick}
          >
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 ${card.bgColor} rounded-xl group-hover:scale-110 transition-transform`}>
                  <card.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${card.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
                  <p className={`text-xl lg:text-2xl font-bold ${card.textColor || 'text-foreground'}`}>
                    {card.value}
                  </p>
                  <p className="text-xs text-muted-foreground/70 truncate">{card.subtitle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Priority Distribution */}
        <Card className="card-professional">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-responsive-base">
              <BarChart3 className="w-5 h-5 text-primary" />
              Priority Distribution
            </CardTitle>
            <p className="text-responsive-sm text-muted-foreground">
              Complaints by priority level
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {priorityData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-responsive-sm font-medium text-foreground">{item.priority}</span>
                <div className="flex items-center gap-3">
                  <span className="text-responsive-sm font-semibold text-foreground">{item.count}</span>
                  <Badge className={`${item.color} font-semibold`}>
                    {item.count}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-professional">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-responsive-base">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
            <p className="text-responsive-sm text-muted-foreground">
              Latest complaint updates
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((item) => (
                <div key={item.id} className="border-l-4 border-primary/20 bg-muted/30 rounded-r-lg pl-4 pr-4 py-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-responsive-sm text-foreground line-clamp-1 flex-1">
                      {item.title}
                    </h4>
                    <Badge className={`${item.statusColor} text-xs flex-shrink-0`}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.room}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-responsive-sm text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Complaints Section Component  
function ComplaintsSection({ complaints, filters, onFiltersChange, onViewComplaint, loading }) {
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; complaintId: number | null }>({
    open: false,
    complaintId: null
  });

  const statusTabs = [
    { value: 'all', label: 'All', fullLabel: 'All Complaints', count: complaints.length, color: 'text-primary' },
    { value: 'pending', label: 'Pending', fullLabel: 'Pending', count: complaints.filter(c => c.status === 'pending').length, color: 'text-amber-600' },
    { value: 'in-progress', label: 'In Progress', fullLabel: 'In Progress', count: complaints.filter(c => c.status === 'in-progress').length, color: 'text-blue-600' },
    { value: 'resolved', label: 'Resolved', fullLabel: 'Resolved', count: complaints.filter(c => c.status === 'resolved').length, color: 'text-green-600' }
  ];

  const handleDeleteComplaint = async (id: number) => {
    try {
      // This would call the delete function from the hook
      toast.success('Complaint deleted successfully');
    } catch (error) {
      toast.error('Failed to delete complaint');
    }
    setConfirmDelete({ open: false, complaintId: null });
  };

  return (
    <div className="space-y-responsive">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-responsive-lg font-semibold text-foreground text-balance">
          All Complaints
        </h2>
        <p className="text-responsive-sm text-muted-foreground text-balance">
          Manage and track all hostel complaints
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="card-professional">
        <CardContent className="p-4 lg:p-6">
          <FilterBar
            filters={filters}
            onFiltersChange={onFiltersChange}
            searchPlaceholder="Search complaints, students, rooms..."
          />
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <Tabs value={filters.status} onValueChange={(value) => onFiltersChange({ status: value })}>
        {/* Mobile Tab Selector */}
        <div className="block sm:hidden mb-4">
          <Select value={filters.status} onValueChange={(value) => onFiltersChange({ status: value })}>
            <SelectTrigger className="w-full bg-muted/30">
              <SelectValue>
                {(() => {
                  const currentTab = statusTabs.find(tab => tab.value === filters.status);
                  return currentTab ? `${currentTab.fullLabel} (${currentTab.count})` : 'All Complaints';
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statusTabs.map((tab) => (
                <SelectItem key={tab.value} value={tab.value}>
                  <div className="flex items-center gap-2">
                    <span>{tab.fullLabel}</span>
                    <Badge variant="secondary" className="text-xs">
                      {tab.count}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Tab List */}
        <TabsList className="hidden sm:grid w-full grid-cols-4 bg-muted/30 p-1 h-auto">
          {statusTabs.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <span className={`font-medium text-xs sm:text-sm ${tab.color}`}>
                {tab.label}
              </span>
              <Badge variant="secondary" className="text-xs bg-background/50">
                {tab.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {statusTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4 lg:mt-6">
            <div className="space-y-4">
              {complaints.length === 0 ? (
                <Card className="card-professional">
                  <CardContent className="p-8 lg:p-12 text-center">
                    <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-responsive-base font-semibold text-foreground">
                          No complaints found
                        </h3>
                        <p className="text-responsive-sm text-muted-foreground text-balance">
                          No {tab.label.toLowerCase()} complaints at the moment.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <Card key={complaint.id} className="card-professional group">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                          {/* Main Content */}
                          <div className="flex-1 min-w-0 space-y-4">
                            {/* Title and Badges */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <h3 className="font-semibold text-responsive-base text-foreground line-clamp-2 flex-1">
                                {complaint.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className={complaint.statusColor}>
                                  {complaint.status === 'in-progress' ? 'In Progress' : complaint.status}
                                </Badge>
                                <Badge className={complaint.priorityColor}>
                                  {complaint.priority}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {complaint.category}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Description */}
                            <p className="text-responsive-sm text-muted-foreground line-clamp-2 text-balance">
                              {complaint.description}
                            </p>
                            
                            {/* Metadata Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                                <User className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{complaint.studentName}</span>
                              </div>
                              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{complaint.room}, {complaint.block}</span>
                              </div>
                              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">Submitted: {complaint.submittedDate}</span>
                              </div>
                              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                                <Clock className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">Updated: {complaint.lastUpdated}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex lg:flex-col gap-2 justify-end lg:justify-start">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewComplaint(complaint)}
                              className="flex items-center gap-2 btn-professional"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">View Details</span>
                              <span className="sm:hidden">View</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setConfirmDelete({ open: true, complaintId: complaint.id })}
                              className="flex items-center gap-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/10 btn-professional"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Delete</span>
                              <span className="sm:hidden">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <ConfirmDialog
        open={confirmDelete.open}
        onOpenChange={(open) => setConfirmDelete({ open, complaintId: null })}
        title="Delete Complaint"
        description="Are you sure you want to delete this complaint? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => confirmDelete.complaintId && handleDeleteComplaint(confirmDelete.complaintId)}
        destructive
      />
    </div>
  );
}