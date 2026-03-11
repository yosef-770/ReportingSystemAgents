import { parse } from 'csv-parse/sync';
import * as reportService from '../services/reportService.js';

const CATEGORIES = ['intelligence', 'logistics', 'alert'];
const URGENCIES = ['low', 'medium', 'high'];

function toReportResponse(doc) {
  return {
    id: doc._id,
    userId: doc.userId,
    category: doc.category,
    urgency: doc.urgency,
    message: doc.message,
    imagePath: doc.imagePath ?? null,
    sourceType: doc.sourceType,
    createdAt: doc.createdAt,
  };
}

export async function createReport(req, res) {
  const { category, urgency, message } = req.body ?? {};
  if (!category || !urgency || !message) {
    return res.status(400).json({ error: 'category, urgency and message are required' });
  }
  const cat = String(category).toLowerCase();
  const urg = String(urgency).toLowerCase();
  if (!CATEGORIES.includes(cat) || !URGENCIES.includes(urg)) {
    return res.status(400).json({ error: 'invalid category or urgency' });
  }
  try {
    let doc = await reportService.createReport({
      userId: req.user.id,
      category: cat,
      urgency: urg,
      message: String(message).trim(),
      imagePath: null,
      sourceType: 'form',
    });
    if (req.files?.image) {
      const imagePath = await reportService.saveReportImage(req.files.image, doc._id.toString());
      doc = await reportService.updateReportImagePath(doc._id, imagePath);
    }
    return res.status(201).json({ report: toReportResponse(doc) });
  } catch (err) {
    const status = err.status ?? 500;
    return res.status(status).json({ error: err.message });
  }
}


export async function importCsv(req, res) {
  const file = req.files?.csvFile;

  if (!file || !Buffer.isBuffer(file.data)) {
    return res.status(400).json({ error: 'Invalid CSV structure or data' });
  }

  let rows;
  try {
    rows = parse(file.data, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } catch {
    return res.status(400).json({ error: 'Invalid CSV structure or data' });
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'Invalid CSV structure or data' });
  }

  const validation = reportService.validateCsvRows(rows);
  if (!validation.ok) {
    return res.status(400).json({ error: 'Invalid CSV structure or data' });
  }

  try {
    const docs = await reportService.createReportsFromCsv(req.user.id, rows);

    return res.status(201).json({
      importedCount: docs.length,
      reports: docs.map(toReportResponse),
    });
  } catch (err) {
    return res.status(err.status ?? 500).json({ error: err.message });
  }
}