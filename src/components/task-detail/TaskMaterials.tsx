
import React from 'react';
import { FileSpreadsheet, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TaskMaterialsProps {
  onDownloadTable: () => void;
  onOpenCourse: () => void;
}

export const TaskMaterials = ({ onDownloadTable, onOpenCourse }: TaskMaterialsProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-3">Материалы</h3>
      <div className="space-y-3">
        <Card className="cursor-pointer hover:bg-muted/20 transition-colors" onClick={onDownloadTable}>
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-foreground">Ссылка на таблицу</span>
            </div>
            <Badge variant="outline" className="text-xs">
              Telegram Bot
            </Badge>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/20 transition-colors" onClick={onOpenCourse}>
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-foreground">Ссылка на курс</span>
            </div>
            <Badge variant="outline" className="text-xs">
              Telegram Bot
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
