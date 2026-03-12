import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eye, FileText, Users, Plus, Edit2, Trash2, Settings, BarChart2, Database } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { Post, Category } from '../types';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';
import { MOCK_POSTS } from '../constants';

export function AdminDashboard() {
  const { isAdmin, loading: authLoading, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [stats, setStats] = useState({
    totalViews: 0,
    activePosts: 0,
    subscribers: 0
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('Culture');
  const [heroImage, setHeroImage] = useState('');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Draft');

  useEffect(() => {
    if (!isAdmin) return;

    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('publishedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(postsData);
      
      // Calculate stats
      const totalViews = postsData.reduce((sum, post) => sum + (post.views || 0), 0);
      const activePosts = postsData.filter(p => p.status === 'Published').length;
      
      setStats(prev => ({ ...prev, totalViews, activePosts }));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
      setLoading(false);
    });

    // Fetch subscribers count (mocked for now)
    setStats(prev => ({ ...prev, subscribers: 1240 }));

    return unsubscribe;
  }, [isAdmin]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `posts/${id}`);
    }
  };

  const openCreateModal = () => {
    setEditingPost(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setCategory('Culture');
    setHeroImage('');
    setStatus('Draft');
    setIsModalOpen(true);
  };

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCategory(post.category);
    setHeroImage(post.heroImage);
    setStatus(post.status);
    setIsModalOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const postData = {
        title,
        excerpt,
        content,
        category,
        heroImage,
        status,
        authorName: user.displayName || 'Admin',
        authorId: user.uid,
      };

      if (editingPost) {
        await updateDoc(doc(db, 'posts', editingPost.id), postData);
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postData,
          publishedAt: new Date().toISOString(),
          views: 0
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      window.alert("Failed to save post. Ensure you have the right permissions.");
      handleFirestoreError(error, editingPost ? OperationType.UPDATE : OperationType.CREATE, 'posts');
    } finally {
      setLoading(false);
    }
  };


  const seedData = async () => {
    if (!user) return;
    setSeeding(true);
    try {
      for (const post of MOCK_POSTS) {
        const { id, ...postData } = post;
        await addDoc(collection(db, 'posts'), {
          ...postData,
          authorId: user.uid,
          authorName: user.displayName || 'Admin',
          publishedAt: new Date().toISOString(),
          content: `<p>${postData.excerpt}</p><p>This is a seeded post content. Editorial design is about more than just aesthetics; it's about storytelling through layout, typography, and imagery.</p>`
        });
      }
      alert('Seed data added successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    } finally {
      setSeeding(false);
    }
  };

  if (authLoading) return <div className="p-20 text-center">Loading...</div>;
  if (!isAdmin) return <div className="p-20 text-center text-red-500 font-bold">Access Denied</div>;

  const statsDisplay = [
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Posts', value: stats.activePosts.toString(), icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Subscribers', value: stats.subscribers.toLocaleString(), icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-8 pb-24">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, Admin</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
          <Settings size={20} />
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-3 gap-3">
        {statsDisplay.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2"
          >
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.bg, stat.color)}>
              <stat.icon size={16} />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">{stat.value}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-slate-900 italic">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={openCreateModal} className="flex items-center justify-center gap-2 bg-accent text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-accent/20 hover:bg-accent/90">
            <Plus size={18} />
            Create Post
          </button>
          <button 
            onClick={seedData}
            disabled={seeding}
            className="flex items-center justify-center gap-2 bg-white border border-slate-100 py-4 rounded-xl font-bold text-sm text-slate-600 shadow-sm disabled:opacity-50"
          >
            <Database size={18} />
            {seeding ? 'Seeding...' : 'Seed Data'}
          </button>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-slate-900 italic">Recent Posts</h2>
          <button className="text-accent text-xs font-bold uppercase tracking-widest">Manage All</button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                <img 
                  src={post.heroImage} 
                  alt="" 
                  className="w-12 h-12 rounded-lg object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{post.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                      post.status === 'Published' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {post.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{post.views || 0} views</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditModal(post)} className="p-2 text-slate-400 hover:text-accent transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <h2 className="text-2xl font-serif font-bold mb-6">{editingPost ? 'Edit Post' : 'Create Post'}</h2>
            <form onSubmit={handleSavePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Title</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none" placeholder="Post Title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none">
                    {['Travel', 'Food', 'Tech', 'Lifestyle', 'Design', 'Culture'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as 'Published' | 'Draft')} className="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none">
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hero Image URL</label>
                <input required type="url" value={heroImage} onChange={e => setHeroImage(e.target.value)} className="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Excerpt</label>
                <textarea required rows={2} value={excerpt} onChange={e => setExcerpt(e.target.value)} className="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none resize-none" placeholder="A short description..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Content (HTML allowed)</label>
                <textarea required rows={5} value={content} onChange={e => setContent(e.target.value)} className="w-full bg-slate-50 border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-accent/20 outline-none font-mono text-xs resize-y" placeholder="<p>Full post content...</p>" />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-4 font-bold rounded-xl bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent/90 transition-colors disabled:opacity-70">
                  {loading ? 'Saving...' : 'Save Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
