'use client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Home,
  Bell,
  Users,
  BarChart2,
  FileText,
  Database,
  Settings,
  Upload,
  Eye,
  Download,
  Trash2,
  Option,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';

interface FileList {
  fileName: string;
  url: string;
  date: string;
  status: string;
  _id: string;
}

interface EmployeeData {
  id: string;
  name: string;
  email: string;
  phoneNo: string;
  department: string;
  designation: string;
  password: string;
  role: string;
  isVerified: boolean;
  isOtpVerified: boolean;
  totalMessages: number;
  totalSessions: number;
  averageResponseTime: number;
  lastActiveAt: string;
  engagementScore: number;
  sentimentStats: {
    positive: number;
    negative: number;
    neutral: number;
  };
}
const sampleChartData = [
  { name: 'Jan', value: 320 },
  { name: 'Feb', value: 450 },
  { name: 'Mar', value: 580 },
  { name: 'Apr', value: 720 },
  { name: 'May', value: 680 },
  { name: 'Jun', value: 800 },
];

const sampleAlerts = [
  {
    id: 1,
    title: 'High Attrition Risk',
    description: 'Marketing department shows increased attrition risk',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Low Engagement',
    description: 'R&D team has shown decreased engagement',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Negative Sentiment Detected',
    description: 'Recent communications in Accounts show negative sentiment',
    priority: 'low',
  },
  {
    id: 4,
    title: 'High Workload',
    description: 'Employee Vivek Gupta from IT reported high workload',
    priority: 'high',
  },
  {
    id: 5,
    title: 'Low Productivity',
    description: 'Team in Marketing has shown decreased productivity',
    priority: 'medium',
  },
  {
    id: 6,
    title: 'Positive Sentiment Detected',
    description: 'Recent communications in Accounts show positive sentiment',
    priority: 'low',
  },
  {
    id: 7,
    title: 'Low Satisfaction',
    description: 'Employee Rahul has reported low satisfaction',
    priority: 'medium',
  },
];

const sampleEmployees = [
  {
    id: 1,
    name: 'Dinesh Kumar',
    department: 'Marketing',
    engagementScore: 65,
    sentiment: 'Neutral',
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    department: 'R&D',
    engagementScore: 70,
    sentiment: 'Positive',
  },
  {
    id: 3,
    name: 'Vivek Gupta',
    department: 'IT',
    engagementScore: 85,
    sentiment: 'Very Positive',
  },
  {
    id: 4,
    name: 'Anjali Mehta',
    department: 'Accounts',
    engagementScore: 60,
    sentiment: 'Negative',
  },
  {
    id: 5,
    name: 'Priya Singh',
    department: 'HR',
    engagementScore: 72,
    sentiment: 'Neutral',
  },
  {
    id: 6,
    name: 'Arjun Patel',
    department: 'IT',
    engagementScore: 90,
    sentiment: 'Very Positive',
  },
  {
    id: 7,
    name: 'Neha Verma',
    department: 'Marketing',
    engagementScore: 68,
    sentiment: 'Positive',
  },
];

const sampleFiles = [
  {
    id: 1,
    name: 'IT_Policy.pdf',
    uploadDate: '2023-06-15',
    status: 'Processed',
  },
  {
    id: 2,
    name: 'HR_Policy.pdf',
    uploadDate: '2023-06-10',
    status: 'Processing',
  },
  {
    id: 3,
    name: 'Marketing_Strategy.docx',
    uploadDate: '2023-06-05',
    status: 'Processed',
  },
  {
    id: 4,
    name: 'Q1_Financials.pdf',
    uploadDate: '2023-06-01',
    status: 'Processed',
  },
  {
    id: 5,
    name: 'Employee_Code_Of_Conduct.pdf',
    uploadDate: '2023-05-30',
    status: 'Processing',
  },
  {
    id: 6,
    name: 'Annual_Report.pptx',
    uploadDate: '2023-05-25',
    status: 'Processed',
  },
  {
    id: 7,
    name: 'Product_Details.docx',
    uploadDate: '2023-05-20',
    status: 'Processed',
  },
  {
    id: 8,
    name: 'Q3_Sales_Forecast.xlsx',
    uploadDate: '2023-05-15',
    status: 'Processing',
  },
  {
    id: 9,
    name: 'Employee_Feedback_Results.pdf',
    uploadDate: '2023-05-10',
    status: 'Processed',
  },
  {
    id: 10,
    name: 'Project_Roadmap.docx',
    uploadDate: '2023-05-05',
    status: 'Processed',
  },
];

export default function DashboardUI() {
  const [activeTab, setActiveTab] = useState('overview'); // State for managing active tab

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState<FileList[] | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/pdftemp', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploadStatus('File uploaded successfully.');
        setFileUrl(data.fileUrl);
      } else {
        setUploadStatus(data.error);
      }
    } catch (error) {
      setUploadStatus('An error occurred while uploading the file.');
    }
  };
  const fetchFiles = async () => {
    const response = await fetch('/api/fileFetch');
    const data = await response.json();
    setFileList(data.document);
  };

  const fetchEmployees = async () => {
    const response = await fetch('/api/employeeDetails');
    const data = await response.json();
    console.log('data', data);
    setEmployeeData(data);
  };

  useEffect(() => {
    fetchFiles();
    fetchEmployees();
  }, []);

  console.log('ep', employeeData);
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-stone-950 border-r border-stone-800 flex flex-col">
        <div className="p-4 border-b border-stone-800">
          <h1 className="text-2xl font-bold text-yellow-400">Clarity</h1>
        </div>
        <ScrollArea className="flex-grow">
          <nav className="p-4 space-y-2">
            {[
              {
                icon: <BarChart2 className="h-4 w-4" />,
                label: 'Overview',
                value: 'overview',
              },
              {
                icon: <Bell className="h-4 w-4" />,
                label: 'Alerts',
                value: 'alerts',
              },
              {
                icon: <Users className="h-4 w-4" />,
                label: 'Employee Metrics',
                value: 'employees',
              },
              {
                icon: <FileText className="h-4 w-4" />,
                label: 'File Management',
                value: 'files',
              },
              {
                icon: <Database className="h-4 w-4" />,
                label: 'Processed Data',
                value: 'data',
              },
              {
                icon: <Settings className="h-4 w-4" />,
                label: 'Settings',
                value: 'settings',
              },
            ].map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`w-full justify-start text-white hover:bg-yellow-400 ${
                  activeTab === item.value ? 'bg-yellow-400 text-black' : ''
                }`}
                onClick={() => setActiveTab(item.value)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-stone-950 border-b border-stone-800 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search..."
              className="w-64 bg-stone-900 text-white border-stone-700 placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400"
            />
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Dashboard Content */}
        <ScrollArea className="flex-grow p-6">
          {/* Render Content Based on Active Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Total Employees', value: '1,234' },
                  { title: 'Active Users', value: '987' },
                  { title: 'Alerts Count', value: '15' },
                  { title: 'Files Processed', value: '56' },
                ].map((stat, index) => (
                  <Card key={index} className="bg-stone-900 border-stone-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-yellow-400">
                        {stat.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {stat.value}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="bg-stone-900 border-stone-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Employee Engagement Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sampleChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#ffffff" />
                      <YAxis stroke="#ffffff" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#facc15',
                          borderColor: '#facc15',
                          color: 'white',
                        }}
                      />
                      <Bar dataKey="value" fill="#ffffff" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <Card className="bg-stone-900 border-stone-800">
                <CardHeader>
                  <CardTitle className="text-yellow-400">
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-yellow-400">Title</TableHead>
                        <TableHead className="text-yellow-400">
                          Description
                        </TableHead>
                        <TableHead className="text-yellow-400">
                          Priority
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleAlerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell className="text-white">
                            {alert.title}
                          </TableCell>
                          <TableCell className="text-white">
                            {alert.description}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                alert.priority === 'high'
                                  ? 'destructive'
                                  : alert.priority === 'medium'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {alert.priority}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'employees' && (
            <div className="space-y-6">
              <Card className="bg-stone-900 border-stone-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-yellow-400">
                    Employee Metrics
                  </CardTitle>
                  <Input
                    type="text"
                    placeholder="Search employees..."
                    className="w-64 bg-stone-900 text-white border-stone-700 placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-yellow-400">Name</TableHead>
                        <TableHead className="text-yellow-400">
                          Department
                        </TableHead>
                        <TableHead className="text-yellow-400">
                          Engagement Score
                        </TableHead>
                        <TableHead className="text-yellow-400">
                          Sentiment
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employeeData?.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="text-white ">
                            {employee.name}
                          </TableCell>
                          <TableCell className="text-white">
                            {employee.department}
                          </TableCell>
                          <TableCell className="text-white">
                            {employee.engagementScore}
                          </TableCell>
                          <TableCell className="text-white">
                            {(() => {
                              const { positive, negative, neutral } =
                                employee.sentimentStats;
                              const highestSentiment = Math.max(
                                positive,
                                negative,
                                neutral
                              );
                              return highestSentiment === positive
                                ? 'Positive'
                                : highestSentiment === negative
                                ? 'Negative'
                                : 'Neutral';
                            })()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-6">
              <Card className="bg-stone-900 border-stone-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-yellow-400">
                    File Management
                  </CardTitle>
                  <div className='flex '>
                    <Button
                      className="bg-yellow-400 hover:bg-yellow-500 text-black"
                      onClick={handleUpload}
                      disabled={!selectedFile}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                    <div>
                      <Button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black ml-2 flex items-center"
                        onClick={() => fileInputRef.current?.click()} // Manually trigger file input
                      >
                        <Option className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        ref={fileInputRef} // Reference to input element
                        onChange={handleFileChange}
                        className="hidden" // Hide the default input
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-yellow-400">
                          File Name
                        </TableHead>
                        <TableHead className="text-yellow-400">
                          Upload Date
                        </TableHead>
                        <TableHead className="text-yellow-400">
                          Status
                        </TableHead>
                        <TableHead className="text-yellow-400">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fileList?.map((file, idx) => (
                        <TableRow key={file._id}>
                          <TableCell className="text-white">
                            {file.fileName}
                          </TableCell>
                          <TableCell className="text-white">
                            {new Date(file.date).toLocaleDateString('en-GB')}
                          </TableCell>
                          <TableCell className="text-white">
                            {file.status}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Link href={file.url}>
                                  <Eye className="h-4 w-4 text-yellow-400" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 text-yellow-400" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <Card className="bg-stone-900 border-stone-800">
                <CardHeader>
                  <CardTitle className="text-yellow-400">
                    AI-Processed Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Document Summarization Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-yellow-400">
                        Document Summarization
                      </h3>
                      <p className="text-gray-400">
                        The IT_Policy.pdf and HR_Policy.pdf were analyzed to
                        provide a summarized overview of the key points for
                        better understanding and quicker access.
                      </p>
                      <ul className="list-disc list-inside text-gray-400 mt-2">
                        <li>
                          IT Policy: Focus on cybersecurity measures and data
                          privacy.
                        </li>
                        <li>
                          HR Policy: Emphasis on employee welfare, benefits, and
                          grievance handling.
                        </li>
                      </ul>
                    </div>

                    {/* Extracted Keywords Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-yellow-400">
                        Extracted Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'cybersecurity',
                          'data privacy',
                          'employee welfare',
                          'benefits',
                          'grievance',
                        ].map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Key Insights Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-yellow-400">
                        Key Insights
                      </h3>
                      <ul className="list-disc list-inside text-gray-400">
                        <li>
                          Employee queries about cybersecurity have increased by
                          20% this quarter.
                        </li>
                        <li>
                          Higher satisfaction rates in departments that actively
                          use digital document management.
                        </li>
                        <li>
                          Low engagement detected in departments with outdated
                          policy documents.
                        </li>
                        <li>
                          Automated case creation for unresolved or frequent
                          queries detected in HR policy.
                        </li>
                      </ul>
                    </div>

                    {/* Data-Driven Alerts Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-yellow-400">
                        Data-Driven Alerts
                      </h3>
                      <ul className="list-disc list-inside text-gray-400">
                        <li>
                          Potential gaps in data privacy practices detected.
                          Recommended action: Update IT policies.
                        </li>
                        <li>
                          High workload detected in R&D. Suggested: Reallocate
                          resources or provide support.
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Dashboard Appearance and Basic Settings */}
              <Card className="bg-stone-900 border-stone-800">
                <CardHeader>
                  <CardTitle className="text-yellow-400">
                    Dashboard Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-white">
                      <span>Enable Dark Mode</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <span>Show Engagement Scores</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <span>Enable Email Notifications</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <span>Auto-process Uploaded Files</span>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Management and Security Settings */}
              <Card className="bg-stone-900 border-stone-800">
                <CardHeader>
                  <CardTitle className="text-yellow-400">
                    User Management & Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* User Roles and Permissions */}
                    <div className="flex items-center justify-between text-white">
                      <span>User Roles and Permissions</span>
                      <Select>
                        <SelectTrigger className="w-[180px] text-black">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Employee">Employee</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="IT Support">
                              IT Support
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 2FA Settings */}
                    <div className="flex items-center justify-between text-white">
                      <span>Enable 2FA (Two-Factor Authentication)</span>
                      <Switch />
                    </div>

                    {/* Data Encryption Settings */}
                    <div className="flex items-center justify-between text-white">
                      <span>Data Encryption Settings</span>
                      <Select>
                        <SelectTrigger className="w-[180px] text-black">
                          <SelectValue placeholder="Select Encryption" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Encryption Methods</SelectLabel>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="AES-256">AES-256</SelectItem>
                            <SelectItem value="End-to-End">
                              End-to-End
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Audit Logs */}
                    <div className="flex items-center justify-between text-white">
                      <span>View Audit Logs</span>
                      <Button className="bg-yellow-400 text-black">
                        View Logs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chatbot Response and Customization Settings */}
              <Card className="bg-stone-900 border-stone-800">
                <CardHeader>
                  <CardTitle className="text-yellow-400">
                    Chatbot Behavior & Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Response Settings */}
                    <div className="flex items-center justify-between text-white">
                      <span>Response Style</span>
                      <Select>
                        <SelectTrigger className="w-[180px] text-black">
                          <SelectValue placeholder="Select Style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Styles</SelectLabel>
                            <SelectItem value="Formal">Formal</SelectItem>
                            <SelectItem value="Concise">Concise</SelectItem>
                            <SelectItem value="Detailed">Detailed</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Timeout and Retry Settings */}
                    <div className="flex items-center justify-between text-white">
                      <span>Timeout (seconds) for Response</span>
                      <Input
                        type="number"
                        defaultValue={5}
                        max={10}
                        min={3}
                        className="bg-stone-800 text-yellow-400"
                      />
                    </div>

                    {/* Language and Tone Customization */}
                    <div className="flex items-center justify-between text-white">
                      <span>Language Model Tone</span>
                      <Select>
                        <SelectTrigger className="w-[180px] text-black">
                          <SelectValue placeholder="Select Tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Tones</SelectLabel>
                            <SelectItem value="Professional">
                              Professional
                            </SelectItem>
                            <SelectItem value="Casual">Casual</SelectItem>
                            <SelectItem value="Neutral">Neutral</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Entity Recognition and Intent Detection */}
                    <div className="flex items-center justify-between text-white">
                      <span>Entity & Intent Customization</span>
                      <Button className="bg-yellow-400 text-black">
                        Manage Entities
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
