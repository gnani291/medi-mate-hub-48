
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { authenticateOwner } from '@/lib/db';
import { Eye, EyeOff } from 'lucide-react';

const OwnerLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Invalid credentials",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const isAuthenticated = await authenticateOwner(username, password);
      
      if (isAuthenticated) {
        toast({
          title: "Login successful",
          description: "Welcome to the owner dashboard",
        });
        
        navigate('/owner/dashboard');
      } else {
        toast({
          title: "Authentication failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Login failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              <CardTitle className="text-2xl font-bold">Owner Access</CardTitle>
              <CardDescription>
                Log in to manage your MediMate system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-medimate-teal hover:bg-medimate-teal-dark"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Logging in</span>
                        <div className="loading-dots flex">
                          <div className="w-1.5 h-1.5 rounded-full bg-white mx-0.5"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white mx-0.5"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-white mx-0.5"></div>
                        </div>
                      </div>
                    ) : "Login"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center text-center">
              <p className="text-sm text-gray-500">
                Default credentials for demo: <br />
                Username: admin, Password: admin
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default OwnerLogin;
