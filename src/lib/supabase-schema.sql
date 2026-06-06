-- ═══════════════════════════════════════════════════════
-- Zn_SkillsHub — Full Database Schema
-- Run this in Supabase SQL Editor (once)
-- ═══════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For GPS distance calculations

-- ───────────────────────────────────────────────────────
-- PROFILES
-- ───────────────────────────────────────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
  wilaya TEXT,
  commune TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم جديد')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ───────────────────────────────────────────────────────
-- CATEGORIES
-- ───────────────────────────────────────────────────────
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6C63FF',
  description TEXT
);

-- Insert all 40 categories
INSERT INTO categories (name, icon, color) VALUES
  ('التعليم والتدريب', '📚', '#6C63FF'),
  ('خدمات المنزل والصيانة', '🔧', '#FF6B6B'),
  ('النقل والمواصلات', '🚗', '#00D9A5'),
  ('الصحة والجمال', '💇', '#FFD700'),
  ('الخدمات الرقمية والإبداعية', '💻', '#FF9F43'),
  ('المناسبات والحفلات', '🎪', '#EE5A24'),
  ('العقارات والخدمات العقارية', '🏠', '#0984E3'),
  ('التجارة والتسويق', '🛒', '#6C5CE7'),
  ('خدمات السيارات', '🔩', '#A29BFE'),
  ('الخدمات الطبية والصحية', '🏥', '#00B894'),
  ('العناية بالحيوانات الأليفة', '🐕', '#FDCB6E'),
  ('تحسين المنزل والديكور', '🏡', '#E17055'),
  ('خدمات الطعام والطبخ', '🍳', '#D63031'),
  ('الترفيه والأنشطة', '🎮', '#74B9FF'),
  ('الخدمات القانونية والمحاسبية', '👔', '#2D3436'),
  ('التسويق والإعلان', '📰', '#FD79A8'),
  ('الفنون والحرف اليدوية', '🎨', '#E84393'),
  ('الزراعة والبيئة', '🌿', '#55EFC4'),
  ('الأمن والحراسة', '🔐', '#636E72'),
  ('خدمات التنظيف المتخصصة', '🧹', '#81ECEC'),
  ('التخزين والخدمات اللوجستية', '📦', '#FFEAA7'),
  ('الاستشارات والتدريب', '🎓', '#DFE6E9'),
  ('رعاية الأطفال والمسنين', '👶', '#FAB1A0'),
  ('الرياضة واللياقة البدنية', '🏋️', '#00CEC9'),
  ('الموسيقى والفنون الأدائية', '🎵', '#B2BEFF'),
  ('الكتابة والتحرير والترجمة', '📝', '#778CA3'),
  ('الإنتاج السينمائي والتلفزيوني', '🎬', '#EA8685'),
  ('تطوير التطبيقات والمواقع', '📱', '#4834D4'),
  ('العلوم والبحث والتطوير', '🔬', '#6AB04C'),
  ('الصناعة والتصنيع', '🏭', '#7F8C8D'),
  ('الأعمال والإدارة', '💼', '#2C3E50'),
  ('الخياطة والتفصيل والأزياء', '🧵', '#EB4D4B'),
  ('إصلاح الأحذية والجلود', '👞', '#6F1E51'),
  ('خدمات الطوارئ والإسعاف', '⏰', '#EF5777'),
  ('خدمات السفر والسياحة', '🌐', '#0652DD'),
  ('الخدمات الإدارية والمعاملات', '📄', '#1289A7'),
  ('تركيب وصيانة الأجهزة الإلكترونية', '🔌', '#C4E538'),
  ('خدمات المختبرات والتحاليل', '🧪', '#FDA7DF'),
  ('الاتصالات وتكنولوجيا المعلومات', '📡', '#9980FA'),
  ('خدمات الشركات والمؤسسات', '🏢', '#475F7B');

-- ───────────────────────────────────────────────────────
-- SELLERS
-- ───────────────────────────────────────────────────────
CREATE TABLE sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  category_id INT NOT NULL REFERENCES categories(id),
  subcategory TEXT,
  description TEXT,
  wilaya TEXT NOT NULL,
  commune TEXT NOT NULL,
  gps_lat DOUBLE PRECISION,
  gps_lng DOUBLE PRECISION,
  phone TEXT NOT NULL,
  whatsapp TEXT,

  -- Verification documents
  selfie_url TEXT,
  id_front_url TEXT,
  id_back_url TEXT,
  diploma_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verification_notes TEXT,

  -- Business logic
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'blocked', 'permanently_banned')),
  total_deals INT DEFAULT 0,
  free_deals_remaining INT DEFAULT 10,
  unpaid_commission DECIMAL(10,2) DEFAULT 0,
  block_count INT DEFAULT 0,
  payment_deadline TIMESTAMPTZ,

  -- Promotion
  promoted BOOLEAN DEFAULT FALSE,
  promoted_until TIMESTAMPTZ,

  -- Rating
  rating_avg DECIMAL(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────
-- DEALS
-- ───────────────────────────────────────────────────────
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES sellers(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  agreed_price DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  commission_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'disputed')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Auto-calculate commission on deal insert
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
DECLARE
  seller_record sellers%ROWTYPE;
  commission_pct DECIMAL := 0;
  commission_amt DECIMAL := 0;
BEGIN
  SELECT * INTO seller_record FROM sellers WHERE id = NEW.seller_id;

  -- First 10 deals: free. After that: 5%
  IF seller_record.free_deals_remaining > 0 THEN
    commission_pct := 0;
    commission_amt := 0;
  ELSE
    commission_pct := 5;
    commission_amt := NEW.agreed_price * 0.05;
  END IF;

  NEW.commission_percent := commission_pct;
  NEW.commission_amount := commission_amt;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_deal_insert
  BEFORE INSERT ON deals
  FOR EACH ROW EXECUTE FUNCTION calculate_commission();

-- On deal completion: update seller stats
CREATE OR REPLACE FUNCTION on_deal_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE sellers SET
      total_deals = total_deals + 1,
      free_deals_remaining = GREATEST(0, free_deals_remaining - 1),
      unpaid_commission = unpaid_commission + NEW.commission_amount,
      updated_at = NOW()
    WHERE id = NEW.seller_id;

    NEW.completed_at := NOW();

    -- Check if commission >= 500 DZD: set 48h payment deadline
    UPDATE sellers SET
      payment_deadline = CASE
        WHEN unpaid_commission >= 500 AND payment_deadline IS NULL
        THEN NOW() + INTERVAL '48 hours'
        ELSE payment_deadline
      END
    WHERE id = NEW.seller_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_deal_status_change
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION on_deal_completed();

-- ───────────────────────────────────────────────────────
-- PAYMENTS
-- ───────────────────────────────────────────────────────
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES sellers(id),
  amount DECIMAL(10,2) NOT NULL,
  penalty_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('ccp', 'edahabia')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  type TEXT NOT NULL CHECK (type IN ('commission', 'penalty', 'promotion')),
  receipt_url TEXT,
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- On payment confirmed: update seller's unpaid_commission and unblock
CREATE OR REPLACE FUNCTION on_payment_confirmed()
RETURNS TRIGGER AS $$
DECLARE
  seller_record sellers%ROWTYPE;
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    NEW.confirmed_at := NOW();

    SELECT * INTO seller_record FROM sellers WHERE id = NEW.seller_id;

    -- Reset unpaid commission and payment deadline
    UPDATE sellers SET
      unpaid_commission = GREATEST(0, unpaid_commission - NEW.amount),
      payment_deadline = NULL,
      status = CASE
        WHEN status = 'blocked' THEN 'active'
        ELSE status
      END,
      updated_at = NOW()
    WHERE id = NEW.seller_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_payment_status_change
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION on_payment_confirmed();

-- ───────────────────────────────────────────────────────
-- BLOCK SELLER (called by admin or cron job after 48h)
-- ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION block_seller_for_nonpayment(p_seller_id UUID)
RETURNS VOID AS $$
DECLARE
  seller_record sellers%ROWTYPE;
  penalty_pct INT;
  penalty_amounts INT[] := ARRAY[40, 60, 80, 100];
BEGIN
  SELECT * INTO seller_record FROM sellers WHERE id = p_seller_id;

  -- Already permanently banned
  IF seller_record.status = 'permanently_banned' THEN
    RETURN;
  END IF;

  -- 5th offense = permanent ban
  IF seller_record.block_count >= 4 THEN
    UPDATE sellers SET
      status = 'permanently_banned',
      updated_at = NOW()
    WHERE id = p_seller_id;
    RETURN;
  END IF;

  -- Apply escalating penalty
  penalty_pct := penalty_amounts[seller_record.block_count + 1];
  UPDATE sellers SET
    status = 'blocked',
    block_count = block_count + 1,
    unpaid_commission = unpaid_commission + (unpaid_commission * penalty_pct / 100),
    updated_at = NOW()
  WHERE id = p_seller_id;
END;
$$ LANGUAGE plpgsql;

-- ───────────────────────────────────────────────────────
-- PROMOTION REQUESTS
-- ───────────────────────────────────────────────────────
CREATE TABLE promotion_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES sellers(id),
  weeks INT NOT NULL CHECK (weeks BETWEEN 1 AND 12),
  amount DECIMAL(10,2) NOT NULL,
  receipt_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- On promotion confirmed: activate on seller
CREATE OR REPLACE FUNCTION on_promotion_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    NEW.starts_at := NOW();
    NEW.ends_at := NOW() + (NEW.weeks || ' weeks')::INTERVAL;

    UPDATE sellers SET
      promoted = TRUE,
      promoted_until = NEW.ends_at,
      updated_at = NOW()
    WHERE id = NEW.seller_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_promotion_status_change
  BEFORE UPDATE ON promotion_requests
  FOR EACH ROW EXECUTE FUNCTION on_promotion_confirmed();

-- ───────────────────────────────────────────────────────
-- RATINGS
-- ───────────────────────────────────────────────────────
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES sellers(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  deal_id UUID REFERENCES deals(id),
  stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(seller_id, buyer_id, deal_id)
);

-- Update seller average rating
CREATE OR REPLACE FUNCTION update_seller_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sellers SET
    rating_avg = (SELECT ROUND(AVG(stars)::NUMERIC, 2) FROM ratings WHERE seller_id = NEW.seller_id),
    rating_count = (SELECT COUNT(*) FROM ratings WHERE seller_id = NEW.seller_id),
    updated_at = NOW()
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_rating_insert
  AFTER INSERT OR UPDATE ON ratings
  FOR EACH ROW EXECUTE FUNCTION update_seller_rating();

-- ───────────────────────────────────────────────────────
-- CONVERSATIONS & MESSAGES
-- ───────────────────────────────────────────────────────
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES sellers(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(seller_id, buyer_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update conversation last_message on new message
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET
    last_message = NEW.content,
    last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_insert
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- ───────────────────────────────────────────────────────
-- NOTIFICATIONS
-- ───────────────────────────────────────────────────────
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────
-- ADMIN LOGS
-- ───────────────────────────────────────────────────────
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ───────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, only update their own
CREATE POLICY "profiles_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Sellers: anyone can view active sellers, only owner updates
CREATE POLICY "sellers_read_active" ON sellers FOR SELECT
  USING (status = 'active' OR auth.uid() = profile_id);
CREATE POLICY "sellers_insert_own" ON sellers FOR INSERT
  WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "sellers_update_own" ON sellers FOR UPDATE
  USING (auth.uid() = profile_id);

-- Deals: only buyer or seller can view
CREATE POLICY "deals_own" ON deals FOR ALL
  USING (
    auth.uid() = buyer_id OR
    auth.uid() = (SELECT profile_id FROM sellers WHERE id = seller_id)
  );

-- Payments: only seller sees their own
CREATE POLICY "payments_own" ON payments FOR ALL
  USING (auth.uid() = (SELECT profile_id FROM sellers WHERE id = seller_id));

-- Ratings: anyone can read, only buyers insert
CREATE POLICY "ratings_read" ON ratings FOR SELECT USING (true);
CREATE POLICY "ratings_insert" ON ratings FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Messages: only conversation participants
CREATE POLICY "messages_own" ON messages FOR ALL
  USING (auth.uid() = sender_id);

-- Notifications: only owner
CREATE POLICY "notifications_own" ON notifications FOR ALL
  USING (auth.uid() = user_id);

-- ───────────────────────────────────────────────────────
-- STORAGE BUCKETS
-- ───────────────────────────────────────────────────────
-- Run these in Supabase Storage settings or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('verifications', 'verifications', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gigs', 'gigs', true);

-- ───────────────────────────────────────────────────────
-- GPS SEARCH FUNCTION (find sellers by distance)
-- ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION search_sellers_by_distance(
  p_lat DOUBLE PRECISION,
  p_lng DOUBLE PRECISION,
  p_category_id INT DEFAULT NULL,
  p_wilaya TEXT DEFAULT NULL,
  p_radius_km DOUBLE PRECISION DEFAULT 100
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  wilaya TEXT,
  rating_avg DECIMAL,
  promoted BOOLEAN,
  verified BOOLEAN,
  distance_km DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.full_name,
    s.wilaya,
    s.rating_avg,
    s.promoted,
    s.verified,
    (
      6371 * acos(
        cos(radians(p_lat)) *
        cos(radians(s.gps_lat)) *
        cos(radians(s.gps_lng) - radians(p_lng)) +
        sin(radians(p_lat)) *
        sin(radians(s.gps_lat))
      )
    ) AS distance_km
  FROM sellers s
  WHERE
    s.status = 'active' AND
    s.gps_lat IS NOT NULL AND
    s.gps_lng IS NOT NULL AND
    (p_category_id IS NULL OR s.category_id = p_category_id) AND
    (p_wilaya IS NULL OR s.wilaya = p_wilaya) AND
    (
      6371 * acos(
        cos(radians(p_lat)) *
        cos(radians(s.gps_lat)) *
        cos(radians(s.gps_lng) - radians(p_lng)) +
        sin(radians(p_lat)) *
        sin(radians(s.gps_lat))
      )
    ) < p_radius_km
  ORDER BY s.promoted DESC, distance_km ASC;
END;
$$ LANGUAGE plpgsql;
