import { Complaint, ComplaintStats, FilterOptions } from '../types';

export const calculateStats = (complaints: Complaint[]): ComplaintStats => {
  return {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };
};

export const filterComplaints = (complaints: Complaint[], filters: FilterOptions): Complaint[] => {
  return complaints.filter(complaint => {
    const matchesSearch = !filters.search || 
      complaint.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      complaint.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      complaint.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
      complaint.room.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = filters.category === 'all' || complaint.category === filters.category;
    const matchesPriority = filters.priority === 'all' || complaint.priority.toLowerCase() === filters.priority;
    const matchesStatus = filters.status === 'all' || complaint.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-orange-100 text-orange-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const generateId = (): number => {
  return Math.floor(Math.random() * 10000) + 1000;
};

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} weeks ago`;
};