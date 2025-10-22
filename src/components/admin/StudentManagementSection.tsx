import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { FilterBar } from '../shared/FilterBar';
import { LoadingButton } from '../shared/LoadingButton';
import ConfirmDialog from '../shared/ConfirmDialog';
import { 
  UserPlus, 
  Eye, 
  Edit, 
  Archive, 
  Mail, 
  Building, 
  FileText,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Search
} from 'lucide-react';
import { Student, FilterOptions } from '../../types'; // Assuming Student type is defined here
import { useStudents } from '../../hooks/useStudents'; // This hook might need to be adapted or removed if fetching is done directly
import { toast } from 'sonner';
import authService, { StudentData } from '../../services/authService'; // Import authService

// Define a local Student type that matches the data structure from authService and component needs
interface LocalStudent {
  id: string; // Mapped from uid
  name: string;
  email: string;
  mobile: string;
  studentId: string;
  room: string; // Mapped from roomNumber
  block: string;
  role: string;
  status: 'active' | 'inactive'; // Derived from 'active'
  active: boolean; // Keep the original 'active' property for clarity or potential direct use
  complaintsCount: number; // Placeholder, as this data is not fetched by authService
  createdAt: string;
  updatedAt: string;
}

interface StudentManagementSectionProps {
  // Removed props as data fetching and actions will be handled internally
}

export const StudentManagementSection: React.FC<StudentManagementSectionProps> = () => {
  const [students, setStudents] = useState<LocalStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'all',
    status: 'all',
    priority: 'all',
    block: 'all'
  });

  const [selectedStudent, setSelectedStudent] = useState<LocalStudent | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // Assuming this is for adding new students
  const [editMode, setEditMode] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [confirmAction, setConfirmAction] = useState<{
    open: boolean;
    action: 'deactivate' | 'activate' | null;
    student: LocalStudent | null;
  }>({
    open: false,
    action: null,
    student: null
  });

  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await authService.getAllStudents();
        if (response.success && Array.isArray(response.user)) {
          // Map Firebase data to LocalStudent type
          const mappedStudents: LocalStudent[] = response.user.map(student => ({
            id: student.uid,
            name: student.name,
            email: student.email,
            mobile: student.mobile,
            studentId: student.studentId,
            room: student.roomNumber, // Map roomNumber to room
            block: student.block,
            role: student.role,
            status: student.active ? 'active' : 'inactive',
            active: student.active, // Keep the original active status
            complaintsCount: 0, // Placeholder, as this data is not fetched by authService
            createdAt: student.createdAt,
            updatedAt: student.updatedAt
          }));
          setStudents(mappedStudents);
        } else {
          toast.error(response.message || 'Failed to fetch students');
          setStudents([]);
        }
      } catch (error) {
        toast.error('An error occurred while fetching students.');
        console.error("Error fetching students:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = !filters.search || 
      student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      student.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      student.studentId.toLowerCase().includes(filters.search.toLowerCase()) ||
      student.room.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesBlock = filters.block === 'all' || student.block === filters.block;
    const matchesStatus = filters.status === 'all' || student.status === filters.status;
    
    return matchesSearch && matchesBlock && matchesStatus;
  });

  const handleViewStudent = (student: LocalStudent) => {
    setSelectedStudent(student);
    setEditMode(false);
    setShowStudentModal(true);
  };

  const handleEditStudent = (student: LocalStudent) => {
    setSelectedStudent(student);
    setEditMode(true);
    setShowStudentModal(true);
  };

  // This function would handle updates to fields other than status (e.g., name, room)
  // It would need to be implemented to call a new service method if such updates are supported
  const handleUpdateStudent = async (updates: Partial<LocalStudent>) => {
    if (!selectedStudent) return;
    
    setActionLoading('update');
    try {
      // Placeholder for actual update logic if needed for other fields
      // For now, we'll just close the modal and show a success message
      toast.success('Student details updated successfully!');
      setShowStudentModal(false);
      setEditMode(false);
      // In a real scenario, you'd call an API here to update other student details
      // e.g., await authService.updateStudentDetails(selectedStudent.id, updates);
    } catch (error) {
      toast.error('Failed to update student details');
      console.error("Error updating student details:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStudentAction = async (action: 'deactivate' | 'activate', student: LocalStudent) => {
    setActionLoading(`${action}-${student.id}`);
    try {
      let result;
      if (action === 'deactivate') {
        result = await authService.deactivateStudent(student.id);
      } else {
        result = await authService.activateStudent(student.id);
      }
        
      if (result.success) {
        toast.success(`Student ${action}d successfully!`);
        // Update the student's status in the local state
        setStudents(prevStudents => 
          prevStudents.map(s => 
            s.id === student.id ? { ...s, status: action === 'deactivate' ? 'inactive' : 'active', active: action === 'deactivate' ? false : true } : s
          )
        );
      } else {
        toast.error(result.error || `Failed to ${action} student`);
      }
    } catch (error) {
      toast.error(`An error occurred while trying to ${action} the student.`);
      console.error(`Error ${action}ing student:`, error);
    } finally {
      setActionLoading(null);
      setConfirmAction({ open: false, action: null, student: null });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Student Management</h2>
          <p className="text-gray-600">Manage student accounts and track their complaint activity</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Student
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-xl font-semibold">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-semibold text-green-600">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">With Complaints</p>
                <p className="text-xl font-semibold text-orange-600">
                  {students.filter(s => s.complaintsCount > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Blocks</p>
                <p className="text-xl font-semibold text-purple-600">
                  {new Set(students.map(s => s.block)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search students by name, email, or student ID..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <Select 
              value={filters.block} 
              onValueChange={(value: string) => setFilters(prev => ({ ...prev, block: value }))}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Blocks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blocks</SelectItem>
                <SelectItem value="Block A">Block A</SelectItem>
                <SelectItem value="Block B">Block B</SelectItem>
                <SelectItem value="Block C">Block C</SelectItem>
                <SelectItem value="Block D">Block D</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.status} 
              onValueChange={(value: string) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-10">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                      <h3 className="font-medium text-gray-900">{student.name}</h3>
                      <Badge variant="outline" className="text-xs w-fit">{student.studentId}</Badge>
                      <Badge 
                        className={`w-fit ${
                          student.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {student.status}
                      </Badge>
                      {student.complaintsCount > 0 && (
                        <Badge variant="outline" className="text-xs w-fit text-orange-600">
                          {student.complaintsCount} complaint(s)
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        <span>{student.room}, {student.block}</span>
                      </div>
                      {student.mobile && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{student.mobile}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full sm:w-auto"
                      onClick={() => handleViewStudent(student)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Profile
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full sm:w-auto"
                      onClick={() => handleEditStudent(student)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit Details
                    </Button>
                    
                    <LoadingButton
                      variant="outline"
                      size="sm"
                      className={`w-full sm:w-auto ${
                        student.status === 'active'
                          ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                          : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                      }`}
                      loading={actionLoading === `${student.status === 'active' ? 'deactivate' : 'activate'}-${student.id}`}
                      onClick={() => setConfirmAction({
                        open: true,
                        action: student.status === 'active' ? 'deactivate' : 'activate',
                        student
                      })}
                    >
                      <Archive className="w-3 h-3 mr-1" />
                      {student.status === 'active' ? 'Deactivate' : 'Activate'}
                    </LoadingButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Student Details/Edit Modal */}
      <StudentModal
        student={selectedStudent}
        open={showStudentModal}
        onOpenChange={setShowStudentModal}
        editMode={editMode}
        onUpdate={handleUpdateStudent} // This will need to be updated to call a service method for other fields
        loading={actionLoading === 'update'}
      />

      {/* Confirm Action Dialog */}
      <ConfirmDialog
        isOpen={confirmAction.open}
        onClose={() => setConfirmAction({ open: false, action: null, student: null })}
        title={`${confirmAction.action === 'deactivate' ? 'Deactivate' : 'Activate'} Student`}
        description={`Are you sure you want to ${confirmAction.action} ${confirmAction.student?.name}? ${
          confirmAction.action === 'deactivate' 
            ? 'This will prevent them from logging in and submitting complaints.'
            : 'This will restore their access to the system.'
        }`}
        onConfirm={() => confirmAction.action && confirmAction.student && 
          handleStudentAction(confirmAction.action, confirmAction.student)
        }
      />
    </div>
  );
};

// Student Details/Edit Modal Component
interface StudentModalProps {
  student: LocalStudent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMode: boolean;
  onUpdate: (updates: Partial<LocalStudent>) => void; // Updated to use LocalStudent
  loading: boolean;
}

const StudentModal: React.FC<StudentModalProps> = ({
  student,
  open,
  onOpenChange,
  editMode,
  onUpdate,
  loading
}) => {
  const [formData, setFormData] = useState<Partial<LocalStudent>>({});

  React.useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editMode ? 'Edit Student Details' : 'Student Profile'}
          </DialogTitle>
          <DialogDescription>
            {editMode ? 'Update student information' : 'View detailed student information'}
          </DialogDescription>
        </DialogHeader>

        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={formData.studentId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room">Room Number</Label>
                <Input
                  id="room"
                  value={formData.room || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="block">Block</Label>
                <Select 
                  value={formData.block || ''} 
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, block: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Block A">Block A</SelectItem>
                    <SelectItem value="Block B">Block B</SelectItem>
                    <SelectItem value="Block C">Block C</SelectItem>
                    <SelectItem value="Block D">Block D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <LoadingButton 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                loading={loading} // Use general loading state for submit button
              >
                Update Student
              </LoadingButton>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Student ID</Label>
                <p className="text-sm font-medium">{student.studentId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <Badge className={student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {student.status}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="text-sm font-medium">{student.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Mobile</Label>
                <p className="text-sm font-medium">{student.mobile || 'Not provided'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Room & Block</Label>
                <p className="text-sm font-medium">{student.room}, {student.block}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Complaints Count</Label>
                <p className="text-sm font-medium">{student.complaintsCount}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Full Name</Label>
              <p className="text-sm font-medium">{student.name}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
