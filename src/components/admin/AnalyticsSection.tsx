import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { LoadingButton } from '../shared/LoadingButton';
import { 
  TrendingUp, 
  Clock, 
  Calendar, 
  Download, 
  FileSpreadsheet, 
  FileText,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

export const AnalyticsSection: React.FC = () => {
  const [downloadLoading, setDownloadLoading] = useState<string | null>(null);

  const monthlyData = [
    { month: 'Jan', complaints: 12, resolved: 10 },
    { month: 'Feb', complaints: 8, resolved: 7 },
    { month: 'Mar', complaints: 15, resolved: 12 },
    { month: 'Apr', complaints: 5, resolved: 5 },
  ];

  const handleDownload = async (reportType: string) => {
    setDownloadLoading(reportType);
    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would generate and download the actual file
      const fileName = `${reportType.toLowerCase().replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      
      // Create mock CSV content
      let csvContent = '';
      if (reportType === 'Monthly Report') {
        csvContent = 'Month,Complaints,Resolved,Resolution Rate\n';
        monthlyData.forEach(data => {
          const rate = Math.round((data.resolved / data.complaints) * 100);
          csvContent += `${data.month} 2024,${data.complaints},${data.resolved},${rate}%\n`;
        });
      } else if (reportType === 'Category Analysis') {
        csvContent = 'Category,Count,Percentage\n';
        csvContent += 'Maintenance,15,30%\n';
        csvContent += 'Technical,12,24%\n';
        csvContent += 'Cleanliness,10,20%\n';
        csvContent += 'Noise,8,16%\n';
        csvContent += 'Security,5,10%\n';
      } else {
        csvContent = 'Student ID,Name,Complaints Count,Last Complaint Date\n';
        csvContent += 'STU001,John Smith,2,2024-01-15\n';
        csvContent += 'STU002,Sarah Johnson,1,2024-01-14\n';
        csvContent += 'STU003,Mike Chen,1,2024-01-10\n';
      }

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`${reportType} downloaded successfully!`);
    } catch (error) {
      toast.error(`Failed to download ${reportType}`);
    } finally {
      setDownloadLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Analytics & Reports</h2>
        <p className="text-gray-600">Comprehensive insights into complaint patterns and resolution efficiency</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolution Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
              <p className="text-sm text-gray-600">Complaints resolved this month</p>
              <div className="mt-4 bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Target: 90% | Previous month: 78%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Response Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2.5</div>
              <p className="text-sm text-gray-600">Days average response time</p>
              <div className="mt-4 flex justify-center">
                <Badge className="bg-blue-100 text-blue-800">Improved by 30%</Badge>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Target: 2 days | Previous month: 3.6 days
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Monthly Complaint Trends
          </CardTitle>
          <p className="text-sm text-gray-600">Track complaint volume and resolution over time</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((data, index) => {
              const resolutionRate = Math.round((data.resolved / data.complaints) * 100);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{data.month} 2024</p>
                      <p className="text-sm text-gray-600">{data.complaints} complaints</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{data.resolved} resolved</p>
                    <p className="text-sm text-gray-600">{resolutionRate}% success rate</p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${resolutionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Reports
          </CardTitle>
          <p className="text-sm text-gray-600">Download detailed reports for analysis</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <LoadingButton
              variant="outline"
              className="flex items-center justify-center gap-2"
              loading={downloadLoading === 'Monthly Report'}
              onClick={() => handleDownload('Monthly Report')}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Monthly Report
            </LoadingButton>
            
            <LoadingButton
              variant="outline"
              className="flex items-center justify-center gap-2"
              loading={downloadLoading === 'Category Analysis'}
              onClick={() => handleDownload('Category Analysis')}
            >
              <BarChart3 className="w-4 h-4" />
              Category Analysis
            </LoadingButton>
            
            <LoadingButton
              variant="outline"
              className="flex items-center justify-center gap-2"
              loading={downloadLoading === 'Student Data'}
              onClick={() => handleDownload('Student Data')}
            >
              <FileText className="w-4 h-4" />
              Student Data
            </LoadingButton>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Reports are generated in CSV format and include data from the last 30 days. 
              For custom date ranges, please contact the system administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};