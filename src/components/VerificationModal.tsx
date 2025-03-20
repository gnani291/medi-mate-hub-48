
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onVerified: () => void;
}

const VerificationModal = ({ isOpen, onClose, phoneNumber, onVerified }: VerificationModalProps) => {
  const [countdown, setCountdown] = useState(3);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  // Automatic verification after countdown
  useEffect(() => {
    if (!isOpen || countdown <= 0) return;
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
      
      if (countdown === 1) {
        handleVerify();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, isOpen]);

  const handleVerify = () => {
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      toast({
        title: "Verification successful",
        description: "Your phone number has been verified.",
        variant: "default",
      });
      setIsVerifying(false);
      onVerified();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Verifying your phone</DialogTitle>
          <DialogDescription className="pt-2">
            We're verifying your number <strong>{phoneNumber}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 text-center">
          {countdown > 0 ? (
            <div className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-medimate-blue mb-2">{countdown}</div>
              <p>Automatic verification in progress...</p>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="text-xl">Completing verification...</div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-2">
          <Button 
            variant="default" 
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full"
          >
            {isVerifying ? "Verifying..." : "Verify Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;
