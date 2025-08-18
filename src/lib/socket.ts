import { Server } from 'socket.io';
import { db } from '@/lib/db';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle user authentication and role assignment
    socket.on('authenticate', async (data: { userId: string; role: string }) => {
      try {
        const { userId, role } = data;
        
        // Verify user exists and has the specified role
        const user = await db.user.findUnique({
          where: { id: userId }
        });

        if (user && user.role === role) {
          // Join role-specific room
          socket.join(role);
          socket.join(`user-${userId}`);
          
          // Send authentication success
          socket.emit('authenticated', {
            success: true,
            message: `Authenticated as ${role}`,
            userId,
            role
          });

          // Send initial data based on role
          await sendInitialData(socket, role, userId);
        } else {
          socket.emit('authenticated', {
            success: false,
            message: 'Authentication failed'
          });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        socket.emit('authenticated', {
          success: false,
          message: 'Authentication error'
        });
      }
    });

    // Handle appointment updates
    socket.on('appointment_update', async (data: { appointmentId: string; status: string }) => {
      try {
        const { appointmentId, status } = data;
        
        // Update appointment in database
        const updatedAppointment = await db.appointment.update({
          where: { id: appointmentId },
          data: { status },
          include: {
            patient: {
              include: {
                user: true
              }
            },
            doctor: {
              include: {
                user: true
              }
            }
          }
        });

        // Notify relevant parties
        if (updatedAppointment.patient?.userId) {
          io.to(`user-${updatedAppointment.patient.userId}`).emit('appointment_updated', updatedAppointment);
        }
        
        if (updatedAppointment.doctor?.userId) {
          io.to(`user-${updatedAppointment.doctor.userId}`).emit('appointment_updated', updatedAppointment);
        }

        // Notify control room
        io.to('CONTROL_ROOM').emit('appointment_updated', updatedAppointment);
        
      } catch (error) {
        console.error('Appointment update error:', error);
        socket.emit('error', { message: 'Failed to update appointment' });
      }
    });

    // Handle new vital signs
    socket.on('vital_recorded', async (data: { patientId: string; vital: any }) => {
      try {
        const { patientId, vital } = data;
        
        // Create vital record
        const newVital = await db.vital.create({
          data: {
            ...vital,
            patientId,
            recordedAt: new Date()
          }
        });

        // Get patient info for notifications
        const patient = await db.patient.findUnique({
          where: { id: patientId },
          include: {
            user: true
          }
        });

        if (patient) {
          // Notify patient
          io.to(`user-${patient.userId}`).emit('vital_recorded', newVital);
          
          // Notify patient's doctors
          const appointments = await db.appointment.findMany({
            where: { patientId },
            select: { doctorId: true }
          });

          for (const appointment of appointments) {
            if (appointment.doctorId) {
              const doctor = await db.doctor.findUnique({
                where: { id: appointment.doctorId },
                include: { user: true }
              });
              
              if (doctor) {
                io.to(`user-${doctor.userId}`).emit('patient_vital_updated', {
                  patient,
                  vital: newVital
                });
              }
            }
          }
        }
        
      } catch (error) {
        console.error('Vital recording error:', error);
        socket.emit('error', { message: 'Failed to record vital' });
      }
    });

    // Handle doctor availability updates
    socket.on('doctor_availability_update', async (data: { doctorId: string; isAvailable: boolean }) => {
      try {
        const { doctorId, isAvailable } = data;
        
        // Update doctor availability
        await db.doctor.update({
          where: { id: doctorId },
          data: { isAvailable }
        });

        // Get doctor info
        const doctor = await db.doctor.findUnique({
          where: { id: doctorId },
          include: { user: true }
        });

        if (doctor) {
          // Notify control room
          io.to('CONTROL_ROOM').emit('doctor_availability_updated', {
            doctor,
            isAvailable
          });
          
          // Notify admin users
          io.to('ADMIN').emit('doctor_availability_updated', {
            doctor,
            isAvailable
          });
        }
        
      } catch (error) {
        console.error('Doctor availability update error:', error);
        socket.emit('error', { message: 'Failed to update availability' });
      }
    });

    // Handle new messages
    socket.on('send_message', async (data: { recipientId: string; message: string; type: string }) => {
      try {
        const { recipientId, message, type } = data;
        
        // Create message record (you would need to add a Message model to your schema)
        // For now, just broadcast the message
        
        const messageData = {
          id: Date.now().toString(),
          senderId: socket.id,
          recipientId,
          message,
          type,
          timestamp: new Date().toISOString()
        };

        // Send to recipient
        io.to(`user-${recipientId}`).emit('new_message', messageData);
        
        // Send confirmation back to sender
        socket.emit('message_sent', messageData);
        
      } catch (error) {
        console.error('Message sending error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle system notifications
    socket.on('system_notification', (data: { type: string; message: string; targetRole?: string }) => {
      const { type, message, targetRole } = data;
      
      const notification = {
        id: Date.now().toString(),
        type,
        message,
        timestamp: new Date().toISOString()
      };

      if (targetRole) {
        io.to(targetRole).emit('system_notification', notification);
      } else {
        io.emit('system_notification', notification);
      }
    });

    // Handle super admin notifications
    socket.on('super_admin_notification', (data: any) => {
      const notification = {
        id: Date.now().toString(),
        ...data,
        timestamp: new Date().toISOString()
      };

      // Send to super admin room
      io.to('SUPER_ADMIN').emit('super_admin_notification', notification);
    });

    // Handle general notifications
    socket.on('notification', (data: any) => {
      const notification = {
        id: Date.now().toString(),
        ...data,
        timestamp: new Date().toISOString()
      };

      // Send to specific user if userId is provided
      if (data.userId) {
        io.to(`user-${data.userId}`).emit('notification', notification);
      } else if (data.targetRole) {
        // Send to role-based room
        io.to(data.targetRole).emit('notification', notification);
      } else {
        // Broadcast to all
        io.emit('notification', notification);
      }
    });

    // Handle appointment reminders
    socket.on('appointment_reminder', (data: { appointmentId: string; patientId: string; message: string }) => {
      const { appointmentId, patientId, message } = data;
      
      // Get patient info
      db.patient.findUnique({
        where: { id: patientId },
        include: { user: true }
      }).then(patient => {
        if (patient && patient.userId) {
          const reminder = {
            id: Date.now().toString(),
            type: 'appointment_reminder',
            title: 'Appointment Reminder',
            message,
            priority: 'medium',
            appointmentId,
            patientId,
            timestamp: new Date().toISOString(),
            actionUrl: `/dashboard/patient/appointments`
          };

          io.to(`user-${patient.userId}`).emit('appointment_reminder', reminder);
        }
      }).catch(error => {
        console.error('Error sending appointment reminder:', error);
      });
    });

    // Handle prescription updates
    socket.on('prescription_update', (data: { prescriptionId: string; patientId: string; status: string }) => {
      const { prescriptionId, patientId, status } = data;
      
      // Get patient info
      db.patient.findUnique({
        where: { id: patientId },
        include: { user: true }
      }).then(patient => {
        if (patient && patient.userId) {
          const update = {
            id: Date.now().toString(),
            type: 'prescription_update',
            title: 'Prescription Update',
            message: `Your prescription has been ${status.toLowerCase()}`,
            priority: status === 'READY' ? 'high' : 'medium',
            prescriptionId,
            patientId,
            status,
            timestamp: new Date().toISOString(),
            actionUrl: `/dashboard/patient/prescriptions`
          };

          io.to(`user-${patient.userId}`).emit('prescription_update', update);
        }
      }).catch(error => {
        console.error('Error sending prescription update:', error);
      });
    });

    // Handle lab result notifications
    socket.on('lab_result_ready', (data: { labResultId: string; patientId: string; message: string }) => {
      const { labResultId, patientId, message } = data;
      
      // Get patient info
      db.patient.findUnique({
        where: { id: patientId },
        include: { user: true }
      }).then(patient => {
        if (patient && patient.userId) {
          const notification = {
            id: Date.now().toString(),
            type: 'lab_result_ready',
            title: 'Lab Result Ready',
            message,
            priority: 'high',
            labResultId,
            patientId,
            timestamp: new Date().toISOString(),
            actionUrl: `/dashboard/patient/vitals`
          };

          io.to(`user-${patient.userId}`).emit('lab_result_ready', notification);
        }
      }).catch(error => {
        console.error('Error sending lab result notification:', error);
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to Healthcare WebSocket Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};

// Helper function to send initial data based on user role
async function sendInitialData(socket: any, role: string, userId: string) {
  try {
    switch (role) {
      case 'PATIENT':
        // Send upcoming appointments
        const patient = await db.patient.findUnique({
          where: { userId }
        });
        
        if (patient) {
          const upcomingAppointments = await db.appointment.findMany({
            where: {
              patientId: patient.id,
              status: { in: ['PENDING', 'CONFIRMED'] }
            },
            include: {
              doctor: {
                include: {
                  user: true
                }
              }
            },
            orderBy: { scheduledAt: 'asc' }
          });
          
          socket.emit('initial_data', {
            type: 'upcoming_appointments',
            data: upcomingAppointments
          });
        }
        break;

      case 'DOCTOR':
        // Send today's appointments
        const doctor = await db.doctor.findUnique({
          where: { userId }
        });
        
        if (doctor) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          const todaysAppointments = await db.appointment.findMany({
            where: {
              doctorId: doctor.id,
              scheduledAt: {
                gte: today,
                lt: tomorrow
              }
            },
            include: {
              patient: {
                include: {
                  user: true
                }
              }
            },
            orderBy: { scheduledAt: 'asc' }
          });
          
          socket.emit('initial_data', {
            type: 'todays_appointments',
            data: todaysAppointments
          });
        }
        break;

      case 'CONTROL_ROOM':
        // Send pending appointments and available doctors
        const pendingAppointments = await db.appointment.findMany({
          where: {
            type: 'GP_CONSULTATION',
            status: 'PENDING',
            doctorId: null
          },
          include: {
            patient: {
              include: {
                user: true
              }
            }
          },
          orderBy: { scheduledAt: 'asc' }
        });
        
        const availableDoctors = await db.doctor.findMany({
          where: {
            isAvailable: true,
            doctorProfile: {
              specialization: {
                contains: 'General Practitioner',
                mode: 'insensitive'
              }
            }
          },
          include: {
            user: true,
            doctorProfile: true
          }
        });
        
        socket.emit('initial_data', {
          type: 'control_room_data',
          data: {
            pendingAppointments,
            availableDoctors
          }
        });
        break;

      case 'ADMIN':
        // Send system stats
        const totalPatients = await db.patient.count();
        const totalDoctors = await db.doctor.count();
        const totalAppointments = await db.appointment.count();
        
        socket.emit('initial_data', {
          type: 'system_stats',
          data: {
            totalPatients,
            totalDoctors,
            totalAppointments
          }
        });
        break;
    }
  } catch (error) {
    console.error('Error sending initial data:', error);
  }
}