import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  MessageSquare, 
  Heart, 
  AlertTriangle, 
  Lightbulb, 
  FileText, 
  User, 
  Calendar,
  Clock,
  Reply,
  CheckCircle2,
  Mail,
  Phone,
  Star,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { ParentFeedback } from '../../types';
import { toast } from 'sonner@2.0.3';

interface ParentFeedbackSectionProps {
  loading?: boolean;
}

export const ParentFeedbackSection: React.FC<ParentFeedbackSectionProps> = ({ loading }) => {
  // Global feedback state (in a real app, this would be managed by a state management solution or backend)
  const [globalFeedbacks] = useState<ParentFeedback[]>(() => {
    // Check if there are feedbacks in localStorage from parent dashboard
    const savedFeedbacks = localStorage.getItem('parentFeedbacks');
    return savedFeedbacks ? JSON.parse(savedFeedbacks) : [];
  });
  const [selectedFeedback, setSelectedFeedback] = useState<ParentFeedback | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all'
  });

  // Combine mock data with real feedbacks from localStorage
  const [parentFeedbacks, setParentFeedbacks] = useState<ParentFeedback[]>(() => {
    const mockData: ParentFeedback[] = [
      {
        id: 1,
        parentName: 'Mr. Rajesh Kumar',
        parentEmail: 'rajesh.kumar@email.com',
        relationship: 'Father',
        complaintId: 1,
        complaintTitle: 'Air Conditioning Issue',
        studentName: 'Arjun Kumar',
        feedbackType: 'appreciation',
        message: 'Thank you for the quick resolution of the AC issue. The maintenance team was very professional and fixed the problem within 24 hours. My son is now comfortable in his room.',
        priority: 'Medium',
        submittedDate: '2024-01-15T10:30:00Z',
        status: 'pending',
        isRead: false
      },
      {
        id: 2,
        parentName: 'Mrs. Priya Sharma',
        parentEmail: 'priya.sharma@email.com',
        relationship: 'Mother',
        complaintId: 2,
        complaintTitle: 'Noise Complaint',
        studentName: 'Rohit Sharma',
        feedbackType: 'concern',
        message: 'I am concerned about the repeated noise complaints from my son\'s room. Despite multiple complaints, the issue persists. Please ensure strict action is taken.',
        priority: 'High',
        submittedDate: '2024-01-14T15:45:00Z',
        status: 'pending',
        adminReply: 'We understand your concern and have implemented stricter noise regulations. Wardens will conduct regular checks.',
        isRead: true
      },
      {
        id: 3,
        parentName: 'Mr. Anil Patel',
        parentEmail: 'anil.patel@email.com',
        relationship: 'Father',
        complaintId: 3,
        complaintTitle: 'WiFi Connectivity',
        studentName: 'Nikhil Patel',
        feedbackType: 'suggestion',
        message: 'Suggestion: Install Wi-Fi boosters on each floor to ensure better connectivity for students. This will help them with their online classes and assignments.',
        priority: 'Low',
        submittedDate: '2024-01-13T09:20:00Z',
        status: 'reviewed',
        adminReply: 'Thank you for your suggestion. We are evaluating the installation of Wi-Fi boosters and will implement this in the next quarter.',
        isRead: true
      },
      {
        id: 4,
        parentName: 'Mrs. Deepika Singh',
        parentEmail: 'deepika.singh@email.com',
        relationship: 'Mother',
        complaintId: 4,
        complaintTitle: 'Food Quality Issue',
        studentName: 'Ankit Singh',
        feedbackType: 'complaint_status',
        message: 'Could you please provide an update on the food quality complaint submitted last week? My son mentioned that there has been no visible improvement yet.',
        priority: 'Medium',
        submittedDate: '2024-01-12T14:15:00Z',
        status: 'responded',
        adminReply: 'We have conducted a thorough review of our food service. New quality control measures have been implemented and a new chef has been hired.',
        isRead: true
      }
    ];
    
    return [...globalFeedbacks, ...mockData];
  });

  // Listen for changes in localStorage to update feedbacks in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const savedFeedbacks = localStorage.getItem('parentFeedbacks');
      if (savedFeedbacks) {
        const newFeedbacks = JSON.parse(savedFeedbacks);
        setParentFeedbacks(prev => {
          const mockData = prev.filter(f => f.id <= 4); // Keep mock data
          return [...newFeedbacks, ...mockData];
        });
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on component mount
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Filter feedback
  const filteredFeedbacks = parentFeedbacks.filter(feedback => {
    const matchesStatus = filters.status === 'all' || feedback.status === filters.status;
    const matchesType = filters.type === 'all' || feedback.feedbackType === filters.type;
    const matchesPriority = filters.priority === 'all' || feedback.priority.toLowerCase() === filters.priority.toLowerCase();
    return matchesStatus && matchesType && matchesPriority;
  });

  // Calculate statistics
  const stats = {
    total: parentFeedbacks.length,
    pending: parentFeedbacks.filter(f => f.status === 'pending').length,
    reviewed: parentFeedbacks.filter(f => f.status === 'reviewed').length,
    responded: parentFeedbacks.filter(f => f.status === 'responded').length,
    unread: parentFeedbacks.filter(f => !f.isRead).length,
    appreciation: parentFeedbacks.filter(f => f.feedbackType === 'appreciation').length,
    concerns: parentFeedbacks.filter(f => f.feedbackType === 'concern').length,
    suggestions: parentFeedbacks.filter(f => f.feedbackType === 'suggestion').length
  };

  const handleReplyToFeedback = (feedback: ParentFeedback) => {
    setSelectedFeedback(feedback);
    setReplyText(feedback.adminReply || '');
    setShowReplyModal(true);
  };

  const handleSendReply = () => {
    if (!selectedFeedback || !replyText.trim()) {
      toast.error('Please provide a reply message');
      return;
    }

    // Update feedback with reply
    setParentFeedbacks(prev => prev.map(f => 
      f.id === selectedFeedback.id 
        ? { ...f, adminReply: replyText, status: 'responded' as const, isRead: true }
        : f
    ));

    toast.success('Reply sent successfully!');
    setShowReplyModal(false);
    setReplyText('');
    setSelectedFeedback(null);
  };

  const handleMarkAsRead = (feedbackId: number) => {
    setParentFeedbacks(prev => prev.map(f => 
      f.id === feedbackId ? { ...f, isRead: true } : f
    ));
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'appreciation': return <Heart className="w-4 h-4 text-pink-500" />;
      case 'concern': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4 text-blue-500" />;
      case 'complaint_status': return <FileText className="w-4 h-4 text-purple-500" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const statusTabs = [
    { value: 'all', label: 'All', count: stats.total },
    { value: 'pending', label: 'Pending', count: stats.pending },
    { value: 'reviewed', label: 'Reviewed', count: stats.reviewed },
    { value: 'responded', label: 'Responded', count: stats.responded }
  ];

  return (
    <div className="space-y-responsive">
      <div className="space-y-2">
        <h2 className="text-responsive-lg font-semibold text-foreground text-balance">
          Parent Feedback Management
        </h2>
        <p className="text-responsive-sm text-muted-foreground text-balance">
          Monitor and respond to feedback from parents
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-professional">
          <CardContent className="p-4 lg:p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm text-muted-foreground font-medium">Total Feedback</p>
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
                <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm text-muted-foreground font-medium">Unread</p>
                <p className="text-lg lg:text-xl font-bold text-blue-600">{stats.unread}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-4 lg:p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-sm text-muted-foreground font-medium">Responded</p>
                <p className="text-lg lg:text-xl font-bold text-green-600">{stats.responded}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Type Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        <Card className="card-professional">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-responsive-base">
              <BarChart3 className="w-5 h-5 text-primary" />
              Feedback Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600" />
                <span className="text-responsive-sm font-medium text-pink-800">Appreciation</span>
              </div>
              <Badge className="bg-pink-100 text-pink-700 font-semibold">{stats.appreciation}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-responsive-sm font-medium text-orange-800">Concerns</span>
              </div>
              <Badge className="bg-orange-100 text-orange-700 font-semibold">{stats.concerns}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                <span className="text-responsive-sm font-medium text-blue-800">Suggestions</span>
              </div>
              <Badge className="bg-blue-100 text-blue-700 font-semibold">{stats.suggestions}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="card-professional xl:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-responsive-base">
              <TrendingUp className="w-5 h-5 text-primary" />
              Filter Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="appreciation">Appreciation</SelectItem>
                  <SelectItem value="concern">Concern</SelectItem>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="complaint_status">Status Query</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.priority} onValueChange={(value) => setFilters({...filters, priority: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List with Tabs */}
      <Tabs value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
        {/* Desktop Tab List */}
        <TabsList className="hidden sm:grid w-full grid-cols-4 bg-muted/30 p-1 h-auto">
          {statusTabs.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <span className="font-medium text-xs sm:text-sm text-primary">
                {tab.label}
              </span>
              <Badge variant="secondary" className="text-xs bg-background/50">
                {tab.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Mobile Tab Selector */}
        <div className="block sm:hidden mb-4">
          <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
            <SelectTrigger className="w-full bg-muted/30">
              <SelectValue>
                {(() => {
                  const currentTab = statusTabs.find(tab => tab.value === filters.status);
                  return currentTab ? `${currentTab.label} (${currentTab.count})` : 'All Feedback';
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statusTabs.map((tab) => (
                <SelectItem key={tab.value} value={tab.value}>
                  <div className="flex items-center gap-2">
                    <span>{tab.label}</span>
                    <Badge variant="secondary" className="text-xs">
                      {tab.count}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {statusTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4 lg:mt-6">
            {filteredFeedbacks.length === 0 ? (
              <Card className="card-professional">
                <CardContent className="p-8 lg:p-12 text-center">
                  <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-responsive-base font-semibold text-foreground">
                        No feedback found
                      </h3>
                      <p className="text-responsive-sm text-muted-foreground text-balance">
                        No {tab.label.toLowerCase()} feedback at the moment.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredFeedbacks.map((feedback) => (
                  <Card key={feedback.id} className={`card-professional group ${!feedback.isRead ? 'border-l-4 border-l-blue-500' : ''}`}>
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Main Content */}
                        <div className="flex-1 min-w-0 space-y-4">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-muted/30 rounded-lg">
                                {getFeedbackIcon(feedback.feedbackType)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-responsive-sm text-foreground">
                                    {feedback.parentName}
                                  </h3>
                                  {!feedback.isRead && (
                                    <Badge className="bg-blue-100 text-blue-700 text-xs">New</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {feedback.relationship} of {feedback.studentName}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge className={`text-xs font-medium ${
                                feedback.feedbackType === 'appreciation' ? 'bg-pink-100 text-pink-700' :
                                feedback.feedbackType === 'concern' ? 'bg-orange-100 text-orange-700' :
                                feedback.feedbackType === 'suggestion' ? 'bg-blue-100 text-blue-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {feedback.feedbackType.replace('_', ' ')}
                              </Badge>
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

                          {/* Complaint Reference */}
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Related Complaint:</p>
                            <p className="text-sm text-foreground">{feedback.complaintTitle}</p>
                          </div>

                          {/* Message */}
                          <div className="space-y-2">
                            <p className="text-responsive-sm text-foreground text-balance leading-relaxed">
                              {feedback.message}
                            </p>
                          </div>

                          {/* Admin Reply */}
                          {feedback.adminReply && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Reply className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-semibold text-green-700">Admin Reply</span>
                              </div>
                              <p className="text-sm text-green-800 text-balance leading-relaxed">
                                {feedback.adminReply}
                              </p>
                            </div>
                          )}

                          {/* Metadata */}
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(feedback.submittedDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span>{feedback.parentEmail}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row lg:flex-col gap-2 justify-end lg:justify-start">
                          <Button
                            size="sm"
                            onClick={() => handleReplyToFeedback(feedback)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground btn-professional flex items-center gap-2 flex-1 lg:flex-initial"
                          >
                            <Reply className="w-4 h-4" />
                            <span className="hidden sm:inline">
                              {feedback.adminReply ? 'Update Reply' : 'Send Reply'}
                            </span>
                            <span className="sm:hidden">Reply</span>
                          </Button>

                          {!feedback.isRead && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsRead(feedback.id)}
                              className="btn-professional flex items-center gap-2 flex-1 lg:flex-initial"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Mark Read</span>
                              <span className="sm:hidden">Read</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Reply Modal */}
      <Dialog open={showReplyModal} onOpenChange={setShowReplyModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Reply className="w-5 h-5 text-primary" />
              Reply to Parent Feedback
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {selectedFeedback && (
              <>
                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-foreground">
                      {selectedFeedback.parentName} ({selectedFeedback.relationship})
                    </h4>
                    <Badge className={`text-xs ${
                      selectedFeedback.feedbackType === 'appreciation' ? 'bg-pink-100 text-pink-700' :
                      selectedFeedback.feedbackType === 'concern' ? 'bg-orange-100 text-orange-700' :
                      selectedFeedback.feedbackType === 'suggestion' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {selectedFeedback.feedbackType.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Related to: {selectedFeedback.complaintTitle} (Student: {selectedFeedback.studentName})
                  </p>
                  <p className="text-sm text-foreground italic">
                    "{selectedFeedback.message}"
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Your Reply</label>
                  <Textarea
                    placeholder="Type your response to the parent here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSendReply}
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={!replyText.trim()}
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Send Reply
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowReplyModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};