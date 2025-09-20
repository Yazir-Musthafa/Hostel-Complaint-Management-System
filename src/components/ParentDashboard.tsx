import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Eye, 
  MessageCircle, 
  Heart, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle,
  Clock,
  FileText,
  BarChart3,
  Users,
  Send,
  Filter,
  Search,
  Star,
  TrendingUp,
  Shield,
  Activity
} from 'lucide-react';
import { PageHeader } from './shared/PageHeader';
import { FilterBar } from './shared/FilterBar';
import { ComplaintCard } from './student/ComplaintCard';
import { useComplaints } from '../hooks/useComplaints';
import { User, Complaint, ParentFeedback } from '../types';
import { toast } from 'sonner@2.0.3';

interface ParentDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function ParentDashboard({ user, onLogout }: ParentDashboardProps) {
  const { complaints, loading } = useComplaints();
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    priority: 'all',
    block: 'all'
  });
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    type: 'appreciation',
    message: '',
    priority: 'Medium'
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [sentFeedbacks, setSentFeedbacks] = useState<ParentFeedback[]>([]);
  const [showFeedbackHistory, setShowFeedbackHistory] = useState(false);

  // Load existing feedbacks from localStorage on component mount
  useEffect(() => {
    const savedFeedbacks = localStorage.getItem('parentFeedbacks');
    if (savedFeedbacks) {
      setSentFeedbacks(JSON.parse(savedFeedbacks));
    }
  }, []);

  // Filter complaints based on search criteria
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                         complaint.studentName.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'all' || complaint.category === filters.category;
    const matchesStatus = filters.status === 'all' || complaint.status === filters.status;
    const matchesPriority = filters.priority === 'all' || complaint.priority.toLowerCase() === filters.priority.toLowerCase();
    const matchesBlock = filters.block === 'all' || complaint.block === filters.block;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesBlock;
  });

  // Calculate statistics
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    high: complaints.filter(c => c.priority === 'High').length,
    medium: complaints.filter(c => c.priority === 'Medium').length,
    low: complaints.filter(c => c.priority === 'Low').length
  };

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleSendFeedback = () => {
    if (!feedbackForm.message.trim()) {
      toast.error('Please provide feedback message');
      return;
    }

    // Mock feedback submission
    const feedback: ParentFeedback = {
      id: Date.now(),
      parentName: user.name,
      parentEmail: user.email,
      relationship: user.relationship || 'Guardian',
      complaintId: selectedComplaint?.id || 0,
      complaintTitle: selectedComplaint?.title || 'General Feedback',
      studentName: selectedComplaint?.studentName || 'General',
      feedbackType: feedbackForm.type as any,
      message: feedbackForm.message,
      priority: feedbackForm.priority as any,
      submittedDate: new Date().toISOString(),
      status: 'pending',
      isRead: false
    };

    // Add to sent feedbacks (in real app, this would be sent to backend)
    setSentFeedbacks(prev => {
      const updated = [feedback, ...prev];
      // Save to localStorage to simulate backend persistence
      localStorage.setItem('parentFeedbacks', JSON.stringify(updated));
      return updated;
    });
    console.log('Parent feedback submitted:', feedback);
    
    toast.success('Feedback sent successfully! Admin will review your message.');
    setShowFeedbackModal(false);
    setFeedbackForm({ type: 'appreciation', message: '', priority: 'Medium' });
    setSelectedComplaint(null); // Reset selected complaint
  };

  const headerBadges = [
    { text: `${stats.total} Total Complaints`, variant: 'outline' as const },
    { text: `${stats.pending} Pending`, variant: 'outline' as const, className: 'status-pending' },
    { text: `${stats.resolved} Resolved`, variant: 'outline' as const, className: 'status-resolved' }
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      <PageHeader
        title="Parent Portal - Hostel Complaint Monitoring"
        subtitle="Monitor your child's hostel complaints and provide valuable feedback"
        user={user}
        role="parent"
        onLogout={onLogout}
        badges={headerBadges}
        actions={
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setSelectedComplaint(null);
                setShowFeedbackModal(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white btn-professional"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Send Feedback</span>
              <span className="sm:hidden">Feedback</span>
            </Button>
            {sentFeedbacks.length > 0 && (
              <Button 
                variant="outline"
                onClick={() => setShowFeedbackHistory(true)}
                className="btn-professional"
              >
                <FileText className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">My Feedback</span>
                <span className="sm:hidden">History</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {sentFeedbacks.length}
                </Badge>
              </Button>
            )}
          </div>
        }
      />

      <div className="container-custom py-4 lg:py-6 space-y-responsive">
        {/* Statistics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-professional">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm text-muted-foreground font-medium">Total Complaints</p>
                  <p className="text-lg lg:text-xl font-bold text-foreground">{stats.total}</p>
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
                  <p className="text-lg lg:text-xl font-bold text-amber-600">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardContent className="p-4 lg:p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                  <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs lg:text-sm text-muted-foreground font-medium">In Progress</p>
                  <p className="text-lg lg:text-xl font-bold text-blue-600">{stats.inProgress}</p>
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
                  <p className="text-lg lg:text-xl font-bold text-green-600">{stats.resolved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Distribution */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          <Card className="card-professional">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-responsive-base">
                <BarChart3 className="w-5 h-5 text-primary" />
                Priority Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-responsive-sm font-medium text-red-800">High Priority</span>
                <Badge className="status-high font-semibold">{stats.high}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-responsive-sm font-medium text-yellow-800">Medium Priority</span>
                <Badge className="status-medium font-semibold">{stats.medium}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-responsive-sm font-medium text-gray-800">Low Priority</span>
                <Badge className="status-low font-semibold">{stats.low}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-professional xl:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-responsive-base">
                <Shield className="w-5 h-5 text-primary" />
                Parent Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={() => {
                    setSelectedComplaint(null);
                    setFeedbackForm({ ...feedbackForm, type: 'appreciation' });
                    setShowFeedbackModal(true);
                  }}
                  className="h-16 bg-green-600 hover:bg-green-700 text-white btn-professional justify-start"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold">Send Appreciation</div>
                      <div className="text-xs text-green-100">Thank staff & admin</div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedComplaint(null);
                    setFeedbackForm({ ...feedbackForm, type: 'suggestion' });
                    setShowFeedbackModal(true);
                  }}
                  className="h-16 border-2 border-blue-200 hover:bg-blue-50 btn-professional justify-start"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-blue-700">Share Suggestion</div>
                      <div className="text-xs text-blue-600">Help improve services</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complaints List */}
        <div className="space-y-responsive">
          <div className="space-y-2">
            <h2 className="text-responsive-lg font-semibold text-foreground text-balance">
              All Complaints Monitoring
            </h2>
            <p className="text-responsive-sm text-muted-foreground text-balance">
              Monitor all hostel complaints and their resolution status
            </p>
          </div>

          {/* Filters */}
          <Card className="card-professional">
            <CardContent className="p-4 lg:p-6">
              <FilterBar
                filters={filters}
                onFiltersChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
                searchPlaceholder="Search complaints, students, rooms..."
              />
            </CardContent>
          </Card>

          {/* Complaints Grid */}
          {filteredComplaints.length === 0 ? (
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
                      No complaints match your current filter criteria.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <Card key={complaint.id} className="card-professional group">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Main Content */}
                      <div className="flex-1 min-w-0 space-y-4">
                        {/* Title and Badges */}
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                          <h3 className="font-semibold text-responsive-base text-foreground line-clamp-2 flex-1 text-balance">
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
                        <p className="text-responsive-sm text-muted-foreground line-clamp-3 text-balance">
                          {complaint.description}
                        </p>
                        
                        {/* Metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                            <Users className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">Student: {complaint.studentName}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                            <FileText className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">Room: {complaint.room}, {complaint.block}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">Updated: {complaint.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-row lg:flex-col gap-2 justify-end lg:justify-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewComplaint(complaint)}
                          className="flex items-center gap-2 btn-professional flex-1 lg:flex-initial"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                        
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowFeedbackModal(true);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white btn-professional flex items-center gap-2 flex-1 lg:flex-initial"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Send Feedback</span>
                          <span className="sm:hidden">Feedback</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              Send Feedback to Admin
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {selectedComplaint ? (
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-sm text-foreground mb-2">Complaint Reference:</h4>
                <p className="text-sm text-muted-foreground">{selectedComplaint.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Student: {selectedComplaint.studentName} | Room: {selectedComplaint.room}
                </p>
              </div>
            ) : (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-sm text-green-800 mb-2">General Feedback</h4>
                <p className="text-sm text-green-700">
                  Send general feedback, appreciation, or suggestions to the hostel administration.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Feedback Type</label>
                <Select
                  value={feedbackForm.type}
                  onValueChange={(value) => setFeedbackForm({ ...feedbackForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appreciation">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-500" />
                        Appreciation
                      </div>
                    </SelectItem>
                    <SelectItem value="concern">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        Concern
                      </div>
                    </SelectItem>
                    <SelectItem value="suggestion">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-500" />
                        Suggestion
                      </div>
                    </SelectItem>
                    <SelectItem value="complaint_status">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-500" />
                        Complaint Status Query
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Priority</label>
                <Select
                  value={feedbackForm.priority}
                  onValueChange={(value) => setFeedbackForm({ ...feedbackForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High Priority</SelectItem>
                    <SelectItem value="Medium">Medium Priority</SelectItem>
                    <SelectItem value="Low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Your Message</label>
                <Textarea
                  placeholder="Share your feedback, appreciation, or suggestions here..."
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSendFeedback}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={!feedbackForm.message.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Feedback
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback History Modal */}
      <Dialog open={showFeedbackHistory} onOpenChange={setShowFeedbackHistory}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              My Feedback History
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {sentFeedbacks.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-responsive-base font-semibold text-foreground mb-2">
                  No feedback sent yet
                </h3>
                <p className="text-responsive-sm text-muted-foreground">
                  Your sent feedback will appear here for tracking.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sentFeedbacks.map((feedback) => (
                  <Card key={feedback.id} className="card-professional">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-muted/30 rounded-lg">
                            {feedback.feedbackType === 'appreciation' && (
                              <Heart className="w-4 h-4 text-pink-500" />
                            )}
                            {feedback.feedbackType === 'concern' && (
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                            )}
                            {feedback.feedbackType === 'suggestion' && (
                              <Lightbulb className="w-4 h-4 text-blue-500" />
                            )}
                            {feedback.feedbackType === 'complaint_status' && (
                              <FileText className="w-4 h-4 text-purple-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-foreground">
                              {feedback.feedbackType.charAt(0).toUpperCase() + feedback.feedbackType.slice(1).replace('_', ' ')}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(feedback.submittedDate).toLocaleDateString()} at{' '}
                              {new Date(feedback.submittedDate).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={
                            feedback.priority === 'High' ? 'status-high' :
                            feedback.priority === 'Medium' ? 'status-medium' :
                            'status-low'
                          }>
                            {feedback.priority}
                          </Badge>
                          <Badge className={
                            feedback.status === 'pending' ? 'status-pending' :
                            feedback.status === 'reviewed' ? 'status-in-progress' :
                            'status-resolved'
                          }>
                            {feedback.status}
                          </Badge>
                        </div>
                      </div>

                      {feedback.complaintTitle !== 'General Feedback' && (
                        <div className="p-3 bg-muted/30 rounded-lg mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Related to complaint:
                          </p>
                          <p className="text-sm text-foreground">{feedback.complaintTitle}</p>
                          {feedback.studentName !== 'General' && (
                            <p className="text-xs text-muted-foreground">
                              Student: {feedback.studentName}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-sm text-foreground leading-relaxed">
                          {feedback.message}
                        </p>
                      </div>

                      {feedback.status === 'pending' && (
                        <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-xs text-amber-700 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Awaiting admin review
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setShowFeedbackHistory(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}