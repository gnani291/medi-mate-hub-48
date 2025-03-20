
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Pill, Heart, Shield, Users } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <Pill className="w-12 h-12 text-medimate-blue" />,
      title: "Quick Medicine Dispensing",
      description: "Get the medicine you need in seconds with our intuitive interface and automated dispensing system."
    },
    {
      icon: <Heart className="w-12 h-12 text-medimate-blue" />,
      title: "Health Focused",
      description: "Designed with your health in mind, providing easy access to common medications when you need them."
    },
    {
      icon: <Shield className="w-12 h-12 text-medimate-blue" />,
      title: "Secure Authentication",
      description: "Your information is protected with secure phone verification to ensure authorized access."
    },
    {
      icon: <Users className="w-12 h-12 text-medimate-blue" />,
      title: "Simple User Interface",
      description: "Designed to be accessible for everyone, with a clear and straightforward user experience."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 text-center md:text-left"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  The Smart Way To Get Your <span className="text-medimate-blue">Medicine</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 md:max-w-md">
                  MediMate makes it easy to get the medicine you need with just a few taps. No waiting, no hassle.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link to="/patient/login">
                    <Button className="h-12 px-6 text-lg bg-medimate-blue hover:bg-medimate-blue-dark">
                      Get Medicine
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/owner/login">
                    <Button variant="outline" className="h-12 px-6 text-lg border-medimate-blue text-medimate-blue hover:bg-medimate-blue-light/20">
                      Owner Access
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-medimate-blue-light/30 to-medimate-blue/50 backdrop-blur-sm"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="glass-morphism rounded-xl p-6 w-[280px] text-center transform rotate-3 animate-float">
                      <div className="bg-medimate-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Pill className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">MediMate</h3>
                      <p className="text-sm text-gray-600">Your personal medicine dispenser</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-medimate-gray px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose MediMate?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our smart medicine vending machine makes getting medicine simple, quick, and accessible for everyone.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 px-4 text-center">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to try MediMate?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Get started by logging in as a patient or owner to experience the future of medicine dispensing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/patient/login">
                <Button className="h-12 px-8 text-lg bg-medimate-blue hover:bg-medimate-blue-dark">
                  Patient Login
                </Button>
              </Link>
              <Link to="/owner/login">
                <Button variant="outline" className="h-12 px-8 text-lg border-medimate-blue text-medimate-blue hover:bg-medimate-blue-light/20">
                  Owner Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-100 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} MediMate. All rights reserved.</p>
          <p className="text-sm text-gray-500 mt-2">Designed for accessible healthcare dispensing</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
