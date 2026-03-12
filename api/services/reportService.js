import path from 'path';
import Report from '../models/Report.js';
import * as userService from './userService.js';

const CATEGORIES = ['intelligence', 'logistics', 'alert'];
const URGENCIES = ['low', 'medium', 'high'];
const REPORTS_UPLOAD_DIR = 'public/reports';

export async function saveReportImage(file, reportId) {
  const baseName = path.basename(file.name);
  const filename = `${reportId}-${baseName}`;
  const fullPath = path.resolve(REPORTS_UPLOAD_DIR, filename);
  await file.mv(fullPath);
  return `${REPORTS_UPLOAD_DIR}/${filename}`;
}

export async function updateReportImagePath(reportId, imagePath) {
  const doc = await Report.findByIdAndUpdate(reportId, { imagePath }, { new: true });
  return doc;
}

export async function createReport(data) {
  const doc = await Report.create(data);
  return doc;
}

export async function createReportsFromCsv(userId, rows) {
  const normalized = rows.map((row) => ({
    userId,
    category: String(row.category).toLowerCase(),
    urgency: String(row.urgency).toLowerCase(),
    message: String(row.message).trim(),
    sourceType: 'csv',
  }));
  const docs = await Report.insertMany(normalized);
  return docs;
}

export function validateCsvRows(rows) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row.category || !CATEGORIES.includes(String(row.category).toLowerCase())) return { ok: false, index: i };
    if (!row.urgency || !URGENCIES.includes(String(row.urgency).toLowerCase())) return { ok: false, index: i };
    if (!row.message || !String(row.message).trim()) return { ok: false, index: i };
  }
  return { ok: true };
}

export async function listReports(filters) {
  const query = {};
  if (filters.userId) {
    query.userId = filters.userId;
    if (filters.category && CATEGORIES.includes(filters.category)) query.category = filters.category;
    if (filters.urgency && URGENCIES.includes(filters.urgency)) query.urgency = filters.urgency;
  } else {
    if (filters.agentCode) {
      const user = await userService.getUserByAgentCode(filters.agentCode);
      if (!user) return [];
      query.userId = user.id;
    }
    if (filters.category && CATEGORIES.includes(filters.category)) query.category = filters.category;
    if (filters.urgency && URGENCIES.includes(filters.urgency)) query.urgency = filters.urgency;
  }
  const docs = await Report.find(query).sort({ createdAt: -1 }).lean();
  return docs;
}

export async function getReportById(id) {
  const doc = await Report.findById(id).lean();
  return doc;
}
