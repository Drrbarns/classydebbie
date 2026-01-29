-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'customer');
CREATE TYPE address_type AS ENUM ('shipping', 'billing', 'both');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- =============================================
-- PROFILES
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'customer',
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender gender_type,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ADDRESSES
-- =============================================
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type address_type DEFAULT 'shipping',
  is_default BOOLEAN DEFAULT false,
  label TEXT, -- e.g., "Home", "Work"
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STORE SETTINGS (Global config)
-- =============================================
CREATE TABLE IF NOT EXISTS store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- =============================================
-- AUDIT LOGS
-- =============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
-- =============================================
-- ENUMS
-- =============================================
CREATE TYPE product_status AS ENUM ('active', 'draft', 'archived');
CREATE TYPE category_status AS ENUM ('active', 'inactive');

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  position INTEGER DEFAULT 0,
  status category_status DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PRODUCTS
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  
  -- Pricing & Inventory
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_per_item DECIMAL(10,2),
  sku TEXT UNIQUE,
  barcode TEXT,
  
  -- Inventory Management
  quantity INTEGER DEFAULT 0,
  track_quantity BOOLEAN DEFAULT true,
  continue_selling BOOLEAN DEFAULT false,
  
  -- Shipping
  weight DECIMAL(10,2),
  weight_unit TEXT DEFAULT 'kg',
  
  -- Organization
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand TEXT,
  vendor TEXT,
  tags TEXT[],
  
  -- Status
  status product_status DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  
  -- Options configuration (e.g. [{"name": "Size", "values": ["S", "M"]}, {"name": "Color", "values": ["Red"]}])
  options JSONB DEFAULT '[]'::jsonb,
  
  -- External Sync (e.g. Shopify)
  external_id TEXT,
  external_source TEXT,
  
  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  
  -- Stats (Denormalized for performance)
  rating_avg DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PRODUCT IMAGES
-- =============================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  position INTEGER DEFAULT 0,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PRODUCT VARIANTS
-- =============================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. "Small / Red"
  
  sku TEXT UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_per_item DECIMAL(10,2),
  
  quantity INTEGER DEFAULT 0,
  weight DECIMAL(10,2),
  
  -- Option values corresponding to product.options
  option1 TEXT, -- e.g. "Small"
  option2 TEXT, -- e.g. "Red"
  option3 TEXT,
  
  image_url TEXT,
  barcode TEXT,
  
  external_id TEXT,
  
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
-- =============================================
-- ENUMS
-- =============================================
CREATE TYPE order_status AS ENUM ('pending', 'awaiting_payment', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed_amount', 'free_shipping');

-- =============================================
-- COUPONS
-- =============================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  type discount_type NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  minimum_purchase DECIMAL(10,2) DEFAULT 0,
  maximum_discount DECIMAL(10,2),
  
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  per_user_limit INTEGER DEFAULT 1,
  
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDERS
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  
  currency TEXT DEFAULT 'USD',
  subtotal DECIMAL(10,2) NOT NULL,
  tax_total DECIMAL(10,2) DEFAULT 0,
  shipping_total DECIMAL(10,2) DEFAULT 0,
  discount_total DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  shipping_method TEXT,
  payment_method TEXT,
  payment_provider TEXT, -- e.g. 'stripe', 'paypal'
  payment_transaction_id TEXT,
  
  notes TEXT,
  cancel_reason TEXT,
  
  shipping_address JSONB NOT NULL, -- Storing snapshot of address
  billing_address JSONB NOT NULL,
  
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDER ITEMS
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  
  product_name TEXT NOT NULL,
  variant_name TEXT,
  sku TEXT,
  
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDER HISTORY / LOGS
-- =============================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CART
-- =============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_id)
);

-- =============================================
-- WISHLIST
-- =============================================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- =============================================
-- REVIEWS
-- =============================================
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  status review_status DEFAULT 'pending',
  verified_purchase BOOLEAN DEFAULT false,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- LOYALTY
-- =============================================
CREATE TABLE IF NOT EXISTS loyalty_points (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  points INTEGER DEFAULT 0,
  lifetime_earned INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL, -- Can be negative for redemption
  description TEXT,
  type TEXT NOT NULL, -- 'earned', 'redeemed', 'adjustment'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_coupons_code ON coupons(code);
-- =============================================
-- ENUMS
-- =============================================
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE return_status AS ENUM ('pending', 'approved', 'rejected', 'processing', 'completed');
CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');

-- =============================================
-- BLOG / CONTENT
-- =============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- HTML or Markdown
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  status blog_status DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SUPPORT TICKETS
-- =============================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number SERIAL, -- Auto-incrementing human readable number
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL, -- For guest support
  subject TEXT NOT NULL,
  description TEXT,
  category TEXT, -- e.g. 'Order', 'Product', 'Account'
  
  status ticket_status DEFAULT 'open',
  priority ticket_priority DEFAULT 'medium',
  
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Staff ID
  
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Sender (Customer or Staff)
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb, -- Array of URLs
  is_internal BOOLEAN DEFAULT false, -- For staff notes
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RETURNS
-- =============================================
CREATE TABLE IF NOT EXISTS return_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  status return_status DEFAULT 'pending',
  reason TEXT NOT NULL,
  description TEXT,
  
  refund_amount DECIMAL(10,2),
  refund_method TEXT, -- 'store_credit', 'original_payment'
  
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS return_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_request_id UUID REFERENCES return_requests(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  reason TEXT,
  condition TEXT, -- 'unopened', 'opened', 'damaged'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'order_shipped', 'promo', 'security'
  title TEXT NOT NULL,
  message TEXT,
  data JSONB, -- Link, metadata
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_blog_slug ON blog_posts(slug);
CREATE INDEX idx_blog_status ON blog_posts(status);
CREATE INDEX idx_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;
-- =============================================
-- RLS HELPER FUNCTIONS
-- =============================================
CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ENABLE RLS
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES
-- =============================================
-- Public read of basic profile info (avatar, name) needed for reviews/comments? 
-- Let's restrict to owner and staff for now, unless we want public profiles.
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Staff view any profile" ON profiles FOR SELECT USING (is_admin_or_staff());
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
-- Profile creation handled by triggers usually, or initial auth.

-- =============================================
-- ADDRESSES
-- =============================================
CREATE POLICY "Users manage own addresses" ON addresses 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff manage all addresses" ON addresses 
  USING (is_admin_or_staff()) 
  WITH CHECK (is_admin_or_staff());

-- =============================================
-- PRODUCTS & CATALOG (Public Read, Staff Write)
-- =============================================
CREATE POLICY "Public view active products" ON products FOR SELECT USING (status = 'active' OR is_admin_or_staff());
CREATE POLICY "Staff manage products" ON products USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

CREATE POLICY "Public view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Staff manage categories" ON categories USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

CREATE POLICY "Public view variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Staff manage variants" ON product_variants USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

CREATE POLICY "Public view images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Staff manage images" ON product_images USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- =============================================
-- ORDERS
-- =============================================
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
-- No update/delete for users ideally, maybe cancel?
CREATE POLICY "Staff manage all orders" ON orders USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

CREATE POLICY "Users view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Staff manage order items" ON order_items USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

CREATE POLICY "Users view order history" ON order_status_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Staff manage order history" ON order_status_history USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- =============================================
-- CART & WISHLIST
-- =============================================
CREATE POLICY "Users manage own cart" ON cart_items USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own wishlist" ON wishlist_items USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================
-- REVIEWS
-- =============================================
CREATE POLICY "Public view approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users view own reviews" ON reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id); 
CREATE POLICY "Users update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Staff manage reviews" ON reviews USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

CREATE POLICY "Public view review images" ON review_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM reviews WHERE reviews.id = review_images.review_id AND reviews.status = 'approved')
);
CREATE POLICY "Users manage review images" ON review_images USING (
  EXISTS (SELECT 1 FROM reviews WHERE reviews.id = review_images.review_id AND reviews.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM reviews WHERE reviews.id = review_images.review_id AND reviews.user_id = auth.uid())
);

-- =============================================
-- BLOG
-- =============================================
CREATE POLICY "Public view published posts" ON blog_posts FOR SELECT USING (status = 'published' OR is_admin_or_staff());
CREATE POLICY "Staff manage blog" ON blog_posts USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- =============================================
-- SUPPORT
-- =============================================
CREATE POLICY "Users manage own tickets" ON support_tickets USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff manage tickets" ON support_tickets USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

CREATE POLICY "Users view ticket messages" ON support_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM support_tickets WHERE support_tickets.id = support_messages.ticket_id AND support_tickets.user_id = auth.uid())
);
CREATE POLICY "Users create messages" ON support_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM support_tickets WHERE support_tickets.id = ticket_id AND support_tickets.user_id = auth.uid())
);
CREATE POLICY "Staff manage messages" ON support_messages USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- =============================================
-- RETURNS
-- =============================================
CREATE POLICY "Users view own returns" ON return_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create returns" ON return_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff manage returns" ON return_requests USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

CREATE POLICY "Users view return items" ON return_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM return_requests WHERE return_requests.id = return_items.return_request_id AND return_requests.user_id = auth.uid())
);
CREATE POLICY "Staff manage return items" ON return_items USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- =============================================
-- SETTINGS & AUDIT
-- =============================================
CREATE POLICY "Staff view settings" ON store_settings FOR SELECT USING (true); -- Maybe public if needed?
CREATE POLICY "Staff manage settings" ON store_settings USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

CREATE POLICY "Staff view audit logs" ON audit_logs FOR SELECT USING (is_admin_or_staff());
-- Audit logs only inserted by system/triggers ideally, or staff?
CREATE POLICY "Staff insert audit logs" ON audit_logs FOR INSERT WITH CHECK (is_admin_or_staff());

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE POLICY "Users manage own notifications" ON notifications USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Products Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Avatars Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Reviews Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reviews', 'reviews', true)
ON CONFLICT (id) DO NOTHING;

-- Blog Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for Storage (Simplified)
-- In production, you'd want tighter controls, but for now:
-- Public Read, Staff Write for content. User Write for own Avatar/Reviews.

-- This requires enabling RLS on storage.objects

-- Policy helper for storage (optional, usually done via dashboard or API)
-- We will just leave buckets created. Policies on storage.objects are complex to script 
-- without knowing the exact setup (e.g. storage schema is managed by Supabase).
-- But we can try to add some basic inserts if storage policies were customizable via SQL easily 
-- without extensions issues. Typically developers set this in Dashboard.
-- We will stick to creating buckets.
-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================
-- APPLY TRIGGERS
-- =============================================

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON store_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_loyalty_points_updated_at BEFORE UPDATE ON loyalty_points FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_return_requests_updated_at BEFORE UPDATE ON return_requests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =============================================
-- PROFILE CREATION TRIGGER (Optional)
-- =============================================
-- Automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
-- Note: This trigger must be dropped/recreated if it conflicts, but usually safely added.
-- It depends on 'auth' schema access which we might not have permissions to script in migrations 
-- if running as limited user, but standard supabase migrations run as postgres/admin.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- Trigger to update product rating stats
CREATE OR REPLACE FUNCTION update_product_rating_stats()
RETURNS TRIGGER AS $$
DECLARE
    target_product_id UUID;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_product_id := OLD.product_id;
    ELSE
        target_product_id := NEW.product_id;
    END IF;

    UPDATE products
    SET 
        rating_avg = (
            SELECT COALESCE(AVG(rating), 0)
            FROM reviews
            WHERE product_id = target_product_id AND status = 'approved'
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE product_id = target_product_id AND status = 'approved'
        )
    WHERE id = target_product_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_product_rating ON reviews;
CREATE TRIGGER tr_update_product_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE PROCEDURE update_product_rating_stats();

CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    status TEXT DEFAULT 'draft',
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Seed data
INSERT INTO pages (title, slug, content, status, seo_description) VALUES 
('About Us', 'about-us', '<h2>About Us</h2><p>Welcome to our premium e-commerce store. We are dedicated to providing the best quality products.</p>', 'published', 'Learn more about our story and values'),
('Contact Us', 'contact-us', '<h2>Contact Us</h2><p>Reach out to us at <strong>support@standardecom.com</strong> or call us at +233 123 456 789.</p>', 'published', 'Get in touch with our support team'),
('Terms & Conditions', 'terms', '<h2>Terms & Conditions</h2><p>Please read these terms carefully before using our service.</p>', 'published', 'Our terms of service'),
('Privacy Policy', 'privacy', '<h2>Privacy Policy</h2><p>We value your privacy and are committed to protecting your personal data.</p>', 'published', 'Read our privacy policy'),
('Shipping Information', 'shipping', '<h2>Shipping Information</h2><p>We ship worldwide. Standard shipping takes 3-5 business days.</p>', 'published', 'Delivery times and shipping costs'),
('Returns & Refunds', 'returns', '<h2>Returns & Refunds</h2><p>You can return items within 30 days of receipt.</p>', 'published', 'Our return policy')
ON CONFLICT (slug) DO NOTHING;

-- SEED DATA: Admin User


-- Create a new user in auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated', -- This is the auth role, not our app role
  'admin@standardecom.com',
  crypt('Admin123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Master Admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Update the profile to be an admin (based on the trigger creating it)
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@standardecom.com';
