
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import VerificationModal from '@/components/VerificationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { authenticatePatient } from '@/lib/db';

const PatientLogin = () => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      toast({
        title: "Valid phone number required",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Authenticate the patient
      await authenticatePatient(username, phoneNumber);
      
      // Show verification modal
      setShowVerification(true);
      
      toast({
        title: "Verifying your number",
        description: `Please wait while we verify ${phoneNumber}`,
      });
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerified = () => {
    setShowVerification(false);
    // Navigate to the patient dashboard with the user data
    navigate('/patient/dashboard', { 
      state: { 
        username, 
        phoneNumber 
      } 
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-medimate-gray">
      <NavBar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg backdrop-blur-sm bg-white/95">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Patient Login</CardTitle>
              <CardDescription>
                Enter your details to access medicines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Your Name</Label>
                  <Input 
                    id="username"
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setPhoneNumber(value);
                    }}
                    className="h-12"
                    required
                    maxLength={10}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-medimate-blue hover:bg-medimate-blue-dark"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Verifying</span>
                      <div className="loading-dots flex">
                        <div className="w-1.5 h-1.5 rounded-full bg-white mx-0.5"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white mx-0.5"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white mx-0.5"></div>
                      </div>
                    </div>
                  ) : "Continue"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-500">
                Enter your information to access the medicine dispensing system
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
      
      {/* Verification Modal */}
      <VerificationModal 
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        phoneNumber={phoneNumber}
        onVerified={handleVerified}
      />
    </div>
  );
};

export default PatientLogin;
