/**
 * Utility functions for subscription plan features
 */

export interface SpecialistConsultation {
  specialization: string
  freeLimit: number | 'unlimited'
}

export interface LabTestDiscount {
  testType: string
  discountPercentage: number
}

export interface PharmacyDiscount {
  medicineType: string
  discountPercentage: number
}

/**
 * Parse specialist consultations from string format "specialization:limit"
 */
export function parseSpecialistConsultations(consultationsString: string): SpecialistConsultation[] {
  if (!consultationsString) return []
  
  return consultationsString
    .split(',')
    .map(item => item.trim())
    .filter(item => item)
    .map(item => {
      const [specialization, limitStr] = item.split(':').map(s => s.trim())
      const freeLimit = limitStr.toLowerCase() === 'unlimited' ? 'unlimited' : parseInt(limitStr)
      return {
        specialization,
        freeLimit
      }
    })
}

/**
 * Parse lab test discounts from string format "test_type:discount%"
 */
export function parseLabTestDiscounts(discountsString: string): LabTestDiscount[] {
  if (!discountsString) return []
  
  return discountsString
    .split(',')
    .map(item => item.trim())
    .filter(item => item)
    .map(item => {
      const [testType, discountStr] = item.split(':').map(s => s.trim())
      const discountPercentage = parseInt(discountStr.replace('%', ''))
      return {
        testType,
        discountPercentage
      }
    })
}

/**
 * Parse pharmacy discounts from string format "medicine_type:discount%"
 */
export function parsePharmacyDiscounts(discountsString: string): PharmacyDiscount[] {
  if (!discountsString) return []
  
  return discountsString
    .split(',')
    .map(item => item.trim())
    .filter(item => item)
    .map(item => {
      const [medicineType, discountStr] = item.split(':').map(s => s.trim())
      const discountPercentage = parseInt(discountStr.replace('%', ''))
      return {
        medicineType,
        discountPercentage
      }
    })
}

/**
 * Get consultation limit for a specific specialization
 */
export function getConsultationLimit(
  specialistConsultations: string, 
  specialization: string
): number | 'unlimited' | null {
  const consultations = parseSpecialistConsultations(specialistConsultations)
  const consultation = consultations.find(c => 
    c.specialization.toLowerCase() === specialization.toLowerCase()
  )
  return consultation ? consultation.freeLimit : null
}

/**
 * Get lab test discount for a specific test type
 */
export function getLabTestDiscount(
  labTestDiscounts: string, 
  testType: string
): number | null {
  const discounts = parseLabTestDiscounts(labTestDiscounts)
  
  // Check for specific test type first
  const specificDiscount = discounts.find(d => 
    d.testType.toLowerCase() === testType.toLowerCase()
  )
  if (specificDiscount) return specificDiscount.discountPercentage
  
  // Check for "all" discount
  const allDiscount = discounts.find(d => d.testType.toLowerCase() === 'all')
  return allDiscount ? allDiscount.discountPercentage : null
}

/**
 * Get pharmacy discount for a specific medicine type
 */
export function getPharmacyDiscount(
  pharmacyDiscounts: string, 
  medicineType: string
): number | null {
  const discounts = parsePharmacyDiscounts(pharmacyDiscounts)
  
  // Check for specific medicine type first
  const specificDiscount = discounts.find(d => 
    d.medicineType.toLowerCase() === medicineType.toLowerCase()
  )
  if (specificDiscount) return specificDiscount.discountPercentage
  
  // Check for "all" discount
  const allDiscount = discounts.find(d => d.medicineType.toLowerCase() === 'all')
  return allDiscount ? allDiscount.discountPercentage : null
}

/**
 * Format specialist consultations for display
 */
export function formatSpecialistConsultations(consultationsString: string): string {
  const consultations = parseSpecialistConsultations(consultationsString)
  return consultations
    .map(c => `${c.specialization}: ${c.freeLimit}`)
    .join(', ')
}

/**
 * Format lab test discounts for display
 */
export function formatLabTestDiscounts(discountsString: string): string {
  const discounts = parseLabTestDiscounts(discountsString)
  return discounts
    .map(d => `${d.testType}: ${d.discountPercentage}%`)
    .join(', ')
}

/**
 * Format pharmacy discounts for display
 */
export function formatPharmacyDiscounts(discountsString: string): string {
  const discounts = parsePharmacyDiscounts(discountsString)
  return discounts
    .map(d => `${d.medicineType}: ${d.discountPercentage}%`)
    .join(', ')
}

/**
 * Check if user has free consultations left for a specialization
 */
export function hasFreeConsultationsLeft(
  specialistConsultations: string,
  specialization: string,
  usedConsultations: number = 0
): boolean {
  const limit = getConsultationLimit(specialistConsultations, specialization)
  if (limit === null) return false
  if (limit === 'unlimited') return true
  return usedConsultations < limit
}

/**
 * Calculate discounted price for lab test
 */
export function calculateLabTestPrice(
  originalPrice: number,
  labTestDiscounts: string,
  testType: string
): number {
  const discount = getLabTestDiscount(labTestDiscounts, testType)
  if (discount === null) return originalPrice
  return originalPrice * (1 - discount / 100)
}

/**
 * Calculate discounted price for medicine
 */
export function calculateMedicinePrice(
  originalPrice: number,
  pharmacyDiscounts: string,
  medicineType: string
): number {
  const discount = getPharmacyDiscount(pharmacyDiscounts, medicineType)
  if (discount === null) return originalPrice
  return originalPrice * (1 - discount / 100)
}