import React, { useState, useEffect } from 'react';
import { CategoryNav } from '../components/CategoryNav';
import { PostCard } from '../components/PostCard';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Post } from '../types';
import { motion } from 'motion/react';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

export function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsRef = collection(db, 'posts');
    let q = query(
      postsRef, 
      where('status', '==', 'Published'),
      orderBy('publishedAt', 'desc')
    );

    if (activeCategory !== 'All') {
      q = query(
        postsRef, 
        where('status', '==', 'Published'),
        where('category', '==', activeCategory),
        orderBy('publishedAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
      setLoading(false);
    });

    return unsubscribe;
  }, [activeCategory]);

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-10">
      <header className="space-y-1">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-serif font-bold text-slate-900"
        >
          Discover Stories
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 text-sm"
        >
          Curated content for the modern reader.
        </motion.p>
      </header>

      <section>
        <CategoryNav 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-slate-900 italic">Recent Stories</h2>
          <button className="text-accent text-xs font-bold uppercase tracking-widest">View All</button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid gap-10">
            {posts.map((post, index) => (
              <div key={post.id}>
                <PostCard post={post} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <p>No stories found in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
}
