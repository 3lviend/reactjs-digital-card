-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.digital_cards (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  digital_card_name character varying,
  full_name character varying,
  first_name character varying,
  middle_name character varying,
  last_name character varying,
  prefix character varying,
  suffix character varying,
  accreditations character varying,
  preferred_name character varying,
  title character varying,
  department character varying,
  company character varying,
  headline character varying,
  background_url character varying,
  avatar_url character varying,
  contact_type character varying,
  digital_card_url character varying,
  notes character varying,
  qr_code character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  is_public boolean DEFAULT true,
  user_id uuid NOT NULL,
  theme text NOT NULL DEFAULT 'light'::text,
  social_media ARRAY,
  CONSTRAINT digital_cards_pkey PRIMARY KEY (id),
  CONSTRAINT digital_cards_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- ==================================================
-- ENABLE AND CONFIGURE ROW LEVEL SECURITY (RLS)
-- ==================================================
ALTER TABLE public.digital_cards ENABLE ROW LEVEL SECURITY;

-- 1. READ: Allow users to read their own cards, or anyone to read public cards.
CREATE POLICY "Users can read own or public cards" 
ON public.digital_cards FOR SELECT 
USING (auth.uid() = user_id OR is_public = true);

-- 2. INSERT: Allow users to create their own cards securely.
CREATE POLICY "Users can insert their own cards" 
ON public.digital_cards FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. UPDATE: Allow users to update their own cards securely.
CREATE POLICY "Users can update their own cards" 
ON public.digital_cards FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 4. DELETE: Allow users to delete their own cards securely.
CREATE POLICY "Users can delete their own cards" 
ON public.digital_cards FOR DELETE 
USING (auth.uid() = user_id);
