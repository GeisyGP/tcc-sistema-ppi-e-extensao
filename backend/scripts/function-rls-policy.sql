CREATE OR REPLACE FUNCTION enable_rls_with_policy(
    tbl TEXT,
    pol_name TEXT,
    condition TEXT
) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = tbl
      AND relrowsecurity = true
  ) THEN
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = pol_name
      AND tablename = tbl
  ) THEN
    EXECUTE format('CREATE POLICY %I ON %I USING (%s)', pol_name, tbl, condition);
  END IF;
END;
$$ LANGUAGE plpgsql;

