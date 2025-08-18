"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  Search, 
  Send, 
  UserCheck, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Phone,
  Video,
  Paperclip,
  Smile,
  MoreVertical
} from "lucide-react"
import { UserRole } from "@prisma/client"

interface Message {
  id: string
  sender: {
    id: string
    name: string
    role: "PATIENT" | "DOCTOR" | "ATTENDANT"
    avatar?: string
  }
  recipient: {
    id: string
    name: string
    role: "PATIENT" | "DOCTOR" | "ATTENDANT"
  }
  content: string
  timestamp: string
  status: "SENT" | "DELIVERED" | "READ"
  type: "TEXT" | "FILE" | "PRESCRIPTION_REQUEST"
  attachments?: {
    id: string
    name: string
    size: string
    type: string
  }[]
}

interface Conversation {
  id: string
  patient: {
    id: string
    name: string
    age: number
    gender: string
    lastVisit?: string
  }
  lastMessage: Message
  unreadCount: number
  isOnline: boolean
  priority: "NORMAL" | "URGENT" | "EMERGENCY"
}

export default function DoctorMessages() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user?.role !== "DOCTOR") {
      router.push("/dashboard")
      return
    }

    // Mock data - in real app, this would come from API
    const mockConversations: Conversation[] = [
      {
        id: "1",
        patient: {
          id: "1",
          name: "John Smith",
          age: 39,
          gender: "MALE",
          lastVisit: "2024-01-10"
        },
        lastMessage: {
          id: "1",
          sender: {
            id: "1",
            name: "John Smith",
            role: "PATIENT"
          },
          recipient: {
            id: "doctor-1",
            name: "Dr. Sarah Johnson",
            role: "DOCTOR"
          },
          content: "Thank you for the prescription. I'm feeling much better now.",
          timestamp: "2024-01-12T14:30:00Z",
          status: "READ",
          type: "TEXT"
        },
        unreadCount: 0,
        isOnline: true,
        priority: "NORMAL"
      },
      {
        id: "2",
        patient: {
          id: "2",
          name: "Sarah Johnson",
          age: 34,
          gender: "FEMALE",
          lastVisit: "2024-01-08"
        },
        lastMessage: {
          id: "2",
          sender: {
            id: "2",
            name: "Sarah Johnson",
            role: "PATIENT"
          },
          recipient: {
            id: "doctor-1",
            name: "Dr. Sarah Johnson",
            role: "DOCTOR"
          },
          content: "I'm having trouble with my asthma inhaler. Can you help?",
          timestamp: "2024-01-13T09:15:00Z",
          status: "DELIVERED",
          type: "TEXT"
        },
        unreadCount: 1,
        isOnline: false,
        priority: "URGENT"
      },
      {
        id: "3",
        patient: {
          id: "3",
          name: "Mike Davis",
          age: 46,
          gender: "MALE",
          lastVisit: "2024-01-05"
        },
        lastMessage: {
          id: "3",
          sender: {
            id: "doctor-1",
            name: "Dr. Sarah Johnson",
            role: "DOCTOR"
          },
          recipient: {
            id: "3",
            name: "Mike Davis",
            role: "PATIENT"
          },
          content: "Your test results look good. Continue with the current medication.",
          timestamp: "2024-01-11T16:45:00Z",
          status: "READ",
          type: "TEXT"
        },
        unreadCount: 0,
        isOnline: true,
        priority: "NORMAL"
      }
    ]

    setConversations(mockConversations)
    setIsLoading(false)
  }, [session, status, router])

  useEffect(() => {
    if (selectedConversation) {
      // Mock messages for selected conversation
      const mockMessages: Message[] = [
        {
          id: "1",
          sender: {
            id: selectedConversation.patient.id,
            name: selectedConversation.patient.name,
            role: "PATIENT"
          },
          recipient: {
            id: "doctor-1",
            name: "Dr. Sarah Johnson",
            role: "DOCTOR"
          },
          content: "Hello doctor, I have a question about my medication.",
          timestamp: "2024-01-12T14:00:00Z",
          status: "READ",
          type: "TEXT"
        },
        {
          id: "2",
          sender: {
            id: "doctor-1",
            name: "Dr. Sarah Johnson",
            role: "DOCTOR"
          },
          recipient: {
            id: selectedConversation.patient.id,
            name: selectedConversation.patient.name,
            role: "PATIENT"
          },
          content: "Hello! I'd be happy to help. What would you like to know?",
          timestamp: "2024-01-12T14:15:00Z",
          status: "READ",
          type: "TEXT"
        },
        {
          id: "3",
          sender: {
            id: selectedConversation.patient.id,
            name: selectedConversation.patient.name,
            role: "PATIENT"
          },
          recipient: {
            id: "doctor-1",
            name: "Dr. Sarah Johnson",
            role: "DOCTOR"
          },
          content: "Thank you for the prescription. I'm feeling much better now.",
          timestamp: "2024-01-12T14:30:00Z",
          status: "READ",
          type: "TEXT"
        }
      ]
      setMessages(mockMessages)
    }
  }, [selectedConversation])

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout userRole={UserRole.DOCTOR}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  const filteredConversations = conversations.filter(conversation =>
    conversation.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const urgentConversations = filteredConversations.filter(c => c.priority === "URGENT" || c.priority === "EMERGENCY")
  const unreadConversations = filteredConversations.filter(c => c.unreadCount > 0)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "EMERGENCY":
        return "bg-red-100 text-red-800"
      case "URGENT":
        return "bg-orange-100 text-orange-800"
      case "NORMAL":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "READ":
        return "bg-emerald-100 text-emerald-800"
      case "DELIVERED":
        return "bg-blue-100 text-blue-800"
      case "SENT":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: {
        id: "doctor-1",
        name: "Dr. Sarah Johnson",
        role: "DOCTOR"
      },
      recipient: {
        id: selectedConversation.patient.id,
        name: selectedConversation.patient.name,
        role: "PATIENT"
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: "SENT",
      type: "TEXT"
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // Update conversation last message
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: newMsg, unreadCount: 0 }
        : conv
    )
    setConversations(updatedConversations)
    setSelectedConversation({ ...selectedConversation, lastMessage: newMsg })
  }

  return (
    <DashboardLayout userRole={UserRole.DOCTOR}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-2">
              Communicate with your patients and healthcare team
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="border-emerald-200 lg:col-span-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-emerald-200 focus:border-emerald-400"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <Tabs defaultValue="all" className="h-full flex flex-col">
                <TabsList className="bg-emerald-100 mx-3 mt-3">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white flex-1"
                  >
                    All ({filteredConversations.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="urgent" 
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white flex-1"
                  >
                    Urgent ({urgentConversations.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="flex-1 overflow-y-auto mt-0">
                  <div className="space-y-1 p-3">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-emerald-50 ${
                          selectedConversation?.id === conversation.id ? 'bg-emerald-100' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <UserCheck className="h-5 w-5 text-emerald-600" />
                              </div>
                              {conversation.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{conversation.patient.name}</h4>
                              <p className="text-xs text-gray-600">
                                {conversation.patient.age}y {conversation.patient.gender}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                            <Badge className={getPriorityColor(conversation.priority)}>
                              {conversation.priority}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <div className="flex justify-end mt-1">
                            <Badge className="bg-red-500 text-white">
                              {conversation.unreadCount}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="urgent" className="flex-1 overflow-y-auto mt-0">
                  <div className="space-y-1 p-3">
                    {urgentConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-emerald-50 ${
                          selectedConversation?.id === conversation.id ? 'bg-emerald-100' : ''
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <UserCheck className="h-5 w-5 text-emerald-600" />
                              </div>
                              {conversation.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{conversation.patient.name}</h4>
                              <p className="text-xs text-gray-600">
                                {conversation.patient.age}y {conversation.patient.gender}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                            <Badge className={getPriorityColor(conversation.priority)}>
                              {conversation.priority}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <div className="flex justify-end mt-1">
                            <Badge className="bg-red-500 text-white">
                              {conversation.unreadCount}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="border-emerald-200 lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-emerald-600" />
                        </div>
                        {selectedConversation.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{selectedConversation.patient.name}</CardTitle>
                        <CardDescription>
                          {selectedConversation.patient.age}y {selectedConversation.patient.gender} • 
                          {selectedConversation.isOnline ? ' Online' : ' Offline'}
                        </CardDescription>
                      </div>
                      <Badge className={getPriorityColor(selectedConversation.priority)}>
                        {selectedConversation.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-hidden flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender.role === "DOCTOR" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender.role === "DOCTOR"
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs opacity-70">
                              {formatTime(message.timestamp)}
                            </span>
                            {message.sender.role === "DOCTOR" && (
                              <Badge className={getStatusColor(message.status)}>
                                {message.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 border-emerald-200 focus:border-emerald-400"
                      />
                      <Button 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center h-full">
                <MessageSquare className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600 text-center">
                  Choose a patient from the list to start messaging
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}