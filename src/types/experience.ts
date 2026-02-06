export interface ExperienceData {
  id: string
  // Personal Info
  userName: string
  userEmail: string
  
  // Project Details
  projectTitle: string
  projectDescription: string
  clientCompany: string
  startDate: string
  endDate: string
  
  // Skills & Technologies
  technologies: string[]
  skills: string[]
  
  // Manager/Client Info (to be filled during verification)
  managerName?: string
  managerTitle?: string
  managerEmail?: string
  managerSignature?: string
  
  // Status
  isVerified: boolean
  verificationToken: string
  createdAt: string
  verifiedAt?: string
}

export interface VerificationData {
  managerName: string
  managerTitle: string
  managerEmail: string
  comments?: string
}