export interface User {
  id?: string;
  name: string;
  email: string;
  mobile?: string;
  room?: string;
  block?: string;
  studentId?: string;
  parentId?: string;
  relationship?: 'Father' | 'Mother' | 'Guardian';
  role?: 'admin' | 'student' | 'parent';
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'in-progress' | 'resolved';
  studentName: string;
  room: string;
  block: string;
  submittedDate: string;
  lastUpdated: string;
  statusColor: string;
  priorityColor: string;
  adminReply?: string;
}

export interface ComplaintFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  room: string;
  block: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  room: string;
  block: string;
  studentId: string;
  complaintsCount: number;
  status: 'active' | 'inactive';
  mobile?: string;
}

export interface ComplaintStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

export interface FilterOptions {
  search: string;
  category: string;
  status: string;
  priority: string;
  block: string;
}

export interface ParentFeedback {
  id: number;
  parentName: string;
  parentEmail: string;
  relationship: 'Father' | 'Mother' | 'Guardian';
  complaintId: number;
  complaintTitle: string;
  studentName: string;
  feedbackType: 'appreciation' | 'concern' | 'suggestion' | 'complaint_status';
  message: string;
  priority: 'High' | 'Medium' | 'Low';
  submittedDate: string;
  status: 'pending' | 'reviewed' | 'responded';
  adminReply?: string;
  isRead: boolean;
}