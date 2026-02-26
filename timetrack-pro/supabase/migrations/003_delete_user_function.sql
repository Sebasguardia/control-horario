-- ============================================================================
-- TimeTrack Pro - Account Deletion Support
-- Migration: 003_delete_user_function.sql
-- ============================================================================

-- This function allows a user to delete their own account from auth.users
-- It must be created with SECURITY DEFINER to have bypass RLS and auth protections
-- so it can delete from the auth schema.

CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    target_user_id UUID;
BEGIN
    target_user_id := auth.uid();
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authorized';
    END IF;

    -- Profiles and other data will be deleted automatically due to 
    -- ON DELETE CASCADE in the table definitions.
    
    DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;
