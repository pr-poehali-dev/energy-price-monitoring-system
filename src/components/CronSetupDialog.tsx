import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

export default function CronSetupDialog() {
  const [open, setOpen] = useState(false);
  const cronUrl = 'https://functions.poehali.dev/2059700b-27e4-44a2-b539-769b7cec23a0';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Icon name="Clock" size={16} className="mr-2" />
          Автоматизация
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Clock" size={24} />
            Автоматическое обновление тарифов
          </DialogTitle>
          <DialogDescription>
            Настройте ежедневную синхронизацию данных о тарифах на электроэнергию
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="p-4 bg-primary/5 rounded-lg border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Icon name="Link" size={18} />
              URL для автоматизации
            </h3>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-background rounded text-xs break-all">
                {cronUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(cronUrl)}
              >
                <Icon name="Copy" size={16} />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="Settings" size={18} />
              Варианты настройки
            </h3>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">1</Badge>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">cron-job.org (Рекомендуется)</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Бесплатный сервис для запуска задач по расписанию
                  </p>
                  <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                    <li>Зарегистрируйтесь на <a href="https://cron-job.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cron-job.org</a></li>
                    <li>Создайте новую задачу</li>
                    <li>Вставьте URL выше</li>
                    <li>Метод: POST</li>
                    <li>Расписание: <code className="bg-muted px-1 rounded">0 3 * * *</code> (3:00 каждый день)</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">2</Badge>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">EasyCron.com</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Альтернативный бесплатный cron-сервис
                  </p>
                  <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                    <li>Зарегистрируйтесь на <a href="https://www.easycron.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">easycron.com</a></li>
                    <li>Create Cron Job</li>
                    <li>URL: вставьте URL выше</li>
                    <li>HTTP Method: POST</li>
                    <li>Cron Expression: <code className="bg-muted px-1 rounded">0 3 * * *</code></li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">3</Badge>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">GitHub Actions</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Если проект подключён к GitHub
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Создайте файл <code className="bg-muted px-1 rounded">.github/workflows/sync-tariffs.yml</code>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`name: Daily Tariff Sync
on:
  schedule:
    - cron: '0 3 * * *'
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger tariff sync
        run: curl -X POST ${cronUrl}`)}
                  >
                    <Icon name="Copy" size={16} className="mr-2" />
                    Скопировать YAML
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Icon name="Info" size={16} />
              Расписание Cron
            </h4>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p><code className="bg-background px-1 rounded">0 3 * * *</code> — каждый день в 03:00 UTC</p>
              <p><code className="bg-background px-1 rounded">0 */6 * * *</code> — каждые 6 часов</p>
              <p><code className="bg-background px-1 rounded">0 0 * * 1</code> — каждый понедельник в 00:00</p>
              <p><code className="bg-background px-1 rounded">0 0 1 * *</code> — 1-го числа каждого месяца</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open('https://crontab.guru', '_blank')}
            >
              <Icon name="ExternalLink" size={16} className="mr-2" />
              Генератор Cron
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                copyToClipboard(cronUrl);
                setOpen(false);
              }}
            >
              <Icon name="Check" size={16} className="mr-2" />
              Готово
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
