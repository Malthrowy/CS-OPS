import { useState, useMemo, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const TASK_LIST = ["TGA","Social Group","KSA OT","GCC T2 Cases","KWT T2 Cases","KSA SOME Cases","KWT SOME Cases","GCC SOME Cases","180","OSLO","Keemart Online","Survey","Failed Refund Sheet"];
const TASK_COLORS = ["#6366F1","#0EA5E9","#F59E0B","#10B981","#EF4444","#8B5CF6","#EC4899","#14B8A6","#F97316","#06B6D4","#84CC16","#A855F7","#E11D48"];
const STATUS_OPTIONS = ["Present","Absent","Late","Early Leave","Day Off"];
const PAGES = ["Schedule","Attendance","Queue","Daily Tasks","Live Floor","Break","Heat Map","Audit Log","Notes","Shifts","Performance","Reports"];

// ─── STYLE HELPERS ────────────────────────────────────────────────────────────
const I = (extra={}) => ({ background:"#fff", border:"1px solid #CBD5E1", borderRadius:6, padding:"6px 10px", fontSize:13, color:"#1E293B", outline:"none", width:"100%", boxSizing:"border-box", ...extra });
const CRD = (extra={}) => ({ background:"#fff", borderRadius:10, padding:"16px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.08)", ...extra });
const SBR = (extra={}) => ({ background:"#F1F5F9", borderRadius:8, padding:"10px 16px", marginBottom:12, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", ...extra });
const PBT = (color="#2563EB", extra={}) => ({ background:color, color:"#fff", border:"none", borderRadius:6, padding:"7px 14px", fontSize:13, cursor:"pointer", fontWeight:600, ...extra });
const LBL = { fontSize:12, fontWeight:600, color:"#64748B", marginBottom:4, display:"block" };

// ─── DEFAULT DATA ─────────────────────────────────────────────────────────────
const DEFAULT_SHIFTS = [
  { id:"s1", label:"08:00-17:00", start:"08:00", end:"17:00", color:"#0EA5E9" },
  { id:"s2", label:"10:00-19:00", start:"10:00", end:"19:00", color:"#10B981" },
  { id:"s3", label:"11:00-20:00", start:"11:00", end:"20:00", color:"#F59E0B" },
  { id:"s4", label:"13:00-22:00", start:"13:00", end:"22:00", color:"#6366F1" },
  { id:"s5", label:"14:00-23:00", start:"14:00", end:"23:00", color:"#EF4444" },
  { id:"s6", label:"17:00-02:00", start:"17:00", end:"02:00", color:"#EC4899" },
  { id:"s7", label:"19:00-04:00", start:"19:00", end:"04:00", color:"#06B6D4" },
  { id:"s8", label:"23:00-08:00", start:"23:00", end:"08:00", color:"#8B5CF6" },
];

const DEFAULT_EMPLOYEES = [
  { id:"e1",  name:"Ahmed Mohammed Ali",          tasks:[], role:"Team Lead",    gender:"M" },
  { id:"e2",  name:"Mohammed Almutairi",           tasks:[], role:"Shift Leader", gender:"M" },
  { id:"e3",  name:"Manar Alturaiki",              tasks:[], role:"Shift Leader", gender:"F" },
  { id:"e4",  name:"Abdulaziz Alrusayni",          tasks:[], role:"Shift Leader", gender:"M" },
  { id:"e5",  name:"Yazeed Saad",                  tasks:[], role:"Shift Leader", gender:"M" },
  { id:"e6",  name:"Sultan Ahmed",                 tasks:[], role:"Shift Leader", gender:"M" },
  { id:"e7",  name:"Amar Saleh",                   tasks:[], role:"SME",          gender:"M" },
  { id:"e8",  name:"Amer Alanzi",                  tasks:[], role:"SME",          gender:"M" },
  { id:"e9",  name:"Abdulelah Fawaz Alanazi",      tasks:[], role:"SME",          gender:"M" },
  { id:"e10", name:"Abdulrahman Alghamdi",         tasks:[], role:"SME",          gender:"M" },
  { id:"e11", name:"Emad Alzahrani",               tasks:[], role:"SME",          gender:"M" },
  { id:"e12", name:"Mohammed Nasser Althurwi",     tasks:[], role:"SME",          gender:"M" },
  { id:"e13", name:"Ghazi Alruways",               tasks:[], role:"Agent",        gender:"M" },
  { id:"e14", name:"Mohammed Alharthi",            tasks:[], role:"Agent",        gender:"M" },
  { id:"e15", name:"Shaima Alyami",                tasks:[], role:"Agent",        gender:"F" },
  { id:"e16", name:"Raed Abdullah Allehaidan",     tasks:[], role:"Agent",        gender:"M" },
  { id:"e17", name:"Ali Mohammed Khuzaee",         tasks:[], role:"Agent",        gender:"M" },
  { id:"e18", name:"Ali Haqawi",                   tasks:[], role:"Agent",        gender:"M" },
  { id:"e19", name:"Nejoud Aljheimi",              tasks:[], role:"Agent",        gender:"F" },
  { id:"e20", name:"Abdullah Alzain",              tasks:[], role:"Agent",        gender:"M" },
  { id:"e21", name:"Abdulaziz Muqbil",             tasks:[], role:"Agent",        gender:"M" },
  { id:"e22", name:"Fahad Sager",                  tasks:[], role:"Agent",        gender:"M" },
  { id:"e23", name:"Rayan Almaziad",               tasks:[], role:"Agent",        gender:"M" },
  { id:"e24", name:"Abdulmajeed Mohammed",         tasks:[], role:"Agent",        gender:"M" },
  { id:"e25", name:"Saad Aldahus",                 tasks:[], role:"Agent",        gender:"M" },
  { id:"e26", name:"Khalid Alkhaldi",              tasks:[], role:"Agent",        gender:"M" },
  { id:"e27", name:"Talal Sagga",                  tasks:[], role:"Agent",        gender:"M" },
  { id:"e28", name:"Rashed Aljaloud",              tasks:[], role:"Agent",        gender:"M" },
  { id:"e29", name:"Abdulkarem Alansari",          tasks:[], role:"Agent",        gender:"M" },
  { id:"e30", name:"Mohannad Alamri",              tasks:[], role:"Agent",        gender:"M" },
  { id:"e31", name:"Ahmed Awaji",                  tasks:[], role:"Agent",        gender:"M" },
  { id:"e32", name:"Abdulelah Saud",               tasks:[], role:"Agent",        gender:"M" },
  { id:"e33", name:"Khalid Saeed",                 tasks:[], role:"Agent",        gender:"M" },
  { id:"e34", name:"Nourah Alowayyid",             tasks:[], role:"Agent",        gender:"F" },
  { id:"e35", name:"Lujain Metwalli",              tasks:[], role:"Agent",        gender:"F" },
  { id:"e36", name:"Nasser Alhowimel",             tasks:[], role:"Agent",        gender:"M" },
  { id:"e37", name:"Majed Mohammed",               tasks:[], role:"Agent",        gender:"M" },
  { id:"e38", name:"Ahmed Alshehri",               tasks:[], role:"Agent",        gender:"M" },
  { id:"e39", name:"Faris Rashed",                 tasks:[], role:"Agent",        gender:"M" },
  { id:"e40", name:"Abdullah Alharbi",             tasks:[], role:"Agent",        gender:"M" },
  { id:"e41", name:"Yousef Alrsheedi",             tasks:[], role:"Agent",        gender:"M" },
  { id:"e42", name:"Khaled Almarhom",              tasks:[], role:"Agent",        gender:"M" },
  { id:"e43", name:"Faez Almindah",                tasks:[], role:"Agent",        gender:"M" },
  { id:"e44", name:"Mohammed Jaseem",              tasks:[], role:"Agent",        gender:"M" },
  { id:"e45", name:"Mohammed Alnakhli",            tasks:[], role:"Agent",        gender:"M" },
  { id:"e46", name:"Saud Ali",                     tasks:[], role:"Agent",        gender:"M" },
  { id:"e47", name:"Mohammed Alsahli",             tasks:[], role:"Agent",        gender:"M" },
  { id:"e48", name:"Yasir Seif",                   tasks:[], role:"Agent",        gender:"M" },
  { id:"e49", name:"Sultan Alhamoudi",             tasks:[], role:"Agent",        gender:"M" },
  { id:"e50", name:"Mohammed Alobaid",             tasks:[], role:"Agent",        gender:"M" },
  { id:"e51", name:"Ramiz Ghashem",                tasks:[], role:"Agent",        gender:"M" },
  { id:"e52", name:"Khalid Mnsour",                tasks:[], role:"Agent",        gender:"M" },
  { id:"e53", name:"Khalid Mutlaq",                tasks:[], role:"Agent",        gender:"M" },
  { id:"e54", name:"Ali Harfash",                  tasks:[], role:"Agent",        gender:"M" },
  { id:"e55", name:"Talal Alfaraj",                tasks:[], role:"Agent",        gender:"M" },
  { id:"e56", name:"Bader Alotaibi",               tasks:[], role:"Agent",        gender:"M" },
  { id:"e57", name:"Bandar Almalki",               tasks:[], role:"Agent",        gender:"M" },
  { id:"e58", name:"Ahmad Alharbi",                tasks:[], role:"Agent",        gender:"M" },
  { id:"e59", name:"Mohammed Alshehri",            tasks:[], role:"Agent",        gender:"M" },
  { id:"e60", name:"Abdulelah Alshehri",           tasks:[], role:"Agent",        gender:"M" },
  { id:"e61", name:"Saud Alzahrani",               tasks:[], role:"Agent",        gender:"M" },
  { id:"e62", name:"Faisal Saraan",                tasks:[], role:"Agent",        gender:"M" },
  { id:"e63", name:"Manal Aldosry",                tasks:[], role:"Agent",        gender:"F" },
  { id:"e64", name:"Hajer Alshreif",               tasks:[], role:"Agent",        gender:"F" },
  { id:"e65", name:"Mohammed Alabdullah",          tasks:[], role:"Agent",        gender:"M" },
  { id:"e66", name:"Abdulaziz Alsukait",           tasks:[], role:"Agent",        gender:"M" },
  { id:"e67", name:"Abdulkareem Mokhtar",          tasks:[], role:"Agent",        gender:"M" },
  { id:"e68", name:"Saad Alsaiqer",                tasks:[], role:"Agent",        gender:"M" },
  { id:"e69", name:"Yasser Alghamdi",              tasks:[], role:"Agent",        gender:"M" },
  { id:"e70", name:"Nasser Saad",                  tasks:[], role:"Agent",        gender:"M" },
  { id:"e71", name:"Tariq Alhalmani",              tasks:[], role:"Agent",        gender:"M" },
  { id:"e72", name:"Saad Altukhayfi",              tasks:[], role:"Agent",        gender:"M" },
  { id:"e73", name:"Abdulaziz Massad Alanazi",     tasks:[], role:"Agent",        gender:"M" },
  { id:"e74", name:"Raneem Albaqami",              tasks:[], role:"Agent",        gender:"F" },
  { id:"e75", name:"Sarah Almihbash",              tasks:[], role:"Agent",        gender:"F" },
  { id:"e76", name:"Ahmed Khalid",                 tasks:[], role:"Agent",        gender:"M" },
  { id:"e77", name:"Muath Ahmed",                  tasks:[], role:"Agent",        gender:"M" },
  { id:"e78", name:"Mohamed Aljhani",              tasks:[], role:"Agent",        gender:"M" },
  { id:"e79", name:"Ziyad Ahmed",                  tasks:[], role:"Agent",        gender:"M" },
  { id:"e80", name:"Faisal Alowis",                tasks:[], role:"Agent",        gender:"M" },
  { id:"e81", name:"Abdulaziz Alghamdi",           tasks:[], role:"Agent",        gender:"M" },
  { id:"e82", name:"Salma Aldossarie",             tasks:[], role:"Agent",        gender:"F" },
  { id:"e83", name:"Faisal Abdulrhman",            tasks:[], role:"Agent",        gender:"M" },
  { id:"e84", name:"Bader Alnaafisah",             tasks:[], role:"Agent",        gender:"M" },
  { id:"e85", name:"Faisal Baothman",              tasks:[], role:"Agent",        gender:"M" },
];

function buildDefaultSchedule(employees) {
  const sched = {};
  employees.forEach(emp => {
    sched[emp.id] = { Sunday:"OFF", Monday:"s7", Tuesday:"s7", Wednesday:"s7", Thursday:"s7", Friday:"OFF", Saturday:"OFF" };
  });
  return sched;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function toMin(t) { const [h,m] = t.split(":").map(Number); return h*60+m; }
function calcLateMin(shiftStart, checkIn) {
  let diff = toMin(checkIn) - toMin(shiftStart);
  if (diff > 720) diff -= 1440;
  if (diff < -720) diff += 1440;
  return diff;
}
function fmt(n) { return n>=0 ? `+${n}m` : `${n}m`; }
function pad(n) { return String(n).padStart(2,"0"); }
function todayStr() { return new Date().toISOString().slice(0,10); }
function monthDates(y,m) {
  const days=[];
  const d = new Date(y,m,1);
  while(d.getMonth()===m){ days.push(new Date(d).toISOString().slice(0,10)); d.setDate(d.getDate()+1); }
  return days;
}
function taskColor(t) { const i=TASK_LIST.indexOf(t); return TASK_COLORS[i%TASK_COLORS.length]; }

// ─── TASK PICKER ──────────────────────────────────────────────────────────────
function TaskPicker({ selected=[], onChange }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
      {TASK_LIST.map(t => {
        const on = selected.includes(t);
        const c = taskColor(t);
        return (
          <button key={t} onClick={()=>onChange(on ? selected.filter(x=>x!==t) : [...selected,t])}
            style={{ border:`2px solid ${c}`, borderRadius:20, padding:"3px 10px", fontSize:12, cursor:"pointer", fontWeight:600,
              background: on ? c : "transparent", color: on ? "#fff" : c, transition:"all 0.15s" }}>
            {on && <span style={{marginRight:4}}>✕</span>}{t}
          </button>
        );
      })}
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, width=480 }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#fff", borderRadius:12, width:"100%", maxWidth:width, maxHeight:"90vh", overflow:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid #E2E8F0", position:"sticky", top:0, background:"#fff", zIndex:1 }}>
          <span style={{ fontWeight:700, fontSize:16, color:"#0F2744" }}>{title}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#64748B" }}>×</button>
        </div>
        <div style={{ padding:20 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── SCHEDULE PAGE ────────────────────────────────────────────────────────────
function SchedulePage({ employees, setEmployees, schedule, setSchedule, shifts, canEdit }) {
  const [showAdd, setShowAdd]       = useState(false);
  const [editEmp, setEditEmp]       = useState(null);
  const [newEmp, setNewEmp]         = useState({ name:"", tasks:[], role:"Agent", gender:"M" });
  const [showImport, setShowImport] = useState(false);
  const [importPreview, setImportPreview] = useState([]);
  const [importErrors, setImportErrors]   = useState([]);
  const [showSwap, setShowSwap]     = useState(false);
  const [swapEmp1, setSwapEmp1]     = useState("");
  const [swapEmp2, setSwapEmp2]     = useState("");
  const [swapDay,  setSwapDay]      = useState(DAYS[new Date().getDay()]);
  const [swapDone, setSwapDone]     = useState("");
  // Day filter: {dayName: Set of shiftIds} — null means show all
  const [dayFilters, setDayFilters] = useState({}); // { "Sunday": ["s1","s2"], ... }
  const [filterPopup, setFilterPopup] = useState(null); // dayName currently showing popup
  const fileRef = useRef();
  const today = new Date().getDay();

  function doSwap() {
    if (!swapEmp1 || !swapEmp2 || swapEmp1===swapEmp2) {
      alert("اختر موظفين مختلفين."); return;
    }
    const s1 = (schedule[swapEmp1]||{})[swapDay] || "OFF";
    const s2 = (schedule[swapEmp2]||{})[swapDay] || "OFF";
    setSchedule(prev => ({
      ...prev,
      [swapEmp1]: { ...(prev[swapEmp1]||{}), [swapDay]: s2 },
      [swapEmp2]: { ...(prev[swapEmp2]||{}), [swapDay]: s1 },
    }));
    const e1 = employees.find(e=>e.id===swapEmp1);
    const e2 = employees.find(e=>e.id===swapEmp2);
    const sh1 = shifts.find(s=>s.id===s1);
    const sh2 = shifts.find(s=>s.id===s2);
    setSwapDone(
      `✅ تم التبديل يوم ${swapDay}:\n` +
      `${e1?.name}: ${sh1?.label||"Day Off"} ↔ ${sh2?.label||"Day Off"}\n` +
      `${e2?.name}: ${sh2?.label||"Day Off"} ↔ ${sh1?.label||"Day Off"}`
    );
  }

  // ── Helpers ──
  function addEmployee() {
    if (!newEmp.name.trim()) return;
    const id = "e"+Date.now();
    setEmployees(prev => [...prev, { id, ...newEmp }]);
    setSchedule(prev => ({ ...prev, [id]: { Sunday:"OFF", Monday:"OFF", Tuesday:"OFF", Wednesday:"OFF", Thursday:"OFF", Friday:"OFF", Saturday:"OFF" } }));
    setNewEmp({ name:"", tasks:[], role:"Agent" });
    setShowAdd(false);
  }
  function updateEmployee() {
    setEmployees(prev => prev.map(e => e.id===editEmp.id ? editEmp : e));
    setEditEmp(null);
  }
  function setShift(empId, day, val) {
    setSchedule(prev => ({ ...prev, [empId]: { ...prev[empId], [day]: val } }));
  }

  // ── Resolve cell → shift id ──────────────────────────────────────────────────
  // Accepts: time ranges, shift labels, WO, Leave, PH, OFF, blank, numbers
  function resolveShiftId(raw) {
    if (raw === null || raw === undefined || raw === "") return "OFF";
    const v = String(raw).trim();
    if (!v) return "OFF";

    // ── OFF variants ──
    if (/^(off|wo|w\.o\.?|ph|public.?holiday|holiday|day.?off|leave|annual|إجازة|اجازة|يوم.?إجازة|عطلة|-)$/i.test(v))
      return "OFF";

    // ── Exact label match e.g. "08:00-17:00" ──
    const byLabel = shifts.find(s => s.label.toLowerCase() === v.toLowerCase());
    if (byLabel) return byLabel.id;

    // ── Time range e.g. "08:00-17:00" or "8:00-17:00" or "08:00–17:00" ──
    const rangeMatch = v.match(/^(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})$/);
    if (rangeMatch) {
      const norm = t => t.replace(/^(\d):/, "0$1:");
      const start = norm(rangeMatch[1]);
      const end   = norm(rangeMatch[2]);
      const exact = shifts.find(s => s.start === start && s.end === end);
      if (exact) return exact.id;
      const byStart = shifts.find(s => s.start === start);
      if (byStart) return byStart.id;
      // Closest by start
      const startMin = toMin(start);
      let closest = shifts[0], minDiff = Infinity;
      shifts.forEach(s => { const diff=Math.abs(toMin(s.start)-startMin); if(diff<minDiff){minDiff=diff;closest=s;} });
      return closest.id;
    }

    // ── Single time "08:00" → match start ──
    const timeMatch = v.match(/^(\d{1,2}:\d{2})$/);
    if (timeMatch) {
      const norm = t => t.replace(/^(\d):/, "0$1:");
      const s = shifts.find(sh => sh.start === norm(timeMatch[1]));
      if (s) return s.id;
    }

    // ── Number only → try as hour "8" → "08:00" ──
    if (/^\d{1,2}$/.test(v)) {
      const h = parseInt(v);
      const hStr = pad(h)+":00";
      const s = shifts.find(sh => sh.start === hStr);
      if (s) return s.id;
    }

    // ── Legacy "Shift N" names ──
    if (/^shift\s*\d+$/i.test(v)) {
      const byOld = shifts.find(s => s.label.toLowerCase() === v.toLowerCase());
      if (byOld) return byOld.id;
    }

    return "OFF";
  }

  // ── Parse Excel file — handles ANY structure ──────────────────────────────────
  function handleFile(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    // Handle CSV separately
    if (file.name.toLowerCase().endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const text = ev.target.result;
          const rows = text.split("\n").map(r =>
            r.split(",").map(c => c.replace(/^"|"$/g,"").trim())
          ).filter(r => r.some(c=>c));
          if (rows.length < 2) { alert("CSV is empty."); return; }
          parseScheduleRows(rows);
        } catch(err) { alert("Error reading CSV:\n"+err.message); }
      };
      reader.readAsText(file, "UTF-8");
      return;
    }

    // Excel
    const reader = new FileReader();
    reader.onload = async ev => {
      try {
        const XLSX = await waitForXLSX();
        const wb   = XLSX.read(ev.target.result, { type:"array", cellDates:false });
        const ws   = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header:1, defval:"", raw:true });
        if (!rows.length) { alert("الملف فارغ."); return; }
        parseScheduleRows(rows);
      } catch(err) {
        console.error("Excel import error:", err);
        alert("خطأ في قراءة الملف:\n" + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function parseScheduleRows(rows) {
        // ── Day name aliases (Arabic + English) ──────────────────────────────
        const DAY_MAP = {
          sunday:["sunday","sun","ahad","الأحد","احد","اح"],
          monday:["monday","mon","ithnain","الاثنين","اثنين","اث"],
          tuesday:["tuesday","tue","thulatha","الثلاثاء","ثلاثاء","ثل"],
          wednesday:["wednesday","wed","arbia","الأربعاء","اربعاء","ار"],
          thursday:["thursday","thu","khamis","الخميس","خميس","خم"],
          friday:["friday","fri","jumua","الجمعة","جمعة","جم"],
          saturday:["saturday","sat","sabt","السبت","سبت","سب"],
        };
        const DAY_KEYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

        function matchDay(cell) {
          const c = String(cell).trim().toLowerCase().replace(/\s+/g,"");
          for (const [key, aliases] of Object.entries(DAY_MAP)) {
            if (aliases.some(a => c.includes(a.toLowerCase()))) return key.charAt(0).toUpperCase()+key.slice(1);
          }
          // Try date → day-of-week
          if (/\d/.test(c)) {
            try {
              // Excel serial number
              const serial = Number(cell);
              if (!isNaN(serial) && serial > 40000 && serial < 60000) {
                const jsDate = new Date(Math.round((serial - 25569) * 86400 * 1000));
                return DAYS[jsDate.getDay()];
              }
              // Date string e.g. "3/17/2026", "17-03-2026"
              const d = new Date(String(cell));
              if (!isNaN(d)) return DAYS[d.getDay()];
            } catch {}
          }
          return null;
        }

        function isNameHeader(cell) {
          return /name|employee|موظف|اسم|الموظف|الاسم/i.test(String(cell).trim());
        }

        function isNumOrEmpty(cell) {
          const s = String(cell).trim();
          return !s || /^\d+$/.test(s);
        }

        // ── Find the header row (contains day names or "Name") ──────────────
        let headerRowIdx = -1;
        let colMap = {}; // colIdx → DayName
        let nameCol = 0;

        for (let ri = 0; ri < Math.min(10, rows.length); ri++) {
          const row = rows[ri];
          const tmpMap = {};
          let dayCount = 0;
          let hasName = false;

          row.forEach((cell, ci) => {
            const d = matchDay(cell);
            if (d) { tmpMap[ci] = d; dayCount++; }
            if (isNameHeader(cell)) { hasName = true; nameCol = ci; }
          });

          if (dayCount >= 3) {
            // Good header row — has enough day columns
            colMap = tmpMap;
            headerRowIdx = ri;
            // Also check same row for name col
            if (!hasName) {
              // Name col is probably col 0 or first non-day col
              for (let ci = 0; ci < row.length; ci++) {
                if (!colMap[ci]) { nameCol = ci; break; }
              }
            }
            break;
          }

          if (hasName && dayCount >= 1) {
            colMap = tmpMap;
            headerRowIdx = ri;
            break;
          }
        }

        // ── If still no day columns, try each row looking for time ranges ───
        if (Object.keys(colMap).length === 0) {
          // Maybe the file has NO day header — just name + shift values
          // In this case try row 0 as header
          headerRowIdx = 0;
          nameCol = 0;
          // We'll map columns by position: col0=name, rest=days in order
          DAY_KEYS.forEach((day, i) => { colMap[i+1] = day; });
        }

        const dataStart = headerRowIdx + 1;

        // ── Parse employee rows ──────────────────────────────────────────────
        const preview = [];
        const warnings = [];

        for (let ri = dataStart; ri < rows.length; ri++) {
          const row = rows[ri];
          const rawName = String(row[nameCol] || "").trim();
          if (!rawName || isNumOrEmpty(rawName) || isNameHeader(rawName)) continue;
          // Skip rows that look like sub-headers (all day names)
          if (row.filter(c => matchDay(c)).length >= 5) continue;

          const days = {
            Sunday:"OFF", Monday:"OFF", Tuesday:"OFF",
            Wednesday:"OFF", Thursday:"OFF", Friday:"OFF", Saturday:"OFF"
          };

          Object.entries(colMap).forEach(([ci, dayName]) => {
            const raw = String(row[Number(ci)] ?? "").trim();
            if (!raw) return;
            const sid = resolveShiftId(raw);
            days[dayName] = sid;
            if (raw && sid === "OFF") {
              const skip = /^(off|wo|w\.o|ph|holiday|day.?off|leave|annual|إجازة|اجازة|يوم|عطلة|休|-)$/i;
              if (!skip.test(raw)) warnings.push(`"${rawName}" · ${dayName}: "${raw}" → OFF`);
            }
          });

          preview.push({ name:rawName, role:"Agent", tasks:[], days });
        }

        if (preview.length === 0) {
          alert(
            "⚠️ لم يتم العثور على بيانات.\n\n" +
            "تأكد من أن الملف يحتوي على:\n" +
            "• صف يحتوي على أيام الأسبوع (Sunday, Monday... أو الأحد, الاثنين...)\n" +
            "• عمود يحتوي على أسماء الموظفين\n" +
            "• قيم الشفتات: وقت مثل 08:00-17:00 أو OFF"
          );
          return;
        }

        setImportPreview(preview);
        setImportErrors(warnings);
        setShowImport(true);

      } catch(err) {
        console.error("Excel import error:", err);
        alert("خطأ في قراءة الملف:\n" + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // ── Confirm import: update existing employees or add new ones ──
  function confirmImport() {
    importPreview.forEach(row => {
      // Try to match existing employee by name (case-insensitive)
      const existing = employees.find(e => e.name.toLowerCase()===row.name.toLowerCase());
      if (existing) {
        // Update schedule only (preserve tasks/role unless provided)
        if (row.role && row.role!=="Agent") setEmployees(prev=>prev.map(e=>e.id===existing.id?{...e,role:row.role,tasks:row.tasks.length?row.tasks:e.tasks}:e));
        setSchedule(prev => ({ ...prev, [existing.id]: row.days }));
      } else {
        // New employee
        const id = "e"+Date.now()+Math.random();
        setEmployees(prev => [...prev, { id, name:row.name, role:row.role||"Agent", tasks:row.tasks }]);
        setSchedule(prev => ({ ...prev, [id]: row.days }));
      }
    });
    setShowImport(false);
    setImportPreview([]);
    setImportErrors([]);
  }

  // ── Download template with two-row header ──
  async function downloadTemplate() {
    let XLSX;
    try { XLSX = await waitForXLSX(); } catch(e) { alert(e.message); return; }
    const row1 = ["Name", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const examples = employees.slice(0,5).map(emp => {
      const row = [emp.name];
      DAYS.forEach(day => {
        const sid = (schedule[emp.id]||{})[day]||"OFF";
        const sh  = shifts.find(s=>s.id===sid);
        row.push(sh ? sh.label : "OFF");
      });
      return row;
    });
    // Add blank rows for remaining employees
    employees.slice(5).forEach(emp => {
      examples.push([emp.name, ...DAYS.map(day => {
        const sid = (schedule[emp.id]||{})[day]||"OFF";
        const sh  = shifts.find(s=>s.id===sid);
        return sh ? sh.label : "OFF";
      })]);
    });
    const ws = XLSX.utils.aoa_to_sheet([row1, ...examples]);
    ws["!cols"] = [{ wch:28 }, ...Array(7).fill({ wch:14 })];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Schedule");
    XLSX.writeFile(wb, "schedule-template.xlsx");
  }

  async function downloadCSV() {
    const rows = [["Name","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]];
    employees.forEach(emp => {
      const row = [emp.name];
      DAYS.forEach(day => {
        const sid = (schedule[emp.id]||{})[day]||"OFF";
        const sh  = shifts.find(s=>s.id===sid);
        row.push(sh ? sh.label : "OFF");
      });
      rows.push(row);
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "schedule.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  // Week preview
  const weekCards = DAYS.map((day, di) => {
    const groups = {};
    employees.forEach(emp => {
      const sid = (schedule[emp.id]||{})[day];
      if (!sid || sid==="OFF") return;
      if (!groups[sid]) groups[sid]=[];
      groups[sid].push(emp.name);
    });
    return { day, di, groups };
  });

  return (
    <div>
      {/* ── Toolbar ── */}
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744", flex:1 }}>📅 Weekly Schedule</span>
        <button style={PBT("#2563EB")} onClick={()=>setShowAdd(true)}>+ Add</button>
        <button style={PBT("#475569")} onClick={()=>fileRef.current.click()}>📥 Import</button>
        <div style={{ display:"flex", gap:4 }}>
          <button style={PBT("#10B981",{borderRadius:"6px 0 0 6px", paddingRight:8})} onClick={downloadTemplate}>⬇️ XLSX</button>
          <button style={PBT("#10B981",{borderRadius:"0 6px 6px 0", paddingLeft:8, borderLeft:"1px solid rgba(255,255,255,0.3)"})} onClick={downloadCSV}>⬇️ CSV</button>
        </div>
        {canEdit && (
          <button style={PBT("#8B5CF6")} onClick={()=>{ setShowSwap(true); setSwapDone(""); }}>🔄 Swap</button>
        )}
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={handleFile}/>
      </div>

      {/* ── Schedule Table ── */}
      <div style={{ ...CRD(), overflowX:"auto", marginBottom:20 }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#F8FAFC" }}>
              <th style={{ padding:"10px 12px", textAlign:"left", fontWeight:700, color:"#0F2744",
                borderBottom:"2px solid #E2E8F0", minWidth:180 }}>Employee</th>
              {DAYS.map((day, di) => {
                const now2   = new Date();
                const diff   = di - now2.getDay();
                const d2     = new Date(now2); d2.setDate(now2.getDate()+diff);
                const dateStr = d2.getDate()+"/"+(d2.getMonth()+1);
                const activeFilters = dayFilters[day]||[];
                const hasFilter = activeFilters.length > 0;
                return (
                  <th key={day} style={{ padding:"8px 6px", textAlign:"center", fontWeight:700,
                    color: di===today?"#2563EB":"#0F2744",
                    borderBottom:"2px solid #E2E8F0",
                    background: di===today?"#EFF6FF":"transparent", minWidth:110, position:"relative" }}>
                    {/* Day name + date */}
                    <div>{day.slice(0,3)}</div>
                    <div style={{ fontSize:10, color:di===today?"#2563EB":"#94A3B8", fontWeight:600 }}>{dateStr}</div>
                    {di===today && <div style={{ fontSize:9, color:"#2563EB", fontWeight:700 }}>TODAY</div>}
                    {/* Filter button */}
                    <button onClick={()=>setFilterPopup(filterPopup===day?null:day)}
                      title="Filter by shift"
                      style={{ background: hasFilter?"#2563EB":"rgba(100,116,139,0.1)",
                        border:"none", borderRadius:4, cursor:"pointer", fontSize:9,
                        padding:"2px 5px", marginTop:3, color:hasFilter?"#fff":"#64748B",
                        fontWeight:700, display:"block", margin:"3px auto 0" }}>
                      {hasFilter ? `🔽 ${activeFilters.length}` : "🔽"}
                    </button>
                    {/* Filter dropdown popup */}
                    {filterPopup===day && (
                      <div style={{ position:"absolute", top:"100%", left:"50%", transform:"translateX(-50%)",
                        background:"#fff", border:"1px solid #E2E8F0", borderRadius:10,
                        boxShadow:"0 8px 24px rgba(0,0,0,0.15)", zIndex:200, padding:10,
                        minWidth:160, textAlign:"left" }}>
                        <div style={{ fontSize:11, fontWeight:700, color:"#0F2744", marginBottom:6 }}>
                          Filter — {day}
                        </div>
                        {/* Clear */}
                        <button onClick={()=>{ setDayFilters(p=>({...p,[day]:[]})); }}
                          style={{ ...PBT("#94A3B8",{ fontSize:10, padding:"3px 8px", width:"100%", marginBottom:6 }) }}>
                          ✕ Show All
                        </button>
                        {/* Shift options */}
                        {shifts.map(s => {
                          const sel = activeFilters.includes(s.id);
                          return (
                            <div key={s.id} onClick={()=>{
                              setDayFilters(p=>{
                                const cur = p[day]||[];
                                return {...p, [day]: sel ? cur.filter(x=>x!==s.id) : [...cur,s.id]};
                              });
                            }} style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 6px",
                              borderRadius:6, cursor:"pointer", marginBottom:2,
                              background:sel?s.color+"18":"transparent",
                              border:sel?`1px solid ${s.color}40`:"1px solid transparent" }}>
                              <div style={{ width:10, height:10, borderRadius:3, background:s.color, flexShrink:0 }}/>
                              <span style={{ fontSize:11, fontWeight:sel?700:400, color:sel?s.color:"#475569" }}>
                                {s.label}
                              </span>
                              {sel && <span style={{ marginLeft:"auto", fontSize:10, color:s.color }}>✓</span>}
                            </div>
                          );
                        })}
                        {/* Day Off option */}
                        {[["OFF","🔘 Day Off","#64748B"],["LEAVE","🏖️ Leave","#F59E0B"],["PH","🎌 Public Holiday","#8B5CF6"]].map(([v,l,c])=>{
                          const sel=activeFilters.includes(v);
                          return (
                            <div key={v} onClick={()=>{
                              setDayFilters(p=>{
                                const cur=p[day]||[];
                                return {...p,[day]:sel?cur.filter(x=>x!==v):[...cur,v]};
                              });
                            }} style={{ display:"flex",alignItems:"center",gap:6,padding:"4px 6px",
                              borderRadius:6,cursor:"pointer",marginBottom:2,
                              background:sel?c+"18":"transparent",
                              border:sel?`1px solid ${c}40`:"1px solid transparent"}}>
                              <span style={{fontSize:11,fontWeight:sel?700:400,color:sel?c:"#475569"}}>{l}</span>
                              {sel&&<span style={{marginLeft:"auto",fontSize:10,color:c}}>✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </th>
                );
              })}
              <th style={{ padding:"10px 8px", borderBottom:"2px solid #E2E8F0" }}></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp,ri) => {
              // Apply day filters — hide row if ALL filtered days don't match
              const isFiltered = DAYS.some(day => {
                const f = dayFilters[day]||[];
                if (f.length===0) return false;
                const val = (schedule[emp.id]||{})[day]||"OFF";
                return !f.includes(val);
              });
              // Show row only if it passes ALL active day filters
              const passesFilter = DAYS.every(day => {
                const f = dayFilters[day]||[];
                if (f.length===0) return true;
                const val = (schedule[emp.id]||{})[day]||"OFF";
                return f.includes(val);
              });
              if (!passesFilter) return null;
              return (
              <tr key={emp.id} style={{ background: ri%2===0?"#fff":"#F8FAFC" }}>
                <td style={{ padding:"8px 12px", fontWeight:600, color:"#1E293B" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span>{emp.name}</span>
                    <span style={{ fontSize:9, fontWeight:800, padding:"1px 5px", borderRadius:4,
                      background:emp.gender==="F"?"#FCE7F3":"#EFF6FF",
                      color:emp.gender==="F"?"#BE185D":"#1D4ED8",
                      border:emp.gender==="F"?"1px solid #F9A8D4":"1px solid #BFDBFE" }}>
                      {emp.gender||"M"}
                    </span>
                  </div>
                  <div style={{ fontSize:11, color:"#94A3B8" }}>{emp.role}</div>
                </td>
                {DAYS.map((day,di) => {
                  const val = (schedule[emp.id]||{})[day]||"OFF";
                  const sh  = shifts.find(s=>s.id===val);
                  const activeF = dayFilters[day]||[];
                  const dimmed  = activeF.length>0 && !activeF.includes(val);
                  return (
                    <td key={day} style={{ padding:"6px", textAlign:"center",
                      background: di===today?"#EFF6FF":"transparent",
                      opacity: dimmed ? 0.25 : 1 }}>
                      <select value={val} onChange={e=>setShift(emp.id,day,e.target.value)}
                        style={{ ...I(), padding:"4px 6px", fontSize:11,
                          border:`2px solid ${val==="LEAVE"?"#F59E0B":val==="PH"?"#8B5CF6":sh?sh.color:"#CBD5E1"}`,
                          background:val==="LEAVE"?"#FEF3C7":val==="PH"?"#F3E8FF":sh?sh.color+"18":"#fff",
                          color:val==="LEAVE"?"#92400E":val==="PH"?"#6D28D9":sh?sh.color:"#64748B",
                          fontWeight:600, cursor:"pointer" }}>
                        <option value="OFF">🔘 Day Off</option>
                        <option value="LEAVE">🏖️ Leave</option>
                        <option value="PH">🎌 PH</option>
                        {shifts.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </td>
                  );
                })}
                <td style={{ padding:"6px", textAlign:"center" }}>
                  <button onClick={()=>setEditEmp({...emp})}
                    style={{ background:"none", border:"1px solid #CBD5E1", borderRadius:6,
                      padding:"4px 8px", cursor:"pointer", fontSize:14 }}>✏️</button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Close filter popup when clicking outside */}
      {filterPopup && (
        <div style={{ position:"fixed", inset:0, zIndex:199 }}
          onClick={()=>setFilterPopup(null)}/>
      )}

      {/* Week Preview Cards */}
      <div style={{ marginBottom:8, fontWeight:700, fontSize:14, color:"#0F2744" }}>📋 Week Preview</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:10 }}>
        {weekCards.map(({day,di,groups}) => (
          <div key={day} style={{ ...CRD({ padding:12 }), border: di===today ? "2px solid #2563EB" : "1px solid #E2E8F0" }}>
            <div style={{ fontWeight:700, fontSize:12, color: di===today?"#2563EB":"#475569", marginBottom:8 }}>{day.slice(0,3)}</div>
            {Object.keys(groups).length===0
              ? <div style={{ fontSize:11, color:"#94A3B8" }}>All Off</div>
              : Object.entries(groups).map(([sid,names]) => {
                  if (sid==="LEAVE") return (
                    <div key="LEAVE" style={{ marginBottom:6 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:"#92400E", marginBottom:2 }}>🏖️ Leave</div>
                      {names.map(n=><div key={n} style={{ fontSize:11, color:"#92400E", padding:"1px 0" }}>• {n.split(" ")[0]}</div>)}
                    </div>
                  );
                  if (sid==="PH") return (
                    <div key="PH" style={{ marginBottom:6 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:"#6D28D9", marginBottom:2 }}>🎌 Public Holiday</div>
                      {names.map(n=><div key={n} style={{ fontSize:11, color:"#6D28D9", padding:"1px 0" }}>• {n.split(" ")[0]}</div>)}
                    </div>
                  );
                  const sh = shifts.find(s=>s.id===sid);
                  return (
                    <div key={sid} style={{ marginBottom:6 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:sh?.color||"#888", marginBottom:2 }}>{sh?.label} {sh?.start}</div>
                      {names.map(n => <div key={n} style={{ fontSize:11, color:"#334155", padding:"1px 0" }}>• {n.split(" ")[0]}</div>)}
                    </div>
                  );
                })
            }
          </div>
        ))}
      </div>

      {/* Swap Shift Modal */}
      {showSwap && (
        <Modal title="🔄 Swap Shift — تبديل الشفتات" onClose={()=>setShowSwap(false)} width={480}>
          <div style={{ background:"#F3E8FF", border:"1px solid #C4B5FD", borderRadius:8,
            padding:"10px 14px", marginBottom:14, fontSize:12, color:"#5B21B6" }}>
            اختر موظفين واليوم المراد تبديل شفتاتهم — سيتم التبديل فوراً وحفظه تلقائياً.
          </div>

          <label style={LBL}>اليوم</label>
          <select value={swapDay} onChange={e=>{ setSwapDay(e.target.value); setSwapDone(""); }}
            style={{ ...I(), marginBottom:12 }}>
            {DAYS.map(d => <option key={d}>{d}</option>)}
          </select>

          <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:10, alignItems:"end", marginBottom:14 }}>
            <div>
              <label style={LBL}>الموظف الأول</label>
              <select value={swapEmp1} onChange={e=>{ setSwapEmp1(e.target.value); setSwapDone(""); }}
                style={I()}>
                <option value="">— اختر —</option>
                {employees.map(e => {
                  const sid = (schedule[e.id]||{})[swapDay];
                  const sh = shifts.find(s=>s.id===sid);
                  return (
                    <option key={e.id} value={e.id}>
                      {e.name} ({sh?.label||"Day Off"})
                    </option>
                  );
                })}
              </select>
            </div>
            <div style={{ paddingBottom:8, fontSize:22, textAlign:"center", color:"#8B5CF6" }}>⇄</div>
            <div>
              <label style={LBL}>الموظف الثاني</label>
              <select value={swapEmp2} onChange={e=>{ setSwapEmp2(e.target.value); setSwapDone(""); }}
                style={I()}>
                <option value="">— اختر —</option>
                {employees.filter(e=>e.id!==swapEmp1).map(e => {
                  const sid = (schedule[e.id]||{})[swapDay];
                  const sh = shifts.find(s=>s.id===sid);
                  return (
                    <option key={e.id} value={e.id}>
                      {e.name} ({sh?.label||"Day Off"})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Preview */}
          {swapEmp1 && swapEmp2 && (() => {
            const e1 = employees.find(e=>e.id===swapEmp1);
            const e2 = employees.find(e=>e.id===swapEmp2);
            const s1 = shifts.find(s=>s.id===(schedule[swapEmp1]||{})[swapDay]);
            const s2 = shifts.find(s=>s.id===(schedule[swapEmp2]||{})[swapDay]);
            return (
              <div style={{ background:"#F8FAFC", borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:12 }}>
                <div style={{ fontWeight:700, color:"#0F2744", marginBottom:6 }}>معاينة التبديل — {swapDay}</div>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                  <div style={{ background: s1?.color+"20"||"#F1F5F9", border:`1px solid ${s1?.color||"#CBD5E1"}`,
                    borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:700, color:s1?.color||"#64748B" }}>
                    {e1?.name.split(" ")[0]}: {s1?.label||"Day Off"}
                  </div>
                  <span style={{ fontSize:16, color:"#8B5CF6" }}>⇄</span>
                  <div style={{ background: s2?.color+"20"||"#F1F5F9", border:`1px solid ${s2?.color||"#CBD5E1"}`,
                    borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:700, color:s2?.color||"#64748B" }}>
                    {e2?.name.split(" ")[0]}: {s2?.label||"Day Off"}
                  </div>
                </div>
              </div>
            );
          })()}

          {swapDone && (
            <div style={{ background:"#F0FDF4", border:"1px solid #86EFAC", borderRadius:8,
              padding:"10px 14px", marginBottom:12, fontSize:12, color:"#166534",
              fontWeight:600, whiteSpace:"pre-line" }}>{swapDone}</div>
          )}

          <div style={{ display:"flex", gap:8 }}>
            <button style={PBT("#8B5CF6",{flex:1, padding:"10px"})} onClick={doSwap}
              disabled={!swapEmp1||!swapEmp2}>
              🔄 تأكيد التبديل
            </button>
            <button style={PBT("#94A3B8",{flex:"none", padding:"10px 16px"})}
              onClick={()=>setShowSwap(false)}>إغلاق</button>
          </div>
        </Modal>
      )}

      {/* Add Employee Modal */}
      {showAdd && (
        <Modal title="Add Employee" onClose={()=>setShowAdd(false)}>
          <label style={LBL}>Name</label>
          <input style={{ ...I(), marginBottom:12 }} value={newEmp.name} onChange={e=>setNewEmp(p=>({...p,name:e.target.value}))} placeholder="Full name"/>
          <label style={LBL}>Role</label>
          <select style={{ ...I(), marginBottom:12 }} value={newEmp.role} onChange={e=>setNewEmp(p=>({...p,role:e.target.value}))}>
            {["Agent","Shift Leader","Team Lead","SME","Other"].map(r=><option key={r}>{r}</option>)}
          </select>
          <label style={LBL}>Gender</label>
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            {[["M","Male 👨"],["F","Female 👩"]].map(([v,l])=>(
              <button key={v} onClick={()=>setNewEmp(p=>({...p,gender:v}))}
                style={{ flex:1, border:`2px solid ${newEmp.gender===v?(v==="F"?"#BE185D":"#1D4ED8"):"#CBD5E1"}`,
                  borderRadius:8, padding:"8px", cursor:"pointer", fontWeight:700, fontSize:13,
                  background: newEmp.gender===v?(v==="F"?"#FCE7F3":"#EFF6FF"):"#fff",
                  color: newEmp.gender===v?(v==="F"?"#BE185D":"#1D4ED8"):"#64748B" }}>{l}</button>
            ))}
          </div>
          <label style={LBL}>Tasks</label>
          <div style={{ marginBottom:16 }}><TaskPicker selected={newEmp.tasks} onChange={tasks=>setNewEmp(p=>({...p,tasks}))}/></div>
          <button style={PBT("#2563EB",{width:"100%"})} onClick={addEmployee}>Add Employee</button>
        </Modal>
      )}

      {/* Edit Employee Modal */}
      {editEmp && (
        <Modal title="Edit Employee" onClose={()=>setEditEmp(null)}>
          <label style={LBL}>Name</label>
          <input style={{ ...I(), marginBottom:12 }} value={editEmp.name} onChange={e=>setEditEmp(p=>({...p,name:e.target.value}))}/>
          <label style={LBL}>Role</label>
          <select style={{ ...I(), marginBottom:12 }} value={editEmp.role} onChange={e=>setEditEmp(p=>({...p,role:e.target.value}))}>
            {["Agent","Shift Leader","Team Lead","SME","Other"].map(r=><option key={r}>{r}</option>)}
          </select>
          <label style={LBL}>Gender</label>
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            {[["M","Male 👨"],["F","Female 👩"]].map(([v,l])=>(
              <button key={v} onClick={()=>setEditEmp(p=>({...p,gender:v}))}
                style={{ flex:1, border:`2px solid ${editEmp.gender===v?(v==="F"?"#BE185D":"#1D4ED8"):"#CBD5E1"}`,
                  borderRadius:8, padding:"8px", cursor:"pointer", fontWeight:700, fontSize:13,
                  background: editEmp.gender===v?(v==="F"?"#FCE7F3":"#EFF6FF"):"#fff",
                  color: editEmp.gender===v?(v==="F"?"#BE185D":"#1D4ED8"):"#64748B" }}>{l}</button>
            ))}
          </div>
          <label style={LBL}>Tasks</label>
          <div style={{ marginBottom:16 }}><TaskPicker selected={editEmp.tasks} onChange={tasks=>setEditEmp(p=>({...p,tasks}))}/></div>
          <button style={PBT("#2563EB",{width:"100%"})} onClick={updateEmployee}>Save Changes</button>
        </Modal>
      )}

      {/* Import Preview Modal */}
      {showImport && (
        <Modal title={`📥 Import Preview — ${importPreview.length} employees`} onClose={()=>setShowImport(false)} width={820}>
          {/* Format guide */}
          <div style={{ background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#1D4ED8" }}>
            <strong>Accepted values per cell:</strong> &nbsp;
            {shifts.map(s=><span key={s.id} style={{ marginRight:8 }}><strong>{s.label}</strong> · <code>{s.start}-{s.end}</code> · <code>{s.start}</code> · <code>{s.id.replace("s","")}</code></span>)}
            &nbsp;· <code>OFF</code> · (empty)
          </div>

          {/* Warnings */}
          {importErrors.length>0 && (
            <div style={{ background:"#FEF9C3", border:"1px solid #F59E0B", borderRadius:8, padding:"8px 14px", marginBottom:12, fontSize:12, color:"#92400E" }}>
              ⚠️ {importErrors.length} warning(s): {importErrors.slice(0,3).join(" · ")}{importErrors.length>3?` ... +${importErrors.length-3} more`:""}
            </div>
          )}

          {/* Preview table */}
          <div style={{ overflowX:"auto", maxHeight:380, overflowY:"auto", marginBottom:14 }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr style={{ background:"#F8FAFC", position:"sticky", top:0 }}>
                  <th style={{ padding:"8px 10px", textAlign:"left", fontWeight:700, color:"#0F2744", borderBottom:"2px solid #E2E8F0", minWidth:160 }}>Name</th>
                  <th style={{ padding:"8px 6px", fontWeight:700, color:"#0F2744", borderBottom:"2px solid #E2E8F0" }}>Role</th>
                  {DAYS.map(d=>(
                    <th key={d} style={{ padding:"8px 6px", textAlign:"center", fontWeight:700, color:"#0F2744", borderBottom:"2px solid #E2E8F0", minWidth:80 }}>{d.slice(0,3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importPreview.map((row,i)=>{
                  const existing = employees.find(e=>e.name.toLowerCase()===row.name.toLowerCase());
                  return (
                    <tr key={i} style={{ background: existing ? "#F0FDF4" : i%2===0?"#fff":"#F8FAFC" }}>
                      <td style={{ padding:"6px 10px", fontWeight:600, color:"#1E293B" }}>
                        {row.name}
                        {existing && <span style={{ marginLeft:6, fontSize:10, background:"#10B981", color:"#fff", borderRadius:8, padding:"1px 6px" }}>update</span>}
                        {!existing && <span style={{ marginLeft:6, fontSize:10, background:"#2563EB", color:"#fff", borderRadius:8, padding:"1px 6px" }}>new</span>}
                      </td>
                      <td style={{ padding:"6px", color:"#475569", textAlign:"center" }}>{row.role}</td>
                      {DAYS.map(d=>{
                        const sid = row.days[d];
                        const sh = shifts.find(s=>s.id===sid);
                        return (
                          <td key={d} style={{ padding:"4px", textAlign:"center" }}>
                            {sh
                              ? <span style={{ background:sh.color+"20", color:sh.color, border:`1px solid ${sh.color}50`,
                                  borderRadius:6, padding:"2px 6px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
                                  {sh.label}<br/><span style={{fontSize:10}}>{sh.start}</span>
                                </span>
                              : <span style={{ color:"#94A3B8", fontSize:11 }}>OFF</span>
                            }
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display:"flex", gap:8 }}>
            <button style={PBT("#10B981",{flex:1,padding:"10px"})} onClick={confirmImport}>
              ✅ Confirm Import ({importPreview.filter(r=>employees.find(e=>e.name.toLowerCase()===r.name.toLowerCase())).length} updates · {importPreview.filter(r=>!employees.find(e=>e.name.toLowerCase()===r.name.toLowerCase())).length} new)
            </button>
            <button style={PBT("#EF4444",{flex:"none",padding:"10px 20px"})} onClick={()=>setShowImport(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ATTENDANCE PAGE ──────────────────────────────────────────────────────────
function AttendancePage({ employees, schedule, shifts, attendance, setAttendance }) {
  const [date, setDate] = useState(todayStr());

  // ── Auto-detect active shift based on current time ──
  function detectActiveShift() {
    if (!shifts.length) return "";
    const now = new Date();
    const nowMin = now.getHours()*60 + now.getMinutes();
    // Find which shift is currently active (handles midnight-crossing)
    for (const sh of shifts) {
      const start = toMin(sh.start);
      const end   = toMin(sh.end);
      if (end > start) {
        // Normal shift e.g. 08:00–16:00
        if (nowMin >= start && nowMin < end) return sh.id;
      } else {
        // Midnight-crossing shift e.g. 20:00–04:00
        if (nowMin >= start || nowMin < end) return sh.id;
      }
    }
    // No exact match → pick the shift whose start is closest before now
    let closest = shifts[0];
    let minDiff = Infinity;
    for (const sh of shifts) {
      let diff = nowMin - toMin(sh.start);
      if (diff < 0) diff += 1440;
      if (diff < minDiff) { minDiff = diff; closest = sh; }
    }
    return closest.id;
  }

  const [activeShift, setActiveShift] = useState(() => detectActiveShift());
  const [autoShift, setAutoShift] = useState(true); // track if user manually overrode

  // Re-detect when date changes back to today
  function handleDateChange(d) {
    setDate(d);
    if (d === todayStr()) {
      setActiveShift(detectActiveShift());
      setAutoShift(true);
    }
  }

  function handleShiftClick(id) {
    setActiveShift(id);
    setAutoShift(false);
  }

  const dayName = DAYS[new Date(date+"T12:00:00").getDay()];
  const activeShiftObj = shifts.find(s=>s.id===activeShift);

  const shiftEmployees = useMemo(() => {
    return employees.filter(emp => (schedule[emp.id]||{})[dayName] === activeShift);
  }, [employees, schedule, activeShift, dayName]);

  function getAtt(empId) {
    return ((attendance[date]||{})[empId]) || { status:"Present", checkIn:"", checkOut:"", lateMin:0, earlyMin:0, note:"", workDuration:"" };
  }

  // Calculate work duration in minutes between checkIn and checkOut (handles midnight crossing)
  function calcWorkDuration(checkIn, checkOut) {
    if (!checkIn || !checkOut) return null;
    let diff = toMin(checkOut) - toMin(checkIn);
    if (diff < 0) diff += 1440; // midnight crossing
    return diff;
  }
  function fmtDuration(mins) {
    if (mins === null || mins === undefined) return "—";
    const h = Math.floor(mins/60), m = mins%60;
    return `${h}h ${pad(m)}m`;
  }

  function setAtt(empId, field, val) {
    setAttendance(prev => {
      const dayData = { ...(prev[date]||{}) };
      const empData = { ...getAtt(empId), [field]: val };

      // Auto-calc late from checkIn
      if (field==="checkIn" && val) {
        const sh = shifts.find(s=>s.id===activeShift);
        if (sh) {
          const late = calcLateMin(sh.start, val);
          empData.lateMin = Math.max(0, late);
          if (late >= 7) empData.status = "Late";
          else if (empData.status==="Late") empData.status = "Present";
        }
      }

      // Auto-calc work duration whenever checkIn or checkOut changes
      const ci = field==="checkIn"  ? val : empData.checkIn;
      const co = field==="checkOut" ? val : empData.checkOut;
      const dur = calcWorkDuration(ci, co);
      empData.workDuration = dur !== null ? dur : "";

      // Auto-calc Early Leave: if status=Early Leave and both times set
      if ((empData.status==="Early Leave" || field==="status") && ci && co) {
        empData.earlyMin = dur !== null ? dur : empData.earlyMin;
      }

      dayData[empId] = empData;
      return { ...prev, [date]: dayData };
    });
  }

  function bulkSet(status) {
    setAttendance(prev => {
      const dayData = { ...(prev[date]||{}) };
      shiftEmployees.forEach(emp => { dayData[emp.id] = { ...getAtt(emp.id), status }; });
      return { ...prev, [date]: dayData };
    });
  }

  // KPIs across all shifts for the day
  const allDayEmps = employees.filter(emp => { const v=(schedule[emp.id]||{})[dayName]; return v && v!=="OFF" && v!=="LEAVE" && v!=="PH"; });
  const allAtt = allDayEmps.map(e => getAtt(e.id));
  const kpis = {
    working:   allDayEmps.length,
    present:   allAtt.filter(a=>a.status==="Present").length,
    absent:    allAtt.filter(a=>a.status==="Absent").length,
    late:      allAtt.filter(a=>a.status==="Late").length,
    early:     allAtt.filter(a=>a.status==="Early Leave").length,
    totalLate: allAtt.reduce((s,a)=>s+(a.lateMin||0),0)
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>📋 Attendance Log</span>
        <input type="date" value={date} onChange={e=>handleDateChange(e.target.value)} style={{ ...I(), width:150 }}/>
        <span style={{ fontSize:12, color:"#94A3B8" }}>Auto-calc late · 🔴 = ≥7 min late</span>
      </div>

      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10, marginBottom:16 }}>
        {[["Working",kpis.working,"#2563EB"],["Present",kpis.present,"#10B981"],
          ["Absent",kpis.absent,"#EF4444"],["Late",kpis.late,"#F59E0B"],
          ["Early Leave",kpis.early,"#8B5CF6"],["Late Time",kpis.totalLate+"m","#EC4899"]].map(([l,v,c])=>(
          <div key={l} style={{ ...CRD({ padding:"12px 16px" }), borderTop:`3px solid ${c}` }}>
            <div style={{ fontSize:11, color:"#64748B", fontWeight:600 }}>{l}</div>
            <div style={{ fontSize:24, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Shift Tabs — active one highlighted automatically */}
      <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap", alignItems:"center" }}>
        {shifts.map(sh => {
          const isActive = activeShift===sh.id;
          const empCount = employees.filter(emp=>(schedule[emp.id]||{})[dayName]===sh.id).length;
          return (
            <button key={sh.id} onClick={()=>handleShiftClick(sh.id)}
              style={{ border:`2px solid ${sh.color}`, borderRadius:20, padding:"5px 14px",
                fontSize:12, cursor:"pointer", fontWeight:600, position:"relative",
                background: isActive ? sh.color : "transparent",
                color: isActive ? "#fff" : sh.color, transition:"all 0.15s" }}>
              {sh.label} {sh.start}
              {empCount>0 && (
                <span style={{ marginLeft:6, background: isActive?"rgba(255,255,255,0.3)":sh.color+"25",
                  borderRadius:10, padding:"1px 6px", fontSize:10, fontWeight:700 }}>
                  {empCount}
                </span>
              )}
            </button>
          );
        })}
        {/* Auto-detect indicator */}
        {autoShift && date===todayStr() && (
          <span style={{ fontSize:11, color:"#10B981", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
            🟢 Auto-detected: <strong>{activeShiftObj?.label} ({activeShiftObj?.start}–{activeShiftObj?.end})</strong>
          </span>
        )}
      </div>

      {/* Active shift info bar */}
      {activeShiftObj && (
        <div style={{ background: activeShiftObj.color+"15", border:`1.5px solid ${activeShiftObj.color}40`,
          borderRadius:8, padding:"8px 16px", marginBottom:12,
          display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <span style={{ fontWeight:700, color:activeShiftObj.color, fontSize:13 }}>
            ⏰ {activeShiftObj.label} · {activeShiftObj.start} – {activeShiftObj.end}
          </span>
          <span style={{ fontSize:12, color:"#475569" }}>
            {shiftEmployees.length} employees scheduled on <strong>{dayName}</strong>
          </span>
          <div style={{ display:"flex", gap:8, marginLeft:"auto" }}>
            <button style={PBT("#10B981",{padding:"5px 12px",fontSize:12})} onClick={()=>bulkSet("Present")}>✅ All Present</button>
            <button style={PBT("#EF4444",{padding:"5px 12px",fontSize:12})} onClick={()=>bulkSet("Absent")}>🔴 All Absent</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ ...CRD(), overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#F8FAFC" }}>
              {["#","Employee","Status","Check-in","Check-out","Late","Work Duration","Early Leave","Notes"].map(h=>(
                <th key={h} style={{ padding:"10px 8px", textAlign:"left", fontWeight:700,
                  color:"#0F2744", borderBottom:"2px solid #E2E8F0", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shiftEmployees.map((emp,ri) => {
              const att = getAtt(emp.id);
              const isLate = att.lateMin >= 7;
              const isSlightLate = att.lateMin > 0 && att.lateMin < 7;
              const dur = att.workDuration !== "" && att.workDuration !== undefined ? att.workDuration : calcWorkDuration(att.checkIn, att.checkOut);
              const isEarlyLeave = att.status === "Early Leave";
              return (
                <tr key={emp.id} style={{ background: ri%2===0?"#fff":"#F8FAFC" }}>
                  <td style={{ padding:"8px", color:"#94A3B8", fontWeight:600 }}>{ri+1}</td>
                  <td style={{ padding:"8px", fontWeight:600, color:"#1E293B" }}>
                    {emp.name}
                    <div style={{ fontSize:11, color:"#94A3B8" }}>{emp.role}</div>
                  </td>
                  <td style={{ padding:"8px" }}>
                    <select value={att.status} onChange={e=>setAtt(emp.id,"status",e.target.value)}
                      style={{ ...I({ width:120, border:`1.5px solid ${
                        att.status==="Present"?"#10B981":att.status==="Absent"?"#EF4444":
                        att.status==="Late"?"#F59E0B":"#8B5CF6"}` }) }}>
                      {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding:"8px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <input type="time" value={att.checkIn||""} onChange={e=>setAtt(emp.id,"checkIn",e.target.value)}
                        style={{ ...I({ width:110, border: isLate?"2px solid #EF4444":
                          isSlightLate?"2px solid #F59E0B":"1px solid #CBD5E1" })}}/>
                      {isLate && <span>🔴</span>}
                      {isSlightLate && <span>🟡</span>}
                    </div>
                    {(isLate||isSlightLate) && att.lateMin>0 &&
                      <div style={{ fontSize:11, color:isLate?"#EF4444":"#F59E0B", fontWeight:700 }}>
                        {isLate?"🔴 ":""}{att.lateMin}m
                      </div>}
                  </td>
                  <td style={{ padding:"8px" }}>
                    <input type="time" value={att.checkOut||""} onChange={e=>setAtt(emp.id,"checkOut",e.target.value)}
                      style={{ ...I({ width:110, border: isEarlyLeave&&att.checkOut?"2px solid #8B5CF6":"1px solid #CBD5E1" })}}/>
                  </td>
                  <td style={{ padding:"8px", color:att.lateMin>=7?"#EF4444":"#94A3B8", fontWeight:600 }}>
                    {att.lateMin>0 ? att.lateMin+"m" : "—"}
                  </td>
                  <td style={{ padding:"8px" }}>
                    <div style={{ fontWeight:700, color: dur!==null&&dur<(activeShiftObj?toMin(activeShiftObj.end)-toMin(activeShiftObj.start):480)?"#F59E0B":"#10B981", fontSize:13 }}>
                      {dur !== null ? fmtDuration(dur) : "—"}
                    </div>
                    {dur !== null && <div style={{ fontSize:10, color:"#94A3B8" }}>{dur} min</div>}
                  </td>
                  <td style={{ padding:"8px" }}>
                    {isEarlyLeave && dur !== null
                      ? <div style={{ fontWeight:700, color:"#8B5CF6", fontSize:13 }}>{fmtDuration(dur)}<div style={{fontSize:10,color:"#94A3B8"}}>from check-in</div></div>
                      : <span style={{ color:"#94A3B8" }}>—</span>
                    }
                  </td>
                  <td style={{ padding:"8px" }}>
                    <input value={att.note||""} onChange={e=>setAtt(emp.id,"note",e.target.value)}
                      style={{ ...I({ width:140 })}} placeholder="Note..."/>
                  </td>
                </tr>
              );
            })}
            {shiftEmployees.length===0 && (
              <tr><td colSpan={9} style={{ padding:32, textAlign:"center", color:"#94A3B8" }}>
                No employees scheduled for <strong>{activeShiftObj?.label}</strong> on <strong>{dayName}</strong>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PERFORMANCE PAGE ─────────────────────────────────────────────────────────
function PerformancePage({ employees, schedule, shifts, performance, setPerformance }) {
  const [date, setDate] = useState(todayStr());
  const [showQuality, setShowQuality] = useState(false);
  const dayName = DAYS[new Date(date+"T12:00:00").getDay()];

  const dayEmps = employees.filter(emp => { const v=(schedule[emp.id]||{})[dayName]; return v && v!=="OFF" && v!=="LEAVE" && v!=="PH"; });

  function getPerf(empId) {
    return ((performance[date]||{})[empId]) || { closed:0, reopened:0, escalations:0, quality:"" };
  }
  function setPerf(empId, field, val) {
    setPerformance(prev => {
      const d = { ...(prev[date]||{}) };
      d[empId] = { ...getPerf(empId), [field]: val };
      return { ...prev, [date]: d };
    });
  }

  const sorted = [...dayEmps].sort((a,b) => (getPerf(b.id).closed||0) - (getPerf(a.id).closed||0));
  const totalClosed = dayEmps.reduce((s,e)=>s+(getPerf(e.id).closed||0),0);
  const totalEsc = dayEmps.reduce((s,e)=>s+(getPerf(e.id).escalations||0),0);
  const medals = ["🥇","🥈","🥉"];

  function getShiftLabel(empId) {
    const sid = (schedule[empId]||{})[dayName];
    if (!sid||sid==="OFF") return "—";
    return shifts.find(s=>s.id===sid)?.label||"—";
  }

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>⚡ Performance Tracker</span>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...I(), width:150 }}/>
        <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, cursor:"pointer", color:"#475569" }}>
          <input type="checkbox" checked={showQuality} onChange={e=>setShowQuality(e.target.checked)}/> Show Quality %
        </label>
      </div>

      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:16 }}>
        {[["Total Closed",totalClosed,"#10B981"],["Escalations",totalEsc,"#F59E0B"]].map(([l,v,c])=>(
          <div key={l} style={{ ...CRD({ padding:"12px 16px" }), borderTop:`3px solid ${c}` }}>
            <div style={{ fontSize:11, color:"#64748B", fontWeight:600 }}>{l}</div>
            <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...CRD(), overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#F8FAFC" }}>
              {["Rank","Employee","Tasks","Shift","Closed","Escalations",...(showQuality?["Quality %"]:[])]
                .map(h=><th key={h} style={{ padding:"10px 8px", textAlign:"left", fontWeight:700, color:"#0F2744", borderBottom:"2px solid #E2E8F0", whiteSpace:"nowrap" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {sorted.map((emp,ri) => {
              const p = getPerf(emp.id);
              return (
                <tr key={emp.id} style={{ background: ri%2===0?"#fff":"#F8FAFC" }}>
                  <td style={{ padding:"8px", fontSize:18, textAlign:"center" }}>{medals[ri]||ri+1}</td>
                  <td style={{ padding:"8px", fontWeight:600 }}>{emp.name}</td>
                  <td style={{ padding:"8px" }}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                      {emp.tasks.map(t=><span key={t} style={{ background:taskColor(t), color:"#fff", borderRadius:10, padding:"2px 6px", fontSize:10, fontWeight:600 }}>{t}</span>)}
                    </div>
                  </td>
                  <td style={{ padding:"8px", color:"#475569" }}>{getShiftLabel(emp.id)}</td>
                  <td style={{ padding:"8px" }}>
                    <input type="number" min="0" value={p.closed||""} onChange={e=>setPerf(emp.id,"closed",Number(e.target.value))}
                      style={{ ...I({ width:70, border: p.closed>0?"2px solid #10B981":"1px solid #CBD5E1" })}} placeholder="0"/>
                  </td>
                  <td style={{ padding:"8px" }}>
                    <input type="number" min="0" value={p.escalations||""} onChange={e=>setPerf(emp.id,"escalations",Number(e.target.value))}
                      style={{ ...I({ width:70, border: p.escalations>0?"2px solid #F59E0B":"1px solid #CBD5E1" })}} placeholder="0"/>
                  </td>
                  {showQuality && (
                    <td style={{ padding:"8px" }}>
                      <input type="number" min="0" max="100" value={p.quality||""} onChange={e=>setPerf(emp.id,"quality",Number(e.target.value))}
                        style={{ ...I({ width:70 })}} placeholder="0-100"/>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── HEAT MAP PAGE — reads data from Queue ────────────────────────────────────
function HeatMapPage({ queueLog }) {
  const [date, setDate] = useState(todayStr());

  // Collect all queue entries for this date across all shifts
  // Build hourly map from baseTime and updTime entries
  const hourlyData = useMemo(() => {
    const map = {}; // "HH:00" → total cases
    Object.entries(queueLog).forEach(([key, data]) => {
      if (!key.startsWith(date+"_")) return;
      // Use baseTime or updTime as the hour marker
      const times = [data.baseTime, data.updTime].filter(Boolean);
      times.forEach(t => {
        const hr = t.slice(0,2)+":00";
        // Sum all queue fields as inflow indicator
        const fields = ["tga","gccT2","kwtT2","qatT2","bahT2","uaeT2",
                        "someKwt","someQat","someBah","someUae"];
        const total = fields.reduce((s,f)=>s+Number(data[f+"Curr"]||0),0);
        map[hr] = (map[hr]||0) + total;
      });
      // Also push calculated snapshot using updTime
      if (data.updTime && data.calcSnapshot) {
        const hr = data.updTime.slice(0,2)+":00";
        map[hr] = (map[hr]||0) + (data.calcSnapshot||0);
      }
    });
    return map;
  }, [queueLog, date]);

  const hours = Array.from({length:24}, (_,i) => pad(i)+":00");
  const counts = hours.map(h => hourlyData[h]||0);
  const maxCount = Math.max(...counts, 1);
  const total = counts.reduce((a,b)=>a+b,0);
  const peakHour = hours[counts.indexOf(Math.max(...counts))];
  const sortedByCount = [...hours].sort((a,b) => (hourlyData[a]||0)-(hourlyData[b]||0));
  const breakWindows = sortedByCount.slice(0,3);

  function cellBg(count) {
    if (!count) return "#F1F5F9";
    const pct = count/maxCount;
    if (pct>0.8) return "#FEE2E2";
    if (pct>0.5) return "#FEF9C3";
    if (pct>0.2) return "#DCFCE7";
    return "#F0FDF4";
  }
  function cellBorder(count) {
    if (!count) return "#E2E8F0";
    const pct = count/maxCount;
    if (pct>0.8) return "#EF4444";
    if (pct>0.5) return "#F59E0B";
    if (pct>0.2) return "#10B981";
    return "#86EFAC";
  }

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>🌡️ Hourly Heat Map</span>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...I(), width:150 }}/>
        <span style={{ fontSize:12, color:"#10B981", fontWeight:600 }}>📊 Auto-populated from Queue data</span>
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
        <div style={{ ...CRD(), borderTop:"3px solid #EF4444" }}>
          <div style={LBL}>Peak Hour</div>
          <div style={{ fontSize:22, fontWeight:800, color:"#EF4444" }}>{total>0 ? peakHour : "—"}</div>
          <div style={{ fontSize:12, color:"#94A3B8" }}>{total>0 ? (hourlyData[peakHour]||0)+" cases" : "No data yet"}</div>
        </div>
        <div style={{ ...CRD(), borderTop:"3px solid #2563EB" }}>
          <div style={LBL}>Total Queue Load</div>
          <div style={{ fontSize:22, fontWeight:800, color:"#2563EB" }}>{total}</div>
          <div style={{ fontSize:12, color:"#94A3B8" }}>across all recorded hours</div>
        </div>
        <div style={{ ...CRD(), borderTop:"3px solid #10B981" }}>
          <div style={LBL}>Recommended Breaks</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#10B981" }}>{breakWindows.filter(h=>(hourlyData[h]||0)===0).slice(0,3).join(", ")||"—"}</div>
          <div style={{ fontSize:12, color:"#94A3B8" }}>lowest activity windows</div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ ...CRD(), padding:16 }}>
        {total === 0 && (
          <div style={{ textAlign:"center", padding:"24px 0", color:"#94A3B8", fontSize:13 }}>
            📭 No data yet — enter Queue data and click <strong>احسب</strong> to populate this chart.
          </div>
        )}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8 }}>
          {hours.map(h => {
            const count = hourlyData[h]||0;
            return (
              <div key={h} style={{ background:cellBg(count), border:`1.5px solid ${cellBorder(count)}`, borderRadius:8, padding:"10px 8px", textAlign:"center" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#64748B", marginBottom:4 }}>{h}</div>
                <div style={{ fontWeight:800, fontSize:18, color: count>0 ? cellBorder(count) : "#CBD5E1" }}>{count||0}</div>
                {count>0 && <div style={{ fontSize:10, color:"#94A3B8" }}>{Math.round(count/maxCount*100)}%</div>}
              </div>
            );
          })}
        </div>
        <div style={{ display:"flex", gap:16, marginTop:16, flexWrap:"wrap" }}>
          {[["#FEE2E2","#EF4444",">80% peak"],["#FEF9C3","#F59E0B",">50% peak"],["#DCFCE7","#10B981",">20% peak"],["#F1F5F9","#94A3B8","No data"]].map(([bg,border,label])=>(
            <div key={label} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:16, height:16, background:bg, border:`1.5px solid ${border}`, borderRadius:3 }}/>
              <span style={{ fontSize:12, color:"#64748B" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── QUEUE PAGE ───────────────────────────────────────────────────────────────
function QueuePage({ shifts, queueLog, setQueueLog, setHeatmap }) {
  const [date, setDate] = useState(todayStr());
  const [shiftId, setShiftId] = useState(shifts[0]?.id||"");
  const [calcDone, setCalcDone] = useState(false);

  const key = `${date}_${shiftId}`;
  const data = queueLog[key] || {};
  function setQ(field, val) {
    setQueueLog(prev => ({ ...prev, [key]: { ...(prev[key]||{}), [field]: val } }));
    setCalcDone(false);
  }

  // Queue categories — grouped
  const KSA_FIELDS = [
    { key:"tga",    label:"TGA",   color:"#6366F1", flag:"🇸🇦" },
    { key:"ob",     label:"OB",    color:"#0EA5E9", flag:"🇸🇦" },
    { key:"oslo",   label:"OSLO",  color:"#8B5CF6", flag:"🇸🇦" },
    { key:"some",   label:"SOME",  color:"#EC4899", flag:"🇸🇦" },
  ];
  const GCC_FIELDS = [
    { key:"kwtT2",   label:"KWT T2 Cases",   color:"#10B981", flag:"🇰🇼" },
    { key:"qatT2",   label:"QAT T2 Cases",   color:"#F59E0B", flag:"🇶🇦" },
    { key:"bahT2",   label:"BAH T2 Cases",   color:"#EF4444", flag:"🇧🇭" },
    { key:"uaeT2",   label:"UAE T2 Cases",   color:"#06B6D4", flag:"🇦🇪" },
    { key:"someKwt", label:"SOME KWT Cases", color:"#14B8A6", flag:"🇰🇼" },
    { key:"someQat", label:"SOME QAT Cases", color:"#F97316", flag:"🇶🇦" },
    { key:"someBah", label:"SOME BAH Cases", color:"#A855F7", flag:"🇧🇭" },
    { key:"someUae", label:"SOME UAE Cases", color:"#84CC16", flag:"🇦🇪" },
  ];
  const QUEUE_FIELDS = [...KSA_FIELDS, ...GCC_FIELDS];

  // Per-field calcs: baseline + inflow - current = resolved
  const calcs = QUEUE_FIELDS.map(f => {
    const base    = Number(data[f.key+"Base"]||0);
    const inflow  = Number(data[f.key+"Inflow"]||0);
    const curr    = Number(data[f.key+"Curr"]||0);
    const resolved = base + inflow - curr;
    const change   = curr - base; // positive = grew, negative = reduced
    return { ...f, base, inflow, curr, resolved, change };
  });

  const totalBase     = calcs.reduce((s,c)=>s+c.base,0);
  const totalCurr     = calcs.reduce((s,c)=>s+c.curr,0);
  const totalResolved = calcs.reduce((s,c)=>s+c.resolved,0);
  const totalInflow   = calcs.reduce((s,c)=>s+c.inflow,0);

  // Status
  const status = totalCurr>400 ? "🚨 CRITICAL" : totalCurr>200 ? "⚠️ WARNING" : "✅ NORMAL";
  const statusColor = status.includes("CRITICAL")?"#EF4444":status.includes("WARNING")?"#F59E0B":"#10B981";

  // Duration between baseline and update time
  function timeDiff() {
    if (!data.baseTime || !data.updTime) return null;
    const diff = toMin(data.updTime) - toMin(data.baseTime);
    const d = diff < 0 ? diff + 1440 : diff;
    return `${Math.floor(d/60)}h ${d%60}m`;
  }

  // ── احسب — calculate & push snapshot to heatmap ──
  function calculate() {
    if (!data.updTime) { alert("Please enter an Update Time first."); return; }
    // Save snapshot total to heatmap
    const hr = data.updTime.slice(0,2)+":00";
    setHeatmap(prev => ({
      ...prev,
      [date]: { ...(prev[date]||{}), [hr]: totalCurr }
    }));
    // Save snapshot in queue entry for reference
    setQueueLog(prev => ({
      ...prev,
      [key]: { ...(prev[key]||{}), calcSnapshot: totalCurr, calcTime: data.updTime }
    }));
    setCalcDone(true);
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>📊 Queue Data</span>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...I(), width:150 }}/>
        <select value={shiftId} onChange={e=>setShiftId(e.target.value)} style={{ ...I(), width:160 }}>
          {shifts.map(s=><option key={s.id} value={s.id}>{s.label} ({s.start})</option>)}
        </select>
        <div style={{ fontWeight:700, fontSize:13, color:statusColor, background:statusColor+"18",
          borderRadius:6, padding:"6px 14px", border:`1px solid ${statusColor}40` }}>{status}</div>
      </div>

      {/* Time bar */}
      <div style={{ ...CRD({ padding:"12px 16px" }), marginBottom:16, display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <label style={{ ...LBL, marginBottom:0, whiteSpace:"nowrap" }}>⏱ Baseline Time</label>
          <input type="time" value={data.baseTime||""} onChange={e=>setQ("baseTime",e.target.value)} style={{ ...I({ width:120 })}}/>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <label style={{ ...LBL, marginBottom:0, whiteSpace:"nowrap" }}>🔄 Update Time</label>
          <input type="time" value={data.updTime||""} onChange={e=>setQ("updTime",e.target.value)} style={{ ...I({ width:120 })}}/>
        </div>
        {timeDiff() && (
          <div style={{ fontSize:13, color:"#475569", fontWeight:600 }}>⏳ Duration: <strong>{timeDiff()}</strong></div>
        )}
        {/* احسب button */}
        <button onClick={calculate}
          style={{ ...PBT(calcDone?"#10B981":"#2563EB", { padding:"8px 24px", fontSize:14, marginLeft:"auto",
            boxShadow: calcDone?"none":"0 0 0 3px #2563EB30", transition:"all 0.2s" }) }}>
          {calcDone ? "✅ محسوب — Heat Map Updated" : "🧮 احسب"}
        </button>
      </div>

      {/* Summary KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        {[["Total Baseline",totalBase,"#475569"],["New Inflow",totalInflow,"#2563EB"],
          ["Current Live",totalCurr,"#EF4444"],["Resolved",totalResolved,"#10B981"]].map(([l,v,c])=>(
          <div key={l} style={{ ...CRD({ padding:"12px 16px" }), borderTop:`3px solid ${c}` }}>
            <div style={{ fontSize:11, color:"#64748B", fontWeight:600 }}>{l}</div>
            <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Queue tables — KSA then GCC */}
      {[
        { title:"🇸🇦 KSA Queue", fields: KSA_FIELDS, accent:"#2563EB" },
        { title:"🌍 GCC Queue",  fields: GCC_FIELDS,  accent:"#10B981" },
      ].map(({ title, fields, accent }) => {
        const groupCalcs = calcs.filter(c => fields.some(f=>f.key===c.key));
        const gTotal = groupCalcs.reduce((s,c)=>s+c.curr,0);
        const gResolved = groupCalcs.reduce((s,c)=>s+c.resolved,0);
        return (
          <div key={title} style={{ ...CRD(), overflowX:"auto", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ fontWeight:800, color:accent, fontSize:15 }}>{title}</div>
              <div style={{ display:"flex", gap:16, fontSize:12, color:"#64748B" }}>
                <span>Current: <strong style={{color:"#EF4444"}}>{gTotal}</strong></span>
                <span>Resolved: <strong style={{color:"#10B981"}}>{gResolved>0?"+":""}{gResolved}</strong></span>
              </div>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:"#F8FAFC" }}>
                  {["Queue","","Baseline","New Inflow","Current","Resolved","Trend"].map(h=>(
                    <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontWeight:700, color:"#0F2744",
                      borderBottom:`2px solid ${accent}40`, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupCalcs.map((c,ri) => (
                  <tr key={c.key} style={{ background: ri%2===0?"#fff":"#F8FAFC" }}>
                    <td style={{ padding:"8px 10px", fontWeight:700, color:c.color }}>{c.label}</td>
                    <td style={{ padding:"8px 6px", fontSize:16 }}>{c.flag}</td>
                    <td style={{ padding:"8px 10px" }}>
                      <input type="number" min="0" value={data[c.key+"Base"]||""}
                        onChange={e=>setQ(c.key+"Base",e.target.value)}
                        style={{ ...I({ width:75 })}} placeholder="0"/>
                    </td>
                    <td style={{ padding:"8px 10px" }}>
                      <input type="number" min="0" value={data[c.key+"Inflow"]||""}
                        onChange={e=>setQ(c.key+"Inflow",e.target.value)}
                        style={{ ...I({ width:75, border: Number(data[c.key+"Inflow"]||0)>0?"2px solid #2563EB":"1px solid #CBD5E1" })}} placeholder="0"/>
                    </td>
                    <td style={{ padding:"8px 10px" }}>
                      <input type="number" min="0" value={data[c.key+"Curr"]||""}
                        onChange={e=>setQ(c.key+"Curr",e.target.value)}
                        style={{ ...I({ width:75, border: Number(data[c.key+"Curr"]||0)>200?"2px solid #EF4444":Number(data[c.key+"Curr"]||0)>100?"2px solid #F59E0B":"1px solid #CBD5E1" })}} placeholder="0"/>
                    </td>
                    <td style={{ padding:"8px 10px", fontWeight:700,
                      color: c.resolved>0?"#10B981":c.resolved<0?"#EF4444":"#94A3B8" }}>
                      {c.resolved>0?"+":""}{c.resolved}
                    </td>
                    <td style={{ padding:"8px 10px", fontSize:16 }}>
                      {c.change>0?"📈":c.change<0?"📉":"➡️"}
                      <span style={{ fontSize:11, color:"#94A3B8", marginLeft:4 }}>{c.change>0?"+":""}{c.change||0}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Comparison: Baseline vs Update */}
      {data.baseTime && data.updTime && (
        <div style={{ ...CRD(), marginBottom:16 }}>
          <div style={{ fontWeight:700, color:"#0F2744", marginBottom:12, fontSize:14 }}>
            📊 Comparison: {data.baseTime} → {data.updTime} ({timeDiff()})
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
            {calcs.filter(c=>c.base>0||c.curr>0).map(c=>(
              <div key={c.key} style={{ background:c.color+"10", border:`1.5px solid ${c.color}30`,
                borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
                <div style={{ fontSize:11, fontWeight:700, color:c.color, marginBottom:4 }}>{c.flag} {c.label}</div>
                <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:8, fontSize:13 }}>
                  <span style={{ color:"#64748B" }}>{c.base}</span>
                  <span style={{ color:"#94A3B8" }}>→</span>
                  <span style={{ fontWeight:800, color:c.curr>c.base?"#EF4444":c.curr<c.base?"#10B981":"#475569", fontSize:16 }}>{c.curr}</span>
                </div>
                <div style={{ fontSize:11, marginTop:4, fontWeight:600,
                  color:c.resolved>0?"#10B981":c.resolved<0?"#EF4444":"#94A3B8" }}>
                  Resolved: {c.resolved>0?"+":""}{c.resolved}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SME Insights */}
      <div style={CRD()}>
        <label style={LBL}>💡 SME Insights (Problem → Action → Result)</label>
        <textarea value={data.insight||""} onChange={e=>setQ("insight",e.target.value)} rows={3}
          style={{ ...I(), resize:"vertical" }} placeholder="Problem → Action → Result"/>
      </div>
    </div>
  );
}


// ─── NOTES PAGE ───────────────────────────────────────────────────────────────
function NotesPage({ notes, setNotes }) {
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState(() => { const n=new Date(); return pad(n.getHours())+":"+pad(n.getMinutes()); });
  const [text, setText] = useState("");
  const [tag, setTag]   = useState("General");
  const TAGS = ["General","Staffing Issue","Queue Alert","System Issue","Performance Note","Exceptional Event","Other"];
  const TAG_COLORS = {"General":"#64748B","Staffing Issue":"#EF4444","Queue Alert":"#F59E0B","System Issue":"#8B5CF6","Performance Note":"#2563EB","Exceptional Event":"#EC4899","Other":"#10B981"};

  const allNotes = Array.isArray(notes) ? [...notes].sort((a,b)=>b.ts.localeCompare(a.ts)) : [];

  function addNote() {
    if (!text.trim()) return;
    const entry = { id:"n"+Date.now(), ts:`${date}T${time}:00`, date, time, tag, text };
    setNotes(prev => [entry, ...(Array.isArray(prev)?prev:[])].slice(0,500));
    setText(""); setTime(pad(new Date().getHours())+":"+pad(new Date().getMinutes()));
  }
  function deleteNote(id) { setNotes(prev=>(prev||[]).filter(n=>n.id!==id)); }

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>📝 Notes & Exceptional Events</span>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...I(), width:150 }}/>
      </div>
      <div style={{ ...CRD(), marginBottom:16 }}>
        <div style={{ fontWeight:700, color:"#0F2744", marginBottom:12 }}>Add Note</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:10, marginBottom:10 }}>
          <div><label style={LBL}>Date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={I()}/></div>
          <div><label style={LBL}>Time</label><input type="time" value={time} onChange={e=>setTime(e.target.value)} style={I()}/></div>
          <div><label style={LBL}>Tag</label>
            <select value={tag} onChange={e=>setTag(e.target.value)} style={{ ...I(), border:`2px solid ${TAG_COLORS[tag]}` }}>
              {TAGS.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={3}
          style={{ ...I(), resize:"vertical", marginBottom:10 }}
          placeholder="Describe the exceptional circumstance, issue, or note that affected operations today..."/>
        <button style={PBT("#2563EB",{padding:"8px 20px"})} onClick={addNote}>+ Save Note</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {allNotes.length===0 && <div style={{ ...CRD(), textAlign:"center", padding:32, color:"#94A3B8" }}>📭 No notes yet</div>}
        {allNotes.map(n=>(
          <div key={n.id} style={{ ...CRD(), borderLeft:`4px solid ${TAG_COLORS[n.tag]||"#64748B"}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ background:TAG_COLORS[n.tag]+"20", color:TAG_COLORS[n.tag], border:`1px solid ${TAG_COLORS[n.tag]}40`,
                borderRadius:6, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{n.tag}</span>
              <span style={{ fontSize:12, color:"#64748B" }}>📅 {n.date} · 🕐 {n.time}</span>
              <button onClick={()=>deleteNote(n.id)} style={{ marginLeft:"auto", background:"none", border:"1px solid #FCA5A5",
                color:"#EF4444", borderRadius:4, padding:"2px 8px", cursor:"pointer", fontSize:11 }}>✕</button>
            </div>
            <div style={{ fontSize:13, color:"#1E293B", lineHeight:1.6, whiteSpace:"pre-wrap" }}>{n.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

  );
}

// ─── BREAK DURATION HELPER ────────────────────────────────────────────────────
// Before 20/03/2026 → 30 min | From 20/03/2026 onwards → 60 min
function getDefaultBreakDuration(dateStr) {
  const cutoff = new Date("2026-03-20");
  const d = dateStr ? new Date(dateStr+"T00:00:00") : new Date();
  return d >= cutoff ? 60 : 30;
}
function BreakPage({ employees, schedule, shifts, breakSchedule, setBreakSchedule, canEdit }) {
  const [date, setDate]         = useState(todayStr());
  const [shiftId, setShiftId]   = useState(shifts[0]?.id||"");
  const [templates, setTemplates]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("csops_breakTemplates")||"{}"); } catch { return {}; }
  });
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName]         = useState("");
  const [showLoadTemplate, setShowLoadTemplate] = useState(false);

  const dayName = DAYS[new Date(date+"T12:00:00").getDay()];
  const key = `${date}_${shiftId}`;

  // Employees on this shift today
  const shiftEmps = useMemo(() =>
    employees.filter(emp => (schedule[emp.id]||{})[dayName] === shiftId),
    [employees, schedule, shiftId, dayName]
  );

  // Get break entry for employee
  function getEntry(empId) {
    const defaultDur = getDefaultBreakDuration(date);
    return ((breakSchedule[key]||{})[empId]) || { start:"", durationMin:defaultDur, overMin:0 };
  }

  function setEntry(empId, field, val) {
    if (!canEdit) return;
    setBreakSchedule(prev => ({
      ...prev,
      [key]: {
        ...(prev[key]||{}),
        [empId]: { ...getEntry(empId), [field]: val }
      }
    }));
  }

  // Auto-calc end time
  function calcEnd(start, dur) {
    if (!start || !dur) return "";
    const endMin = (toMin(start) + Number(dur)) % 1440;
    return pad(Math.floor(endMin/60))+":"+pad(endMin%60);
  }

  // Status for each employee based on current time
  function getLiveStatus(empId) {
    const entry = getEntry(empId);
    if (!entry.start || !entry.durationMin) return "pending";
    const now = new Date();
    const nowMin = now.getHours()*60 + now.getMinutes();
    const startMin = toMin(entry.start);
    const endMin   = (startMin + Number(entry.durationMin)) % 1440;
    // Is currently on break?
    let onBreak = false;
    if (endMin > startMin) onBreak = nowMin >= startMin && nowMin < endMin;
    else onBreak = nowMin >= startMin || nowMin < endMin;
    if (onBreak) {
      const elapsed = nowMin >= startMin ? nowMin - startMin : nowMin + 1440 - startMin;
      return { status:"on_break", elapsed, over: Math.max(0, elapsed - Number(entry.durationMin)) };
    }
    // Break finished?
    let finished = false;
    if (endMin > startMin) finished = nowMin >= endMin;
    else finished = nowMin >= endMin && nowMin < startMin;
    if (finished) return { status:"finished", elapsed: Number(entry.durationMin) + Number(entry.overMin||0) };
    return { status:"pending" };
  }

  // Bulk fill: distribute breaks evenly across the shift
  function autoDistribute() {
    if (!canEdit || !shiftEmps.length) return;
    const sh = shifts.find(s=>s.id===shiftId);
    if (!sh) return;
    const shStart = toMin(sh.start);
    const shLen   = (() => { let l = toMin(sh.end) - shStart; if(l<=0) l+=1440; return l; })();
    // Spread breaks evenly in the middle 60% of the shift
    const window = shLen * 0.6;
    const wStart = shStart + shLen * 0.2;
    const interval = window / shiftEmps.length;
    const defaultDur = getDefaultBreakDuration(date);
    const updates = {};
    shiftEmps.forEach((emp, i) => {
      const breakStartMin = Math.round(wStart + i * interval);
      const h = Math.floor((breakStartMin % 1440) / 60);
      const m = (breakStartMin % 1440) % 60;
      updates[emp.id] = { start: pad(h)+":"+pad(m), durationMin: defaultDur, overMin: 0 };
    });
    setBreakSchedule(prev => ({ ...prev, [key]: { ...(prev[key]||{}), ...updates } }));
  }

  // Save template
  function saveTemplate() {
    if (!templateName.trim()) return;
    const data = breakSchedule[key] || {};
    const tmpl = { ...templates, [templateName.trim()]: data };
    setTemplates(tmpl);
    localStorage.setItem("csops_breakTemplates", JSON.stringify(tmpl));
    setTemplateName(""); setShowSaveTemplate(false);
    alert(`✅ Template "${templateName.trim()}" saved.`);
  }

  // Load template
  function loadTemplate(name) {
    const data = templates[name];
    if (!data) return;
    setBreakSchedule(prev => ({ ...prev, [key]: data }));
    setShowLoadTemplate(false);
  }

  // Summary counts
  const now2 = new Date();
  const statuses = shiftEmps.map(e => getLiveStatus(e.id));
  const onBreakCount  = statuses.filter(s=>s.status==="on_break").length;
  const finishedCount = statuses.filter(s=>s.status==="finished").length;
  const pendingCount  = statuses.filter(s=>s.status==="pending").length;
  const overtimeCount = statuses.filter(s=>s.status==="on_break"&&s.over>0).length;

  const sh = shifts.find(s=>s.id===shiftId);

  return (
    <div>
      {/* Toolbar */}
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>☕ Break Schedule</span>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...I(), width:150 }}/>
        <select value={shiftId} onChange={e=>setShiftId(e.target.value)} style={{ ...I(), width:160 }}>
          {shifts.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        {/* Break duration indicator */}
        <div style={{ background: getDefaultBreakDuration(date)===60?"#F0FDF4":"#FEF9C3",
          border:`1px solid ${getDefaultBreakDuration(date)===60?"#86EFAC":"#F59E0B"}`,
          borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700,
          color: getDefaultBreakDuration(date)===60?"#166534":"#92400E" }}>
          ⏱ Default: {getDefaultBreakDuration(date)}m break
          {getDefaultBreakDuration(date)===60 && <span style={{ marginLeft:4, fontSize:10 }}>( ≥ 20 Mar 2026)</span>}
        </div>
        {canEdit && <>
          <button style={PBT("#6366F1")} onClick={autoDistribute}>⚡ Auto Distribute</button>
          <button style={PBT("#10B981")} onClick={()=>setShowSaveTemplate(true)}>💾 Save Template</button>
          <button style={PBT("#475569")} onClick={()=>setShowLoadTemplate(true)}>📂 Load Template</button>
        </>}
      </div>

      {/* Live Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        {[
          ["☕ On Break",   onBreakCount,  "#F59E0B"],
          ["✅ Finished",   finishedCount, "#10B981"],
          ["⏳ Pending",    pendingCount,  "#64748B"],
          ["⚠️ Overtime",   overtimeCount, "#EF4444"],
        ].map(([l,v,c])=>(
          <div key={l} style={{ ...CRD({ padding:"12px 16px" }), borderTop:`3px solid ${c}` }}>
            <div style={{ fontSize:11, color:"#64748B", fontWeight:600 }}>{l}</div>
            <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Shift info */}
      {sh && (
        <div style={{ background:sh.color+"15", border:`1.5px solid ${sh.color}40`, borderRadius:10,
          padding:"10px 16px", marginBottom:14, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
          <span style={{ fontWeight:800, color:sh.color }}>⏰ {sh.label}</span>
          <span style={{ fontSize:12, color:"#475569" }}>{shiftEmps.length} employees scheduled</span>
          <span style={{ fontSize:12, color:"#94A3B8" }}>{dayName} · {date}</span>
        </div>
      )}

      {/* Break schedule table */}
      <div style={{ ...CRD(), overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#F8FAFC" }}>
              {["#","Employee","Break Start","Duration","Break End","Status","Overtime (manual)"].map(h=>(
                <th key={h} style={{ padding:"10px 10px", textAlign:"left", fontWeight:700,
                  color:"#0F2744", borderBottom:"2px solid #E2E8F0", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shiftEmps.map((emp, ri) => {
              const entry  = getEntry(emp.id);
              const endStr = calcEnd(entry.start, entry.durationMin);
              const ls     = getLiveStatus(emp.id);
              const statusColor = ls.status==="on_break"?(ls.over>0?"#EF4444":"#F59E0B")
                               : ls.status==="finished"?"#10B981":"#94A3B8";
              const statusLabel = ls.status==="on_break"
                ? (ls.over>0 ? `⚠️ On Break +${ls.over}m OVER` : `☕ On Break ${ls.elapsed||0}m`)
                : ls.status==="finished" ? "✅ Done"
                : "⏳ Pending";

              return (
                <tr key={emp.id} style={{ background: ri%2===0?"#fff":"#F8FAFC" }}>
                  <td style={{ padding:"8px 10px", color:"#94A3B8", fontWeight:600 }}>{ri+1}</td>
                  <td style={{ padding:"8px 10px", fontWeight:700, color:"#1E293B" }}>
                    {emp.name}
                    <span style={{ marginLeft:6, fontSize:9, fontWeight:800, padding:"1px 5px",
                      borderRadius:4, background:emp.gender==="F"?"#FCE7F3":"#EFF6FF",
                      color:emp.gender==="F"?"#BE185D":"#1D4ED8",
                      border:emp.gender==="F"?"1px solid #F9A8D4":"1px solid #BFDBFE" }}>
                      {emp.gender||"M"}
                    </span>
                  </td>
                  <td style={{ padding:"8px 10px" }}>
                    <input type="time" value={entry.start||""} disabled={!canEdit}
                      onChange={e=>setEntry(emp.id,"start",e.target.value)}
                      style={{ ...I({ width:110, background:canEdit?"#fff":"#F8FAFC" })}}/>
                  </td>
                  <td style={{ padding:"8px 10px" }}>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      {[15,20,30,45,60].map(d=>{
                        const isDefault = d === getDefaultBreakDuration(date);
                        const isSelected = entry.durationMin===d;
                        return (
                          <button key={d} disabled={!canEdit}
                            onClick={()=>setEntry(emp.id,"durationMin",d)}
                            style={{ border:`1.5px solid ${isSelected?"#F59E0B":isDefault?"#10B981":"#CBD5E1"}`,
                              borderRadius:6, padding:"3px 8px", fontSize:11, cursor:canEdit?"pointer":"default",
                              background:isSelected?"#FEF9C3":isDefault?"#F0FDF4":"#fff",
                              color:isSelected?"#92400E":isDefault?"#166534":"#64748B",
                              fontWeight:700, position:"relative" }}>
                            {d}m{isDefault&&!isSelected?" ★":""}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ padding:"8px 10px", fontWeight:700, color:"#475569" }}>
                    {endStr || "—"}
                  </td>
                  <td style={{ padding:"8px 10px" }}>
                    <span style={{ background:statusColor+"18", color:statusColor,
                      border:`1px solid ${statusColor}40`, borderRadius:20,
                      padding:"3px 10px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
                      {statusLabel}
                    </span>
                  </td>
                  <td style={{ padding:"8px 10px" }}>
                    {ls.status==="on_break" && ls.over>0 ? (
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <input type="number" min="0" max="120"
                          value={entry.overMin||ls.over||""}
                          onChange={e=>setEntry(emp.id,"overMin",Number(e.target.value))}
                          style={{ ...I({ width:65, border:"2px solid #EF4444" })}}
                          placeholder="min"/>
                        <span style={{ fontSize:11, color:"#EF4444", fontWeight:700 }}>min</span>
                      </div>
                    ) : entry.overMin > 0 ? (
                      <span style={{ fontSize:12, color:"#EF4444", fontWeight:700 }}>+{entry.overMin}m recorded</span>
                    ) : (
                      <span style={{ color:"#CBD5E1", fontSize:12 }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {shiftEmps.length===0 && (
              <tr><td colSpan={7} style={{ padding:32, textAlign:"center", color:"#94A3B8" }}>
                No employees scheduled for this shift on {dayName}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Save Template Modal */}
      {showSaveTemplate && (
        <Modal title="💾 Save as Template" onClose={()=>setShowSaveTemplate(false)} width={380}>
          <label style={LBL}>Template Name</label>
          <input value={templateName} onChange={e=>setTemplateName(e.target.value)}
            style={{ ...I(), marginBottom:14 }} placeholder="e.g. Shift 1 - Tuesday pattern"
            onKeyDown={e=>e.key==="Enter"&&saveTemplate()} autoFocus/>
          <button style={PBT("#10B981",{width:"100%",padding:"10px"})} onClick={saveTemplate}>
            💾 Save Template
          </button>
        </Modal>
      )}

      {/* Load Template Modal */}
      {showLoadTemplate && (
        <Modal title="📂 Load Template" onClose={()=>setShowLoadTemplate(false)} width={420}>
          {Object.keys(templates).length===0 ? (
            <div style={{ textAlign:"center", color:"#94A3B8", padding:24 }}>No templates saved yet.</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {Object.keys(templates).map(name=>(
                <div key={name} style={{ display:"flex", alignItems:"center", gap:10,
                  background:"#F8FAFC", borderRadius:8, padding:"10px 14px" }}>
                  <span style={{ flex:1, fontWeight:600, fontSize:13 }}>📋 {name}</span>
                  <button style={PBT("#2563EB",{padding:"5px 14px",fontSize:12})}
                    onClick={()=>loadTemplate(name)}>Load</button>
                  <button onClick={()=>{
                    const t={...templates}; delete t[name]; setTemplates(t);
                    localStorage.setItem("csops_breakTemplates",JSON.stringify(t));
                  }} style={{ background:"none", border:"1px solid #FCA5A5", color:"#EF4444",
                    borderRadius:6, padding:"4px 8px", cursor:"pointer", fontSize:12 }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ─── LIVE FLOOR PAGE ──────────────────────────────────────────────────────────
function LiveFloorPage({ employees, schedule, shifts, attendance, setAttendance, breakSchedule, setBreakSchedule }) {
  const [now, setNow] = useState(new Date());
  const [shortBreaks, setShortBreaks] = useState({}); // empId → [{start, durationMin}] — Short Breaks
  const [showShortModal, setShowShortModal] = useState(null);
  const [shortStart, setShortStart]   = useState("");
  const [shortDur, setShortDur]       = useState(15);

  // Live clock — updates every minute
  useState(()=>{ const t=setInterval(()=>setNow(new Date()),60000); return()=>clearInterval(t); });

  const nowMin  = now.getHours()*60 + now.getMinutes();
  const todayD  = now.toISOString().slice(0,10);
  const dayName = DAYS[now.getDay()];

  // Employees working right now
  const workingNow = employees.filter(emp => {
    const sid = (schedule[emp.id]||{})[dayName];
    if (!sid||sid==="OFF"||sid==="LEAVE"||sid==="PH") return false;
    const sh = shifts.find(s=>s.id===sid);
    if (!sh) return false;
    const st=toMin(sh.start), en=toMin(sh.end);
    if (en>st) return nowMin>=st && nowMin<en;
    return nowMin>=st || nowMin<en;
  });

  // Get scheduled break from BreakPage
  function getScheduledBreak(emp) {
    const sid = (schedule[emp.id]||{})[dayName];
    if (!sid) return null;
    const key = `${todayD}_${sid}`;
    const entry = ((breakSchedule[key]||{})[emp.id]);
    if (!entry?.start || !entry?.durationMin) return null;
    return entry;
  }

  // Short Breaks (formerly Extra Break)
  function getShortBreaks(empId) { return shortBreaks[empId]||[]; }

  function addShortBreak(empId) {
    if (!shortStart) return;
    setShortBreaks(prev=>({
      ...prev,
      [empId]: [...(prev[empId]||[]), { start:shortStart, durationMin:Number(shortDur) }]
    }));
    setShortStart(""); setShortDur(15); setShowShortModal(null);
  }

  // Per-employee status — fully automatic from breakSchedule
  function getEmpStatus(emp) {
    const entry = getScheduledBreak(emp);
    if (!entry) return { status:"Online", elapsed:0, over:0, isOvertime:false };

    const bStart = toMin(entry.start);
    const dur    = Number(entry.durationMin);
    const bEnd   = (bStart + dur) % 1440;

    // Is break scheduled but not started yet?
    const minsUntil = bStart > nowMin ? bStart - nowMin : (bStart + 1440 - nowMin);
    if (minsUntil > 0 && minsUntil <= 1440) {
      // Check if we're BEFORE the break
      const beforeBreak = (() => {
        if (bEnd > bStart) return nowMin < bStart;
        return nowMin < bStart && nowMin >= bEnd;
      })();
      if (beforeBreak) {
        return { status:"Break Soon", elapsed:0, over:0, isOvertime:false,
          bStart:entry.start, bEnd:pad(Math.floor(bEnd/60))+":"+pad(bEnd%60), dur,
          minsUntil: bStart - nowMin > 0 ? bStart - nowMin : bStart + 1440 - nowMin };
      }
    }

    // Is currently on break?
    let onBreak = false;
    if (bEnd > bStart) onBreak = nowMin >= bStart && nowMin < bEnd;
    else onBreak = nowMin >= bStart || nowMin < bEnd;

    if (onBreak) {
      const elapsed = nowMin >= bStart ? nowMin-bStart : nowMin+1440-bStart;
      const over    = Math.max(0, elapsed - dur);
      return { status:"Break", elapsed, over, isOvertime:over>0,
        bStart:entry.start, bEnd:pad(Math.floor(bEnd/60))+":"+pad(bEnd%60), dur };
    }

    // Break is finished
    return { status:"Online", elapsed:0, over:0, isOvertime:false,
      breakDone:true, bStart:entry.start, bEnd:pad(Math.floor(bEnd/60))+":"+pad(bEnd%60) };
  }

  function totalShortMin(empId) {
    return getShortBreaks(empId).reduce((s,b)=>s+b.durationMin,0);
  }

  // Record overtime manually in breakSchedule
  function recordOvertime(emp, overMin) {
    const sid = (schedule[emp.id]||{})[dayName];
    if (!sid) return;
    const key = `${todayD}_${sid}`;
    setBreakSchedule(prev=>({
      ...prev,
      [key]: { ...(prev[key]||{}), [emp.id]: { ...((prev[key]||{})[emp.id]||{}), overMin:Number(overMin) } }
    }));
  }

  const onlineCount  = workingNow.filter(e=>{ const s=getEmpStatus(e).status; return s==="Online"||s==="Break Soon"||s==="Break Done"; }).length;
  const breakCount   = workingNow.filter(e=>getEmpStatus(e).status==="Break").length;
  const total        = workingNow.length;
  const pressureRatio = total>0 ? onlineCount/total : 1;
  const pressure = pressureRatio>=0.8 ? {label:"✅ Staffing Sufficient", color:"#10B981", bg:"#F0FDF4"}
                 : pressureRatio>=0.6 ? {label:"⚠️ Staffing Low — Monitor", color:"#F59E0B", bg:"#FEF9C3"}
                 : {label:"🚨 Critical Shortage — Immediate Action Required", color:"#EF4444", bg:"#FEF2F2"};

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>🏢 Live Floor Monitor</span>
        <span style={{ fontSize:13, color:"#64748B" }}>🕐 {pad(now.getHours())}:{pad(now.getMinutes())} · {dayName}</span>
        <div style={{ marginLeft:"auto", display:"flex", gap:10 }}>
          <span style={{ background:"#10B981"+"20", color:"#10B981", borderRadius:20, padding:"4px 14px", fontWeight:700, fontSize:13 }}>🟢 Online: {onlineCount}</span>
          <span style={{ background:"#F59E0B"+"20", color:"#F59E0B", borderRadius:20, padding:"4px 14px", fontWeight:700, fontSize:13 }}>☕ Break: {breakCount}</span>
          <span style={{ background:"#64748B"+"20", color:"#64748B", borderRadius:20, padding:"4px 14px", fontWeight:700, fontSize:13 }}>👥 Total: {total}</span>
        </div>
      </div>

      {/* Pressure Indicator */}
      <div style={{ background:pressure.bg, border:`2px solid ${pressure.color}40`, borderRadius:12,
        padding:"18px 24px", marginBottom:20, display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ fontSize:36 }}>{pressureRatio>=0.8?"✅":pressureRatio>=0.6?"⚠️":"🚨"}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:18, color:pressure.color }}>{pressure.label}</div>
          <div style={{ fontSize:13, color:"#475569", marginTop:4 }}>
            {onlineCount} of {total} agents online · {breakCount} on break
          </div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:32, fontWeight:800, color:pressure.color }}>
            {total>0?Math.round(pressureRatio*100):0}%
          </div>
          <div style={{ fontSize:11, color:"#94A3B8" }}>Available</div>
        </div>
      </div>

      {/* No break schedule notice */}
      {workingNow.length > 0 && workingNow.every(e=>!getScheduledBreak(e)) && (
        <div style={{ background:"#FEF9C3", border:"1px solid #F59E0B", borderRadius:8,
          padding:"10px 16px", marginBottom:16, fontSize:13, color:"#92400E", display:"flex", gap:10, alignItems:"center" }}>
          ⚠️ No break schedule found for today. Go to the <strong>Break</strong> page to schedule breaks — they will appear here automatically.
        </div>
      )}

      {/* Employee Cards */}
      {workingNow.length===0 && (
        <div style={{ ...CRD(), textAlign:"center", padding:40, color:"#94A3B8" }}>
          No employees scheduled for this shift right now.
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:12 }}>
        {workingNow.map(emp => {
          const es          = getEmpStatus(emp);
          const sid         = (schedule[emp.id]||{})[dayName];
          const sh          = shifts.find(s=>s.id===sid);
          const shortTotal  = totalShortMin(emp.id);
          const statusColor = es.status==="Break"    ? (es.isOvertime?"#EF4444":"#F59E0B")
                            : es.status==="Break Soon"? "#6366F1" : "#10B981";
          const borderColor = es.isOvertime ? "#EF4444" : statusColor;

          // Get overtime from breakSchedule if recorded
          const bsEntry = getScheduledBreak(emp);
          const recordedOver = bsEntry?.overMin||0;

          return (
            <div key={emp.id} style={{ ...CRD({ padding:16 }),
              border:`2px solid ${borderColor}40`, borderLeft:`4px solid ${borderColor}` }}>

              {/* Header */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ fontWeight:800, fontSize:14, color:"#0F2744", display:"flex", alignItems:"center", gap:6 }}>
                    {emp.name}
                    <span style={{ fontSize:9, fontWeight:800, padding:"1px 5px", borderRadius:4,
                      background:emp.gender==="F"?"#FCE7F3":"#EFF6FF",
                      color:emp.gender==="F"?"#BE185D":"#1D4ED8",
                      border:emp.gender==="F"?"1px solid #F9A8D4":"1px solid #BFDBFE" }}>
                      {emp.gender||"M"}
                    </span>
                  </div>
                  <div style={{ fontSize:11, color:ROLE_COLORS[emp.role]||"#64748B", fontWeight:600 }}>{emp.role}</div>
                  {sh && <div style={{ fontSize:11, color:sh.color, marginTop:2 }}>⏰ {sh.label}</div>}
                </div>
                <div style={{ textAlign:"right" }}>
                  <span style={{ background:statusColor+"20", color:statusColor, borderRadius:20,
                    padding:"3px 10px", fontSize:12, fontWeight:700,
                    border:es.isOvertime?"2px solid #EF4444":"none" }}>
                    {es.status==="Break"     ? "☕ Break"
                     :es.status==="Break Soon"? "🔜 Break Soon"
                     :es.breakDone          ? "✅ Break Done"
                     :"🟢 Online"}
                  </span>
                </div>
              </div>

              {/* Scheduled break info */}
              {bsEntry && (
                <div style={{ background: es.status==="Break"?(es.isOvertime?"#FEF2F2":"#FEF9C3")
                  :es.status==="Break Soon"?"#EEF2FF":"#F0FDF4",
                  borderRadius:8, padding:"8px 12px", marginBottom:10, fontSize:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700,
                    color:statusColor, marginBottom:4 }}>
                    <span>📋 Scheduled: {bsEntry.start} → {(() => {
                      const e=(toMin(bsEntry.start)+Number(bsEntry.durationMin))%1440;
                      return pad(Math.floor(e/60))+":"+pad(e%60);
                    })()} ({bsEntry.durationMin}m)</span>
                  </div>
                  {es.status==="Break" && (
                    <>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11,
                        color:"#64748B", marginBottom:4 }}>
                        <span>Elapsed: {es.elapsed}m</span>
                        {es.isOvertime && <span style={{ color:"#EF4444", fontWeight:700 }}>⚠️ +{es.over}m OVER</span>}
                      </div>
                      <div style={{ background:"#E2E8F0", borderRadius:10, height:8, overflow:"hidden" }}>
                        <div style={{ width:Math.min(100,Math.round((es.elapsed/bsEntry.durationMin)*100))+"%",
                          height:"100%", background:es.isOvertime?"#EF4444":"#F59E0B",
                          borderRadius:10, transition:"width 1s" }}/>
                      </div>
                    </>
                  )}
                  {es.status==="Break Soon" && (
                    <div style={{ fontSize:11, color:"#6366F1", fontWeight:600 }}>
                      ⏱ Starts in {es.minsUntil}m
                    </div>
                  )}
                  {es.breakDone && !es.isOvertime && (
                    <div style={{ fontSize:11, color:"#10B981", fontWeight:600 }}>Break completed ✅</div>
                  )}
                </div>
              )}

              {/* Overtime input — shown when on break and over time */}
              {es.status==="Break" && es.isOvertime && (
                <div style={{ marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:12, color:"#EF4444", fontWeight:600 }}>Record overtime:</span>
                  <input type="number" min="0" max="120"
                    value={recordedOver||es.over||""}
                    onChange={e=>recordOvertime(emp, e.target.value)}
                    style={{ ...I({ width:65, border:"2px solid #EF4444" })}} placeholder="min"/>
                  <span style={{ fontSize:11, color:"#EF4444" }}>min</span>
                </div>
              )}
              {recordedOver>0 && es.status!=="Break" && (
                <div style={{ fontSize:11, color:"#EF4444", fontWeight:600, marginBottom:8 }}>
                  ⚠️ Overtime recorded: +{recordedOver}m
                </div>
              )}

              {/* Short Breaks */}
              {shortTotal > 0 && (
                <div style={{ fontSize:11, color:"#8B5CF6", fontWeight:600, marginBottom:8 }}>
                  ⚡ Short Breaks: {shortTotal}m total
                  {getShortBreaks(emp.id).map((sb,i)=>(
                    <span key={i} style={{ marginLeft:6, color:"#94A3B8" }}>[{sb.start} +{sb.durationMin}m]</span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <button onClick={()=>{ setShowShortModal(emp.id); setShortStart(pad(now.getHours())+":"+pad(now.getMinutes())); setShortDur(15); }}
                  style={PBT("#8B5CF6",{padding:"5px 12px",fontSize:11})}>⚡ Short Break</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Short Break Modal */}
      {showShortModal && (
        <Modal title={`⚡ Short Break — ${employees.find(e=>e.id===showShortModal)?.name}`}
          onClose={()=>setShowShortModal(null)} width={380}>
          <label style={LBL}>وقت البداية</label>
          <input type="time" value={shortStart} onChange={e=>setShortStart(e.target.value)} style={{ ...I(), marginBottom:12 }}/>
          <label style={LBL}>المدة (دقيقة)</label>
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            {[5,10,15,20,30].map(d=>(
              <button key={d} onClick={()=>setShortDur(d)}
                style={{ border:`2px solid ${shortDur===d?"#8B5CF6":"#CBD5E1"}`, borderRadius:8,
                  padding:"6px 14px", fontSize:13, cursor:"pointer", fontWeight:700,
                  background:shortDur===d?"#F3E8FF":"#fff", color:shortDur===d?"#6D28D9":"#64748B" }}>{d}m</button>
            ))}
            <input type="number" min="1" max="120" value={shortDur}
              onChange={e=>setShortDur(Number(e.target.value))}
              style={{ ...I({ width:80 })}} placeholder="Custom"/>
          </div>
          <button style={PBT("#8B5CF6",{width:"100%",padding:"10px"})}
            onClick={()=>addShortBreak(showShortModal)}>⚡ Add Short Break</button>
        </Modal>
      )}
    </div>
  );
}

  // Live clock
  useState(()=>{ const t=setInterval(()=>setNow(new Date()),60000); return()=>clearInterval(t); });

  const nowMin  = now.getHours()*60+now.getMinutes();
  const todayD  = now.toISOString().slice(0,10);
  const dayName = DAYS[now.getDay()];

  // Employees working right now
  const workingNow = employees.filter(emp => {
    const sid = (schedule[emp.id]||{})[dayName];
    if (!sid||sid==="OFF"||sid==="LEAVE"||sid==="PH") return false;
    const sh = shifts.find(s=>s.id===sid);
    if (!sh) return false;
    const st=toMin(sh.start), en=toMin(sh.end);
    if (en>st) return nowMin>=st && nowMin<en;
    return nowMin>=st || nowMin<en;
  });

  function getBreak(empId) { return breaks[empId]||{start:null,end:null,durationMin:null,extraBreaks:[]}; }

  // Schedule a break with specific start + end time
  function scheduleBreak(empId) {
    if (!breakStart || !breakEnd) { alert("Please select break start and end time."); return; }
    const dur = toMin(breakEnd) - toMin(breakStart);
    const actualDur = dur < 0 ? dur+1440 : dur;
    setBreaks(prev=>({...prev,[empId]:{...getBreak(empId), start:breakStart, end:breakEnd, durationMin:actualDur}}));
    setShowBreakModal(null); setBreakStartTime(""); setBreakEndTime("");
  }

  function endBreak(empId) {
    setBreaks(prev=>({...prev,[empId]:{...getBreak(empId), start:null, end:null, durationMin:null}}));
  }

  function addExtraBreak(empId) {
    if (!extraStart) return;
    const b = getBreak(empId);
    const extra = [...(b.extraBreaks||[]), { start:extraStart, durationMin:Number(extraDur) }];
    setBreaks(prev=>({...prev,[empId]:{...b,extraBreaks:extra}}));
    setExtraStart(""); setExtraDur(15); setShowExtraModal(null);
  }

  // Per-employee status — checks if now is within scheduled break window
  function getEmpStatus(emp) {
    const b = getBreak(emp.id);
    if (b.start && b.end) {
      const bStart = toMin(b.start);
      const bEnd   = toMin(b.end);
      const dur    = b.durationMin||0;
      // Check if currently in break window
      let inBreak = false;
      if (bEnd > bStart) inBreak = nowMin >= bStart && nowMin < bEnd;
      else inBreak = nowMin >= bStart || nowMin < bEnd; // midnight cross
      if (inBreak) {
        const elapsed = nowMin >= bStart ? nowMin-bStart : nowMin+1440-bStart;
        const over = elapsed - dur;
        return { status:"Break", elapsed, over, isOvertime: over>0, bStart:b.start, bEnd:b.end, dur };
      }
      // Break is scheduled but not yet started
      if (bStart > nowMin) return { status:"Break Scheduled", elapsed:0, over:0, isOvertime:false, bStart:b.start, bEnd:b.end, dur };
    }
    return { status:"Online", elapsed:0, over:0, isOvertime:false };
  }

  function totalExtraMin(empId) {
    return (getBreak(empId).extraBreaks||[]).reduce((s,b)=>s+b.durationMin,0);
  }

  const onlineCount = workingNow.filter(e=>{ const s=getEmpStatus(e).status; return s==="Online"||s==="Break Scheduled"; }).length;
  const breakCount  = workingNow.filter(e=>getEmpStatus(e).status==="Break").length;
  const total = workingNow.length;
  const pressureRatio = total>0 ? onlineCount/total : 1;
  const pressure = pressureRatio>=0.8 ? {label:"✅ Staffing Sufficient", color:"#10B981", bg:"#F0FDF4"}
                 : pressureRatio>=0.6 ? {label:"⚠️ Staffing Low — Monitor", color:"#F59E0B", bg:"#FEF9C3"}
                 : {label:"🚨 Critical Shortage — Immediate Action Required", color:"#EF4444", bg:"#FEF2F2"};

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>🏢 Live Floor Monitor</span>
        <span style={{ fontSize:13, color:"#64748B" }}>🕐 {pad(now.getHours())}:{pad(now.getMinutes())} · {dayName}</span>
        <div style={{ display:"flex", gap:10, marginLeft:"auto" }}>
          <span style={{ background:"#10B981"+"20", color:"#10B981", borderRadius:20, padding:"4px 14px", fontWeight:700, fontSize:13 }}>🟢 Online: {onlineCount}</span>
          <span style={{ background:"#F59E0B"+"20", color:"#F59E0B", borderRadius:20, padding:"4px 14px", fontWeight:700, fontSize:13 }}>☕ Break: {breakCount}</span>
          <span style={{ background:"#64748B"+"20", color:"#64748B", borderRadius:20, padding:"4px 14px", fontWeight:700, fontSize:13 }}>👥 Total: {total}</span>
        </div>
      </div>

      {/* Pressure Indicator */}
      <div style={{ background:pressure.bg, border:`2px solid ${pressure.color}40`, borderRadius:12,
        padding:"18px 24px", marginBottom:20, display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ fontSize:36 }}>{pressureRatio>=0.8?"✅":pressureRatio>=0.6?"⚠️":"🚨"}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:18, color:pressure.color }}>{pressure.label}</div>
          <div style={{ fontSize:13, color:"#475569", marginTop:4 }}>{onlineCount} of {total} agents online · {breakCount} on break</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:32, fontWeight:800, color:pressure.color }}>{total>0?Math.round(pressureRatio*100):0}%</div>
          <div style={{ fontSize:11, color:"#94A3B8" }}>Available</div>
        </div>
      </div>

      {/* Employee Cards */}
      {workingNow.length===0 && (
        <div style={{ ...CRD(), textAlign:"center", padding:40, color:"#94A3B8" }}>No employees scheduled for this shift right now.</div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:12 }}>
        {workingNow.map(emp => {
          const es = getEmpStatus(emp);
          const b  = getBreak(emp.id);
          const sid = (schedule[emp.id]||{})[dayName];
          const sh  = shifts.find(s=>s.id===sid);
          const extraTotal = totalExtraMin(emp.id);
          const statusColor = es.status==="Break"?"#F59E0B":es.status==="Break Scheduled"?"#2563EB":"#10B981";
          const borderColor = es.isOvertime?"#EF4444":statusColor;

          return (
            <div key={emp.id} style={{ ...CRD({ padding:16 }), border:`2px solid ${borderColor}40`, borderLeft:`4px solid ${borderColor}` }}>
              {/* Header */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ fontWeight:800, fontSize:14, color:"#0F2744" }}>{emp.name}</div>
                  <div style={{ fontSize:11, color:ROLE_COLORS[emp.role]||"#64748B", fontWeight:600 }}>{emp.role}</div>
                  {sh && <div style={{ fontSize:11, color:sh.color, marginTop:2 }}>⏰ {sh.label} {sh.start}–{sh.end}</div>}
                </div>
                <div style={{ textAlign:"right" }}>
                  <span style={{ background:statusColor+"20", color:statusColor, borderRadius:20,
                    padding:"3px 10px", fontSize:12, fontWeight:700,
                    border: es.isOvertime?"2px solid #EF4444":"none" }}>
                    {es.status==="Break"?"☕ On Break":es.status==="Break Scheduled"?"🕐 Break Scheduled":"🟢 Online"}
                  </span>
                  {es.status==="Break" && (
                    <div style={{ fontSize:11, marginTop:4, color:es.isOvertime?"#EF4444":"#F59E0B", fontWeight:700 }}>
                      {es.elapsed}m elapsed {es.isOvertime?`(+${es.over}m OVER)`:""}
                    </div>
                  )}
                </div>
              </div>

              {/* Break Schedule Info */}
              {(es.status==="Break"||es.status==="Break Scheduled") && b.start && b.end && (
                <div style={{ background:"#FEF9C3", border:"1px solid #F59E0B40", borderRadius:8,
                  padding:"8px 12px", marginBottom:10, fontSize:12 }}>
                  <div style={{ fontWeight:700, color:"#92400E", marginBottom:2 }}>☕ Break: {b.start} → {b.end} ({b.durationMin}m)</div>
                  {es.status==="Break" && (
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ background:"#F1F5F9", borderRadius:10, height:6, flex:1, overflow:"hidden" }}>
                        <div style={{ width:Math.min(100,Math.round(es.elapsed/es.dur*100))+"%", height:"100%",
                          background:es.isOvertime?"#EF4444":"#F59E0B", borderRadius:10 }}/>
                      </div>
                      <span style={{ fontSize:11, color:es.isOvertime?"#EF4444":"#92400E", fontWeight:700, whiteSpace:"nowrap" }}>
                        {es.elapsed}/{es.dur}m
                      </span>
                    </div>
                  )}
                  {es.status==="Break Scheduled" && (
                    <div style={{ fontSize:11, color:"#2563EB", fontWeight:600 }}>Starts at {b.start}</div>
                  )}
                </div>
              )}

              {/* Extra breaks */}
              {extraTotal>0 && (
                <div style={{ fontSize:11, color:"#EF4444", fontWeight:600, marginBottom:8 }}>
                  ⚠️ Extra breaks: {extraTotal}m total
                  {b.extraBreaks?.map((eb,i)=>(
                    <span key={i} style={{ marginLeft:6, color:"#94A3B8" }}>[{eb.start} +{eb.durationMin}m]</span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {es.status==="Online" ? (
                  <button onClick={()=>{
                    setShowBreakModal(emp.id);
                    setBreakStartTime(pad(now.getHours())+":"+pad(now.getMinutes()));
                    setBreakEndTime(pad(now.getHours())+":"+pad((now.getMinutes()+30)%60));
                  }} style={PBT("#F59E0B",{padding:"5px 12px",fontSize:11})}>☕ Schedule Break</button>
                ) : (
                  <button onClick={()=>endBreak(emp.id)}
                    style={PBT("#10B981",{padding:"5px 12px",fontSize:11})}>✅ End Break</button>
                )}
                <button onClick={()=>{setShowExtraModal(emp.id);setExtraStart(pad(now.getHours())+":"+pad(now.getMinutes()));setExtraDur(15);}}
                  style={PBT("#8B5CF6",{padding:"5px 12px",fontSize:11})}>+ Extra Break</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Break Modal */}
      {showBreakModal && (
        <Modal title={`☕ Schedule Break — ${employees.find(e=>e.id===showBreakModal)?.name}`}
          onClose={()=>setShowBreakModal(null)} width={380}>
          <div style={{ background:"#EFF6FF", borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#1D4ED8" }}>
            حدد وقت بداية ونهاية البريك — سيتم احتساب المدة تلقائياً
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            <div>
              <label style={LBL}>وقت البداية</label>
              <input type="time" value={breakStart} onChange={e=>setBreakStartTime(e.target.value)} style={I()}/>
            </div>
            <div>
              <label style={LBL}>وقت النهاية</label>
              <input type="time" value={breakEnd} onChange={e=>setBreakEndTime(e.target.value)} style={I()}/>
            </div>
          </div>
          {breakStart && breakEnd && (
            <div style={{ background:"#F0FDF4", border:"1px solid #86EFAC", borderRadius:6, padding:"8px 12px", marginBottom:14, fontSize:13, color:"#166534", fontWeight:600 }}>
              ⏱ المدة: {(()=>{ const d=toMin(breakEnd)-toMin(breakStart); return (d<0?d+1440:d); })()}م
            </div>
          )}
          <button style={PBT("#F59E0B",{width:"100%",padding:"10px",fontSize:13})} onClick={()=>scheduleBreak(showBreakModal)}>
            ✅ تأكيد البريك
          </button>
        </Modal>
      )}

      {/* Extra Break Modal */}
      {showExtraModal && (
        <Modal title={`+ Extra Break — ${employees.find(e=>e.id===showExtraModal)?.name}`}
          onClose={()=>setShowExtraModal(null)} width={380}>
          <label style={LBL}>Break Start Time</label>
          <input type="time" value={extraStart} onChange={e=>setExtraStart(e.target.value)} style={{ ...I(), marginBottom:12 }}/>
          <label style={LBL}>Duration (minutes)</label>
          <input type="number" min="1" max="120" value={extraDur} onChange={e=>setExtraDur(Number(e.target.value))} style={{ ...I(), marginBottom:16 }}/>
          <button style={PBT("#8B5CF6",{width:"100%",padding:"10px"})} onClick={()=>addExtraBreak(showExtraModal)}>+ Add Extra Break</button>
        </Modal>
      )}
    </div>
  );
}

// ─── DAILY TASKS PAGE (merged Roster + Tasks) ─────────────────────────────────
function DailyTasksPage({ employees, setEmployees, schedule, setSchedule, shifts, auditLog, setAuditLog, session }) {
  const [tab, setTab] = useState("tasks"); // "tasks" | "roster"
  // Forward to existing components
  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {[["tasks","📋 Task Assignments"],["roster","👥 Employee Roster"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{ border:`2px solid #2563EB`, borderRadius:20, padding:"6px 16px", fontSize:13, cursor:"pointer", fontWeight:600,
              background:tab===k?"#2563EB":"transparent", color:tab===k?"#fff":"#2563EB" }}>{l}</button>
        ))}
      </div>
      {tab==="tasks"
        ? <TaskAssignmentsPage employees={employees} setEmployees={setEmployees} auditLog={auditLog} setAuditLog={setAuditLog} session={session}/>
        : <RosterPage employees={employees} setEmployees={setEmployees} schedule={schedule} setSchedule={setSchedule} shifts={shifts}/>
      }
    </div>
  );
}

// ─── ROSTER PAGE ──────────────────────────────────────────────────────────────
function RosterPage({ employees, setEmployees, schedule, setSchedule, shifts }) {
  const [date, setDate] = useState(todayStr());
  const [activeShift, setActiveShift] = useState(shifts[0]?.id||"");
  const [showAdd, setShowAdd] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [newEmp, setNewEmp] = useState({ name:"", tasks:[], role:"Agent" });

  const dayName = DAYS[new Date(date+"T12:00:00").getDay()];

  // Employees scheduled for this shift on this day
  const shiftEmployees = useMemo(() =>
    employees.filter(emp => (schedule[emp.id]||{})[dayName] === activeShift),
    [employees, schedule, activeShift, dayName]
  );

  // KPI counts for this shift view
  const roleGroups = {};
  shiftEmployees.forEach(e => { roleGroups[e.role] = (roleGroups[e.role]||0)+1; });

  function addEmployee() {
    if (!newEmp.name.trim()) return;
    const id = "e"+Date.now();
    const finalRole = newEmp.role==="Other" ? (newEmp.customRole||"Other") : newEmp.role;
    const defaultSched = { Sunday:"OFF", Monday:"OFF", Tuesday:"OFF", Wednesday:"OFF", Thursday:"OFF", Friday:"OFF", Saturday:"OFF" };
    defaultSched[dayName] = activeShift;
    setEmployees(prev => [...prev, { id, name:newEmp.name, role:finalRole, tasks:newEmp.tasks }]);
    setSchedule(prev => ({ ...prev, [id]: defaultSched }));
    setNewEmp({ name:"", tasks:[], role:"Agent", customRole:"" });
    setShowAdd(false);
  }

  function saveEdit() {
    const finalRole = editEmp.role==="Other" ? (editEmp.customRole||"Other") : editEmp.role;
    setEmployees(prev => prev.map(e => e.id===editEmp.id ? {...editEmp, role:finalRole} : e));
    setEditEmp(null);
  }

  // Remove from this shift only (set to OFF for this day), does NOT delete employee
  function removeFromShift(empId) {
    if (!window.confirm("Remove this employee from this shift? (They won't be deleted, just unscheduled for this day)")) return;
    setSchedule(prev => ({ ...prev, [empId]: { ...(prev[empId]||{}), [dayName]:"OFF" } }));
  }

  // Permanently delete employee
  function deleteEmp(id) {
    if (!window.confirm("Permanently delete this employee from the system?")) return;
    setEmployees(prev => prev.filter(e => e.id!==id));
    setSchedule(prev => { const n={...prev}; delete n[id]; return n; });
  }

  const sh = shifts.find(s=>s.id===activeShift);

  return (
    <div>
      {/* Toolbar */}
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>👥 Daily Roster</span>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...I(), width:150 }}/>
        <span style={{ fontSize:12, color:"#64748B", fontWeight:600 }}>{dayName}</span>
        <button style={PBT("#2563EB")} onClick={()=>setShowAdd(true)}>+ Add Employee</button>
      </div>

      {/* Shift Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
        {shifts.map(s => (
          <button key={s.id} onClick={()=>setActiveShift(s.id)}
            style={{ border:`2px solid ${s.color}`, borderRadius:20, padding:"5px 14px", fontSize:12, cursor:"pointer", fontWeight:600,
              background: activeShift===s.id ? s.color : "transparent", color: activeShift===s.id ? "#fff" : s.color, transition:"all 0.15s" }}>
            {s.label} · {s.start}
          </button>
        ))}
      </div>

      {/* Shift header + KPI strip */}
      {sh && (
        <div style={{ background: sh.color+"18", border:`1.5px solid ${sh.color}40`, borderRadius:10, padding:"12px 18px", marginBottom:14, display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
          <div style={{ fontWeight:800, color:sh.color, fontSize:15 }}>⏰ {sh.label} &nbsp; {sh.start} – {sh.end}</div>
          <div style={{ fontWeight:700, fontSize:13, color:"#0F2744" }}>{shiftEmployees.length} scheduled</div>
          {Object.entries(roleGroups).map(([role,count]) => (
            <span key={role} style={{ fontSize:12, background:"#fff", border:`1px solid ${sh.color}60`, borderRadius:10, padding:"3px 10px", color:"#475569", fontWeight:600 }}>
              {role}: {count}
            </span>
          ))}
        </div>
      )}

      {/* Table */}
      <div style={{ ...CRD(), overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#F8FAFC" }}>
              {["#","Name","Role","Tasks","Actions"].map(h=>(
                <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontWeight:700, color:"#0F2744", borderBottom:"2px solid #E2E8F0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shiftEmployees.map((emp, ri) => (
              <tr key={emp.id} style={{ background: ri%2===0?"#fff":"#F8FAFC" }}>
                <td style={{ padding:"10px 12px", color:"#94A3B8", fontWeight:600 }}>{ri+1}</td>
                <td style={{ padding:"10px 12px", fontWeight:700, color:"#1E293B" }}>{emp.name}</td>
                <td style={{ padding:"10px 12px" }}>
                  <span style={{ background:"#F1F5F9", borderRadius:6, padding:"3px 9px", fontSize:12, color:"#475569", fontWeight:600 }}>{emp.role}</span>
                </td>
                <td style={{ padding:"10px 12px" }}>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                    {emp.tasks.map(t=>(
                      <span key={t} style={{ background:taskColor(t), color:"#fff", borderRadius:10, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{t}</span>
                    ))}
                  </div>
                </td>
                <td style={{ padding:"10px 12px" }}>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={()=>setEditEmp({...emp})}
                      style={{ background:"none", border:"1px solid #CBD5E1", borderRadius:6, padding:"4px 8px", cursor:"pointer", fontSize:13 }} title="Edit">✏️</button>
                    <button onClick={()=>removeFromShift(emp.id)}
                      style={{ background:"none", border:"1px solid #FCD34D", borderRadius:6, padding:"4px 8px", cursor:"pointer", fontSize:13, color:"#92400E" }} title="Remove from shift">📅✕</button>
                    <button onClick={()=>deleteEmp(emp.id)}
                      style={{ background:"none", border:"1px solid #FCA5A5", borderRadius:6, padding:"4px 8px", cursor:"pointer", fontSize:13, color:"#EF4444" }} title="Delete employee">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
            {shiftEmployees.length===0 && (
              <tr>
                <td colSpan={5} style={{ padding:32, textAlign:"center", color:"#94A3B8" }}>
                  No employees scheduled for <strong>{sh?.label}</strong> on <strong>{dayName}</strong>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ marginTop:10, display:"flex", gap:16, fontSize:11, color:"#94A3B8" }}>
        <span>✏️ Edit info</span>
        <span>📅✕ Remove from this shift only</span>
        <span>🗑️ Delete permanently</span>
      </div>

      {/* Add Modal — assigns to current shift+day automatically */}
      {showAdd && (
        <Modal title={`Add Employee to ${sh?.label||""} · ${dayName}`} onClose={()=>setShowAdd(false)}>
          <div style={{ background:"#EFF6FF", borderRadius:6, padding:"8px 12px", marginBottom:14, fontSize:12, color:"#1D4ED8" }}>
            سيتم تعيين الموظف تلقائياً على شفت <strong>{sh?.label} ({sh?.start}–{sh?.end})</strong> يوم <strong>{dayName}</strong>
          </div>
          <label style={LBL}>Name</label>
          <input style={{ ...I(), marginBottom:12 }} value={newEmp.name} onChange={e=>setNewEmp(p=>({...p,name:e.target.value}))} placeholder="Full name" autoFocus/>
          <label style={LBL}>Role</label>
          <select style={{ ...I(), marginBottom: newEmp.role==="Other"?6:12 }} value={newEmp.role} onChange={e=>setNewEmp(p=>({...p,role:e.target.value,customRole:""}))}>
            {["Agent","Shift Leader","Team Lead","SME","Other"].map(r=><option key={r}>{r}</option>)}
          </select>
          {newEmp.role==="Other" && (
            <input style={{ ...I(), marginBottom:12 }} value={newEmp.customRole||""} onChange={e=>setNewEmp(p=>({...p,customRole:e.target.value}))} placeholder="Enter custom role title..."/>
          )}
          <label style={LBL}>Tasks</label>
          <div style={{ marginBottom:16 }}><TaskPicker selected={newEmp.tasks} onChange={tasks=>setNewEmp(p=>({...p,tasks}))}/></div>
          <button style={PBT("#2563EB",{width:"100%"})} onClick={addEmployee}>+ Add & Assign to Shift</button>
        </Modal>
      )}

      {/* Edit Modal */}
      {editEmp && (
        <Modal title="Edit Employee" onClose={()=>setEditEmp(null)}>
          <label style={LBL}>Name</label>
          <input style={{ ...I(), marginBottom:12 }} value={editEmp.name} onChange={e=>setEditEmp(p=>({...p,name:e.target.value}))}/>
          <label style={LBL}>Role</label>
          <select style={{ ...I(), marginBottom: editEmp.role==="Other"?6:12 }} value={editEmp.role} onChange={e=>setEditEmp(p=>({...p,role:e.target.value,customRole:""}))}>
            {["Agent","Shift Leader","Team Lead","SME","Other"].map(r=><option key={r}>{r}</option>)}
          </select>
          {editEmp.role==="Other" && (
            <input style={{ ...I(), marginBottom:12 }} value={editEmp.customRole||""} onChange={e=>setEditEmp(p=>({...p,customRole:e.target.value}))} placeholder="Enter custom role title..."/>
          )}
          <label style={LBL}>Tasks</label>
          <div style={{ marginBottom:16 }}><TaskPicker selected={editEmp.tasks} onChange={tasks=>setEditEmp(p=>({...p,tasks}))}/></div>
          <button style={PBT("#2563EB",{width:"100%"})} onClick={saveEdit}>Save Changes</button>
        </Modal>
      )}
    </div>
  );
}

// ─── SHIFTS CONFIG PAGE ───────────────────────────────────────────────────────
function ShiftsPage({ shifts, setShifts }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newShift, setNewShift] = useState({ label:"New Shift", start:"09:00", end:"17:00", color:"#6366F1" });

  function saveEdit() {
    setShifts(prev=>prev.map(s=>s.id===editId?{...s,...editData}:s));
    setEditId(null);
  }
  function addShift() {
    setShifts(prev=>[...prev,{id:"s"+Date.now(),...newShift}]);
    setShowAdd(false);
  }
  function deleteShift(id) {
    if (!window.confirm("Delete this shift?")) return;
    setShifts(prev=>prev.filter(s=>s.id!==id));
  }

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>⏰ Shift Configuration</span>
        <button style={PBT("#2563EB")} onClick={()=>setShowAdd(true)}>+ Add Shift</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
        {shifts.map(sh=>(
          <div key={sh.id} style={{ ...CRD({ padding:0 }), overflow:"hidden" }}>
            <div style={{ background:sh.color, padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>{sh.label}</div>
                <div style={{ color:"rgba(255,255,255,0.85)", fontSize:13 }}>{sh.start} – {sh.end}</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={()=>{setEditId(sh.id);setEditData({...sh});}}
                  style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>✏️</button>
                <button onClick={()=>deleteShift(sh.id)}
                  style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", borderRadius:6, padding:"4px 10px", cursor:"pointer" }}>✕</button>
              </div>
            </div>
            {editId===sh.id && (
              <div style={{ padding:16 }}>
                <label style={LBL}>Label</label>
                <input style={{ ...I(), marginBottom:8 }} value={editData.label||""} onChange={e=>setEditData(p=>({...p,label:e.target.value}))}/>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                  <div><label style={LBL}>Start</label><input type="time" style={I()} value={editData.start||""} onChange={e=>setEditData(p=>({...p,start:e.target.value}))}/></div>
                  <div><label style={LBL}>End</label><input type="time" style={I()} value={editData.end||""} onChange={e=>setEditData(p=>({...p,end:e.target.value}))}/></div>
                </div>
                <label style={LBL}>Color</label>
                <input type="color" style={{ ...I(), height:36, padding:2, marginBottom:10 }} value={editData.color||"#2563EB"} onChange={e=>setEditData(p=>({...p,color:e.target.value}))}/>
                <div style={{ display:"flex", gap:8 }}>
                  <button style={PBT("#10B981",{flex:1})} onClick={saveEdit}>Save</button>
                  <button style={PBT("#94A3B8",{flex:1})} onClick={()=>setEditId(null)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAdd && (
        <Modal title="Add New Shift" onClose={()=>setShowAdd(false)}>
          <label style={LBL}>Label</label>
          <input style={{ ...I(), marginBottom:12 }} value={newShift.label} onChange={e=>setNewShift(p=>({...p,label:e.target.value}))}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
            <div><label style={LBL}>Start</label><input type="time" style={I()} value={newShift.start} onChange={e=>setNewShift(p=>({...p,start:e.target.value}))}/></div>
            <div><label style={LBL}>End</label><input type="time" style={I()} value={newShift.end} onChange={e=>setNewShift(p=>({...p,end:e.target.value}))}/></div>
          </div>
          <label style={LBL}>Color</label>
          <input type="color" style={{ ...I(), height:40, marginBottom:16, padding:4 }} value={newShift.color} onChange={e=>setNewShift(p=>({...p,color:e.target.value}))}/>
          <button style={PBT("#2563EB",{width:"100%"})} onClick={addShift}>Add Shift</button>
        </Modal>
      )}
    </div>
  );
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
function ReportsPage({ employees, schedule, shifts, attendance, performance, heatmap, kg, queueLog }) {
  const [reportType, setReportType]   = useState("ops");
  const [date, setDate]               = useState(todayStr());
  const [month, setMonth]             = useState(new Date().toISOString().slice(0,7));
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [copied, setCopied]           = useState(false);

  // ── Ops Report state ────────────────────────────────────────────────────────
  const [opsBaseTime,   setOpsBaseTime]   = useState("17:00");
  const [opsUpdTime,    setOpsUpdTime]    = useState("20:00");
  const [opsStatus,     setOpsStatus]     = useState("🔴 CRITICAL BUT HIGHLY ACTIVE");
  const [opsStatusNote, setOpsStatusNote] = useState("Managing aggressive inflow vs. high resolution rate");
  const [opsNarrative,  setOpsNarrative]  = useState("");
  const [opsExecNote,   setOpsExecNote]   = useState("");

  // KSA queues
  const [ksaOBBase,    setKsaOBBase]    = useState("");
  const [ksaOBIn,      setKsaOBIn]      = useState("");
  const [ksaOBCurr,    setKsaOBCurr]    = useState("");
  const [ksaSomeBase,  setKsaSomeBase]  = useState("");
  const [ksaSomeIn,    setKsaSomeIn]    = useState("");
  const [ksaSomeCurr,  setKsaSomeCurr]  = useState("");
  const [ksaOsloBase,  setKsaOsloBase]  = useState("");
  const [ksaOsloIn,    setKsaOsloIn]    = useState("");
  const [ksaOsloCurr,  setKsaOsloCurr]  = useState("");

  // GCC queues
  const [gccT2Base,    setGccT2Base]    = useState("");
  const [gccT2In,      setGccT2In]      = useState("");
  const [gccT2Curr,    setGccT2Curr]    = useState("");
  const [gccSomeBase,  setGccSomeBase]  = useState("");
  const [gccSomeIn,    setGccSomeIn]    = useState("");
  const [gccSomeCurr,  setGccSomeCurr]  = useState("");

  // Workforce allocation rows
  const [allocRows, setAllocRows] = useState([
    { team:"KSA Outbound (OT) Core Team", agents:"" },
    { team:"KSA Critical & Complex Cases", agents:"" },
    { team:"GCC Regional Coverage", agents:"" },
    { team:"Specialized Channels", agents:"" },
  ]);

  function updateAllocRow(i, field, val) {
    setAllocRows(prev => prev.map((r,ri) => ri===i ? {...r,[field]:val} : r));
  }
  function addAllocRow() { setAllocRows(prev=>[...prev,{team:"",agents:""}]); }
  function removeAllocRow(i) { setAllocRows(prev=>prev.filter((_,ri)=>ri!==i)); }

  // helpers
  function n(v) { return Number(v)||0; }
  function resolved(base,inflow,curr) { return n(base)+n(inflow)-n(curr); }
  function net(base,curr) { return n(curr)-n(base); }
  function netStr(v) { return v>0?`Net Increase of ${v} cases`:v<0?`Net Decrease of ${Math.abs(v)} cases`:"No Change"; }

  // Duration label
  function durationLabel() {
    if (!opsBaseTime||!opsUpdTime) return "";
    let d = toMin(opsUpdTime)-toMin(opsBaseTime);
    if(d<0) d+=1440;
    const h=Math.floor(d/60), m=d%60;
    return h>0 ? `${h} hour${h>1?"s":""}${m>0?` ${m} min`:""}` : `${m} min`;
  }

  // Toggle shift in filter
  function toggleShift(sid) {
    setSelectedShifts(prev => prev.includes(sid) ? prev.filter(x=>x!==sid) : [...prev, sid]);
  }

  // Filter employees by selected shifts for a given day
  function getShiftEmps(dayName) {
    return employees.filter(emp => {
      const v = (schedule[emp.id]||{})[dayName];
      if (!v || v==="OFF" || v==="LEAVE" || v==="PH") return false;
      if (selectedShifts.length === 0) return true;
      return selectedShifts.includes(v);
    });
  }

  function getMonthStats(y, m) {
    const dates = monthDates(y, m);
    const stats = {};
    employees.forEach(emp => {
      stats[emp.id] = {
        abs:0, lateCount:0, lateMin:0, earlyCount:0,
        closed:0, escalations:0, workDays:0,
        totalWorkMin:0,       // actual minutes worked (checkIn→checkOut)
        breakViolationMin:0,  // minutes over scheduled break
        extraBreakMin:0,      // extra unscheduled break minutes
      };
    });
    dates.forEach(d => {
      const dayName = DAYS[new Date(d+"T12:00:00").getDay()];
      employees.forEach(emp => {
        const v = (schedule[emp.id]||{})[dayName];
        if (!v || v==="OFF" || v==="LEAVE" || v==="PH") return;
        if (selectedShifts.length > 0 && !selectedShifts.includes(v)) return;
        const att  = ((attendance[d]||{})[emp.id]) || { status:"Present" };
        const perf = ((performance[d]||{})[emp.id]) || {};
        const s = stats[emp.id];
        s.workDays++;
        if (att.status==="Absent") s.abs++;
        if (att.status==="Late" || (att.lateMin||0)>=7) { s.lateCount++; s.lateMin += att.lateMin||0; }
        if (att.status==="Early Leave") s.earlyCount++;
        s.closed       += perf.closed||0;
        s.escalations  += perf.escalations||0;
        if (att.workDuration) s.totalWorkMin += Number(att.workDuration)||0;
      });
    });
    return stats;
  }

  // New scorecard: Attendance 40% · Work Hours 35% · Punctuality 25%
  function getScorecard(stats) {
    return employees.map(emp => {
      const s = stats[emp.id];
      if (!s || s.workDays === 0) return null;
      const attRate    = Math.round(((s.workDays - s.abs) / s.workDays) * 100);
      const avgWorkH   = s.workDays > 0 ? Math.round(s.totalWorkMin / s.workDays) : 0; // avg minutes per day
      // Assume 8h (480min) shift standard; score = (avgWorkH/480)*100 capped 100
      const workScore  = Math.min(100, Math.round(avgWorkH / 480 * 100));
      const punctScore = s.lateCount > 0 ? Math.max(0, 100 - s.lateCount * 10) : 100;
      const score      = Math.round(attRate * 0.40 + workScore * 0.35 + punctScore * 0.25);
      const avgWorkHFmt = `${Math.floor(avgWorkH/60)}h ${avgWorkH%60}m`;
      return { emp, s, attRate, workScore, punctScore, score, avgWorkHFmt };
    }).filter(Boolean);
  }

  function buildOpsReport() {
    const dayName = DAYS[new Date(date+"T12:00:00").getDay()];
    const dayEmps = employees.filter(emp => { const v=(schedule[emp.id]||{})[dayName]; return v && v!=="OFF" && v!=="LEAVE" && v!=="PH"; });
    const attMap  = attendance[date]||{};
    const present = dayEmps.filter(e=>(attMap[e.id]?.status||"Present")==="Present").length;
    const absent  = dayEmps.filter(e=>attMap[e.id]?.status==="Absent");
    const late    = dayEmps.filter(e=>attMap[e.id]?.status==="Late");
    const totalClosed = dayEmps.reduce((s,e)=>s+((performance[date]||{})[e.id]?.closed||0),0);
    const dur = durationLabel();

    const ksaOBRes   = resolved(ksaOBBase, ksaOBIn, ksaOBCurr);
    const ksaSomeRes = resolved(ksaSomeBase, ksaSomeIn, ksaSomeCurr);
    const ksaOsloRes = resolved(ksaOsloBase, ksaOsloIn, ksaOsloCurr);
    const gccT2Res   = resolved(gccT2Base, gccT2In, gccT2Curr);
    const gccSomeRes = resolved(gccSomeBase, gccSomeIn, gccSomeCurr);

    const ksaOBNet   = net(ksaOBBase, ksaOBCurr);
    const ksaSomeNet = net(ksaSomeBase, ksaSomeCurr);
    const ksaOsloNet = net(ksaOsloBase, ksaOsloCurr);
    const gccT2Net   = net(gccT2Base, gccT2Curr);
    const gccSomeNet = net(gccSomeBase, gccSomeCurr);

    const ksaCritical = n(ksaOBCurr)>400 || n(ksaOsloCurr)>10;
    const gccStatus   = gccT2Net<=0 ? "🟢 GCC Queue [STABLE & IMPROVING]" : "🟡 GCC Queue [MONITOR]";

    return `Date: ${new Date(date+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
Time of Update: ${opsUpdTime} (Comparative Analysis: ${opsBaseTime} vs ${opsUpdTime})
Subject: Operations Performance, Productivity Analysis & Shift Allocation
Overall Operations Status: ${opsStatus}${opsStatusNote ? ` (${opsStatusNote})` : ""}

${"═".repeat(65)}
1. Productivity & Deep Dive Analysis (${opsBaseTime} - ${opsUpdTime})
${"═".repeat(65)}
${dur ? `Over the past ${dur}, the operations floor experienced the following:` : ""}
${opsNarrative ? `\n${opsNarrative}\n` : ""}
${n(ksaOBBase)>0 ? `• ${ksaOBNet>0?"🔴":"🟢"} KSA Queue - Outbound (Productivity Breakdown):
  Baseline Volume (${opsBaseTime}): ${ksaOBBase} cases
  New Incoming Cases (${opsBaseTime} - ${opsUpdTime}): +${ksaOBIn} cases${n(ksaOBIn)>150?" (Aggressive Inflow)":n(ksaOBIn)>80?" (High Inflow)":""}
  Total Potential Workload: ${n(ksaOBBase)+n(ksaOBIn)} cases
  Current Backlog (${opsUpdTime}): ${ksaOBCurr} cases
  ✅ Actual Cases Resolved/Closed: ${ksaOBRes} Cases
` : ""}${n(gccT2Base)>0 ? `• ${gccT2Net<=0?"🟢":"🟡"} GCC Queue - Tier 2 (Productivity Breakdown):
  Baseline Volume (${opsBaseTime}): ${gccT2Base} cases
  New Incoming Cases (${opsBaseTime} - ${opsUpdTime}): +${gccT2In} cases
  Total Potential Workload: ${n(gccT2Base)+n(gccT2In)} cases
  Current Backlog (${opsUpdTime}): ${gccT2Curr} cases
  ✅ Actual Cases Resolved/Closed: ${gccT2Res} Cases${gccT2Net<0?" (Successfully reducing the net backlog)":""}
` : ""}
📊 Total Cases Closed (All Queues): ${totalClosed > 0 ? totalClosed : ksaOBRes+ksaSomeRes+ksaOsloRes+gccT2Res+gccSomeRes} cases

${"═".repeat(65)}
2. Live Metrics & Queue Status (Net Variance)
${"═".repeat(65)}
${n(ksaOBCurr)+n(ksaSomeCurr)+n(ksaOsloCurr)>0 ? `${ksaCritical?"🔴":"🟡"} KSA Queue [${ksaCritical?"CRITICAL":"MONITOR"}]
${n(ksaOBCurr)>0?`• Outbound: ${ksaOBCurr} (${netStr(ksaOBNet)})`:""}
${n(ksaSomeCurr)>0?`• "Some" Cases: ${ksaSomeCurr} (${netStr(ksaSomeNet)})`:""}
${n(ksaOsloCurr)>0?`• OSLO: ${ksaOsloCurr} (${netStr(ksaOsloNet)})`:""}
` : ""}${n(gccT2Curr)+n(gccSomeCurr)>0 ? `${gccStatus}
${n(gccT2Curr)>0?`• Tier 2: ${gccT2Curr} (${netStr(gccT2Net)})`:""}
${n(gccSomeCurr)>0?`• "Some" Cases: ${gccSomeCurr} (${netStr(gccSomeNet)})`:""}
` : ""}
${"═".repeat(65)}
3. Attendance
${"═".repeat(65)}
Scheduled: ${dayEmps.length} | Present: ${present} | Absent: ${absent.length} | Late: ${late.length}
${absent.length>0?`Absent: ${absent.map(e=>e.name).join(", ")}`:""}
${late.length>0?`Late: ${late.map(e=>`${e.name} (${attMap[e.id]?.lateMin||0}m)`).join(", ")}`:""}

${"═".repeat(65)}
4. Strategic Workforce Allocation (Starting ${opsUpdTime} Shift)
${"═".repeat(65)}
${allocRows.filter(r=>r.team&&r.agents).map(r=>`• ${r.team}:\n${r.agents.split("\n").map(a=>a.trim()).filter(Boolean).map(a=>`  - ${a}`).join("\n")}`).join("\n\n")}
${opsExecNote ? `\nExecutive Note: ${opsExecNote}` : ""}

${"═".repeat(65)}
Generated: ${new Date().toLocaleString()}`;
  }

  function buildMonthlyReport() {
    const [y,m] = month.split("-").map(Number);
    const stats    = getMonthStats(y, m-1);
    const scorecard = getScorecard(stats).sort((a,b)=>b.score-a.score);
    const monthStr  = new Date(y,m-1,1).toLocaleString("default",{month:"long",year:"numeric"});
    const shiftLabel = selectedShifts.length>0
      ? shifts.filter(s=>selectedShifts.includes(s.id)).map(s=>s.label).join(", ")
      : "All Shifts";
    const totalClosed   = Object.values(stats).reduce((s,v)=>s+v.closed,0);
    const totalAbsences = Object.values(stats).reduce((s,v)=>s+v.abs,0);
    const totalLateMin  = Object.values(stats).reduce((s,v)=>s+v.lateMin,0);
    const top3   = scorecard.slice(0,3);
    const bottom = scorecard.filter(s=>s.score<60);

    return `📅 MONTHLY OPERATIONS REPORT — ${monthStr} [${shiftLabel}]
${"=".repeat(60)}

📊 EXECUTIVE SUMMARY
─────────────────────
Total Closed: ${totalClosed}
Total Absences: ${totalAbsences}
Total Late Time: ${totalLateMin} minutes

🏆 TOP PERFORMERS
──────────────────
${top3.map((s,i)=>`${["🥇","🥈","🥉"][i]} ${s.emp.name} — Score: ${s.score} | Att: ${s.attRate}% | Avg Work: ${s.avgWorkHFmt}`).join("\n")}

⚠️ NEEDS ATTENTION
────────────────────
${bottom.length>0 ? bottom.map(s=>`• ${s.emp.name} — Score: ${s.score} | Abs: ${s.s.abs} | Late: ${s.s.lateCount}x`).join("\n") : "All employees performing well"}

📋 FULL ATTENDANCE AUDIT
─────────────────────────
${employees.map(e=>{const s=stats[e.id]; return `${e.name}: WorkDays=${s.workDays} | Abs=${s.abs} | Late=${s.lateCount}x (${s.lateMin}m) | AvgWork=${s.workDays>0?Math.floor(s.totalWorkMin/s.workDays/60)+"h":"—"}`;}).join("\n")}

🎯 BALANCED SCORECARD
──────────────────────
${scorecard.map(s=>`${s.emp.name}: Att=${s.attRate}% | WorkScore=${s.workScore} | Punct=${s.punctScore} | SCORE=${s.score}/100 ${s.score>=80?"🟢":s.score>=60?"🟡":"🔴"}`).join("\n")}

Generated: ${new Date().toLocaleString()}`;
  }

  function getReportText() {
    if (reportType==="ops")     return buildOpsReport();
    if (reportType==="monthly") return buildMonthlyReport();
    return "";
  }

  function copyReport() {
    navigator.clipboard.writeText(getReportText()).then(()=>{
      setCopied(true); setTimeout(()=>setCopied(false),2000);
    });
  }

  const [y,m] = month.split("-").map(Number);
  const mStats    = getMonthStats(y, m-1);
  const scoreData = getScorecard(mStats).sort((a,b)=>b.score-a.score);

  return (
    <div>
      <div style={SBR({ flexWrap:"wrap" })}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>📑 Reports</span>
        <div style={{ display:"flex", gap:6 }}>
          {[["ops","📊 Ops Report"],["monthly","📅 Monthly"],["scorecard","🎯 Scorecard"]].map(([k,l])=>(
            <button key={k} onClick={()=>setReportType(k)}
              style={{ border:`2px solid #2563EB`, borderRadius:20, padding:"5px 14px", fontSize:12, cursor:"pointer", fontWeight:600,
                background:reportType===k?"#2563EB":"transparent", color:reportType===k?"#fff":"#2563EB" }}>{l}</button>
          ))}
        </div>
        {reportType==="ops"     && <input type="date"  value={date}  onChange={e=>setDate(e.target.value)}  style={{ ...I(), width:150 }}/>}
        {(reportType==="monthly"||reportType==="scorecard") && <input type="month" value={month} onChange={e=>setMonth(e.target.value)} style={{ ...I(), width:150 }}/>}
        {reportType!=="scorecard" && (
          <button style={PBT(copied?"#10B981":"#2563EB")} onClick={copyReport}>{copied?"✅ Copied!":"📋 Copy Report"}</button>
        )}
      </div>

      {/* ── OPS REPORT BUILDER ── */}
      {reportType==="ops" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>

          {/* Left: Header + Queue Data */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

            {/* Report Header */}
            <div style={CRD()}>
              <div style={{ fontWeight:700, color:"#0F2744", marginBottom:12, fontSize:14 }}>📋 Report Header</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                <div><label style={LBL}>Baseline Time</label>
                  <input type="time" value={opsBaseTime} onChange={e=>setOpsBaseTime(e.target.value)} style={I()}/></div>
                <div><label style={LBL}>Update Time</label>
                  <input type="time" value={opsUpdTime} onChange={e=>setOpsUpdTime(e.target.value)} style={I()}/></div>
              </div>
              <label style={LBL}>Overall Status</label>
              <select value={opsStatus} onChange={e=>setOpsStatus(e.target.value)} style={{ ...I(), marginBottom:8 }}>
                <option>🔴 CRITICAL BUT HIGHLY ACTIVE</option>
                <option>🔴 CRITICAL</option>
                <option>🟡 WARNING — MONITOR CLOSELY</option>
                <option>🟢 STABLE</option>
                <option>🟢 STABLE & IMPROVING</option>
              </select>
              <label style={LBL}>Status Note (bracket)</label>
              <input value={opsStatusNote} onChange={e=>setOpsStatusNote(e.target.value)} style={{ ...I(), marginBottom:8 }} placeholder="e.g. Managing aggressive inflow..."/>
              <label style={LBL}>Narrative / Context (optional)</label>
              <textarea value={opsNarrative} onChange={e=>setOpsNarrative(e.target.value)} rows={2}
                style={{ ...I(), resize:"vertical" }} placeholder="Over the past X hours, the operations floor..."/>
            </div>

            {/* KSA Queue */}
            <div style={CRD()}>
              <div style={{ fontWeight:700, color:"#2563EB", marginBottom:12, fontSize:14 }}>🇸🇦 KSA Queue Data</div>
              {[
                ["Outbound (OB)", ksaOBBase, setKsaOBBase, ksaOBIn, setKsaOBIn, ksaOBCurr, setKsaOBCurr],
                ['"Some" Cases',  ksaSomeBase, setKsaSomeBase, ksaSomeIn, setKsaSomeIn, ksaSomeCurr, setKsaSomeCurr],
                ["OSLO",          ksaOsloBase, setKsaOsloBase, ksaOsloIn, setKsaOsloIn, ksaOsloCurr, setKsaOsloCurr],
              ].map(([label, base, setBase, inflow, setInflow, curr, setCurr]) => (
                <div key={label} style={{ marginBottom:10 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#475569", marginBottom:4 }}>{label}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto", gap:6, alignItems:"center" }}>
                    <div><label style={{ ...LBL, fontSize:10 }}>Baseline</label>
                      <input type="number" min="0" value={base} onChange={e=>setBase(e.target.value)} style={I()} placeholder="0"/></div>
                    <div><label style={{ ...LBL, fontSize:10 }}>Inflow +</label>
                      <input type="number" min="0" value={inflow} onChange={e=>setInflow(e.target.value)} style={I()} placeholder="0"/></div>
                    <div><label style={{ ...LBL, fontSize:10 }}>Current</label>
                      <input type="number" min="0" value={curr} onChange={e=>setCurr(e.target.value)} style={I()} placeholder="0"/></div>
                    <div style={{ paddingTop:18, fontWeight:800, fontSize:13,
                      color: resolved(base,inflow,curr)>0?"#10B981":"#EF4444" }}>
                      {n(base)||n(inflow)||n(curr) ? `✅ ${resolved(base,inflow,curr)}` : "—"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* GCC Queue */}
            <div style={CRD()}>
              <div style={{ fontWeight:700, color:"#10B981", marginBottom:12, fontSize:14 }}>🌍 GCC Queue Data</div>
              {[
                ["Tier 2",        gccT2Base, setGccT2Base, gccT2In, setGccT2In, gccT2Curr, setGccT2Curr],
                ['"Some" Cases',  gccSomeBase, setGccSomeBase, gccSomeIn, setGccSomeIn, gccSomeCurr, setGccSomeCurr],
              ].map(([label, base, setBase, inflow, setInflow, curr, setCurr]) => (
                <div key={label} style={{ marginBottom:10 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#475569", marginBottom:4 }}>{label}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto", gap:6, alignItems:"center" }}>
                    <div><label style={{ ...LBL, fontSize:10 }}>Baseline</label>
                      <input type="number" min="0" value={base} onChange={e=>setBase(e.target.value)} style={I()} placeholder="0"/></div>
                    <div><label style={{ ...LBL, fontSize:10 }}>Inflow +</label>
                      <input type="number" min="0" value={inflow} onChange={e=>setInflow(e.target.value)} style={I()} placeholder="0"/></div>
                    <div><label style={{ ...LBL, fontSize:10 }}>Current</label>
                      <input type="number" min="0" value={curr} onChange={e=>setCurr(e.target.value)} style={I()} placeholder="0"/></div>
                    <div style={{ paddingTop:18, fontWeight:800, fontSize:13,
                      color: resolved(base,inflow,curr)>0?"#10B981":"#EF4444" }}>
                      {n(base)||n(inflow)||n(curr) ? `✅ ${resolved(base,inflow,curr)}` : "—"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Workforce Allocation + Executive Note */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={CRD()}>
              <div style={{ fontWeight:700, color:"#0F2744", marginBottom:12, fontSize:14 }}>👥 Workforce Allocation</div>
              <div style={{ fontSize:12, color:"#64748B", marginBottom:10 }}>
                أدخل اسم الفريق والموظفين (سطر لكل موظف)
              </div>
              {allocRows.map((row, i) => (
                <div key={i} style={{ marginBottom:12, background:"#F8FAFC", borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                    <input value={row.team} onChange={e=>updateAllocRow(i,"team",e.target.value)}
                      style={{ ...I({ flex:1 })}} placeholder="اسم الفريق / المهمة"/>
                    <button onClick={()=>removeAllocRow(i)}
                      style={{ background:"none", border:"1px solid #FCA5A5", color:"#EF4444",
                        borderRadius:6, padding:"4px 8px", cursor:"pointer", fontSize:12, flexShrink:0 }}>✕</button>
                  </div>
                  <textarea value={row.agents} onChange={e=>updateAllocRow(i,"agents",e.target.value)}
                    rows={3} style={{ ...I(), resize:"vertical", fontSize:12 }}
                    placeholder={"اسم الموظف (+ المهمة)\nاسم الموظف\nاسم الموظف"}/>
                </div>
              ))}
              <button onClick={addAllocRow} style={PBT("#10B981",{width:"100%",padding:"7px",fontSize:12})}>+ Add Team</button>
            </div>

            <div style={CRD()}>
              <div style={{ fontWeight:700, color:"#0F2744", marginBottom:8, fontSize:14 }}>📝 Executive Note</div>
              <textarea value={opsExecNote} onChange={e=>setOpsExecNote(e.target.value)} rows={4}
                style={{ ...I(), resize:"vertical" }}
                placeholder="The primary focus for the shift will be..."/>
            </div>

            {/* Live preview summary */}
            <div style={{ ...CRD(), background:"#0F172A", color:"#E2E8F0" }}>
              <div style={{ fontWeight:700, fontSize:12, color:"#94A3B8", marginBottom:8 }}>📊 Quick Summary</div>
              <div style={{ fontSize:12, lineHeight:1.8 }}>
                {n(ksaOBBase)>0 && <div>🔴 OB: {ksaOBBase} → {ksaOBCurr} | <span style={{color:"#10B981"}}>✅ {resolved(ksaOBBase,ksaOBIn,ksaOBCurr)} resolved</span></div>}
                {n(ksaSomeBase)>0 && <div>🔴 SOME: {ksaSomeBase} → {ksaSomeCurr} | <span style={{color:"#10B981"}}>✅ {resolved(ksaSomeBase,ksaSomeIn,ksaSomeCurr)} resolved</span></div>}
                {n(ksaOsloBase)>0 && <div>🔴 OSLO: {ksaOsloBase} → {ksaOsloCurr} | <span style={{color:"#10B981"}}>✅ {resolved(ksaOsloBase,ksaOsloIn,ksaOsloCurr)} resolved</span></div>}
                {n(gccT2Base)>0 && <div>🟢 GCC T2: {gccT2Base} → {gccT2Curr} | <span style={{color:"#10B981"}}>✅ {resolved(gccT2Base,gccT2In,gccT2Curr)} resolved</span></div>}
                {n(gccSomeBase)>0 && <div>🟢 GCC SOME: {gccSomeBase} → {gccSomeCurr} | <span style={{color:"#10B981"}}>✅ {resolved(gccSomeBase,gccSomeIn,gccSomeCurr)} resolved</span></div>}
                <div style={{marginTop:8, color:"#F59E0B", fontWeight:700}}>
                  Total Resolved: {resolved(ksaOBBase,ksaOBIn,ksaOBCurr)+resolved(ksaSomeBase,ksaSomeIn,ksaSomeCurr)+resolved(ksaOsloBase,ksaOsloIn,ksaOsloCurr)+resolved(gccT2Base,gccT2In,gccT2Curr)+resolved(gccSomeBase,gccSomeIn,gccSomeCurr)} cases
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly shift filter */}
      {(reportType==="monthly"||reportType==="scorecard") && (
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14, alignItems:"center" }}>
          <span style={{ fontSize:12, color:"#64748B", fontWeight:600 }}>Filter by Shift:</span>
          <button onClick={()=>setSelectedShifts([])}
            style={{ border:`2px solid ${selectedShifts.length===0?"#0F2744":"#CBD5E1"}`, borderRadius:20,
              padding:"3px 12px", fontSize:11, cursor:"pointer", fontWeight:600,
              background: selectedShifts.length===0?"#0F2744":"transparent",
              color: selectedShifts.length===0?"#fff":"#64748B" }}>All</button>
          {shifts.map(s=>(
            <button key={s.id} onClick={()=>toggleShift(s.id)}
              style={{ border:`2px solid ${selectedShifts.includes(s.id)?s.color:"#CBD5E1"}`, borderRadius:20,
                padding:"3px 12px", fontSize:11, cursor:"pointer", fontWeight:600,
                background: selectedShifts.includes(s.id)?s.color+"18":"transparent",
                color: selectedShifts.includes(s.id)?s.color:"#64748B" }}>
              {s.label} {s.start}
            </button>
          ))}
        </div>
      )}

      {/* Scorecard Visual Table */}
      {reportType==="scorecard" && (
        <div>
          <div style={{ ...CRD(), overflowX:"auto", marginBottom:16 }}>
            <div style={{ fontWeight:700, color:"#0F2744", marginBottom:4 }}>🎯 Balanced Scorecard</div>
            <div style={{ fontSize:12, color:"#64748B", marginBottom:12 }}>
              Weights: Attendance 40% · Work Hours 35% · Punctuality 25%
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:"#F8FAFC" }}>
                  {["Rank","Employee","Attendance %","Avg Work Hours","Punctuality","Score"].map(h=>(
                    <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontWeight:700, color:"#0F2744", borderBottom:"2px solid #E2E8F0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scoreData.map((s,ri) => {
                  const scoreColor = s.score>=80?"#10B981":s.score>=60?"#F59E0B":"#EF4444";
                  return (
                    <tr key={s.emp.id} style={{ background: ri%2===0?"#fff":"#F8FAFC" }}>
                      <td style={{ padding:"10px 12px", fontSize:16, textAlign:"center" }}>{["🥇","🥈","🥉"][ri]||ri+1}</td>
                      <td style={{ padding:"10px 12px", fontWeight:700 }}>
                        {s.emp.name}
                        <div style={{ fontSize:11, color:"#94A3B8" }}>{s.emp.role}</div>
                      </td>
                      <td style={{ padding:"10px 12px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ background:"#E2E8F0", borderRadius:10, height:8, width:80, overflow:"hidden" }}>
                            <div style={{ width:s.attRate+"%", height:"100%", background:s.attRate>=80?"#10B981":"#F59E0B", borderRadius:10 }}/>
                          </div>
                          <span style={{ fontWeight:600 }}>{s.attRate}%</span>
                        </div>
                        <div style={{ fontSize:11, color:"#94A3B8" }}>Abs: {s.s.abs} · Late: {s.s.lateCount}x</div>
                      </td>
                      <td style={{ padding:"10px 12px" }}>
                        <div style={{ fontWeight:700, color: s.workScore>=80?"#10B981":s.workScore>=60?"#F59E0B":"#EF4444" }}>
                          {s.avgWorkHFmt}
                        </div>
                        <div style={{ fontSize:11, color:"#94A3B8" }}>Score: {s.workScore}</div>
                      </td>
                      <td style={{ padding:"10px 12px" }}>
                        <div style={{ fontWeight:700, color: s.punctScore>=90?"#10B981":s.punctScore>=70?"#F59E0B":"#EF4444" }}>
                          {s.punctScore}/100
                        </div>
                        <div style={{ fontSize:11, color:"#94A3B8" }}>Late {s.s.lateCount}x · {s.s.lateMin}m total</div>
                      </td>
                      <td style={{ padding:"10px 12px" }}>
                        <span style={{ background:scoreColor+"20", color:scoreColor, border:`1.5px solid ${scoreColor}`,
                          borderRadius:20, padding:"4px 14px", fontWeight:800, fontSize:15 }}>{s.score}</span>
                      </td>
                    </tr>
                  );
                })}
                {scoreData.length===0 && (
                  <tr><td colSpan={6} style={{ padding:24, textAlign:"center", color:"#94A3B8" }}>No data for selected period/shifts</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Strategy Guide */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
            {[
              { icon:"📅", title:"Daily Report",    desc:"Staffing, attendance, performance, queue status, heat map, SME notes." },
              { icon:"📆", title:"Weekly Report",   desc:"Trend analysis, attendance summary, top performers, recurring issues." },
              { icon:"📊", title:"Monthly Report",  desc:"Executive summary, full audit, balanced scorecard, top performers." },
              { icon:"🎯", title:"Quarterly Report", desc:"Strategic review, team development, process improvements." }
            ].map(c=>(
              <div key={c.title} style={{ ...CRD(), borderTop:"3px solid #2563EB" }}>
                <div style={{ fontSize:24, marginBottom:6 }}>{c.icon}</div>
                <div style={{ fontWeight:700, color:"#0F2744", marginBottom:6 }}>{c.title}</div>
                <div style={{ fontSize:12, color:"#64748B" }}>{c.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background:"linear-gradient(135deg,#FEF3C7,#FDE68A)", border:"2px solid #F59E0B",
            borderRadius:10, padding:"14px 20px", display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ fontSize:24 }}>✨</span>
            <div>
              <div style={{ fontWeight:800, color:"#92400E", fontSize:14 }}>The Golden Formula</div>
              <div style={{ fontWeight:700, color:"#78350F", fontSize:16 }}>Problem → Action → Result</div>
            </div>
          </div>
        </div>
      )}

      {/* Report Text Preview */}
      {(reportType==="ops"||reportType==="monthly") && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:13, fontWeight:700, color:"#0F2744" }}>📄 Report Preview</span>
            <button style={PBT(copied?"#10B981":"#2563EB",{padding:"6px 16px",fontSize:12})}
              onClick={copyReport}>{copied?"✅ Copied!":"📋 Copy Report"}</button>
          </div>
          <div style={{ fontFamily:"monospace", fontSize:12, whiteSpace:"pre-wrap", lineHeight:1.7,
            maxHeight:500, overflow:"auto", background:"#0F172A", borderRadius:10, padding:20, color:"#E2E8F0" }}>
            {getReportText()}
          </div>
        </div>
      )}
    </div>
  );
}


// ─── TASK ASSIGNMENTS PAGE ────────────────────────────────────────────────────
function TaskAssignmentsPage({ employees, setEmployees, auditLog, setAuditLog, session }) {
  const [search, setSearch] = useState("");
  const [filterTask, setFilterTask] = useState("");
  const [editEmp, setEditEmp] = useState(null);
  const [origTasks, setOrigTasks] = useState([]);

  const filtered = employees.filter(e => {
    const ms = e.name.toLowerCase().includes(search.toLowerCase());
    const mt = !filterTask || (e.tasks||[]).includes(filterTask);
    return ms && mt;
  });

  function openEdit(emp) {
    setEditEmp({...emp, tasks:[...(emp.tasks||[])]});
    setOrigTasks([...(emp.tasks||[])]);
  }

  function saveTaskEdit() {
    // Log the change
    const added   = editEmp.tasks.filter(t => !origTasks.includes(t));
    const removed = origTasks.filter(t => !editEmp.tasks.includes(t));
    if (added.length || removed.length) {
      const entry = {
        id: "al"+Date.now(),
        ts: new Date().toISOString(),
        by: session?.name || "Unknown",
        role: session?.role || "",
        action: "Task Assignment",
        target: editEmp.name,
        detail: [
          added.length   ? `Added: ${added.join(", ")}`   : "",
          removed.length ? `Removed: ${removed.join(", ")}` : "",
        ].filter(Boolean).join(" · "),
      };
      setAuditLog(prev => [entry, ...(prev||[])].slice(0, 500));
    }
    setEmployees(prev => prev.map(e => e.id===editEmp.id ? {...e, tasks:editEmp.tasks} : e));
    setEditEmp(null);
  }

  const taskCounts = {};
  TASK_LIST.forEach(t => { taskCounts[t] = employees.filter(e=>(e.tasks||[]).includes(t)).length; });

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>📋 Task Assignments</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} style={{ ...I(), width:200 }} placeholder="🔍 Search employee..."/>
        <select value={filterTask} onChange={e=>setFilterTask(e.target.value)} style={{ ...I(), width:180 }}>
          <option value="">All Tasks</option>
          {TASK_LIST.map(t=><option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Task summary chips */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
        {TASK_LIST.map(t=>(
          <div key={t} onClick={()=>setFilterTask(filterTask===t?"":t)}
            style={{ background: filterTask===t ? taskColor(t) : taskColor(t)+"18",
              border:`1.5px solid ${taskColor(t)}50`, borderRadius:20, padding:"4px 12px",
              cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all 0.15s" }}>
            <span style={{ fontSize:12, fontWeight:700, color: filterTask===t?"#fff":taskColor(t) }}>{t}</span>
            <span style={{ fontSize:11, fontWeight:800, color: filterTask===t?"rgba(255,255,255,0.8)":taskColor(t),
              background: filterTask===t?"rgba(255,255,255,0.2)":taskColor(t)+"30",
              borderRadius:10, padding:"1px 7px" }}>{taskCounts[t]}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...CRD(), overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#F8FAFC" }}>
              {["#","Employee","Role","Assigned Tasks","Assigned By","Actions"].map(h=>(
                <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontWeight:700, color:"#0F2744", borderBottom:"2px solid #E2E8F0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, ri) => {
              // Find last audit entry for this employee's tasks
              const lastEdit = (auditLog||[]).find(a => a.target===emp.name && a.action==="Task Assignment");
              return (
                <tr key={emp.id} style={{ background: ri%2===0?"#fff":"#F8FAFC" }}>
                  <td style={{ padding:"10px 12px", color:"#94A3B8", fontWeight:600 }}>{ri+1}</td>
                  <td style={{ padding:"10px 12px", fontWeight:700, color:"#1E293B" }}>
                    {emp.name}
                    <div style={{ fontSize:11, color:"#94A3B8" }}>{emp.role}</div>
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    <span style={{ background:ROLE_COLORS[emp.role]||"#64748B", color:"#fff",
                      borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{emp.role}</span>
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    {(emp.tasks||[]).length === 0
                      ? <span style={{ color:"#94A3B8", fontSize:12 }}>No tasks assigned</span>
                      : <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                          {(emp.tasks||[]).map(t=>(
                            <span key={t} style={{ background:taskColor(t), color:"#fff",
                              borderRadius:10, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{t}</span>
                          ))}
                        </div>
                    }
                  </td>
                  <td style={{ padding:"10px 12px", fontSize:12, color:"#64748B" }}>
                    {lastEdit
                      ? <div>
                          <div style={{ fontWeight:600, color:"#1E293B" }}>{lastEdit.by}</div>
                          <div style={{ fontSize:11, color:"#94A3B8" }}>
                            {new Date(lastEdit.ts).toLocaleDateString("en-US",{month:"short",day:"numeric"})} {new Date(lastEdit.ts).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                          </div>
                        </div>
                      : <span style={{ color:"#CBD5E1" }}>—</span>
                    }
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    <button onClick={()=>openEdit(emp)}
                      style={{ ...PBT("#2563EB",{ padding:"5px 12px", fontSize:12 }) }}>✏️ Edit Tasks</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editEmp && (
        <Modal title={`Edit Tasks — ${editEmp.name}`} onClose={()=>setEditEmp(null)} width={560}>
          <div style={{ marginBottom:10, fontSize:12, color:"#64748B" }}>
            Select tasks assigned to <strong>{editEmp.name}</strong>. Changes will be logged with your name.
          </div>
          <TaskPicker selected={editEmp.tasks||[]} onChange={tasks=>setEditEmp(p=>({...p,tasks}))}/>
          <div style={{ marginTop:16, display:"flex", gap:8 }}>
            <button style={PBT("#2563EB",{flex:1,padding:"10px"})} onClick={saveTaskEdit}>💾 Save & Log Changes</button>
            <button style={PBT("#94A3B8",{flex:"none",padding:"10px 16px"})} onClick={()=>setEditEmp(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── AUDIT LOG PAGE ───────────────────────────────────────────────────────────
function AuditLogPage({ auditLog, session }) {
  const [filterUser, setFilterUser]       = useState("");
  const [filterAction, setFilterAction]   = useState("");
  const [filterDate, setFilterDate]       = useState("");
  const [hidePageViews, setHidePageViews] = useState(true);
  const [showHistoryFor, setShowHistoryFor] = useState(null); // action type to drill into

  const canViewHistory = session?.role === "Team Lead" ||
                         session?.role === "Shift Leader" ||
                         session?.name === "Mohammed Nasser Althurwi";

  const logs    = Array.isArray(auditLog) ? auditLog : [];
  const users   = [...new Set(logs.map(l=>l.by))].filter(Boolean).sort();
  const actions = [...new Set(logs.map(l=>l.action))].filter(Boolean).sort();

  const filtered = logs.filter(l => {
    const mu = !filterUser   || l.by === filterUser;
    const ma = !filterAction || l.action === filterAction;
    const md = !filterDate   || l.ts?.startsWith(filterDate);
    const mp = !hidePageViews || l.action !== "Page View";
    return mu && ma && md && mp;
  });

  // Group edits by target+action for history view
  const editHistory = logs.filter(l =>
    l.action !== "Page View" && l.action !== "Sign In" && l.action !== "Sign Out"
  );

  // Summary: count edits per user
  const userEditCounts = {};
  editHistory.forEach(l => { userEditCounts[l.by] = (userEditCounts[l.by]||0)+1; });

  function actionColor(action) {
    if (!action) return "#64748B";
    if (action==="Sign In")    return "#10B981";
    if (action==="Sign Out")   return "#EF4444";
    if (action==="Page View")  return "#CBD5E1";
    if (action==="Task Assignment") return "#8B5CF6";
    if (action.includes("Schedule"))  return "#2563EB";
    if (action.includes("Attendance")) return "#0EA5E9";
    if (action.includes("Performance")) return "#F59E0B";
    if (action.includes("Queue"))      return "#6366F1";
    if (action.includes("Shift"))      return "#EC4899";
    if (action.includes("Employee")||action.includes("Roster")) return "#14B8A6";
    if (action.includes("Heat"))       return "#EF4444";
    if (action.includes("Add"))        return "#10B981";
    if (action.includes("Edit")||action.includes("Update")) return "#2563EB";
    if (action.includes("Delete"))     return "#EF4444";
    return "#64748B";
  }

  // ── Last Activity per User ───────────────────────────────────────────────────
  // For each user, find their most recent log entry (ignoring Page View)
  const lastActivity = useMemo(() => {
    const map = {};
    logs.forEach(l => {
      if (!l.by) return;
      if (!map[l.by] || l.ts > map[l.by].ts) map[l.by] = l;
    });
    return Object.values(map).sort((a,b) => b.ts.localeCompare(a.ts));
  }, [logs]);

  // ── "Recent" = active within last 60 min ────────────────────────────────────
  function minsAgo(ts) {
    return Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  }
  function timeAgoLabel(ts) {
    const m = minsAgo(ts);
    if (m < 1)  return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m/60);
    if (h < 24) return `${h}h ago`;
    return new Date(ts).toLocaleDateString("en-US",{month:"short",day:"numeric"});
  }
  function statusDot(ts) {
    const m = minsAgo(ts);
    if (m < 15)  return { color:"#10B981", label:"Active"  };
    if (m < 60)  return { color:"#F59E0B", label:"Recent"  };
    return           { color:"#CBD5E1", label:"Inactive" };
  }

  // Last page visited per user (from Page View entries)
  const lastPage = useMemo(() => {
    const map = {};
    logs.filter(l=>l.action==="Page View").forEach(l=>{
      if (!map[l.by] || l.ts > map[l.by].ts) map[l.by] = l;
    });
    return map;
  }, [logs]);

  const canSeeLiveView = session?.role !== "Agent";
  const [activityFilter, setActivityFilter] = useState("All");

  return (
    <div>

      {/* ── Data History & Edit Tracking (Team Lead / Shift Leader / Mohammed Nasser Althurwi only) ── */}
      {canViewHistory && (
        <div style={{ ...CRD(), marginBottom:20, border:"2px solid #6366F130" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
            <span style={{ fontSize:16 }}>🔒</span>
            <span style={{ fontWeight:800, fontSize:14, color:"#0F2744" }}>Data Edit History</span>
            <span style={{ fontSize:12, color:"#64748B" }}>— جميع التعديلات على البيانات مسجّلة · لا يمكن حذفها</span>
          </div>

          {/* Edit counts per user */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:8, marginBottom:14 }}>
            {Object.entries(userEditCounts).sort((a,b)=>b[1]-a[1]).map(([user, count]) => {
              const lastEntry = editHistory.filter(l=>l.by===user).sort((a,b)=>b.ts.localeCompare(a.ts))[0];
              const roleColor2 = ROLE_COLORS[lastEntry?.role]||"#64748B";
              return (
                <div key={user} style={{ background:"#F8FAFC", borderRadius:8, padding:"10px 12px",
                  border:`1.5px solid ${roleColor2}30`, cursor:"pointer" }}
                  onClick={()=>{ setFilterUser(user); setShowHistoryFor(user); }}>
                  <div style={{ fontWeight:700, fontSize:13, color:"#0F2744" }}>{user}</div>
                  <div style={{ fontSize:11, color:roleColor2, fontWeight:600, marginTop:2 }}>
                    {ROLE_ICONS[lastEntry?.role]||"👤"} {lastEntry?.role}
                  </div>
                  <div style={{ fontSize:12, color:"#6366F1", fontWeight:700, marginTop:4 }}>
                    {count} edit{count!==1?"s":""}
                  </div>
                  {lastEntry && (
                    <div style={{ fontSize:10, color:"#94A3B8", marginTop:2 }}>
                      Last: {new Date(lastEntry.ts).toLocaleDateString("en-US",{month:"short",day:"numeric"})} {new Date(lastEntry.ts).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                    </div>
                  )}
                </div>
              );
            })}
            {Object.keys(userEditCounts).length === 0 && (
              <div style={{ color:"#94A3B8", fontSize:13, padding:8 }}>لا توجد تعديلات مسجّلة بعد.</div>
            )}
          </div>

          {/* Detailed edit log for selected user */}
          {showHistoryFor && (
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <span style={{ fontWeight:700, fontSize:13, color:"#6366F1" }}>
                  📋 تعديلات {showHistoryFor}
                </span>
                <button onClick={()=>{ setShowHistoryFor(null); setFilterUser(""); }}
                  style={{ background:"none", border:"1px solid #CBD5E1", borderRadius:6,
                    padding:"2px 8px", fontSize:12, cursor:"pointer", color:"#64748B" }}>✕ إغلاق</button>
              </div>
              <div style={{ maxHeight:260, overflowY:"auto" }}>
                {editHistory.filter(l=>l.by===showHistoryFor).map((log,i) => (
                  <div key={log.id||i} style={{ display:"flex", gap:12, padding:"8px 0",
                    borderBottom:"1px solid #F1F5F9", alignItems:"flex-start" }}>
                    <div style={{ fontSize:10, color:"#94A3B8", whiteSpace:"nowrap", paddingTop:2, minWidth:110 }}>
                      {new Date(log.ts).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                      {" "}{new Date(log.ts).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                    </div>
                    <div style={{ flex:1 }}>
                      <span style={{ background:"#6366F118", color:"#6366F1", border:"1px solid #6366F130",
                        borderRadius:4, padding:"1px 6px", fontSize:11, fontWeight:600, marginRight:6 }}>
                        {log.action}
                      </span>
                      {log.target && <span style={{ fontSize:12, color:"#1E293B", fontWeight:600 }}>{log.target}</span>}
                      {log.detail && <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>{log.detail}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Live Activity Panel (Team Lead / Shift Leader / SME only) ── */}
      {canSeeLiveView && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontWeight:700, fontSize:14, color:"#0F2744", marginBottom:10, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            👥 User Activity Overview
            <span style={{ fontSize:11, fontWeight:400, color:"#94A3B8" }}>— based on last recorded action per user</span>
            <select value={activityFilter} onChange={e=>setActivityFilter(e.target.value)}
              style={{ ...I({ width:140, marginBottom:0 }) }}>
              <option value="All">All Users</option>
              <option value="Online">🟢 Online (≤15m)</option>
              <option value="Offline">⚫ Offline (&gt;15m)</option>
            </select>
          </div>
          {lastActivity.length === 0 ? (
            <div style={{ ...CRD({ padding:"20px", textAlign:"center" }), color:"#94A3B8", fontSize:13 }}>
              No activity recorded yet. Data will populate as users sign in and make changes.
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:10 }}>
              {lastActivity
                .filter(l => {
                  if (activityFilter==="All") return true;
                  const m = minsAgo(l.ts);
                  if (activityFilter==="Online") return m<=15;
                  return m>15;
                }).map(l => {
                const dot = statusDot(l.ts);
                const pg  = lastPage[l.by];
                return (
                  <div key={l.by} style={{ ...CRD({ padding:"14px 16px" }),
                    borderLeft:`4px solid ${dot.color}`, position:"relative" }}>
                    {/* Status dot */}
                    <div style={{ position:"absolute", top:12, right:12, display:"flex", alignItems:"center", gap:4 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:dot.color,
                        boxShadow: dot.color==="10B981" ? `0 0 0 3px ${dot.color}30` : "none" }}/>
                      <span style={{ fontSize:10, color:dot.color, fontWeight:700 }}>{dot.label}</span>
                    </div>
                    {/* Name + role */}
                    <div style={{ fontWeight:800, fontSize:14, color:"#0F2744", marginBottom:2, paddingRight:60 }}>{l.by}</div>
                    <div style={{ fontSize:11, color: ROLE_COLORS[l.role]||"#64748B", fontWeight:600, marginBottom:8 }}>
                      {ROLE_ICONS[l.role]||"👤"} {l.role}
                    </div>
                    {/* Last action */}
                    <div style={{ fontSize:12, color:"#475569", marginBottom:4 }}>
                      <span style={{ background:actionColor(l.action)+"18", color:actionColor(l.action),
                        border:`1px solid ${actionColor(l.action)}30`, borderRadius:4,
                        padding:"1px 6px", fontSize:11, fontWeight:600, marginRight:4 }}>{l.action}</span>
                    </div>
                    {/* Current/last page */}
                    {pg && (
                      <div style={{ fontSize:11, color:"#64748B", marginBottom:4 }}>
                        📄 Last page: <strong style={{color:"#2563EB"}}>{pg.target}</strong>
                      </div>
                    )}
                    {/* Time */}
                    <div style={{ fontSize:11, color:"#94A3B8", marginTop:4, display:"flex", alignItems:"center", gap:4 }}>
                      🕐 {timeAgoLabel(l.ts)}
                      <span style={{ color:"#E2E8F0" }}>·</span>
                      <span>{new Date(l.ts).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Filters ── */}
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>🔍 Audit Log & History</span>
        <select value={filterUser} onChange={e=>setFilterUser(e.target.value)} style={{ ...I(), width:180 }}>
          <option value="">All Users</option>
          {users.map(u=><option key={u}>{u}</option>)}
        </select>
        <select value={filterAction} onChange={e=>setFilterAction(e.target.value)} style={{ ...I(), width:180 }}>
          <option value="">All Actions</option>
          {actions.map(a=><option key={a}>{a}</option>)}
        </select>
        <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={{ ...I(), width:150 }}/>
        {(filterUser||filterAction||filterDate) && (
          <button onClick={()=>{setFilterUser("");setFilterAction("");setFilterDate("");}}
            style={PBT("#94A3B8",{padding:"6px 12px",fontSize:12})}>✕ Clear</button>
        )}
        <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#64748B", cursor:"pointer" }}>
          <input type="checkbox" checked={hidePageViews} onChange={e=>setHidePageViews(e.target.checked)}/>
          Hide Page Views
        </label>
        <span style={{ fontSize:12, color:"#94A3B8", marginLeft:"auto" }}>{filtered.length} records</span>
      </div>

      {/* ── Log Timeline ── */}
      {filtered.length === 0 ? (
        <div style={{ ...CRD(), textAlign:"center", padding:"48px 20px", color:"#94A3B8" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>📭</div>
          <div style={{ fontWeight:600, fontSize:14 }}>No records match your filters</div>
          <div style={{ fontSize:12, marginTop:6 }}>Activity appears here as users make changes</div>
        </div>
      ) : (
        <div style={CRD()}>
          {filtered.map((log, i) => {
            const dt = new Date(log.ts);
            return (
              <div key={log.id||i} style={{ display:"flex", gap:14, padding:"10px 0",
                borderBottom: i<filtered.length-1?"1px solid #F8FAFC":"none", alignItems:"flex-start" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, flexShrink:0, paddingTop:4 }}>
                  <div style={{ width:9, height:9, borderRadius:"50%", background:actionColor(log.action) }}/>
                  {i<filtered.length-1 && <div style={{ width:2, flex:1, minHeight:16, background:"#F1F5F9" }}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:2 }}>
                    <span style={{ background:actionColor(log.action)+"18", color:actionColor(log.action),
                      border:`1px solid ${actionColor(log.action)}40`, borderRadius:6,
                      padding:"2px 8px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>{log.action}</span>
                    <span style={{ fontWeight:700, fontSize:13, color:"#1E293B" }}>{log.by}</span>
                    <span style={{ fontSize:11, color: ROLE_COLORS[log.role]||"#94A3B8", fontWeight:600 }}>{ROLE_ICONS[log.role]||""} {log.role}</span>
                    <span style={{ marginLeft:"auto", fontSize:11, color:"#94A3B8", whiteSpace:"nowrap" }}>
                      {dt.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})} · {dt.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
                    </span>
                  </div>
                  {log.target && log.action!=="Page View" && (
                    <div style={{ fontSize:12, color:"#475569" }}>👤 <strong>{log.target}</strong></div>
                  )}
                  {log.detail && <div style={{ fontSize:12, color:"#94A3B8", marginTop:1 }}>{log.detail}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ─── LOAD SHEETJS AT TOP LEVEL ────────────────────────────────────────────────
if (typeof window !== "undefined" && !window.XLSX) {
  const _s = document.createElement("script");
  _s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
  _s.async = true;
  document.head.appendChild(_s);
}

// Helper: wait for XLSX to be ready (max 5 seconds)
function waitForXLSX() {
  return new Promise((resolve, reject) => {
    if (window.XLSX) { resolve(window.XLSX); return; }
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (window.XLSX) { clearInterval(t); resolve(window.XLSX); }
      else if (tries > 50) { clearInterval(t); reject(new Error("SheetJS failed to load. Please refresh and try again.")); }
    }, 100);
  });
}

// ═══════════════════════════════════════════════════════════
// SUPABASE INTEGRATION
// ═══════════════════════════════════════════════════════════
const SUPABASE_URL = "https://ohbgpdsuaointhidnmps.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oYmdwZHN1YW9pbnRoaWRubXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzI3MjMsImV4cCI6MjA4OTQ0ODcyM30.pEIUTSpOnMIFCJLWT07nk-8nDVZmepw6vaDEkzKQ-I0";

// Light Supabase client — no npm needed
const sb = {
  async from(table) {
    const base = `${SUPABASE_URL}/rest/v1/${table}`;
    const headers = {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
    };
    return {
      async select(cols="*", filter="") {
        const url = `${base}?select=${cols}${filter?"&"+filter:""}`;
        const r = await fetch(url, { headers });
        return r.ok ? await r.json() : [];
      },
      async upsert(data) {
        const r = await fetch(base, {
          method: "POST",
          headers: { ...headers, "Prefer": "resolution=merge-duplicates,return=representation" },
          body: JSON.stringify(Array.isArray(data) ? data : [data]),
        });
        return r.ok ? await r.json() : null;
      },
      async delete(filter) {
        const url = `${base}?${filter}`;
        const r = await fetch(url, { method: "DELETE", headers });
        return r.ok;
      },
      async insert(data) {
        const r = await fetch(base, {
          method: "POST",
          headers,
          body: JSON.stringify(Array.isArray(data) ? data : [data]),
        });
        return r.ok ? await r.json() : null;
      },
    };
  }
};

// ─── SUPABASE DATA HOOK ───────────────────────────────────────────────────────
// Loads from Supabase on mount, falls back to localStorage while offline
function useSupabaseState(key, defaultVal, loader, saver) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem("csops_" + key);
      return raw ? JSON.parse(raw) : (typeof defaultVal==="function" ? defaultVal() : defaultVal);
    } catch { return typeof defaultVal==="function" ? defaultVal() : defaultVal; }
  });
  const [loaded, setLoaded] = useState(false);

  // Load from Supabase once on mount
  useCallback(() => {
    if (loaded) return;
    loader().then(data => {
      if (data !== null && data !== undefined) {
        setState(data);
        try { localStorage.setItem("csops_" + key, JSON.stringify(data)); } catch {}
      }
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, [])(); // IIFE pattern — runs once

  const set = useCallback((val) => {
    setState(prev => {
      const next = typeof val==="function" ? val(prev) : val;
      // Save locally immediately
      try { localStorage.setItem("csops_" + key, JSON.stringify(next)); } catch {}
      // Save to Supabase async (fire and forget)
      saver(next).catch(()=>{});
      return next;
    });
  }, [key]);

  return [state, set];
}

// ─── PASSWORD SYSTEM (Supabase-backed) ───────────────────────────────────────
const RESET_ADMINS = ["Team Lead", "Shift Leader", "Mohammed Nasser Althurwi"];
function canResetPasswords(role, name) {
  return RESET_ADMINS.includes(role) || RESET_ADMINS.includes(name);
}

// Local cache for passwords (also stored in Supabase user_passwords table)
function getPwStore() {
  try { return JSON.parse(localStorage.getItem("csops_passwords")||"{}"); } catch { return {}; }
}
function setPwStore(obj) {
  try { localStorage.setItem("csops_passwords", JSON.stringify(obj)); } catch {}
}
function getUserPw(name) { return getPwStore()[name] || null; }
async function setUserPw(name, pw) {
  const s = getPwStore(); s[name] = pw; setPwStore(s);
  try {
    const t = await sb.from("user_passwords");
    await t.upsert({ name, password: pw, updated_at: new Date().toISOString() });
  } catch {}
}
async function resetUserPw(name) {
  const s = getPwStore(); delete s[name]; setPwStore(s);
  try {
    const t = await sb.from("user_passwords");
    await t.delete(`name=eq.${encodeURIComponent(name)}`);
  } catch {}
}
// Load passwords from Supabase on startup
(async function loadPasswords() {
  try {
    const t = await sb.from("user_passwords");
    const rows = await t.select();
    if (Array.isArray(rows) && rows.length > 0) {
      const obj = {};
      rows.forEach(r => { obj[r.name] = r.password; });
      setPwStore(obj);
    }
  } catch {}
})();

// ─── ROLE CONFIG ──────────────────────────────────────────────────────────────
const ROLE_CAN_EDIT = {
  "Team Lead":    true,
  "Shift Leader": true,
  "SME":          true,
  "Agent":        false,
};
const ROLE_COLORS = {
  "Team Lead":    "#2563EB",
  "Shift Leader": "#8B5CF6",
  "SME":          "#10B981",
  "Agent":        "#64748B",
};
const ROLE_ICONS = { "Team Lead":"👑", "Shift Leader":"🛡️", "SME":"🧠", "Agent":"👤" };
const ROLE_DESC  = {
  "Team Lead":    "Full access · Can edit everything",
  "Shift Leader": "Full access · Can edit everything",
  "SME":          "Full access · Can edit everything",
  "Agent":        "View only · Cannot make changes",
};

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, employees }) {
  const [selectedRole, setSelectedRole] = useState("Team Lead");
  const [selectedName, setSelectedName] = useState("");
  const [password, setPassword]         = useState("");
  const [newPw1, setNewPw1]             = useState("");
  const [newPw2, setNewPw2]             = useState("");
  const [error, setError]               = useState("");
  const [showPw, setShowPw]             = useState(false);
  const [step, setStep]                 = useState("login");

  const isAgent       = selectedRole === "Agent";
  const roleColor     = ROLE_COLORS[selectedRole];
  const roleEmployees = employees.filter(e => e.role === selectedRole);

  function handleNameChange(name) {
    setSelectedName(name);
    setError("");
    setPassword("");
    if (name && !isAgent) {
      setStep(getUserPw(name) ? "login" : "setup");
    } else {
      setStep("login");
    }
  }

  function tryLogin() {
    // Agent: select name → sign in directly, no password
    if (isAgent) {
      if (!selectedName) { setError("Please select your name."); return; }
      onLogin({ role: "Agent", name: selectedName });
      return;
    }
    if (!selectedName) { setError("Please select your name."); return; }
    const existing = getUserPw(selectedName);
    if (!existing) { setStep("setup"); return; }
    if (!password) { setError("Please enter your password."); return; }
    if (password !== existing) {
      setError("Incorrect password. Please try again.");
      setPassword(""); return;
    }
    setError("");
    onLogin({ role: selectedRole, name: selectedName });
  }

  function setupPassword() {
    if (!newPw1 || newPw1.length < 4) { setError("Password must be at least 4 characters."); return; }
    if (newPw1 !== newPw2) { setError("Passwords do not match."); return; }
    setUserPw(selectedName, newPw1);
    setError("");
    onLogin({ role: selectedRole, name: selectedName });
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0F2744 0%,#1E3A5F 50%,#0F2744 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'IBM Plex Sans','Segoe UI',sans-serif", padding:16 }}>
      <div style={{ width:"100%", maxWidth:460, background:"#fff", borderRadius:16,
        overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.4)" }}>

        {/* Header */}
        <div style={{ background:"#0F2744", padding:"28px 32px 24px", textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🎯</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:22 }}>CS Operations</div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginTop:4 }}>Management System</div>
          <div style={{ marginTop:10, display:"inline-flex", background:"#10B981", borderRadius:20, padding:"3px 12px" }}>
            <span style={{ fontSize:10, color:"#fff", fontWeight:700 }}>💾 Auto-saved · Secure Login</span>
          </div>
        </div>

        <div style={{ padding:"24px 32px 28px" }}>
          {/* Role picker */}
          <label style={LBL}>Select Your Role</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
            {Object.keys(ROLE_CAN_EDIT).map(role => (
              <button key={role} onClick={()=>{ setSelectedRole(role); setSelectedName(""); setError(""); setPassword(""); setStep("login"); }}
                style={{ border:`2px solid ${selectedRole===role ? ROLE_COLORS[role] : "#E2E8F0"}`,
                  borderRadius:10, padding:"10px", cursor:"pointer", textAlign:"left", transition:"all 0.15s",
                  background: selectedRole===role ? ROLE_COLORS[role]+"12" : "#fff",
                  display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>{ROLE_ICONS[role]}</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color: selectedRole===role ? ROLE_COLORS[role] : "#1E293B" }}>{role}</div>
                  <div style={{ fontSize:10, color:"#94A3B8" }}>
                    {role==="Agent" ? "الاسم فقط · قراءة فقط" : "Personal password"}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Name selector — ALL roles including Agent */}
          <div style={{ marginBottom:14 }}>
            <label style={LBL}>
              {isAgent ? "👤 اختر اسمك" : "Your Name"}
            </label>
            {roleEmployees.length > 0 ? (
              <select value={selectedName} onChange={e=>handleNameChange(e.target.value)}
                style={{ ...I({ border: error&&!selectedName?"2px solid #EF4444":"1px solid #CBD5E1",
                  fontSize:14, padding:"10px 12px" }) }}>
                <option value="">— {isAgent ? "اختر اسمك من القائمة" : "Select your name"} —</option>
                {roleEmployees.map(e=><option key={e.id} value={e.name}>{e.name}</option>)}
              </select>
            ) : (
              <input value={selectedName} onChange={e=>handleNameChange(e.target.value)}
                style={{ ...I({ border: error&&!selectedName?"2px solid #EF4444":"1px solid #CBD5E1" }) }}
                placeholder="Type your name..."/>
            )}
          </div>

          {/* Agent info box */}
          {isAgent && selectedName && (
            <div style={{ background:"#F0FDF4", border:"1px solid #86EFAC", borderRadius:8,
              padding:"10px 14px", marginBottom:14, fontSize:12, color:"#166534" }}>
              👤 <strong>{selectedName}</strong> — صلاحية قراءة فقط، لا يلزم رقم سري.
            </div>
          )}
          {isAgent && !selectedName && (
            <div style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:8,
              padding:"10px 14px", marginBottom:14, fontSize:12, color:"#475569", textAlign:"center" }}>
              👁️ اختر اسمك للدخول — عرض البيانات فقط بدون تعديل
            </div>
          )}

          {/* Password — first time setup */}
          {!isAgent && selectedName && step==="setup" && (
            <div style={{ background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:8, padding:"14px", marginBottom:14 }}>
              <div style={{ fontWeight:700, color:"#1D4ED8", fontSize:13, marginBottom:10 }}>🔐 Set Your Personal Password</div>
              <div style={{ fontSize:12, color:"#3B82F6", marginBottom:12 }}>
                First time login — please create a personal password for <strong>{selectedName}</strong>.
              </div>
              <label style={LBL}>New Password (min. 4 characters)</label>
              <div style={{ position:"relative", marginBottom:10 }}>
                <input type={showPw?"text":"password"} value={newPw1}
                  onChange={e=>{setNewPw1(e.target.value);setError("");}}
                  onKeyDown={e=>e.key==="Enter"&&setupPassword()}
                  style={{ ...I({ paddingRight:42, border: error?"2px solid #EF4444":"1px solid #CBD5E1" })}}
                  placeholder="Enter new password..." autoFocus/>
                <button onClick={()=>setShowPw(p=>!p)}
                  style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", cursor:"pointer", fontSize:15, color:"#94A3B8" }}>
                  {showPw?"🙈":"👁️"}
                </button>
              </div>
              <label style={LBL}>Confirm Password</label>
              <input type={showPw?"text":"password"} value={newPw2}
                onChange={e=>{setNewPw2(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&setupPassword()}
                style={{ ...I({ marginBottom:10, border: error?"2px solid #EF4444":"1px solid #CBD5E1" })}}
                placeholder="Repeat password..."/>
              {error && <div style={{ color:"#EF4444", fontSize:12, marginBottom:8, fontWeight:600 }}>⚠️ {error}</div>}
              <button onClick={setupPassword}
                style={PBT("#2563EB",{ width:"100%", padding:"10px", fontSize:13, borderRadius:8 })}>
                🔐 Set Password & Sign In
              </button>
            </div>
          )}

          {/* Password — existing user login */}
          {!isAgent && selectedName && step==="login" && (
            <div style={{ marginBottom:16 }}>
              <label style={LBL}>Password</label>
              <div style={{ position:"relative" }}>
                <input type={showPw?"text":"password"} value={password}
                  onChange={e=>{setPassword(e.target.value);setError("");}}
                  onKeyDown={e=>e.key==="Enter"&&tryLogin()}
                  style={{ ...I({ paddingRight:42, border: error?"2px solid #EF4444":"1px solid #CBD5E1" })}}
                  placeholder="Your personal password..." autoFocus/>
                <button onClick={()=>setShowPw(p=>!p)}
                  style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", cursor:"pointer", fontSize:15, color:"#94A3B8" }}>
                  {showPw?"🙈":"👁️"}
                </button>
              </div>
              {error && <div style={{ color:"#EF4444", fontSize:12, marginTop:6, fontWeight:600 }}>⚠️ {error}</div>}
            </div>
          )}

          {error && !selectedName && (
            <div style={{ color:"#EF4444", fontSize:12, marginBottom:8, fontWeight:600 }}>⚠️ {error}</div>
          )}

          {/* Sign In button — shown when name is selected */}
          {selectedName && (isAgent || step==="login") && (
            <button onClick={tryLogin}
              style={{ ...PBT(roleColor, { width:"100%", padding:"12px", fontSize:14, borderRadius:10 }) }}>
              {ROLE_ICONS[selectedRole]} {isAgent ? `دخول كـ ${selectedName.split(" ")[0]}` : `Sign In as ${selectedName.split(" ")[0]}`}
            </button>
          )}

          <div style={{ marginTop:12, textAlign:"center", fontSize:11, color:"#94A3B8" }}>
            Data is saved locally on this device · Never leaves your browser
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PASSWORD RESET MODAL (inside app, for admins) ───────────────────────────
function PasswordResetModal({ employees, session, onClose }) {
  const [search, setSearch]       = useState("");
  const [newPw, setNewPw]         = useState("");
  const [targetName, setTargetName] = useState("");
  const [done, setDone]           = useState("");

  const nonAgents = employees.filter(e => e.role !== "Agent" &&
    e.name.toLowerCase().includes(search.toLowerCase()));

  function doReset(name) {
    if (!newPw || newPw.length < 4) { alert("Enter at least 4 characters."); return; }
    setUserPw(name, newPw);
    setDone(`✅ Password reset for ${name}`);
    setNewPw(""); setTargetName("");
  }

  return (
    <Modal title="🔑 Reset User Password" onClose={onClose} width={520}>
      <div style={{ fontSize:12, color:"#64748B", marginBottom:14 }}>
        You can reset passwords for Team Lead, Shift Leader, and SME accounts.
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)}
        style={{ ...I(), marginBottom:12 }} placeholder="🔍 Search name..."/>
      {done && <div style={{ background:"#F0FDF4", border:"1px solid #86EFAC", borderRadius:6, padding:"8px 12px", marginBottom:12, fontSize:13, color:"#166534", fontWeight:600 }}>{done}</div>}
      <div style={{ maxHeight:280, overflowY:"auto" }}>
        {nonAgents.map(emp => (
          <div key={emp.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0",
            borderBottom:"1px solid #F1F5F9" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:13 }}>{emp.name}</div>
              <div style={{ fontSize:11, color: ROLE_COLORS[emp.role]||"#64748B" }}>
                {ROLE_ICONS[emp.role]||"👤"} {emp.role}
              </div>
              <div style={{ fontSize:11, color:"#94A3B8", marginTop:1 }}>
                {getUserPw(emp.name) ? "Has password set" : "⚠️ No password yet"}
              </div>
            </div>
            {targetName === emp.name ? (
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <input value={newPw} onChange={e=>setNewPw(e.target.value)}
                  style={{ ...I({ width:130 })}} placeholder="New password..."
                  onKeyDown={e=>e.key==="Enter"&&doReset(emp.name)} autoFocus/>
                <button onClick={()=>doReset(emp.name)}
                  style={PBT("#10B981",{ padding:"6px 10px", fontSize:12 })}>Set</button>
                <button onClick={()=>{setTargetName("");setNewPw("");}}
                  style={PBT("#94A3B8",{ padding:"6px 10px", fontSize:12 })}>✕</button>
              </div>
            ) : (
              <button onClick={()=>{setTargetName(emp.name); setNewPw(""); setDone("");}}
                style={PBT("#F59E0B",{ padding:"6px 12px", fontSize:12 })}>Reset</button>
            )}
          </div>
        ))}
        {nonAgents.length === 0 && <div style={{ color:"#94A3B8", textAlign:"center", padding:16 }}>No results</div>}
      </div>
    </Modal>
  );
}

function ReadOnlyBanner({ userName }) {
  return (
    <div style={{ background:"#FEF9C3", border:"1.5px solid #F59E0B", borderRadius:8,
      padding:"10px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
      <span style={{ fontSize:18 }}>👁️</span>
      <div style={{ fontSize:13, color:"#78350F" }}>
        <strong>View Only Mode</strong> — Logged in as <strong>{userName||"Agent"}</strong>. You can browse all data but cannot make changes.
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(() => {
    try { return localStorage.getItem("csops_lastPage") || "Schedule"; } catch { return "Schedule"; }
  });
  const [showResetPw, setShowResetPw] = useState(false);
  const [loading, setLoading]         = useState(true);

  // ── Session (localStorage only — per device) ──────────────────────────────
  const [session, _setSession] = useState(() => {
    try { const r = localStorage.getItem("csops_session"); return r ? JSON.parse(r) : null; }
    catch { return null; }
  });
  function setSession(val) {
    _setSession(val);
    try { localStorage.setItem("csops_session", val ? JSON.stringify(val) : "null"); } catch {}
  }

  // ── Supabase-backed state ─────────────────────────────────────────────────
  const [employees,   setEmployeesRaw]   = useState([]);
  const [shifts,      setShiftsRaw]      = useState([]);
  const [scheduleMap, setScheduleRaw]    = useState({});
  const [attendance,  setAttendanceRaw]  = useState({});
  const [performance, setPerformanceRaw] = useState({});
  const [heatmap,     setHeatmapRaw]     = useState({});
  const [queueLog,    setQueueLogRaw]    = useState({});
  const [breakSchedule, setBreakScheduleRaw] = useState({});
  const [auditLog,    setAuditLogRaw]    = useState([]);
  const [notes,       setNotesRaw]       = useState([]);

  // ── Load ALL data from Supabase on mount ──────────────────────────────────
  useState(() => {
    (async () => {
      try {
        // Load employees
        const empT = await sb.from("employees");
        const empRows = await empT.select();
        if (empRows?.length) {
          const emps = empRows.map(r => ({ id:r.id, name:r.name, role:r.role, tasks:r.tasks||[] }));
          setEmployeesRaw(emps);
          localStorage.setItem("csops_employees", JSON.stringify(emps));
        } else {
          // First time — seed with defaults
          const empT2 = await sb.from("employees");
          await empT2.upsert(DEFAULT_EMPLOYEES.map(e=>({id:e.id,name:e.name,role:e.role,tasks:e.tasks})));
          setEmployeesRaw(DEFAULT_EMPLOYEES);
        }

        // Load shifts
        const shT = await sb.from("shifts");
        const shRows = await shT.select();
        if (shRows?.length) {
          const shs = shRows.map(r=>({id:r.id,label:r.label,start:r.start_time,end:r.end_time,color:r.color}));
          setShiftsRaw(shs);
        } else {
          const shT2 = await sb.from("shifts");
          await shT2.upsert(DEFAULT_SHIFTS.map(s=>({id:s.id,label:s.label,start_time:s.start,end_time:s.end,color:s.color})));
          setShiftsRaw(DEFAULT_SHIFTS);
        }

        // Load schedule
        const scT = await sb.from("schedule");
        const scRows = await scT.select();
        if (scRows?.length) {
          const sc = {};
          scRows.forEach(r=>{ sc[r.emp_id]=r.days||{}; });
          setScheduleRaw(sc);
        } else {
          const def = buildDefaultSchedule(DEFAULT_EMPLOYEES);
          const scT2 = await sb.from("schedule");
          await scT2.upsert(Object.entries(def).map(([emp_id,days])=>({emp_id,days})));
          setScheduleRaw(def);
        }

        // Load attendance (last 90 days)
        const attT = await sb.from("attendance");
        const attRows = await attT.select("*", `date=gte.${new Date(Date.now()-90*864e5).toISOString().slice(0,10)}`);
        if (attRows?.length) {
          const att = {};
          attRows.forEach(r => {
            if (!att[r.date]) att[r.date]={};
            att[r.date][r.emp_id]={status:r.status,checkIn:r.check_in||"",checkOut:r.check_out||"",lateMin:r.late_min||0,earlyMin:r.early_min||0,workDuration:r.work_duration||"",note:r.note||""};
          });
          setAttendanceRaw(att);
        }

        // Load performance (last 90 days)
        const pfT = await sb.from("performance");
        const pfRows = await pfT.select("*", `date=gte.${new Date(Date.now()-90*864e5).toISOString().slice(0,10)}`);
        if (pfRows?.length) {
          const pf = {};
          pfRows.forEach(r => {
            if (!pf[r.date]) pf[r.date]={};
            pf[r.date][r.emp_id]={closed:r.closed||0,escalations:r.escalations||0,quality:r.quality||""};
          });
          setPerformanceRaw(pf);
        }

        // Load heatmap (last 90 days)
        const hmT = await sb.from("heatmap");
        const hmRows = await hmT.select();
        if (hmRows?.length) {
          const hm = {};
          hmRows.forEach(r=>{ hm[r.date]=r.hours||{}; });
          setHeatmapRaw(hm);
        }

        // Load queue_log (last 90 days)
        const qlT = await sb.from("queue_log");
        const qlRows = await qlT.select();
        if (qlRows?.length) {
          const ql = {};
          qlRows.forEach(r=>{ ql[r.id]=r.data||{}; });
          setQueueLogRaw(ql);
        }

        // Load audit_log (last 500)
        const alT = await sb.from("audit_log");
        const alRows = await alT.select("*", "order=ts.desc&limit=500");
        if (alRows?.length) {
          const al = alRows.map(r=>({id:r.id,ts:r.ts,by:r.by_name,role:r.by_role,action:r.action,target:r.target||"",detail:r.detail||""}));
          setAuditLogRaw(al);
        }

        // Load notes
        const ntT = await sb.from("notes");
        const ntRows = await ntT.select("*", "order=ts.desc");
        if (ntRows?.length) {
          setNotesRaw(ntRows.map(r=>({id:r.id,ts:r.ts,date:r.date,time:r.time,tag:r.tag,text:r.text})));
        }

      } catch(e) {
        console.warn("Supabase load failed, using localStorage:", e);
        // Fallback to localStorage
        try {
          const emp = localStorage.getItem("csops_employees"); if(emp) setEmployeesRaw(JSON.parse(emp));
          else setEmployeesRaw(DEFAULT_EMPLOYEES);
          const sh = localStorage.getItem("csops_shifts"); if(sh) setShiftsRaw(JSON.parse(sh));
          else setShiftsRaw(DEFAULT_SHIFTS);
          const sc = localStorage.getItem("csops_schedule"); if(sc) setScheduleRaw(JSON.parse(sc));
          else setScheduleRaw(buildDefaultSchedule(DEFAULT_EMPLOYEES));
          const at = localStorage.getItem("csops_attendance"); if(at) setAttendanceRaw(JSON.parse(at));
          const pf = localStorage.getItem("csops_performance"); if(pf) setPerformanceRaw(JSON.parse(pf));
          const hm = localStorage.getItem("csops_heatmap"); if(hm) setHeatmapRaw(JSON.parse(hm));
          const ql = localStorage.getItem("csops_queueLog"); if(ql) setQueueLogRaw(JSON.parse(ql));
          const bs = localStorage.getItem("csops_breakSchedule"); if(bs) setBreakScheduleRaw(JSON.parse(bs));
          const al = localStorage.getItem("csops_auditLog"); if(al) setAuditLogRaw(JSON.parse(al));
          const nt = localStorage.getItem("csops_notes"); if(nt) setNotesRaw(JSON.parse(nt));
        } catch {}
      } finally {
        setLoading(false);
      }
    })();
  });

  // ── Supabase savers ───────────────────────────────────────────────────────
  async function saveEmployees(emps) {
    try {
      const t = await sb.from("employees");
      await t.upsert(emps.map(e=>({id:e.id,name:e.name,role:e.role,tasks:e.tasks||[]})));
    } catch {}
    localStorage.setItem("csops_employees", JSON.stringify(emps));
  }
  async function saveShifts(shs) {
    try {
      const t = await sb.from("shifts");
      await t.upsert(shs.map(s=>({id:s.id,label:s.label,start_time:s.start,end_time:s.end,color:s.color})));
    } catch {}
    localStorage.setItem("csops_shifts", JSON.stringify(shs));
  }
  async function saveSchedule(sc) {
    try {
      const t = await sb.from("schedule");
      await t.upsert(Object.entries(sc).map(([emp_id,days])=>({emp_id,days,updated_at:new Date().toISOString()})));
    } catch {}
    localStorage.setItem("csops_schedule", JSON.stringify(sc));
  }
  async function saveAttendance(att) {
    try {
      const rows = [];
      Object.entries(att).forEach(([date, emps]) => {
        Object.entries(emps).forEach(([emp_id, a]) => {
          rows.push({id:`${date}_${emp_id}`,date,emp_id,status:a.status,check_in:a.checkIn||null,check_out:a.checkOut||null,late_min:a.lateMin||0,early_min:a.earlyMin||0,work_duration:a.workDuration||null,note:a.note||null,updated_at:new Date().toISOString()});
        });
      });
      if (rows.length) { const t = await sb.from("attendance"); await t.upsert(rows); }
    } catch {}
    localStorage.setItem("csops_attendance", JSON.stringify(att));
  }
  async function savePerformance(pf) {
    try {
      const rows = [];
      Object.entries(pf).forEach(([date,emps])=>{
        Object.entries(emps).forEach(([emp_id,p])=>{
          rows.push({id:`${date}_${emp_id}`,date,emp_id,closed:p.closed||0,escalations:p.escalations||0,quality:p.quality||null,updated_at:new Date().toISOString()});
        });
      });
      if (rows.length) { const t = await sb.from("performance"); await t.upsert(rows); }
    } catch {}
    localStorage.setItem("csops_performance", JSON.stringify(pf));
  }
  async function saveHeatmap(hm) {
    try {
      const rows = Object.entries(hm).map(([date,hours])=>({date,hours,updated_at:new Date().toISOString()}));
      if (rows.length) { const t = await sb.from("heatmap"); await t.upsert(rows); }
    } catch {}
    localStorage.setItem("csops_heatmap", JSON.stringify(hm));
  }
  async function saveQueueLog(ql) {
    try {
      const rows = Object.entries(ql).map(([id,data])=>{
        const [date,shift_id] = id.split("_");
        return {id,date,shift_id:shift_id||"",data,updated_at:new Date().toISOString()};
      });
      if (rows.length) { const t = await sb.from("queue_log"); await t.upsert(rows); }
    } catch {}
    localStorage.setItem("csops_queueLog", JSON.stringify(ql));
  }
  async function saveAuditLog(al) {
    try {
      const latest = Array.isArray(al) ? al.slice(0,50) : []; // save only new 50
      const rows = latest.map(l=>({id:l.id,ts:l.ts,by_name:l.by,by_role:l.role,action:l.action,target:l.target||"",detail:l.detail||""}));
      if (rows.length) { const t = await sb.from("audit_log"); await t.upsert(rows); }
    } catch {}
    localStorage.setItem("csops_auditLog", JSON.stringify(al));
  }
  async function saveNotes(nt) {
    try {
      const rows = (Array.isArray(nt)?nt:[]).map(n=>({id:n.id,ts:n.ts,date:n.date,time:n.time||"",tag:n.tag||"General",text:n.text}));
      if (rows.length) { const t = await sb.from("notes"); await t.upsert(rows); }
    } catch {}
    localStorage.setItem("csops_notes", JSON.stringify(nt));
  }

  // ── Wrapped setters that save to Supabase ─────────────────────────────────
  function setEmployees(val)  { const n=typeof val==="function"?val(employees):val;  setEmployeesRaw(n);  saveEmployees(n); }
  function setShifts(val)     { const n=typeof val==="function"?val(shifts):val;     setShiftsRaw(n);     saveShifts(n); }
  function setSchedule(val)   { const n=typeof val==="function"?val(scheduleMap):val; setScheduleRaw(n);  saveSchedule(n); }
  function setAttendance(val) { const n=typeof val==="function"?val(attendance):val; setAttendanceRaw(n); saveAttendance(n); }
  function setPerformance(val){ const n=typeof val==="function"?val(performance):val;setPerformanceRaw(n);savePerformance(n); }
  function setHeatmap(val)    { const n=typeof val==="function"?val(heatmap):val;    setHeatmapRaw(n);    saveHeatmap(n); }
  function setQueueLog(val)   { const n=typeof val==="function"?val(queueLog):val;   setQueueLogRaw(n);   saveQueueLog(n); }
  function setBreakSchedule(val) {
    const n=typeof val==="function"?val(breakSchedule):val;
    setBreakScheduleRaw(n);
    try { localStorage.setItem("csops_breakSchedule", JSON.stringify(n)); } catch {}
  }
  function setAuditLog(val)   { const n=typeof val==="function"?val(auditLog):val;   setAuditLogRaw(n);   saveAuditLog(n); }
  function setNotes(val)      { const n=typeof val==="function"?val(notes):val;      setNotesRaw(n);      saveNotes(n); }

  // Use scheduleMap as schedule
  const schedule = scheduleMap;

  // Loading screen
  if (loading) {
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0F2744,#1E3A5F)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"'IBM Plex Sans','Segoe UI',sans-serif", flexDirection:"column", gap:20 }}>
        <div style={{ fontSize:48 }}>🎯</div>
        <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>CS Operations</div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#10B981",
            animation:"pulse 1s infinite" }}/>
          <span style={{ color:"rgba(255,255,255,0.7)", fontSize:14 }}>Connecting to database...</span>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      </div>
    );
  }

  // Not logged in → show login
  if (!session) {
    return <LoginScreen employees={employees} onLogin={sess => {
      const entry = {
        id: "al"+Date.now()+Math.random(),
        ts: new Date().toISOString(),
        by: sess.name, role: sess.role,
        action: "Sign In", target: sess.name,
        detail: `${sess.role} signed in`,
      };
      setAuditLog(prev => [entry, ...(Array.isArray(prev)?prev:[])].slice(0, 2000));
      setSession(sess);
      try { const lp = localStorage.getItem("csops_lastPage"); if(lp) setPage(lp); } catch {}
    }}/>;
  }

  const currentRole = session.role;
  const currentName = session.name;
  const canEdit     = ROLE_CAN_EDIT[currentRole];
  const roleColor   = ROLE_COLORS[currentRole];

  function navigate(p) {
    setPage(p);
    try { localStorage.setItem("csops_lastPage", p); } catch {}
  }

  const noop = () => {};
  const AL = setAuditLog;

  // ── Audited setter: wraps any setter and logs every change ──────────────────
  function makeAudited(setter, label) {
    if (!canEdit) return noop;
    return (val) => {
      setter(val);
      const entry = {
        id: "al"+Date.now()+Math.random(),
        ts: new Date().toISOString(),
        by: currentName,
        role: currentRole,
        action: label,
        target: "",
        detail: "",
      };
      setAuditLog(prev => [entry, ...(Array.isArray(prev)?prev:[])].slice(0, 2000));
    };
  }

  // ── Specific audited setters with meaningful labels ──────────────────────────
  const E  = makeAudited(setEmployees,   "Employee Data Updated");
  const SH = makeAudited(setShifts,      "Shift Config Updated");
  const SC = makeAudited(setSchedule,    "Schedule Updated");
  const AT = makeAudited(setAttendance,  "Attendance Recorded");
  const PF = makeAudited(setPerformance, "Performance Updated");
  const HM = makeAudited(setHeatmap,     "Heat Map Updated");
  const QL = makeAudited(setQueueLog,    "Queue Data Updated");

  // ── Fine-grained audit helper for specific actions (Tasks page, login, etc.) ──
  function addAudit(action, target, detail) {
    const entry = {
      id: "al"+Date.now()+Math.random(),
      ts: new Date().toISOString(),
      by: currentName,
      role: currentRole,
      action, target, detail,
    };
    setAuditLog(prev => [entry, ...(Array.isArray(prev)?prev:[])].slice(0, 2000));
  }

  function logout() {
    addAudit("Sign Out", currentName, `${currentRole} signed out`);
    // small delay so audit saves before session clears
    setTimeout(() => setSession(null), 50);
  }

  // After session confirmed — override navigate to log page visits
  function navigateLogged(p) {
    setPage(p);
    try { localStorage.setItem("csops_lastPage", p); } catch {}
    addAudit("Page View", p, `Opened ${p}`);
  }

  const pageComponents = {
    Schedule:      <SchedulePage employees={employees} setEmployees={E} schedule={schedule} setSchedule={SC} shifts={shifts} canEdit={canEdit}/>,
    Attendance:    <AttendancePage employees={employees} schedule={schedule} shifts={shifts} attendance={attendance} setAttendance={AT}/>,
    Queue:         <QueuePage shifts={shifts} queueLog={queueLog} setQueueLog={QL} setHeatmap={HM}/>,
    "Daily Tasks": <DailyTasksPage employees={employees} setEmployees={E} schedule={schedule} setSchedule={SC} shifts={shifts} auditLog={auditLog} setAuditLog={AL} session={session}/>,
    "Live Floor":  <LiveFloorPage employees={employees} schedule={schedule} shifts={shifts} attendance={attendance} setAttendance={AT} breakSchedule={breakSchedule} setBreakSchedule={setBreakSchedule}/>,
    Break:         <BreakPage employees={employees} schedule={schedule} shifts={shifts} breakSchedule={breakSchedule} setBreakSchedule={setBreakSchedule} canEdit={canEdit}/>,
    "Heat Map":    <HeatMapPage queueLog={queueLog}/>,
    "Audit Log":   <AuditLogPage auditLog={auditLog} session={session}/>,
    Notes:         <NotesPage notes={notes} setNotes={canEdit?setNotes:noop}/>,
    Shifts:        <ShiftsPage shifts={shifts} setShifts={SH}/>,
    Performance:   <PerformancePage employees={employees} schedule={schedule} shifts={shifts} performance={performance} setPerformance={PF}/>,
    Reports:       <ReportsPage employees={employees} schedule={schedule} shifts={shifts} attendance={attendance} performance={performance} heatmap={heatmap} kg={{}} queueLog={queueLog}/>,
  };

  // Page icons for mobile bottom nav
  const PAGE_ICONS = {
    "Schedule":"📅","Attendance":"📋","Queue":"📊","Daily Tasks":"📌",
    "Live Floor":"🏢","Break":"☕","Heat Map":"🌡️","Audit Log":"🔍","Notes":"📝",
    "Shifts":"⏰","Performance":"⚡","Reports":"📑"
  };

  return (
    <div style={{ minHeight:"100vh", minHeight:"100dvh", background:"#EFF3F8",
      fontFamily:"'IBM Plex Sans','Segoe UI',sans-serif" }}>

      {/* ── TOP HEADER (visible on all devices) ── */}
      <div style={{ background:"#0F2744", position:"sticky", top:0, zIndex:100,
        boxShadow:"0 2px 12px rgba(0,0,0,0.25)" }}>
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 12px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 0" }}>

            {/* Brand */}
            <div style={{ color:"#fff", fontWeight:800, fontSize:15, whiteSpace:"nowrap",
              marginRight:8, paddingRight:8, borderRight:"1px solid rgba(255,255,255,0.15)",
              display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
              🎯 CS Ops
              <span style={{ fontSize:10, background:"#10B981", color:"#fff",
                borderRadius:10, padding:"2px 6px", fontWeight:600 }}>💾</span>
            </div>

            {/* Desktop nav — hidden on mobile */}
            <div style={{ display:"flex", gap:4, overflowX:"auto", flex:1,
              scrollbarWidth:"none", msOverflowStyle:"none" }}
              className="desktop-nav">
              <style>{`
                @media (max-width: 768px) { .desktop-nav { display: none !important; } }
                @media (min-width: 769px) { .mobile-bottom-nav { display: none !important; } }
                .desktop-nav::-webkit-scrollbar { display: none; }
              `}</style>
              {PAGES.map(p => (
                <button key={p} onClick={()=>navigateLogged(p)}
                  style={{ background: page===p ? "#2563EB" : "rgba(255,255,255,0.1)",
                    color:"#fff", border:"none", borderRadius:6, padding:"6px 11px",
                    fontSize:11, cursor:"pointer", fontWeight:600, whiteSpace:"nowrap",
                    transition:"background 0.15s", flexShrink:0 }}>
                  {p}
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
              {/* Auto-save */}
              <div style={{ display:"flex", alignItems:"center", gap:3,
                background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)",
                borderRadius:20, padding:"3px 8px" }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:"#10B981" }}/>
                <span style={{ fontSize:9, color:"#10B981", fontWeight:700 }}>Saved</span>
              </div>

              {/* User badge */}
              <div style={{ background: roleColor+"30", border:`1px solid ${roleColor}60`,
                borderRadius:20, padding:"4px 10px", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:13 }}>{ROLE_ICONS[currentRole]}</span>
                <div>
                  <div style={{ fontSize:11, fontWeight:800, color:roleColor, lineHeight:1.2 }}>
                    {currentName.split(" ")[0]}
                  </div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", lineHeight:1.2 }}>
                    {currentRole}{!canEdit && " · 👁️"}
                  </div>
                </div>
              </div>

              {/* Sign out */}
              <button onClick={logout}
                style={{ background:"rgba(239,68,68,0.15)", color:"#FCA5A5",
                  border:"1px solid rgba(239,68,68,0.3)", borderRadius:6,
                  padding:"5px 8px", fontSize:11, cursor:"pointer", fontWeight:600 }}>
                ⏏️
              </button>

              {canResetPasswords(currentRole, currentName) && (
                <button onClick={()=>setShowResetPw(true)}
                  style={{ background:"rgba(245,158,11,0.15)", color:"#FCD34D",
                    border:"1px solid rgba(245,158,11,0.3)", borderRadius:6,
                    padding:"5px 8px", fontSize:11, cursor:"pointer", fontWeight:600 }}>
                  🔑
                </button>
              )}

              {(currentRole==="Team Lead" || currentRole==="Shift Leader" || currentName==="Mohammed Nasser Althurwi") && (
                <button onClick={()=>navigateLogged("Audit Log")}
                  style={{ background:"rgba(99,102,241,0.15)", color:"#A5B4FC",
                    border:"1px solid rgba(99,102,241,0.3)", borderRadius:6,
                    padding:"5px 8px", fontSize:11, cursor:"pointer", fontWeight:600 }}>
                  🕐
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PAGE CONTENT ── */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"16px 12px 90px" }}>
        <div style={{ marginBottom:12, display:"flex", alignItems:"center",
          justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <div>
            <h1 style={{ fontSize:18, fontWeight:800, color:"#0F2744", margin:0 }}>
              {PAGE_ICONS[page]} {page}
            </h1>
            <div style={{ fontSize:11, color:"#94A3B8", marginTop:2 }}>
              {new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            </div>
          </div>
          <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:20,
            padding:"5px 12px", display:"flex", alignItems:"center", gap:6,
            fontSize:11, color:"#475569" }}>
            <span>{ROLE_ICONS[currentRole]}</span>
            <span><strong style={{ color:roleColor }}>{currentName.split(" ")[0]}</strong></span>
            <span style={{ color:"#CBD5E1" }}>·</span>
            <span style={{ color:"#94A3B8" }}>
              {new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
            </span>
          </div>
        </div>
        {!canEdit && <ReadOnlyBanner userName={currentName}/>}
        {pageComponents[page]}
      </div>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <div className="mobile-bottom-nav"
        style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:200,
          background:"#0F2744", borderTop:"1px solid rgba(255,255,255,0.1)",
          paddingBottom:"env(safe-area-inset-bottom, 0px)" }}>
        {/* Two rows of pages: first 6 then last 5 */}
        {[PAGES.slice(0,6), PAGES.slice(6)].map((group, gi) => (
          <div key={gi} style={{ display:"flex", justifyContent:"space-around",
            padding: gi===0 ? "6px 4px 2px" : "2px 4px 6px" }}>
            {group.map(p => (
              <button key={p} onClick={()=>navigateLogged(p)}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:1,
                  background:"none", border:"none", cursor:"pointer", padding:"4px 6px",
                  borderRadius:8, minWidth:48, transition:"background 0.15s",
                  background: page===p ? "rgba(37,99,235,0.3)" : "transparent" }}>
                <span style={{ fontSize:18 }}>{PAGE_ICONS[p]}</span>
                <span style={{ fontSize:8, color: page===p ? "#60A5FA" : "rgba(255,255,255,0.5)",
                  fontWeight: page===p ? 700 : 400, whiteSpace:"nowrap" }}>
                  {p.length > 7 ? p.slice(0,6)+"…" : p}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {showResetPw && (
        <PasswordResetModal employees={employees} session={session} onClose={()=>setShowResetPw(false)}/>
      )}
    </div>
  );
}
