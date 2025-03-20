
// Mock database functions - in a real application, this would connect to a backend service or local storage

// Types
interface User {
  username: string;
  phoneNumber: string;
  isVerified: boolean;
}

interface PatientHistory {
  id: string;
  username: string;
  phoneNumber: string;
  medicineType: string;
  dispensedAt: Date;
}

interface Medicine {
  id: string;
  type: string;
  name: string;
  count: number;
  lastRefilled: Date;
}

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Initialize patient history in localStorage if it doesn't exist
const initPatientHistory = () => {
  if (!localStorage.getItem('patientHistory')) {
    localStorage.setItem('patientHistory', JSON.stringify([]));
  }
};

// Initialize medicines in localStorage if they don't exist
const initMedicines = () => {
  if (!localStorage.getItem('medicines')) {
    const initialMedicines = [
      {
        id: generateId(),
        type: 'fever',
        name: 'Paracetamol',
        count: 50,
        lastRefilled: new Date()
      },
      {
        id: generateId(),
        type: 'cough',
        name: 'Cough Syrup',
        count: 30,
        lastRefilled: new Date()
      },
      {
        id: generateId(),
        type: 'cold',
        name: 'Antihistamine',
        count: 40,
        lastRefilled: new Date()
      },
      {
        id: generateId(),
        type: 'stomachAche',
        name: 'Antacid',
        count: 45,
        lastRefilled: new Date()
      }
    ];
    
    localStorage.setItem('medicines', JSON.stringify(initialMedicines));
  }
};

// Initialize local storage
initPatientHistory();
initMedicines();

// Authenticate patient
export const authenticatePatient = async (username: string, phoneNumber: string): Promise<User> => {
  // In a real app, this would validate against a database
  
  // For demo purposes, always succeed and create a new user if needed
  const newUser = {
    username,
    phoneNumber,
    isVerified: false
  };
  
  // Simulate network request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(newUser);
    }, 1000);
  });
};

// Verify patient's phone number
export const verifyPatientPhone = async (phoneNumber: string): Promise<boolean> => {
  // In a real app, this would validate against a verification service
  
  // For demo purposes, always succeed
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

// Save dispensed medicine to history
export const saveMedicineDispensed = async (data: {
  username: string;
  phoneNumber: string;
  medicineType: string;
  dispensedAt: Date;
}): Promise<void> => {
  const history = JSON.parse(localStorage.getItem('patientHistory') || '[]');
  
  // Create new history entry
  const newEntry: PatientHistory = {
    id: generateId(),
    username: data.username,
    phoneNumber: data.phoneNumber,
    medicineType: data.medicineType,
    dispensedAt: data.dispensedAt
  };
  
  // Update medicines count
  const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
  const updatedMedicines = medicines.map((medicine: Medicine) => {
    if (medicine.type === data.medicineType && medicine.count > 0) {
      return { ...medicine, count: medicine.count - 1 };
    }
    return medicine;
  });
  
  // Save updated data
  localStorage.setItem('patientHistory', JSON.stringify([...history, newEntry]));
  localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
  
  return Promise.resolve();
};

// Get patient history
export const getPatientHistory = async (): Promise<PatientHistory[]> => {
  const history = JSON.parse(localStorage.getItem('patientHistory') || '[]');
  
  // Sort by date, newest first
  return history.sort((a: PatientHistory, b: PatientHistory) => 
    new Date(b.dispensedAt).getTime() - new Date(a.dispensedAt).getTime()
  );
};

// Get medicine inventory
export const getMedicineInventory = async (): Promise<Medicine[]> => {
  return JSON.parse(localStorage.getItem('medicines') || '[]');
};

// Update medicine count (refill)
export const updateMedicineCount = async (medicineId: string, newCount: number): Promise<void> => {
  const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
  
  const updatedMedicines = medicines.map((medicine: Medicine) => {
    if (medicine.id === medicineId) {
      return { 
        ...medicine, 
        count: newCount,
        lastRefilled: new Date()
      };
    }
    return medicine;
  });
  
  localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
  
  return Promise.resolve();
};

// Authenticate owner
export const authenticateOwner = async (username: string, password: string): Promise<boolean> => {
  // In a real app, this would validate against a secure database
  
  // For demo purposes, use a hardcoded owner credentials
  const validUsername = 'admin';
  const validPassword = 'admin';
  
  return username === validUsername && password === validPassword;
};

// Get user count stats
export const getUserStats = async (): Promise<{
  totalUsers: number;
  todayUsers: number;
  medicineDispensed: { [key: string]: number }
}> => {
  const history = JSON.parse(localStorage.getItem('patientHistory') || '[]');
  
  // Get unique users
  const uniqueUsers = new Set(history.map((entry: PatientHistory) => entry.phoneNumber));
  
  // Get today's users
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayEntries = history.filter((entry: PatientHistory) => {
    const entryDate = new Date(entry.dispensedAt);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
  
  const todayUniqueUsers = new Set(todayEntries.map((entry: PatientHistory) => entry.phoneNumber));
  
  // Count medicines dispensed by type
  const medicineDispensed: { [key: string]: number } = {};
  
  history.forEach((entry: PatientHistory) => {
    if (!medicineDispensed[entry.medicineType]) {
      medicineDispensed[entry.medicineType] = 0;
    }
    medicineDispensed[entry.medicineType]++;
  });
  
  return {
    totalUsers: uniqueUsers.size,
    todayUsers: todayUniqueUsers.size,
    medicineDispensed
  };
};
