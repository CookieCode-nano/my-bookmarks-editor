
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bookmark, Section, BookmarkTitleChange } from "@/types/bookmarks";
import { useToast } from "@/hooks/use-toast";
import { Undo, X, Check } from "lucide-react";

interface TitleCleanerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: Section[];
  onApplyChanges: (changes: BookmarkTitleChange[]) => void;
  onUndoLastChange: () => void;
  canUndo: boolean;
}

const TitleCleaner: React.FC<TitleCleanerProps> = ({
  open,
  onOpenChange,
  sections,
  onApplyChanges,
  onUndoLastChange,
  canUndo
}) => {
  const [redundantChars, setRedundantChars] = useState<string>("［］（）【】");
  const [filteredBookmarks, setFilteredBookmarks] = useState<Array<{
    bookmark: Bookmark;
    sectionId: string;
    newTitle: string;
    selected: boolean;
  }>>([]);
  const [selectAll, setSelectAll] = useState(false);
  const { toast } = useToast();

  // Find bookmarks with redundant characters
  useEffect(() => {
    if (open && redundantChars.length > 0) {
      findBookmarksWithRedundantChars();
    }
  }, [open, redundantChars, sections]);

  const findBookmarksWithRedundantChars = () => {
    const result: Array<{
      bookmark: Bookmark;
      sectionId: string;
      newTitle: string;
      selected: boolean;
    }> = [];

    // Create a regex pattern from the redundant characters
    const pattern = redundantChars.split('').map(char => {
      // Escape special regex characters
      return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('|');

    if (!pattern) return;

    const regex = new RegExp(`[${pattern}]`, 'g');

    sections.forEach(section => {
      section.bookmarks.forEach(bookmark => {
        const newTitle = bookmark.title.replace(regex, '').trim();
        
        // Only include if the title would actually change
        if (newTitle !== bookmark.title) {
          result.push({
            bookmark,
            sectionId: section.id,
            newTitle,
            selected: false
          });
        }
      });
    });

    setFilteredBookmarks(result);
  };

  const toggleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setFilteredBookmarks(
      filteredBookmarks.map(item => ({ ...item, selected: newValue }))
    );
  };

  const toggleBookmarkSelection = (index: number) => {
    const newFilteredBookmarks = [...filteredBookmarks];
    newFilteredBookmarks[index].selected = !newFilteredBookmarks[index].selected;
    setFilteredBookmarks(newFilteredBookmarks);
    
    // Update selectAll status
    setSelectAll(newFilteredBookmarks.every(item => item.selected));
  };

  const handleApplyChanges = () => {
    const selectedChanges = filteredBookmarks
      .filter(item => item.selected)
      .map(item => ({
        bookmarkId: item.bookmark.id,
        sectionId: item.sectionId,
        oldTitle: item.bookmark.title,
        newTitle: item.newTitle
      }));

    if (selectedChanges.length === 0) {
      toast({
        title: "未選擇書籤",
        description: "請至少選擇一個書籤進行修改",
        variant: "destructive",
      });
      return;
    }

    onApplyChanges(selectedChanges);
    
    toast({
      title: "成功移除贅詞",
      description: `已修改 ${selectedChanges.length} 個書籤標題`,
    });
    
    // Find remaining bookmarks with redundant characters
    findBookmarksWithRedundantChars();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>移除書籤標題贅詞</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="redundantChars">
              輸入要移除的贅詞字元：
            </label>
            <Input
              id="redundantChars"
              value={redundantChars}
              onChange={(e) => setRedundantChars(e.target.value)}
              placeholder="輸入要移除的贅詞字元，例如：［］（）"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              輸入後系統會自動搜尋包含這些字元的書籤
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="selectAll" 
                checked={selectAll}
                onCheckedChange={toggleSelectAll}
              />
              <label htmlFor="selectAll" className="text-sm cursor-pointer">
                全選 ({filteredBookmarks.length} 個結果)
              </label>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onUndoLastChange}
                disabled={!canUndo}
              >
                <Undo className="h-4 w-4 mr-1" />
                還原上一步
              </Button>
              <Button size="sm" onClick={handleApplyChanges}>
                <Check className="h-4 w-4 mr-1" />
                套用變更
              </Button>
            </div>
          </div>

          {filteredBookmarks.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>原始標題</TableHead>
                    <TableHead>處理後標題</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookmarks.map((item, index) => (
                    <TableRow key={item.bookmark.id}>
                      <TableCell>
                        <Checkbox
                          checked={item.selected}
                          onCheckedChange={() => toggleBookmarkSelection(index)}
                        />
                      </TableCell>
                      <TableCell>{item.bookmark.title}</TableCell>
                      <TableCell>{item.newTitle}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {redundantChars.length > 0 
                ? "沒有找到包含贅詞的書籤" 
                : "請輸入要移除的贅詞字元"}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TitleCleaner;
