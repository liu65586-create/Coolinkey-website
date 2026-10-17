const STATUS_KEY = "coolinkey_admin_release_status";

export type ReleaseStatus = {
  exportHash: string | null;
  exportedAt: string | null;
  committedAt: string | null;
  deployedAt: string | null;
};

export function readReleaseStatus(): ReleaseStatus {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    if (!raw) return { exportHash: null, exportedAt: null, committedAt: null, deployedAt: null };
    const parsed = JSON.parse(raw) as ReleaseStatus;
    return {
      exportHash: parsed.exportHash ?? null,
      exportedAt: parsed.exportedAt ?? null,
      committedAt: parsed.committedAt ?? null,
      deployedAt: parsed.deployedAt ?? null,
    };
  } catch {
    return { exportHash: null, exportedAt: null, committedAt: null, deployedAt: null };
  }
}

export function writeReleaseStatus(next: ReleaseStatus): void {
  localStorage.setItem(STATUS_KEY, JSON.stringify(next));
}

export async function fingerprintContent(site: unknown, products: unknown): Promise<string> {
  const { listMediaMeta } = await import("./mediaStore");
  const media = await listMediaMeta();
  const body = JSON.stringify({
    site,
    products,
    media: media
      .map((item) => ({ path: item.path, size: item.size, addedAt: item.addedAt }))
      .sort((a, b) => a.path.localeCompare(b.path)),
  });
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
