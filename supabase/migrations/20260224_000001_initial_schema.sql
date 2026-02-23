-- LEDIAN SPA LOG — Initial Schema
-- 20260224_000001_initial_schema.sql

-- ── ユーザーテーブル（JWT認証用） ────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 来店記録テーブル ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  store TEXT NOT NULL CHECK (store IN ('azabu', 'ebisu', 'private')),
  gender TEXT CHECK (gender IN ('male', 'female')),
  course_id TEXT NOT NULL,
  premium_seat BOOLEAN DEFAULT FALSE,
  room_type TEXT CHECK (room_type IN ('standard', 'terrace', 'vip')),
  is_weekend BOOLEAN,
  guest_count INTEGER DEFAULT 1,
  extension_count INTEGER DEFAULT 0,
  drinks JSONB DEFAULT '[]'::jsonb,
  rentals JSONB DEFAULT '[]'::jsonb,
  total_amount INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── インデックス ──────────────────────────────────────────
CREATE INDEX IF NOT EXISTS visits_user_id_date_idx ON visits(user_id, date DESC);

-- RLS有効化・初期ユーザーは別ファイルで管理
-- 000002_enable_rls.sql
-- 000003_seed_initial_user.sql
