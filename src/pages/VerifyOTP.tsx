import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, ArrowLeft } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const { phone, email, password } = location.state || {};

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter 6 digits",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // For demo: Any 6-digit OTP works, just sign in
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: "Verified!",
        description: "Phone verified successfully"
      });

      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile) {
        navigate('/profile-setup');
      } else {
        navigate('/app');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Green Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/auth')}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold">Phone Verification</h1>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/20 rounded-2xl mb-6">
            <Smartphone className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Verify Your Phone</h2>
          <p className="text-muted-foreground">Enter the OTP sent to your phone</p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-4">Enter OTP</label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={1} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={2} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={3} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={4} className="w-12 h-14 text-xl" />
                  <InputOTPSlot index={5} className="w-12 h-14 text-xl" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => navigate('/auth')}
              className="text-primary"
            >
              Change Phone Number
            </Button>
          </div>

          <Button
            onClick={handleVerify}
            className="w-full h-14 text-lg"
            disabled={loading || otp.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
