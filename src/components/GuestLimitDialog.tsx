import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Lock } from 'lucide-react';

interface GuestLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

export const GuestLimitDialog = ({ 
  open, 
  onOpenChange,
  feature = 'Эта функция'
}: GuestLimitDialogProps) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    onOpenChange(false);
    navigate('/auth');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-orange-500/20">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-orange-500" />
            <AlertDialogTitle className="text-xl">Доступно после регистрации</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            {feature} доступна только зарегистрированным пользователям. 
            Зарегистрируйтесь бесплатно, чтобы сохранить свой прогресс и получить полный доступ ко всем возможностям платформы.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRegister}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            Зарегистрироваться
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
