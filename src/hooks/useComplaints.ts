import { useState, useCallback, useMemo } from 'react';
import { Complaint, ComplaintFormData, FilterOptions } from '../types';
import { mockComplaints } from '../utils/mockData';
import { calculateStats, filterComplaints, generateId, getStatusColor, getPriorityColor } from '../utils/helpers';

export const useComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => calculateStats(complaints), [complaints]);

  const addComplaint = useCallback(async (formData: ComplaintFormData, studentName: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newComplaint: Complaint = {
        id: generateId(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority as 'High' | 'Medium' | 'Low',
        status: 'pending',
        studentName,
        room: formData.room,
        block: formData.block,
        submittedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        statusColor: getStatusColor('pending'),
        priorityColor: getPriorityColor(formData.priority)
      };

      setComplaints(prev => [newComplaint, ...prev]);
      return { success: true, complaint: newComplaint };
    } catch (error) {
      return { success: false, error: 'Failed to submit complaint' };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateComplaintStatus = useCallback(async (id: number, newStatus: string, notes?: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setComplaints(prev => prev.map(complaint => 
        complaint.id === id 
          ? { 
              ...complaint, 
              status: newStatus as 'pending' | 'in-progress' | 'resolved',
              lastUpdated: new Date().toISOString().split('T')[0],
              statusColor: getStatusColor(newStatus),
              adminReply: notes || complaint.adminReply
            }
          : complaint
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update complaint' };
    } finally {
      setLoading(false);
    }
  }, []);

  const addReply = useCallback(async (id: number, reply: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setComplaints(prev => prev.map(complaint => 
        complaint.id === id 
          ? { 
              ...complaint, 
              adminReply: reply,
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : complaint
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to send reply' };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteComplaint = useCallback(async (id: number) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setComplaints(prev => prev.filter(complaint => complaint.id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete complaint' };
    } finally {
      setLoading(false);
    }
  }, []);

  const getFilteredComplaints = useCallback((filters: FilterOptions) => {
    return filterComplaints(complaints, filters);
  }, [complaints]);

  const getComplaintsByStudent = useCallback((studentName: string) => {
    return complaints.filter(complaint => complaint.studentName === studentName);
  }, [complaints]);

  return {
    complaints,
    stats,
    loading,
    addComplaint,
    updateComplaintStatus,
    addReply,
    deleteComplaint,
    getFilteredComplaints,
    getComplaintsByStudent
  };
};