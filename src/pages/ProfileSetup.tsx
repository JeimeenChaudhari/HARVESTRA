import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, MapPin, Building2, Sprout } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import avatar1 from '@/assets/avatar-1.png';
import avatar2 from '@/assets/avatar-2.png';
import avatar3 from '@/assets/avatar-3.png';
import avatar4 from '@/assets/avatar-4.png';

const districts = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
  'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
  'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

const panchayats = [
  'Aruvikkara', 'Nemom', 'Kazhakootam', 'Varkala', 'Attingal',
  'Kattakkada', 'Nedumangad', 'Parassala', 'Vattappara', 'Vellanad'
];

const crops = [
  { name: 'Rice', emoji: '🌾' },
  { name: 'Coconut', emoji: '🥥' },
  { name: 'Rubber', emoji: '🌳' },
  { name: 'Pepper', emoji: '🌶️' },
  { name: 'Cardamom', emoji: '🫚' },
  { name: 'Tea', emoji: '🍵' },
  { name: 'Coffee', emoji: '☕' },
  { name: 'Banana', emoji: '🍌' },
  { name: 'Tapioca', emoji: '🥔' },
  { name: 'Vegetables', emoji: '🥬' }
];

const avatars = [
  { id: '1', src: avatar1, alt: 'Farmer Avatar 1' },
  { id: '2', src: avatar2, alt: 'Farmer Avatar 2' },
  { id: '3', src: avatar3, alt: 'Farmer Avatar 3' },
  { id: '4', src: avatar4, alt: 'Farmer Avatar 4' }
];

const ProfileSetup = () => {
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [panchayat, setPanchayat] = useState('');
  const [crop, setCrop] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('1');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !district || !panchayat || !crop) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user found');
      }

      // Get phone from user metadata
      const phone = user.user_metadata.phone || user.email?.replace('@demo.com', '');

      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          name,
          phone,
          district,
          panchayat,
          primary_crop: crop,
          avatar: selectedAvatar
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Profile created successfully"
      });

      navigate('/app');
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
      <div className="bg-primary text-primary-foreground p-4">
        <h1 className="text-xl font-semibold">{t('completeProfile')}</h1>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              {t('chooseAvatar')}
            </label>
            <div className="grid grid-cols-4 gap-3">
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`relative aspect-square rounded-full overflow-hidden border-4 transition-all ${
                    selectedAvatar === avatar.id
                      ? 'border-primary scale-110'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <img 
                    src={avatar.src} 
                    alt={avatar.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              {t('fullName')}
            </label>
            <Input
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* District */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t('district')}
            </label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectDistrict')} />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Panchayat */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {t('panchayat')}
            </label>
            <Select value={panchayat} onValueChange={setPanchayat}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectPanchayat')} />
              </SelectTrigger>
              <SelectContent>
                {panchayats.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Primary Crop */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sprout className="w-4 h-4" />
              {t('primaryCrop')}
            </label>
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectCrop')} />
              </SelectTrigger>
              <SelectContent>
                {crops.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.emoji} {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full h-12"
            disabled={loading}
          >
            {loading ? 'Creating Profile...' : t('completeSetup')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
