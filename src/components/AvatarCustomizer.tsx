import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Crown, Palette, Lock, Sparkles, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AvatarItem {
  id: string;
  name: string;
  emoji: string;
  category: 'basic' | 'premium' | 'rare' | 'legendary';
  points_cost: number;
  unlocked: boolean;
  equipped: boolean;
}

interface FrameItem {
  id: string;
  name: string;
  css_class: string;
  category: 'basic' | 'premium' | 'rare' | 'legendary';
  points_cost: number;
  unlocked: boolean;
  equipped: boolean;
}

interface AvatarCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userPoints: number;
  onPointsSpent: (amount: number) => void;
}

export const AvatarCustomizer = ({ open, onOpenChange, userPoints, onPointsSpent }: AvatarCustomizerProps) => {
  const { toast } = useToast();
  const [avatars, setAvatars] = useState<AvatarItem[]>([]);
  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [currentAvatar, setCurrentAvatar] = useState<string>('🌾');
  const [currentFrame, setCurrentFrame] = useState<string>('basic');

  useEffect(() => {
    loadCustomizationItems();
  }, []);

  const loadCustomizationItems = () => {
    // Avatar collection
    const avatarCollection: AvatarItem[] = [
      // Basic avatars (always unlocked)
      { id: 'farmer', name: 'Farmer', emoji: '🌾', category: 'basic', points_cost: 0, unlocked: true, equipped: true },
      { id: 'plant', name: 'Seedling', emoji: '🌱', category: 'basic', points_cost: 0, unlocked: true, equipped: false },
      { id: 'tree', name: 'Tree', emoji: '🌳', category: 'basic', points_cost: 0, unlocked: true, equipped: false },
      
      // Premium avatars
      { id: 'sunflower', name: 'Sunflower', emoji: '🌻', category: 'premium', points_cost: 50, unlocked: false, equipped: false },
      { id: 'corn', name: 'Corn', emoji: '🌽', category: 'premium', points_cost: 50, unlocked: false, equipped: false },
      { id: 'tomato', name: 'Tomato', emoji: '🍅', category: 'premium', points_cost: 75, unlocked: false, equipped: false },
      { id: 'carrot', name: 'Carrot', emoji: '🥕', category: 'premium', points_cost: 75, unlocked: false, equipped: false },
      
      // Rare avatars
      { id: 'rainbow', name: 'Rainbow Flower', emoji: '🌈', category: 'rare', points_cost: 150, unlocked: false, equipped: false },
      { id: 'butterfly', name: 'Butterfly', emoji: '🦋', category: 'rare', points_cost: 200, unlocked: false, equipped: false },
      { id: 'bee', name: 'Busy Bee', emoji: '🐝', category: 'rare', points_cost: 200, unlocked: false, equipped: false },
      
      // Legendary avatars
      { id: 'crown_plant', name: 'Royal Sprout', emoji: '👑', category: 'legendary', points_cost: 500, unlocked: false, equipped: false },
      { id: 'diamond', name: 'Diamond Seed', emoji: '💎', category: 'legendary', points_cost: 750, unlocked: false, equipped: false },
      { id: 'star', name: 'Star Farmer', emoji: '⭐', category: 'legendary', points_cost: 1000, unlocked: false, equipped: false },
    ];

    // Frame collection
    const frameCollection: FrameItem[] = [
      // Basic frames
      { id: 'basic', name: 'No Frame', css_class: '', category: 'basic', points_cost: 0, unlocked: true, equipped: true },
      { id: 'green', name: 'Green Border', css_class: 'border-4 border-green-500', category: 'basic', points_cost: 25, unlocked: false, equipped: false },
      
      // Premium frames
      { id: 'gold', name: 'Golden Frame', css_class: 'border-4 border-yellow-500 shadow-lg shadow-yellow-500/50', category: 'premium', points_cost: 100, unlocked: false, equipped: false },
      { id: 'rainbow_frame', name: 'Rainbow Frame', css_class: 'border-4 border-gradient-to-r from-red-500 via-purple-500 to-blue-500', category: 'premium', points_cost: 150, unlocked: false, equipped: false },
      
      // Rare frames
      { id: 'glowing', name: 'Glowing Frame', css_class: 'border-4 border-purple-500 shadow-2xl shadow-purple-500/75 animate-pulse', category: 'rare', points_cost: 300, unlocked: false, equipped: false },
      { id: 'diamond_frame', name: 'Diamond Frame', css_class: 'border-4 border-blue-400 shadow-2xl shadow-blue-400/75', category: 'rare', points_cost: 400, unlocked: false, equipped: false },
      
      // Legendary frames
      { id: 'crown_frame', name: 'Royal Crown', css_class: 'border-4 border-yellow-400 shadow-2xl shadow-yellow-400/90 relative before:content-["👑"] before:absolute before:-top-2 before:left-1/2 before:transform before:-translate-x-1/2', category: 'legendary', points_cost: 800, unlocked: false, equipped: false },
      { id: 'cosmic', name: 'Cosmic Aura', css_class: 'border-4 border-indigo-600 shadow-2xl shadow-indigo-600/90 relative before:content-["✨"] before:absolute before:-top-1 before:-right-1', category: 'legendary', points_cost: 1200, unlocked: false, equipped: false },
    ];

    setAvatars(avatarCollection);
    setFrames(frameCollection);
    setCurrentAvatar(avatarCollection.find(a => a.equipped)?.emoji || '🌾');
    setCurrentFrame(frameCollection.find(f => f.equipped)?.id || 'basic');
  };

  const unlockItem = (item: AvatarItem | FrameItem, type: 'avatar' | 'frame') => {
    if (userPoints < item.points_cost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${item.points_cost - userPoints} more points to unlock this ${type}.`,
        variant: "destructive"
      });
      return;
    }

    if (type === 'avatar') {
      setAvatars(prev => prev.map(a => 
        a.id === item.id ? { ...a, unlocked: true } : a
      ));
    } else {
      setFrames(prev => prev.map(f => 
        f.id === item.id ? { ...f, unlocked: true } : f
      ));
    }

    onPointsSpent(item.points_cost);
    
    toast({
      title: `🎉 ${item.name} Unlocked!`,
      description: `You've successfully unlocked the ${item.name} ${type}!`,
    });
  };

  const equipItem = (item: AvatarItem | FrameItem, type: 'avatar' | 'frame') => {
    if (type === 'avatar') {
      setAvatars(prev => prev.map(a => ({ ...a, equipped: a.id === item.id })));
      setCurrentAvatar((item as AvatarItem).emoji);
    } else {
      setFrames(prev => prev.map(f => ({ ...f, equipped: f.id === item.id })));
      setCurrentFrame(item.id);
    }

    toast({
      title: "Equipped!",
      description: `${item.name} is now your active ${type}.`,
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-gray-100 text-gray-700';
      case 'premium': return 'bg-blue-100 text-blue-700';
      case 'rare': return 'bg-purple-100 text-purple-700';
      case 'legendary': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCurrentFrameClass = () => {
    const currentFrameItem = frames.find(f => f.id === currentFrame);
    return currentFrameItem?.css_class || '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-6 h-6" />
            Avatar Customization
          </DialogTitle>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Your Points: {userPoints}</Badge>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Current Look:</span>
              <Avatar className={`w-12 h-12 ${getCurrentFrameClass()}`}>
                <AvatarFallback className="text-2xl bg-primary/10">
                  {currentAvatar}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="avatars" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="avatars">Avatars</TabsTrigger>
            <TabsTrigger value="frames">Frames</TabsTrigger>
          </TabsList>

          {/* Avatars Tab */}
          <TabsContent value="avatars" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {avatars.map((avatar) => (
                <Card 
                  key={avatar.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    avatar.equipped ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <CardContent className="p-4 text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarFallback className="text-3xl bg-primary/10">
                        {avatar.emoji}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="font-semibold text-sm mb-2">{avatar.name}</h3>
                    
                    <Badge className={`text-xs mb-3 ${getCategoryColor(avatar.category)}`}>
                      {avatar.category}
                    </Badge>

                    <div className="space-y-2">
                      {avatar.equipped ? (
                        <Button size="sm" className="w-full" disabled>
                          <Check className="w-4 h-4 mr-1" />
                          Equipped
                        </Button>
                      ) : avatar.unlocked ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => equipItem(avatar, 'avatar')}
                        >
                          Equip
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => unlockItem(avatar, 'avatar')}
                          disabled={userPoints < avatar.points_cost}
                        >
                          <Lock className="w-4 h-4 mr-1" />
                          {avatar.points_cost} pts
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Frames Tab */}
          <TabsContent value="frames" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {frames.map((frame) => (
                <Card 
                  key={frame.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    frame.equipped ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 relative">
                      <Avatar className={`w-full h-full ${frame.css_class}`}>
                        <AvatarFallback className="text-2xl bg-primary/10">
                          {currentAvatar}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-2">{frame.name}</h3>
                    
                    <Badge className={`text-xs mb-3 ${getCategoryColor(frame.category)}`}>
                      {frame.category}
                    </Badge>

                    <div className="space-y-2">
                      {frame.equipped ? (
                        <Button size="sm" className="w-full" disabled>
                          <Check className="w-4 h-4 mr-1" />
                          Equipped
                        </Button>
                      ) : frame.unlocked ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => equipItem(frame, 'frame')}
                        >
                          Equip
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => unlockItem(frame, 'frame')}
                          disabled={userPoints < frame.points_cost}
                        >
                          <Lock className="w-4 h-4 mr-1" />
                          {frame.points_cost} pts
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};