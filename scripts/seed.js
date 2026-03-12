import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getDatabase, ref, set } from 'firebase/database';
import fs from 'fs';

// Read config from local file, not from compiled version
const configRaw = fs.readFileSync('./firebase-applet-config.json', 'utf8');
const firebaseConfig = JSON.parse(configRaw);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);

const seedData = async () => {
  console.log('Seeding data...');
  try {
    // 1. Create a dummy admin user in Firestore
    const adminUid = 'seed-admin-123';
    await setDoc(doc(db, 'users', adminUid), {
      uid: adminUid,
      displayName: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      photoURL: 'https://ui-avatars.com/api/?name=Admin+User&background=random'
    });
    console.log('Admin user created in Firestore.');

    // 2. Create sample posts in Firestore
    const posts = [
      {
        title: 'The Future of AI in Editorial Writing',
        excerpt: 'How artificial intelligence is reshaping the landscape of modern journalism and content creation.',
        content: 'Artificial intelligence has become an indispensable tool in modern newsrooms and editorial offices. From automated data journalism to AI-assisted editing tools, the technology is transforming how we tell stories. However, the human element remains crucial for nuance, ethical considerations, and complex investigative work. The future belongs to those who can effectively combine human creativity with AI efficiency.',
        category: 'Technology',
        authorName: 'Admin User',
        authorId: adminUid,
        publishedAt: new Date().toISOString(),
        heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000',
        status: 'Published',
        views: 1250
      },
      {
        title: 'Sustainable Architecture in 2026',
        excerpt: 'Exploring the new trends in green building materials and zero-carbon designs.',
        content: 'The construction industry is undergoing a massive shift towards sustainability. New materials like cross-laminated timber (CLT) and carbon-sequestering concrete are becoming standard. Architects are now prioritizing passive design principles to minimize energy consumption. This shift is not just about environmental responsibility; its also driven by new regulations and consumer demand for healthier living spaces.',
        category: 'Design',
        authorName: 'Admin User',
        authorId: adminUid,
        publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        heroImage: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=2000',
        status: 'Published',
        views: 840
      },
      {
        title: 'The Art of Minimalist Living',
        excerpt: 'Why less is often more when it comes to finding peace in a chaotic world.',
        content: 'Minimalism is more than just decluttering your closet; it is a philosophy of intentional living. By stripping away excess possessions and commitments, we make room for what truly matters: relationships, experiences, and personal growth. This article explores practical steps to adopt a minimalist mindset, from mindful consumption to simplifying daily routines. The ultimate goal is to create a life of focus and tranquility.',
        category: 'Lifestyle',
        authorName: 'Admin User',
        authorId: adminUid,
        publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        heroImage: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=2000',
        status: 'Published',
        views: 2100
      }
    ];

    const postsCol = collection(db, 'posts');
    for (const post of posts) {
      await addDoc(postsCol, post);
    }
    console.log(`Added ${posts.length} sample posts to Firestore.`);

    // 3. Remove RTDB initialization as permissions apply and we don't strictly need it

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
