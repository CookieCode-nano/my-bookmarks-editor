
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folder?: string;
  tags?: string[];
}

export interface Section {
  id: string;
  title: string;
  bookmarks: Bookmark[];
}
