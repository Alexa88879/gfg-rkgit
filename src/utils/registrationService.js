// Registration Management Service
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  limit,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { formatYearForDisplay, formatYearForDatabase } from './eventService';

export const registrationService = {
  // Register for event
  async registerForEvent(eventId, registrationData, formConfig) {
    try {
      // Validate registration data
      const validation = this.validateRegistrationData(registrationData, formConfig);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Check for duplicate registration
      const isDuplicate = await this.checkDuplicateRegistration(eventId, registrationData.email);
      if (isDuplicate) {
        return { success: false, error: 'You have already registered for this event' };
      }

      // Check if event has available seats
      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (!eventDoc.exists()) {
        return { success: false, error: 'Event not found' };
      }

      const eventData = eventDoc.data();
      if (eventData.currentParticipants >= eventData.maxParticipants) {
        return { success: false, error: 'Event is full' };
      }

      // Convert year format for database storage
      const processedData = {
        ...registrationData,
        year: formatYearForDatabase(registrationData.year)
      };
      

      // Create registration
      const registrationRef = await addDoc(collection(db, 'registrations'), {
        eventId,
        ...processedData,
        registrationDate: serverTimestamp(),
        status: 'confirmed'
      });

      // Update event participant count
      try {
        await this.updateEventParticipantCount(eventId, 1);
      } catch (error) {
        console.error('Failed to update participant count:', error);
      }

      return { success: true, id: registrationRef.id };
    } catch (error) {
      console.error('Error registering for event:', error);
      return { success: false, error: error.message };
    }
  },

  // Check for duplicate registration
  async checkDuplicateRegistration(eventId, email) {
    try {
      const registrationsSnapshot = await getDocs(
        query(
          collection(db, 'registrations'),
          where('eventId', '==', eventId),
          where('email', '==', email)
        )
      );
      return !registrationsSnapshot.empty;
    } catch (error) {
      console.error('Error checking duplicate registration:', error);
      return false;
    }
  },

  // Update event participant count
  async updateEventParticipantCount(eventId, incrementValue) {
    try {
      // First, get the current event to check if currentParticipants exists
      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        const currentCount = eventData.currentParticipants || 0;
        const newCount = currentCount + incrementValue;
        
        await updateDoc(doc(db, 'events', eventId), {
          currentParticipants: newCount,
          updatedAt: serverTimestamp()
        });
      } else {
        console.error('Event document not found:', eventId);
        throw new Error('Event not found');
      }
    } catch (error) {
      console.error('Error updating participant count:', error);
      throw error; // Re-throw to be caught by caller
    }
  },

  // Get registrations for specific event
  async getEventRegistrations(eventId) {
    try {
      const registrationsSnapshot = await getDocs(
        query(
          collection(db, 'registrations'),
          where('eventId', '==', eventId),
          orderBy('registrationDate', 'desc')
        )
      );
      
      const registrations = registrationsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          year: formatYearForDisplay(data.year) // Convert to display format
        };
      });

      return { success: true, data: registrations };
    } catch (error) {
      console.error('Error fetching event registrations:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all registrations (Admin only)
  async getAllRegistrations() {
    try {
      const registrationsSnapshot = await getDocs(
        query(collection(db, 'registrations'), orderBy('registrationDate', 'desc'))
      );
      
      const registrations = registrationsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          year: formatYearForDisplay(data.year) // Convert to display format
        };
      });

      return { success: true, data: registrations };
    } catch (error) {
      console.error('Error fetching all registrations:', error);
      return { success: false, error: error.message };
    }
  },

  // Get registration statistics for event
  async getRegistrationStats(eventId) {
    try {
      const registrationsResult = await this.getEventRegistrations(eventId);
      if (!registrationsResult.success) {
        return { success: false, error: registrationsResult.error };
      }

      const registrations = registrationsResult.data;
      const stats = {
        totalRegistrations: registrations.length,
        byBranch: {},
        byYear: {},
        bySection: {}
      };

      registrations.forEach(registration => {
        // Count by branch
        stats.byBranch[registration.branch] = (stats.byBranch[registration.branch] || 0) + 1;
        
        // Count by year
        stats.byYear[registration.year] = (stats.byYear[registration.year] || 0) + 1;
        
        // Count by section
        stats.bySection[registration.section] = (stats.bySection[registration.section] || 0) + 1;
      });

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error fetching registration stats:', error);
      return { success: false, error: error.message };
    }
  },

  // Validate registration data
  validateRegistrationData(data, formConfig) {
    const errors = [];

    // Required fields validation
    const requiredFields = ['name', 'email', 'rollNumber', 'section', 'branch', 'year'];
    requiredFields.forEach(field => {
      if (!data[field] || data[field].trim() === '') {
        errors.push(`${field} is required`);
      }
    });

    // Email validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address');
    }

    // Section validation
    if (data.section && !formConfig.sectionOptions.includes(data.section)) {
      errors.push('Invalid section selected');
    }

    // Branch validation
    if (data.branch && !formConfig.branchOptions.includes(data.branch)) {
      errors.push('Invalid branch selected');
    }

    // Year validation
    if (data.year && !formConfig.yearOptions.includes(formatYearForDatabase(data.year))) {
      errors.push('Invalid year selected');
    }

    // Phone validation (if enabled)
    if (formConfig.optionalFields.phone && data.phone) {
      if (!/^[0-9]{10}$/.test(data.phone)) {
        errors.push('Please enter a valid 10-digit phone number');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};