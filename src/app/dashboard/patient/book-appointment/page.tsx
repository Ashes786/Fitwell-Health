"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Video, 
  Phone, 
  User, 
  Clock, 
  MapPin, 
  CreditCard,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  ArrowRight
} from "lucide-react"
import { UserRole } from "@prisma/client"

interface Doctor {
  id: string
  name: string
  specialization: string
  experience: number
  rating: number
  consultationFee: number
  availableSlots: string[]
  city?: string
  avatar?: string
}

interface TimeSlot {
  date: string
  time: string
  available: boolean
}

export default function BookAppointment() {
  const { isAuthorized, isUnauthorized, isLoading: authLoading, authSession } = useRoleAuthorization({
    requiredRole: "PATIENT",
    redirectTo: "/auth/signin",
    showUnauthorizedMessage: true
  })
  
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [specializations, setSpecializations] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedStep, setSelectedStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [isBooking, setIsBooking] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    if (isAuthorized) {
      // Original fetch logic will be handled separately
    }
  }, [isAuthorized])

  useEffect(() => {
    // Filter doctors based on selected category and city
    let filtered = doctors

    if (selectedCategory) {
      filtered = filtered.filter(doctor => 
        doctor.specialization.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    }

    if (selectedCity) {
      filtered = filtered.filter(doctor => 
        doctor.city?.toLowerCase().includes(selectedCity.toLowerCase())
      )
    }

    setFilteredDoctors(filtered)
  }, [doctors, selectedCategory, selectedCity])

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors')
      if (response.ok) {
        const data = await response.json() as Doctor[]
        setDoctors(data)
        setFilteredDoctors(data)
        
        // Extract unique specializations and cities
        const specs = Array.from(new Set(data.map((d: Doctor) => d.specialization)))
        const cits = Array.from(new Set(data.map((d: Doctor) => d.city).filter(Boolean))) as string[]
        setSpecializations(specs)
        setCities(cits)
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableSlots = async (doctorId: string, date: string) => {
    try {
      const response = await fetch(`/api/availability?doctorId=${doctorId}&date=${date}`)
      if (response.ok) {
        const data = await response.json()
        setAvailableSlots(data)
      }
    } catch (error) {
      console.error('Error fetching available slots:', error)
    }
  }

  if (authLoading) {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      
    )
  }

  if (!authSession) {
    return null
  }

  // Show unauthorized message if user doesn't have PATIENT role
  if (isUnauthorized) {
    return (
      
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unauthorized Access</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      
    )
  }

  const appointmentTypes = [
    { value: "VIDEO_CONSULTATION", label: "Video Consultation", icon: Video, fee: selectedDoctor?.consultationFee || 150 },
    { value: "PHONE_CONSULTATION", label: "Phone Consultation", icon: Phone, fee: Math.floor((selectedDoctor?.consultationFee || 150) * 0.8) },
    { value: "IN_PERSON", label: "In-Person Visit", icon: MapPin, fee: selectedDoctor?.consultationFee || 150 },
  ]

  const paymentMethods = [
    { value: "CREDIT_CARD", label: "Credit Card", icon: CreditCard },
    { value: "HEALTH_CARD", label: "Health Card", icon: CreditCard },
    { value: "INSURANCE", label: "Insurance", icon: CreditCard },
  ]

  const handleCategoryCitySelect = () => {
    if (selectedCategory || selectedCity) {
      setSelectedStep(2)
    }
  }

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setSelectedStep(3)
  }

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    setSelectedStep(4)
  }

  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setSelectedStep(5)
  }

  const handleBookingSubmit = async () => {
    if (!selectedDoctor || !selectedType || !selectedDate || !selectedTime || !chiefComplaint || !paymentMethod) {
      return
    }

    setIsBooking(true)
    
    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00.000Z`)
      
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          appointmentType: selectedType,
          scheduledAt: scheduledAt.toISOString(),
          chiefComplaint,
          paymentMethod,
          consultationFee: appointmentTypes.find(t => t.value === selectedType)?.fee
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSelectedStep(6) // Confirmation step
        } else {
          console.error('Booking failed:', data.error)
        }
      } else {
        console.error('Booking failed:', response.statusText)
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
    } finally {
      setIsBooking(false)
    }
  }

  const getAvailableTimeSlots = (date: string) => {
    return availableSlots.filter(slot => slot.date === date && slot.available)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    if (selectedDoctor) {
      fetchAvailableSlots(selectedDoctor.id, date)
    }
  }

  const Step1CategorySelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Find a Specialist</h2>
        <p className="text-gray-600">Select your preferred specialty and location</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg">Specialty</CardTitle>
            <CardDescription>Choose the type of specialist you need</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-emerald-200">
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Specialties</SelectItem>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedCategory && (
              <div className="flex items-center space-x-2 p-3 bg-emerald-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">
                  Selected: {selectedCategory}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg">Location</CardTitle>
            <CardDescription>Choose your preferred city</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="border-emerald-200">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedCity && (
              <div className="flex items-center space-x-2 p-3 bg-emerald-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">
                  Selected: {selectedCity}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700 px-8"
          onClick={handleCategoryCitySelect}
          disabled={!selectedCategory && !selectedCity}
        >
          View Specialists
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const Step2DoctorSelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Doctor</h2>
        <p className="text-gray-600">Choose a specialist for your consultation</p>
      </div>

      {filteredDoctors.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredDoctors.map((doctor) => (
            <Card 
              key={doctor.id} 
              className="border-emerald-200 cursor-pointer hover:border-emerald-400 transition-colors"
              onClick={() => handleDoctorSelect(doctor)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    {doctor.city && (
                      <p className="text-sm text-emerald-600 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {doctor.city}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500">Experience:</span>
                        <span className="text-sm font-medium">{doctor.experience} years</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500">Rating:</span>
                        <span className="text-sm font-medium">⭐ {doctor.rating}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge className="bg-emerald-100 text-emerald-800">
                        ${doctor.consultationFee} consultation
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-emerald-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No doctors available
            </h3>
            <p className="text-gray-600 text-center">
              There are no doctors available at the moment. Please try again later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const Step3AppointmentType = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Appointment Type</h2>
        <p className="text-gray-600">Choose how you'd like to consult with {selectedDoctor?.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {appointmentTypes.map((type) => {
          const Icon = type.icon
          return (
            <Card 
              key={type.value} 
              className="border-emerald-200 cursor-pointer hover:border-emerald-400 transition-colors"
              onClick={() => handleTypeSelect(type.value)}
            >
              <CardContent className="p-6 text-center">
                <Icon className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{type.label}</h3>
                <Badge className="bg-emerald-100 text-emerald-800">
                  ${type.fee}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const Step4DateTimeSelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
        <p className="text-gray-600">Choose your preferred appointment slot</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Available Dates</h3>
          <div className="flex space-x-2 overflow-x-auto">
            {selectedDoctor?.availableSlots.map((date) => (
              <Button
                key={date}
                variant={selectedDate === date ? "default" : "outline"}
                className={`min-w-fit ${selectedDate === date ? "bg-emerald-600 hover:bg-emerald-700" : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"}`}
                onClick={() => handleDateSelect(date)}
              >
                {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </Button>
            ))}
          </div>
        </div>

        {selectedDate && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Available Time Slots</h3>
            {getAvailableTimeSlots(selectedDate).length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {getAvailableTimeSlots(selectedDate).map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    className={`${selectedTime === slot.time ? "bg-emerald-600 hover:bg-emerald-700" : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"}`}
                    onClick={() => handleDateTimeSelect(selectedDate, slot.time)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            ) : (
              <Card className="border-emerald-200">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Clock className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 text-center">
                    No available time slots for this date. Please select another date.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const Step5DetailsPayment = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Details & Payment</h2>
        <p className="text-gray-600">Review your appointment and complete payment</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle>Appointment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-medium">{selectedDoctor?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Video className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{appointmentTypes.find(t => t.value === selectedType)?.label}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">
                  {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Fee</span>
                <Badge className="bg-emerald-100 text-emerald-800">
                  ${appointmentTypes.find(t => t.value === selectedType)?.fee}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle>Complete Booking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="chiefComplaint">Chief Complaint</Label>
              <Textarea
                id="chiefComplaint"
                placeholder="Please describe your symptoms or reason for visit..."
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Payment Method</Label>
              <div className="grid gap-2 mt-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <Button
                      key={method.value}
                      variant={paymentMethod === method.value ? "default" : "outline"}
                      className={`justify-start ${paymentMethod === method.value ? "bg-emerald-600 hover:bg-emerald-700" : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"}`}
                      onClick={() => setPaymentMethod(method.value)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {method.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={handleBookingSubmit}
              disabled={!chiefComplaint || !paymentMethod || isBooking}
            >
              {isBooking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                `Pay $${appointmentTypes.find(t => t.value === selectedType)?.fee} & Book`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const Step6Confirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked Successfully!</h2>
        <p className="text-gray-600">Your appointment has been confirmed and payment processed.</p>
      </div>

      <Card className="border-emerald-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Appointment ID</span>
              <span className="font-medium">APT-2024-{Math.floor(Math.random() * 1000)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Doctor</span>
              <span className="font-medium">{selectedDoctor?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Type</span>
              <span className="font-medium">{appointmentTypes.find(t => t.value === selectedType)?.label}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Date & Time</span>
              <span className="font-medium">
                {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Payment Status</span>
              <Badge className="bg-emerald-100 text-emerald-800">Paid</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button 
          variant="outline" 
          className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 flex-1"
          onClick={() => router.push("/dashboard/patient/appointments")}
        >
          View All Appointments
        </Button>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700 flex-1"
          onClick={() => router.push("/dashboard/patient")}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  )

  return (
    
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              if (selectedStep > 1) {
                setSelectedStep(selectedStep - 1)
              } else {
                router.push("/dashboard/patient/appointments")
              }
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
            <p className="text-gray-600 mt-2">
              Step {selectedStep} of 6
            </p>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(selectedStep / 6) * 100}%` }}
          ></div>
        </div>

        {selectedStep === 1 && <Step1CategorySelection />}
        {selectedStep === 2 && <Step2DoctorSelection />}
        {selectedStep === 3 && <Step3AppointmentType />}
        {selectedStep === 4 && <Step4DateTimeSelection />}
        {selectedStep === 5 && <Step5DetailsPayment />}
        {selectedStep === 6 && <Step6Confirmation />}
      </div>
    
  )
}