import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LoadingButton } from '../shared/LoadingButton';
import { Plus } from 'lucide-react';
import { ComplaintFormData } from '../../types';
import { categories, blocks, priorities } from '../../utils/mockData';

interface SubmitComplaintFormProps {
  onSubmit: (formData: ComplaintFormData) => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
  loading?: boolean;
}

export const SubmitComplaintForm: React.FC<SubmitComplaintFormProps> = ({
  onSubmit,
  onClose,
  loading = false
}) => {
  const [formData, setFormData] = useState<ComplaintFormData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    room: '',
    block: ''
  });

  const [errors, setErrors] = useState<Partial<ComplaintFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ComplaintFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.room.trim()) {
      newErrors.room = 'Room number is required';
    }

    if (!formData.block) {
      newErrors.block = 'Block is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await onSubmit(formData);
    if (result.success) {
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        room: '',
        block: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: keyof ComplaintFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Complaint Title *</Label>
        <Input
          id="title"
          placeholder="Brief title describing the issue"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1">{errors.title}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-600 mt-1">{errors.category}</p>
          )}
        </div>

        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select 
            value={formData.priority} 
            onValueChange={(value) => handleInputChange('priority', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="room">Room Number *</Label>
          <Input
            id="room"
            placeholder="e.g., Room 201"
            value={formData.room}
            onChange={(e) => handleInputChange('room', e.target.value)}
            className={errors.room ? 'border-red-500' : ''}
          />
          {errors.room && (
            <p className="text-sm text-red-600 mt-1">{errors.room}</p>
          )}
        </div>

        <div>
          <Label htmlFor="block">Block *</Label>
          <Select 
            value={formData.block} 
            onValueChange={(value) => handleInputChange('block', value)}
          >
            <SelectTrigger className={errors.block ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select block" />
            </SelectTrigger>
            <SelectContent>
              {blocks.map((block) => (
                <SelectItem key={block} value={block}>
                  {block}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.block && (
            <p className="text-sm text-red-600 mt-1">{errors.block}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Provide detailed description of the issue..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className={`resize-none ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <LoadingButton 
          type="submit" 
          loading={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Submit Complaint
        </LoadingButton>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};