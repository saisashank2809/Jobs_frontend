-- SQL Script to add experience columns to users_jobs table

-- 1. Add experience column
ALTER TABLE public.users_jobs 
ADD COLUMN IF NOT EXISTS experience TEXT;

-- 2. Add work_experience_position column
ALTER TABLE public.users_jobs 
ADD COLUMN IF NOT EXISTS work_experience_position TEXT;

-- 3. Add work_experience_description column
ALTER TABLE public.users_jobs 
ADD COLUMN IF NOT EXISTS work_experience_description TEXT;

-- Commentary: 
-- These columns will store the user's total tenure, their last/current job position, 
-- and a description of their work experience respectively.
