import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface BarrierLog {
  id: string;
  action: 'open' | 'close';
  timestamp: Date;
  user: string;
  reason?: string;
}

export default function Index() {
  const [barrierStatus, setBarrierStatus] = useState<'open' | 'closed' | 'moving'>('closed');
  const [barrierRotation, setBarrierRotation] = useState(0);
  const [lastOperation, setLastOperation] = useState<Date>(new Date());
  const [operationCount, setOperationCount] = useState(47);
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [logs, setLogs] = useState<BarrierLog[]>([
    {
      id: '1',
      action: 'close',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      user: 'Система',
      reason: 'Автоматическое закрытие'
    },
    {
      id: '2', 
      action: 'open',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      user: 'Администратор',
      reason: 'Проезд служебного транспорта'
    },
    {
      id: '3',
      action: 'close',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      user: 'Охрана',
      reason: 'Окончание рабочего дня'
    }
  ]);

  const handleBarrierAction = (action: 'open' | 'close') => {
    setBarrierStatus('moving');
    
    // Анимация поворота шлагбаума
    const targetRotation = action === 'open' ? -90 : 0;
    const startRotation = barrierRotation;
    const duration = 2000;
    const startTime = Date.now();
    
    const animateRotation = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function для плавности
      const easeInOut = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const currentRotation = startRotation + (targetRotation - startRotation) * easeInOut;
      setBarrierRotation(currentRotation);
      
      if (progress < 1) {
        requestAnimationFrame(animateRotation);
      } else {
        setBarrierStatus(action);
        setLastOperation(new Date());
        setOperationCount(prev => prev + 1);
        
        const newLog: BarrierLog = {
          id: Date.now().toString(),
          action,
          timestamp: new Date(),
          user: 'Оператор',
          reason: action === 'open' ? 'Ручное открытие' : 'Ручное закрытие'
        };
        
        setLogs(prev => [newLog, ...prev.slice(0, 4)]);
      }
    };
    
    animateRotation();
  };

  const getStatusColor = () => {
    switch (barrierStatus) {
      case 'open': return 'bg-accent';
      case 'closed': return 'bg-destructive';
      case 'moving': return 'bg-primary animate-pulse';
      default: return 'bg-muted';
    }
  };

  const getStatusText = () => {
    switch (barrierStatus) {
      case 'open': return 'Открыт';
      case 'closed': return 'Закрыт';
      case 'moving': return 'Движется';
      default: return 'Неизвестно';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: 'url(/img/89f64bad-8010-4395-8df5-53a086ccdf0a.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 py-12">
            <h1 className="text-5xl font-light tracking-tight text-white drop-shadow-lg">
              Barrier Control
            </h1>
            <p className="text-white/90 text-xl font-light drop-shadow">
              Система управления шлагбаумом
            </p>
          </div>

          {/* Main Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Status & Control */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-white/25 backdrop-blur-md border-white/20 shadow-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-light text-gray-900">Панель управления</CardTitle>
                      <CardDescription className="text-gray-700">Текущий статус системы</CardDescription>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor()} shadow-lg`}></div>
                      <Badge variant={barrierStatus === 'open' ? 'default' : barrierStatus === 'closed' ? 'destructive' : 'secondary'} className="shadow-sm">
                        {getStatusText()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Visual Barrier Representation */}
                  <div className="relative bg-white/20 backdrop-blur-sm rounded-2xl p-12 border border-white/30 shadow-inner">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center space-x-6">
                        {/* Левая стойка */}
                        <div className="w-3 h-16 bg-gray-600 rounded-full shadow-lg"></div>
                        
                        {/* Шлагбаум */}
                        <div className="relative">
                          <div 
                            className="w-32 h-3 bg-gradient-to-r from-red-500 to-white rounded-full shadow-lg transition-all duration-75 ease-out"
                            style={{
                              transform: `rotate(${barrierRotation}deg)`,
                              transformOrigin: 'left center'
                            }}
                          >
                            {/* Полоски на шлагбауме */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-white via-25% from-red-500 from-50% via-white via-75% to-red-500 rounded-full opacity-90"></div>
                          </div>
                        </div>
                        
                        {/* Правая стойка */}
                        <div className="w-3 h-16 bg-gray-600 rounded-full shadow-lg"></div>
                      </div>
                    </div>
                    <div className="text-center mt-6 text-gray-700 font-medium">
                      Визуализация положения шлагбаума
                    </div>
                    
                    {/* Индикатор угла */}
                    <div className="absolute top-4 right-4 bg-white/30 backdrop-blur-sm rounded-lg px-3 py-1 text-sm text-gray-700">
                      {Math.abs(barrierRotation).toFixed(0)}°
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="grid grid-cols-2 gap-6">
                    <Button 
                      onClick={() => handleBarrierAction('open')}
                      disabled={barrierStatus === 'moving' || barrierStatus === 'open'}
                      className="h-20 text-lg font-medium bg-accent hover:bg-accent/90 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg border-0 text-white"
                    >
                      <Icon name="ChevronUp" size={28} className="mr-3" />
                      Открыть
                    </Button>
                    <Button 
                      onClick={() => handleBarrierAction('close')}
                      disabled={barrierStatus === 'moving' || barrierStatus === 'closed'}
                      variant="destructive"
                      className="h-20 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg border-0"
                    >
                      <Icon name="ChevronDown" size={28} className="mr-3" />
                      Закрыть
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Log */}
              <Card className="bg-white/25 backdrop-blur-md border-white/20 shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-gray-900 font-light">
                    <Icon name="Activity" size={22} className="mr-3" />
                    Журнал активности
                  </CardTitle>
                  <CardDescription className="text-gray-700">Последние операции с шлагбаумом</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm hover:bg-white/30 transition-all duration-200">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full shadow-sm ${log.action === 'open' ? 'bg-accent' : 'bg-destructive'}`}></div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {log.action === 'open' ? 'Открытие' : 'Закрытие'} шлагбаума
                            </div>
                            <div className="text-sm text-gray-700">
                              {log.user} • {log.reason}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-700">
                          <div className="font-medium">{formatTime(log.timestamp)}</div>
                          <div>{formatDate(log.timestamp)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Stats */}
            <div className="space-y-8">
              <Card className="bg-white/25 backdrop-blur-md border-white/20 shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg text-gray-900 font-light">
                    <Icon name="BarChart3" size={20} className="mr-3" />
                    Статистика
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-light text-primary mb-1">{operationCount}</div>
                    <div className="text-sm text-gray-700">Операций за месяц</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Заряд батареи</span>
                      <span className="font-medium">{batteryLevel}%</span>
                    </div>
                    <Progress value={batteryLevel} className="h-2 bg-white/30" />
                  </div>
                  <div className="text-sm text-gray-700 text-center">
                    Последняя операция: {formatTime(lastOperation)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/25 backdrop-blur-md border-white/20 shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg text-gray-900 font-light">
                    <Icon name="Shield" size={20} className="mr-3" />
                    Система
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Статус сети</span>
                    <Badge variant="default" className="bg-accent shadow-sm">
                      <Icon name="Wifi" size={12} className="mr-1" />
                      Онлайн
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Безопасность</span>
                    <Badge variant="default" className="bg-accent shadow-sm">
                      <Icon name="Lock" size={12} className="mr-1" />
                      Активна
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Обновления</span>
                    <Badge variant="secondary" className="shadow-sm">
                      <Icon name="CheckCircle" size={12} className="mr-1" />
                      Актуально
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/25 backdrop-blur-md border-white/20 shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg text-gray-900 font-light">
                    <Icon name="Settings" size={20} className="mr-3" />
                    Быстрые действия
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-white/20 border-white/30 text-gray-700 hover:bg-white/30 shadow-sm">
                    <Icon name="History" size={16} className="mr-3" />
                    Экспорт журнала
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-white/20 border-white/30 text-gray-700 hover:bg-white/30 shadow-sm">
                    <Icon name="RefreshCw" size={16} className="mr-3" />
                    Перезагрузка системы
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-white/20 border-white/30 text-gray-700 hover:bg-white/30 shadow-sm">
                    <Icon name="AlertTriangle" size={16} className="mr-3" />
                    Режим обслуживания
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}