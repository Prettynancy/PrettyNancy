"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Plus, Filter, Bell, User, Settings, CheckCircle2, Circle, AlertTriangle } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high"
  dueDate: string
  completed: boolean
  createdAt: string
}

const categories = [
  { id: "work", name: "Work", color: "bg-blue-500" },
  { id: "personal", name: "Personal", color: "bg-green-500" },
  { id: "shopping", name: "Shopping", color: "bg-purple-500" },
  { id: "health", name: "Health", color: "bg-red-500" },
  { id: "learning", name: "Learning", color: "bg-orange-500" },
]

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finish the Q1 project proposal for the marketing campaign",
      category: "work",
      priority: "high",
      dueDate: "2024-01-15",
      completed: false,
      createdAt: "2024-01-10",
    },
    {
      id: "2",
      title: "Buy groceries",
      description: "Weekly grocery shopping - milk, bread, fruits",
      category: "shopping",
      priority: "medium",
      dueDate: "2024-01-12",
      completed: false,
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      title: "Morning workout",
      description: "30 minutes cardio and strength training",
      category: "health",
      priority: "medium",
      dueDate: "2024-01-11",
      completed: true,
      createdAt: "2024-01-09",
    },
  ])

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as const,
    dueDate: "",
  })

  const addTask = () => {
    if (!newTask.title || !newTask.category || !newTask.dueDate) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      completed: false,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setTasks([...tasks, task])
    setNewTask({
      title: "",
      description: "",
      category: "",
      priority: "medium",
      dueDate: "",
    })
    setIsAddTaskOpen(false)
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const filteredTasks = selectedCategory === "all" ? tasks : tasks.filter((task) => task.category === selectedCategory)

  const upcomingTasks = tasks.filter((task) => {
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return !task.completed && diffDays <= 3 && diffDays >= 0
  })

  const overdueTasks = tasks.filter((task) => {
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    return !task.completed && dueDate < today
  })

  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Tasks</span>
                    <Badge variant="secondary">{tasks.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <Badge className="bg-green-500">{completedTasks.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overdue</span>
                    <Badge className="bg-red-500">{overdueTasks.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Due Soon</span>
                    <Badge className="bg-yellow-500">{upcomingTasks.length}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === "all" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory("all")}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      All Tasks
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className={`h-3 w-3 rounded-full ${category.color} mr-2`} />
                        {category.name}
                        <Badge variant="secondary" className="ml-auto">
                          {tasks.filter((task) => task.category === category.id).length}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Action Bar */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "all"
                    ? "All Tasks"
                    : categories.find((c) => c.id === selectedCategory)?.name + " Tasks"}
                </h2>
                <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                      <DialogDescription>Create a new task with details and deadline.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          placeholder="Enter task title"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                          placeholder="Enter task description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newTask.category}
                            onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  <div className="flex items-center">
                                    <div className={`h-3 w-3 rounded-full ${category.color} mr-2`} />
                                    {category.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={newTask.priority}
                            onValueChange={(value: "low" | "medium" | "high") =>
                              setNewTask({ ...newTask, priority: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={addTask}>
                        Add Task
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Notifications */}
              {(overdueTasks.length > 0 || upcomingTasks.length > 0) && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      Deadline Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {overdueTasks.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-red-600 mb-2">
                          {overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}
                        </p>
                        <div className="space-y-1">
                          {overdueTasks.slice(0, 3).map((task) => (
                            <p key={task.id} className="text-sm text-red-700">
                              • {task.title}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {upcomingTasks.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-yellow-600 mb-2">
                          {upcomingTasks.length} task{upcomingTasks.length > 1 ? "s" : ""} due soon
                        </p>
                        <div className="space-y-1">
                          {upcomingTasks.slice(0, 3).map((task) => (
                            <p key={task.id} className="text-sm text-yellow-700">
                              • {task.title} (Due: {new Date(task.dueDate).toLocaleDateString()})
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tasks */}
              <Tabs defaultValue="active" className="w-full">
                <TabsList>
                  <TabsTrigger value="active">Active Tasks</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {filteredTasks.filter((task) => !task.completed).length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <CheckCircle2 className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-center">
                          No active tasks found. Create a new task to get started!
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredTasks
                      .filter((task) => !task.completed)
                      .map((task) => (
                        <Card key={task.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Checkbox
                                checked={task.completed}
                                onCheckedChange={() => toggleTask(task.id)}
                                className="mt-1"
                              />
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                  <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                                  <Badge variant="outline">
                                    <div
                                      className={`h-2 w-2 rounded-full ${categories.find((c) => c.id === task.category)?.color} mr-1`}
                                    />
                                    {categories.find((c) => c.id === task.category)?.name}
                                  </Badge>
                                </div>
                                {task.description && <p className="text-gray-600 text-sm">{task.description}</p>}
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    Created: {new Date(task.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTask(task.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                  {completedTasks.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Circle className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-center">
                          No completed tasks yet. Complete some tasks to see them here!
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    completedTasks.map((task) => (
                      <Card key={task.id} className="opacity-75">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(task.id)}
                              className="mt-1"
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900 line-through">{task.title}</h3>
                                <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                                <Badge variant="outline">
                                  <div
                                    className={`h-2 w-2 rounded-full ${categories.find((c) => c.id === task.category)?.color} mr-1`}
                                  />
                                  {categories.find((c) => c.id === task.category)?.name}
                                </Badge>
                              </div>
                              {task.description && (
                                <p className="text-gray-600 text-sm line-through">{task.description}</p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  Created: {new Date(task.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTask(task.id)}
                              className="text-red-600 hover:text-red-700"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
