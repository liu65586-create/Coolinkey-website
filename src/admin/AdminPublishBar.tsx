type Props = {
  statusLabel: string;
  detail: string;
  error: string | null;
  busy: boolean;
  canCommit: boolean;
  canDeploy: boolean;
  onSaveDraft: () => void;
  onExportJson: () => void;
  onExportFull: () => void;
  onPreview: () => void;
  onMarkCommitted: () => void;
  onMarkDeployed: () => void;
  onClearDraft: () => void;
  onImportZip: (file: File | null) => void;
};

export function AdminPublishBar(props: Props) {
  return (
    <section className="space-y-4 rounded-xl border border-white/12 bg-[#252a33] p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/60">发布状态</p>
        <h2 className="mt-1 text-xl font-semibold">{props.statusLabel}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#cccccc]">{props.detail}</p>
        {props.error ? <p className="mt-2 text-sm text-red-300">{props.error}</p> : null}
      </div>
      <p className="text-sm leading-relaxed text-[#cccccc]">
        保存草稿只留在这台浏览器。导出变更包不会更新线上官网。提交 Git 和 Vercel 部署需要你自己完成，再回来手动确认。
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-lg bg-[#00b51a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={props.busy} onClick={props.onSaveDraft}>
          保存本地草稿
        </button>
        <button type="button" className="rounded-lg border border-white/15 px-4 py-2 text-sm" disabled={props.busy} onClick={props.onPreview}>
          保存并预览草稿
        </button>
        <button type="button" className="rounded-lg border border-white/15 px-4 py-2 text-sm" disabled={props.busy} onClick={props.onExportJson}>
          下载配置 JSON
        </button>
        <button type="button" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0b1b2b] disabled:opacity-50" disabled={props.busy} onClick={props.onExportFull}>
          导出完整变更包
        </button>
        <label className="cursor-pointer rounded-lg border border-white/15 px-4 py-2 text-sm">
          从变更包恢复
          <input type="file" accept=".zip,application/zip" className="hidden" onChange={(e) => props.onImportZip(e.target.files?.[0] ?? null)} />
        </label>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
        <button type="button" className="rounded-lg border border-white/15 px-4 py-2 text-sm disabled:opacity-40" disabled={!props.canCommit || props.busy} onClick={props.onMarkCommitted}>
          我已提交到 Git
        </button>
        <button type="button" className="rounded-lg border border-white/15 px-4 py-2 text-sm disabled:opacity-40" disabled={!props.canDeploy || props.busy} onClick={props.onMarkDeployed}>
          我已在线上确认更新
        </button>
        <button type="button" className="rounded-lg border border-white/15 px-4 py-2 text-sm" onClick={props.onClearDraft}>
          清除本地草稿
        </button>
      </div>
    </section>
  );
}
