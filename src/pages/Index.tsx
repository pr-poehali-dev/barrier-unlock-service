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
    
    setTimeout(() => {
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
    }, 2000);
  };

  const getStatusColor = () => {
    switch (barrierStatus) {
      case 'open': return 'bg-accent';
      case 'closed': return 'bg-destructive';
      case 'moving': return 'bg-primary';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            BARRIER CONTROL
          </h1>
          <p className="text-muted-foreground text-lg">
            Система управления шлагбаумом
          </p>
        </div>

        {/* Main Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status & Control */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Панель управления</CardTitle>
                    <CardDescription>Текущий статус системы</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor()} ${barrierStatus === 'moving' ? 'animate-pulse-slow' : ''}`}></div>
                    <Badge variant={barrierStatus === 'open' ? 'default' : barrierStatus === 'closed' ? 'destructive' : 'secondary'}>
                      {getStatusText()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visual Barrier Representation */}
                <div className="relative bg-muted/20 rounded-lg p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
                  <div className="relative flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-2 bg-muted rounded"></div>
                      <div 
                        className={`w-16 h-2 bg-gradient-to-r transition-all duration-2000 ease-in-out ${
                          barrierStatus === 'open' 
                            ? 'from-accent to-accent rotate-90' 
                            : barrierStatus === 'moving'
                            ? 'from-primary to-primary rotate-45 animate-pulse'
                            : 'from-destructive to-destructive rotate-0'
                        }`}
                        style={{
                          transformOrigin: 'left center'
                        }}
                      ></div>
                      <div className="w-8 h-2 bg-muted rounded"></div>
                    </div>
                  </div>
                  <div className="text-center mt-4 text-sm text-muted-foreground">
                    Визуализация положения шлагбаума
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => handleBarrierAction('open')}
                    disabled={barrierStatus === 'moving' || barrierStatus === 'open'}
                    className="h-16 text-lg font-medium bg-accent hover:bg-accent/90 transition-all duration-200 hover:scale-105"
                  >
                    <Icon name="ChevronUp" size={24} className="mr-2" />
                    Открыть
                  </Button>
                  <Button 
                    onClick={() => handleBarrierAction('close')}
                    disabled={barrierStatus === 'moving' || barrierStatus === 'closed'}
                    variant="destructive"
                    className="h-16 text-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    <Icon name="ChevronDown" size={24} className="mr-2" />
                    Закрыть
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Activity" size={20} className="mr-2" />
                  Журнал активности
                </CardTitle>
                <CardDescription>Последние операции с шлагбаумом</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${log.action === 'open' ? 'bg-accent' : 'bg-destructive'}`}></div>
                        <div>
                          <div className="font-medium">
                            {log.action === 'open' ? 'Открытие' : 'Закрытие'} шлагбаума
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {log.user} • {log.reason}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>{formatTime(log.timestamp)}</div>
                        <div>{formatDate(log.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Stats */}
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Icon name="BarChart3" size={20} className="mr-2" />
                  Статистика
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{operationCount}</div>
                  <div className="text-sm text-muted-foreground">Операций за месяц</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Заряд батареи</span>
                    <span>{batteryLevel}%</span>
                  </div>
                  <Progress value={batteryLevel} className="h-2" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Последняя операция: {formatTime(lastOperation)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Icon name="Shield" size={20} className="mr-2" />
                  Система
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Статус сети</span>
                  <Badge variant="default" className="bg-accent">
                    <Icon name="Wifi" size={12} className="mr-1" />
                    Онлайн
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Безопасность</span>
                  <Badge variant="default" className="bg-accent">
                    <Icon name="Lock" size={12} className="mr-1" />
                    Активна
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Обновления</span>
                  <Badge variant="secondary">
                    <Icon name="CheckCircle" size={12} className="mr-1" />
                    Актуально
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Icon name="Settings" size={20} className="mr-2" />
                  Быстрые действия
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="History" size={16} className="mr-2" />
                  Экспорт журнала
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Перезагрузка системы
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="AlertTriangle" size={16} className="mr-2" />
                  Режим обслуживания
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}