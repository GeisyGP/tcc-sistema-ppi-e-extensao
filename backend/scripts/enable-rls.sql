DO $$
DECLARE
  tbl TEXT;
  policy TEXT;
BEGIN
  FOR tbl, policy IN 
    SELECT * FROM (VALUES
      ('Subject', 'subject_rls_policy'),
      ('PPI', 'ppi_rls_policy'),
      ('Project', 'project_rls_policy'),
      ('Group', 'group_rls_policy'),
      ('Artifact', 'artifact_rls_policy'),
      ('Deliverable', 'deliverable_rls_policy')
    ) AS t(table_name, policy_name)
  LOOP
    PERFORM enable_rls_with_policy(
      tbl,
      policy,
      '"courseId" = current_setting(''app.current_course_id'')::TEXT'
    );
  END LOOP;
END $$;
