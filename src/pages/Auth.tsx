import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Smartphone } from 'lucide-react';

const Auth = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 10) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // For demo: Create account with phone as email
    const email = `${phone}@demo.com`;
    const password = phone + 'Demo123!';

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/profile-setup`,
          data: {
            phone: phone
          }
        }
      });

      if (error) {
        // If user exists, try to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;
      }

      toast({
        title: "Success!",
        description: "OTP sent successfully (demo mode)"
      });

      // Navigate to OTP page
      navigate('/verify-otp', { state: { phone, email, password } });
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
      <div className="bg-primary text-primary-foreground p-4">
        <h1 className="text-xl font-semibold">Phone Verification</h1>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/20 rounded-2xl mb-6">
            <Smartphone className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Verify Your Phone</h2>
          <p className="text-muted-foreground">We'll send you a verification code</p>
        </div>

        <form onSubmit={handleSendOTP} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <div className="flex gap-2">
              <div className="flex items-center justify-center px-4 bg-muted rounded-lg border">
                <span className="font-medium">+91</span>
              </div>
              <Input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1 h-14 text-lg"
                maxLength={10}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg"
            disabled={loading || phone.length < 10}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;
