
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import MedicineCard from '@/components/MedicineCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LogOut } from 'lucide-react';

interface LocationState {
  username: string;
  phoneNumber: string;
}

const PatientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<LocationState | null>(null);
  
  // Get the user data from location state
  useEffect(() => {
    const state = location.state as LocationState;
    
    if (!state || !state.username || !state.phoneNumber) {
      // No user data, redirect to login
      toast({
        title: "Session expired",
        description: "Please log in again to continue",
        variant: "destructive",
      });
      navigate('/patient/login');
      return;
    }
    
    setUserData(state);
  }, [location, navigate, toast]);
  
  // Handle logout
  const handleLogout = () => {
    navigate('/');
  };
  
  // Define medicines
  const medicines = [
    {
      type: 'fever' as const,
      title: 'Fever Relief',
      description: 'Paracetamol for reducing fever and pain relief',
    },
    {
      type: 'cough' as const,
      title: 'Cough Medicine',
      description: 'Cough syrup to relieve dry and wet cough symptoms',
    },
    {
      type: 'cold' as const,
      title: 'Cold Relief',
      description: 'Antihistamine for runny nose and cold symptoms',
    },
    {
      type: 'stomachAche' as const,
      title: 'Stomach Relief',
      description: 'Antacid for heartburn and upset stomach',
    }
  ];

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-medimate-gray">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="loading-dots flex">
            <div className="w-2 h-2 rounded-full bg-medimate-blue mx-1"></div>
            <div className="w-2 h-2 rounded-full bg-medimate-blue mx-1"></div>
            <div className="w-2 h-2 rounded-full bg-medimate-blue mx-1"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-medimate-gray">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col items-center md:items-stretch md:flex-row justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold">Hello, {userData.username}</h1>
            <p className="text-gray-600">Which medicine do you need today?</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {medicines.map((medicine, index) => (
            <motion.div
              key={medicine.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
            >
              <MedicineCard
                type={medicine.type}
                title={medicine.title}
                description={medicine.description}
                username={userData.username}
                phoneNumber={userData.phoneNumber}
              />
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="mt-12 text-center p-6 bg-white rounded-lg shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-4">How to Use MediMate</h2>
          <ol className="text-left max-w-lg mx-auto space-y-4 text-gray-600">
            <li className="flex items-start">
              <span className="flex items-center justify-center rounded-full bg-medimate-blue-light w-6 h-6 text-medimate-blue-dark font-medium mr-3 mt-0.5">1</span>
              <span>Select the medicine you need from the options above</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center rounded-full bg-medimate-blue-light w-6 h-6 text-medimate-blue-dark font-medium mr-3 mt-0.5">2</span>
              <span>Click the "Dispense Medicine" button</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center rounded-full bg-medimate-blue-light w-6 h-6 text-medimate-blue-dark font-medium mr-3 mt-0.5">3</span>
              <span>Wait for the medicine to be dispensed into the tray</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center rounded-full bg-medimate-blue-light w-6 h-6 text-medimate-blue-dark font-medium mr-3 mt-0.5">4</span>
              <span>Collect your medicine from the tray</span>
            </li>
          </ol>
        </motion.div>
      </main>
      
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MediMate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PatientDashboard;
