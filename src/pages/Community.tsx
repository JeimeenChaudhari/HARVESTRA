import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Users, MessageCircle, Heart, Share2, Send, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import PageBackground from "@/components/PageBackground";

const Community = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      console.log('Loading community posts...');
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles(name, panchayat, avatar),
          post_likes(count),
          post_comments(count)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading posts:', error);
        return;
      }
      
      console.log('Loaded posts:', data?.length || 0);
      setPosts(data || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPostImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPost.trim()) return;

    try {
      // Create post with proper data structure
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          content: newPost.trim(),
          topic: 'General',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Award points for creating a post
      await supabase.from('user_points').insert({
        user_id: user.id,
        points: 10,
        source: 'community_post',
        description: 'Created a community post'
      });

      toast({
        title: "🎉 Post Shared!",
        description: "Your post is now visible to the community. +10 points earned!",
      });

      setNewPost("");
      setNewPostImage(null);
      setImagePreview("");
      
      // Reload posts to show the new one
      setTimeout(loadPosts, 500);
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      // Check if already liked
      const { data: existing } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });
      }

      loadPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleShare = async (post: any) => {
    const shareUrl = `${window.location.origin}/app/community`;
    const shareText = `Check out this post on KrishiKhel:\n\n${post.content}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KrishiKhel Community Post',
          text: shareText,
          url: shareUrl
        });
        toast({
          title: "Shared successfully!",
          description: "Thanks for spreading the word."
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast({
          title: "Copied to clipboard",
          description: "Share the content with your friends!"
        });
      } catch (error) {
        console.error('Error copying:', error);
        toast({
          title: "Unable to copy",
          description: "Please try again",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <PageBackground variant="community">
      <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Community</h1>
        <p className="text-muted-foreground">Connect with fellow farmers and share knowledge</p>
      </div>

      {/* Community Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{posts.length * 42}</p>
                <p className="text-sm text-muted-foreground">Active Farmers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{posts.length}</p>
                <p className="text-sm text-muted-foreground">Discussions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{posts.reduce((acc, p) => acc + (p.post_likes?.[0]?.count || 0), 0)}</p>
                <p className="text-sm text-muted-foreground">Helpful Interactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Post */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Share with Community</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea 
            placeholder="Share your farming experience, ask questions, or offer advice..."
            className="min-h-[100px]"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          {imagePreview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="post-image"
              />
              <label htmlFor="post-image">
                <Button variant="outline" size="sm" type="button" asChild>
                  <span className="cursor-pointer">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Add Image
                  </span>
                </Button>
              </label>
            </div>
            <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Community Posts */}
      <div className="space-y-4">
        {posts.map((post) => {
          // Handle posts with missing profile data
          const authorName = post.profiles?.name || 'Community Member';
          const authorLocation = post.profiles?.panchayat || 'Kerala';
          const authorInitial = authorName[0]?.toUpperCase() || 'U';
          
          return (
            <Card key={post.id} className="border-2 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10">
                      {authorInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{authorName}</p>
                        <p className="text-sm text-muted-foreground">
                          {authorLocation} • {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {post.topic && <Badge variant="secondary">{post.topic}</Badge>}
                    </div>
                  </div>
                </div>
              </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
              {post.image_url && (
                <img src={post.image_url} alt="Post" className="w-full rounded-lg" />
              )}
              
              <div className="flex items-center gap-4 pt-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => handleLike(post.id)}
                >
                  <Heart className="w-4 h-4" />
                  {post.post_likes?.[0]?.count || 0}
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {post.post_comments?.[0]?.count || 0}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => handleShare(post)}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
          );
        })}
        {posts.length === 0 && (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No posts yet. Be the first to share!</p>
            </div>
          </Card>
        )}
      </div>
      </div>
    </PageBackground>
  );
};

export default Community;