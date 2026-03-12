import { Category, Post } from './types';
import { Plane, Utensils, Cpu, Heart, Palette, Globe } from 'lucide-react';

export const CATEGORIES: { label: Category; icon: any }[] = [
  { label: 'Travel', icon: Plane },
  { label: 'Food', icon: Utensils },
  { label: 'Tech', icon: Cpu },
  { label: 'Lifestyle', icon: Heart },
  { label: 'Design', icon: Palette },
  { label: 'Culture', icon: Globe },
];

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Art of Slow Travel in Tuscany',
    excerpt: 'Discovering the hidden gems of the Italian countryside, one vineyard at a time.',
    content: '',
    category: 'Travel',
    authorName: 'Elena Rossi',
    authorId: 'author1',
    publishedAt: new Date().toISOString(),
    heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    status: 'Published',
    views: 1240,
  },
  {
    id: '2',
    title: 'Minimalism in Modern Web Design',
    excerpt: 'How stripping away the noise leads to better user experiences and faster load times.',
    content: '',
    category: 'Design',
    authorName: 'Marcus Chen',
    authorId: 'author2',
    publishedAt: new Date().toISOString(),
    heroImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    status: 'Published',
    views: 850,
  },
  {
    id: '3',
    title: 'The Future of AI in Creative Writing',
    excerpt: 'Exploring the intersection of human creativity and machine learning algorithms.',
    content: '',
    category: 'Tech',
    authorName: 'Sarah Jenkins',
    authorId: 'author3',
    publishedAt: new Date().toISOString(),
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    status: 'Draft',
    views: 0,
  }
];
