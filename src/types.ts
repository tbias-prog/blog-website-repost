export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  role: 'admin' | 'reader';
  photoURL: string | null;
}

export type Category = 'Travel' | 'Food' | 'Tech' | 'Lifestyle' | 'Design' | 'Culture';

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  authorName: string;
  authorId: string;
  publishedAt: string;
  heroImage: string;
  status: 'Published' | 'Draft';
  views: number;
}

export interface Analytics {
  totalViews: number;
  activePosts: number;
  subscribers: number;
}

export interface Feedback {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}
