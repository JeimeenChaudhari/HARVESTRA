-- Add avatar column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar text DEFAULT '1';