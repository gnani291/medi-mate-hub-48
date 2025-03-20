
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onVerified: () => void;
}

const VerificationModal = ({ isOpen, onClose, phoneNumber, onVerified }: VerificationModalProps) => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  // Simulate OTP verification - in real app this would connect to a service
  const verifyOtp = () => {
    // For demo purposes, any 4-digit code is accepted
    if (otp.length === 4) {
      toast({
        title: "Verification successful",
        description: "Your phone number has been verified.",
        variant: "default",
      });
      onVerified();
    } else {
      toast({
        title: "Invalid verification code",
        description: "Please enter a valid 4-digit code.",
        variant: "destructive",
      });
    }
  };

  const resendOtp = () => {
    setIsResending(true);
    
    // Simulate OTP sending - in real app this would call a service
    setTimeout(() => {
      setCountdown(30);
      setIsResending(false);
      
      toast({
        title: "Verification code resent",
        description: `A new code has been sent to ${phoneNumber}`,
        variant: "default",
      });
    }, 1000);
  };

  // Countdown timer
  useEffect(() => {
    if (!isOpen || countdown <= 0) return;
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Verify your phone</DialogTitle>
          <DialogDescription className="pt-2">
            We've sent a verification code to <strong>{phoneNumber}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Input
              id="otp"
              placeholder="Enter 4-digit code"
              type="text"
              maxLength={4}
              inputMode="numeric"
              pattern="[0-9]*"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              className="text-center text-xl tracking-widest h-14"
            />
            
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Didn't receive a code?{' '}
              {countdown > 0 ? (
                <span>Resend in {countdown}s</span>
              ) : (
                <button 
                  onClick={resendOtp} 
                  disabled={isResending}
                  className="text-medimate-blue hover:text-medimate-blue-dark font-medium"
                >
                  Resend code
                </button>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end mt-2">
          <Button 
            variant="default" 
            onClick={verifyOtp}
            disabled={otp.length !== 4}
            className="w-full"
          >
            Verify
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;
