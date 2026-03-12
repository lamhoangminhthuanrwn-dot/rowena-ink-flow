
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sandbox_exec_qbbvnjnpbbpskhwngsrq') THEN
    REVOKE ALL ON ALL TABLES IN SCHEMA public FROM "sandbox_exec_qbbvnjnpbbpskhwngsrq";
    REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM "sandbox_exec_qbbvnjnpbbpskhwngsrq";
    REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM "sandbox_exec_qbbvnjnpbbpskhwngsrq";
    REVOKE USAGE ON SCHEMA public FROM "sandbox_exec_qbbvnjnpbbpskhwngsrq";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM "sandbox_exec_qbbvnjnpbbpskhwngsrq";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM "sandbox_exec_qbbvnjnpbbpskhwngsrq";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM "sandbox_exec_qbbvnjnpbbpskhwngsrq";
  END IF;
END $$;
