// Event Management Service
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// Year format conversion functions
export const formatYearForDisplay = (year) => {
  const yearMap = {
    '1': '1st Year',
    '2': '2nd Year', 
    '3': '3rd Year',
    '4': '4th Year'
  };
  return yearMap[year] || year;
};

export const formatYearForDatabase = (displayYear) => {
  // If it's already a number, return as is
  if (typeof displayYear === 'number' || /^[1-4]$/.test(displayYear)) {
    return displayYear.toString();
  }
  
  // If it's formatted text, convert to number
  const yearMap = {
    '1st Year': '1',
    '2nd Year': '2',
    '3rd Year': '3', 
    '4th Year': '4'
  };
  return yearMap[displayYear] || displayYear;
};

// Event type icon detection
export const getEventTypeIcon = (title) => {
  const lowerTitle = title.toLowerCase();
  
  // Cloud & AWS Events
  if (lowerTitle.includes('aws')) {
    return 'Cloud';
  }
  else if (lowerTitle.includes('cloud') || lowerTitle.includes('azure') || lowerTitle.includes('gcp')) {
    return 'Cloud';
  }
  // AI/ML Events
  else if (lowerTitle.includes('ai') || lowerTitle.includes('ml') || lowerTitle.includes('machine learning') || lowerTitle.includes('artificial intelligence')) {
    return 'Brain';
  }
  // Programming & Development
  else if (lowerTitle.includes('python') || lowerTitle.includes('javascript') || lowerTitle.includes('react') || lowerTitle.includes('node') || lowerTitle.includes('programming') || lowerTitle.includes('coding')) {
    return 'Code';
  }
  // Web Development
  else if (lowerTitle.includes('web') || lowerTitle.includes('frontend') || lowerTitle.includes('backend') || lowerTitle.includes('fullstack')) {
    return 'Globe';
  }
  // Database Events
  else if (lowerTitle.includes('database') || lowerTitle.includes('sql') || lowerTitle.includes('mongodb') || lowerTitle.includes('mysql')) {
    return 'Database';
  }
  // Cybersecurity
  else if (lowerTitle.includes('security') || lowerTitle.includes('cyber') || lowerTitle.includes('hacking') || lowerTitle.includes('ethical')) {
    return 'Shield';
  }
  // Data Science
  else if (lowerTitle.includes('data') || lowerTitle.includes('analytics') || lowerTitle.includes('statistics') || lowerTitle.includes('science')) {
    return 'BarChart';
  }
  // Mobile Development
  else if (lowerTitle.includes('mobile') || lowerTitle.includes('android') || lowerTitle.includes('ios') || lowerTitle.includes('flutter')) {
    return 'Smartphone';
  }
  // DevOps
  else if (lowerTitle.includes('devops') || lowerTitle.includes('docker') || lowerTitle.includes('kubernetes') || lowerTitle.includes('ci/cd')) {
    return 'Settings';
  }
  // Blockchain
  else if (lowerTitle.includes('blockchain') || lowerTitle.includes('crypto') || lowerTitle.includes('bitcoin') || lowerTitle.includes('ethereum')) {
    return 'Coins';
  }
  // Competitions & Contests
  else if (lowerTitle.includes('competition') || lowerTitle.includes('contest') || lowerTitle.includes('hackathon') || lowerTitle.includes('challenge')) {
    return 'Trophy';
  }
  // Seminars & Talks
  else if (lowerTitle.includes('seminar') || lowerTitle.includes('talk') || lowerTitle.includes('lecture') || lowerTitle.includes('presentation')) {
    return 'PresentationChart';
  }
  // Career & Placement
  else if (lowerTitle.includes('career') || lowerTitle.includes('placement') || lowerTitle.includes('job') || lowerTitle.includes('interview')) {
    return 'Briefcase';
  }
  // Networking Events
  else if (lowerTitle.includes('networking') || lowerTitle.includes('meetup') || lowerTitle.includes('community')) {
    return 'Users';
  }
  // Workshops (General)
  else if (lowerTitle.includes('workshop')) {
    return 'Wrench';
  }
  // Default
  else {
    return 'Calendar';
  }
};

// Event type color detection
export const getEventTypeColor = (title) => {
  const lowerTitle = title.toLowerCase();
  
  // Cloud & AWS Events
  if (lowerTitle.includes('aws')) {
    return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
  }
  else if (lowerTitle.includes('cloud') || lowerTitle.includes('azure') || lowerTitle.includes('gcp')) {
    return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
  }
  // AI/ML Events
  else if (lowerTitle.includes('ai') || lowerTitle.includes('ml') || lowerTitle.includes('machine learning') || lowerTitle.includes('artificial intelligence')) {
    return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
  }
  // Programming & Development
  else if (lowerTitle.includes('python') || lowerTitle.includes('javascript') || lowerTitle.includes('react') || lowerTitle.includes('node') || lowerTitle.includes('programming') || lowerTitle.includes('coding')) {
    return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
  }
  // Web Development
  else if (lowerTitle.includes('web') || lowerTitle.includes('frontend') || lowerTitle.includes('backend') || lowerTitle.includes('fullstack')) {
    return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
  }
  // Database Events
  else if (lowerTitle.includes('database') || lowerTitle.includes('sql') || lowerTitle.includes('mongodb') || lowerTitle.includes('mysql')) {
    return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400';
  }
  // Cybersecurity
  else if (lowerTitle.includes('security') || lowerTitle.includes('cyber') || lowerTitle.includes('hacking') || lowerTitle.includes('ethical')) {
    return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
  }
  // Data Science
  else if (lowerTitle.includes('data') || lowerTitle.includes('analytics') || lowerTitle.includes('statistics') || lowerTitle.includes('science')) {
    return 'text-teal-600 bg-teal-100 dark:bg-teal-900/20 dark:text-teal-400';
  }
  // Mobile Development
  else if (lowerTitle.includes('mobile') || lowerTitle.includes('android') || lowerTitle.includes('ios') || lowerTitle.includes('flutter')) {
    return 'text-pink-600 bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400';
  }
  // DevOps
  else if (lowerTitle.includes('devops') || lowerTitle.includes('docker') || lowerTitle.includes('kubernetes') || lowerTitle.includes('ci/cd')) {
    return 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400';
  }
  // Blockchain
  else if (lowerTitle.includes('blockchain') || lowerTitle.includes('crypto') || lowerTitle.includes('bitcoin') || lowerTitle.includes('ethereum')) {
    return 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400';
  }
  // Competitions & Contests
  else if (lowerTitle.includes('competition') || lowerTitle.includes('contest') || lowerTitle.includes('hackathon') || lowerTitle.includes('challenge')) {
    return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
  }
  // Seminars & Talks
  else if (lowerTitle.includes('seminar') || lowerTitle.includes('talk') || lowerTitle.includes('lecture') || lowerTitle.includes('presentation')) {
    return 'text-violet-600 bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400';
  }
  // Career & Placement
  else if (lowerTitle.includes('career') || lowerTitle.includes('placement') || lowerTitle.includes('job') || lowerTitle.includes('interview')) {
    return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400';
  }
  // Networking Events
  else if (lowerTitle.includes('networking') || lowerTitle.includes('meetup') || lowerTitle.includes('community')) {
    return 'text-sky-600 bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400';
  }
  // Workshops (General)
  else if (lowerTitle.includes('workshop')) {
    return 'text-slate-600 bg-slate-100 dark:bg-slate-900/20 dark:text-slate-400';
  }
  // Default
  else {
    return 'text-primary bg-primary/10';
  }
};

export const eventService = {
  // Create new event (Super Admin only)
  async createEvent(eventData) {
    try {
      const eventRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        currentParticipants: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: eventRef.id };
    } catch (error) {
      console.error('Error creating event:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all events
  async getAllEvents() {
    try {
      const eventsSnapshot = await getDocs(
        query(collection(db, 'events'), orderBy('createdAt', 'desc'))
      );
      return {
        success: true,
        data: eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      };
    } catch (error) {
      console.error('Error fetching events:', error);
      return { success: false, error: error.message };
    }
  },

  // Get single event
  async getEvent(eventId) {
    try {
      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (eventDoc.exists()) {
        return { success: true, data: { id: eventDoc.id, ...eventDoc.data() } };
      } else {
        return { success: false, error: 'Event not found' };
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      return { success: false, error: error.message };
    }
  },

  // Update event (Super Admin only)
  async updateEvent(eventId, updates) {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating event:', error);
      return { success: false, error: error.message };
    }
  },

  // Update event status
  async updateEventStatus(eventId, status) {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        status,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating event status:', error);
      return { success: false, error: error.message };
    }
  },

  // Get active events for public registration
  async getActiveEvents() {
    try {
      const eventsSnapshot = await getDocs(
        query(
          collection(db, 'events'),
          where('status', '==', 'active'),
          orderBy('date', 'asc')
        )
      );
      return {
        success: true,
        data: eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      };
    } catch (error) {
      console.error('Error fetching active events:', error);
      return { success: false, error: error.message };
    }
  },

  // Validate form configuration
  validateFormConfig(formConfig) {
    const errors = [];

    // Validate section options
    const validSections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    if (!formConfig.sectionOptions || !Array.isArray(formConfig.sectionOptions)) {
      errors.push('Section options must be an array');
    } else if (!formConfig.sectionOptions.every(section => validSections.includes(section))) {
      errors.push('Invalid section options');
    }

    // Validate branch options
    const validBranches = ['CSE', 'IT', 'CS', 'AIML', 'DS', 'ECE', 'IOT', 'BCA', 'MCA', 'MBA'];
    if (!formConfig.branchOptions || !Array.isArray(formConfig.branchOptions)) {
      errors.push('Branch options must be an array');
    } else if (!formConfig.branchOptions.every(branch => validBranches.includes(branch))) {
      errors.push('Invalid branch options');
    }

    // Validate year options
    const validYears = ['1', '2', '3', '4'];
    if (!formConfig.yearOptions || !Array.isArray(formConfig.yearOptions)) {
      errors.push('Year options must be an array');
    } else if (!formConfig.yearOptions.every(year => validYears.includes(year))) {
      errors.push('Invalid year options');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};