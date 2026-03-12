import React from 'react';
import { Post } from '../types';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  index: number;
}

export const PostCard: React.FC<PostCardProps> = ({ post, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/post/${post.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-sm mb-4">
          <img
            src={post.heroImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-900">
              {post.category}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-serif leading-tight text-slate-900 group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex items-center gap-3 pt-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
              {post.authorName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-900">{post.authorName}</span>
              <span className="text-[10px] text-slate-400">
                {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
