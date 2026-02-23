-- LEDIAN SPA LOG — Enable RLS
-- 20260224_000002_enable_rls.sql
--
-- サービスロールキーは RLS をバイパスするため、アプリの動作に影響なし。
-- anon キーによる直接アクセスはすべてブロックされる。

-- ── RLS 有効化 ────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- ── users テーブル: 全操作をブロック（サービスロールのみ通過） ──
CREATE POLICY "deny_all_users"
  ON users
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (false);

-- ── visits テーブル: 全操作をブロック（サービスロールのみ通過） ──
CREATE POLICY "deny_all_visits"
  ON visits
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (false);
