export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  content: string;
}

export type ThemeCluster = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ThemeSpec {
  title: string;
  slug: string;
  cluster: ThemeCluster;
}
