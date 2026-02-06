'use client'

import { useState } from 'react'
import { ExperienceData } from '@/types/experience'
import { nanoid } from 'nanoid'

export default function CreateExperience() {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    projectTitle: '',
    projectDescription: '',
    clientCompany: '',
    startDate: '',
    endDate: '',
    technologies: '',
    skills: '',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const experienceData: ExperienceData = {
        id: nanoid(),
        userName: formData.userName,
        userEmail: formData.userEmail,
        projectTitle: formData.projectTitle,
        projectDescription: formData.projectDescription,
        clientCompany: formData.clientCompany,
        startDate: formData.startDate,
        endDate: formData.endDate,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        isVerified: false,
        verificationToken: nanoid(),
        createdAt: new Date().toISOString(),
      }

      // Store in localStorage for demo purposes
      // In a real app, this would be sent to your backend API
      console.log('Saving experience with ID:', experienceData.id)
      
      const existingDataStr = localStorage.getItem('experiences')
      console.log('Existing data:', existingDataStr)
      
      const existingData = existingDataStr ? JSON.parse(existingDataStr) : []
      existingData.push(experienceData)
      
      const updatedDataStr = JSON.stringify(existingData)
      localStorage.setItem('experiences', updatedDataStr)
      console.log('Saved data:', updatedDataStr)
      
      // Verify the save worked
      const verifyData = localStorage.getItem('experiences')
      console.log('Verification read:', verifyData)

      setSubmittedId(experienceData.id)
    } catch (error) {
      console.error('Error creating experience:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submittedId) {
    const verificationUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${submittedId}`
    
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience Letter Created!</h2>
            <p className="text-gray-600 mb-6">
              Your experience letter has been created successfully. Share the link below with your manager or client for verification.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <label className="form-label">Verification Link:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={verificationUrl}
                  readOnly
                  className="form-input text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(verificationUrl)}
                  className="btn-secondary whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = verificationUrl}
                className="btn-primary w-full"
              >
                Preview Letter
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="btn-secondary w-full"
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Experience Letter</h1>
        <p className="text-gray-600">
          Fill in the details below to generate your professional experience letter.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Your Name *</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="form-label">Your Email *</label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
          
          <div>
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleInputChange}
              className="form-input"
              placeholder="E.g. E-commerce Website Development"
              required
            />
          </div>
          
          <div>
            <label className="form-label">Client/Company Name *</label>
            <input
              type="text"
              name="clientCompany"
              value={formData.clientCompany}
              onChange={handleInputChange}
              className="form-input"
              placeholder="E.g. ABC Technologies"
              required
            />
          </div>
          
          <div>
            <label className="form-label">Project Description *</label>
            <textarea
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleInputChange}
              rows={4}
              className="form-input"
              placeholder="Describe the project, your role, and key achievements..."
              required
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="form-label">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Skills & Technologies</h3>
          
          <div>
            <label className="form-label">Technologies Used</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              className="form-input"
              placeholder="E.g. React, Node.js, MongoDB, AWS (separated by commas)"
            />
          </div>
          
          <div>
            <label className="form-label">Key Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              className="form-input"
              placeholder="E.g. Frontend Development, API Integration, Database Design (separated by commas)"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? 'Creating...' : 'Create Experience Letter'}
          </button>
        </div>
      </form>
    </div>
  )
}