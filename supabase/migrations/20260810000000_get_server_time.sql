CREATE OR REPLACE FUNCTION get_server_time()
RETURNS text AS $$
BEGIN
  RETURN to_char(now(), 'YYYY-MM-DD');
END;
$$ LANGUAGE plpgsql;
