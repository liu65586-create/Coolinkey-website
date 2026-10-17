import { handleAdminApi } from "../server/adminHttp.mjs";

export const maxDuration = 60;

export const config = { api: { bodyParser: { sizeLimit: "1mb" } } };

export default function handler(req, res) {
  return handleAdminApi(req, res, "/api/assemble");
}
