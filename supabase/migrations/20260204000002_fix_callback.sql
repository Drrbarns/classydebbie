-- Fix Callback Permissions via RPC
-- Generated 2026-02-04

-- Helper function to mark order as paid securely (bypassing RLS for guests)
CREATE OR REPLACE FUNCTION mark_order_paid(order_ref TEXT, moolre_ref TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_order orders;
BEGIN
  UPDATE orders
  SET 
    payment_status = 'paid',
    status = 'processing',
    metadata = COALESCE(metadata, '{}'::jsonb) || 
               jsonb_build_object(
                   'moolre_reference', moolre_ref,
                   'payment_verified_at', to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
               )
  WHERE order_number = order_ref
  RETURNING * INTO updated_order;

  RETURN to_jsonb(updated_order);
END;
$$;

GRANT EXECUTE ON FUNCTION mark_order_paid TO anon;
GRANT EXECUTE ON FUNCTION mark_order_paid TO authenticated;
GRANT EXECUTE ON FUNCTION mark_order_paid TO service_role;
