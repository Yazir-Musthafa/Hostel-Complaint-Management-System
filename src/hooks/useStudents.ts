import { useState, useCallback } from 'react';
import { Student } from '../types';
import { mockStudents } from '../utils/mockData';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [loading, setLoading] = useState(false);

  const addStudent = useCallback(async (studentData: Omit<Student, 'id' | 'complaintsCount'>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStudent: Student = {
        ...studentData,
        id: Math.max(...students.map(s => s.id)) + 1,
        complaintsCount: 0
      };

      setStudents(prev => [...prev, newStudent]);
      return { success: true, student: newStudent };
    } catch (error) {
      return { success: false, error: 'Failed to add student' };
    } finally {
      setLoading(false);
    }
  }, [students]);

  const updateStudent = useCallback(async (id: number, updates: Partial<Student>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStudents(prev => prev.map(student => 
        student.id === id ? { ...student, ...updates } : student
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update student' };
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivateStudent = useCallback(async (id: number) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStudents(prev => prev.map(student => 
        student.id === id ? { ...student, status: 'inactive' as const } : student
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to deactivate student' };
    } finally {
      setLoading(false);
    }
  }, []);

  const activateStudent = useCallback(async (id: number) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStudents(prev => prev.map(student => 
        student.id === id ? { ...student, status: 'active' as const } : student
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to activate student' };
    } finally {
      setLoading(false);
    }
  }, []);

  const getStudentsByBlock = useCallback((block: string) => {
    return students.filter(student => student.block === block);
  }, [students]);

  const searchStudents = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return students.filter(student => 
      student.name.toLowerCase().includes(lowerQuery) ||
      student.email.toLowerCase().includes(lowerQuery) ||
      student.studentId.toLowerCase().includes(lowerQuery) ||
      student.room.toLowerCase().includes(lowerQuery)
    );
  }, [students]);

  return {
    students,
    loading,
    addStudent,
    updateStudent,
    deactivateStudent,
    activateStudent,
    getStudentsByBlock,
    searchStudents
  };
};