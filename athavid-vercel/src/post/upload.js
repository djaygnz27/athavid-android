// ⛔ LOCKED — post/upload.js
// Single source of truth for all file upload logic.
// All posting files (UploadModal, GoLiveModal, utils) import uploadFile from HERE.
// The actual implementation lives in ../api.js — this file re-exports it.
// DO NOT call ../api.js uploadFile directly from posting components — always use this.
// Last verified: 2026-05-23

export { uploadFile, request, videos } from "../api.js";

// ── Upload health check ───────────────────────────────────────────────────────
// Call this to verify the upload pipeline is alive before posting
export async function checkUploadHealth() {
  if (typeof uploadFile !== "function") {
    throw new Error("uploadFile is not defined — api.js import broken");
  }
  return true;
}
