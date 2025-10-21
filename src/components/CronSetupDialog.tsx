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
import { useLanguage } from '@/contexts/LanguageContext';

export default function CronSetupDialog() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const cronUrl = 'https://functions.poehali.dev/2059700b-27e4-44a2-b539-769b7cec23a0';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('sync.copied'));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Icon name="Clock" size={16} className="mr-2" />
          {t('cron.automation')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Clock" size={24} />
            {t('cron.autoUpdate')}
          </DialogTitle>
          <DialogDescription>
            {t('cron.setupDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="p-4 bg-primary/5 rounded-lg border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Icon name="Link" size={18} />
              {t('cron.automationUrl')}
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
              {t('cron.setupOptions')}
            </h3>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">1</Badge>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">cron-job.org ({t('cron.recommended')})</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('cron.freeService')}
                  </p>
                  <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                    <li>{t('cron.register')} <a href="https://cron-job.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cron-job.org</a></li>
                    <li>{t('cron.createTask')}</li>
                    <li>{t('cron.pasteUrl')}</li>
                    <li>{t('cron.method')}: POST</li>
                    <li>{t('cron.schedule')}: <code className="bg-muted px-1 rounded">0 3 * * *</code> ({t('cron.everyDay')})</li>
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
                    {t('cron.alternativeService')}
                  </p>
                  <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                    <li>{t('cron.register')} <a href="https://www.easycron.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">easycron.com</a></li>
                    <li>{t('cron.createTask')}</li>
                    <li>URL: {t('cron.pasteUrl')}</li>
                    <li>{t('cron.method')}: POST</li>
                    <li>{t('cron.schedule')}: <code className="bg-muted px-1 rounded">0 3 * * *</code></li>
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
                    {t('cron.ifConnected')}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('cron.createFile')} <code className="bg-muted px-1 rounded">.github/workflows/sync-tariffs.yml</code>
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
                    {t('cron.copyYaml')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Icon name="Info" size={16} />
              {t('cron.cronSchedule')}
            </h4>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p><code className="bg-background px-1 rounded">0 3 * * *</code> — {t('cron.everyDay')}</p>
              <p><code className="bg-background px-1 rounded">0 */6 * * *</code> — {t('cron.every6Hours')}</p>
              <p><code className="bg-background px-1 rounded">0 0 * * 1</code> — {t('cron.everyMonday')}</p>
              <p><code className="bg-background px-1 rounded">0 0 1 * *</code> — {t('cron.firstDay')}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open('https://crontab.guru', '_blank')}
            >
              <Icon name="ExternalLink" size={16} className="mr-2" />
              {t('cron.generator')}
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                copyToClipboard(cronUrl);
                setOpen(false);
              }}
            >
              <Icon name="Check" size={16} className="mr-2" />
              {t('cron.done')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}