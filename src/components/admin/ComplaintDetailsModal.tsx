import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LoadingButton } from '../shared/LoadingButton';
import { MessageSquare, Edit, CheckCircle } from 'lucide-react';
import { Complaint } from '../../types';
import { toast } from 'sonner';

interface ComplaintDetailsModalProps {
  complaint: Complaint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (id: number, status: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
  onSendReply: (id: number, reply: string) => Promise<{ success: boolean; error?: string }>;
}

export const ComplaintDetailsModal: React.FC<ComplaintDetailsModalProps> = ({
  complaint,
  open,
  onOpenChange,
  onStatusUpdate,
  onSendReply
}) => {
  const [replyText, setReplyText] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reply' | 'status'>('details');

  React.useEffect(() => {
    if (complaint) {
      setNewStatus(complaint.status);
      setReplyText('');
      setStatusNotes('');
      setActiveTab('details');
    }
  }, [complaint]);

  const handleSendReply = async () => {
    if (!complaint || !replyText.trim()) return;

    setLoading(true);
    try {
      const result = await onSendReply(complaint.id, replyText.trim());
      if (result.success) {
        toast.success('Reply sent successfully!');
        setReplyText('');
        setActiveTab('details');
      } else {
        toast.error(result.error || 'Failed to send reply');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!complaint || newStatus === complaint.status) return;

    setLoading(true);
    try {
      const result = await onStatusUpdate(complaint.id, newStatus, statusNotes.trim() || undefined);
      if (result.success) {
        toast.success('Status updated successfully!');
        setStatusNotes('');
        setActiveTab('details');
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!complaint) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complaint Details</DialogTitle>
          <DialogDescription>
            Complete information about this complaint
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { id: 'details', label: 'Details', icon: null },
            { id: 'reply', label: 'Send Reply', icon: MessageSquare },
            { id: 'status', label: 'Update Status', icon: Edit }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'details' | 'reply' | 'status')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Student Name</Label>
                <p className="text-sm font-medium">{complaint.studentName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Room & Block</Label>
                <p className="text-sm font-medium">{complaint.room}, {complaint.block}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Category</Label>
                <p className="text-sm font-medium">{complaint.category}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Priority</Label>
                <Badge className={complaint.priorityColor}>{complaint.priority}</Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <Badge className={complaint.statusColor}>
                  {complaint.status === 'in-progress' ? 'In Progress' : complaint.status}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Submitted Date</Label>
                <p className="text-sm font-medium">{complaint.submittedDate}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Complaint Title</Label>
              <p className="text-sm font-medium">{complaint.title}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Description</Label>
              <p className="text-sm text-gray-700 leading-relaxed">{complaint.description}</p>
            </div>

            {complaint.adminReply && (
              <div>
                <Label className="text-sm font-medium text-gray-500">Previous Reply</Label>
                <div className="bg-blue-50 p-4 rounded-lg mt-2">
                  <p className="text-sm text-blue-800">{complaint.adminReply}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reply' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="reply">Your Reply</Label>
              <Textarea
                id="reply"
                placeholder="Type your reply to the student..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
            
            <div className="text-xs text-gray-500">
              This message will be sent to {complaint.studentName} and visible in their dashboard.
            </div>
            
            <LoadingButton 
              onClick={handleSendReply} 
              loading={loading}
              disabled={!replyText.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Reply
            </LoadingButton>
          </div>
        )}

        {activeTab === 'status' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Update Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this status update..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
            
            <LoadingButton 
              onClick={handleStatusUpdate} 
              loading={loading}
              disabled={newStatus === complaint.status}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Update Status
            </LoadingButton>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};