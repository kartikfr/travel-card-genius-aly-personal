import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Gift, CheckCircle, Phone, CreditCard, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

const ClaimReward = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applicationId, setApplicationId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [rewardAmount, setRewardAmount] = useState("₹xxxx Amazon gift card");

  const handleSendOtp = async () => {
    if (!applicationId.trim()) {
      toast({
        title: "Application ID Required",
        description: "Please enter your Application ID to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!mobileNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to proceed.",
        variant: "destructive",
      });
      return;
    }

    // For demo - immediately show OTP screen
    setIsOtpSent(true);
    toast({
      title: "OTP Sent Successfully! 📱",
      description: `OTP has been sent to ${mobileNumber}`,
    });
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    // For demo - immediately show success
    setIsSuccessDialogOpen(true);
    
    // Trigger confetti with multiple bursts for celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Additional confetti burst after a delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { x: 0.3, y: 0.6 }
      });
    }, 500);
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { x: 0.7, y: 0.6 }
      });
    }, 1000);
    
    toast({
      title: "Verification Successful! 🎉",
      description: "Your application has been verified successfully!",
    });
  };

  const handleSuccessClose = () => {
    setIsSuccessDialogOpen(false);
    // Reset form
    setApplicationId("");
    setMobileNumber("");
    setOtp("");
    setIsOtpSent(false);
    navigate("/");
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Button 
          onClick={() => navigate(-1)}
          className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg border-none"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Claim Your Reward! 🎁
          </h1>
          <p className="text-lg text-gray-300">
            Thank you for applying for the card! Your application is approved. Please enter your Application ID and verify your phone number to check your cashback status.
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-center text-white flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              Reward Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
                         {/* Application ID Input */}
             <div className="space-y-2">
               <Label htmlFor="applicationId" className="text-white font-semibold flex items-center gap-2">
                 <CreditCard className="h-4 w-4" />
                 Application ID
               </Label>
               <Input
                 id="applicationId"
                 type="text"
                 placeholder="Enter your Application ID"
                 value={applicationId}
                 onChange={(e) => setApplicationId(e.target.value)}
                 className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                 disabled={isOtpSent}
               />
             </div>

             {/* Phone Number Input */}
             <div className="space-y-2">
               <Label htmlFor="mobileNumber" className="text-white font-semibold flex items-center gap-2">
                 <Phone className="h-4 w-4" />
                 Phone Number
               </Label>
                               <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                  disabled={isOtpSent}
                />
             </div>

                         {/* Get OTP Button */}
             {!isOtpSent && (
                               <Button
                  onClick={handleSendOtp}
                  disabled={!applicationId.trim() || !mobileNumber.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3"
                >
                  Get OTP
                </Button>
             )}

                                                   {/* OTP Input Section */}
              {isOtpSent && (
                <div className="space-y-4 animate-slide-up">
                  <div className="text-center">
                    <p className="text-gray-300 mb-4">
                      Enter 6-digit OTP
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      maxLength={6}
                      render={({ slots }) => (
                        <InputOTPGroup className="gap-2">
                          {slots.map((slot, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="w-12 h-12 text-lg font-bold bg-white/5 border-white/20 text-white focus:border-blue-400"
                            />
                          ))}
                        </InputOTPGroup>
                      )}
                    />
                  </div>
                  
                  {/* Fallback simple input in case OTP component doesn't work */}
                  <div className="text-center">
                    <Input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-48 mx-auto bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 text-center text-lg font-bold"
                      maxLength={6}
                    />
                  </div>

                  <Button
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3"
                  >
                    Verify
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>

        {/* Success Dialog */}
        <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
          <DialogContent className="bg-white/95 backdrop-blur-lg border-green-400/30 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
                <CheckCircle className="h-8 w-8" />
                Congratulations! 🎉
              </DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                <Gift className="h-8 w-8 text-white" />
              </div>
                             <p className="text-lg font-semibold text-gray-800">
                 We've sent your {rewardAmount} to your registered mobile number.
               </p>
              <Button
                onClick={handleSuccessClose}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3"
              >
                Thank You! 🎊
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ClaimReward; 