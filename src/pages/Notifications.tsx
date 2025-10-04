import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Trash2, Trophy, Flame, Gift, Users, BookOpen, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  icon?: string;
  read: boolean;
  created_at: string;
}

const Notifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotifications();
      createWelcomeNotification();
    }
  }, [user]);

  const createWelcomeNotification = async () => {
    if (!user) return;
    
    // Check if welcome notification already exists
    const { data: existing } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', user.id)
      .eq('type', 'welcome')
      .single();
    
    if (!existing) {
      // Create welcome notification for new users
      await createNotification('welcome', 'Welcome to KrishiKhel! 🌱', 'Start your sustainable farming journey today. Complete your first mission to earn points!');
    }
  };

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      // Try to load from database first
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setNotifications(data);
      } else {
        // Fallback to sample notifications
        const sampleNotifications: Notification[] = [
          {
            id: '1',
            type: 'welcome',
            title: 'Welcome to KrishiKhel! 🌱',
            message: 'Start your sustainable farming journey today. Complete your first mission to earn points!',
            icon: '👋',
            read: false,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            type: 'streak',
            title: 'Daily Streak Active! 🔥',
            message: 'You\'ve maintained a 3-day learning streak. Keep it up!',
            icon: '🔥',
            read: false,
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '3',
            type: 'mission',
            title: 'Mission Completed! 🏆',
            message: 'You successfully completed "Organic Composting" and earned 50 points!',
            icon: '🏆',
            read: true,
            created_at: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: '4',
            type: 'reward',
            title: 'New Reward Available! 🎁',
            message: 'Check out the new "Premium Learning Hub" reward in the rewards section.',
            icon: '🎁',
            read: false,
            created_at: new Date(Date.now() - 259200000).toISOString()
          },
          {
            id: '5',
            type: 'community',
            title: 'Community Activity 👥',
            message: 'Your post about sustainable farming received 5 likes!',
            icon: '❤️',
            read: true,
            created_at: new Date(Date.now() - 345600000).toISOString()
          },
          {
            id: '6',
            type: 'learning',
            title: 'New Module Available! 📚',
            message: 'The "Climate-Smart Agriculture" module is now available for learning.',
            icon: '📚',
            read: false,
            created_at: new Date(Date.now() - 432000000).toISOString()
          }
        ];
        setNotifications(sampleNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (type: string, title: string, message: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type,
          title,
          message,
          read: false,
          created_at: new Date().toISOString()
        });
      
      if (!error) {
        loadNotifications();
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Update in database if available
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update in database if available
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      
      toast({
        title: "All notifications marked as read",
        description: "Your notification list has been updated."
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // Delete from database if available
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user?.id);
      
      // Update local state
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
      
      toast({
        title: "Notification deleted",
        description: "The notification has been removed."
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      // Delete all from database if available
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user?.id);
      
      // Update local state
      setNotifications([]);
      
      toast({
        title: "All notifications cleared",
        description: "Your notification list has been cleared."
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'welcome': return <Bell className="w-5 h-5 text-blue-500" />;
      case 'streak': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'mission': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'reward': return <Gift className="w-5 h-5 text-purple-500" />;
      case 'community': return <Users className="w-5 h-5 text-green-500" />;
      case 'learning': return <BookOpen className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <Bell className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-3">{unreadCount} unread</Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Stay updated with your farming journey</p>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllNotifications}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
              <p>You'll see updates about your farming activities here</p>
            </div>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`border-l-4 transition-all hover:shadow-md ${
                !notification.read ? 'border-l-primary bg-primary/5' : 'border-l-muted'
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification.created_at)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          title="Delete notification"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
