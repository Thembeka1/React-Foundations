
-- Block public API access to customers
CREATE POLICY "Deny API access"
ON public.customers
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Block public API access to invoices
CREATE POLICY "Deny API access"
ON public.invoices
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Block public API access to revenue
CREATE POLICY "Deny API access"
ON public.revenue
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Block public API access to users
CREATE POLICY "Deny API access"
ON public.users
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);
