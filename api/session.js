import { handleAdminApi } from "../server/adminHttp.mjs";

export default function handler(req, res) {
  return handleAdminApi(req, res, "/api/session");
}
