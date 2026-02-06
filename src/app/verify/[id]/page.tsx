'use client'

import { useState, useEffect } from 'react'
import { ExperienceData, VerificationData } from '@/types/experience'
import { format } from 'date-fns'

export default function VerifyExperience({ params }: { params: { id: string } }) {
  const [experience, setExperience] = useState<ExperienceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showVerificationForm, setShowVerificationForm] = useState(false)
  
  const [verificationData, setVerificationData] = useState<VerificationData>({
    managerName: '',
    managerTitle: '',
    managerEmail: '',
    comments: ''
  })

  useEffect(() => {
    const loadExperience = () => {
      try {
        console.log('Looking for experience with ID:', params.id)
        
        const experiencesStr = localStorage.getItem('experiences')
        console.log('Raw localStorage data:', experiencesStr)
        
        if (!experiencesStr) {
          console.log('No experiences found in localStorage')
          setError('No experience letters found. Please create one first.')
          setIsLoading(false)
          return
        }
        
        const experiences = JSON.parse(experiencesStr)
        console.log('Parsed experiences:', experiences)
        console.log('Available IDs:', experiences.map((exp: ExperienceData) => exp.id))
        
        const found = experiences.find((exp: ExperienceData) => exp.id === params.id)
        console.log('Found experience:', found)
        
        if (!found) {
          setError(`Experience letter not found. Looking for ID: ${params.id}`)
        } else {
          setExperience(found)
        }
      } catch (err) {
        console.error('Error loading experience letter:', err)
        setError('Error loading experience letter: ' + (err as Error).message)
      } finally {
        setIsLoading(false)
      }
    }

    // Add a small delay to ensure localStorage is available
    setTimeout(loadExperience, 100)
  }, [params.id])

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)

    try {
      if (!experience) return

      const updatedExperience = {
        ...experience,
        managerName: verificationData.managerName,
        managerTitle: verificationData.managerTitle,
        managerEmail: verificationData.managerEmail,
        isVerified: true,
        verifiedAt: new Date().toISOString()
      }

      // Update in localStorage
      const experiences = JSON.parse(localStorage.getItem('experiences') || '[]')
      const updatedExperiences = experiences.map((exp: ExperienceData) =>
        exp.id === params.id ? updatedExperience : exp
      )
      localStorage.setItem('experiences', JSON.stringify(updatedExperiences))
      
      setExperience(updatedExperience)
      setShowVerificationForm(false)
    } catch (err) {
      console.error('Error verifying experience:', err)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVerificationData({
      ...verificationData,
      [e.target.name]: e.target.value
    })
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    return months > 0 ? `${months} month${months > 1 ? 's' : ''}` : 'Less than a month'
  }

  const downloadPDF = async () => {
    if (!experience) return
    
    try {
      const { generateExperiencePDF } = await import('@/utils/pdfGenerator')
      await generateExperiencePDF(experience)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !experience) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Experience Letter Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The experience letter you\'re looking for doesn\'t exist or has been removed.'}</p>
          
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/create'}
              className="btn-primary"
            >
              Create New Experience Letter
            </button>
            
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">Debug Information</summary>
              <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600">
                <p><strong>Looking for ID:</strong> {params.id}</p>
                <p><strong>localStorage data:</strong> {localStorage.getItem('experiences') || 'null'}</p>
                <p><strong>Parsed count:</strong> {JSON.parse(localStorage.getItem('experiences') || '[]').length} experiences</p>
                {JSON.parse(localStorage.getItem('experiences') || '[]').length > 0 && (
                  <p><strong>Available IDs:</strong> {JSON.parse(localStorage.getItem('experiences') || '[]').map((exp: any) => exp.id).join(', ')}</p>
                )}
              </div>
            </details>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Experience Letter Preview */}
      <div className="card mb-8" id="experience-letter">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EXPERIENCE CERTIFICATE</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="space-y-6">
          <div className="text-gray-700 leading-relaxed">
            <p className="mb-4">
              <strong>To Whom It May Concern,</strong>
            </p>
            
            <p className="mb-4">
              This is to certify that <strong>{experience.userName}</strong> has successfully worked with{' '}
              <strong>{experience.clientCompany}</strong> on the project titled{' '}
              <strong>"{experience.projectTitle}"</strong> from{' '}
              <strong>{format(new Date(experience.startDate), 'MMMM dd, yyyy')}</strong> to{' '}
              <strong>{format(new Date(experience.endDate), 'MMMM dd, yyyy')}</strong>{' '}
              ({calculateDuration(experience.startDate, experience.endDate)}).
            </p>

            <div className="mb-4">
              <strong>Project Description:</strong>
              <p className="mt-2 pl-4">{experience.projectDescription}</p>
            </div>

            {experience.technologies.length > 0 && (
              <div className="mb-4">
                <strong>Technologies Used:</strong>
                <p className="mt-2 pl-4">{experience.technologies.join(', ')}</p>
              </div>
            )}

            {experience.skills.length > 0 && (
              <div className="mb-4">
                <strong>Key Skills Demonstrated:</strong>
                <p className="mt-2 pl-4">{experience.skills.join(', ')}</p>
              </div>
            )}

            <p className="mb-6">
              During this period, {experience.userName} has shown excellent technical skills, professionalism, 
              and dedication to delivering quality work. We wish them all the best in their future endeavors.
            </p>
          </div>

          {experience.isVerified ? (
            <div className="border-t pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{experience.managerName}</p>
                  <p className="text-gray-600">{experience.managerTitle}</p>
                  <p className="text-gray-600">{experience.clientCompany}</p>
                  <p className="text-gray-600">{experience.managerEmail}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-green-600 mb-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Verified</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Verified on {format(new Date(experience.verifiedAt!), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t pt-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-yellow-800 font-medium">Pending Verification</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {experience.isVerified ? (
          <button
            onClick={downloadPDF}
            className="btn-primary"
          >
            Download PDF
          </button>
        ) : (
          <button
            onClick={() => setShowVerificationForm(true)}
            className="btn-primary"
          >
            Verify Experience Letter
          </button>
        )}
      </div>

      {/* Verification Form Modal */}
      {showVerificationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verify Experience Letter</h3>
            
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div>
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  name="managerName"
                  value={verificationData.managerName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label className="form-label">Your Title *</label>
                <input
                  type="text"
                  name="managerTitle"
                  value={verificationData.managerTitle}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. Project Manager, CTO"
                  required
                />
              </div>
              
              <div>
                <label className="form-label">Your Email *</label>
                <input
                  type="email"
                  name="managerEmail"
                  value={verificationData.managerEmail}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div>
                <label className="form-label">Additional Comments (Optional)</label>
                <textarea
                  name="comments"
                  value={verificationData.comments}
                  onChange={handleInputChange}
                  rows={3}
                  className="form-input"
                  placeholder="Any additional comments about the candidate's performance..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowVerificationForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="btn-primary flex-1"
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}