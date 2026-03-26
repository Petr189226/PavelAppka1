// @ts-nocheck
/* eslint-disable -- migrated from fve_projekt_generator_v7.html */
/**
 * Core IIFE body from the legacy HTML app. Uses document.getElementById for fields
 * that mirror the original markup (same element ids).
 */

let _statusHandler = (text, ok = true) => {};
export function setStatusHandler(fn) {
  _statusHandler = fn || (() => {});
}

const state = {
    rows: [],
    images: { logo: null, roof: null, map: null, sketch: null },
    references: { sourceForm: null },
    analysis: { sourceFormText: '', sourceFormParsed: null, sourceFormStructured: null, sketchPanels: null },
    lastLayout: null,
    lastValidation: null
  };

  const $ = (id) => document.getElementById(id);
  const escapeMap = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
  const sanitize = (s) => String(s ?? '').replace(/[&<>"']/g, ch => escapeMap[ch]);
  const toNum = (v, def = 0) => {
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : def;
  };
  const fmt = (n, digits = 2) => new Intl.NumberFormat('cs-CZ', { minimumFractionDigits: 0, maximumFractionDigits: digits }).format(n || 0);
  const MAX_PROJECT_STRINGS = 2;
  const fmtDateCz = (iso) => {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return iso;
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  };
  const fmtMonthYear = (iso) => {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return iso;
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };
  const status = (text, ok = true) => {
    _statusHandler(text || '', ok);
    const el = $('statusLine');
    if (el) {
      el.textContent = text || '';
      el.style.color = ok ? '#18794e' : '#b42318';
      if (text) setTimeout(() => { if (el.textContent === text) el.textContent = ''; }, 3200);
    }
  };

  function standardLogoHtml(data) {
    if (data.logoData) {
      return `<img src="${data.logoData}" alt="logo" style="max-height:96px; max-width:520px; object-fit:contain;">`;
    }
    return `<div style="font-family:Arial,sans-serif;font-size:62px;font-weight:800;letter-spacing:1px;white-space:nowrap;"><span style="color:#d32f2f;">)))</span><span style="color:#111;margin-left:6px;">SCHLIEGER</span></div>`;
  }

  function standardLogoSvg(data, x = 20, y = 22, scale = 1) {
    if (data.logoData) {
      return `<image href="${data.logoData}" x="${x}" y="${y}" width="${320 * scale}" height="${78 * scale}" preserveAspectRatio="xMinYMin meet"/>`;
    }
    return `
      <g>
        <text x="${x}" y="${y + 34 * scale}" font-family="Arial" font-size="${46 * scale}" font-weight="800" fill="#d32f2f">)))</text>
        <text x="${x + 64 * scale}" y="${y + 34 * scale}" font-family="Arial" font-size="${46 * scale}" font-weight="800" fill="#111" letter-spacing="${0.6 * scale}">SCHLIEGER</text>
      </g>`;
  }

  function wrapSvgText(text, x, y, maxChars, lineHeight, opts = '') {
    const words = String(text || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
    const lines = [];
    let line = '';
    words.forEach(word => {
      const trial = line ? line + ' ' + word : word;
      if (trial.length > maxChars && line) {
        lines.push(line);
        line = word;
      } else {
        line = trial;
      }
    });
    if (line) lines.push(line);
    return lines.map((ln, i) => `<text x="${x}" y="${y + i * lineHeight}" ${opts}>${sanitize(ln)}</text>`).join('');
  }

  function defaultRows() {
    return [
      { name: 'ŘADA I', panels: 12, azimuth: 180, tilt: 35, drawX: 0, drawY: 0, drawRotation: 0, drawOrientation: 'landscape', drawCols: 6, note: '', color: '#1f3c88', layoutMode: 'auto' }
    ];
  }



  const intakeFieldIds = [
    'intakeApplicantName','intakeApplicantBirthIc','intakeApplicantEmail','intakeApplicantPhone','intakeApplicantStreet','intakeApplicantHouseNo','intakeApplicantOrientNo','intakeApplicantPsc','intakeApplicantCity',
    'intakeRealStreet','intakeRealHouseNo','intakeRealOrientNo','intakeRealPsc','intakeRealCity','intakeRegion','intakeCadastralCode','intakeCadastralName','intakeParcelNumber','intakeLvNumber','intakePropertyType','intakePeopleCount','intakeHouseAge','intakeUnitCount','intakeFloorArea','intakeFloors','intakeProductType','intakeSubsidyProgram',
    'intakeTotalPanels','intakePhases','intakePanelType','intakeInverterType','intakeAccumulationType','intakeBatteryModuleType','intakeBatteryType','intakeBatteryCount','intakeAnnualConsumption1','intakeAnnualConsumption2','intakeTariff','intakeWallboxCount','intakeWallboxPlace','intakeOwnInfo',
    'intakeTechnicalRoomHeight','intakeTechnicalRoomSize','intakeLightning','intakeInverterPlace','intakeRdcPlace','intakeRacPlace','intakeMainBoardPlace','intakeMeterBoardPlace','intakeDistanceRdcInverter','intakeDistanceInvMain','intakeMainBreaker','intakeHdo','intakeDistributor','intakeEan','intakeOm','intakeRestrictions','intakeScaffold','intakeRecreational','intakeRoute',
    'sketchNote'
  ];
  for (let i = 1; i <= MAX_PROJECT_STRINGS; i += 1) {
    intakeFieldIds.push(
      `intakeString${i}RoofCover`, `intakeString${i}RoofType`, `intakeString${i}Panels`, `intakeString${i}Azimuth`, `intakeString${i}Tilt`, `intakeString${i}RoofSize`, `intakeString${i}EaveHeight`, `intakeString${i}HorizonHeight`
    );
  }

  function toRoman(n) {
    return ['', 'I', 'II', 'III', 'IV', 'V', 'VI'][n] || String(n);
  }

  function setIfFilled(id, value) {
    if (!$(id)) return;
    if (value === undefined || value === null) return;
    const str = String(value).trim();
    if (!str) return;
    $(id).value = value;
  }

  function streetLine(street, houseNo, orientNo) {
    const no = [houseNo, orientNo].filter(Boolean).join('/');
    return [street, no].filter(Boolean).join(' ').trim();
  }

  function fullAddress(street, houseNo, orientNo, psc, city) {
    const l1 = streetLine(street, houseNo, orientNo);
    const l2 = [psc, city].filter(Boolean).join(' ').trim();
    return [l1, l2].filter(Boolean).join(', ');
  }

  function extractWp(text) {
    const match = String(text || '').match(/(\d{3,4})\s*wp/i);
    return match ? toNum(match[1]) : 0;
  }

  function splitPanelBrandModel(text) {
    const raw = String(text || '').trim();
    if (!raw) return { brand: '', model: '' };
    const tokens = raw.split(/\s+/).filter(Boolean);
    let splitAt = tokens.findIndex(tok => /\d/.test(tok) || /[-/]/.test(tok));
    if (splitAt <= 0) splitAt = Math.min(2, Math.max(1, tokens.length - 1));
    return {
      brand: tokens.slice(0, splitAt).join(' ').trim(),
      model: tokens.slice(splitAt).join(' ').trim() || raw
    };
  }

  function escapeRegExp(value) {
    return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function normalizeFormText(text) {
    return String(text || '')
      .replace(/\u00a0/g, ' ')
      .replace(/[‐‑‒–—−]/g, '-')
      .replace(/\r/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function labelPattern(label) {
    return escapeRegExp(String(label || '').trim())
      .replace(/\\ /g, '\\s*')
      .replace(/\\\//g, '\\s*\\/\\s*')
      .replace(/\\-/g, '\\s*[-–—]?\\s*')
      .replace(/\\\./g, '\\.?\\s*');
  }

  function cleanExtract(value) {
    return String(value || '')
      .replace(/\u00a0/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/^[\s:;,-]+/, '')
      .replace(/[\s:;,-]+$/, '')
      .trim();
  }

  function getSection(text, start, end) {
    const re = new RegExp(labelPattern(start) + '\\s*([\\s\\S]*?)\\s*(?=' + labelPattern(end) + ')', 'i');
    const match = normalizeFormText(text).match(re);
    return match ? match[1].trim() : '';
  }

  function captureBetween(text, start, ends) {
    const endList = Array.isArray(ends) ? ends : [ends];
    const endPattern = endList.map(labelPattern).join('|');
    const re = new RegExp(labelPattern(start) + '\\s*:?[\\s\\n]*([\\s\\S]*?)(?=(?:' + endPattern + ')\\s*:?)', 'i');
    const match = normalizeFormText(text).match(re);
    return cleanExtract(match ? match[1] : '');
  }

  function parseMaybeNumber(value) {
    const cleaned = cleanExtract(value).replace(/\s/g, '').replace(',', '.');
    if (!cleaned) return '';
    const match = cleaned.match(/-?\d+(?:\.\d+)?/);
    return match ? match[0] : cleaned;
  }

  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      const existing = Array.from(document.scripts).find(s => s.src === src);
      if (existing) {
        if (existing.dataset.loaded === '1') { resolve(); return; }
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Nepodařilo se načíst skript.')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => { script.dataset.loaded = '1'; resolve(); };
      script.onerror = () => reject(new Error('Nepodařilo se načíst skript.'));
      document.head.appendChild(script);
    });
  }

  async function ensurePdfJs() {
    if (window.pdfjsLib) return window.pdfjsLib;
    await loadScriptOnce('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');
    if (!window.pdfjsLib) throw new Error('Knihovna PDF.js není dostupná.');
    return window.pdfjsLib;
  }

  async function extractPdfTextFromFile(file) {
    const pdfjsLib = await ensurePdfJs();
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer, disableWorker: true }).promise;

    function joinPdfLineItems(lineItems) {
      const ordered = lineItems.slice().sort((a, b) => a.x - b.x);
      let out = '';
      let prev = null;
      ordered.forEach(item => {
        const text = String(item.str || '');
        if (!text.trim()) return;
        if (!prev) {
          out += text;
          prev = item;
          return;
        }
        const prevText = String(prev.str || '');
        const prevRight = prev.x + Math.max(0, prev.w || 0);
        const gap = item.x - prevRight;
        const prevCharW = Math.max(0.8, Math.min(12, (prev.w || 0) / Math.max(1, prevText.length)));
        const currCharW = Math.max(0.8, Math.min(12, (item.w || 0) / Math.max(1, text.length)));
        const refGap = Math.max(1, Math.min(6, (prevCharW + currCharW) / 2));
        const punctJoin = /[-/([{]$/.test(prevText) || /^[,.;:!?%°)\]}]/.test(text);
        const sameWord = /[0-9A-Za-zÀ-ž]$/.test(prevText) && /^[0-9A-Za-zÀ-ž]/.test(text) && gap < refGap * 0.55;
        const needsSpace = !punctJoin && !sameWord && gap > refGap * 0.78;
        if (needsSpace && !/\s$/.test(out)) out += ' ';
        out += text;
        prev = item;
      });
      return out.replace(/\s{2,}/g, ' ').trim();
    }

    const pageTexts = [];
    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
      const page = await pdf.getPage(pageNo);
      const tc = await page.getTextContent();
      const items = (tc.items || [])
        .map(it => ({
          str: it.str || '',
          x: toNum(it.transform?.[4]),
          y: toNum(it.transform?.[5]),
          w: toNum(it.width || 0)
        }))
        .filter(it => it.str && it.str.trim());
      items.sort((a, b) => {
        if (Math.abs(b.y - a.y) > 2.5) return b.y - a.y;
        return a.x - b.x;
      });
      const lines = [];
      let current = [];
      let currentY = null;
      items.forEach(item => {
        if (currentY === null || Math.abs(item.y - currentY) <= 2.5) {
          current.push(item);
          currentY = currentY === null ? item.y : ((currentY * (current.length - 1)) + item.y) / current.length;
        } else {
          const line = joinPdfLineItems(current);
          if (line) lines.push(line);
          current = [item];
          currentY = item.y;
        }
      });
      if (current.length) {
        const line = joinPdfLineItems(current);
        if (line) lines.push(line);
      }
      pageTexts.push(lines.filter(Boolean).join('\n'));
    }
    return normalizeFormText(pageTexts.join('\n\n'));
  }


  async function extractPdfStructuredFromFile(file) {
    const pdfjsLib = await ensurePdfJs();
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer, disableWorker: true }).promise;

    function joinLineItemsLoose(items) {
      const ordered = items.slice().sort((a, b) => a.x - b.x);
      let out = '';
      let prev = null;
      ordered.forEach(item => {
        const text = String(item.str || '').trim();
        if (!text) return;
        if (!prev) {
          out += text;
          prev = item;
          return;
        }
        const prevText = String(prev.str || '');
        const prevRight = prev.x + Math.max(0, prev.w || 0);
        const gap = item.x - prevRight;
        const noSpace = /[-/([{]$/.test(prevText) || /^[,.;:!?%°)\]}]/.test(text);
        if (!noSpace && gap > 1 && !/\s$/.test(out)) out += ' ';
        out += text;
        prev = item;
      });
      return out.replace(/\s{2,}/g, ' ').trim();
    }

    function groupPdfItemsToLines(items) {
      const ordered = items.slice().sort((a, b) => {
        if (Math.abs(b.y - a.y) > 2.5) return b.y - a.y;
        return a.x - b.x;
      });
      const lines = [];
      let current = [];
      let currentY = null;
      ordered.forEach(item => {
        if (currentY === null || Math.abs(item.y - currentY) <= 2.5) {
          current.push(item);
          currentY = currentY === null ? item.y : ((currentY * (current.length - 1)) + item.y) / current.length;
        } else {
          lines.push(current);
          current = [item];
          currentY = item.y;
        }
      });
      if (current.length) lines.push(current);
      return lines;
    }

    function zoneJoin(items, xMin, xMax = Infinity) {
      return joinLineItemsLoose(items.filter(it => it.x >= xMin && it.x < xMax));
    }

    const pages = [];
    const pageTexts = [];

    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
      const page = await pdf.getPage(pageNo);
      const tc = await page.getTextContent();
      const items = (tc.items || [])
        .map(it => ({
          str: it.str || '',
          x: toNum(it.transform?.[4]),
          y: toNum(it.transform?.[5]),
          w: toNum(it.width || 0)
        }))
        .filter(it => String(it.str || '').trim());

      const lines = groupPdfItemsToLines(items).map(lineItems => ({
        full: joinLineItemsLoose(lineItems),
        c1: zoneJoin(lineItems, -Infinity, 180),
        c2: zoneJoin(lineItems, 180, 320),
        c3: zoneJoin(lineItems, 320, Infinity),
        z1: zoneJoin(lineItems, -Infinity, 180),
        z2: zoneJoin(lineItems, 180, 295),
        z3: zoneJoin(lineItems, 300, 450),
        z4: zoneJoin(lineItems, 450, Infinity)
      })).filter(line => line.full);

      pages.push({ pageNo, lines });
      pageTexts.push(lines.map(line => line.full).join('\n'));
    }

    return {
      text: normalizeFormText(pageTexts.join('\n\n')),
      pages
    };
  }

  function normalizeMatchKey(value) {
    return normalizeText(value).replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function lineHasLabel(textOrLine, label) {
    const raw = typeof textOrLine === 'string'
      ? textOrLine
      : (textOrLine?.full || textOrLine?.text || '');
    return normalizeMatchKey(raw).includes(normalizeMatchKey(label));
  }

  function sectionSlice(lines, startLabel, endLabel) {
    const startIdx = (lines || []).findIndex(line => lineHasLabel(line, startLabel));
    if (startIdx < 0) return [];
    const endIdx = endLabel
      ? (lines || []).findIndex((line, idx) => idx > startIdx && lineHasLabel(line, endLabel))
      : -1;
    return (lines || []).slice(startIdx + 1, endIdx > startIdx ? endIdx : undefined);
  }

  function captureInlineValue(text, label, stopLabels = []) {
    const source = normalizeFormText(text);
    if (!source) return '';
    if (!stopLabels.length) {
      const re = new RegExp(labelPattern(label) + '\\s*:?\\s*([\\s\\S]*)$', 'i');
      const match = source.match(re);
      return cleanExtract(match ? match[1] : '');
    }
    const stopPattern = stopLabels.map(labelPattern).join('|');
    const re = new RegExp(labelPattern(label) + '\\s*:?\\s*([\\s\\S]*?)(?=(?:' + stopPattern + ')\\s*:?|$)', 'i');
    const match = source.match(re);
    return cleanExtract(match ? match[1] : '');
  }

  function parseSectionField(lines, label, stopLabels = []) {
    for (const line of (lines || [])) {
      const value = captureInlineValue(line?.full || line, label, stopLabels);
      if (value) return value;
    }
    return '';
  }

  function buildColumnRecords(lines, labelKey, valueKey) {
    const records = [];
    let current = null;
    (lines || []).forEach(line => {
      const label = cleanExtract(line?.[labelKey]);
      const value = cleanExtract(line?.[valueKey]);
      if (label) {
        if (current && (current.label || current.value)) records.push(current);
        current = { label, value };
        return;
      }
      if (!current) return;
      if (value) current.value = cleanExtract([current.value, value].filter(Boolean).join(' '));
    });
    if (current && (current.label || current.value)) records.push(current);
    return records;
  }

  function getRecordValue(records, ...labels) {
    const targets = labels.map(normalizeMatchKey).filter(Boolean);
    for (const target of targets) {
      for (const record of (records || [])) {
        const recordKey = normalizeMatchKey(record?.label);
        if (!recordKey) continue;
        if (
          recordKey.startsWith(target) ||
          target.startsWith(recordKey) ||
          recordKey.includes(target) ||
          target.includes(recordKey)
        ) {
          const value = cleanExtract(record?.value);
          if (value) return value;
        }
      }
    }
    return '';
  }

  function parseNthLineValue(lines, label, occurrence = 1, stopLabels = []) {
    let seen = 0;
    for (const line of (lines || [])) {
      if (!lineHasLabel(line, label)) continue;
      seen += 1;
      if (seen !== occurrence) continue;
      return captureInlineValue(line.full, label, stopLabels);
    }
    return '';
  }

  const applicantNameLabels = ['Jméno a Příjmení / Název', 'Jméno a příjmení / název', 'Jméno a příjmení', 'Název'];
  const applicantBirthIcLabels = ['Dat. Nar. / IČ', 'Dat. nar. / IČ', 'Datum narození / IČ', 'Datum narození/IČ', 'Datum nar. / IČ', 'Dat. narození / IČ', 'Datum narození', 'Dat. nar.'];
  const applicantEmailLabels = ['E-mail', 'Email', 'E mail'];
  const applicantPhoneLabels = ['Telefon', 'Tel.', 'Mobil', 'Mobilní telefon'];
  const applicantBirthStops = applicantEmailLabels.concat(applicantPhoneLabels, ['Rodné číslo', 'Rodne cislo', 'Ulice']);
  const applicantEmailStops = applicantPhoneLabels.concat(['Rodné číslo', 'Rodne cislo', 'Ulice']);
  const applicantPhoneStops = ['Rodné číslo', 'Rodne cislo', 'Ulice'];

  function firstFilled(...values) {
    for (const value of values) {
      const clean = cleanExtract(value);
      if (clean) return clean;
    }
    return '';
  }

  function captureBetweenAny(text, starts, ends) {
    for (const start of (starts || [])) {
      const value = captureBetween(text, start, ends);
      if (value) return value;
    }
    return '';
  }

  function parseSectionFieldAny(lines, labels, stopLabels = []) {
    for (const label of (labels || [])) {
      const value = parseSectionField(lines, label, stopLabels);
      if (value) return value;
    }
    return '';
  }

  function extractApplicantBirthIcLoose(text) {
    return firstFilled(
      captureBetweenAny(text, applicantBirthIcLabels, applicantBirthStops),
      captureBetweenAny(text, ['IČ'], applicantBirthStops)
    );
  }

  function parseSourceFormStructured(structured) {
    const p1 = structured?.pages?.[0]?.lines || [];
    const p2 = structured?.pages?.[1]?.lines || [];
    const p3 = structured?.pages?.[2]?.lines || [];

    const applicant = sectionSlice(p1, 'IDENTIFIKACE ŽADATELE', 'ADRESA REALIZACE');
    const realization = sectionSlice(p1, 'ADRESA REALIZACE', 'OBECNÉ INFORMACE O ZAKÁZCE');
    const general = sectionSlice(p1, 'OBECNÉ INFORMACE O ZAKÁZCE', 'SPOLUMAJITELÉ');
    const ownInfoSection = sectionSlice(p3, 'VLASTNÍ INFORMACE', 'VÝPOČTOVÝ NÁSTROJ');

    const left2 = buildColumnRecords(p2, 'z1', 'z2');
    const right2 = buildColumnRecords(p2, 'z3', 'z4');
    const left3 = buildColumnRecords(p3, 'z1', 'z2');
    const right3 = buildColumnRecords(p3, 'z3', 'z4');

    const rec2 = (...labels) => getRecordValue(left2.concat(right2), ...labels);
    const rec2L = (...labels) => getRecordValue(left2, ...labels);
    const rec2R = (...labels) => getRecordValue(right2, ...labels);
    const rec3 = (...labels) => getRecordValue(left3.concat(right3), ...labels);
    const rec3L = (...labels) => getRecordValue(left3, ...labels);
    const rec3R = (...labels) => getRecordValue(right3, ...labels);

    let applicantHouseNo = parseSectionField(applicant, 'Číslo popisné', ['Číslo orientační']);
    let applicantOrientNo = parseSectionField(applicant, 'Číslo orientační', ['PSČ']);
    let realHouseNo = parseSectionField(realization, 'Číslo popisné', ['Číslo orientační', 'Patro']);
    let realOrientNo = parseSectionField(realization, 'Číslo orientační', ['Patro', 'Číslo bytu', 'Obec', 'PSČ']);

    if (!realOrientNo && /^\d+\s+\d+$/.test(realHouseNo)) {
      const parts = realHouseNo.split(/\s+/);
      realHouseNo = parts[0];
      realOrientNo = parts[1];
    }

    const routeIdx = p3.findIndex(line => lineHasLabel(line, 'Popis trasy zapojení systému'));
    let route = routeIdx >= 0
      ? captureInlineValue(p3[routeIdx].full, 'Popis trasy zapojení systému', ['Památkově chráněné území'])
      : '';
    const routeNext = cleanExtract(routeIdx >= 0 ? p3[routeIdx + 1]?.full : '');
    if (routeNext && !lineHasLabel(routeNext, 'PŮVODNÍ ZDROJ TEPLA')) {
      route = cleanExtract([route, routeNext].filter(Boolean).join(' '));
    }

    const s1Panels = parseMaybeNumber(rec2L('Střecha 1. string - počet panelů'));
    const s2Panels = parseMaybeNumber(rec2R('Střecha 2. string - počet panelů'));
    const totalPanels = [s1Panels, s2Panels].reduce((sum, value) => sum + Math.max(0, toNum(value)), 0);

    const applicantText = (applicant || []).map(line => line?.full || '').join('\n');

    const parsed = {
      intakeApplicantName: parseSectionFieldAny(applicant, applicantNameLabels, applicantBirthIcLabels.concat(applicantEmailLabels, applicantPhoneLabels)),
      intakeApplicantBirthIc: firstFilled(
        parseSectionFieldAny(applicant, applicantBirthIcLabels, applicantBirthStops),
        extractApplicantBirthIcLoose(applicantText)
      ),
      intakeApplicantEmail: parseSectionFieldAny(applicant, applicantEmailLabels, applicantEmailStops),
      intakeApplicantPhone: parseSectionFieldAny(applicant, applicantPhoneLabels, applicantPhoneStops),
      intakeApplicantStreet: parseSectionField(applicant, 'Ulice', ['Číslo popisné']),
      intakeApplicantHouseNo: applicantHouseNo,
      intakeApplicantOrientNo: applicantOrientNo,
      intakeApplicantPsc: parseSectionField(applicant, 'PSČ', ['Obec', 'Stát']),
      intakeApplicantCity: parseSectionField(applicant, 'Obec', ['Stát']),

      intakeCadastralCode: parseSectionField(realization, 'Katastrální území (číslo)', ['Katastrální území (název)']),
      intakeCadastralName: parseSectionField(realization, 'Katastrální území (název)', ['Číslo listu vlastnictví']),
      intakeLvNumber: parseSectionField(realization, 'Číslo listu vlastnictví', ['Číslo parcely']),
      intakeParcelNumber: parseSectionField(realization, 'Číslo parcely', ['Typ parcely']),
      intakeRealStreet: parseSectionField(realization, 'Ulice', ['Číslo popisné']),
      intakeRealHouseNo: realHouseNo,
      intakeRealOrientNo: realOrientNo,
      intakeRealCity: parseSectionField(realization, 'Obec', ['PSČ', 'Kraj']),
      intakeRealPsc: parseSectionField(realization, 'PSČ', ['Kraj']),
      intakeRegion: parseSectionField(realization, 'Kraj', ['Sídlo stavebního úřadu', 'Další informace']),
      intakePropertyType: parseSectionField(realization, 'Typ nemovitosti', ['Počet osob v objektu']),
      intakePeopleCount: parseMaybeNumber(parseSectionField(realization, 'Počet osob v objektu', ['Stáří domu', 'Počet bytových jednotek'])),
      intakeHouseAge: parseMaybeNumber(parseSectionField(realization, 'Stáří domu', ['Počet bytových jednotek'])),
      intakeUnitCount: parseMaybeNumber(parseSectionField(realization, 'Počet bytových jednotek', ['Počet podlaží', 'Internetové připojení'])),
      intakeFloorArea: parseMaybeNumber(parseSectionField(realization, 'Podlahová plocha', ['Počet podlaží', 'Stavební připravenost'])),
      intakeFloors: parseMaybeNumber(parseSectionField(realization, 'Počet podlaží', ['Internetové připojení', 'OBECNÉ INFORMACE O ZAKÁZCE'])),

      intakeProductType: parseSectionField(general, 'Typ produktu', ['Výše dotace', 'Dotační program']),
      intakeSubsidyProgram: parseSectionField(general, 'Dotační program', ['Oblast dotace', 'Typ dotace']),

      intakeTotalPanels: totalPanels ? String(totalPanels) : '',
      intakePhases: parseMaybeNumber(rec2R('Počet fází')),
      intakePanelType: rec2L('Typ fotovoltaických panelů'),
      intakeInverterType: rec2R('Typ střídače'),
      intakeAccumulationType: rec2L('Typ akumulace'),
      intakeBatteryModuleType: rec2R('Typ řídícího modulu'),
      intakeBatteryType: rec2L('Typ akumulátorů') || rec2R('Typ řídícího modulu'),
      intakeBatteryCount: parseMaybeNumber(rec2L('Počet akumulátorů (1ks = 5kWh)')),

      intakeString1RoofCover: rec2L('Střecha 1. string - střešní krytina'),
      intakeString1RoofType: rec2L('Střecha 1. string - typ strechy', 'Střecha 1. string - typ střechy'),
      intakeString1Panels: s1Panels,
      intakeString1Azimuth: parseMaybeNumber(rec2L('Střecha 1. string - azimut')),
      intakeString1Tilt: parseMaybeNumber(rec2L('Střecha 1. string - sklon')),
      intakeString1RoofSize: parseMaybeNumber(rec2L('Střecha 1. string - velikost střechy')),
      intakeString1EaveHeight: parseMaybeNumber(parseNthLineValue(p2, 'Střecha 1. string - Výška domu', 1, ['Střecha 2. string - Výška domu'])),
      intakeString1HorizonHeight: parseMaybeNumber(parseNthLineValue(p2, 'Střecha 1. string - Výška domu', 2, ['Střecha 2. string - Výška domu'])),

      intakeString2RoofCover: rec2R('Střecha 2. string - střešní krytina'),
      intakeString2RoofType: rec2R('Střecha 2. string - typ strechy', 'Střecha 2. string - typ střechy'),
      intakeString2Panels: s2Panels,
      intakeString2Azimuth: parseMaybeNumber(rec2R('Střecha 2. string - azimut')),
      intakeString2Tilt: parseMaybeNumber(rec2R('Střecha 2. string - sklon')),
      intakeString2RoofSize: parseMaybeNumber(rec2R('Střecha 2. string - velikost střechy')),
      intakeString2EaveHeight: parseMaybeNumber(parseNthLineValue(p2, 'Střecha 2. string - Výška domu', 1)),
      intakeString2HorizonHeight: parseMaybeNumber(parseNthLineValue(p2, 'Střecha 2. string - Výška domu', 2)),

      intakeTechnicalRoomHeight: parseMaybeNumber(rec2L('Výška technické místnosti')),
      intakeTechnicalRoomSize: parseMaybeNumber(rec2L('Velikost technické místnosti')),
      intakeLightning: rec2L('Hromosvod'),
      intakeInverterPlace: rec2R('Umístění střídače'),
      intakeDistanceRdcInverter: parseMaybeNumber(rec2L('Vzdálenost mezi RDC a střídačem')),
      intakeMainBoardPlace: rec2L('Umístění hlavního rozvaděče'),
      intakeRdcPlace: rec2R('Umístění RDC'),
      intakeRacPlace: rec2R('Umístění RAC'),
      intakeMainBreaker: parseMaybeNumber(rec2L('Hodnota jističe před elektroměrem')),
      intakeHdo: rec2R('HDO'),
      intakeMeterBoardPlace: rec2L('Umístění elektroměrového', 'Umístění elektroměrového rozvaděče'),

      intakeAnnualConsumption1: parseMaybeNumber(rec3L('Roční spotřeba 1. rok (MWh)')),
      intakeAnnualConsumption2: parseMaybeNumber(rec3L('Roční spotřeba 2. rok (MWh)')),
      intakeDistanceInvMain: parseMaybeNumber(rec3R('Vzdálenost mezi střídačem a hl.', 'Vzdálenost mezi střídačem a hl. rozvaděčem (m)')),
      intakeTariff: rec3R('Sazba (D57,D45 apod.)'),
      intakeWallboxCount: parseMaybeNumber(rec3R('Počet dobíjecích bodů (wallbox)')),
      intakeWallboxPlace: rec3L('Umístění wallbox'),
      intakeRestrictions: [rec3R('CHKO či jiné omezení'), rec3R('Památkově chráněné území')].filter(Boolean).join('; '),
      intakeScaffold: rec3L('Nutnost zajištění lešení nebo', 'Nutnost zajištění lešení nebo plošiny'),
      intakeRecreational: rec3R('Rekreačný objekt'),
      intakeRoute: route,

      intakeOwnInfo: cleanExtract((ownInfoSection || []).map(line => line.full).join(' ')),
      intakeEan: rec3('Kód EAN'),
      intakeOm: rec3('Číslo OM'),
      intakeDistributor: rec3('Distributor')
    };

    if (!parsed.intakeRealStreet) parsed.intakeRealStreet = parsed.intakeApplicantStreet;
    if (!parsed.intakeRealHouseNo) parsed.intakeRealHouseNo = parsed.intakeApplicantHouseNo;
    if (!parsed.intakeRealOrientNo) parsed.intakeRealOrientNo = parsed.intakeApplicantOrientNo;
    if (!parsed.intakeRealPsc) parsed.intakeRealPsc = parsed.intakeApplicantPsc;
    if (!parsed.intakeRealCity) parsed.intakeRealCity = parsed.intakeApplicantCity;

    return parsed;
  }

  function mergeParsedFields(primary, fallback) {
    const merged = { ...(fallback || {}) };
    Object.entries(primary || {}).forEach(([key, value]) => {
      if (String(value ?? '').trim()) merged[key] = value;
    });
    return merged;
  }

  function parseSourceFormText(text) {
    const raw = normalizeFormText(text);
    const applicant = getSection(raw, 'IDENTIFIKACE ŽADATELE', 'ADRESA REALIZACE');
    const realization = getSection(raw, 'ADRESA REALIZACE', 'OBECNÉ INFORMACE O ZAKÁZCE');
    const general = getSection(raw, 'OBECNÉ INFORMACE O ZAKÁZCE', 'SPOLUMAJITELÉ');
    const spec = getSection(raw, 'SPECIFIKACE ZAKÁZKY', 'SPECIFIKACE MÍSTA INSTALACE');
    const place = getSection(raw, 'SPECIFIKACE MÍSTA INSTALACE', 'PŮVODNÍ ZDROJ TEPLA');
    const ownInfoSec = getSection(raw, 'VLASTNÍ INFORMACE', 'VÝPOČTOVÝ NÁSTROJ');
    const law = getSection(raw, 'LEGISLATIVA', 'VLASTNÍ INFORMACE');

    const parsed = {
      intakeApplicantName: captureBetweenAny(applicant, applicantNameLabels, applicantBirthIcLabels.concat(applicantEmailLabels, applicantPhoneLabels)),
      intakeApplicantBirthIc: extractApplicantBirthIcLoose(applicant),
      intakeApplicantEmail: captureBetweenAny(applicant, applicantEmailLabels, applicantEmailStops),
      intakeApplicantPhone: captureBetweenAny(applicant, applicantPhoneLabels, applicantPhoneStops),
      intakeApplicantStreet: captureBetween(applicant, 'Ulice', 'Číslo popisné'),
      intakeApplicantHouseNo: captureBetween(applicant, 'Číslo popisné', 'Číslo orientační'),
      intakeApplicantOrientNo: captureBetween(applicant, 'Číslo orientační', 'PSČ'),
      intakeApplicantPsc: captureBetween(applicant, 'PSČ', 'Obec'),
      intakeApplicantCity: captureBetween(applicant, 'Obec', 'Stát'),

      intakeCadastralCode: captureBetween(realization, 'Katastrální území (číslo)', 'Katastrální území (název)'),
      intakeCadastralName: captureBetween(realization, 'Katastrální území (název)', 'Číslo listu vlastnictví'),
      intakeLvNumber: captureBetween(realization, 'Číslo listu vlastnictví', 'Číslo parcely'),
      intakeParcelNumber: captureBetween(realization, 'Číslo parcely', 'Typ parcely'),
      intakeRealStreet: captureBetween(realization, 'Ulice', 'Číslo popisné'),
      intakeRealHouseNo: captureBetween(realization, 'Číslo popisné', 'Číslo orientační'),
      intakeRealOrientNo: captureBetween(realization, 'Číslo orientační', 'Patro'),
      intakeRealCity: captureBetween(realization, 'Obec', 'PSČ'),
      intakeRealPsc: captureBetween(realization, 'PSČ', 'Kraj'),
      intakeRegion: captureBetween(realization, 'Kraj', 'Sídlo stavebního úřadu Obec'),
      intakePropertyType: captureBetween(realization, 'Typ nemovitosti', 'Počet osob v objektu'),
      intakePeopleCount: parseMaybeNumber(captureBetween(realization, 'Počet osob v objektu', 'Stáří domu')),
      intakeHouseAge: parseMaybeNumber(captureBetween(realization, 'Stáří domu', 'Počet bytových jednotek')),
      intakeUnitCount: parseMaybeNumber(captureBetween(realization, 'Počet bytových jednotek', 'Podlahová plocha')),
      intakeFloorArea: parseMaybeNumber(captureBetween(realization, 'Podlahová plocha', 'Počet podlaží')),
      intakeFloors: parseMaybeNumber(captureBetween(realization, 'Počet podlaží', 'Stavební připravenost')),

      intakeProductType: captureBetween(general, 'Typ produktu', 'Výše dotace') || captureBetween(general, 'Typ produktu', 'Dotační program'),
      intakeSubsidyProgram: captureBetween(general, 'Dotační program', 'Oblast dotace') || captureBetween(general, 'Dotační program', 'Typ dotace'),

      intakeTotalPanels: parseMaybeNumber(captureBetween(spec, 'Celkový počet panelů/kolektorů', 'Počet fází')),
      intakePhases: parseMaybeNumber(captureBetween(spec, 'Počet fází', 'Typ fotovoltaických panelů')),
      intakePanelType: captureBetween(spec, 'Typ fotovoltaických panelů', 'Typ střídače'),
      intakeInverterType: captureBetween(spec, 'Typ střídače', 'Typ akumulace'),
      intakeAccumulationType: captureBetween(spec, 'Typ akumulace', 'Typ řídícího modulu'),
      intakeBatteryModuleType: captureBetween(spec, 'Typ řídícího modulu', 'Typ akumulátorů'),
      intakeBatteryType: captureBetween(spec, 'Typ akumulátorů', ['Specifikace zásobníku na teplou vodu', 'Počet akumulátorů (1ks = 5kWh)']),
      intakeBatteryCount: parseMaybeNumber(captureBetween(spec, 'Počet akumulátorů (1ks = 5kWh)', 'Typ tepelného čerpadla')),

      intakeTechnicalRoomHeight: parseMaybeNumber(captureBetween(place, 'Výška technické místnosti', 'Šířka dveří technické místnosti')),
      intakeTechnicalRoomSize: parseMaybeNumber(captureBetween(place, 'Velikost technické místnosti', 'Počet osob')),
      intakeLightning: captureBetween(place, 'Hromosvod', 'Umístění střídače'),
      intakeInverterPlace: captureBetween(place, 'Umístění střídače', 'Vzdálenost mezi RDC a střídačem (m)'),
      intakeDistanceRdcInverter: parseMaybeNumber(captureBetween(place, 'Vzdálenost mezi RDC a střídačem (m)', 'Vzdálenost mezi TČ/SOL a technickou místností (m)')),
      intakeMainBoardPlace: captureBetween(place, 'Umístění hlavního rozvaděče', 'Umístění RDC'),
      intakeRdcPlace: captureBetween(place, 'Umístění RDC', 'Tloušťka zdi (cm)'),
      intakeRacPlace: captureBetween(place, 'Umístění RAC', 'HDO'),
      intakeMainBreaker: parseMaybeNumber(captureBetween(place, 'Hodnota jističe před elektroměrem (Amp)', 'HDO')),
      intakeHdo: captureBetween(place, 'HDO', 'Umístění elektroměrového rozvaděče'),
      intakeMeterBoardPlace: captureBetween(place, 'Umístění elektroměrového rozvaděče', 'Roční spotřeba 1. rok (MWh)'),
      intakeAnnualConsumption1: parseMaybeNumber(captureBetween(place, 'Roční spotřeba 1. rok (MWh)', 'Vzdálenost mezi střídačem a hl. rozvaděčem (m)')),
      intakeDistanceInvMain: parseMaybeNumber(captureBetween(place, 'Vzdálenost mezi střídačem a hl. rozvaděčem (m)', 'Roční spotřeba 2. rok (MWh)')),
      intakeAnnualConsumption2: parseMaybeNumber(captureBetween(place, 'Roční spotřeba 2. rok (MWh)', 'Čerpání dotací v minulosti')),
      intakeTariff: captureBetween(place, 'Sazba (D57,D45 apod.)', 'Plánování elektromobilu'),
      intakeWallboxCount: parseMaybeNumber(captureBetween(place, 'Počet dobíjecích bodů (wallbox)', 'Umístění wallbox')),
      intakeWallboxPlace: captureBetween(place, 'Umístění wallbox', 'Stavební přípravenost'),
      intakeRestrictions: [
        captureBetween(place, 'CHKO či jiné omezení', 'Nutnost zajištění lešení nebo plošiny'),
        captureBetween(place, 'Památkově chráněné území', 'PŮVODNÍ ZDROJ TEPLA')
      ].filter(Boolean).join('; '),
      intakeScaffold: captureBetween(place, 'Nutnost zajištění lešení nebo plošiny', 'Rekreačný objekt'),
      intakeRecreational: captureBetween(place, 'Rekreačný objekt', 'Popis trasy zapojení systému'),
      intakeRoute: captureBetween(place, 'Popis trasy zapojení systému', 'PŮVODNÍ ZDROJ TEPLA'),
      intakeOwnInfo: cleanExtract(ownInfoSec),

      intakeEan: captureBetween(law, 'Kód EAN', 'Číslo OM'),
      intakeOm: captureBetween(law, 'Číslo OM', 'Distributor'),
      intakeDistributor: captureBetween(law, 'Distributor', 'Elektroměrový rozvaděč dle normy')
    };

    for (let i = 1; i <= 4; i += 1) {
      parsed[`intakeString${i}RoofCover`] = captureBetween(spec, `Střecha ${i}. string - střešní krytina`, `Střecha ${i}. string - výrobce střešní krytiny`);
      parsed[`intakeString${i}RoofType`] = captureBetween(spec, `Střecha ${i}. string - typ strechy`, `Střecha ${i}. string - počet panelů`) || captureBetween(spec, `Střecha ${i}. string - typ střechy`, `Střecha ${i}. string - počet panelů`);
      parsed[`intakeString${i}Panels`] = parseMaybeNumber(captureBetween(spec, `Střecha ${i}. string - počet panelů`, `Střecha ${i}. string - instalovaný výkon (kW)`));
      parsed[`intakeString${i}Azimuth`] = parseMaybeNumber(captureBetween(spec, `Střecha ${i}. string - azimut`, `Střecha ${i}. string - typ strechy`) || captureBetween(spec, `Střecha ${i}. string - azimut`, `Střecha ${i}. string - typ střechy`));
      parsed[`intakeString${i}Tilt`] = parseMaybeNumber(captureBetween(spec, `Střecha ${i}. string - sklon`, `Střecha ${i}. string - velikost střechy`));
      parsed[`intakeString${i}RoofSize`] = parseMaybeNumber(captureBetween(spec, `Střecha ${i}. string - velikost střechy`, `Střecha ${i}. string - azimut`));
      parsed[`intakeString${i}EaveHeight`] = parseMaybeNumber(captureBetween(spec, `Střecha ${i}. string - Výška domu k okapu`, `Střecha ${i}. string - Výška domu k horizontu`));
      parsed[`intakeString${i}HorizonHeight`] = parseMaybeNumber(captureBetween(spec, `Střecha ${i}. string - Výška domu k horizontu`, i < 4 ? `Střecha ${i + 1}. string - střešní krytina` : 'SPECIFIKACE MÍSTA INSTALACE'));
    }

    const stringPanelSum = Array.from({ length: MAX_PROJECT_STRINGS }, (_, idx) => idx + 1)
      .reduce((sum, idx) => sum + Math.max(0, toNum(parsed[`intakeString${idx}Panels`])), 0);
    if (stringPanelSum > 0) parsed.intakeTotalPanels = String(stringPanelSum);
    if (!toNum(parsed.intakePeopleCount)) {
      const realPeople = parseMaybeNumber(captureBetween(place, 'Počet osob', 'Hromosvod'));
      if (realPeople) parsed.intakePeopleCount = realPeople;
    }

    return parsed;
  }

  function applyParsedIntakeFields(parsed) {
    let count = 0;
    Object.entries(parsed || {}).forEach(([id, value]) => {
      if (!$(id)) return;
      const str = String(value ?? '').trim();
      if (!str) return;
      $(id).value = str;
      count += 1;
    });
    return count;
  }

  function rgbToHsv(r, g, b) {
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    const d = max - min;
    let h = 0;
    if (d) {
      if (max === rn) h = ((gn - bn) / d) % 6;
      else if (max === gn) h = (bn - rn) / d + 2;
      else h = (rn - gn) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    const s = max === 0 ? 0 : d / max;
    return { h, s, v: max };
  }

  function makeBinaryClose(mask, w, h) {
    const dilated = new Uint8Array(mask.length);
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        let on = 0;
        for (let dy = -1; dy <= 1 && !on; dy += 1) {
          const yy = y + dy;
          if (yy < 0 || yy >= h) continue;
          for (let dx = -1; dx <= 1; dx += 1) {
            const xx = x + dx;
            if (xx < 0 || xx >= w) continue;
            if (mask[yy * w + xx]) { on = 1; break; }
          }
        }
        dilated[y * w + x] = on;
      }
    }
    const eroded = new Uint8Array(mask.length);
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        let on = 1;
        for (let dy = -1; dy <= 1 && on; dy += 1) {
          const yy = y + dy;
          if (yy < 0 || yy >= h) { on = 0; break; }
          for (let dx = -1; dx <= 1; dx += 1) {
            const xx = x + dx;
            if (xx < 0 || xx >= w || !dilated[yy * w + xx]) { on = 0; break; }
          }
        }
        eroded[y * w + x] = on ? 1 : 0;
      }
    }
    return eroded;
  }

  function findConnectedComponents(mask, w, h) {
    const visited = new Uint8Array(mask.length);
    const components = [];
    const qx = [];
    const qy = [];
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const startIdx = y * w + x;
        if (!mask[startIdx] || visited[startIdx]) continue;
        let minX = x, maxX = x, minY = y, maxY = y, area = 0;
        let touchesBorder = (x === 0 || y === 0 || x === w - 1 || y === h - 1);
        qx.length = 0; qy.length = 0;
        qx.push(x); qy.push(y); visited[startIdx] = 1;
        for (let qi = 0; qi < qx.length; qi += 1) {
          const cx = qx[qi], cy = qy[qi];
          area += 1;
          if (cx < minX) minX = cx;
          if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy;
          if (cy > maxY) maxY = cy;
          if (cx === 0 || cy === 0 || cx === w - 1 || cy === h - 1) touchesBorder = true;
          for (let dy = -1; dy <= 1; dy += 1) {
            for (let dx = -1; dx <= 1; dx += 1) {
              if (!dx && !dy) continue;
              const nx = cx + dx, ny = cy + dy;
              if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
              const nIdx = ny * w + nx;
              if (!mask[nIdx] || visited[nIdx]) continue;
              visited[nIdx] = 1;
              qx.push(nx); qy.push(ny);
            }
          }
        }
        components.push({ minX, maxX, minY, maxY, w: maxX - minX + 1, h: maxY - minY + 1, area, touchesBorder });
      }
    }
    return components;
  }

  function median(values) {
    const arr = values.filter(v => Number.isFinite(v)).slice().sort((a, b) => a - b);
    if (!arr.length) return 0;
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
  }

  async function loadImageFromDataUrl(src) {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Nepodařilo se načíst obrázek.'));
      img.src = src;
    });
  }

  function rotatePointAround(x, y, cx, cy, angleRad) {
    const dx = x - cx;
    const dy = y - cy;
    const c = Math.cos(angleRad);
    const s = Math.sin(angleRad);
    return {
      x: cx + dx * c - dy * s,
      y: cy + dx * s + dy * c
    };
  }

  function estimateBestRotationDeg(points) {
    if (!points.length) return 0;
    const cx = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const cy = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    const stride = Math.max(1, Math.floor(points.length / 5000));
    let bestAngle = 0;
    let bestArea = Infinity;
    for (let deg = -89; deg <= 89; deg += 1) {
      const a = deg * Math.PI / 180;
      const c = Math.cos(a);
      const s = Math.sin(a);
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (let i = 0; i < points.length; i += stride) {
        const p = points[i];
        const dx = p.x - cx, dy = p.y - cy;
        const rx = dx * c - dy * s;
        const ry = dx * s + dy * c;
        if (rx < minX) minX = rx;
        if (rx > maxX) maxX = rx;
        if (ry < minY) minY = ry;
        if (ry > maxY) maxY = ry;
      }
      const area = (maxX - minX) * (maxY - minY);
      if (area < bestArea) {
        bestArea = area;
        bestAngle = deg;
      }
    }
    return bestAngle;
  }

  async function detectPanelsFromSketchImage(sketchDataUrl) {
    if (!sketchDataUrl) return null;
    const img = await loadImageFromDataUrl(sketchDataUrl);
    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = img.naturalWidth || img.width;
    srcCanvas.height = img.naturalHeight || img.height;
    const sctx = srcCanvas.getContext('2d', { willReadFrequently: true });
    sctx.drawImage(img, 0, 0);
    const { data } = sctx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);

    const mask = new Uint8Array(srcCanvas.width * srcCanvas.height);
    const points = [];
    for (let y = 0; y < srcCanvas.height; y += 1) {
      for (let x = 0; x < srcCanvas.width; x += 1) {
        const idx = (y * srcCanvas.width + x) * 4;
        const a = data[idx + 3];
        if (a < 20) continue;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        const hsv = rgbToHsv(r, g, b);
        const purple = hsv.h >= 235 && hsv.h <= 300 && hsv.s >= 0.18 && hsv.v >= 0.20 && (b + r) / 2 > g + 18;
        if (purple) {
          mask[y * srcCanvas.width + x] = 1;
          points.push({ x, y });
        }
      }
    }
    if (points.length < 80) return null;

    const rotateDeg = estimateBestRotationDeg(points);
    const angleRad = rotateDeg * Math.PI / 180;
    const srcW = srcCanvas.width, srcH = srcCanvas.height;
    const diag = Math.ceil(Math.hypot(srcW, srcH)) + 8;
    const rotCanvas = document.createElement('canvas');
    rotCanvas.width = diag;
    rotCanvas.height = diag;
    const rctx = rotCanvas.getContext('2d', { willReadFrequently: true });
    rctx.fillStyle = '#000';
    rctx.fillRect(0, 0, diag, diag);
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = srcW;
    maskCanvas.height = srcH;
    const mctx = maskCanvas.getContext('2d');
    const imgData = mctx.createImageData(srcW, srcH);
    for (let i = 0; i < mask.length; i += 1) {
      const v = mask[i] ? 255 : 0;
      const p = i * 4;
      imgData.data[p] = v;
      imgData.data[p + 1] = v;
      imgData.data[p + 2] = v;
      imgData.data[p + 3] = 255;
    }
    mctx.putImageData(imgData, 0, 0);
    rctx.imageSmoothingEnabled = false;
    rctx.translate(diag / 2, diag / 2);
    rctx.rotate(angleRad);
    rctx.drawImage(maskCanvas, -srcW / 2, -srcH / 2);
    rctx.setTransform(1, 0, 0, 1, 0, 0);
    const rotData = rctx.getImageData(0, 0, diag, diag).data;
    const rotMask = new Uint8Array(diag * diag);
    for (let i = 0; i < rotMask.length; i += 1) rotMask[i] = rotData[i * 4] > 40 ? 1 : 0;
    const closed = makeBinaryClose(rotMask, diag, diag);
    const inv = new Uint8Array(closed.length);
    for (let i = 0; i < closed.length; i += 1) inv[i] = closed[i] ? 0 : 1;

    const comps = findConnectedComponents(inv, diag, diag).filter(c => !c.touchesBorder && c.area > 20);
    if (!comps.length) return null;

    const medianArea = median(comps.map(c => c.area));
    const candidates = comps.filter(c => {
      const aspect = c.w / Math.max(1, c.h);
      return c.area >= medianArea * 0.35 &&
             c.area <= medianArea * 2.4 &&
             c.w >= 8 && c.h >= 8 &&
             aspect >= 0.45 && aspect <= 3.5;
    });

    if (!candidates.length) return null;

    const cxDst = diag / 2, cyDst = diag / 2;
    const cxSrc = srcW / 2, cySrc = srcH / 2;

    function inverseRotatePoint(rx, ry) {
      const dx = rx - cxDst;
      const dy = ry - cyDst;
      const c = Math.cos(-angleRad);
      const s = Math.sin(-angleRad);
      return {
        x: cxSrc + dx * c - dy * s,
        y: cySrc + dx * s + dy * c
      };
    }

    const boxes = candidates.map(c => ({
      x: c.minX - 1,
      y: c.minY - 1,
      w: c.w + 2,
      h: c.h + 2
    }));

    const panels = boxes.map(box => {
      const cornersRot = [
        { x: box.x, y: box.y },
        { x: box.x + box.w, y: box.y },
        { x: box.x + box.w, y: box.y + box.h },
        { x: box.x, y: box.y + box.h }
      ];
      const corners = cornersRot.map(pt => inverseRotatePoint(pt.x, pt.y));
      return {
        corners,
        boundsRot: { x: box.x, y: box.y, w: box.w, h: box.h }
      };
    });

    const boundsRot = {
      minX: Math.min(...boxes.map(b => b.x)),
      maxX: Math.max(...boxes.map(b => b.x + b.w)),
      minY: Math.min(...boxes.map(b => b.y)),
      maxY: Math.max(...boxes.map(b => b.y + b.h))
    };

    return {
      imageWidth: srcW,
      imageHeight: srcH,
      rotationDeg: rotateDeg,
      rotationRad: angleRad,
      rotatedCanvasSize: diag,
      sourceCenter: { x: cxSrc, y: cySrc },
      rotatedCenter: { x: cxDst, y: cyDst },
      panelCount: panels.length,
      panels,
      boxesRot: boxes,
      boundsRot,
      avgBoxW: median(boxes.map(b => b.w)),
      avgBoxH: median(boxes.map(b => b.h))
    };
  }

  function formatDetectedSketchInfo(info, data = gatherData()) {
    if (!info) return 'Detekce panelů z nákresu zatím neproběhla.';
    const landscape = info.avgBoxW >= info.avgBoxH;
    const moduleW = landscape ? Math.max(1, data.panelHeight || 2279) : Math.max(1, data.panelWidth || 1134);
    const moduleH = landscape ? Math.max(1, data.panelWidth || 1134) : Math.max(1, data.panelHeight || 2279);
    const mmPerPxX = moduleW / Math.max(1, info.avgBoxW || 1);
    const mmPerPxY = moduleH / Math.max(1, info.avgBoxH || 1);
    const widthMm = (info.boundsRot.maxX - info.boundsRot.minX) * mmPerPxX;
    const heightMm = (info.boundsRot.maxY - info.boundsRot.minY) * mmPerPxY;
    return `Detekováno ${fmt(info.panelCount, 0)} panelů • směr ${landscape ? 'na šířku' : 'na výšku'} • orientační kóta sestavy ${fmt(widthMm, 0)} × ${fmt(heightMm, 0)} mm.`;
  }

  async function runSketchPanelDetection(silent = false) {
    if (!state.images.sketch) {
      if (!silent) status('Nejdřív nahraj nákres střechy.', false);
      state.analysis.sketchPanels = null;
      renderSourcePreviews();
      updateSummary();
      generatePrompt();
      return null;
    }
    try {
      if (!silent) status('Analyzuju nákres a hledám panely…');
      const detected = await detectPanelsFromSketchImage(state.images.sketch);
      state.analysis.sketchPanels = detected;
      renderSourcePreviews();
      updateSummary();
      generatePrompt();
      if (detected) {
        if (!silent) status(`Z nákresu detekováno ${detected.panelCount} panelů.`);
      } else if (!silent) {
        status('Panely se z nákresu nepodařilo detekovat. Zůstává ruční / polygonové řešení.', false);
      }
      return detected;
    } catch (err) {
      state.analysis.sketchPanels = null;
      renderSourcePreviews();
      updateSummary();
      generatePrompt();
      if (!silent) status(`Detekce panelů selhala: ${err.message || err}`, false);
      return null;
    }
  }


  function gatherIntakeData() {
    const intake = {};
    intakeFieldIds.forEach(id => { if ($(id)) intake[id] = $(id).value.trim(); });
    intake.intakeStrings = Array.from({ length: MAX_PROJECT_STRINGS }, (_, idx) => idx + 1).map(i => ({
      index: i,
      roofCover: $(`intakeString${i}RoofCover`)?.value.trim() || '',
      roofType: $(`intakeString${i}RoofType`)?.value.trim() || '',
      panels: toNum($(`intakeString${i}Panels`)?.value),
      azimuth: toNum($(`intakeString${i}Azimuth`)?.value),
      tilt: toNum($(`intakeString${i}Tilt`)?.value),
      roofSize: toNum($(`intakeString${i}RoofSize`)?.value),
      eaveHeight: toNum($(`intakeString${i}EaveHeight`)?.value),
      horizonHeight: toNum($(`intakeString${i}HorizonHeight`)?.value)
    }));
    const stringSum = intake.intakeStrings.reduce((sum, row) => sum + Math.max(0, toNum(row.panels)), 0);
    if (stringSum > 0) intake.intakeTotalPanels = String(stringSum);
    return intake;
  }

  function seedIntakeDefaults() {
    const sample = {
      intakeApplicantName: 'Josef Turek',
      intakeRealStreet: 'Konečná',
      intakeRealHouseNo: '1588',
      intakeRealPsc: '39301',
      intakeRealCity: 'Pelhřimov',
      intakeCadastralCode: '718912',
      intakeParcelNumber: '2713/281',
      intakeLvNumber: '1632',
      intakePropertyType: 'Rodinný dům',
      intakePeopleCount: '4',
      intakeFloors: '2',
      intakeProductType: 'Fotovoltaická elektrárna',
      intakeTotalPanels: '12',
      intakePhases: '3',
      intakePanelType: 'DAH Solar DHM-T72X10/FS(BB)-550Wp',
      intakeInverterType: 'HYD 8KTL-3PH',
      intakeAccumulationType: 'FVE s hybridním měničem a akumulátory',
      intakeBatteryType: 'LiFePO4 Renac TB-H1-11.23',
      intakeWallboxCount: '2',
      intakeWallboxPlace: 'Garáž',
      intakeLightning: 'Ano',
      intakeInverterPlace: 'Technická místnost',
      intakeMainBoardPlace: 'Hlavní rozvaděč RH',
      intakeMeterBoardPlace: 'Elektroměrový rozvaděč RE',
      intakeMainBreaker: '25',
      intakeRoute: 'Začíná fotovoltaickými panely na střeše objektu. DC kabely jsou zaústěny pod střechu do rozvodnice RDC a pokračují v liště do technické místnosti, kde je umístěna technologie FVE. Připojení na síť je v hlavním rozvaděči RH, kde je umístěn i smartmeter. Wallbox je umístěn v garáži objektu.',
      intakeString1RoofCover: 'IPA',
      intakeString1RoofType: 'Rovná',
      intakeString1Panels: '12',
      intakeString1Azimuth: '180',
      intakeString1Tilt: '35'
    };
    Object.entries(sample).forEach(([id, value]) => setIfFilled(id, value));
    if ($('syncOnGenerate')) $('syncOnGenerate').checked = true;
  }

  function renderSourcePreviews() {
    if ($('sourceFormInfo')) {
      const meta = state.references?.sourceForm;
      $('sourceFormInfo').innerHTML = meta
        ? `Nahraný formulář: <strong>${sanitize(meta.name || 'bez názvu')}</strong>${meta.type ? ` · ${sanitize(meta.type)}` : ''}`
        : 'Není nahraný žádný zdrojový formulář.';
    }
    if ($('sourceFormParseInfo')) {
      const parsed = state.analysis?.sourceFormParsed;
      $('sourceFormParseInfo').innerHTML = parsed?.fieldCount
        ? `Automaticky přeneseno <strong>${sanitize(parsed.fieldCount)}</strong> polí z textového PDF formuláře.`
        : 'Automatický přenos funguje pro textové PDF formuláře.';
    }
    if ($('sketchPreviewBox')) {
      $('sketchPreviewBox').innerHTML = state.images.sketch
        ? `<img src="${state.images.sketch}" alt="Nákres střechy">`
        : '<div class="small-muted">Nákres zatím není nahraný.</div>';
    }
    if ($('sketchTraceInfo')) {
      $('sketchTraceInfo').textContent = formatDetectedSketchInfo(state.analysis?.sketchPanels, gatherData());
    }
  }

  function clearSourceFiles() {
    state.references.sourceForm = null;
    state.analysis.sourceFormText = '';
    state.analysis.sourceFormParsed = null;
    state.analysis.sourceFormStructured = null;
    state.analysis.sketchPanels = null;
    state.images.sketch = null;
    if ($('sourceFormUpload')) $('sourceFormUpload').value = '';
    if ($('sketchUpload')) $('sketchUpload').value = '';
    renderSourcePreviews();
    updateSummary();
    generatePrompt();
    status('Zdrojové podklady byly vyčištěny.');
  }

  async function handleSourceFormInput(file) {
    if (!file) {
      state.references.sourceForm = null;
      state.analysis.sourceFormText = '';
      state.analysis.sourceFormParsed = null;
      renderSourcePreviews();
      return;
    }
    state.references.sourceForm = { name: file.name || 'formulář', type: file.type || '', size: file.size || 0 };
    renderSourcePreviews();

    const isPdf = /\.pdf$/i.test(file.name || '') || String(file.type || '').toLowerCase().includes('pdf');
    if (!isPdf) {
      state.analysis.sourceFormText = '';
      state.analysis.sourceFormParsed = null;
      renderSourcePreviews();
      updateSummary();
      generatePrompt();
      status('Formulář byl uložen jako podklad. Automatický přenos teď funguje pro textové PDF.', false);
      return;
    }

    try {
      status('Načítám zdrojový formulář a přenáším data do buněk…');
      const structured = await extractPdfStructuredFromFile(file);
      let parsed = parseSourceFormStructured(structured);
      const fallback = parseSourceFormText(structured.text);
      parsed = mergeParsedFields(parsed, fallback);
      const fieldCount = applyParsedIntakeFields(parsed);
      state.analysis.sourceFormText = structured.text;
      state.analysis.sourceFormStructured = structured;
      state.analysis.sourceFormParsed = { fields: parsed, fieldCount };
      renderSourcePreviews();
      if ($('syncOnGenerate')?.checked) syncProjectFromIntake(true);
      updateSummary();
      generatePrompt();
      status(`Z formuláře přeneseno ${fieldCount} polí.`);
    } catch (err) {
      state.analysis.sourceFormText = '';
      state.analysis.sourceFormStructured = null;
      state.analysis.sourceFormParsed = null;
      renderSourcePreviews();
      updateSummary();
      generatePrompt();
      status(`Formulář se nepodařilo načíst: ${err.message || err}`, false);
    }
  }

  function syncProjectFromIntake(silent = false) {
    const intake = gatherIntakeData();
    setIfFilled('investorName', intake.intakeApplicantName);
    const realizedAddress = fullAddress(intake.intakeRealStreet, intake.intakeRealHouseNo, intake.intakeRealOrientNo, intake.intakeRealPsc, intake.intakeRealCity);
    setIfFilled('siteAddress', realizedAddress);
    setIfFilled('siteTown', intake.intakeRealCity);
    setIfFilled('cadastralArea', intake.intakeCadastralName ? `${intake.intakeCadastralName}${intake.intakeCadastralCode ? ` (${intake.intakeCadastralCode})` : ''}` : intake.intakeCadastralCode);
    setIfFilled('parcelNumber', intake.intakeParcelNumber);
    setIfFilled('lvNumber', intake.intakeLvNumber);
    setIfFilled('buildingType', intake.intakePropertyType);
    setIfFilled('floors', intake.intakeFloors);

    const firstString = intake.intakeStrings.find(s => s.panels || s.roofType || s.roofCover || s.azimuth || s.tilt) || null;
    if (firstString?.roofType) setIfFilled('roofType', firstString.roofType);
    if (firstString?.roofCover) setIfFilled('roofSurface', firstString.roofCover);
    if (intake.intakeWallboxPlace) setIfFilled('wallboxPlace', intake.intakeWallboxPlace);
    if (intake.intakeInverterPlace) setIfFilled('technicalRoom', intake.intakeInverterPlace);

    const lightning = normalizeText(intake.intakeLightning);
    if (lightning) {
      $('lightning').value = lightning === 'ano' ? 'Stávající hromosvod' : (lightning === 'ne' ? 'Bez hromosvodu - doporučit doplnění' : 'Nutno ověřit');
    }

    const panelSplit = splitPanelBrandModel(intake.intakePanelType);
    if (panelSplit.brand) setIfFilled('panelManufacturer', panelSplit.brand);
    if (panelSplit.model || intake.intakePanelType) setIfFilled('panelType', panelSplit.model || intake.intakePanelType);
    const panelWp = extractWp(intake.intakePanelType);
    if (panelWp) setIfFilled('panelPower', panelWp);

    setIfFilled('inverterType', intake.intakeInverterType);
    if (intake.intakePhases) $('inverterPhases').value = String(intake.intakePhases).trim() === '1' ? '1f' : '3f';

    const accNorm = normalizeText(intake.intakeAccumulationType);
    if (accNorm) $('hasBattery').checked = !(/bez/.test(accNorm) && !/bateri/.test(accNorm));
    if (intake.intakeBatteryType || intake.intakeBatteryModuleType) {
      $('hasBattery').checked = true;
      setIfFilled('batteryType', intake.intakeBatteryType || intake.intakeBatteryModuleType);
    }
    const battCount = Math.max(0, toNum(intake.intakeBatteryCount));
    if (battCount > 0) {
      $('hasBattery').checked = true;
      setIfFilled('batteryCapacity', (battCount * 5).toFixed(2));
    }

    const wbCount = Math.max(0, toNum(intake.intakeWallboxCount));
    if (wbCount > 0) {
      $('hasWallbox').checked = true;
      setIfFilled('evPoints', wbCount);
      setIfFilled('wallboxPlace', intake.intakeWallboxPlace);
    } else if (intake.intakeWallboxCount) {
      $('hasWallbox').checked = false;
      setIfFilled('evPoints', 1);
    }

    if (intake.intakeRoute) setIfFilled('routeDescription', intake.intakeRoute);
    if (intake.sketchNote) {
      const existing = $('executionNotes').value.trim();
      if (!existing.includes(intake.sketchNote)) {
        $('executionNotes').value = [existing, `Poznámka k nákresu: ${intake.sketchNote}`].filter(Boolean).join('\n');
      }
    }

    const filledStrings = intake.intakeStrings
      .filter(s => Math.max(0, toNum(s.panels)) > 0 || ((s.roofType || s.roofCover) && (Math.max(0, toNum(s.azimuth)) > 0 || Math.max(0, toNum(s.tilt)) > 0 || Math.max(0, toNum(s.roofSize)) > 0 || Math.max(0, toNum(s.eaveHeight)) > 0 || Math.max(0, toNum(s.horizonHeight)) > 0)))
      .slice(0, MAX_PROJECT_STRINGS);
    if (filledStrings.length) {
      const totalFromStrings = filledStrings.reduce((sum, row) => sum + Math.max(0, toNum(row.panels)), 0);
      if (totalFromStrings > 0 && $('intakeTotalPanels')) $('intakeTotalPanels').value = totalFromStrings;
      const palette = ['#1f3c88', '#5e35b1', '#0b6b8a', '#8a5c00'];
      state.rows = filledStrings.map((s, idx) => ({
        name: `ŘADA ${toRoman(idx + 1)}`,
        panels: Math.max(1, toNum(s.panels || 1, 1)),
        azimuth: toNum(s.azimuth || 180, 180),
        tilt: toNum(s.tilt || 35, 35),
        drawX: state.rows[idx]?.drawX || 0,
        drawY: state.rows[idx]?.drawY || 0,
        drawRotation: state.rows[idx]?.drawRotation || 0,
        drawOrientation: state.rows[idx]?.drawOrientation || 'landscape',
        drawCols: state.rows[idx]?.drawCols || Math.max(2, Math.min(6, toNum(s.panels || 4, 4))),
        note: [s.roofCover ? `Krytina ${s.roofCover}` : '', s.roofSize ? `plocha ${fmt(s.roofSize, 1)} m²` : '', s.eaveHeight ? `okap ${fmt(s.eaveHeight, 1)} m` : '', s.horizonHeight ? `horizont ${fmt(s.horizonHeight, 1)} m` : ''].filter(Boolean).join(', '),
        color: state.rows[idx]?.color || palette[idx % palette.length],
        layoutMode: 'auto'
      }));
      renderRows();
    } else {
      const totalFromForm = Math.max(0, toNum(intake.intakeTotalPanels));
      if (totalFromForm > 0) {
        ensureRowCount(1);
        state.rows[0].panels = totalFromForm;
        renderRows();
      }
    }

    if (intake.intakeTotalPanels && !filledStrings.length) {
      const totalFromForm = Math.max(0, toNum(intake.intakeTotalPanels));
      if (totalFromForm > 0) setIfFilled('customHeaderNote', `FVE ${fmt(totalFromForm, 0)} ks panelů${wbCount > 0 ? ' + wallbox' : ''}${$('hasBattery').checked ? ' + baterie' : ''}`);
    }

    updateSummary();
    generatePrompt();
    if (!silent) status('Data z formuláře byla převzata do projektu.');
    return intake;
  }

  function loadDefaults() {
    $('projectNumber').value = '360207';
    $('issueDate').value = '2025-11-14';
    $('docPurpose').value = 'Projekt pro účely NZÚ';
    $('investorName').value = 'Josef Turek';
    $('siteAddress').value = 'Konečná 1588, 39301 Pelhřimov';
    $('siteTown').value = 'Pelhřimov';
    $('cadastralArea').value = '718912';
    $('parcelNumber').value = '2713/281';
    $('lvNumber').value = '1632';
    $('buildingType').value = 'Rodinný dům';
    $('roofType').value = 'Rovná';
    $('roofSurface').value = 'IPA';
    $('roofFire').value = 'NEHOŘLAVÝ';
    $('floors').value = '2';
    $('heatingSource').value = 'Plynový kotel';
    $('hotWaterSource').value = 'Plynový kotel';
    $('roofWidth').value = '11000';
    $('roofHeight').value = '10400';
    $('roofEdgeOffset').value = '300';
    $('panelGapMm').value = '20';
    $('roofPolygon').value = '0,0 11000,0 11000,10400 0,10400';
    if ($('useSketchTrace')) $('useSketchTrace').checked = true;
    $('roofObstacles').value = '';
    $('technicalRoom').value = 'Technická místnost';
    $('wallboxPlace').value = 'Garáž';
    $('lightning').value = 'Stávající hromosvod';
    $('roofPlanScale').value = '1:100';
    $('buildingDescription').value = 'Fotovoltaické panely budou umístěny na střeše rodinného domu, který bude zároveň místem spotřeby vyrobené energie. Panely budou orientovány dle jednotlivých řad uvedených níže. Sklon panelů je dán sklonem střechy nebo systémové konstrukce v místě instalace.';
    $('executionNotes').value = 'Umístění komponentů, prostupů do budovy, tras a způsobu provedení je nutno koordinovat s odpovědným zástupcem investora a s dodavatelem. Kabelové rozvody musí být provedeny tak, aby neztěžovaly údržbu a výměnu jednotlivých částí systému.';
    $('panelManufacturer').value = 'DAH Solar';
    $('panelType').value = 'DHM-T72X10/FS(BB)-550Wp';
    $('panelPower').value = '550';
    $('panelVoltage').value = '63';
    $('panelArea').value = '2.58';
    $('panelWidth').value = '1134';
    $('panelHeight').value = '2279';
    $('panelSvt').value = 'SVT34133';
    $('connectionType').value = 'Vlastní spotřeba';
    $('inverterManufacturer').value = 'SOFAR SOLAR';
    $('inverterType').value = 'HYD 8KTL-3PH';
    $('inverterPhases').value = '3f';
    $('inverterCount').value = '1';
    $('inverterSvt').value = 'SVT30838';
    $('batteryType').value = 'LiFePO4 Renac TB-H1-11.23';
    $('batteryCapacity').value = '11.23';
    $('batteryCurrent').value = '25';
    $('meterType').value = 'SOFAR SOLAR DTSU666 smartmeter 3f';
    $('utilityMeter').value = 'Obousměrný elektroměr';
    $('mainBoard').value = 'Hlavní domovní rozvaděč RH';
    $('meterBoard').value = 'Elektroměrový rozvaděč RE';
    $('wallboxType').value = 'Joint JNT-EVC11 Series-EU';
    $('wallboxPower').value = '11';
    $('evPoints').value = '2';
    $('backupLabel').value = 'EPS rozvaděč';
    $('dcProtection').value = 'Přepěťová ochrana SPD + DC odpojovač';
    $('acProtection').value = 'Jistič + přepěťová ochrana SPD';
    $('dcCable').value = 'Solární kabel';
    $('acCable').value = 'CYKY-J';
    $('utpCable').value = 'UTP CAT 5E';
    $('hasBattery').checked = true;
    $('hasWallbox').checked = true;
    $('hasBackup').checked = false;
    $('hasExportToGrid').checked = true;
    $('routeDescription').value = 'Začíná fotovoltaickými panely na střeše objektu. DC kabely jsou zaústěny pod střechu do rozvodnice RDC a pokračují v liště do technické místnosti, kde je umístěna technologie FVE. Připojení na síť je v hlavním rozvaděči RH, kde je umístěn i smartmeter. Wallbox je umístěn v garáži objektu.';
    $('protectionSettings').value = '- Po odstávce se výrobna bude k DS připojovat automaticky nejdříve v okamžiku, kdy napětí i frekvence v distribuční soustavě bylo v předcházejících 20 minutách bez přerušení v hodnotách uvedených ve smlouvě o připojení, zajištěno funkcí střídače.\n- Nastavení ochran dle PPDS a platných podmínek distributora.\n- U,f ochrana je integrována ve střídači.\n- Při výpadku napětí v DS zajišťuje střídač vlastní funkcí odpojení od DS a blokování opětného zapnutí do doby obnovení napětí i frekvence v DS.';
    $('electricalNotes').value = 'Kabelové vedení stejnosměrného i střídavého proudu bude opatřeno přepěťovou ochranou. Způsob měření elektrické energie, napojení do distribuční sítě a nastavení ochran je nutno ověřit před realizací podle konkrétního zařízení a podmínek distributora.';
    state.rows = defaultRows();
    state.images = { logo: null, roof: null, map: null, sketch: null };
    state.references = { sourceForm: null };
    state.analysis = { sourceFormText: '', sourceFormParsed: null, sketchPanels: null };
    $('logoUpload').value = '';
    $('roofUpload').value = '';
    $('mapUpload').value = '';
    if ($('sourceFormUpload')) $('sourceFormUpload').value = '';
    if ($('sketchUpload')) $('sketchUpload').value = '';
    intakeFieldIds.forEach(id => { if ($(id)) $(id).value = ''; });
    seedIntakeDefaults();
    renderRows();
    renderSourcePreviews();
    updateSummary();
    generatePrompt();
  }

  function rowTemplate(row, idx) {
    return `
      <div class="row-card" data-index="${idx}">
        <div class="topline">
          <div class="chipline">
            <span class="pill">String / řada ${idx + 1}</span>
            <span class="chip">${sanitize(row.layoutMode === 'manual' ? 'Ruční umístění' : 'Automatické skládání')}</span>
          </div>
          <button class="btn" data-remove-row="${idx}">Smazat řadu</button>
        </div>
        <div class="fields">
          <div class="field"><label>Název řady</label><input data-row="${idx}" data-key="name" value="${sanitize(row.name)}"></div>
          <div class="field"><label>Počet panelů</label><input data-row="${idx}" data-key="panels" type="number" min="1" value="${sanitize(row.panels)}"></div>
          <div class="field"><label>Azimut [°]</label><input data-row="${idx}" data-key="azimuth" type="number" value="${sanitize(row.azimuth)}"></div>
          <div class="field"><label>Sklon [°]</label><input data-row="${idx}" data-key="tilt" type="number" value="${sanitize(row.tilt)}"></div>
          <div class="field"><label>Barva řady</label><input data-row="${idx}" data-key="color" type="color" value="${sanitize(row.color || '#1f3c88')}"></div>
          <div class="field"><label>Poznámka k řadě</label><input data-row="${idx}" data-key="note" value="${sanitize(row.note || '')}"></div>
          <div class="field"><label>Režim umístění</label>
            <select data-row="${idx}" data-key="layoutMode">
              <option value="auto" ${row.layoutMode !== 'manual' ? 'selected' : ''}>Automaticky do polygonu</option>
              <option value="manual" ${row.layoutMode === 'manual' ? 'selected' : ''}>Ruční souřadnice</option>
            </select>
          </div>
          <div class="field"><label>Ruční X [mm]</label><input data-row="${idx}" data-key="drawX" type="number" min="0" step="10" value="${sanitize(row.drawX)}"></div>
          <div class="field"><label>Ruční Y [mm]</label><input data-row="${idx}" data-key="drawY" type="number" min="0" step="10" value="${sanitize(row.drawY)}"></div>
          <div class="field"><label>Rotace skupiny [°]</label><input data-row="${idx}" data-key="drawRotation" type="number" step="1" value="${sanitize(row.drawRotation)}"></div>
          <div class="field"><label>Orientace panelů</label>
            <select data-row="${idx}" data-key="drawOrientation">
              <option value="portrait" ${row.drawOrientation === 'portrait' ? 'selected' : ''}>Na výšku</option>
              <option value="landscape" ${row.drawOrientation === 'landscape' ? 'selected' : ''}>Na šířku</option>
            </select>
          </div>
          <div class="field"><label>Panelů v jedné linii</label><input data-row="${idx}" data-key="drawCols" type="number" min="1" step="1" value="${sanitize(row.drawCols || 6)}"></div>
        </div>
      </div>`;
  }

  function renderRows() {
    const wrap = $('rowsWrap');
    wrap.innerHTML = state.rows.map(rowTemplate).join('');
    if ($('btnAddRow')) {
      $('btnAddRow').disabled = state.rows.length >= MAX_PROJECT_STRINGS;
      $('btnAddRow').textContent = state.rows.length >= MAX_PROJECT_STRINGS ? 'Max. 2 stringy' : 'Přidat řadu';
    }
    wrap.querySelectorAll('[data-row]').forEach(el => {
      const sync = () => {
        const idx = Number(el.dataset.row);
        const key = el.dataset.key;
        let value = el.value;
        if (['panels', 'azimuth', 'tilt', 'drawX', 'drawY', 'drawRotation', 'drawCols'].includes(key)) value = toNum(value);
        state.rows[idx][key] = value;
        updateSummary();
        generatePrompt();
      };
      el.addEventListener('input', sync);
      el.addEventListener('change', sync);
    });
    wrap.querySelectorAll('[data-remove-row]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.removeRow);
        state.rows.splice(idx, 1);
        if (!state.rows.length) state.rows.push(defaultRows()[0]);
        renderRows();
        updateSummary();
        generatePrompt();
      });
    });
  }

  function autoLayoutRows() {
    if (!state.rows.length) return;
    state.rows.forEach(row => row.layoutMode = 'auto');
    const data = gatherData();
    const layout = computeRoofLayout(data);
    layout.rows.forEach((placed, i) => {
      if (!state.rows[i]) return;
      if (Number.isFinite(placed.originX)) state.rows[i].drawX = Math.round(placed.originX);
      if (Number.isFinite(placed.originY)) state.rows[i].drawY = Math.round(placed.originY);
      if (Number.isFinite(placed.cols)) state.rows[i].drawCols = placed.cols;
      if (placed.orientation) state.rows[i].drawOrientation = placed.orientation;
    });
    renderRows();
    updateSummary();
    generatePrompt();
    status(layout.errors?.length ? 'Část řad se nepodařilo umístit automaticky. Zkontroluj kontrolu projektu.' : 'Řady byly automaticky rozloženy do polygonu střechy.', !layout.errors?.length);
  }

  function gatherData() {
    const panelPower = toNum($('panelPower').value);
    const panelArea = toNum($('panelArea').value);
    const rows = state.rows.map((r, i) => ({
      name: r.name || `ŘADA ${i + 1}`,
      panels: Math.max(1, toNum(r.panels, 1)),
      azimuth: toNum(r.azimuth),
      tilt: toNum(r.tilt),
      drawX: Math.max(0, toNum(r.drawX)),
      drawY: Math.max(0, toNum(r.drawY)),
      drawRotation: toNum(r.drawRotation),
      drawOrientation: r.drawOrientation || 'landscape',
      drawCols: Math.max(1, toNum(r.drawCols || 6, 6)),
      note: r.note || '',
      color: r.color || '#1f3c88',
      layoutMode: r.layoutMode === 'manual' ? 'manual' : 'auto'
    }));
    const totalPanels = rows.reduce((sum, r) => sum + r.panels, 0);
    const installedPowerWp = totalPanels * panelPower;
    const installedPowerKw = installedPowerWp / 1000;
    const totalArea = totalPanels * panelArea;
    return {
      projectNumber: $('projectNumber').value.trim(),
      issueDate: $('issueDate').value,
      docPurpose: $('docPurpose').value.trim(),
      investorName: $('investorName').value.trim(),
      siteAddress: $('siteAddress').value.trim(),
      siteTown: $('siteTown').value.trim(),
      cadastralArea: $('cadastralArea').value.trim(),
      parcelNumber: $('parcelNumber').value.trim(),
      lvNumber: $('lvNumber').value.trim(),
      buildingType: $('buildingType').value.trim(),
      companyName: $('companyName').value.trim(),
      companyAddress: $('companyAddress').value.trim(),
      companyIc: $('companyIc').value.trim(),
      companyEmail: $('companyEmail').value.trim(),
      companyPhone: $('companyPhone').value.trim(),
      designerName: $('designerName').value.trim(),
      designerCert: $('designerCert').value.trim(),
      assistantName: $('assistantName').value.trim(),
      assistantEmail: $('assistantEmail').value.trim(),
      customHeaderNote: $('customHeaderNote').value.trim(),

      roofType: $('roofType').value,
      roofSurface: $('roofSurface').value.trim(),
      roofFire: $('roofFire').value,
      floors: $('floors').value.trim(),
      heatingSource: $('heatingSource').value.trim(),
      hotWaterSource: $('hotWaterSource').value.trim(),
      roofWidth: toNum($('roofWidth').value),
      roofHeight: toNum($('roofHeight').value),
      roofEdgeOffset: Math.max(0, toNum($('roofEdgeOffset').value)),
      panelGapMm: Math.max(0, toNum($('panelGapMm').value)),
      roofPolygon: $('roofPolygon').value.trim(),
      roofObstacles: $('roofObstacles').value.trim(),
      technicalRoom: $('technicalRoom').value.trim(),
      wallboxPlace: $('wallboxPlace').value.trim(),
      lightning: $('lightning').value,
      roofPlanScale: $('roofPlanScale').value.trim(),
      buildingDescription: $('buildingDescription').value.trim(),
      executionNotes: $('executionNotes').value.trim(),

      panelManufacturer: $('panelManufacturer').value.trim(),
      panelType: $('panelType').value.trim(),
      panelPower,
      panelVoltage: toNum($('panelVoltage').value),
      panelArea,
      panelWidth: toNum($('panelWidth').value),
      panelHeight: toNum($('panelHeight').value),
      panelSvt: $('panelSvt').value.trim(),
      connectionType: $('connectionType').value.trim(),

      inverterManufacturer: $('inverterManufacturer').value.trim(),
      inverterType: $('inverterType').value.trim(),
      inverterPhases: $('inverterPhases').value,
      inverterCount: Math.max(1, toNum($('inverterCount').value, 1)),
      inverterSvt: $('inverterSvt').value.trim(),
      batteryType: $('batteryType').value.trim(),
      batteryCapacity: toNum($('batteryCapacity').value),
      batteryCurrent: toNum($('batteryCurrent').value),
      meterType: $('meterType').value.trim(),
      utilityMeter: $('utilityMeter').value.trim(),
      mainBoard: $('mainBoard').value.trim(),
      meterBoard: $('meterBoard').value.trim(),
      wallboxType: $('wallboxType').value.trim(),
      wallboxPower: toNum($('wallboxPower').value),
      evPoints: Math.max(1, toNum($('evPoints').value, 1)),
      backupLabel: $('backupLabel').value.trim(),
      dcProtection: $('dcProtection').value.trim(),
      acProtection: $('acProtection').value.trim(),
      dcCable: $('dcCable').value.trim(),
      acCable: $('acCable').value.trim(),
      utpCable: $('utpCable').value.trim(),
      hasBattery: $('hasBattery').checked,
      hasWallbox: $('hasWallbox').checked,
      hasBackup: $('hasBackup').checked,
      hasExportToGrid: $('hasExportToGrid').checked,
      routeDescription: $('routeDescription').value.trim(),
      protectionSettings: $('protectionSettings').value.trim(),
      electricalNotes: $('electricalNotes').value.trim(),

      rows,
      totalPanels,
      installedPowerWp,
      installedPowerKw,
      totalArea,
      stringCount: rows.length,

      intake: gatherIntakeData(),
      sourceFormMeta: state.references.sourceForm || null,
      sourceFormText: state.analysis.sourceFormText || '',
      sourceFormParsed: state.analysis.sourceFormParsed || null,
      useSketchTrace: $('useSketchTrace') ? $('useSketchTrace').checked : true,
      sketchPanels: state.analysis.sketchPanels || null,
      logoData: state.images.logo,
      sketchData: state.images.sketch,
      roofData: state.images.roof,
      mapData: state.images.map
    };
  }

  function updateSummary() {
    const data = gatherData();
    $('sumPanels').textContent = fmt(data.totalPanels, 0);
    $('sumPower').textContent = `${fmt(data.installedPowerKw, 2)} kWp`;
    $('sumRows').textContent = fmt(data.stringCount, 0);
    $('sumArea').textContent = `${fmt(data.totalArea, 1)} m²`;
    renderValidation(data);
    renderLivePreview(data);
  }

  function normalizeText(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function wrapTextToLines(text, maxChars = 28) {
    const paragraphs = String(text || '').replace(/\r/g, '').split('\n');
    const lines = [];
    paragraphs.forEach((paragraph, pIdx) => {
      const words = paragraph.trim().split(/\s+/).filter(Boolean);
      if (!words.length) {
        if (pIdx < paragraphs.length - 1) lines.push('');
        return;
      }
      let line = '';
      words.forEach(word => {
        const trial = line ? `${line} ${word}` : word;
        if (trial.length > maxChars && line) {
          lines.push(line);
          line = word;
        } else {
          line = trial;
        }
      });
      if (line) lines.push(line);
      if (pIdx < paragraphs.length - 1) lines.push('');
    });
    return lines.length ? lines : [''];
  }

  function textToHtml(text) {
    return sanitize(text || '').replace(/\n/g, '<br>');
  }

  function textToHtmlBlocks(text) {
    const raw = String(text || '').trim();
    if (!raw) return '<p>-</p>';
    const lines = raw.split(/\r?\n/).map(v => v.trim()).filter(Boolean);
    const bullets = lines.filter(v => /^[-•]/.test(v));
    if (bullets.length === lines.length) {
      return `<ul>${bullets.map(v => `<li>${sanitize(v.replace(/^[-•]\s*/, ''))}</li>`).join('')}</ul>`;
    }
    return raw.split(/\n{2,}/).map(p => `<p>${sanitize(p).replace(/\n/g, '<br>')}</p>`).join('');
  }

  function parseRoofPolygon(text, fallbackWidth, fallbackHeight) {
    const parsed = [];
    String(text || '')
      .replace(/[;\n\r]+/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .forEach(token => {
        const match = token.match(/(-?\d+(?:[.,]\d+)?)\s*,\s*(-?\d+(?:[.,]\d+)?)/);
        if (match) parsed.push({ x: toNum(match[1]), y: toNum(match[2]) });
      });
    if (parsed.length >= 3) return parsed;
    return [
      { x: 0, y: 0 },
      { x: fallbackWidth || 10000, y: 0 },
      { x: fallbackWidth || 10000, y: fallbackHeight || 10000 },
      { x: 0, y: fallbackHeight || 10000 }
    ];
  }

  function parseRoofObstacles(text) {
    return String(text || '')
      .split(/\r?\n/)
      .map(v => v.trim())
      .filter(Boolean)
      .map((line, idx) => {
        const parts = line.split(/[;|]/).map(v => v.trim());
        if (parts.length < 5) return null;
        return {
          name: parts[0] || `Překážka ${idx + 1}`,
          x: toNum(parts[1]),
          y: toNum(parts[2]),
          w: Math.max(0, toNum(parts[3])),
          h: Math.max(0, toNum(parts[4]))
        };
      })
      .filter(Boolean);
  }

  function polygonBounds(points) {
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
      width: Math.max(1, Math.max(...xs) - Math.min(...xs)),
      height: Math.max(1, Math.max(...ys) - Math.min(...ys))
    };
  }

  function pointInPolygon(x, y, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-9) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function rectIntersects(a, b) {
    return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
  }

  function inflateRect(rect, d) {
    return { x: rect.x - d, y: rect.y - d, w: rect.w + d * 2, h: rect.h + d * 2 };
  }

  function rectFits(rect, polygon, obstacles, occupied, boundaryClearance = 0) {
    const boundary = inflateRect(rect, boundaryClearance);
    const pts = [
      [boundary.x, boundary.y],
      [boundary.x + boundary.w, boundary.y],
      [boundary.x + boundary.w, boundary.y + boundary.h],
      [boundary.x, boundary.y + boundary.h],
      [boundary.x + boundary.w / 2, boundary.y],
      [boundary.x + boundary.w / 2, boundary.y + boundary.h],
      [boundary.x, boundary.y + boundary.h / 2],
      [boundary.x + boundary.w, boundary.y + boundary.h / 2],
      [boundary.x + boundary.w / 2, boundary.y + boundary.h / 2]
    ];
    if (!pts.every(([px, py]) => pointInPolygon(px, py, polygon))) return false;
    if (obstacles.some(ob => rectIntersects(boundary, ob))) return false;
    if (occupied.some(ob => rectIntersects(rect, ob))) return false;
    return true;
  }

  function getPanelPlanSize(row, data) {
    const portraitW = data.panelWidth || 1134;
    const portraitH = data.panelHeight || 2279;
    return row.drawOrientation === 'landscape'
      ? { w: portraitH, h: portraitW }
      : { w: portraitW, h: portraitH };
  }

  function buildRowGridRects(row, originX, originY, cols, data) {
    const size = getPanelPlanSize(row, data);
    const gap = data.panelGapMm || 0;
    const rects = [];
    for (let i = 0; i < row.panels; i++) {
      const col = i % cols;
      const rr = Math.floor(i / cols);
      rects.push({
        x: originX + col * (size.w + gap),
        y: originY + rr * (size.h + gap),
        w: size.w,
        h: size.h
      });
    }
    return rects;
  }

  function rectsBoundingBox(rects) {
    if (!rects.length) return { x: 0, y: 0, w: 0, h: 0 };
    const xs = rects.map(r => r.x);
    const ys = rects.map(r => r.y);
    const maxX = Math.max(...rects.map(r => r.x + r.w));
    const maxY = Math.max(...rects.map(r => r.y + r.h));
    return { x: Math.min(...xs), y: Math.min(...ys), w: maxX - Math.min(...xs), h: maxY - Math.min(...ys) };
  }

  function placeRowAuto(row, polygon, obstacles, occupied, data, bounds) {
    const desiredCols = Math.max(1, Math.min(row.drawCols || row.panels || 1, row.panels || 1));
    const size = getPanelPlanSize(row, data);
    const gap = data.panelGapMm || 0;
    const step = Math.max(40, Math.round(Math.min(size.w, size.h) / 3));
    for (let cols = desiredCols; cols >= 1; cols--) {
      const rowsNeeded = Math.ceil(row.panels / cols);
      const groupW = cols * size.w + Math.max(0, cols - 1) * gap;
      const groupH = rowsNeeded * size.h + Math.max(0, rowsNeeded - 1) * gap;
      for (let y = bounds.minY + data.roofEdgeOffset; y <= bounds.maxY - groupH - data.roofEdgeOffset; y += step) {
        for (let x = bounds.minX + data.roofEdgeOffset; x <= bounds.maxX - groupW - data.roofEdgeOffset; x += step) {
          const rects = buildRowGridRects(row, x, y, cols, data);
          if (rects.every(rect => rectFits(rect, polygon, obstacles, occupied, data.roofEdgeOffset))) {
            return { ...row, valid: true, cols, rowsNeeded, originX: x, originY: y, rects, bbox: rectsBoundingBox(rects), modeLabel: 'auto', size };
          }
        }
      }
    }
    return {
      ...row,
      valid: false,
      cols: desiredCols,
      rowsNeeded: Math.ceil(row.panels / desiredCols),
      originX: row.drawX || 0,
      originY: row.drawY || 0,
      rects: buildRowGridRects(row, row.drawX || 0, row.drawY || 0, desiredCols, data),
      bbox: rectsBoundingBox(buildRowGridRects(row, row.drawX || 0, row.drawY || 0, desiredCols, data)),
      reason: 'Řada se do dostupné plochy střechy nevešla.',
      modeLabel: 'auto',
      size
    };
  }

  function computeRoofLayout(data) {
    const polygon = parseRoofPolygon(data.roofPolygon, data.roofWidth, data.roofHeight);
    const obstacles = parseRoofObstacles(data.roofObstacles);
    const bounds = polygonBounds(polygon);
    const occupied = [];
    const rows = [];
    const errors = [];
    data.rows.forEach((row, idx) => {
      let placed;
      if (row.layoutMode === 'manual') {
        const rects = buildRowGridRects(row, row.drawX || 0, row.drawY || 0, Math.max(1, row.drawCols || 1), data);
        const valid = rects.every(rect => rectFits(rect, polygon, obstacles, occupied, data.roofEdgeOffset));
        placed = {
          ...row,
          valid,
          cols: Math.max(1, row.drawCols || 1),
          rowsNeeded: Math.ceil(row.panels / Math.max(1, row.drawCols || 1)),
          originX: row.drawX || 0,
          originY: row.drawY || 0,
          rects,
          bbox: rectsBoundingBox(rects),
          reason: valid ? '' : 'Ruční umístění zasahuje mimo obrys střechy nebo do překážky.',
          modeLabel: 'manual',
          size: getPanelPlanSize(row, data)
        };
      } else {
        placed = placeRowAuto(row, polygon, obstacles, occupied, data, bounds);
      }
      if (placed.valid) occupied.push(...placed.rects);
      else errors.push(`${row.name || `Řada ${idx + 1}`}: ${placed.reason || 'umístění není validní'}`);
      rows.push(placed);
    });
    return { polygon, obstacles, bounds, rows, errors };
  }

  function validateProject(data = gatherData()) {
    const messages = [];
    if (!data.projectNumber) messages.push({ type: 'warn', text: 'Chybí číslo projektu.' });
    if (!data.investorName) messages.push({ type: 'warn', text: 'Chybí jméno investora.' });
    if (data.hasBattery && !data.batteryType) messages.push({ type: 'warn', text: 'Je zapnutá baterie, ale není vyplněn typ baterie.' });
    if (data.hasWallbox && !data.wallboxType) messages.push({ type: 'warn', text: 'Je zapnutý wallbox, ale není vyplněn typ wallboxu.' });
    const intakeTotalPanels = toNum(data.intake?.intakeTotalPanels);
    if (intakeTotalPanels && intakeTotalPanels !== data.totalPanels) messages.push({ type: 'warn', text: `Vstupní formulář uvádí ${fmt(intakeTotalPanels, 0)} panelů, ale projekt teď pracuje s ${fmt(data.totalPanels, 0)} ks.` });
    const intakeStringSum = (data.intake?.intakeStrings || []).reduce((sum, row) => sum + Math.max(0, toNum(row.panels)), 0);
    if (intakeTotalPanels && intakeStringSum && intakeTotalPanels !== intakeStringSum) messages.push({ type: 'warn', text: `Ve vstupním formuláři nesedí součet stringů (${fmt(intakeStringSum, 0)} ks) na celkový počet panelů (${fmt(intakeTotalPanels, 0)} ks).` });

    if (data.useSketchTrace && data.sketchPanels?.panelCount) {
      if (data.sketchPanels.panelCount !== data.totalPanels) {
        messages.push({ type: 'warn', text: `Nákres střechy obsahuje ${fmt(data.sketchPanels.panelCount, 0)} detekovaných panelů, ale projekt teď pracuje s ${fmt(data.totalPanels, 0)} ks.` });
      } else {
        messages.push({ type: 'ok', text: `Nákres střechy i projekt shodně pracují s ${fmt(data.totalPanels, 0)} panely.` });
      }
    }

    const layout = computeRoofLayout(data);
    if (!layout.errors.length) {
      messages.push({ type: 'ok', text: `Rozmístění ${fmt(data.totalPanels, 0)} panelů se vešlo do polygonu střechy.` });
    } else {
      layout.errors.forEach(err => messages.push({ type: 'error', text: err }));
    }
    if (!layout.obstacles.length) {
      messages.push({ type: 'warn', text: 'Nejsou zadané překážky střechy. Pokud tam jsou komíny, světlíky nebo výlezy, doplň je do vstupu.' });
    } else {
      messages.push({ type: 'ok', text: `Zadané překážky: ${layout.obstacles.map(o => o.name).join(', ')}.` });
    }
    messages.push({ type: 'ok', text: `Instalovaný výkon: ${fmt(data.installedPowerKw, 2)} kWp, počet řad: ${fmt(data.stringCount, 0)}.` });
    return { layout, messages };
  }

  function renderValidation(data = gatherData()) {
    const box = $('validationBox');
    if (!box) return;
    const result = validateProject(data);
    state.lastLayout = result.layout;
    state.lastValidation = result;
    box.innerHTML = result.messages.map(msg => `
      <div class="validation-item ${sanitize(msg.type)}">
        <div class="icon">${msg.type === 'ok' ? '✓' : (msg.type === 'warn' ? '!' : '×')}</div>
        <div>${sanitize(msg.text)}</div>
      </div>
    `).join('');
  }

  function renderLivePreview(data = gatherData()) {
    if ($('previewE03')) $('previewE03').innerHTML = makeE03Svg(data);
    if ($('previewE02')) $('previewE02').innerHTML = makeE02Svg(data);
  }

  function makePrompt(data) {
    const rowsText = data.rows.map((r, i) => (
      `${i + 1}. ${r.name}: ${r.panels} ks, azimut ${r.azimuth}°, sklon ${r.tilt}°, orientace ${r.drawOrientation === 'landscape' ? 'na šířku' : 'na výšku'}, režim ${r.layoutMode === 'manual' ? 'ruční' : 'auto'}`
    )).join('\n');
    return [
      `Vytvoř kompletní FVE projekt ve stylu Schlieger podle těchto vstupů:`,
      ``,
      `Číslo projektu: ${data.projectNumber}`,
      `Investor: ${data.investorName}`,
      `Místo stavby: ${data.siteAddress}`,
      `Typ objektu: ${data.buildingType}`,
      `Typ střechy: ${data.roofType}, povrch: ${data.roofSurface}, požární hodnocení: ${data.roofFire}`,
      `Rozměr střechy: ${data.roofWidth} × ${data.roofHeight} mm`,
      `Obrys střechy: ${data.roofPolygon || '-'}`,
      `Překážky: ${data.roofObstacles || 'bez zadaných překážek'}`,
      data.intake?.sketchNote ? `Poznámka k nákresu: ${data.intake.sketchNote}` : '',
      (data.intake?.intakeDistributor || data.intake?.intakeEan || data.intake?.intakeOm) ? `Legislativa / formulář: distributor ${data.intake.intakeDistributor || '-'}, EAN ${data.intake.intakeEan || '-'}, OM ${data.intake.intakeOm || '-'}` : '',
      ``,
      `Panely: ${data.panelManufacturer} ${data.panelType}, ${data.panelPower} Wp, ${data.totalPanels} ks, celkem ${fmt(data.installedPowerKw, 2)} kWp`,
      `Plocha panelů: ${fmt(data.totalArea, 2)} m²`,
      `Řady/stringy:\n${rowsText}`,
      ``,
      `Střídač: ${data.inverterManufacturer} ${data.inverterType}, ${data.inverterPhases}, počet ${data.inverterCount}`,
      `Baterie: ${data.hasBattery ? `${data.batteryType}, ${fmt(data.batteryCapacity, 2)} kWh` : 'bez baterie'}`,
      `Smartmeter: ${data.meterType}`,
      `Wallbox: ${data.hasWallbox ? `${data.wallboxType}, ${fmt(data.wallboxPower, 1)} kW, bodů ${data.evPoints}` : 'bez wallboxu'}`,
      `EPS: ${data.hasBackup ? `ano, ${data.backupLabel}` : 'ne'}`,
      ``,
      `Vygeneruj E-01 technickou zprávu, E-02 jednopolové schéma a E-03 zákres panelů do půdorysu střechy. Zachovej strukturu a styl firemního podkladu, u E-03 respektuj polygon střechy a překážky.`
    ].join('\n');
  }

  function generatePrompt() {
    $('promptBox').textContent = makePrompt(gatherData());
  }

  function drawingTitleBlockHtml(data, docCode, docTitle, pageFormat, scale = '', subtitle = '') {
    const issue = fmtMonthYear(data.issueDate);
    return `
      <table style="width:100%; border-collapse:collapse; font: 11px Arial, sans-serif; table-layout: fixed;">
        <colgroup>
          <col style="width:16%">
          <col style="width:31%">
          <col style="width:9%">
          <col style="width:8%">
          <col style="width:8%">
          <col style="width:7%">
          <col style="width:7%">
          <col style="width:14%">
        </colgroup>
        <tr>
          <td style="border:1px solid #000; padding:4px; height:48px; vertical-align:top; font-size:10px;">ZMĚNA<br>REVIZE</td>
          <td style="border:1px solid #000; padding:4px; font-size:10px; vertical-align:top;">${sanitize(subtitle || data.customHeaderNote || '')}</td>
          <td style="border:1px solid #000; padding:4px; font-size:10px;">DATUM<br>${sanitize(issue)}</td>
          <td style="border:1px solid #000; padding:4px; font-size:10px;">FORMÁT<br>${sanitize(pageFormat)}</td>
          <td style="border:1px solid #000; padding:4px; font-size:10px;">MĚŘÍTKO<br>${sanitize(scale || '-')}</td>
          <td style="border:1px solid #000; padding:4px; font-size:10px;">STUPEŇ<br>${sanitize(data.docPurpose)}</td>
          <td style="border:1px solid #000; padding:4px; font-size:10px;">PROF.<br>ELEKTRO</td>
          <td style="border:1px solid #000; padding:4px; font-size:10px;">ČÍSLO ZAKÁZKY<br>${sanitize(data.projectNumber)}</td>
        </tr>
        <tr>
          <td colspan="2" rowspan="2" style="border:1px solid #000; padding:6px;">
            <div style="font-size:10px; line-height:1.35;">
              <strong>${sanitize(data.companyName)}</strong><br>
              ${sanitize(data.companyAddress)}<br>
              IČ: ${sanitize(data.companyIc)}<br>
              E-mail: ${sanitize(data.companyEmail)}<br>
              Tel.: ${sanitize(data.companyPhone)}
            </div>
          </td>
          <td colspan="3" style="border:1px solid #000; padding:4px; font-size:10px;">ZODP. PROJEKTANT<br><strong>${sanitize(data.designerName)}</strong></td>
          <td colspan="2" style="border:1px solid #000; padding:4px; font-size:10px;">SPOLUPRACOVAL<br><strong>${sanitize(data.assistantName)}</strong></td>
          <td style="border:1px solid #000; padding:4px; font-size:10px;">Č. VÝKRESU<br><strong>${sanitize(docCode)}</strong></td>
        </tr>
        <tr>
          <td colspan="3" style="border:1px solid #000; padding:4px; font-size:10px;">MÍSTO STAVBY<br><strong>${sanitize(data.siteAddress)}</strong></td>
          <td colspan="3" style="border:1px solid #000; padding:4px; font-size:10px;">INVESTOR<br><strong>${sanitize(data.investorName)}</strong></td>
        </tr>
        <tr>
          <td colspan="5" style="border:1px solid #000; padding:6px 6px 8px;">
            <div style="font-size:10px; margin-bottom:3px;">NÁZEV STAVBY</div>
            <div style="font-size:14px; font-weight:700;">${sanitize(data.buildingType)} – FVE</div>
          </td>
          <td colspan="3" style="border:1px solid #000; padding:6px 6px 8px;">
            <div style="font-size:10px; margin-bottom:3px;">NÁZEV VÝKRESU</div>
            <div style="font-size:14px; font-weight:700;">${sanitize(docTitle)}</div>
          </td>
        </tr>
      </table>`;
  }

  function openHtmlDoc(html) {
    const win = window.open('', '_blank');
    if (!win) {
      alert('Prohlížeč zablokoval nové okno. Povol otevírání oken pro tuto stránku.');
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  function downloadText(filename, content, mime = 'text/html;charset=utf-8') {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000);
  }

  function extractBulletLines(text) {
    return String(text || '')
      .split(/\n+/)
      .map(s => s.replace(/^\s*[-•]\s*/, '').trim())
      .filter(Boolean);
  }

  function makeE01Html(data) {
    const rowSummary = data.rows.map((r, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${sanitize(r.name)}</td>
        <td>${fmt(r.panels, 0)}</td>
        <td>${fmt(r.azimuth, 0)}°</td>
        <td>${fmt(r.tilt, 0)}°</td>
        <td>${r.drawOrientation === 'landscape' ? 'Na šířku' : 'Na výšku'}</td>
      </tr>
    `).join('');

    const e01Styles = `
      @page { size: A4; margin: 14mm; }
      body { font-family: Arial, Helvetica, sans-serif; color:#111; margin:0; }
      .page { page-break-after: always; min-height: 257mm; position: relative; }
      .page:last-child { page-break-after: auto; }
      .cover { display:flex; flex-direction:column; min-height:257mm; }
      .cover-top { padding-top: 14mm; }
      .cover-mid { flex:1; display:flex; flex-direction:column; justify-content:center; }
      .cover h1 { font-size: 22px; margin: 0 0 10px; }
      .cover h2 { font-size: 42px; margin: 0 0 6px; letter-spacing: 0.02em; }
      .cover .sub { color:#444; font-size:15px; }
      .meta { display:grid; grid-template-columns: 1fr 1fr; gap:18px; margin-top:22px; }
      .meta-box { border:1px solid #000; padding:10px 12px; min-height:92px; }
      .meta-box .k { font-size: 11px; color:#444; text-transform: uppercase; margin-bottom:6px; }
      .meta-box .v { font-size: 14px; line-height:1.45; }
      .section-title { font-size: 19px; font-weight:700; margin: 0 0 10px; padding-bottom: 6px; border-bottom: 2px solid #000; }
      .sub-title { font-size: 15px; font-weight:700; margin: 18px 0 8px; }
      p { margin: 0 0 10px; line-height: 1.5; font-size: 12px; }
      ul { margin: 8px 0 12px 18px; padding: 0; }
      li { font-size: 12px; line-height: 1.45; margin-bottom: 4px; }
      table { width:100%; border-collapse:collapse; }
      th, td { border:1px solid #000; padding:6px 7px; font-size:11px; text-align:left; vertical-align:top; }
      th { background:#f2f2f2; }
      .small { font-size:11px; }
      .sigline { margin-top: 26px; display:grid; grid-template-columns: 1fr 1fr; gap:22px; align-items:end; }
      .sigbox { padding-top: 36px; border-top:1px solid #000; font-size:11px; }
    `;

    return `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<title>${sanitize(data.projectNumber)}_E-01_Technicka_zprava</title>
<style>${e01Styles}</style>
</head>
<body>
  <div class="page cover">
    <div class="cover-top">${standardLogoHtml(data)}</div>
    <div class="cover-mid">
      <div style="font-size:18px; font-weight:700; margin-bottom:6px;">${sanitize(data.companyName)}</div>
      <h1>PROJEKTOVÁ DOKUMENTACE</h1>
      <h2>FOTOVOLTAICKÁ ELEKTRÁRNA</h2>
      <div class="sub">${sanitize(data.customHeaderNote || 'Fotovoltaická elektrárna pro vlastní spotřebu')}</div>

      <div class="meta">
        <div class="meta-box">
          <div class="k">Investor</div>
          <div class="v">${sanitize(data.investorName)}<br>${sanitize(data.siteAddress)}</div>
        </div>
        <div class="meta-box">
          <div class="k">Údaje o projektu</div>
          <div class="v">Číslo projektu: ${sanitize(data.projectNumber)}<br>Datum: ${sanitize(fmtDateCz(data.issueDate))}<br>Stupeň: ${sanitize(data.docPurpose)}</div>
        </div>
        <div class="meta-box">
          <div class="k">Objekt</div>
          <div class="v">${sanitize(data.buildingType)}<br>Katastrální území: ${sanitize(data.cadastralArea)}<br>Parcela: ${sanitize(data.parcelNumber)}<br>LV: ${sanitize(data.lvNumber)}</div>
        </div>
        <div class="meta-box">
          <div class="k">Zhotovitel / projektant</div>
          <div class="v">${sanitize(data.designerName)}<br>${sanitize(data.designerCert)}<br>${sanitize(data.companyEmail)}<br>${sanitize(data.companyPhone)}</div>
        </div>
      </div>
    </div>
    <div style="font-size:11px; color:#444;">${sanitize(data.companyAddress)}</div>
  </div>

  <div class="page">
    <div class="section-title">E-01 Technická zpráva</div>

    <div class="sub-title">1. Identifikační údaje</div>
    <table>
      <tr><th style="width:32%;">Položka</th><th>Údaj</th></tr>
      <tr><td>Název stavby</td><td>${sanitize(data.buildingType)} – fotovoltaická elektrárna</td></tr>
      <tr><td>Místo stavby</td><td>${sanitize(data.siteAddress)}</td></tr>
      <tr><td>Investor</td><td>${sanitize(data.investorName)}</td></tr>
      <tr><td>Číslo projektu</td><td>${sanitize(data.projectNumber)}</td></tr>
      <tr><td>Datum vypracování</td><td>${sanitize(fmtDateCz(data.issueDate))}</td></tr>
      <tr><td>Stupeň dokumentace</td><td>${sanitize(data.docPurpose)}</td></tr>
      <tr><td>Zhotovitel</td><td>${sanitize(data.companyName)}, ${sanitize(data.companyAddress)}</td></tr>
      <tr><td>Zodpovědný projektant</td><td>${sanitize(data.designerName)}, ${sanitize(data.designerCert)}</td></tr>
    </table>

    <div class="sub-title">2. Základní technický popis</div>
    <p>${sanitize(data.buildingDescription)}</p>
    <p>Navržená FVE je určena pro ${sanitize(data.connectionType.toLowerCase())}. Instalovaný výkon FV pole je <strong>${fmt(data.installedPowerKw, 2)} kWp</strong> při celkovém počtu <strong>${fmt(data.totalPanels, 0)} ks</strong> panelů typu <strong>${sanitize(data.panelManufacturer)} ${sanitize(data.panelType)}</strong>. Celková plocha FV pole je přibližně <strong>${fmt(data.totalArea, 2)} m²</strong>.</p>
    <p>Výroba elektrické energie je zpracována prostřednictvím střídače <strong>${sanitize(data.inverterManufacturer)} ${sanitize(data.inverterType)}</strong> (${sanitize(data.inverterPhases)}, počet ${fmt(data.inverterCount, 0)} ks). ${data.hasBattery ? `Součástí sestavy je akumulace typu <strong>${sanitize(data.batteryType)}</strong> s kapacitou <strong>${fmt(data.batteryCapacity, 2)} kWh</strong>.` : 'Systém je bez bateriového úložiště.'} ${data.hasWallbox ? `Součástí projektu je také wallbox <strong>${sanitize(data.wallboxType)}</strong> o výkonu <strong>${fmt(data.wallboxPower, 1)} kW</strong>.` : ''}</p>

    <div class="sub-title">3. Popis objektu a umístění technologie</div>
    <p>Objekt je klasifikován jako <strong>${sanitize(data.buildingType)}</strong>, počet nadzemních podlaží: <strong>${sanitize(data.floors)}</strong>. Typ střechy: <strong>${sanitize(data.roofType)}</strong>, povrch střechy: <strong>${sanitize(data.roofSurface)}</strong>. Požární hodnocení povrchu střechy: <strong>${sanitize(data.roofFire)}</strong>. Zdroj vytápění objektu: <strong>${sanitize(data.heatingSource)}</strong>, zdroj přípravy TV: <strong>${sanitize(data.hotWaterSource)}</strong>.</p>
    <p>Technologie FVE bude umístěna v prostoru: <strong>${sanitize(data.technicalRoom)}</strong>. Připojení na vnitřní rozvod bude provedeno v rozvaděči <strong>${sanitize(data.mainBoard)}</strong>. Distribuční měření je v rozvaděči <strong>${sanitize(data.meterBoard)}</strong>. ${data.hasWallbox ? `Nabíjecí stanice je umístěna v prostoru: <strong>${sanitize(data.wallboxPlace)}</strong>.` : ''}</p>

    <div class="sub-title">4. Přehled FV pole</div>
    <table>
      <tr>
        <th>#</th>
        <th>Řada</th>
        <th>Počet panelů</th>
        <th>Azimut</th>
        <th>Sklon</th>
        <th>Orientace v E-03</th>
      </tr>
      ${rowSummary}
    </table>

    <div class="sub-title">5. Komponenty systému</div>
    <table>
      <tr><th style="width:32%;">Prvek</th><th>Specifikace</th></tr>
      <tr><td>FV panel</td><td>${sanitize(data.panelManufacturer)} ${sanitize(data.panelType)}, ${fmt(data.panelPower, 0)} Wp, SVT ${sanitize(data.panelSvt)}</td></tr>
      <tr><td>Střídač</td><td>${sanitize(data.inverterManufacturer)} ${sanitize(data.inverterType)}, ${sanitize(data.inverterPhases)}, SVT ${sanitize(data.inverterSvt)}</td></tr>
      <tr><td>Bateriové úložiště</td><td>${data.hasBattery ? `${sanitize(data.batteryType)}, ${fmt(data.batteryCapacity, 2)} kWh` : 'Není součástí'}</td></tr>
      <tr><td>Smartmeter / měření</td><td>${sanitize(data.meterType)}</td></tr>
      <tr><td>Wallbox</td><td>${data.hasWallbox ? `${sanitize(data.wallboxType)}, ${fmt(data.wallboxPower, 1)} kW, bodů ${fmt(data.evPoints, 0)}` : 'Není součástí'}</td></tr>
      <tr><td>DC kabely / ochrany</td><td>${sanitize(data.dcCable)}; ${sanitize(data.dcProtection)}</td></tr>
      <tr><td>AC kabely / ochrany</td><td>${sanitize(data.acCable)}; ${sanitize(data.acProtection)}</td></tr>
      <tr><td>Datové propojení</td><td>${sanitize(data.utpCable)}</td></tr>
    </table>
  </div>

  <div class="page">
    <div class="section-title">E-01 Technická zpráva – pokračování</div>

    <div class="sub-title">6. Elektrické zapojení a provoz</div>
    <p>Schéma zapojení je řešeno v samostatném výkresu E-02. FV moduly jsou sdruženy do ${fmt(data.stringCount, 0)} stringů / řad. Stejnosměrná strana je vedena do ochranné a odpojovací části a následně do střídače. Na střídavé straně je střídač připojen přes příslušné ochrany do hlavního rozvaděče objektu. Měření toku energie je zajištěno prvkem <strong>${sanitize(data.meterType)}</strong>. ${data.hasExportToGrid ? 'Systém uvažuje přetoky do distribuční soustavy dle nastavení zařízení a schválených podmínek připojení.' : 'Systém je koncipován bez přetoků do distribuční sítě.'}</p>
    ${data.hasBackup ? `<p>Projekt uvažuje zálohovanou větev / EPS označenou jako <strong>${sanitize(data.backupLabel)}</strong>. Rozsah zálohovaných okruhů musí být před realizací upřesněn.</p>` : ''}

    <div class="sub-title">7. Požadavky na montáž a ochrany</div>
    <ul>
      <li>Kabelové trasy musí být provedeny v souladu s ČSN a pokyny výrobce použitých zařízení.</li>
      <li>Veškeré kovové části musí být řešeny z hlediska ochrany před úrazem elektrickým proudem a z hlediska přepětí.</li>
      <li>${sanitize(data.lightning)}.</li>
      <li>${sanitize(data.executionNotes)}</li>
      <li>${sanitize(data.electricalNotes)}</li>
    </ul>

    <div class="sub-title">8. Nastavení ochran a provozní poznámky</div>
    <ul>
      ${extractBulletLines(data.protectionSettings).map(line => `<li>${sanitize(line)}</li>`).join('')}
    </ul>

    <div class="sub-title">9. Závěr</div>
    <p>Tento dokument slouží jako projektový podklad pro instalaci FVE na objektu investora. Před realizací je nutné ověřit skutečný stav objektu, koordinovat průchody a trasy na místě, potvrdit dostupnost technologií, ověřit nastavení ochran dle aktuálních požadavků distributora a zkontrolovat technické limity všech použitých komponent.</p>

    <div class="sigline">
      <div class="sigbox">Vypracoval: ${sanitize(data.designerName)}</div>
      <div class="sigbox">Datum: ${sanitize(fmtDateCz(data.issueDate))}</div>
    </div>
  </div>
</body>
</html>`;
  }

  function svgLines(lines, x, y, opts = {}) {
    const anchor = opts.anchor || 'middle';
    const fontSize = opts.fontSize || 11;
    const lineHeight = opts.lineHeight || 14;
    const fontWeight = opts.fontWeight || '400';
    const fill = opts.fill || '#111';
    return lines.map((line, i) => `<text x="${x}" y="${y + i * lineHeight}" font-family="Arial" font-size="${fontSize}" text-anchor="${anchor}" font-weight="${fontWeight}" fill="${fill}">${sanitize(line || ' ')}</text>`).join('');
  }

  function svgBox(x, y, w, h, title, body, opts = {}) {
    const maxChars = opts.maxChars || Math.max(14, Math.floor(w / 7.4));
    const bodyLines = Array.isArray(body) ? body : wrapTextToLines(body, maxChars);
    const fill = opts.fill || '#fff';
    const stroke = opts.stroke || '#1b2430';
    const titleSize = opts.titleSize || 13;
    const bodySize = opts.bodySize || 11;
    const anchor = opts.align === 'start' ? 'start' : 'middle';
    const tx = anchor === 'start' ? x + 10 : x + w / 2;
    return `
      <g>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${opts.rx || 10}" fill="${fill}" stroke="${stroke}" stroke-width="${opts.strokeWidth || 1.6}" ${opts.dashed ? 'stroke-dasharray="7 5"' : ''}/>
        ${title ? `<text x="${anchor === 'start' ? x + 10 : x + w/2}" y="${y + 20}" font-family="Arial" font-size="${titleSize}" text-anchor="${anchor}" font-weight="700" fill="#0f1728">${sanitize(title)}</text>` : ''}
        ${svgLines(bodyLines, tx, y + (title ? 40 : 22), { anchor, fontSize: bodySize, lineHeight: opts.lineHeight || 14, fill: opts.bodyFill || '#243246' })}
      </g>`;
  }

  function e02InvestorSurname(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    return parts.length ? parts[parts.length - 1] : '';
  }

  function e02ProjectLabel(data) {
    const addrParts = String(data.siteAddress || '').split(',').map(v => v.trim()).filter(Boolean);
    const town = String(data.siteTown || '').trim() || (addrParts.length ? addrParts[addrParts.length - 1] : '');
    const surname = e02InvestorSurname(data.investorName);
    return `HFVE ${sanitize(town)}${surname ? ` - ${sanitize(surname)}` : ''}`.trim();
  }

  function e02TitleLines(data) {
    const lines = ['JEDNOPÓLOVÉ SCHÉMA ZAPOJENÍ'];
    lines.push(data.hasBattery ? 'FOTOVOLTAICKÉ ELEKTRÁRNY S AKUMULACÍ' : 'FOTOVOLTAICKÉ ELEKTRÁRNY');
    if (data.hasBattery && data.hasWallbox) lines.push('DO BATERIE A NABÍJECÍ STANICÍ PRO RD');
    else if (data.hasBattery) lines.push('DO BATERIE PRO RD');
    else if (data.hasWallbox) lines.push('S NABÍJECÍ STANICÍ PRO RD');
    else lines.push('PRO RODINNÝ DŮM');
    return lines;
  }

  function e02ProtectionRows() {
    return [
      ['napětí 1. stupeň', '3 sec.', '230 V + 10%'],
      ['napětí 2. stupeň', '1 sec.', '230 V + 15%'],
      ['napětí 3. stupeň', '0,1 sec.', '230 V + 20%'],
      ['podpětí', '1,5 sec.', '230 V - 15%'],
      ['nadfrekvence', '0,5 sec.', '50 Hz + 4%'],
      ['podfrekvence', '0,5 sec.', '50 Hz - 5%']
    ];
  }

  function makeE02TitleBlockSvg(data, x, y, w, h) {
    const topH = 34;
    const leftW = 372;
    const rightW = w - leftW;
    const titleH = 92;
    const infoY = y + topH + titleH;
    const infoH = h - topH - titleH;
    const col1 = 148;
    const col2 = 150;
    const rightSplit = 94;
    const rightRows = [28, 54, 44, 34, h - topH - 28 - 54 - 44 - 34];
    const titleSvg = svgLines(e02TitleLines(data), x + leftW / 2, y + topH + 36, { anchor: 'middle', fontSize: 11, lineHeight: 22, fontWeight: '700' });
    const investorLines = wrapTextToLines(`${data.investorName}
${data.siteAddress}`, 20).slice(0, 6);
    const companyLines = wrapTextToLines(`${data.companyName}
${data.companyAddress}
IČ: ${data.companyIc}
kontakt: ${data.companyPhone}, ${data.companyEmail}`, 24).slice(0, 7);
    const siteLines = wrapTextToLines(`MÍSTO INSTALACE
${data.siteAddress}`, 20).slice(0, 6);
    const certLines = wrapTextToLines(`${data.designerName}
${data.companyName}
${data.designerCert}`, 18).slice(0, 5);
    const assistLines = wrapTextToLines(`${data.assistantName}
${data.assistantEmail}
${data.companyName}`, 18).slice(0, 4);

    let curY = y + topH;
    const rightRowBoundaries = rightRows.map(v => { curY += v; return curY; });

    return `
      <g>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#000" stroke-width="1"/>
        <line x1="${x}" y1="${y + topH}" x2="${x + w}" y2="${y + topH}" stroke="#000" stroke-width="1"/>
        <line x1="${x + leftW}" y1="${y + topH}" x2="${x + leftW}" y2="${y + h}" stroke="#000" stroke-width="1"/>
        <line x1="${x}" y1="${y + topH + titleH}" x2="${x + leftW}" y2="${y + topH + titleH}" stroke="#000" stroke-width="1"/>
        <line x1="${x + col1}" y1="${infoY}" x2="${x + col1}" y2="${y + h}" stroke="#000" stroke-width="1"/>
        <line x1="${x + col1 + col2}" y1="${infoY}" x2="${x + col1 + col2}" y2="${y + h}" stroke="#000" stroke-width="1"/>
        <line x1="${x + leftW + rightSplit}" y1="${y + topH}" x2="${x + leftW + rightSplit}" y2="${y + h}" stroke="#000" stroke-width="1"/>
        ${rightRowBoundaries.map(v => `<line x1="${x + leftW}" y1="${v}" x2="${x + w}" y2="${v}" stroke="#000" stroke-width="1"/>`).join('')}

        <text x="${x + 6}" y="${y + 13}" font-family="Arial" font-size="8" font-weight="700">PROSTOR VYHRAZENÝ PRO KLIENTSKÉ ZMĚNY:</text>
        <text x="${x + 6}" y="${y + 27}" font-family="Arial" font-size="8" font-weight="700">ZMĚNA Č.1:</text>
        <text x="${x + 6}" y="${y + topH + 12}" font-family="Arial" font-size="8" font-weight="700">NÁZEV</text>
        ${titleSvg}

        <text x="${x + 6}" y="${infoY + 12}" font-family="Arial" font-size="8" font-weight="700">ČÁST DOKUMENTACE</text>
        <text x="${x + 6}" y="${infoY + 26}" font-family="Arial" font-size="8" font-weight="700">${sanitize((data.docPurpose || 'PROJEKT').toUpperCase())}:</text>
        <text x="${x + 6}" y="${infoY + 40}" font-family="Arial" font-size="8" font-weight="700">ELEKTROINSTALACE</text>
        <text x="${x + 6}" y="${infoY + 58}" font-family="Arial" font-size="8" font-weight="700">INVESTOR</text>
        ${svgLines(investorLines, x + 6, infoY + 72, { anchor: 'start', fontSize: 8.4, lineHeight: 11, fontWeight: '700' })}
        ${svgLines(companyLines, x + col1 + 6, infoY + 18, { anchor: 'start', fontSize: 8.4, lineHeight: 11, fontWeight: '700' })}
        ${svgLines(siteLines, x + col1 + col2 + 6, infoY + 18, { anchor: 'start', fontSize: 8.4, lineHeight: 11, fontWeight: '700' })}

        <text x="${x + leftW + 6}" y="${y + topH + 12}" font-family="Arial" font-size="8" font-weight="700">ČÍSLO PARÉ:</text>
        <text x="${x + leftW + 6}" y="${y + topH + 23}" font-family="Arial" font-size="8.4" font-weight="700">01</text>
        <text x="${x + leftW + rightSplit + 6}" y="${y + topH + 12}" font-family="Arial" font-size="8" font-weight="700">FORMÁT:</text>
        <text x="${x + leftW + rightSplit + 6}" y="${y + topH + 23}" font-family="Arial" font-size="8.4" font-weight="700">A4</text>

        <text x="${x + leftW + 6}" y="${y + topH + rightRows[0] + 12}" font-family="Arial" font-size="8" font-weight="700">ZODPOVĚDNÝ PROJEKTANT:</text>
        ${svgLines(certLines, x + leftW + 6, y + topH + rightRows[0] + 24, { anchor: 'start', fontSize: 8.3, lineHeight: 11, fontWeight: '700' })}

        <text x="${x + leftW + 6}" y="${y + topH + rightRows[0] + rightRows[1] + 12}" font-family="Arial" font-size="8" font-weight="700">SPOLUPRACOVAL:</text>
        ${svgLines(assistLines, x + leftW + 6, y + topH + rightRows[0] + rightRows[1] + 24, { anchor: 'start', fontSize: 8.3, lineHeight: 11, fontWeight: '700' })}

        <text x="${x + leftW + 6}" y="${y + topH + rightRows[0] + rightRows[1] + rightRows[2] + 12}" font-family="Arial" font-size="8" font-weight="700">DATUM VYPRACOVÁNÍ:</text>
        <text x="${x + leftW + 6}" y="${y + topH + rightRows[0] + rightRows[1] + rightRows[2] + 24}" font-family="Arial" font-size="8.4" font-weight="700">${sanitize(fmtMonthYear(data.issueDate))}</text>
        <text x="${x + leftW + rightSplit + 6}" y="${y + topH + rightRows[0] + rightRows[1] + rightRows[2] + 12}" font-family="Arial" font-size="8" font-weight="700">ČÍSLO PROJEKTU:</text>
        <text x="${x + leftW + rightSplit + 6}" y="${y + topH + rightRows[0] + rightRows[1] + rightRows[2] + 24}" font-family="Arial" font-size="8.4" font-weight="700">${sanitize(data.projectNumber)}</text>

        <text x="${x + leftW + 6}" y="${y + h - 12}" font-family="Arial" font-size="8" font-weight="700">VÝKRESOVÁ ČÁST:</text>
        <text x="${x + leftW + 6}" y="${y + h - 2}" font-family="Arial" font-size="8.4" font-weight="700">E-02</text>
        <text x="${x + leftW + rightSplit + 6}" y="${y + h - 12}" font-family="Arial" font-size="8" font-weight="700">MĚŘÍTKO:</text>
        <text x="${x + leftW + rightSplit + 6}" y="${y + h - 2}" font-family="Arial" font-size="8.4" font-weight="700">-</text>
      </g>`;
  }

  function makeE02Svg(data) {
    const viewW = 1123;
    const viewH = 794;
    const outerX = 12;
    const outerY = 12;
    const outerW = viewW - 24;
    const outerH = viewH - 24;

    const routeX = 40;
    const routeY = 26;
    const protX = 486;
    const protY = 24;
    const protW = 208;
    const compX = 712;
    const compY = 20;
    const compW = 362;

    const stringStartX = 58;
    const stringStartY = 152;
    const stringGap = 7;
    const maxStringRegionH = 112;
    const stringBoxH = Math.max(24, Math.min(38, (maxStringRegionH - Math.max(0, data.rows.length - 1) * stringGap) / Math.max(1, data.rows.length)));
    const stringBoxW = 214;
    const busX = 292;
    const busBottomY = 318;

    const rdcZone = { x: 70, y: 246, w: 246, h: 154 };
    const dcBox = { x: 244, y: 288, w: 50, h: 62 };
    const invZone = { x: 388, y: 258, w: 138, h: data.hasBattery ? 188 : 116 };
    const inverter = { x: 404, y: 284, w: 106, h: 74 };
    const battery = { x: 418, y: 386, w: 78, h: 44 };
    const racZone = { x: 542, y: 270, w: 182, h: 138 };
    const racBox = { x: 564, y: 314, w: 122, h: 44 };
    const rhZone = { x: 742, y: 266, w: 228, h: data.hasWallbox ? 118 : 96 };
    const rhBox = { x: 770, y: 318, w: 116, h: 44 };
    const smartBox = { x: 826, y: 278, w: 76, h: 28 };
    const reZone = { x: 976, y: 272, w: 126, h: 176 };
    const meterBox = { x: 1004, y: 318, w: 50, h: 42 };
    const hdoBox = { x: 1064, y: 332, w: 20, h: 24 };
    const dsX = 1029;
    const dsBusY = 448;
    const dsBottomY = 522;
    const dsBox = { x: 1018, y: 522, w: 22, h: 34 };
    const wallZone = { x: 500, y: 138, w: 126, h: 92 };
    const wallBox = { x: 522, y: 160, w: 82, h: 50 };
    const epsBox = { x: 546, y: 412, w: 138, h: 44 };
    const notesX = 30;
    const notesY = 464;
    const notesW = 506;
    const protectionBox = { x: notesX, y: notesY, w: notesW, h: 88 };
    const noteBox = { x: notesX, y: 558, w: notesW, h: 204 };
    const voltageBox = { x: 548, y: 464, w: 166, h: 74 };
    const titleX = 560;
    const titleY = 548;
    const titleW = 530;
    const titleH = 214;

    const routeLines = wrapTextToLines(data.routeDescription, 84).slice(0, 6);
    const protectionRows = e02ProtectionRows();

    const perStringText = data.rows.length === 1
      ? `${fmt(data.rows[0].panels, 0)} ks`
      : data.rows.map((row, idx) => `R${idx + 1}: ${fmt(row.panels, 0)} ks`).join(', ');

    const componentRows = [
      { section: true, left: 'Fotovoltaické panely', right: '' },
      { left: 'Výrobce:', right: data.panelManufacturer },
      { left: 'Typ:', right: data.panelType },
      { left: 'Počet stringů:', right: `${fmt(data.stringCount, 0)} ks` },
      { left: 'Počet panelů/string:', right: perStringText },
      { left: 'Celkem panelů:', right: `${fmt(data.totalPanels, 0)} ks` },
      { left: 'Napětí panelu:', right: `${fmt(data.panelVoltage, 0)} V` },
      { left: 'Výkon panelu:', right: `${fmt(data.panelPower, 0)} Wp` },
      { left: 'Celkový výkon:', right: `${fmt(data.installedPowerWp, 0)} Wp` },
      { left: 'Typ připojení:', right: data.connectionType },
      { section: true, left: 'Střídač', right: '' },
      { left: 'Výrobce:', right: data.inverterManufacturer },
      { left: 'Typ:', right: `${data.inverterType}, ${data.inverterPhases}` },
      { left: 'Počet střídačů:', right: `${fmt(data.inverterCount, 0)} ks` },
      { left: 'Baterie:', right: data.hasBattery ? data.batteryType : 'bez baterie' },
      { left: 'Wallbox:', right: data.hasWallbox ? data.wallboxType : 'bez wallboxu' }
    ];

    let compSvg = `
      <rect x="${compX}" y="${compY}" width="${compW}" height="188" fill="#fff" stroke="#000" stroke-width="1"/>
      <line x1="${compX}" y1="${compY + 16}" x2="${compX + compW}" y2="${compY + 16}" stroke="#000" stroke-width="1"/>
      <text x="${compX + compW / 2}" y="${compY + 12}" font-family="Arial" font-size="8.5" text-anchor="middle" font-weight="700">${e02ProjectLabel(data)}</text>`;
    let compYCursor = compY + 16;
    const compSplitX = compX + 145;
    componentRows.forEach(row => {
      const leftLines = row.section ? [row.left] : wrapTextToLines(row.left, 19);
      const rightLines = row.section ? [''] : wrapTextToLines(row.right, 33);
      const lineCount = Math.max(leftLines.length, rightLines.length);
      const rowH = row.section ? 16 : Math.max(14, 4 + lineCount * 10);
      compSvg += `<line x1="${compX}" y1="${compYCursor + rowH}" x2="${compX + compW}" y2="${compYCursor + rowH}" stroke="#000" stroke-width="1"/>`;
      compSvg += `<line x1="${compSplitX}" y1="${compYCursor}" x2="${compSplitX}" y2="${compYCursor + rowH}" stroke="#000" stroke-width="1"/>`;
      if (row.section) {
        compSvg += `<text x="${compX + 4}" y="${compYCursor + 11}" font-family="Arial" font-size="8.5" font-weight="700">${sanitize(row.left)}</text>`;
      } else {
        compSvg += svgLines(leftLines, compX + 4, compYCursor + 10, { anchor: 'start', fontSize: 8, lineHeight: 10, fontWeight: '700' });
        compSvg += svgLines(rightLines, compSplitX + 4, compYCursor + 10, { anchor: 'start', fontSize: 8, lineHeight: 10 });
      }
      compYCursor += rowH;
    });

    let stringsSvg = '';
    let joinSvg = '';
    let topBusY = stringStartY + stringBoxH / 2;
    data.rows.forEach((row, i) => {
      const y = stringStartY + i * (stringBoxH + stringGap);
      const midY = y + stringBoxH / 2;
      if (i === 0) topBusY = midY;
      const pwr = `${fmt((row.panels * data.panelPower) / 1000, 2)} kWp`;
      const lineA = wrapTextToLines(`${fmt(row.panels, 0)}x ${data.panelManufacturer} ${data.panelType}`, 34)[0] || '';
      const lineB = wrapTextToLines(`${pwr} • azimut ${fmt(row.azimuth, 0)}° • sklon ${fmt(row.tilt, 0)}°`, 42)[0] || '';
      stringsSvg += `
        <g>
          <rect x="${stringStartX}" y="${y}" width="${stringBoxW}" height="${stringBoxH}" fill="#fff" stroke="#000" stroke-width="1"/>
          <circle cx="${stringStartX}" cy="${midY}" r="3" fill="#000"/>
          <circle cx="${stringStartX + stringBoxW}" cy="${midY}" r="3" fill="#000"/>
          <text x="${stringStartX + 6}" y="${y + 11}" font-family="Arial" font-size="8.5" font-weight="700">${sanitize(row.name || `ŘADA ${i + 1}`)}</text>
          <text x="${stringStartX + 12}" y="${y + 23}" font-family="Arial" font-size="7.2">${sanitize(lineA)}</text>
          <text x="${stringStartX + 12}" y="${y + Math.max(34, stringBoxH - 7)}" font-family="Arial" font-size="7.2">${sanitize(lineB)}</text>
          <text x="${stringStartX + 4}" y="${midY - 6}" font-family="Arial" font-size="7">(-)</text>
          <text x="${stringStartX + stringBoxW - 14}" y="${midY - 6}" font-family="Arial" font-size="7">(+)</text>
        </g>`;
      joinSvg += `
        <line x1="${stringStartX + stringBoxW}" y1="${midY}" x2="${busX}" y2="${midY}" stroke="#000" stroke-width="1.2"/>
        <line x1="${busX}" y1="${midY}" x2="${busX}" y2="${busBottomY}" stroke="#000" stroke-width="1.2"/>`;
    });

    const inverterBody = [
      wrapTextToLines(data.inverterManufacturer, 15)[0] || '',
      wrapTextToLines(data.inverterType, 15)[0] || '',
      `${data.inverterPhases}, ${fmt(data.inverterCount, 0)} ks`
    ];
    const batteryLines = data.hasBattery ? wrapTextToLines(data.batteryType, 15).slice(0, 2) : [];
    const wallboxLines = data.hasWallbox ? wrapTextToLines(data.wallboxType, 16).slice(0, 2) : [];
    const acPhaseText = data.inverterPhases === '1f'
      ? '1 + PE + N, 230 V, 50 Hz / TN-S'
      : '3 + PE + N, 3x 400/230 V, 50 Hz / TN-S';
    const maxDc = Math.max.apply(null, data.rows.map(row => row.panels * data.panelVoltage).concat([0]));
    const protectionNoteLines = wrapTextToLines(data.protectionSettings, 82).slice(0, 4);
    const noteLines = wrapTextToLines(data.electricalNotes, 84).slice(0, 8);
    const executionLines = wrapTextToLines(data.executionNotes, 84).slice(0, 5);
    const voltageLines = [
      'Napěťová soustava:',
      `DC: max. string ${fmt(maxDc, 0)} V`,
      acPhaseText,
      data.hasExportToGrid ? 'Systém s možností přetoků do DS.' : 'Systém bez přetoků do DS.'
    ];

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewW} ${viewH}" width="100%" height="${viewH}">
        <rect x="0.5" y="0.5" width="${viewW - 1}" height="${viewH - 1}" fill="#fff" stroke="#000" stroke-width="1"/>
        <rect x="${outerX}" y="${outerY}" width="${outerW}" height="${outerH}" fill="none" stroke="#000" stroke-width="1"/>

        <text x="${routeX}" y="${routeY}" font-family="Arial" font-size="9.5" font-weight="700">Popis trasy</text>
        ${svgLines(routeLines, routeX, routeY + 15, { anchor: 'start', fontSize: 8, lineHeight: 11 })}

        <rect x="${protX}" y="${protY}" width="${protW}" height="110" fill="#fff" stroke="#000" stroke-width="1"/>
        <line x1="${protX}" y1="${protY + 18}" x2="${protX + protW}" y2="${protY + 18}" stroke="#000" stroke-width="1"/>
        <line x1="${protX + 96}" y1="${protY + 18}" x2="${protX + 96}" y2="${protY + 110}" stroke="#000" stroke-width="1"/>
        <line x1="${protX + 150}" y1="${protY + 18}" x2="${protX + 150}" y2="${protY + 110}" stroke="#000" stroke-width="1"/>
        <text x="${protX + protW / 2}" y="${protY + 13}" font-family="Arial" font-size="8.5" text-anchor="middle" font-weight="700">Nastavení ochran</text>
        <text x="${protX + 123}" y="${protY + 30}" font-family="Arial" font-size="7" text-anchor="middle">Maximální</text>
        <text x="${protX + 123}" y="${protY + 39}" font-family="Arial" font-size="7" text-anchor="middle">vypínací čas [s]</text>
        <text x="${protX + 179}" y="${protY + 30}" font-family="Arial" font-size="7" text-anchor="middle">Nastavení</text>
        <text x="${protX + 179}" y="${protY + 39}" font-family="Arial" font-size="7" text-anchor="middle">pro vypnutí</text>
        ${protectionRows.map((row, i) => {
          const y = protY + 42 + i * 11;
          return `
            <g>
              <line x1="${protX}" y1="${y}" x2="${protX + protW}" y2="${y}" stroke="#000" stroke-width="1"/>
              <text x="${protX + 4}" y="${y + 8}" font-family="Arial" font-size="7">${sanitize(row[0])}</text>
              <text x="${protX + 123}" y="${y + 8}" font-family="Arial" font-size="7" text-anchor="middle">${sanitize(row[1])}</text>
              <text x="${protX + 179}" y="${y + 8}" font-family="Arial" font-size="7" text-anchor="middle">${sanitize(row[2])}</text>
            </g>`;
        }).join('')}

        ${compSvg}

        <text x="${stringStartX + 30}" y="${stringStartY - 14}" font-family="Arial" font-size="7" font-weight="700">kabely, které jsou součástí panelu</text>
        ${stringsSvg}
        <line x1="${busX}" y1="${topBusY}" x2="${busX}" y2="${busBottomY}" stroke="#000" stroke-width="1.2" stroke-dasharray="3 3"/>
        ${joinSvg}
        <text x="${busX + 16}" y="${stringStartY + 12}" font-family="Arial" font-size="7" transform="rotate(90 ${busX + 16} ${stringStartY + 12})">${sanitize(data.dcCable)}</text>

        <rect x="${rdcZone.x}" y="${rdcZone.y}" width="${rdcZone.w}" height="${rdcZone.h}" fill="none" stroke="#000" stroke-width="1" stroke-dasharray="6 4"/>
        <text x="${rdcZone.x + 2}" y="${rdcZone.y - 4}" font-family="Arial" font-size="9.5" font-weight="700">RDC</text>
        <line x1="${busX}" y1="${busBottomY}" x2="${dcBox.x + dcBox.w / 2}" y2="${dcBox.y + 10}" stroke="#000" stroke-width="1.2"/>
        <rect x="${dcBox.x}" y="${dcBox.y}" width="${dcBox.w}" height="${dcBox.h}" fill="#fff" stroke="#000" stroke-width="1"/>
        <line x1="${dcBox.x + dcBox.w / 2}" y1="${dcBox.y + 14}" x2="${dcBox.x + dcBox.w / 2}" y2="${dcBox.y + dcBox.h - 14}" stroke="#000" stroke-width="1"/>
        <text x="${dcBox.x + dcBox.w / 2}" y="${dcBox.y + 11}" font-family="Arial" font-size="6.6" text-anchor="middle" font-weight="700">DC ochr.</text>
        <text x="${dcBox.x + dcBox.w / 2}" y="${dcBox.y + 23}" font-family="Arial" font-size="6.2" text-anchor="middle">${sanitize(wrapTextToLines(data.dcProtection, 12)[0] || '')}</text>
        <text x="${dcBox.x + dcBox.w / 2}" y="${dcBox.y + dcBox.h + 12}" font-family="Arial" font-size="6.8" text-anchor="middle">${sanitize(data.dcCable)}</text>

        <rect x="${invZone.x}" y="${invZone.y}" width="${invZone.w}" height="${invZone.h}" fill="none" stroke="#000" stroke-width="1" stroke-dasharray="6 4"/>
        <text x="${invZone.x + 2}" y="${invZone.y - 4}" font-family="Arial" font-size="9.5" font-weight="700">IN</text>
        <line x1="${dcBox.x + dcBox.w}" y1="${dcBox.y + dcBox.h / 2}" x2="${inverter.x}" y2="${inverter.y + inverter.h / 2}" stroke="#000" stroke-width="1.2"/>
        <rect x="${inverter.x}" y="${inverter.y}" width="${inverter.w}" height="${inverter.h}" fill="#fff" stroke="#000" stroke-width="1"/>
        <circle cx="${inverter.x}" cy="${inverter.y + inverter.h / 2}" r="3" fill="#000"/>
        <circle cx="${inverter.x + inverter.w}" cy="${inverter.y + inverter.h / 2}" r="3" fill="#000"/>
        <text x="${inverter.x + 8}" y="${inverter.y + 14}" font-family="Arial" font-size="8.2" font-weight="700">Střídač</text>
        ${svgLines(inverterBody, inverter.x + 8, inverter.y + 27, { anchor: 'start', fontSize: 7.1, lineHeight: 10, fontWeight: '700' })}
        <text x="${inverter.x + inverter.w + 7}" y="${inverter.y + 18}" font-family="Arial" font-size="6.6">port</text>
        <text x="${inverter.x + inverter.w + 7}" y="${inverter.y + inverter.h - 15}" font-family="Arial" font-size="6.6">grid</text>

        ${data.hasBattery ? `
          <line x1="${inverter.x + inverter.w / 2}" y1="${inverter.y + inverter.h}" x2="${inverter.x + inverter.w / 2}" y2="${battery.y}" stroke="#000" stroke-width="1.2"/>
          <rect x="${battery.x}" y="${battery.y}" width="${battery.w}" height="${battery.h}" fill="#fff" stroke="#000" stroke-width="1"/>
          <text x="${battery.x + battery.w / 2}" y="${battery.y + 11}" font-family="Arial" font-size="7.8" text-anchor="middle" font-weight="700">Bat</text>
          ${svgLines(batteryLines.concat([`${fmt(data.batteryCapacity, 2)} kWh`]), battery.x + battery.w / 2, battery.y + 22, { anchor: 'middle', fontSize: 6.5, lineHeight: 8.5, fontWeight: '700' })}
        ` : ''}

        <rect x="${racZone.x}" y="${racZone.y}" width="${racZone.w}" height="${racZone.h}" fill="none" stroke="#000" stroke-width="1" stroke-dasharray="6 4"/>
        <text x="${racZone.x + 2}" y="${racZone.y - 4}" font-family="Arial" font-size="9.5" font-weight="700">RAC</text>
        <line x1="${inverter.x + inverter.w}" y1="${inverter.y + inverter.h / 2}" x2="${racBox.x}" y2="${racBox.y + racBox.h / 2}" stroke="#000" stroke-width="1.2"/>
        <rect x="${racBox.x}" y="${racBox.y}" width="${racBox.w}" height="${racBox.h}" fill="#fff" stroke="#000" stroke-width="1"/>
        <text x="${racBox.x + racBox.w / 2}" y="${racBox.y + 13}" font-family="Arial" font-size="7.8" text-anchor="middle" font-weight="700">RAC / AC ochrany</text>
        ${svgLines(wrapTextToLines(data.acProtection, 19).slice(0, 2), racBox.x + racBox.w / 2, racBox.y + 25, { anchor: 'middle', fontSize: 6.8, lineHeight: 9, fontWeight: '700' })}
        <text x="${racBox.x + racBox.w / 2}" y="${racBox.y + racBox.h + 14}" font-family="Arial" font-size="6.8" text-anchor="middle">${sanitize(data.acCable)}</text>

        <rect x="${rhZone.x}" y="${rhZone.y}" width="${rhZone.w}" height="${rhZone.h}" fill="none" stroke="#000" stroke-width="1" stroke-dasharray="6 4"/>
        <text x="${rhZone.x + 2}" y="${rhZone.y - 4}" font-family="Arial" font-size="9.5" font-weight="700">RH</text>
        <line x1="${racBox.x + racBox.w}" y1="${racBox.y + racBox.h / 2}" x2="${rhBox.x}" y2="${rhBox.y + rhBox.h / 2}" stroke="#000" stroke-width="1.2"/>
        <rect x="${rhBox.x}" y="${rhBox.y}" width="${rhBox.w}" height="${rhBox.h}" fill="#fff" stroke="#000" stroke-width="1"/>
        <text x="${rhBox.x + rhBox.w / 2}" y="${rhBox.y + 14}" font-family="Arial" font-size="8" text-anchor="middle" font-weight="700">${sanitize(data.mainBoard)}</text>
        <text x="${rhBox.x + rhBox.w / 2}" y="${rhBox.y + 27}" font-family="Arial" font-size="7" text-anchor="middle">připojovací místo FVE</text>
        <text x="${rhBox.x + rhBox.w / 2}" y="${rhBox.y + 39}" font-family="Arial" font-size="7" text-anchor="middle">stávající / nový</text>

        <rect x="${smartBox.x}" y="${smartBox.y}" width="${smartBox.w}" height="${smartBox.h}" fill="#fff" stroke="#000" stroke-width="1"/>
        <text x="${smartBox.x + smartBox.w / 2}" y="${smartBox.y + 10}" font-family="Arial" font-size="6.6" text-anchor="middle" font-weight="700">smartmeter</text>
        <text x="${smartBox.x + smartBox.w / 2}" y="${smartBox.y + 20}" font-family="Arial" font-size="6.2" text-anchor="middle">${sanitize(wrapTextToLines(data.meterType, 16)[0] || '')}</text>
        <line x1="${smartBox.x + smartBox.w / 2}" y1="${smartBox.y + smartBox.h}" x2="${rhBox.x + rhBox.w / 2}" y2="${rhBox.y}" stroke="#000" stroke-width="1"/>

        <rect x="${reZone.x}" y="${reZone.y}" width="${reZone.w}" height="${reZone.h}" fill="none" stroke="#000" stroke-width="1" stroke-dasharray="6 4"/>
        <text x="${reZone.x + 2}" y="${reZone.y - 4}" font-family="Arial" font-size="8">${sanitize(data.meterBoard)}</text>
        <line x1="${rhBox.x + rhBox.w}" y1="${rhBox.y + rhBox.h / 2}" x2="${meterBox.x}" y2="${meterBox.y + meterBox.h / 2}" stroke="#000" stroke-width="1.2"/>
        <rect x="${meterBox.x}" y="${meterBox.y}" width="${meterBox.w}" height="${meterBox.h}" fill="#fff" stroke="#000" stroke-width="1"/>
        <text x="${meterBox.x + meterBox.w / 2}" y="${meterBox.y + 14}" font-family="Arial" font-size="6.5" text-anchor="middle">4Q elektroměr</text>
        <text x="${meterBox.x + meterBox.w / 2}" y="${meterBox.y + 27}" font-family="Arial" font-size="6.1" text-anchor="middle">${sanitize(wrapTextToLines(data.utilityMeter, 12)[0] || '')}</text>
        <rect x="${hdoBox.x}" y="${hdoBox.y}" width="${hdoBox.w}" height="${hdoBox.h}" fill="#fff" stroke="#000" stroke-width="1"/>
        <text x="${hdoBox.x + hdoBox.w / 2}" y="${hdoBox.y + 15}" font-family="Arial" font-size="6.4" text-anchor="middle">HDO</text>
        <line x1="${meterBox.x + meterBox.w / 2}" y1="${meterBox.y + meterBox.h}" x2="${meterBox.x + meterBox.w / 2}" y2="${dsBusY}" stroke="#000" stroke-width="1.2"/>
        <line x1="${meterBox.x + meterBox.w / 2}" y1="${dsBusY}" x2="${dsX}" y2="${dsBusY}" stroke="#000" stroke-width="1.2"/>
        <circle cx="${meterBox.x + meterBox.w / 2}" cy="${dsBusY}" r="3" fill="#000"/>
        <text x="${meterBox.x + meterBox.w / 2 - 28}" y="${dsBusY - 10}" font-family="Arial" font-size="7.2">Provozovatel DS</text>
        <line x1="${dsX}" y1="${dsBusY}" x2="${dsX}" y2="${dsBottomY}" stroke="#000" stroke-width="1.2"/>
        <rect x="${dsBox.x}" y="${dsBox.y}" width="${dsBox.w}" height="${dsBox.h}" fill="#fff" stroke="#000" stroke-width="1"/>
        <text x="${dsBox.x + dsBox.w / 2}" y="${dsBox.y + 14}" font-family="Arial" font-size="7" text-anchor="middle" font-weight="700">DS</text>
        <text x="${dsBox.x + dsBox.w / 2}" y="${dsBox.y + 25}" font-family="Arial" font-size="6.2" text-anchor="middle">3NPE</text>

        ${data.hasWallbox ? `
          <rect x="${wallZone.x}" y="${wallZone.y}" width="${wallZone.w}" height="${wallZone.h}" fill="none" stroke="#000" stroke-width="1" stroke-dasharray="6 4"/>
          <text x="${wallZone.x + 2}" y="${wallZone.y - 4}" font-family="Arial" font-size="8">Wallbox</text>
          <rect x="${wallBox.x}" y="${wallBox.y}" width="${wallBox.w}" height="${wallBox.h}" fill="#fff" stroke="#000" stroke-width="1"/>
          <text x="${wallBox.x + wallBox.w / 2}" y="${wallBox.y + 12}" font-family="Arial" font-size="7.5" text-anchor="middle" font-weight="700">WB</text>
          ${svgLines(wallboxLines.concat([`${fmt(data.wallboxPower, 1)} kW`]), wallBox.x + wallBox.w / 2, wallBox.y + 24, { anchor: 'middle', fontSize: 6.4, lineHeight: 8.2, fontWeight: '700' })}
          <line x1="${rhBox.x + rhBox.w / 2}" y1="${rhBox.y}" x2="${rhBox.x + rhBox.w / 2}" y2="${wallBox.y + wallBox.h}" stroke="#000" stroke-width="1.1"/>
          <line x1="${rhBox.x + rhBox.w / 2}" y1="${wallBox.y + wallBox.h}" x2="${wallBox.x + wallBox.w / 2}" y2="${wallBox.y + wallBox.h}" stroke="#000" stroke-width="1.1"/>
          <text x="${wallZone.x + wallZone.w - 10}" y="${wallZone.y + 10}" font-family="Arial" font-size="6.4" text-anchor="end">${sanitize(data.utpCable)}</text>
        ` : ''}

        ${data.hasBackup ? `
          <rect x="${epsBox.x}" y="${epsBox.y}" width="${epsBox.w}" height="${epsBox.h}" fill="#fff" stroke="#000" stroke-width="1"/>
          <text x="${epsBox.x + epsBox.w / 2}" y="${epsBox.y + 14}" font-family="Arial" font-size="7.8" text-anchor="middle" font-weight="700">${sanitize(data.backupLabel || 'EPS')}</text>
          <text x="${epsBox.x + epsBox.w / 2}" y="${epsBox.y + 27}" font-family="Arial" font-size="6.8" text-anchor="middle">zálohovaná větev</text>
          <text x="${epsBox.x + epsBox.w / 2}" y="${epsBox.y + 38}" font-family="Arial" font-size="6.8" text-anchor="middle">${sanitize(data.backupBoard)}</text>
          <line x1="${inverter.x + inverter.w}" y1="${inverter.y + inverter.h / 2}" x2="${epsBox.x}" y2="${epsBox.y + epsBox.h / 2}" stroke="#000" stroke-width="1.1"/>
        ` : ''}

        <rect x="${protectionBox.x}" y="${protectionBox.y}" width="${protectionBox.w}" height="${protectionBox.h}" fill="#fff" stroke="#000" stroke-width="1"/>
        <text x="${protectionBox.x + 10}" y="${protectionBox.y + 16}" font-family="Arial" font-size="8.5" font-weight="700">Nastavení ochran</text>
        ${svgLines(protectionNoteLines, protectionBox.x + 10, protectionBox.y + 30, { anchor: 'start', fontSize: 7.2, lineHeight: 10 })}

        <rect x="${noteBox.x}" y="${noteBox.y}" width="${noteBox.w}" height="${noteBox.h}" fill="#fff" stroke="#000" stroke-width="1"/>
        <text x="${noteBox.x + 10}" y="${noteBox.y + 16}" font-family="Arial" font-size="8.5" font-weight="700">Poznámka k provedení</text>
        ${svgLines(noteLines.concat(executionLines), noteBox.x + 10, noteBox.y + 30, { anchor: 'start', fontSize: 7.2, lineHeight: 10 })}

        <rect x="${voltageBox.x}" y="${voltageBox.y}" width="${voltageBox.w}" height="${voltageBox.h}" fill="#fff" stroke="#000" stroke-width="1"/>
        ${svgLines(voltageLines, voltageBox.x + 10, voltageBox.y + 16, { anchor: 'start', fontSize: 7.4, lineHeight: 12, fontWeight: '700' })}

        ${makeE02TitleBlockSvg(data, titleX, titleY, titleW, titleH)}
      </svg>`;
  }

  function makeE02Html(data) {
    return `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<title>${sanitize(data.projectNumber)}_E-02_Jednopolove_schema</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  html, body { margin:0; padding:0; background:#d9d9d9; }
  body { font-family: Arial, Helvetica, sans-serif; }
  .page { width: 297mm; min-height: 210mm; margin: 0 auto; background:#fff; }
  svg { display:block; width:100%; height:auto; }
  @media print {
    html, body { background:#fff; }
    .page { width:auto; min-height:auto; margin:0; }
  }
</style>
</head>
<body>
  <div class="page">${makeE02Svg(data)}</div>
</body>
</html>`;
  }

  function colorWithAlpha(hex, alpha) {
    const clean = String(hex || '').replace('#', '');
    const value = clean.length === 3
      ? clean.split('').map(ch => ch + ch).join('')
      : clean.padEnd(6, '0').slice(0, 6);
    const num = parseInt(value, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }


  function sketchLocalToImage(sketch, x, y) {
    const dx = x - sketch.rotatedCenter.x;
    const dy = y - sketch.rotatedCenter.y;
    const c = Math.cos(-sketch.rotationRad);
    const s = Math.sin(-sketch.rotationRad);
    return {
      x: sketch.sourceCenter.x + dx * c - dy * s,
      y: sketch.sourceCenter.y + dx * s + dy * c
    };
  }

  function makeE03SvgSketch(data) {
    const sketch = data.sketchPanels;
    const roofX = 70, roofY = 110, roofW = 920, roofH = 650;
    const landscape = (sketch.avgBoxW || 0) >= (sketch.avgBoxH || 0);
    const moduleW = landscape ? Math.max(1, data.panelHeight || 2279) : Math.max(1, data.panelWidth || 1134);
    const moduleH = landscape ? Math.max(1, data.panelWidth || 1134) : Math.max(1, data.panelHeight || 2279);
    const mmPerPxX = moduleW / Math.max(1, sketch.avgBoxW || 1);
    const mmPerPxY = moduleH / Math.max(1, sketch.avgBoxH || 1);

    const cadPanelsRaw = (sketch.boxesRot || []).map((box, idx) => {
      const centerXmm = ((box.x + box.w / 2) - sketch.boundsRot.minX) * mmPerPxX;
      const centerYmm = ((box.y + box.h / 2) - sketch.boundsRot.minY) * mmPerPxY;
      return {
        index: idx + 1,
        x: centerXmm - moduleW / 2,
        y: centerYmm - moduleH / 2,
        w: moduleW,
        h: moduleH
      };
    });

    const minX = Math.min.apply(null, cadPanelsRaw.map(p => p.x).concat([0]));
    const minY = Math.min.apply(null, cadPanelsRaw.map(p => p.y).concat([0]));
    const cadPanels = cadPanelsRaw.map(p => ({ ...p, x: p.x - minX, y: p.y - minY }));
    const arrayWidthMm = Math.max.apply(null, cadPanels.map(p => p.x + p.w).concat([moduleW]));
    const arrayHeightMm = Math.max.apply(null, cadPanels.map(p => p.y + p.h).concat([moduleH]));
    const drawScale = Math.min((roofW - 80) / Math.max(1, arrayWidthMm), (roofH - 80) / Math.max(1, arrayHeightMm));
    const offsetX = roofX + (roofW - arrayWidthMm * drawScale) / 2;
    const offsetY = roofY + (roofH - arrayHeightMm * drawScale) / 2;
    const toX = (x) => offsetX + x * drawScale;
    const toY = (y) => offsetY + y * drawScale;

    const panelSvg = cadPanels.map(panel => `
      <g>
        <rect x="${toX(panel.x)}" y="${toY(panel.y)}" width="${panel.w * drawScale}" height="${panel.h * drawScale}" fill="rgba(94,53,177,0.07)" stroke="#5e35b1" stroke-width="1.6"/>
        <line x1="${toX(panel.x + 10)}" y1="${toY(panel.y + 10)}" x2="${toX(panel.x + panel.w - 10)}" y2="${toY(panel.y + panel.h - 10)}" stroke="#b3a0db" stroke-width="0.8"/>
        <line x1="${toX(panel.x + panel.w - 10)}" y1="${toY(panel.y + 10)}" x2="${toX(panel.x + 10)}" y2="${toY(panel.y + panel.h - 10)}" stroke="#b3a0db" stroke-width="0.8"/>
        <text x="${toX(panel.x + panel.w / 2)}" y="${toY(panel.y + panel.h / 2)}" font-family="Arial, Helvetica, sans-serif" font-size="8.5" text-anchor="middle" dominant-baseline="middle" fill="#40237d">${panel.index}</text>
      </g>
    `).join('');

    const firstPanel = cadPanels[0] || { x: 0, y: 0, w: moduleW, h: moduleH };
    const moduleDimY = Math.max(roofY + 26, toY(firstPanel.y) - 24);
    const moduleDimX = Math.min(roofX + roofW - 30, toX(firstPanel.x + firstPanel.w) + 26);

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1450 860" width="100%" height="860">
        <rect x="0.5" y="0.5" width="1449" height="859" fill="#fff" stroke="#1d2735" stroke-width="1"/>
        ${standardLogoSvg(data, 24, 20, 1)}
        <text x="725" y="48" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" text-anchor="middle">PŮDORYS STŘECHY A ROZMÍSTĚNÍ PANELŮ</text>
        <text x="725" y="70" font-family="Arial, Helvetica, sans-serif" font-size="12" text-anchor="middle" fill="#475467">${sanitize(data.siteAddress)} • ${sanitize(data.projectNumber)}</text>

        <text x="${roofX}" y="94" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700">PŘEKRESLENÍ Z NÁKRESU / CAD REŽIM</text>
        <rect x="${roofX}" y="${roofY}" width="${roofW}" height="${roofH}" fill="#fff" stroke="#1d2735" stroke-width="1.4"/>
        <rect x="${toX(0)}" y="${toY(0)}" width="${arrayWidthMm * drawScale}" height="${arrayHeightMm * drawScale}" fill="none" stroke="#98a2b3" stroke-width="1.2" stroke-dasharray="8 5"/>
        ${panelSvg}

        <line x1="${toX(0)}" y1="${toY(0) - 20}" x2="${toX(arrayWidthMm)}" y2="${toY(0) - 20}" stroke="#1d2735" stroke-width="1.2"/>
        <line x1="${toX(0)}" y1="${toY(0) - 12}" x2="${toX(0)}" y2="${toY(0)}" stroke="#1d2735" stroke-width="1.2"/>
        <line x1="${toX(arrayWidthMm)}" y1="${toY(0) - 12}" x2="${toX(arrayWidthMm)}" y2="${toY(0)}" stroke="#1d2735" stroke-width="1.2"/>
        <text x="${toX(arrayWidthMm / 2)}" y="${toY(0) - 28}" font-family="Arial, Helvetica, sans-serif" font-size="12" text-anchor="middle" font-weight="700">${sanitize(`${fmt(arrayWidthMm, 0)} mm`)}</text>

        <line x1="${toX(0) - 22}" y1="${toY(0)}" x2="${toX(0) - 22}" y2="${toY(arrayHeightMm)}" stroke="#1d2735" stroke-width="1.2"/>
        <line x1="${toX(0) - 14}" y1="${toY(0)}" x2="${toX(0)}" y2="${toY(0)}" stroke="#1d2735" stroke-width="1.2"/>
        <line x1="${toX(0) - 14}" y1="${toY(arrayHeightMm)}" x2="${toX(0)}" y2="${toY(arrayHeightMm)}" stroke="#1d2735" stroke-width="1.2"/>
        <text x="${toX(0) - 34}" y="${toY(arrayHeightMm / 2)}" font-family="Arial, Helvetica, sans-serif" font-size="12" text-anchor="middle" font-weight="700" transform="rotate(-90 ${toX(0) - 34} ${toY(arrayHeightMm / 2)})">${sanitize(`${fmt(arrayHeightMm, 0)} mm`)}</text>

        <line x1="${toX(firstPanel.x)}" y1="${moduleDimY}" x2="${toX(firstPanel.x + firstPanel.w)}" y2="${moduleDimY}" stroke="#667085" stroke-width="1"/>
        <line x1="${toX(firstPanel.x)}" y1="${moduleDimY}" x2="${toX(firstPanel.x)}" y2="${toY(firstPanel.y)}" stroke="#667085" stroke-width="1"/>
        <line x1="${toX(firstPanel.x + firstPanel.w)}" y1="${moduleDimY}" x2="${toX(firstPanel.x + firstPanel.w)}" y2="${toY(firstPanel.y)}" stroke="#667085" stroke-width="1"/>
        <text x="${toX(firstPanel.x + firstPanel.w / 2)}" y="${moduleDimY - 6}" font-family="Arial, Helvetica, sans-serif" font-size="10" text-anchor="middle">${sanitize(`${fmt(moduleW, 0)} mm`)}</text>

        <line x1="${moduleDimX}" y1="${toY(firstPanel.y)}" x2="${moduleDimX}" y2="${toY(firstPanel.y + firstPanel.h)}" stroke="#667085" stroke-width="1"/>
        <line x1="${toX(firstPanel.x + firstPanel.w)}" y1="${toY(firstPanel.y)}" x2="${moduleDimX}" y2="${toY(firstPanel.y)}" stroke="#667085" stroke-width="1"/>
        <line x1="${toX(firstPanel.x + firstPanel.w)}" y1="${toY(firstPanel.y + firstPanel.h)}" x2="${moduleDimX}" y2="${toY(firstPanel.y + firstPanel.h)}" stroke="#667085" stroke-width="1"/>
        <text x="${moduleDimX + 10}" y="${toY(firstPanel.y + firstPanel.h / 2)}" font-family="Arial, Helvetica, sans-serif" font-size="10" text-anchor="middle" transform="rotate(-90 ${moduleDimX + 10} ${toY(firstPanel.y + firstPanel.h / 2)})">${sanitize(`${fmt(moduleH, 0)} mm`)}</text>

        <rect x="1020" y="96" width="390" height="246" rx="14" fill="#fff" stroke="#1d2735"/>
        <text x="1040" y="118" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700">PŘEHLED PŘEKRESLENÍ</text>
        <text x="1040" y="144" font-family="Arial, Helvetica, sans-serif" font-size="12">Zdroj: nahraný nákres / screenshot střechy</text>
        <text x="1040" y="164" font-family="Arial, Helvetica, sans-serif" font-size="12">Do výstupu se nevkládá fotografie, pouze vektorový přepis</text>
        <text x="1040" y="184" font-family="Arial, Helvetica, sans-serif" font-size="12">Detekované panely: ${fmt(sketch.panelCount, 0)} ks</text>
        <text x="1040" y="204" font-family="Arial, Helvetica, sans-serif" font-size="12">Orientace modulu: ${sanitize(landscape ? 'na šířku' : 'na výšku')}</text>
        <text x="1040" y="224" font-family="Arial, Helvetica, sans-serif" font-size="12">Rozměr panelu: ${fmt(data.panelWidth, 0)} × ${fmt(data.panelHeight, 0)} mm</text>
        <text x="1040" y="244" font-family="Arial, Helvetica, sans-serif" font-size="12">Kóta sestavy: ${fmt(arrayWidthMm, 0)} × ${fmt(arrayHeightMm, 0)} mm</text>
        <text x="1040" y="264" font-family="Arial, Helvetica, sans-serif" font-size="12">Instalovaný výkon projektu: ${fmt(data.installedPowerKw, 2)} kWp</text>
        ${wrapSvgText('Podkladový obrázek slouží jen pro rozpoznání polohy panelů. Výstup E-03 je nově čistý vektorový výkres bez vložené fotografie, aby působil jako CAD podklad.', 1040, 292, 43, 15, 'font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475467"')}

        <rect x="1020" y="360" width="390" height="166" rx="14" fill="#fff" stroke="#1d2735"/>
        <text x="1040" y="382" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700">PARAMETRY FVE</text>
        <text x="1040" y="406" font-family="Arial, Helvetica, sans-serif" font-size="12">Panel: ${sanitize(data.panelManufacturer)} ${sanitize(data.panelType)}</text>
        <text x="1040" y="426" font-family="Arial, Helvetica, sans-serif" font-size="12">Počet v projektu: ${fmt(data.totalPanels, 0)} ks</text>
        <text x="1040" y="446" font-family="Arial, Helvetica, sans-serif" font-size="12">Počet z nákresu: ${fmt(sketch.panelCount, 0)} ks</text>
        <text x="1040" y="466" font-family="Arial, Helvetica, sans-serif" font-size="12">Střídač: ${sanitize(data.inverterType)}</text>
        <text x="1040" y="486" font-family="Arial, Helvetica, sans-serif" font-size="12">Baterie: ${sanitize(data.hasBattery ? `${data.batteryType} / ${fmt(data.batteryCapacity, 2)} kWh` : 'bez baterie')}</text>

        <text x="1020" y="556" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700">SITUAČNÍ MAPA</text>
        ${data.mapData
          ? `<image href="${data.mapData}" x="1020" y="568" width="390" height="214" preserveAspectRatio="xMidYMid meet"/>`
          : `<rect x="1020" y="568" width="390" height="214" fill="#f3f4f6" stroke="#98a2b3" stroke-dasharray="7 5"/><text x="1215" y="676" font-family="Arial, Helvetica, sans-serif" font-size="15" text-anchor="middle" fill="#667085">Situační mapa / katastr</text>`}

        <circle cx="1362" cy="812" r="24" fill="none" stroke="#1d2735" stroke-width="1.4"/>
        <line x1="1362" y1="790" x2="1362" y2="826" stroke="#1d2735" stroke-width="1.6"/>
        <polygon points="1362,778 1355,792 1369,792" fill="#1d2735"/>
        <text x="1362" y="772" font-family="Arial, Helvetica, sans-serif" font-size="12" text-anchor="middle" font-weight="700">S</text>
      </svg>`;
  }

  function makeE03Svg(data) {
    if (data.useSketchTrace && data.sketchPanels?.panelCount) return makeE03SvgSketch(data);

    const layout = computeRoofLayout(data);
    const roofX = 70, roofY = 110, roofW = 920, roofH = 650;
    const clipId = `roofClip_${Math.abs((data.projectNumber || 'p').split('').reduce((s, ch) => s + ch.charCodeAt(0), 0))}_${data.totalPanels}`;
    const bounds = layout.bounds;
    const scale = Math.min(roofW / bounds.width, roofH / bounds.height);
    const toX = (x) => roofX + (x - bounds.minX) * scale;
    const toY = (y) => roofY + (y - bounds.minY) * scale;
    const polyPoints = layout.polygon.map(p => `${toX(p.x)},${toY(p.y)}`).join(' ');
    const bboxImgX = toX(bounds.minX);
    const bboxImgY = toY(bounds.minY);
    const bboxImgW = bounds.width * scale;
    const bboxImgH = bounds.height * scale;

    const obstacleSvg = layout.obstacles.map((ob, i) => `
      <g>
        <rect x="${toX(ob.x)}" y="${toY(ob.y)}" width="${ob.w * scale}" height="${ob.h * scale}" fill="#c9ced8" stroke="#667085" stroke-width="1.5"/>
        <line x1="${toX(ob.x)}" y1="${toY(ob.y)}" x2="${toX(ob.x + ob.w)}" y2="${toY(ob.y + ob.h)}" stroke="#667085" stroke-width="1"/>
        <line x1="${toX(ob.x + ob.w)}" y1="${toY(ob.y)}" x2="${toX(ob.x)}" y2="${toY(ob.y + ob.h)}" stroke="#667085" stroke-width="1"/>
        <text x="${toX(ob.x + ob.w / 2)}" y="${toY(ob.y + ob.h / 2)}" font-family="Arial" font-size="11" text-anchor="middle" dominant-baseline="middle">${sanitize(ob.name)}</text>
      </g>
    `).join('');

    const rowsInfo = layout.rows.map((row, i) => `
      <g>
        <rect x="1030" y="${120 + i * 58}" width="360" height="48" rx="10" fill="${row.valid ? '#f8fbff' : '#fff3f2'}" stroke="${row.valid ? '#d8e2f0' : '#f2b8b5'}"/>
        <circle cx="1052" cy="${144 + i * 58}" r="7" fill="${row.valid ? '#18794e' : '#b42318'}"/>
        <text x="1068" y="${138 + i * 58}" font-family="Arial" font-size="12" font-weight="700">${sanitize(row.name)}</text>
        <text x="1068" y="${154 + i * 58}" font-family="Arial" font-size="11">${sanitize(`${fmt(row.panels,0)} ks • ${row.drawOrientation === 'landscape' ? 'na šířku' : 'na výšku'} • ${row.modeLabel}`)}</text>
      </g>
    `).join('');

    const panelSvg = layout.rows.map((row) => {
      const fill = row.valid ? colorWithAlpha(row.color, 0.10) : 'rgba(180,35,24,0.12)';
      const labelX = toX(row.bbox.x);
      const labelY = toY(row.bbox.y) - 8;
      return `
        <g>
          ${row.rects.map(rect => `<rect x="${toX(rect.x)}" y="${toY(rect.y)}" width="${rect.w * scale}" height="${rect.h * scale}" fill="${fill}" stroke="${sanitize(row.color)}" stroke-width="1.6"/>`).join('')}
          <rect x="${toX(row.bbox.x)}" y="${toY(row.bbox.y)}" width="${row.bbox.w * scale}" height="${row.bbox.h * scale}" fill="none" stroke="${sanitize(row.color)}" stroke-width="1.4" stroke-dasharray="7 4"/>
          <text x="${labelX}" y="${Math.max(roofY + 12, labelY)}" font-family="Arial" font-size="12" font-weight="700" fill="${sanitize(row.color)}">${sanitize(row.name)}${row.valid ? '' : ' • mimo plochu'}</text>
        </g>`;
    }).join('');

    const roofBg = `<polygon points="${polyPoints}" fill="#fafbfc" stroke="#1d2735" stroke-width="2"/>`;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1450 860" width="100%" height="860">
        <rect x="0.5" y="0.5" width="1449" height="859" fill="#fff" stroke="#1d2735" stroke-width="1"/>
        ${standardLogoSvg(data, 24, 20, 1)}
        <text x="725" y="48" font-family="Arial" font-size="24" font-weight="700" text-anchor="middle">PŮDORYS STŘECHY A ROZMÍSTĚNÍ PANELŮ</text>
        <text x="725" y="70" font-family="Arial" font-size="12" text-anchor="middle" fill="#475467">${sanitize(data.siteAddress)} • ${sanitize(data.projectNumber)}</text>

        <text x="${roofX}" y="94" font-family="Arial" font-size="14" font-weight="700">STŘECHA / PŮDORYS</text>
        ${roofBg}
        <polygon points="${polyPoints}" fill="none" stroke="#1d2735" stroke-width="2.2"/>
        ${obstacleSvg}
        ${panelSvg}

        <line x1="${roofX}" y1="${roofY + roofH + 26}" x2="${roofX + roofW}" y2="${roofY + roofH + 26}" stroke="#1d2735" stroke-width="1.2"/>
        <line x1="${roofX}" y1="${roofY + roofH + 18}" x2="${roofX}" y2="${roofY + roofH + 34}" stroke="#1d2735" stroke-width="1.2"/>
        <line x1="${roofX + roofW}" y1="${roofY + roofH + 18}" x2="${roofX + roofW}" y2="${roofY + roofH + 34}" stroke="#1d2735" stroke-width="1.2"/>
        <text x="${roofX + roofW / 2}" y="${roofY + roofH + 48}" font-family="Arial" font-size="12" text-anchor="middle">${sanitize(`${fmt(bounds.width, 0)} mm`)}</text>

        <line x1="${roofX - 24}" y1="${roofY}" x2="${roofX - 24}" y2="${roofY + roofH}" stroke="#1d2735" stroke-width="1.2"/>
        <line x1="${roofX - 32}" y1="${roofY}" x2="${roofX - 16}" y2="${roofY}" stroke="#1d2735" stroke-width="1.2"/>
        <line x1="${roofX - 32}" y1="${roofY + roofH}" x2="${roofX - 16}" y2="${roofY + roofH}" stroke="#1d2735" stroke-width="1.2"/>
        <text x="${roofX - 36}" y="${roofY + roofH / 2}" font-family="Arial" font-size="12" text-anchor="middle" transform="rotate(-90 ${roofX - 36} ${roofY + roofH / 2})">${sanitize(`${fmt(bounds.height, 0)} mm`)}</text>

        <rect x="1020" y="96" width="390" height="246" rx="14" fill="#fff" stroke="#1d2735"/>
        <text x="1040" y="118" font-family="Arial" font-size="14" font-weight="700">PŘEHLED ŘAD</text>
        ${rowsInfo}

        <rect x="1020" y="360" width="390" height="166" rx="14" fill="#fff" stroke="#1d2735"/>
        <text x="1040" y="382" font-family="Arial" font-size="14" font-weight="700">PARAMETRY FVE</text>
        <text x="1040" y="406" font-family="Arial" font-size="12">Panel: ${sanitize(data.panelManufacturer)} ${sanitize(data.panelType)}</text>
        <text x="1040" y="426" font-family="Arial" font-size="12">Výkon: ${fmt(data.panelPower, 0)} Wp / kus</text>
        <text x="1040" y="446" font-family="Arial" font-size="12">Celkem: ${fmt(data.totalPanels, 0)} ks / ${fmt(data.installedPowerKw, 2)} kWp</text>
        <text x="1040" y="466" font-family="Arial" font-size="12">Rozměr panelu: ${fmt(data.panelWidth, 0)} × ${fmt(data.panelHeight, 0)} mm</text>
        <text x="1040" y="486" font-family="Arial" font-size="12">Odstup od hrany: ${fmt(data.roofEdgeOffset, 0)} mm</text>
        <text x="1040" y="506" font-family="Arial" font-size="12">Mezera mezi panely: ${fmt(data.panelGapMm, 0)} mm</text>

        <text x="1020" y="556" font-family="Arial" font-size="14" font-weight="700">SITUAČNÍ MAPA</text>
        ${data.mapData
          ? `<image href="${data.mapData}" x="1020" y="568" width="390" height="214" preserveAspectRatio="xMidYMid meet"/>`
          : `<rect x="1020" y="568" width="390" height="214" fill="#f3f4f6" stroke="#98a2b3" stroke-dasharray="7 5"/><text x="1215" y="676" font-family="Arial" font-size="15" text-anchor="middle" fill="#667085">Situační mapa / katastr</text>`}

        <circle cx="1362" cy="812" r="24" fill="none" stroke="#1d2735" stroke-width="1.4"/>
        <line x1="1362" y1="790" x2="1362" y2="826" stroke="#1d2735" stroke-width="1.6"/>
        <polygon points="1362,778 1355,792 1369,792" fill="#1d2735"/>
        <text x="1362" y="772" font-family="Arial" font-size="12" text-anchor="middle" font-weight="700">S</text>
      </svg>`;
  }

  function makeE03Html(data) {
    return `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<title>${sanitize(data.projectNumber)}_E-03_Zakres_modulu</title>
<style>
  @page { size: A3 landscape; margin: 10mm; }
  body { margin:0; font-family: Arial, Helvetica, sans-serif; color:#111; background:#fff; }
  .page { padding:10mm; box-sizing:border-box; }
</style>
</head>
<body>
  <div class="page">
    ${makeE03Svg(data)}
    <div style="margin-top:6px;">${drawingTitleBlockHtml(data, 'E-03', 'ZÁKRES FV MODULŮ DO PŮDORYSU STŘECHY', 'A3', data.roofPlanScale, 'Půdorys střechy a rozmístění panelů')}</div>
  </div>
</body>
</html>`;
  }

  function makeProjectJson(data) {
    return JSON.stringify({
      ...data,
      _meta: {
        app: 'FVE projekt generator',
        version: 7
      }
    }, null, 2);
  }

  function applyProjectData(obj) {
    const setVal = (id, v) => { if ($(id) && v !== undefined && v !== null) $(id).value = v; };
    const setChk = (id, v) => { if ($(id)) $(id).checked = !!v; };

    [
      'projectNumber','issueDate','docPurpose','investorName','siteAddress','siteTown','cadastralArea','parcelNumber','lvNumber','buildingType',
      'companyName','companyAddress','companyIc','companyEmail','companyPhone','designerName','designerCert','assistantName','assistantEmail','customHeaderNote',
      'roofType','roofSurface','roofFire','floors','heatingSource','hotWaterSource','roofWidth','roofHeight','roofEdgeOffset','panelGapMm','roofPolygon','roofObstacles','technicalRoom','wallboxPlace','lightning','roofPlanScale',
      'buildingDescription','executionNotes',
      'panelManufacturer','panelType','panelPower','panelVoltage','panelArea','panelWidth','panelHeight','panelSvt','connectionType',
      'inverterManufacturer','inverterType','inverterPhases','inverterCount','inverterSvt','batteryType','batteryCapacity','batteryCurrent',
      'meterType','utilityMeter','mainBoard','meterBoard','wallboxType','wallboxPower','evPoints','backupLabel','dcProtection','acProtection','dcCable','acCable','utpCable',
      'routeDescription','protectionSettings','electricalNotes'
    ].forEach(key => setVal(key, obj[key]));

    setChk('hasBattery', obj.hasBattery);
    setChk('hasWallbox', obj.hasWallbox);
    setChk('hasBackup', obj.hasBackup);
    setChk('hasExportToGrid', obj.hasExportToGrid);
    setChk('useSketchTrace', obj.useSketchTrace !== false);

    const roofWidth = toNum(obj.roofWidth || 11000);
    const roofHeight = toNum(obj.roofHeight || 10400);
    const legacy = !obj._meta || toNum(obj._meta.version, 1) < 2;
    state.rows = Array.isArray(obj.rows) && obj.rows.length ? obj.rows.slice(0, MAX_PROJECT_STRINGS).map((row, idx) => {
      const drawX = legacy && toNum(row.drawX) <= 100 ? Math.round((toNum(row.drawX) / 100) * roofWidth) : Math.max(0, toNum(row.drawX));
      const drawY = legacy && toNum(row.drawY) <= 100 ? Math.round((toNum(row.drawY) / 100) * roofHeight) : Math.max(0, toNum(row.drawY));
      return {
        name: row.name || `ŘADA ${idx + 1}`,
        panels: Math.max(1, toNum(row.panels || 1)),
        azimuth: toNum(row.azimuth),
        tilt: toNum(row.tilt),
        drawX,
        drawY,
        drawRotation: toNum(row.drawRotation),
        drawOrientation: row.drawOrientation || 'landscape',
        drawCols: Math.max(1, toNum(row.drawCols || 1)),
        note: row.note || '',
        color: row.color || '#1f3c88',
        layoutMode: row.layoutMode === 'manual' ? 'manual' : 'auto'
      };
    }) : defaultRows();

    const intake = obj.intake || {};
    intakeFieldIds.forEach(id => setVal(id, intake[id] ?? obj[id]));

    state.images = {
      logo: obj.logoData || null,
      roof: obj.roofData || null,
      map: obj.mapData || null,
      sketch: obj.sketchData || null
    };
    state.references = {
      sourceForm: obj.sourceFormMeta || null
    };
    state.analysis = {
      sourceFormText: obj.sourceFormText || '',
      sourceFormParsed: obj.sourceFormParsed || null,
      sketchPanels: obj.sketchPanels || null
    };
    renderRows();
    renderSourcePreviews();
    updateSummary();
    generatePrompt();
  }

  function boolFromText(value) {
    const v = normalizeText(value);
    if (['1','ano','true','zapnout','zapni','on','yes'].includes(v)) return true;
    if (['0','ne','false','vypnout','vypni','off','no','bez'].includes(v)) return false;
    return null;
  }

  function ensureRowCount(target) {
    const count = Math.max(1, Math.min(MAX_PROJECT_STRINGS, Math.round(toNum(target, 1))));
    while (state.rows.length < count) {
      state.rows.push({
        name: `ŘADA ${state.rows.length + 1}`,
        panels: 8,
        azimuth: 180,
        tilt: 35,
        drawX: 0,
        drawY: 0,
        drawRotation: 0,
        drawOrientation: 'landscape',
        drawCols: 4,
        note: '',
        color: '#1f3c88',
        layoutMode: 'auto'
      });
    }
    while (state.rows.length > count) state.rows.pop();
  }

  function setTotalPanels(total, log) {
    total = Math.max(1, Math.round(toNum(total, 1)));
    if (state.rows.length === 1) {
      state.rows[0].panels = total;
      log.push(`Počet panelů změněn na ${total} ks.`);
      return true;
    }
    const others = state.rows.slice(0, -1).reduce((sum, row) => sum + Math.max(1, toNum(row.panels, 1)), 0);
    state.rows[state.rows.length - 1].panels = Math.max(1, total - others);
    const realTotal = state.rows.reduce((sum, row) => sum + Math.max(1, toNum(row.panels, 1)), 0);
    log.push(`Celkový počet panelů upraven přes poslední řadu. Výsledný součet je ${realTotal} ks.`);
    return true;
  }

  function applyStructuredChange(rawKey, rawValue, log) {
    const key = normalizeText(rawKey).replace(/\s+/g, '');
    const value = String(rawValue || '').trim();

    const rowMatch = key.match(/^(?:row|rada|r)(\d+)\.(.+)$/);
    if (rowMatch) {
      const idx = Math.max(0, Number(rowMatch[1]) - 1);
      ensureRowCount(idx + 1);
      const propMap = {
        'name': 'name',
        'nazev': 'name',
        'panels': 'panels',
        'panely': 'panels',
        'azimuth': 'azimuth',
        'azimut': 'azimuth',
        'tilt': 'tilt',
        'sklon': 'tilt',
        'drawx': 'drawX',
        'x': 'drawX',
        'drawy': 'drawY',
        'y': 'drawY',
        'drawcols': 'drawCols',
        'cols': 'drawCols',
        'sloupce': 'drawCols',
        'draworientation': 'drawOrientation',
        'orientation': 'drawOrientation',
        'orientace': 'drawOrientation',
        'layoutmode': 'layoutMode',
        'rezim': 'layoutMode',
        'color': 'color',
        'barva': 'color',
        'note': 'note',
        'poznamka': 'note'
      };
      const prop = propMap[normalizeText(rowMatch[2]).replace(/\s+/g, '')];
      if (!prop) return false;
      if (['panels','azimuth','tilt','drawX','drawY','drawCols'].includes(prop)) state.rows[idx][prop] = toNum(value);
      else if (prop === 'drawOrientation') state.rows[idx][prop] = /port|vysk/i.test(value) ? 'portrait' : 'landscape';
      else if (prop === 'layoutMode') state.rows[idx][prop] = /man|ruc/i.test(normalizeText(value)) ? 'manual' : 'auto';
      else state.rows[idx][prop] = value;
      log.push(`Řada ${idx + 1}: ${prop} = ${value}`);
      return true;
    }

    const map = {
      'invertertype': ['inverterType', 'text'],
      'stridac': ['inverterType', 'text'],
      'menic': ['inverterType', 'text'],
      'invertermanufacturer': ['inverterManufacturer', 'text'],
      'batterytype': ['batteryType', 'text'],
      'batterycapacity': ['batteryCapacity', 'num'],
      'kapacitabaterie': ['batteryCapacity', 'num'],
      'hasbattery': ['hasBattery', 'bool'],
      'wallboxtype': ['wallboxType', 'text'],
      'haswallbox': ['hasWallbox', 'bool'],
      'wallboxpower': ['wallboxPower', 'num'],
      'paneltype': ['panelType', 'text'],
      'panelpower': ['panelPower', 'num'],
      'roofedgeoffset': ['roofEdgeOffset', 'num'],
      'panelgapmm': ['panelGapMm', 'num'],
      'roofpolygon': ['roofPolygon', 'text'],
      'roofobstacles': ['roofObstacles', 'text'],
      'evpoints': ['evPoints', 'num'],
      'hasbackup': ['hasBackup', 'bool'],
      'hasexporttogrid': ['hasExportToGrid', 'bool']
    };
    const target = map[key];
    if (!target) return false;
    const [field, type] = target;
    if (type === 'bool') {
      const b = boolFromText(value);
      if (b === null) return false;
      $(field).checked = b;
    } else if (type === 'num') {
      $(field).value = toNum(value);
    } else {
      $(field).value = value;
    }
    log.push(`${field} = ${value}`);
    return true;
  }

  function applyNaturalCommand(line, log) {
    const plain = normalizeText(line);
    if (!plain) return false;

    let m;
    if (/^(bez|vypni).*(wallbox)/.test(plain)) { $('hasWallbox').checked = false; log.push('Wallbox vypnut.'); return true; }
    if (/^(zapni).*(wallbox)/.test(plain)) { $('hasWallbox').checked = true; log.push('Wallbox zapnut.'); return true; }
    if (/^(bez|vypni).*(bater)/.test(plain)) { $('hasBattery').checked = false; log.push('Baterie vypnuta.'); return true; }
    if (/^(zapni).*(bater)/.test(plain)) { $('hasBattery').checked = true; log.push('Baterie zapnuta.'); return true; }
    if (/^(bez|vypni).*(eps|backup|zalo)/.test(plain)) { $('hasBackup').checked = false; log.push('EPS / backup vypnut.'); return true; }
    if (/^(zapni).*(eps|backup|zalo)/.test(plain)) { $('hasBackup').checked = true; log.push('EPS / backup zapnut.'); return true; }
    if (/bez pretok/.test(plain)) { $('hasExportToGrid').checked = false; log.push('Projekt nastaven bez přetoků.'); return true; }
    if (/(s pretoky|povol pretok|zapni pretok)/.test(plain)) { $('hasExportToGrid').checked = true; log.push('Projekt nastaven s přetoky.'); return true; }
    if (/(jednof|\b1f\b)/.test(plain)) { $('inverterPhases').value = '1f'; log.push('Střídač přepnut na 1f.'); return true; }
    if (/(trif|trifaz|\b3f\b)/.test(plain)) { $('inverterPhases').value = '3f'; log.push('Střídač přepnut na 3f.'); return true; }

    if ((m = plain.match(/pocet rad na (\d+)/))) { ensureRowCount(Number(m[1])); log.push(`Počet řad nastaven na ${m[1]}.`); return true; }
    if (/pridej radu/.test(plain)) { ensureRowCount(state.rows.length + 1); log.push('Přidána další řada.'); return true; }
    if (/odeber.*radu/.test(plain)) { ensureRowCount(Math.max(1, state.rows.length - 1)); log.push('Poslední řada odebrána.'); return true; }

    if ((m = plain.match(/pocet panelu na (\d+)/))) return setTotalPanels(Number(m[1]), log);

    if ((m = plain.match(/rada\s*(\d+).*(azimut)\s*(-?\d+(?:[.,]\d+)?)/))) {
      ensureRowCount(Number(m[1])); state.rows[Number(m[1]) - 1].azimuth = toNum(m[3]); log.push(`Řada ${m[1]}: azimut ${m[3]}°.`); return true;
    }
    if ((m = plain.match(/rada\s*(\d+).*(sklon)\s*(-?\d+(?:[.,]\d+)?)/))) {
      ensureRowCount(Number(m[1])); state.rows[Number(m[1]) - 1].tilt = toNum(m[3]); log.push(`Řada ${m[1]}: sklon ${m[3]}°.`); return true;
    }
    if ((m = plain.match(/rada\s*(\d+).*(panelu|panely)\s*(\d+)/))) {
      ensureRowCount(Number(m[1])); state.rows[Number(m[1]) - 1].panels = toNum(m[3]); log.push(`Řada ${m[1]}: ${m[3]} panelů.`); return true;
    }
    if ((m = plain.match(/rada\s*(\d+).*(manual|rucn)/))) {
      ensureRowCount(Number(m[1])); state.rows[Number(m[1]) - 1].layoutMode = 'manual'; log.push(`Řada ${m[1]} přepnuta na ruční umístění.`); return true;
    }
    if ((m = plain.match(/rada\s*(\d+).*(auto|automat)/))) {
      ensureRowCount(Number(m[1])); state.rows[Number(m[1]) - 1].layoutMode = 'auto'; log.push(`Řada ${m[1]} přepnuta na auto umístění.`); return true;
    }
    if ((m = plain.match(/rada\s*(\d+).*(na vysku|portrait)/))) {
      ensureRowCount(Number(m[1])); state.rows[Number(m[1]) - 1].drawOrientation = 'portrait'; log.push(`Řada ${m[1]}: orientace na výšku.`); return true;
    }
    if ((m = plain.match(/rada\s*(\d+).*(na sirku|landscape)/))) {
      ensureRowCount(Number(m[1])); state.rows[Number(m[1]) - 1].drawOrientation = 'landscape'; log.push(`Řada ${m[1]}: orientace na šířku.`); return true;
    }

    const originalTrimmed = String(line || '').trim();
    if ((m = originalTrimmed.match(/(?:zm[eě]ň\s+)?st[řr]ída[čc].*?\sna\s+(.+)/i))) {
      $('inverterType').value = m[1].trim(); log.push(`Střídač změněn na ${m[1].trim()}.`); return true;
    }
    if ((m = originalTrimmed.match(/wallbox\s+na\s+(.+)/i))) {
      $('hasWallbox').checked = true; $('wallboxType').value = m[1].trim(); log.push(`Wallbox změněn na ${m[1].trim()}.`); return true;
    }
    if ((m = originalTrimmed.match(/bateri[ei]\s+na\s+(.+)/i))) {
      $('hasBattery').checked = true; $('batteryType').value = m[1].trim(); log.push(`Baterie změněna na ${m[1].trim()}.`); return true;
    }
    return false;
  }

  function applyChangeCommands(text) {
    const commands = String(text || '')
      .split(/\r?\n|;/)
      .map(v => v.trim())
      .filter(Boolean);

    if (!commands.length) {
      status('Není zadaná žádná změna.', false);
      return;
    }

    const log = [];
    const unknown = [];
    commands.forEach(cmd => {
      const kv = cmd.match(/^([^:=]+)\s*[:=]\s*(.+)$/);
      const ok = kv ? applyStructuredChange(kv[1], kv[2], log) : applyNaturalCommand(cmd, log);
      if (!ok) unknown.push(cmd);
    });

    renderRows();
    updateSummary();
    generatePrompt();

    if (unknown.length && log.length) {
      status(`Použito ${log.length} změn, ${unknown.length} příkazům jsem nerozuměl.`, false);
    } else if (unknown.length) {
      status('Zadaným příkazům jsem nerozuměl.', false);
    } else {
      status(`Použito ${log.length} změn.`);
    }
  }

  async function handleImageInput(file, key) {
    if (!file) {
      state.images[key] = null;
      if (key === 'sketch') state.analysis.sketchPanels = null;
      renderSourcePreviews();
      updateSummary();
      generatePrompt();
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      state.images[key] = reader.result;
      renderSourcePreviews();
      if (key === 'sketch') await runSketchPanelDetection(true);
      updateSummary();
      generatePrompt();
      status(`Obrázek „${key}“ načten.`);
    };
    reader.readAsDataURL(file);
  }

  function getDocHtml(kind) {
    const data = gatherData();
    if (kind === 'e01') return makeE01Html(data);
    if (kind === 'e02') return makeE02Html(data);
    if (kind === 'e03') return makeE03Html(data);
    return '';
  }

  function copyPrompt() {
    const txt = $('promptBox').textContent;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(txt).then(() => status('Prompt zkopírován do schránky.'), () => fallbackCopy(txt));
    } else {
      fallbackCopy(txt);
    }
  }

  function fallbackCopy(txt) {
    const ta = document.createElement('textarea');
    ta.value = txt;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      status('Prompt zkopírován do schránky.');
    } catch (e) {
      status('Kopírování se nepodařilo.', false);
    }
    ta.remove();
  }

  function bindEvents() {
    $('btnGenerate').addEventListener('click', () => {
      if ($('syncOnGenerate')?.checked) syncProjectFromIntake(true);
      updateSummary();
      generatePrompt();
      status('Výstupy jsou připravené.');
    });
    $('btnSaveJson').addEventListener('click', () => {
      const data = gatherData();
      downloadText(`${data.projectNumber || 'projekt'}_fve.json`, makeProjectJson(data), 'application/json;charset=utf-8');
      status('Projekt byl uložen do JSON.');
    });
    $('loadJsonInput').addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const obj = JSON.parse(text);
        applyProjectData(obj);
        status('Projekt byl načten z JSON.');
      } catch (err) {
        console.error(err);
        status('Načtení JSON se nepodařilo.', false);
      } finally {
        e.target.value = '';
      }
    });
    $('btnCopyPrompt').addEventListener('click', copyPrompt);
    $('btnReset').addEventListener('click', () => {
      loadDefaults();
      status('Načtena vzorová data.');
    });
    $('btnAddRow').addEventListener('click', () => {
      if (state.rows.length >= MAX_PROJECT_STRINGS) {
        status('Projekt pracuje maximálně se 2 stringy.', false);
        renderRows();
        return;
      }
      state.rows.push({
        name: `ŘADA ${state.rows.length + 1}`,
        panels: 8,
        azimuth: 180,
        tilt: 35,
        drawX: 0,
        drawY: 0,
        drawRotation: 0,
        drawOrientation: 'landscape',
        drawCols: 4,
        note: '',
        color: '#1f3c88',
        layoutMode: 'auto'
      });
      renderRows();
      updateSummary();
      generatePrompt();
    });
    $('btnAutoLayout').addEventListener('click', autoLayoutRows);
    if ($('btnSyncFromIntake')) $('btnSyncFromIntake').addEventListener('click', () => syncProjectFromIntake(false));
    if ($('btnDetectSketchPanels')) $('btnDetectSketchPanels').addEventListener('click', () => runSketchPanelDetection(false));
    if ($('btnClearSourceFiles')) $('btnClearSourceFiles').addEventListener('click', clearSourceFiles);
    if ($('useSketchTrace')) $('useSketchTrace').addEventListener('change', () => { updateSummary(); generatePrompt(); renderSourcePreviews(); });

    if ($('btnApplyChanges')) {
      $('btnApplyChanges').addEventListener('click', () => applyChangeCommands($('changeCommands').value));
    }
    if ($('btnSampleChanges')) {
      $('btnSampleChanges').addEventListener('click', () => {
        $('changeCommands').value = [
          'změň střídač na HYD 10KTL-3PH',
          'počet řad na 2',
          'row1.panels = 8',
          'řada 2 panelů 6',
          'řada 2 azimut 210',
          'bez wallboxu'
        ].join('\n');
      });
    }

    document.querySelectorAll('#fve-app-root [data-doc]').forEach(btn => {
      btn.addEventListener('click', () => openHtmlDoc(getDocHtml(btn.dataset.doc)));
    });
    document.querySelectorAll('#fve-app-root [data-download]').forEach(btn => {
      btn.addEventListener('click', () => {
        const kind = btn.dataset.download;
        const data = gatherData();
        const suffix = { e01: 'E-01_Technicka_zprava', e02: 'E-02_Jednopolove_schema', e03: 'E-03_Zakres_modulu' }[kind] || kind;
        downloadText(`${data.projectNumber || 'projekt'}_${suffix}.html`, getDocHtml(kind));
        status(`Soubor ${suffix} stažen.`);
      });
    });

    document.querySelectorAll('#fve-app-root input, #fve-app-root select, #fve-app-root textarea').forEach(el => {
      if (['logoUpload', 'roofUpload', 'mapUpload', 'sketchUpload', 'sourceFormUpload', 'loadJsonInput', 'changeCommands'].includes(el.id)) return;
      el.addEventListener('input', () => {
        updateSummary();
        generatePrompt();
      });
      el.addEventListener('change', () => {
        updateSummary();
        generatePrompt();
      });
    });

    $('logoUpload').addEventListener('change', (e) => handleImageInput(e.target.files?.[0], 'logo'));
    $('roofUpload').addEventListener('change', (e) => handleImageInput(e.target.files?.[0], 'roof'));
    $('mapUpload').addEventListener('change', (e) => handleImageInput(e.target.files?.[0], 'map'));
    if ($('sketchUpload')) $('sketchUpload').addEventListener('change', (e) => handleImageInput(e.target.files?.[0], 'sketch'));
    if ($('sourceFormUpload')) $('sourceFormUpload').addEventListener('change', (e) => handleSourceFormInput(e.target.files?.[0]));
  }

let __fveEventsBound = false;

// Original tail called bindEvents(); loadDefaults(); — invoked from React after mount.
export function bootstrapEngine() {
  if (!__fveEventsBound) {
    __fveEventsBound = true;
    bindEvents();
  }
  loadDefaults();
}

export {
  state,
  gatherData,
  updateSummary,
  generatePrompt,
  getDocHtml,
  makeProjectJson,
  applyProjectData,
  renderLivePreview,
  openHtmlDoc,
  downloadText,
  loadDefaults,
  bindEvents,
  copyPrompt,
};
