import { useState, useCallback, useMemo, useEffect } from 'react';
import { Complaint, ComplaintFormData, FilterOptions } from '../types';
import { mockComplaints } from '../utils/mockData';
import { calculateStats, filterComplaints, generateId, getStatusColor, getPriorityColor } from '../utils/helpers';

export const useComplaints = () => {
  // Retrieve current user identifier from localStorage
  const getIdentifier = () => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      // Prioritize studentId for isolation, fall back to email if studentId is not available
      return userData.studentId || userData.email || null;
    }
    return null;
  };

  const [currentIdentifier, setCurrentIdentifier] = useState<string | null>(getIdentifier());
  const [complaints, setComplaints] = useState<Complaint[]>([]); // Initialize with empty array
  const [loading, setLoading] = useState(false);

  // Load complaints on mount or when identifier changes
  useEffect(() => {
    const identifier = getIdentifier();
    setCurrentIdentifier(identifier);

    if (identifier) {
      const storedComplaints = localStorage.getItem(`studentComplaints_${identifier}`);
      setComplaints(storedComplaints ? JSON.parse(storedComplaints) : mockComplaints);
    } else {
      // If no identifier, clear complaints or set to mock data
      setComplaints(mockComplaints); // Or [] if you want to clear them
    }
  }, []); // Runs on mount

  // Save complaints to localStorage whenever they change or identifier changes
  useEffect(() => {
    if (currentIdentifier) {
      localStorage.setItem(`studentComplaints_${currentIdentifier}`, JSON.stringify(complaints));
    }
  }, [complaints, currentIdentifier]); // Save when complaints or identifier changes

  const stats = useMemo(() => calculateStats(complaints), [complaints]);

  const addComplaint = useCallback(async (formData: ComplaintFormData) => { // Removed studentName parameter
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ensure currentIdentifier is available before proceeding
      if (!currentIdentifier) {
        console.error("Cannot add complaint: currentIdentifier is not available.");
        return { success: false, error: 'User not identified.' };
      }

      const newComplaint: Complaint = {
        id: generateId(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority as 'High' | 'Medium' | 'Low',
        status: 'pending',
        studentName: currentIdentifier, // Use the dynamically retrieved identifier
        room: formData.room,
        block: formData.block,
        submittedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        statusColor: getStatusColor('pending'),
        priorityColor: getPriorityColor(formData.priority)
      };

      setComplaints(prev => [newComplaint, ...prev]); // State update, localStorage handled by useEffect
      return { success: true, complaint: newComplaint };
    } catch (error) {
      return { success: false, error: 'Failed to submit complaint' };
    } finally {
      setLoading(false);
    }
  }, [currentIdentifier]); // Dependency on currentIdentifier

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
      // localStorage.setItem is handled by useEffect
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update complaint' };
    } finally {
      setLoading(false);
    }
  }, [currentIdentifier]); // Include currentIdentifier in dependency array

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
      // localStorage.setItem is handled by useEffect
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to send reply' };
    } finally {
      setLoading(false);
    }
  }, [currentIdentifier]); // Include currentIdentifier in dependency array

  const deleteComplaint = useCallback(async (id: number) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setComplaints(prev => prev.filter(complaint => complaint.id !== id));
      // localStorage.setItem is handled by useEffect
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete complaint' };
    } finally {
      setLoading(false);
    }
  }, [currentIdentifier]); // Include currentIdentifier in dependency array

  const getFilteredComplaints = useCallback((filters: FilterOptions) => {
    return filterComplaints(complaints, filters);
  }, [complaints]);

  const getComplaintsByStudent = useCallback(() => {
    // Filter complaints based on the current student identifier
    return complaints.filter(complaint => complaint.studentName === currentIdentifier);
  }, [complaints, currentIdentifier]); // Add currentIdentifier as a dependency

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
