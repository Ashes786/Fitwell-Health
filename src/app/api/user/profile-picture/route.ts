import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.formData()
    const file: File | null = data.get('profilePicture') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload an image.' }, { status: 400 })
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size too large. Maximum size is 5MB.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const fileName = `profile-${timestamp}-${randomId}.${fileExtension}`

    // Define upload directory - create public/uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'profile-pictures')
    
    try {
      // Import fs dynamically to avoid issues with client-side imports
      const { mkdir } = await import('fs/promises')
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory already exists or other error
      console.log('Directory creation error:', error)
    }

    const filePath = join(uploadDir, fileName)

    // Save the file
    await writeFile(filePath, buffer)

    // Generate the URL for the uploaded file
    const imageUrl = `/uploads/profile-pictures/${fileName}`

    // Update user's profile picture in the database
    const updatedUser = await db.user.update({
      where: {
        email: session.user.email
      },
      data: {
        image: imageUrl,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'Profile picture uploaded successfully',
      imageUrl: imageUrl,
      user: updatedUser
    })
  } catch (error) {
    console.error('Error uploading profile picture:', error)
    return NextResponse.json(
      { error: 'Failed to upload profile picture' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user to remove existing profile picture
    const currentUser = await db.user.findUnique({
      where: {
        email: session.user.email
      },
      select: {
        image: true
      }
    })

    if (currentUser?.image && currentUser.image.startsWith('/uploads/profile-pictures/')) {
      // Remove the file from filesystem
      try {
        const { unlink } = await import('fs/promises')
        const filePath = join(process.cwd(), 'public', currentUser.image)
        await unlink(filePath)
      } catch (error) {
        console.log('Error removing profile picture file:', error)
        // Continue even if file removal fails
      }
    }

    // Update user's profile picture in database
    const updatedUser = await db.user.update({
      where: {
        email: session.user.email
      },
      data: {
        image: null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'Profile picture removed successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('Error removing profile picture:', error)
    return NextResponse.json(
      { error: 'Failed to remove profile picture' },
      { status: 500 }
    )
  }
}