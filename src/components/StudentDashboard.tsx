import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Plus, 
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

// Import new components
import { PageHeader } from './shared/PageHeader';
import { FilterBar } from './shared/FilterBar';
import { ConfirmDialog } from './shared/ConfirmDialog';
import { SubmitComplaintForm } from './student/SubmitComplaintForm';
import { ComplaintCard } from './student/ComplaintCard';
import { ComplaintDetailView } from './student/ComplaintDetailView';

// Import hooks and types
import { useComplaints } from '../hooks/useComplaints';
import { User, Complaint, FilterOptions } from '../types';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState<{ open: boolean; complaintId: number | null }>({
    open: false,
    complaintId: null
  });

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
    loading,
    addComplaint,
    deleteComplaint,
    getComplaintsByStudent
  } = useComplaints();

  // Get student's complaints
  const studentComplaints = getComplaintsByStudent(user.name);
  
  // Filter complaints based on current filters
  const filteredComplaints = studentComplaints.filter(complaint => {
    const matchesSearch = !filters.search || 
      complaint.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      complaint.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      complaint.category.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = filters.category === 'all' || complaint.category === filters.category;
    const matchesPriority = filters.priority === 'all' || complaint.priority.toLowerCase() === filters.priority;
    const matchesStatus = filters.status === 'all' || complaint.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const studentStats = {
    total: studentComplaints.length,
    pending: studentComplaints.filter(c => c.status === 'pending').length,
    inProgress: studentComplaints.filter(c => c.status === 'in-progress').length,
    resolved: studentComplaints.filter(c => c.status === 'resolved').length
  };

  const handleSubmitComplaint = async (formData: any) => {
    const result = await addComplaint(formData, user.name);
    if (result.success) {
      toast.success('Complaint submitted successfully!');
      setShowSubmitForm(false);
    } else {
      toast.error(result.error || 'Failed to submit complaint');
    }
    return result;
  };

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailModal(true);
  };

  const handleCancelComplaint = async (complaintId: number) => {
    const result = await deleteComplaint(complaintId);
    if (result.success) {
      toast.success('Complaint cancelled successfully');
    } else {
      toast.error(result.error || 'Failed to cancel complaint');
    }
    setConfirmCancel({ open: false, complaintId: null });
  };

  const headerBadges = [
    { text: `${studentStats.total} Total`, className: 'bg-blue-50 text-blue-700 border-blue-200' },
    { text: `${studentStats.pending} Pending`, className: 'bg-orange-50 text-orange-700 border-orange-200' },
    { text: `${studentStats.inProgress} In Progress`, className: 'bg-blue-50 text-blue-700 border-blue-200' }
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      <PageHeader
        title="Hostel Complaint Management"
        subtitle="Submit and track your complaints easily"
        user={user}
        role="student"
        onLogout={onLogout}
        badges={headerBadges}
        actions={
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground btn-professional"
            onClick={() => setShowSubmitForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Submit New Complaint</span>
            <span className="sm:hidden">Submit</span>
          </Button>
        }
      />

      <div className="container-custom py-4 lg:py-6 space-y-responsive">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-professional">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm text-muted-foreground font-medium">Total</p>
                  <p className="text-lg lg:text-xl font-bold text-foreground">{studentStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 rounded-xl">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm text-muted-foreground font-medium">Pending</p>
                  <p className="text-lg lg:text-xl font-bold text-amber-600">{studentStats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                  <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm text-muted-foreground font-medium">In Progress</p>
                  <p className="text-lg lg:text-xl font-bold text-blue-600">{studentStats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-100 rounded-xl">
                  <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm text-muted-foreground font-medium">Resolved</p>
                  <p className="text-lg lg:text-xl font-bold text-green-600">{studentStats.resolved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Complaints Section */}
        <div className="space-y-responsive">
          <div className="space-y-2">
            <h2 className="text-responsive-lg font-semibold text-foreground text-balance">
              My Complaints
            </h2>
            <p className="text-responsive-sm text-muted-foreground text-balance">
              Track the status of your submitted complaints
            </p>
          </div>

          {/* Search and Filters */}
          {studentComplaints.length > 0 && (
            <Card className="card-professional">
              <CardContent className="p-4 lg:p-6">
                <FilterBar
                  filters={filters}
                  onFiltersChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
                  searchPlaceholder="Search your complaints..."
                  showBlock={false}
                />
              </CardContent>
            </Card>
          )}

          {/* Complaints List */}
          {filteredComplaints.length === 0 ? (
            <Card className="card-professional">
              <CardContent className="p-8 lg:p-12 text-center">
                <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-4">
                    {studentComplaints.length === 0 ? (
                      <>
                        <div className="space-y-2">
                          <h3 className="text-responsive-base font-semibold text-foreground">
                            You haven't submitted any complaints yet
                          </h3>
                          <p className="text-responsive-sm text-muted-foreground text-balance">
                            Start by submitting your first complaint to track issues in your hostel.
                          </p>
                        </div>
                        <Button 
                          className="bg-primary hover:bg-primary/90 text-primary-foreground btn-professional"
                          onClick={() => setShowSubmitForm(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Submit Your First Complaint
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <h3 className="text-responsive-base font-semibold text-foreground">
                            No complaints match your filters
                          </h3>
                          <p className="text-responsive-sm text-muted-foreground text-balance">
                            Try adjusting your search or filter criteria.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onViewDetails={handleViewDetails}
                  onCancel={(id) => setConfirmCancel({ open: true, complaintId: id })}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Complaint Modal */}
      <Dialog open={showSubmitForm} onOpenChange={setShowSubmitForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit New Complaint</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit your complaint. We'll review it and get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <SubmitComplaintForm
            onSubmit={handleSubmitComplaint}
            onClose={() => setShowSubmitForm(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      {/* Complaint Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>
              View complete information about your complaint
            </DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <ComplaintDetailView complaint={selectedComplaint} />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        open={confirmCancel.open}
        onOpenChange={(open) => setConfirmCancel({ open, complaintId: null })}
        title="Cancel Complaint"
        description="Are you sure you want to cancel this complaint? This action cannot be undone."
        confirmText="Cancel Complaint"
        cancelText="Keep Complaint"
        onConfirm={() => confirmCancel.complaintId && handleCancelComplaint(confirmCancel.complaintId)}
        destructive
      />
    </div>
  );
}