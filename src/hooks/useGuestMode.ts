import { useState, useEffect } from 'react';
import { demoSkills, demoAssignments, DemoSkill, DemoAssignment } from '@/data/demoSkills';

interface GuestProgress {
  version: string;
  lastActivity: string;
  completedAssignments: {
    [assignmentId: string]: {
      status: 'not_started' | 'in_progress' | 'submitted' | 'completed';
      answer: string;
      score: number | null;
      submittedAt: string;
      aiFeedback?: any;
    };
  };
  skillProgress: {
    [skillId: string]: {
      progressPercent: number;
    };
  };
}

const GUEST_STORAGE_KEY = 'guestMode';

export const useGuestMode = () => {
  const [guestProgress, setGuestProgress] = useState<GuestProgress>(() => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading guest progress:', error);
    }
    
    return {
      version: '1.0',
      lastActivity: new Date().toISOString(),
      completedAssignments: {},
      skillProgress: {},
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestProgress));
    } catch (error) {
      console.error('Error saving guest progress:', error);
    }
  }, [guestProgress]);

  const getSkills = (): DemoSkill[] => {
    return demoSkills.map(skill => ({
      ...skill,
      progress_percent: guestProgress.skillProgress[skill.id]?.progressPercent || 0,
    }));
  };

  const getAssignments = (skillSlug: string) => {
    const skill = demoSkills.find(s => s.slug === skillSlug);
    if (!skill) return [];

    // Only return assignments from unlocked skills for guests
    const UNLOCKED_SKILL_SLUGS = ['communication', 'research'];
    if (!UNLOCKED_SKILL_SLUGS.includes(skillSlug)) {
      return [];
    }

    return demoAssignments
      .filter(a => a.skill_id === skill.id)
      .map(assignment => {
        const submission = guestProgress.completedAssignments[assignment.id];
        return {
          ...assignment,
          submission: submission ? {
            id: assignment.id,
            user_id: 'guest',
            assignment_id: assignment.id,
            status: submission.status,
            user_answer: submission.answer,
            score: submission.score,
            submitted_at: submission.submittedAt,
            ai_feedback: submission.aiFeedback,
            completed_at: submission.status === 'completed' ? submission.submittedAt : null,
          } : null,
        };
      });
  };

  const submitAssignment = (assignmentId: string, answer: string) => {
    setGuestProgress(prev => {
      const newProgress = { ...prev };
      newProgress.completedAssignments[assignmentId] = {
        status: 'submitted',
        answer,
        score: null,
        submittedAt: new Date().toISOString(),
      };
      newProgress.lastActivity = new Date().toISOString();

      // Пересчитать прогресс навыка
      const assignment = demoAssignments.find(a => a.id === assignmentId);
      if (assignment) {
        const skillAssignments = demoAssignments.filter(a => a.skill_id === assignment.skill_id);
        const completedCount = skillAssignments.filter(
          a => newProgress.completedAssignments[a.id]?.status === 'submitted' || 
               newProgress.completedAssignments[a.id]?.status === 'completed'
        ).length;
        const progressPercent = Math.round((completedCount / skillAssignments.length) * 100);
        
        if (!newProgress.skillProgress[assignment.skill_id]) {
          newProgress.skillProgress[assignment.skill_id] = { progressPercent: 0 };
        }
        newProgress.skillProgress[assignment.skill_id].progressPercent = progressPercent;
      }

      return newProgress;
    });
  };

  const updateAssignmentStatus = (
    assignmentId: string,
    status: 'not_started' | 'in_progress' | 'submitted' | 'completed',
    aiFeedback?: any,
    score?: number
  ) => {
    setGuestProgress(prev => {
      const newProgress = { ...prev };
      if (newProgress.completedAssignments[assignmentId]) {
        newProgress.completedAssignments[assignmentId] = {
          ...newProgress.completedAssignments[assignmentId],
          status,
          aiFeedback,
          score: score ?? newProgress.completedAssignments[assignmentId].score,
        };
      }
      newProgress.lastActivity = new Date().toISOString();
      return newProgress;
    });
  };

  const clearGuestProgress = () => {
    try {
      localStorage.removeItem(GUEST_STORAGE_KEY);
      setGuestProgress({
        version: '1.0',
        lastActivity: new Date().toISOString(),
        completedAssignments: {},
        skillProgress: {},
      });
    } catch (error) {
      console.error('Error clearing guest progress:', error);
    }
  };

  const getGuestProgressData = () => {
    return guestProgress;
  };

  return {
    getSkills,
    getAssignments,
    submitAssignment,
    updateAssignmentStatus,
    clearGuestProgress,
    getGuestProgressData,
  };
};
