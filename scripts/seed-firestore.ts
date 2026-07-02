/**
 * Firestore Seed Script
 * Run with: npx tsx scripts/seed-firestore.ts
 *
 * Seeds: products (12), siteConfig, and prints admin-setup instructions.
 */
import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, setDoc, writeBatch, terminate } from 'firebase/firestore';

// ─── Config ────────────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAQp21PasDNOzgzEVY5NEPKNwh8A1-y-LM',
  authDomain: 'gen-lang-client-0531147725.firebaseapp.com',
  projectId: 'gen-lang-client-0531147725',
  storageBucket: 'gen-lang-client-0531147725.firebasestorage.app',
  messagingSenderId: '898193326237',
  appId: '1:898193326237:web:f6d82a72b12f248d4d5474',
};
const DATABASE_ID = 'ai-studio-b14f6675-27c3-414b-9eb8-8cdc157c9136';

// ─── Helpers ────────────────────────────────────────────────────────────────
const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

// ─── Products ───────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: '1', name: 'Royal Bridal Lehenga', price: 499.99, category: 'Lehengas',
    rating: 4.9, reviews: 124, new: true, stock: 10,
    image: u('photo-1610189012906-478338104311'),
    description: 'A stunning red velvet lehenga with intricate gold zari work and mirror detailing. Perfect for weddings and grand receptions.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Red', 'Maroon'],
  },
  {
    id: '2', name: 'Pastel Floral Kurti Set', price: 89.99, category: 'Kurtis',
    rating: 4.7, reviews: 89, new: true, stock: 25,
    image: u('photo-1583391726247-bd7475808a66'),
    description: 'Comfortable cotton kurta with delicate floral prints, paired with white churidar and a matching dupatta. Ideal for daily wear.',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Pink', 'Peach', 'Mint'],
  },
  {
    id: '3', name: 'Banarasi Silk Saree', price: 299.50, category: 'Sarees',
    rating: 4.8, reviews: 210, new: false, stock: 15,
    image: u('photo-1558618666-fcd25c85cd64'),
    description: 'Authentic Banarasi silk saree in royal blue with silver zari border. Comes with a matching blouse piece.',
    sizes: ['Free Size'], colors: ['Blue', 'Green', 'Purple'],
  },
  {
    id: '4', name: 'Golden Anarkali Suit', price: 179.99, category: 'Anarkalis',
    rating: 4.9, reviews: 156, new: true, stock: 8,
    image: u('photo-1529374255404-311a2a4f1fd9'),
    description: 'Heavy embroidered golden Anarkali suit with velvet texture. A statement piece for festive occasions.',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Gold', 'Beige'],
  },
  {
    id: '5', name: 'Embroidered Chiffon Saree', price: 149.99, category: 'Sarees',
    rating: 4.6, reviews: 340, new: false, stock: 20,
    image: u('photo-1515886657613-9f3515b0c78f'),
    description: 'Lightweight chiffon saree with all-over embroidery. Elegant and easy to drape.',
    sizes: ['Free Size'], colors: ['Yellow', 'Orange', 'Teal'],
  },
  {
    id: '6', name: 'Designer Palazzo Suit', price: 110.00, category: 'Suits',
    rating: 4.5, reviews: 98, new: false, stock: 12,
    image: u('photo-1539109136881-3be0616acf4b'),
    description: 'Modern Indo-western palazzo suit with geometric prints. Comfortable for office and casual outings.',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Navy'],
  },
  {
    id: '7', name: 'Peacock Blue Lehenga', price: 389.00, category: 'Lehengas',
    rating: 4.8, reviews: 77, new: true, stock: 6,
    image: u('photo-1521672555542-0f97e6408f9e'),
    description: 'Exquisite peacock-blue lehenga adorned with hand-embroidered peacock motifs. Makes a bold statement at sangeet and mehndi ceremonies.',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Peacock Blue', 'Teal'],
  },
  {
    id: '8', name: 'Block Print Cotton Kurti', price: 54.99, category: 'Kurtis',
    rating: 4.4, reviews: 203, new: false, stock: 30,
    image: u('photo-1536246961965-ea5e698bef97'),
    description: 'Hand block-printed cotton kurti with Rajasthani motifs. Breathable fabric, perfect for summer and everyday casual wear.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Indigo', 'Rust', 'Olive'],
  },
  {
    id: '9', name: 'Kanjeevaram Silk Saree', price: 459.00, category: 'Sarees',
    rating: 4.9, reviews: 188, new: false, stock: 7,
    image: u('photo-1523293182086-7651a899d37f'),
    description: 'Pure Kanjeevaram silk saree woven with traditional temple borders and rich colour contrasts. A timeless heirloom piece.',
    sizes: ['Free Size'], colors: ['Crimson', 'Gold', 'Emerald'],
  },
  {
    id: '10', name: 'Red Net Anarkali', price: 229.00, category: 'Anarkalis',
    rating: 4.7, reviews: 112, new: true, stock: 9,
    image: u('photo-1519345182560-3f2917c472ef'),
    description: 'Flowing red net Anarkali with sequin-embellished yoke and flared skirt. Perfect for festive dinners and receptions.',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Red', 'Wine'],
  },
  {
    id: '11', name: 'Chanderi Salwar Suit', price: 149.00, category: 'Suits',
    rating: 4.5, reviews: 64, new: false, stock: 14,
    image: u('photo-1522337360788-8b13dee7a37e'),
    description: 'Elegant Chanderi silk salwar suit with intricate silver zari work. Lightweight and graceful for formal events and pujas.',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Ivory', 'Rose', 'Lavender'],
  },
  {
    id: '12', name: 'Mirror Work Lehenga', price: 599.00, category: 'Lehengas',
    rating: 5.0, reviews: 43, new: true, stock: 4,
    image: u('photo-1617711164094-dae2c79b4369'),
    description: 'Vibrant mirror-work lehenga from Kutch with hand-stitched shisha embroidery. A showstopper for weddings and cultural festivals.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Fuchsia', 'Orange', 'Turquoise'],
  },
];

// ─── Site Config ─────────────────────────────────────────────────────────────
const SITE_CONFIG = {
  heroTitle: 'ETHNIC ELEGANCE',
  heroSubtitle: 'Discover the finest collection of Sarees, Lehengas, and Kurtis. Crafted for the modern woman who cherishes tradition.',
  heroCTA: 'Shop Collection',
  heroImage: '',
  announcementText: '🎉 Free shipping on orders above ₹1,000 | Use code RUWA15 for 15% off your first order!',
  announcementEnabled: true,
  colorScheme: 'rose',
  showNewArrivals: true,
  showFeatured: true,
  footerTagline: 'Celebrating the rich heritage of South Asian fashion. From the looms of Banaras to the embroidery of Lucknow.',
  logoText: 'RuWa Verse',
};

// ─── Seed ────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🌸  RuWa Verse — Firestore Seed Script\n');

  const app = initializeApp(FIREBASE_CONFIG, 'ruwa-seeder');
  const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  } as any, DATABASE_ID);

  try {
    // ── Products (batched write — max 500 ops per batch) ──────────────────
    console.log('📦  Seeding products...');
    const batch1 = writeBatch(db);
    for (const product of PRODUCTS) {
      const { id, ...data } = product;
      batch1.set(doc(db, 'products', id), data);
    }
    await batch1.commit();
    console.log(`   ✓ ${PRODUCTS.length} products written`);

    // ── Site Config ────────────────────────────────────────────────────────
    console.log('🎨  Seeding siteConfig...');
    await setDoc(doc(db, 'siteConfig', 'main'), SITE_CONFIG);
    console.log('   ✓ siteConfig/main written');

    console.log('\n✅  Seeding complete!\n');
    console.log('─'.repeat(55));
    console.log('Next steps:');
    console.log('');
    console.log('1. Enable Authentication in Firebase Console:');
    console.log('   https://console.firebase.google.com/project/gen-lang-client-0531147725/authentication');
    console.log('   → Enable Google and Email/Password providers');
    console.log('');
    console.log('2. Sign up in the app, then set yourself as admin:');
    console.log('   In Firestore Console → users/{yourUID} → set role = "admin"');
    console.log('   https://console.firebase.google.com/project/gen-lang-client-0531147725/firestore');
    console.log('');
    console.log('3. Deploy Firestore security rules:');
    console.log('   firebase deploy --only firestore:rules');
    console.log('   (requires Firebase CLI: npm install -g firebase-tools)');
    console.log('─'.repeat(55));

  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      console.error('\n❌  Permission denied — Firestore rules are blocking writes.');
      console.error('    Temporarily set your Firestore rules to allow all writes:');
      console.error('    allow read, write: if true;');
      console.error('    Then re-run this script, then deploy firestore.rules.\n');
    } else {
      console.error('\n❌  Seeding failed:', err?.message ?? err);
    }
    process.exitCode = 1;
  } finally {
    await terminate(db);
    process.exit(process.exitCode ?? 0);
  }
}

seed();
