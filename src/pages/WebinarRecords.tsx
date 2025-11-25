import React, { useState } from 'react';
import { ArrowLeft, Play, FileText, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { demoSkills, demoAssignments } from '@/data/demoSkills';

interface TheoryItem {
  id: string;
  title: string;
  skillName: string;
  type: 'video' | 'material' | 'webinar';
}

const WebinarRecords = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('videos');

  // Генерируем обучающие видео из заданий
  const videos: TheoryItem[] = demoSkills.flatMap(skill => {
    const skillAssignments = demoAssignments.filter(a => a.skill_id === skill.id).slice(0, 3);
    return skillAssignments.map((assignment, idx) => ({
      id: `video-${skill.id}-${idx}`,
      title: `Видео: ${assignment.title}`,
      skillName: skill.name,
      type: 'video' as const
    }));
  });

  // Генерируем дополнительные материалы
  const materials: TheoryItem[] = demoSkills.flatMap(skill => {
    const skillAssignments = demoAssignments.filter(a => a.skill_id === skill.id).slice(3, 5);
    return skillAssignments.map((assignment, idx) => ({
      id: `material-${skill.id}-${idx}`,
      title: `Материал: ${assignment.title}`,
      skillName: skill.name,
      type: 'material' as const
    }));
  });

  // Вебинары (оставляем прежние)
  const webinars: TheoryItem[] = [
    { id: 'webinar-1', title: 'Вебинар 1', skillName: '22 апреля 2025', type: 'webinar' },
    { id: 'webinar-2', title: 'Вебинар 2', skillName: '22 апреля 2025', type: 'webinar' },
    { id: 'webinar-3', title: 'Вебинар 3', skillName: '22 апреля 2025', type: 'webinar' },
    { id: 'webinar-4', title: 'Вебинар 4', skillName: '22 апреля 2025', type: 'webinar' },
    { id: 'webinar-5', title: 'Вебинар 5', skillName: '22 апреля 2025', type: 'webinar' },
    { id: 'webinar-6', title: 'Вебинар 6', skillName: '22 апреля 2025', type: 'webinar' }
  ];

  const handleItemClick = (item: TheoryItem) => {
    console.log(`Открыть ${item.type}: ${item.title}`);
  };

  const renderItems = (items: TheoryItem[]) => (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="glass-card rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.skillName}</p>
            </div>
          </div>
          
          <button 
            onClick={() => handleItemClick(item)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors w-full justify-center"
          >
            {item.type === 'video' || item.type === 'webinar' ? (
              <>
                <Play className="w-4 h-4" />
                Смотреть
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Открыть материал
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 p-4 md:p-6 lg:p-8 max-w-sm md:max-w-md lg:max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="w-8 h-8 flex items-center justify-center"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Теория</h1>
          <p className="text-sm text-muted-foreground">Обучающие материалы</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="videos">Видео</TabsTrigger>
          <TabsTrigger value="materials">Материалы</TabsTrigger>
          <TabsTrigger value="webinars">Вебинары</TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos">
          {renderItems(videos)}
        </TabsContent>
        
        <TabsContent value="materials">
          {renderItems(materials)}
        </TabsContent>
        
        <TabsContent value="webinars">
          {renderItems(webinars)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebinarRecords;
