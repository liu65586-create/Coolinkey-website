import { Link } from "react-router-dom";
import { usePreviewDraft } from "../context/PreviewDraftContext";

export function DraftPreviewBanner() {
  const { previewDraft } = usePreviewDraft();
  if (!previewDraft) return null;
  return (
    <div className="bg-[#0b1b2b] px-4 py-2 text-center text-sm text-white">
      正在预览本机草稿。其他访客看不到这些修改，这也不是已发布内容。
      <Link className="ml-3 underline" to="/admin">
        返回后台
      </Link>
    </div>
  );
}
