-- Create missions table for sustainable farming challenges
CREATE TABLE public.missions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL DEFAULT 'medium',
  points_reward integer NOT NULL DEFAULT 100,
  duration_days integer NOT NULL DEFAULT 30,
  icon text NOT NULL DEFAULT 'leaf',
  impact_description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Create mission_submissions table
CREATE TABLE public.mission_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id uuid REFERENCES public.missions(id),
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  proof_url text,
  proof_description text,
  officer_remarks text,
  verified_by uuid,
  verified_at timestamp with time zone,
  submitted_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create user_levels table
CREATE TABLE public.user_levels (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  current_level integer NOT NULL DEFAULT 1,
  total_xp integer NOT NULL DEFAULT 0,
  next_level_xp integer NOT NULL DEFAULT 1000,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create certificates table
CREATE TABLE public.certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  issued_date timestamp with time zone DEFAULT now(),
  certificate_url text,
  badge_id uuid REFERENCES public.badges(id)
);

-- Create activity_log table
CREATE TABLE public.activity_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  activity_type text NOT NULL,
  description text NOT NULL,
  points_earned integer DEFAULT 0,
  related_id uuid,
  created_at timestamp with time zone DEFAULT now()
);

-- Create officer_roles table
CREATE TABLE public.officer_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'officer',
  district text,
  panchayat text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for missions
CREATE POLICY "Anyone can view active missions"
  ON public.missions FOR SELECT
  USING (is_active = true);

-- RLS Policies for mission_submissions
CREATE POLICY "Users can view their own submissions"
  ON public.mission_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions"
  ON public.mission_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending submissions"
  ON public.mission_submissions FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Officers can view all submissions"
  ON public.mission_submissions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.officer_roles 
    WHERE officer_roles.user_id = auth.uid()
  ));

CREATE POLICY "Officers can update submissions"
  ON public.mission_submissions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.officer_roles 
    WHERE officer_roles.user_id = auth.uid()
  ));

-- RLS Policies for user_levels
CREATE POLICY "Users can view their own level"
  ON public.user_levels FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own level"
  ON public.user_levels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own level"
  ON public.user_levels FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for certificates
CREATE POLICY "Users can view their own certificates"
  ON public.certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certificates"
  ON public.certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for activity_log
CREATE POLICY "Users can view their own activity"
  ON public.activity_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
  ON public.activity_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for officer_roles
CREATE POLICY "Officers can view their own role"
  ON public.officer_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Create function to update user level based on XP
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate new level based on total XP
  NEW.current_level := FLOOR(NEW.total_xp / 1000) + 1;
  NEW.next_level_xp := NEW.current_level * 1000;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for level updates
CREATE TRIGGER update_level_on_xp_change
BEFORE UPDATE OF total_xp ON public.user_levels
FOR EACH ROW
EXECUTE FUNCTION public.update_user_level();

-- Create function to award mission completion
CREATE OR REPLACE FUNCTION public.complete_mission(
  p_user_id uuid,
  p_mission_id uuid,
  p_submission_id uuid
)
RETURNS void AS $$
DECLARE
  v_points integer;
BEGIN
  -- Get mission points
  SELECT points_reward INTO v_points
  FROM public.missions
  WHERE id = p_mission_id;
  
  -- Award points
  INSERT INTO public.user_points (user_id, points, source, description)
  VALUES (p_user_id, v_points, 'mission', 'Mission completed');
  
  -- Update user level
  INSERT INTO public.user_levels (user_id, total_xp)
  VALUES (p_user_id, v_points)
  ON CONFLICT (user_id) 
  DO UPDATE SET total_xp = user_levels.total_xp + v_points;
  
  -- Log activity
  INSERT INTO public.activity_log (user_id, activity_type, description, points_earned, related_id)
  VALUES (p_user_id, 'mission_complete', 'Completed sustainable farming mission', v_points, p_mission_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;