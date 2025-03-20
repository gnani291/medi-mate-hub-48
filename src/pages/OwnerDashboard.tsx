
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import PatientHistoryTable from '@/components/PatientHistoryTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { checkRaspberryPiStatus, getRaspberryPiInstructions, getRaspberryPiCode } from '@/lib/raspberryPi';
import { getMedicineInventory, updateMedicineCount, getUserStats } from '@/lib/db';
import { LogOut, Users, Pill, Check, X, Thermometer, Lung, Droplets, ArrowDown } from 'lucide-react';

interface Medicine {
  id: string;
  type: string;
  name: string;
  count: number;
  lastRefilled: Date;
}

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('inventory');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, todayUsers: 0, medicineDispensed: {} });
  const [piStatus, setPiStatus] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch medicine inventory
        const inventory = await getMedicineInventory();
        setMedicines(inventory);
        
        // Fetch user stats
        const userStats = await getUserStats();
        setStats(userStats);
        
        // Check Raspberry Pi status
        const status = await checkRaspberryPiStatus();
        setPiStatus(status);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading the dashboard data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  // Handle medicine count update
  const handleUpdateCount = async (id: string, newCount: number) => {
    try {
      await updateMedicineCount(id, newCount);
      
      // Update local state
      setMedicines(medicines.map(med => {
        if (med.id === id) {
          return { ...med, count: newCount, lastRefilled: new Date() };
        }
        return med;
      }));
      
      toast({
        title: "Inventory updated",
        description: "The medicine count has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating medicine count:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating the medicine count.",
        variant: "destructive",
      });
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    navigate('/');
  };
  
  // Get medicine type icon
  const getMedicineIcon = (type: string) => {
    switch (type) {
      case 'fever': return <Thermometer className="w-5 h-5" />;
      case 'cough': return <Lung className="w-5 h-5" />;
      case 'cold': return <Droplets className="w-5 h-5" />;
      case 'stomachAche': return <Pill className="w-5 h-5" />;
      default: return <Pill className="w-5 h-5" />;
    }
  };
  
  // Format medicine type label
  const formatMedicineType = (type: string) => {
    switch (type) {
      case 'fever': return 'Fever';
      case 'cough': return 'Cough';
      case 'cold': return 'Cold';
      case 'stomachAche': return 'Stomach Ache';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-medimate-gray">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-gray-600">Manage your MediMate vending machine</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-4 md:mt-0"
          >
            <Button 
              variant="outline" 
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </motion.div>
        </div>
        
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="w-6 h-6 text-medimate-blue mr-2" />
                <span className="text-3xl font-bold">
                  {isLoading ? '...' : stats.totalUsers}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="w-6 h-6 text-medimate-teal mr-2" />
                <span className="text-3xl font-bold">
                  {isLoading ? '...' : stats.todayUsers}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Raspberry Pi Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {piStatus === null ? (
                  <span className="flex items-center text-gray-500">
                    <ArrowDown className="w-6 h-6 mr-2 animate-pulse" />
                    <span className="text-xl">Checking...</span>
                  </span>
                ) : piStatus ? (
                  <span className="flex items-center text-green-500">
                    <Check className="w-6 h-6 mr-2" />
                    <span className="text-xl font-medium">Connected</span>
                  </span>
                ) : (
                  <span className="flex items-center text-red-500">
                    <X className="w-6 h-6 mr-2" />
                    <span className="text-xl font-medium">Disconnected</span>
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Tabs defaultValue="inventory" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="patients">Patient History</TabsTrigger>
              <TabsTrigger value="setup">Device Setup</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory" className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Medicine Inventory</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="loading-dots flex">
                    <div className="w-3 h-3 rounded-full bg-medimate-blue mx-1"></div>
                    <div className="w-3 h-3 rounded-full bg-medimate-blue mx-1"></div>
                    <div className="w-3 h-3 rounded-full bg-medimate-blue mx-1"></div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {medicines.map((medicine) => (
                    <Card key={medicine.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full mr-3 ${
                              medicine.type === 'fever' ? 'bg-rose-100 text-rose-500' :
                              medicine.type === 'cough' ? 'bg-amber-100 text-amber-500' :
                              medicine.type === 'cold' ? 'bg-indigo-100 text-indigo-500' :
                              'bg-emerald-100 text-emerald-500'
                            }`}>
                              {getMedicineIcon(medicine.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{medicine.name}</h3>
                              <p className="text-sm text-gray-500">{formatMedicineType(medicine.type)}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            medicine.count > 20 ? 'bg-green-100 text-green-800' :
                            medicine.count > 5 ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {medicine.count} left
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-4">
                          <Input 
                            type="number" 
                            min="0"
                            max="100"
                            defaultValue={medicine.count.toString()}
                            id={`medicine-count-${medicine.id}`}
                            className="w-24"
                          />
                          <Button 
                            onClick={() => {
                              const input = document.getElementById(`medicine-count-${medicine.id}`) as HTMLInputElement;
                              const newCount = parseInt(input.value);
                              if (!isNaN(newCount) && newCount >= 0) {
                                handleUpdateCount(medicine.id, newCount);
                              }
                            }}
                          >
                            Update
                          </Button>
                        </div>
                        
                        <div className="mt-4 text-xs text-gray-500">
                          Last refilled: {new Date(medicine.lastRefilled).toLocaleDateString()}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="patients">
              <h2 className="text-2xl font-semibold mb-4">Patient History</h2>
              <PatientHistoryTable />
            </TabsContent>
            
            <TabsContent value="setup" className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Raspberry Pi Setup</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold">Device Connection</h3>
                      <p className="text-gray-600">Connect your Raspberry Pi to control the servo motors</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      piStatus ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {piStatus ? 'Connected' : 'Disconnected'}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                        onClick={() => setShowInstructions(!showInstructions)}
                      >
                        <span>Setup Instructions</span>
                        <span>{showInstructions ? '▲' : '▼'}</span>
                      </Button>
                      
                      {showInstructions && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm">
                          <pre className="whitespace-pre-wrap font-mono text-xs overflow-auto max-h-[400px] p-4">
                            {getRaspberryPiInstructions()}
                          </pre>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                        onClick={() => setShowCode(!showCode)}
                      >
                        <span>Python Code for Raspberry Pi</span>
                        <span>{showCode ? '▲' : '▼'}</span>
                      </Button>
                      
                      {showCode && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm">
                          <pre className="whitespace-pre-wrap font-mono text-xs overflow-auto max-h-[400px] p-4">
                            {getRaspberryPiCode()}
                          </pre>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={async () => {
                        try {
                          setPiStatus(null); // Set to loading state
                          const status = await checkRaspberryPiStatus();
                          setPiStatus(status);
                          
                          toast({
                            title: status ? "Connection successful" : "Connection failed",
                            description: status 
                              ? "Successfully connected to Raspberry Pi" 
                              : "Could not connect to Raspberry Pi. Check your setup.",
                            variant: status ? "default" : "destructive",
                          });
                        } catch (error) {
                          console.error("Error checking connection:", error);
                          setPiStatus(false);
                          
                          toast({
                            title: "Connection error",
                            description: "There was an error checking the connection.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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

export default OwnerDashboard;
