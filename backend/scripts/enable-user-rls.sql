SELECT enable_rls_with_policy(
  'User',
  'user_isolation_policy',
  'NOT EXISTS (
    SELECT 1
    FROM "UserCourse" uc
    WHERE uc."userId" = "User".id
  )
  OR EXISTS (
     SELECT 1
     FROM "UserCourse" uc
     WHERE uc."userId" = "User".id
       AND (
         current_setting(''app.current_course_id'')::TEXT = ''4c4d352b-6bd6-4cd7-8862-4d156d5a99d6''
         OR uc."courseId" = current_setting(''app.current_course_id'')::TEXT
       )
   )'
);
