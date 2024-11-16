'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Home, Bell, Users, BarChart2, FileText, Database, Settings, Search, MoreVertical, Upload, Download, Trash2, Eye } from 'lucide-react'

const sampleChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
]

const sampleAlerts = [
  { id: 1, title: 'High Attrition Risk', description: 'Department X shows increased attrition risk', priority: 'high' },
  { id: 2, title: 'Low Engagement', description: 'Team Y has shown decreased engagement', priority: 'medium' },
  { id: 3, title: 'Negative Sentiment Detected', description: 'Recent communications show negative sentiment', priority: 'low' },
]

const sampleEmployees = [
  { id: 1, name: 'John Doe', department: 'Engineering', engagementScore: 85, sentiment: 'Positive' },
  { id: 2, name: 'Jane Smith', department: 'Marketing', engagementScore: 72, sentiment: 'Neutral' },
  { id: 3, name: 'Bob Johnson', department: 'Sales', engagementScore: 90, sentiment: 'Very Positive' },
]

const sampleFiles = [
  { id: 1, name: 'Q2_Report.pdf', uploadDate: '2023-06-15', status: 'Processed' },
  { id: 2, name: 'Employee_Survey.xlsx', uploadDate: '2023-06-10', status: 'Processing' },
  { id: 3, name: 'Meeting_Minutes.docx', uploadDate: '2023-06-05', status: 'Processed' },
]

export function DashboardUi() {
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
              { icon: <Home className="h-4 w-4" />, label: 'Overview' },
              { icon: <Bell className="h-4 w-4" />, label: 'Alerts' },
              { icon: <Users className="h-4 w-4" />, label: 'Employee Metrics' },
              { icon: <BarChart2 className="h-4 w-4" />, label: 'Graphs' },
              { icon: <FileText className="h-4 w-4" />, label: 'File Management' },
              { icon: <Database className="h-4 w-4" />, label: 'Processed Data' },
              { icon: <Settings className="h-4 w-4" />, label: 'Settings' },
            ].map((item, index) => (
              <Button key={index} variant="ghost" className="w-full justify-start text-white hover:bg-stone-900">
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
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-stone-900">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="employees">Employee Metrics</TabsTrigger>
              <TabsTrigger value="files">File Management</TabsTrigger>
              <TabsTrigger value="data">Processed Data</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Section */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Total Employees', value: '1,234' },
                  { title: 'Active Users', value: '987' },
                  { title: 'Alerts Count', value: '15' },
                  { title: 'Files Processed', value: '56' },
                ].map((stat, index) => (
                  <Card key={index} className="bg-stone-900 border-stone-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="bg-stone-900 border-stone-800">
                <CardHeader>
                  <CardTitle>Employee Engagement Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sampleChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#facc15" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alerts Section */}
            <TabsContent value="alerts" className="space-y-6">
              <Card className="bg-stone-900 border-stone-800">
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Priority</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleAlerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell>{alert.title}</TableCell>
                          <TableCell>{alert.description}</TableCell>
                          <TableCell>
                            <Badge
                              variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'secondary'}
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
            </TabsContent>

            {/* Employee Metrics Section */}
            <TabsContent value="employees" className="space-y-6">
              <Card className="bg-stone-900 border-stone-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Employee Metrics</CardTitle>
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
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Engagement Score</TableHead>
                        <TableHead>Sentiment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{employee.engagementScore}</TableCell>
                          <TableCell>{employee.sentiment}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* File Management Section */}
            <TabsContent value="files" className="space-y-6">
              <Card className="bg-stone-900 border-stone-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>File Management</CardTitle>
                  <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleFiles.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell>{file.name}</TableCell>
                          <TableCell>{file.uploadDate}</TableCell>
                          <TableCell>{file.status}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Processed Data Section */}
            <TabsContent value="data" className="space-y-6">
              <Card className="bg-stone-900 border-stone-800">
                <CardHeader>
                  <CardTitle>Processed Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Document Summarization</h3>
                      <p className="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Extracted Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {['engagement', 'productivity', 'satisfaction', 'retention', 'performance'].map((keyword, index) => (
                          <Badge key={index} variant="secondary">{keyword}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Key Insights</h3>
                      <ul className="list-disc list-inside text-gray-400">
                        <li>Employee engagement has increased by 15% in the last quarter</li>
                        <li>The marketing department shows the highest satisfaction scores</li>
                        <li>Theres a correlation between flexible work hours and productivity</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Section */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-stone-900 border-stone-800">
                <CardHeader>
                  <CardTitle>Dashboard Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable Dark Mode</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Show Engagement Scores</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Enable Email Notifications</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auto-process Uploaded Files</span>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </div>
  )
}