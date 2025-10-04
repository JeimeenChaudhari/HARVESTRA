import React from 'react';

interface PageBackgroundProps {
  children: React.ReactNode;
  variant?: 'dashboard' | 'learn' | 'achievements' | 'leaderboard' | 'community' | 'profile' | 'settings' | 'missions' | 'rewards' | 'marketplace' | 'weather' | 'notifications' | 'impact' | 'default';
  className?: string;
}

const PageBackground: React.FC<PageBackgroundProps> = ({ 
  children, 
  variant = 'default',
  className = ''
}) => {
  const getBackgroundImage = (variant: string) => {
    switch (variant) {
      case 'dashboard':
        return 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=1080&fit=crop';
      case 'learn':
        return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&h=1080&fit=crop';
      case 'achievements':
        return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=1080&fit=crop';
      case 'leaderboard':
        return 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=1920&h=1080&fit=crop';
      case 'community':
        return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1920&h=1080&fit=crop';
      case 'profile':
        return 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1920&h=1080&fit=crop';
      case 'settings':
        return 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1920&h=1080&fit=crop';
      case 'missions':
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop';
      case 'rewards':
        return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop';
      case 'marketplace':
        return 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&h=1080&fit=crop';
      case 'weather':
        return 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=1920&h=1080&fit=crop';
      case 'notifications':
        return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop';
      case 'impact':
        return 'https://images.unsplash.com/photo-1464822759844-d150baec95b5?w=1920&h=1080&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=1080&fit=crop';
    }
  };

  const backgroundImage = getBackgroundImage(variant);

  return (
    <div className={`relative min-h-full ${className}`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          opacity: 0.3,
          zIndex: -2
        }}
      />
      
      {/* Overlay for better contrast */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80"
        style={{ zIndex: -1 }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PageBackground;