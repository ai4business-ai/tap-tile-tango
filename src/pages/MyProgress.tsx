import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserSkills } from '@/hooks/useUserSkills';
import { GuestLimitDialog } from '@/components/GuestLimitDialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CompetencyMap } from '@/components/progress/CompetencyMap';
import { CourseProgress } from '@/components/progress/CourseProgress';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const MyProgress = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { skills, updateTargetLevel } = useUserSkills(user?.id);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuestLimit, setShowGuestLimit] = useState(false);

  const handleSettingsClick = () => {
    if (!user) {
      setShowGuestLimit(true);
    } else {
      setShowSettings(true);
    }
  };

  return (
    <div className="min-h-screen">
      <GuestLimitDialog
        open={showGuestLimit} 
        onOpenChange={setShowGuestLimit}
        feature="Изменение целевого уровня навыков"
      />

      <div className="pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 glass-subtle rounded-2xl flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <h1 className="text-xl font-semibold text-foreground">Мой прогресс</h1>
          </div>
          <button 
            onClick={handleSettingsClick}
            className="w-10 h-10 glass-subtle rounded-2xl flex items-center justify-center"
          >
            <Settings className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="competency-map" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="competency-map" className="flex-1">Карта компетенций</TabsTrigger>
            <TabsTrigger value="courses" className="flex-1">Мои курсы</TabsTrigger>
          </TabsList>
          <TabsContent value="competency-map">
            <CompetencyMap />
          </TabsContent>
          <TabsContent value="courses">
            <CourseProgress />
          </TabsContent>
        </Tabs>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto bg-popover/95 backdrop-blur-xl border-border">
            <DialogHeader>
              <DialogTitle>Настройка целевых уровней</DialogTitle>
              <DialogDescription>Выберите целевой уровень для каждого навыка</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {skills.map((skill) => (
                <div key={skill.id} className="space-y-2">
                  <h4 className="text-sm font-medium">{skill.skill.name}</h4>
                  <Select value={skill.target_level.toString()} onValueChange={(value) => updateTargetLevel(skill.skill_id, parseInt(value))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-xl border-border z-50">
                      <SelectItem value="1">Basic</SelectItem>
                      <SelectItem value="2">Pro</SelectItem>
                      <SelectItem value="3">AI-Native</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <Button onClick={() => setShowSettings(false)} className="w-full mt-6">Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyProgress;
