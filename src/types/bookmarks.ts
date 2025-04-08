
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folder?: string;
  tags?: string[];
  date?: string; // Added for sorting by date
}

export interface Section {
  id: string;
  title: string;
  bookmarks: Bookmark[];
}

// Drag and drop related types
export interface DragItem {
  type: 'bookmark';
  bookmark: Bookmark;
  sectionId: string;
  index: number;
}
