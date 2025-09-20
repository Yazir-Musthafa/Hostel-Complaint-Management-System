import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, Clock, Eye, MessageSquare, CheckCircle } from 'lucide-react';
import { Complaint } from '../../types';
import { formatDate, getTimeAgo } from '../../utils/helpers';

interface ComplaintCardProps {
  complaint: Complaint;
  onViewDetails: (complaint: Complaint) => void;
  onCancel?: (complaintId: number) => void;
  showActions?: boolean;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onViewDetails,
  onCancel,
  showActions = true
}) => {
  const canCancel = complaint.status !== 'resolved' && complaint.status !== 'in-progress';

  return (
    <Card className="card-professional group">
      <CardContent className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">Submitted: {formatDate(complaint.submittedDate)}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">Updated: {getTimeAgo(complaint.lastUpdated)}</span>
              </div>
            </div>

            {/* Admin Reply */}
            {complaint.adminReply && (
              <div className="bg-blue-50 border border-blue-200 p-3 lg:p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-responsive-sm font-semibold text-blue-700">Admin Reply</span>
                </div>
                <p className="text-responsive-sm text-blue-800 text-balance leading-relaxed">
                  {complaint.adminReply}
                </p>
              </div>
            )}

            {/* Resolved Status */}
            {complaint.status === 'resolved' && (
              <div className="bg-green-50 border border-green-200 p-3 lg:p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-responsive-sm font-semibold text-green-700">Complaint Resolved</span>
                </div>
                <p className="text-responsive-sm text-green-700 text-balance leading-relaxed">
                  Your complaint has been successfully resolved. If you have any further issues, please submit a new complaint.
                </p>
              </div>
            )}
          </div>
          
          {/* Actions */}
          {showActions && (
            <div className="flex flex-row sm:flex-col lg:flex-col gap-2 justify-end lg:justify-start">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(complaint)}
                className="flex items-center gap-2 btn-professional flex-1 sm:flex-initial"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline lg:inline">View Details</span>
                <span className="sm:hidden lg:hidden">View</span>
              </Button>
              
              {canCancel && onCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(complaint.id)}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 btn-professional flex-1 sm:flex-initial"
                >
                  <span className="hidden sm:inline lg:inline">Cancel</span>
                  <span className="sm:hidden lg:hidden">Cancel</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};