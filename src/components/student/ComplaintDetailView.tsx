import React from 'react';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { CheckCircle, MessageSquare } from 'lucide-react';
import { Complaint } from '../../types';
import { formatDate } from '../../utils/helpers';

interface ComplaintDetailViewProps {
  complaint: Complaint;
}

export const ComplaintDetailView: React.FC<ComplaintDetailViewProps> = ({ complaint }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <p className="text-sm font-medium">{formatDate(complaint.submittedDate)}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Room & Block</Label>
          <p className="text-sm font-medium">{complaint.room}, {complaint.block}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
          <p className="text-sm font-medium">{formatDate(complaint.lastUpdated)}</p>
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
          <Label className="text-sm font-medium text-gray-500">Admin Response</Label>
          <div className="bg-blue-50 p-4 rounded-lg mt-2">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Response from Admin</span>
            </div>
            <p className="text-sm text-blue-800">{complaint.adminReply}</p>
          </div>
        </div>
      )}

      {complaint.status === 'resolved' && (
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Complaint Resolved</span>
          </div>
          <p className="text-sm text-green-700">
            Your complaint has been successfully resolved. If you have any further issues, please submit a new complaint.
          </p>
        </div>
      )}

      {complaint.status === 'pending' && (
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-orange-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-orange-800">Awaiting Response</span>
          </div>
          <p className="text-sm text-orange-700">
            Your complaint is pending review. We will get back to you as soon as possible.
          </p>
        </div>
      )}

      {complaint.status === 'in-progress' && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800">Being Processed</span>
          </div>
          <p className="text-sm text-blue-700">
            Your complaint is currently being worked on. We will update you on the progress.
          </p>
        </div>
      )}
    </div>
  );
};