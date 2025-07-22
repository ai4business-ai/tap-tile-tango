import React from 'react';
import { ArrowLeft, Play, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WebinarRecords = () => {
  const navigate = useNavigate();

  const webinars = [
    { id: 1, title: 'Вебинар 1', date: '22 апреля 2025' },
    { id: 2, title: 'Вебинар 2', date: '22 апреля 2025' },
    { id: 3, title: 'Вебинар 3', date: '22 апреля 2025' },
    { id: 4, title: 'Вебинар 4', date: '22 апреля 2025' },
    { id: 5, title: 'Вебинар 5', date: '22 апреля 2025' },
    { id: 6, title: 'Вебинар 6', date: '22 апреля 2025' }
  ];

  const handleWatchRecord = (webinarId: number) => {
    console.log(`Смотреть запись вебинара ${webinarId}`);
    // Здесь можно добавить логику открытия видео
  };

  return (
    <div className="min-h-screen bg-background p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="w-8 h-8 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Записи вебинаров</h1>
            <p className="text-sm text-muted-foreground">6 записей</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2">
          <img 
            src="/lovable-uploads/2b30c222-0182-4f9f-90f1-5056bee4557e.png" 
            alt="Билайн логотип" 
            className="w-6 h-auto"
          />
        </div>
      </div>

      {/* Webinar List */}
      <div className="space-y-4">
        {webinars.map((webinar) => (
          <div key={webinar.id} className="bg-card rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{webinar.title}</h3>
                <p className="text-sm text-muted-foreground">{webinar.date}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button 
                onClick={() => handleWatchRecord(webinar.id)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Play className="w-4 h-4" />
                Смотреть запись
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebinarRecords;