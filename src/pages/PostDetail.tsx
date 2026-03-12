import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, increment, collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { Post, Comment } from '../types';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, Bookmark, MessageCircle, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'posts', id));
        if (postDoc.exists()) {
          const data = { id: postDoc.id, ...postDoc.data() } as Post;
          setPost(data);
          
          // Increment views
          await updateDoc(doc(db, 'posts', id), {
            views: increment(1)
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `posts/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    // Fetch comments realtime
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('postId', '==', id), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !id) return;

    setSubmitting(true);
    try {
      console.log("Submitting comment payload:", {
        postId: id,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        content: newComment.trim(),
        createdAt: new Date().toISOString()
      });
      await addDoc(collection(db, 'comments'), {
        postId: id,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        content: newComment.trim(),
        createdAt: new Date().toISOString()
      });
      setNewComment('');
      console.log("Comment successfully added!");
    } catch (error: any) {
      console.error("Detailed comment upload error full object:", error);
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
      alert(`Failed to post comment. Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading story...</div>;
  if (!post) return <div className="p-20 text-center">Post not found</div>;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-24">
      <div className="relative h-[60vh]">
        <img 
          src={post.heroImage} 
          alt={post.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="absolute bottom-8 left-6 right-6 space-y-3">
          <span className="bg-accent px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
            {post.category}
          </span>
          <h1 className="text-3xl font-serif font-bold text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-400">
              {post.authorName?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{post.authorName}</p>
              <p className="text-xs text-slate-400">
                {post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : 'Recently'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <Share2 size={18} />
            </button>
            <button className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <Bookmark size={18} />
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate max-w-none"
        >
          <p className="text-lg font-serif italic text-slate-600 leading-relaxed mb-6">
            {post.excerpt}
          </p>
          <div className="text-slate-700 leading-loose space-y-4" dangerouslySetInnerHTML={{ __html: post.content }} />
        </motion.div>

        <div className="pt-8 border-t border-slate-100">
          <button 
            onClick={() => setShowComments(!showComments)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-50 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-100 transition-colors"
          >
            <MessageCircle size={18} />
            {showComments ? 'Hide Comments' : `View Comments (${comments.length})`}
          </button>

          {showComments && (
            <div className="mt-6 space-y-6">
              <h3 className="font-serif font-bold text-xl text-slate-900">Comments</h3>
              
              {user ? (
                <form onSubmit={handlePostComment} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex-shrink-0 flex items-center justify-center text-accent font-bold text-xs uppercase">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 pr-12"
                      disabled={submitting}
                    />
                    <button 
                      type="submit"
                      disabled={submitting || !newComment.trim()}
                      className="absolute right-2 top-2 p-1.5 text-accent hover:bg-accent/10 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl text-center text-sm text-slate-500">
                  Please <a href="/login" className="font-bold text-accent hover:underline">log in</a> to leave a comment.
                </div>
              )}

              <div className="space-y-4 mt-8">
                {comments.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-4">No comments yet. Be the first!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                        {comment.authorName?.charAt(0) || 'A'}
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-none p-4">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="font-bold text-sm text-slate-900">{comment.authorName}</span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
