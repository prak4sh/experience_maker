import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { ExperienceData } from '@/types/experience'
import { format } from 'date-fns'

export const generateExperiencePDF = async (experience: ExperienceData) => {
  // Create PDF
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  
  // Colors
  const primaryColor = '#1e40af' // Blue
  const headerColor = '#374151' // Dark gray
  const textColor = '#111827' // Black
  const lightGray = '#6b7280'
  const borderColor = '#d1d5db'
  
  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10, color = textColor, style: 'normal' | 'bold' = 'normal') => {
    pdf.setFontSize(fontSize)
    pdf.setTextColor(color)
    pdf.setFont('helvetica', style)
    const lines = pdf.splitTextToSize(text, maxWidth)
    pdf.text(lines, x, y)
    return y + (lines.length * fontSize * 0.4) // Return new Y position
  }

  // Helper function to calculate project duration
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`
    }
    return 'Less than a day'
  }

  let yPosition = 25

  // Company Header Section
  pdf.setFillColor(248, 250, 252) // Light blue background
  pdf.rect(0, 0, pageWidth, 40, 'F')
  
  // Company letterhead
  pdf.setFontSize(20)
  pdf.setTextColor(primaryColor)
  pdf.setFont('helvetica', 'bold')
  pdf.text(experience.clientCompany, 20, 20)
  
  // Add a subtle line under company name
  pdf.setLineWidth(0.5)
  pdf.setDrawColor(primaryColor)
  pdf.line(20, 25, pageWidth - 20, 25)
  
  yPosition = 50

  // Certificate Title
  pdf.setFontSize(24)
  pdf.setTextColor(headerColor)
  pdf.setFont('helvetica', 'bold')
  pdf.text('EXPERIENCE CERTIFICATE', pageWidth / 2, yPosition, { align: 'center' })
  
  // Decorative line under title
  yPosition += 8
  pdf.setLineWidth(2)
  pdf.setDrawColor(primaryColor)
  pdf.line(pageWidth / 2 - 40, yPosition, pageWidth / 2 + 40, yPosition)
  
  yPosition += 20

  // Date (top right)
  pdf.setFontSize(10)
  pdf.setTextColor(textColor)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Date: ${format(new Date(), 'dd MMMM, yyyy')}`, pageWidth - 20, yPosition - 5, { align: 'right' })
  
  // Reference number (if needed)
  pdf.text(`Ref: EXP/${new Date().getFullYear()}/${experience.id.slice(-6).toUpperCase()}`, pageWidth - 20, yPosition + 5, { align: 'right' })
  
  yPosition += 15

  // Main content area with border
  const contentStartY = yPosition
  
  // To whom it may concern
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  yPosition = addText('TO WHOM IT MAY CONCERN', 20, yPosition, pageWidth - 40, 12, textColor, 'bold')
  yPosition += 10
  
  // Main certification paragraph
  pdf.setFont('helvetica', 'normal')
  const mainText = `This is to certify that Mr./Ms. ${experience.userName} has worked with ${experience.clientCompany} as a professional on the project "${experience.projectTitle}" from ${format(new Date(experience.startDate), 'dd MMMM yyyy')} to ${format(new Date(experience.endDate), 'dd MMMM yyyy')} (${calculateDuration(experience.startDate, experience.endDate)}).`
  
  yPosition = addText(mainText, 20, yPosition, pageWidth - 40, 11)
  yPosition += 10

  // Project Details Section
  if (experience.projectDescription) {
    pdf.setFont('helvetica', 'bold')
    yPosition = addText('Project Overview:', 20, yPosition, pageWidth - 40, 11, primaryColor, 'bold')
    yPosition += 3
    
    pdf.setFont('helvetica', 'normal')
    yPosition = addText(experience.projectDescription, 25, yPosition, pageWidth - 50, 10)
    yPosition += 8
  }

  // Technologies Section
  if (experience.technologies.length > 0) {
    pdf.setFont('helvetica', 'bold')
    yPosition = addText('Technologies & Tools Used:', 20, yPosition, pageWidth - 40, 11, primaryColor, 'bold')
    yPosition += 3
    
    pdf.setFont('helvetica', 'normal')
    yPosition = addText(experience.technologies.join(', '), 25, yPosition, pageWidth - 50, 10)
    yPosition += 8
  }

  // Key Skills Section
  if (experience.skills.length > 0) {
    pdf.setFont('helvetica', 'bold')
    yPosition = addText('Key Skills & Responsibilities:', 20, yPosition, pageWidth - 40, 11, primaryColor, 'bold')
    yPosition += 3
    
    pdf.setFont('helvetica', 'normal')
    yPosition = addText(experience.skills.join(', '), 25, yPosition, pageWidth - 50, 10)
    yPosition += 8
  }

  // Performance paragraph
  const performanceText = `During the tenure, ${experience.userName} has demonstrated excellent technical skills, professionalism, and commitment to delivering high-quality work. We found ${experience.userName} to be a reliable, hardworking, and technically competent professional.`
  yPosition = addText(performanceText, 20, yPosition, pageWidth - 40, 11)
  yPosition += 10

  // Recommendation
  const recommendationText = `We wish ${experience.userName} all the best for future endeavors and recommend them for similar roles.`
  yPosition = addText(recommendationText, 20, yPosition, pageWidth - 40, 11)
  yPosition += 20

  // Signature section
  if (experience.isVerified && experience.managerName && experience.managerTitle && experience.managerEmail) {
    // Verification badge
    pdf.setFontSize(9)
    pdf.setTextColor('#059669') // Green color
    pdf.setFont('helvetica', 'bold')
    
    // Add verification box
    pdf.setFillColor(220, 252, 231) // Light green background
    pdf.setDrawColor(34, 197, 94) // Green border
    pdf.roundedRect(pageWidth - 50, yPosition - 8, 40, 12, 2, 2, 'FD')
    pdf.text('✓ DIGITALLY VERIFIED', pageWidth - 30, yPosition - 2, { align: 'center' })
    
    yPosition += 15

    // Signature line
    pdf.setTextColor(textColor)
    pdf.setFont('helvetica', 'normal')
    yPosition = addText('Sincerely,', 20, yPosition, pageWidth - 40, 11)
    yPosition += 20

    // Signature placeholder
    pdf.setLineWidth(0.5)
    pdf.setDrawColor(lightGray)
    pdf.line(20, yPosition, 80, yPosition)
    yPosition += 8

    // Manager details
    pdf.setFont('helvetica', 'bold')
    yPosition = addText(experience.managerName || 'Manager Name', 20, yPosition, pageWidth - 40, 12, textColor, 'bold')
    yPosition += 5
    
    pdf.setFont('helvetica', 'normal')
    yPosition = addText(experience.managerTitle || 'Manager Title', 20, yPosition, pageWidth - 40, 10)
    yPosition += 4
    yPosition = addText(experience.clientCompany, 20, yPosition, pageWidth - 40, 10)
    yPosition += 4
    
    pdf.setTextColor(lightGray)
    yPosition = addText(`Email: ${experience.managerEmail || 'manager@company.com'}`, 20, yPosition, pageWidth - 40, 9, lightGray)
    
    if (experience.verifiedAt) {
      yPosition += 10
      pdf.setFontSize(8)
      yPosition = addText(`Digitally verified on: ${format(new Date(experience.verifiedAt), 'dd MMMM yyyy, HH:mm')} UTC`, 20, yPosition, pageWidth - 40, 8, lightGray)
    }
  } else {
    // Pending verification
    pdf.setFontSize(10)
    pdf.setTextColor('#d97706') // Orange color
    pdf.setFont('helvetica', 'bold')
    
    pdf.setFillColor(254, 243, 199) // Light orange background
    pdf.setDrawColor(245, 158, 11) // Orange border
    pdf.roundedRect(20, yPosition - 5, pageWidth - 40, 15, 2, 2, 'FD')
    pdf.text('⏳ PENDING VERIFICATION', pageWidth / 2, yPosition + 2, { align: 'center' })
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.text('This certificate will be digitally signed upon manager verification', pageWidth / 2, yPosition + 8, { align: 'center' })
  }

  // Footer
  const footerY = pageHeight - 20
  
  // Footer border
  pdf.setLineWidth(0.5)
  pdf.setDrawColor(borderColor)
  pdf.line(20, footerY - 10, pageWidth - 20, footerY - 10)
  
  pdf.setFontSize(8)
  pdf.setTextColor(lightGray)
  pdf.setFont('helvetica', 'normal')
  
  // Left footer - Generated info
  pdf.text('Generated by Experience Maker Platform', 20, footerY)
  pdf.text(`Certificate ID: ${experience.id}`, 20, footerY + 4)
  
  // Right footer - Date generated
  pdf.text(`Generated on: ${format(new Date(), 'dd MMM yyyy')}`, pageWidth - 20, footerY, { align: 'right' })
  pdf.text('This is a digitally generated document', pageWidth - 20, footerY + 4, { align: 'right' })

  // Add subtle border around the entire document
  pdf.setLineWidth(1)
  pdf.setDrawColor(borderColor)
  pdf.rect(10, 10, pageWidth - 20, pageHeight - 20)

  // Save the PDF
  const fileName = `${experience.userName.replace(/\s+/g, '_')}_Experience_Certificate_${experience.clientCompany.replace(/\s+/g, '_')}.pdf`
  pdf.save(fileName)
}

// Alternative method using HTML to Canvas (for browser-based generation)
export const generatePDFFromHTML = async (elementId: string, fileName: string) => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('Element not found')
    }

    // Create canvas from HTML
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(fileName)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}