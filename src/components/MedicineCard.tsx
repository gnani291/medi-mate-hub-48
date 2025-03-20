import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { dispenseFromRaspberryPi } from '@/lib/raspberryPi';
import { saveMedicineDispensed } from '@/lib/db';
import { Thermometer, Wind, Droplets, Pill } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type MedicineType = 'fever' | 'cough' | 'cold' | 'stomachAche';

interface MedicineCardProps {
  type: MedicineType;
  title: string;
  description: string;
  username: string;
  phoneNumber: string;
}

const getIcon = (type: MedicineType) => {
  switch (type) {
    case 'fever':
      return <Thermometer className="w-8 h-8" />;
    case 'cough':
      return <Wind className="w-8 h-8" />;
    case 'cold':
      return <Droplets className="w-8 h-8" />;
    case 'stomachAche':
      return <Pill className="w-8 h-8" />;
  }
};

const getBgColor = (type: MedicineType) => {
  switch (type) {
    case 'fever':
      return 'bg-gradient-to-br from-red-50 to-rose-100';
    case 'cough':
      return 'bg-gradient-to-br from-amber-50 to-yellow-100';
    case 'cold':
      return 'bg-gradient-to-br from-blue-50 to-indigo-100';
    case 'stomachAche':
      return 'bg-gradient-to-br from-green-50 to-emerald-100';
  }
};

const getBorderColor = (type: MedicineType) => {
  switch (type) {
    case 'fever':
      return 'border-rose-200';
    case 'cough':
      return 'border-amber-200';
    case 'cold':
      return 'border-indigo-200';
    case 'stomachAche':
      return 'border-emerald-200';
  }
};

const MedicineCard = ({ type, title, description, username, phoneNumber }: MedicineCardProps) => {
  const [isDispensing, setIsDispensing] = useState(false);
  const { toast } = useToast();

  const handleDispense = async () => {
    try {
      setIsDispensing(true);
      
      // Show toast notification
      toast({
        title: "Dispensing medicine...",
        description: `Preparing ${title} medicine. Please wait.`,
        duration: 2000,
      });
      
      // Dispense the medicine
      const motorNumber = type === 'fever' ? 1 : 
                           type === 'cough' ? 2 : 
                           type === 'cold' ? 3 : 4;
      
      await dispenseFromRaspberryPi(motorNumber);
      
      // Save to database
      await saveMedicineDispensed({
        username,
        phoneNumber,
        medicineType: type,
        dispensedAt: new Date()
      });
      
      // Show success notification
      toast({
        title: "Medicine dispensed!",
        description: "Please collect your medicine from the tray.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error dispensing medicine:", error);
      
      // Show error notification
      toast({
        title: "Error dispensing medicine",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDispensing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-xl p-6 border shadow-sm",
        getBgColor(type),
        getBorderColor(type)
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn(
          "p-3 rounded-full",
          type === 'fever' ? 'bg-rose-200' : 
          type === 'cough' ? 'bg-amber-200' : 
          type === 'cold' ? 'bg-indigo-200' : 
          'bg-emerald-200'
        )}>
          {getIcon(type)}
        </div>
        <span className="text-xs font-medium uppercase tracking-wider px-2 py-1 rounded-full bg-white/50 backdrop-blur-sm">
          Medicine
        </span>
      </div>
      
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      
      <button
        onClick={handleDispense}
        disabled={isDispensing}
        className={cn(
          "mt-6 w-full py-3 rounded-lg font-medium text-white transition-all duration-200",
          isDispensing ? "opacity-70 cursor-not-allowed" : "hover:shadow-md transform hover:-translate-y-1",
          type === 'fever' ? 'bg-rose-500 hover:bg-rose-600' : 
          type === 'cough' ? 'bg-amber-500 hover:bg-amber-600' : 
          type === 'cold' ? 'bg-indigo-500 hover:bg-indigo-600' : 
          'bg-emerald-500 hover:bg-emerald-600'
        )}
      >
        {isDispensing ? (
          <div className="flex items-center justify-center space-x-2">
            <span>Dispensing</span>
            <div className="loading-dots flex">
              <div className="w-1.5 h-1.5 rounded-full bg-white mx-0.5"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white mx-0.5"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white mx-0.5"></div>
            </div>
          </div>
        ) : "Dispense Medicine"}
      </button>
    </motion.div>
  );
};

export default MedicineCard;
