import { Complaint, Student } from '../types';

export const mockComplaints: Complaint[] = [
  {
    id: 1,
    title: 'Broken Air Conditioning',
    description: 'The AC unit in my room has stopped working completely. It\'s been 3 days and the room is getting very hot.',
    category: 'Maintenance',
    priority: 'High',
    status: 'pending',
    studentName: 'John Smith',
    room: 'Room 201',
    block: 'Block A',
    submittedDate: '2024-01-15',
    lastUpdated: '2024-01-15',
    statusColor: 'bg-orange-100 text-orange-800',
    priorityColor: 'bg-red-100 text-red-800'
  },
  {
    id: 2,
    title: 'Noise Complaint - Late Night Music',
    description: 'Students in the adjacent room are playing loud music till 2 AM daily. This is affecting my studies and sleep.',
    category: 'Noise',
    priority: 'Medium',
    status: 'in-progress',
    studentName: 'Sarah Johnson',
    room: 'Room 305',
    block: 'Block B',
    submittedDate: '2024-01-14',
    lastUpdated: '2024-01-16',
    statusColor: 'bg-blue-100 text-blue-800',
    priorityColor: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 3,
    title: 'Bathroom Cleaning Issue',
    description: 'The shared bathroom on floor 2 hasn\'t been cleaned properly for a week. There\'s mold growing.',
    category: 'Cleanliness',
    priority: 'High',
    status: 'resolved',
    studentName: 'Mike Chen',
    room: 'Room 102',
    block: 'Block A',
    submittedDate: '2024-01-10',
    lastUpdated: '2024-01-17',
    statusColor: 'bg-green-100 text-green-800',
    priorityColor: 'bg-red-100 text-red-800'
  },
  {
    id: 4,
    title: 'Wi-Fi Connection Problems',
    description: 'Internet connection is very slow and keeps disconnecting. Can\'t attend online classes properly.',
    category: 'Technical',
    priority: 'Medium',
    status: 'pending',
    studentName: 'Emily Davis',
    room: 'Room 403',
    block: 'Block C',
    submittedDate: '2024-01-16',
    lastUpdated: '2024-01-16',
    statusColor: 'bg-orange-100 text-orange-800',
    priorityColor: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 5,
    title: 'Leaking Faucet in Kitchen',
    description: 'The kitchen faucet has been leaking for 2 weeks. Water is being wasted and floor is always wet.',
    category: 'Maintenance',
    priority: 'Low',
    status: 'in-progress',
    studentName: 'David Wilson',
    room: 'Room 205',
    block: 'Block A',
    submittedDate: '2024-01-12',
    lastUpdated: '2024-01-16',
    statusColor: 'bg-blue-100 text-blue-800',
    priorityColor: 'bg-green-100 text-green-800'
  }
];

export const mockStudents: Student[] = [
  { 
    id: 1, 
    name: 'John Smith', 
    email: 'john.smith@email.com', 
    room: 'Room 201', 
    block: 'Block A', 
    studentId: 'STU001', 
    complaintsCount: 2, 
    status: 'active',
    mobile: '+1 234-567-8901'
  },
  { 
    id: 2, 
    name: 'Sarah Johnson', 
    email: 'sarah.j@email.com', 
    room: 'Room 305', 
    block: 'Block B', 
    studentId: 'STU002', 
    complaintsCount: 1, 
    status: 'active',
    mobile: '+1 234-567-8902'
  },
  { 
    id: 3, 
    name: 'Mike Chen', 
    email: 'mike.chen@email.com', 
    room: 'Room 102', 
    block: 'Block A', 
    studentId: 'STU003', 
    complaintsCount: 1, 
    status: 'active',
    mobile: '+1 234-567-8903'
  },
  { 
    id: 4, 
    name: 'Emily Davis', 
    email: 'emily.d@email.com', 
    room: 'Room 403', 
    block: 'Block C', 
    studentId: 'STU004', 
    complaintsCount: 1, 
    status: 'active',
    mobile: '+1 234-567-8904'
  }
];

export const categories = [
  'Maintenance',
  'Cleanliness', 
  'Noise',
  'Security',
  'Technical',
  'Other'
];

export const blocks = [
  'Block A',
  'Block B', 
  'Block C',
  'Block D'
];

export const priorities = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' }
];

export const statuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' }
];