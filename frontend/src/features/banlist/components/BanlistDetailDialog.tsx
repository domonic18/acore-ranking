import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';
import type { BanRecord } from '../types';

// 封禁原因支持 GFM markdown（react-markdown 默认不渲染原始 HTML，无 XSS 面）
const markdownClass =
  'text-sm leading-relaxed [&_a]:text-sky-600 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_h1]:mb-2 [&_h1]:mt-3 [&_h1]:text-base [&_h1]:font-bold [&_h1]:first:mt-0 [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:first:mt-0 [&_hr]:my-3 [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1.5 [&_p]:first:mt-0 [&_p]:last:mb-0 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-2 [&_table]:w-full [&_table]:text-xs [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_ul]:list-disc [&_ul]:pl-5';

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex gap-3 py-1.5 text-sm">
    <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
    <div className="min-w-0 flex-1 break-words">{children}</div>
  </div>
);

const BanTypeBadge = ({ type }: { type: string }) => {
  const isAccount = type === 'account';
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
        isAccount
          ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
          : 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
      }`}
    >
      {isAccount ? '账号封禁' : '角色封禁'}
    </span>
  );
};

interface BanlistDetailDialogProps {
  record: BanRecord | null;
  onClose: () => void;
}

export function BanlistDetailDialog({ record, onClose }: BanlistDetailDialogProps) {
  return (
    <Dialog open={record !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            封禁详情
            {record && <BanTypeBadge type={record.banType} />}
          </DialogTitle>
          <DialogDescription>封禁记录完整信息</DialogDescription>
        </DialogHeader>

        {record && (
          <div className="divide-y divide-border">
            <DetailRow label="角色名">
              {record.character_names ? (
                <div className="flex flex-wrap gap-1.5">
                  {record.character_names.split(',').filter(Boolean).map((name) => (
                    <Link
                      key={name}
                      to={`/character/${encodeURIComponent(name)}`}
                      className="rounded-md bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:hover:bg-sky-900/50"
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </DetailRow>
            <DetailRow label="所属账号">{record.username || <span className="text-muted-foreground">—</span>}</DetailRow>
            <DetailRow label="最后 IP">{record.last_ip || <span className="text-muted-foreground">—</span>}</DetailRow>
            <DetailRow label="封禁时间">{record.bandate}</DetailRow>
            <DetailRow label="解封时间">
              {record.bandate === record.unbandate ? (
                <span className="font-medium text-red-500">永久</span>
              ) : (
                record.unbandate
              )}
            </DetailRow>
            <div className="py-2">
              <div className="mb-1 text-sm text-muted-foreground">封禁原因</div>
              {record.banreason ? (
                <div className={markdownClass}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{record.banreason}</ReactMarkdown>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">未填写</span>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
