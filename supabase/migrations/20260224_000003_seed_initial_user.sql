-- LEDIAN SPA LOG — Seed Initial User
-- 20260224_000003_seed_initial_user.sql
--
-- 実行前に以下のコマンドで password_hash を生成してください:
--   node -e "const b=require('bcryptjs');b.hash('yourpassword',12).then(console.log)"
--
-- 生成したハッシュを下の '$2b$12$...' に置き換えてから実行してください。

INSERT INTO users (username, password_hash)
VALUES (
  'rei',
  '$2b$12$REPLACE_WITH_YOUR_BCRYPT_HASH'
)
ON CONFLICT (username) DO NOTHING;
