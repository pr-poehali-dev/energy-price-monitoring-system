import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import DashboardHeader from '@/components/energy/DashboardHeader';

interface SyncLog {
  id: number;
  sync_type: string;
  status: string;
  parsed_count: number;
  updated_count: number;
  skipped_count: number;
  errors: string[];
  source_info: {
    parse_url: string;
    update_url: string;
    tariffs_sources: string[];
  };
  started_at: string;
  completed_at: string;
  duration_ms: number;
  trigger_type: string;
}

export default function SyncLogs() {
  const { t, language } = useLanguage();
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const statusParam = filter !== 'all' ? `&status=${filter}` : '';
      const response = await fetch(
        `https://functions.poehali.dev/5606995a-2d8e-4d69-b0a8-1affb0a13f71?limit=50${statusParam}`
      );
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      success: 'default',
      partial: 'secondary',
      failed: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status === 'success' && <Icon name="CheckCircle2" size={14} className="mr-1" />}
        {status === 'failed' && <Icon name="XCircle" size={14} className="mr-1" />}
        {status === 'partial' && <Icon name="AlertCircle" size={14} className="mr-1" />}
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <DashboardHeader />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Icon name="Activity" size={28} />
              {t('logs.title')}
            </h2>
            <p className="text-muted-foreground">{t('logs.subtitle')}</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              {t('logs.all')}
            </Button>
            <Button
              variant={filter === 'success' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('success')}
            >
              <Icon name="CheckCircle2" size={16} className="mr-1" />
              {t('logs.success')}
            </Button>
            <Button
              variant={filter === 'partial' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('partial')}
            >
              <Icon name="AlertCircle" size={16} className="mr-1" />
              {t('logs.partial')}
            </Button>
            <Button
              variant={filter === 'failed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('failed')}
            >
              <Icon name="XCircle" size={16} className="mr-1" />
              {t('logs.failed')}
            </Button>
            <Button variant="outline" size="sm" onClick={fetchLogs}>
              <Icon name="RefreshCw" size={16} className="mr-1" />
              {t('logs.refresh')}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader2" size={32} className="animate-spin text-primary" />
          </div>
        ) : logs.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">{t('logs.noLogs')}</h3>
            <p className="text-muted-foreground">{t('logs.noLogsDesc')}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <Card key={log.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(log.status)}
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <Icon name="Zap" size={16} />
                        {log.sync_type.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(log.started_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      <Icon name={log.trigger_type === 'manual' ? 'User' : 'Clock'} size={14} className="mr-1" />
                      {log.trigger_type}
                    </Badge>
                    <Badge variant="outline">
                      <Icon name="Timer" size={14} className="mr-1" />
                      {formatDuration(log.duration_ms)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">{t('logs.parsed')}</div>
                    <div className="text-2xl font-bold">{log.parsed_count}</div>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">{t('logs.updated')}</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {log.updated_count}
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">{t('logs.skipped')}</div>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {log.skipped_count}
                    </div>
                  </div>
                </div>

                {log.source_info && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <div className="text-xs font-medium mb-2 flex items-center gap-1">
                      <Icon name="Database" size={14} />
                      {t('logs.sources')}:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {log.source_info.tariffs_sources.map((source, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {log.errors && log.errors.length > 0 && (
                  <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <div className="text-xs font-medium mb-2 flex items-center gap-1 text-destructive">
                      <Icon name="AlertTriangle" size={14} />
                      {t('logs.errors')} ({log.errors.length}):
                    </div>
                    <ul className="text-sm space-y-1">
                      {log.errors.map((error, idx) => (
                        <li key={idx} className="text-muted-foreground">
                          • {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}