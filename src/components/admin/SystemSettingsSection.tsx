import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { LoadingButton } from '../shared/LoadingButton';
import ConfirmDialog from '../shared/ConfirmDialog';
import { 
  Settings, 
  Mail, 
  RefreshCw, 
  Users, 
  Download, 
  UserPlus, 
  Trash2,
  Shield,
  Bell,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

export const SystemSettingsSection: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ 
    open: boolean; 
    action: string; 
    title: string; 
    description: string; 
  }>({
    open: false,
    action: '',
    title: '',
    description: ''
  });

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    hostelName: 'Student Hostel Complex',
    adminEmail: 'admin@hostel.com',
    maxResponseTime: '24'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    priorityAlerts: true,
    dailySummary: true,
    smsAlerts: false
  });

  const handleSaveGeneral = async () => {
    setLoading('general');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('General settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save general settings');
    } finally {
      setLoading(null);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading('notifications');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Notification settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save notification settings');
    } finally {
      setLoading(null);
    }
  };

  const handleSystemAction = async (action: string) => {
    setLoading(action);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      switch (action) {
        case 'backup':
          // Create mock backup file
          const backupData = {
            timestamp: new Date().toISOString(),
            complaints: 'backup_data',
            users: 'backup_data',
            settings: generalSettings
          };
          const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `hostel_backup_${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          toast.success('Database backup created and downloaded!');
          break;
          
        case 'clearCache':
          toast.success('System cache cleared successfully!');
          break;
          
        case 'archiveComplaints':
          toast.success('Old complaints archived successfully!');
          break;
          
        case 'bulkAddStudents':
          toast.success('Bulk student import feature coming soon!');
          break;
          
        case 'exportUsers':
          const userData = 'Student ID,Name,Email,Room,Block,Status\nSTU001,John Smith,john@email.com,201,Block A,Active\nSTU002,Sarah Johnson,sarah@email.com,305,Block B,Active';
          const userBlob = new Blob([userData], { type: 'text/csv' });
          const userUrl = window.URL.createObjectURL(userBlob);
          const userA = document.createElement('a');
          userA.href = userUrl;
          userA.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(userA);
          userA.click();
          document.body.removeChild(userA);
          window.URL.revokeObjectURL(userUrl);
          toast.success('User data exported successfully!');
          break;
          
        default:
          toast.info('Action completed!');
      }
    } catch (error) {
      toast.error(`Failed to ${action}`);
    } finally {
      setLoading(null);
      setConfirmAction({ open: false, action: '', title: '', description: '' });
    }
  };

  const showConfirmDialog = (action: string, title: string, description: string) => {
    setConfirmAction({ open: true, action, title, description });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">System Settings</h2>
        <p className="text-gray-600">Configure system preferences and manage application settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hostelName">Hostel Name</Label>
              <Input 
                id="hostelName" 
                value={generalSettings.hostelName}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, hostelName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input 
                id="adminEmail" 
                type="email" 
                value={generalSettings.adminEmail}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="maxPriority">Max Priority Response Time (hours)</Label>
              <Input 
                id="maxPriority" 
                type="number" 
                value={generalSettings.maxResponseTime}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, maxResponseTime: e.target.value }))}
              />
            </div>
            <LoadingButton 
              className="w-full bg-blue-600 hover:bg-blue-700"
              loading={loading === 'general'}
              onClick={handleSaveGeneral}
            >
              <Settings className="w-4 h-4 mr-2" />
              Save General Settings
            </LoadingButton>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email alerts for new complaints</p>
              </div>
              <Switch 
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked: boolean) => 
                  setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Priority Alerts</p>
                <p className="text-sm text-gray-600">Instant alerts for high priority complaints</p>
              </div>
              <Switch 
                checked={notificationSettings.priorityAlerts}
                onCheckedChange={(checked: boolean) => 
                  setNotificationSettings(prev => ({ ...prev, priorityAlerts: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Summary</p>
                <p className="text-sm text-gray-600">Daily report of complaint statistics</p>
              </div>
              <Switch 
                checked={notificationSettings.dailySummary}
                onCheckedChange={(checked: boolean) => 
                  setNotificationSettings(prev => ({ ...prev, dailySummary: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Alerts</p>
                <p className="text-sm text-gray-600">SMS notifications for urgent matters</p>
              </div>
              <Switch 
                checked={notificationSettings.smsAlerts}
                onCheckedChange={(checked: boolean) => 
                  setNotificationSettings(prev => ({ ...prev, smsAlerts: checked }))
                }
              />
            </div>
            <LoadingButton 
              className="w-full bg-blue-600 hover:bg-blue-700"
              loading={loading === 'notifications'}
              onClick={handleSaveNotifications}
            >
              <Bell className="w-4 h-4 mr-2" />
              Save Notification Settings
            </LoadingButton>
          </CardContent>
        </Card>

        {/* System Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoadingButton 
              variant="outline" 
              className="w-full flex items-center gap-2"
              loading={loading === 'backup'}
              onClick={() => handleSystemAction('backup')}
            >
              <Download className="w-4 h-4" />
              Backup Database
            </LoadingButton>
            
            <LoadingButton 
              variant="outline" 
              className="w-full flex items-center gap-2"
              loading={loading === 'clearCache'}
              onClick={() => handleSystemAction('clearCache')}
            >
              <RefreshCw className="w-4 h-4" />
              Clear Cache
            </LoadingButton>
            
            <LoadingButton 
              variant="outline" 
              className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              loading={loading === 'archiveComplaints'}
              onClick={() => showConfirmDialog(
                'archiveComplaints', 
                'Archive Old Complaints', 
                'This will archive complaints older than 6 months. Archived complaints can still be viewed but will be moved to a separate storage.'
              )}
            >
              <Trash2 className="w-4 h-4" />
              Archive Old Complaints
            </LoadingButton>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <p className="font-medium text-blue-900">System Statistics</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">Total Users</p>
                  <p className="text-xl font-bold text-blue-900">1,247</p>
                </div>
                <div>
                  <p className="text-blue-700">Active Today</p>
                  <p className="text-xl font-bold text-blue-900">342</p>
                </div>
              </div>
            </div>
            
            <LoadingButton 
              variant="outline" 
              className="w-full flex items-center gap-2"
              loading={loading === 'bulkAddStudents'}
              onClick={() => handleSystemAction('bulkAddStudents')}
            >
              <UserPlus className="w-4 h-4" />
              Bulk Add Students
            </LoadingButton>
            
            <LoadingButton 
              variant="outline" 
              className="w-full flex items-center gap-2"
              loading={loading === 'exportUsers'}
              onClick={() => handleSystemAction('exportUsers')}
            >
              <Download className="w-4 h-4" />
              Export User Data
            </LoadingButton>
          </CardContent>
        </Card>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmAction.open}
        onClose={() => setConfirmAction(prev => ({ ...prev, open: false }))}
        title={confirmAction.title}
        description={confirmAction.description}
        onConfirm={() => handleSystemAction(confirmAction.action)}
      />
    </div>
  );
};
