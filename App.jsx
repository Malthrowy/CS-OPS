import { useState, useMemo, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const TASK_LIST = ["TGA","Social Group","KSA OT","GCC T2 Cases","KWT T2 Cases","KSA SOME Cases","KWT SOME Cases","GCC SOME Cases","180","OSLO","Keemart Online","Survey","Failed Refund Sheet"];
const TASK_COLORS = ["#6366F1","#0EA5E9","#F59E0B","#10B981","#EF4444","#8B5CF6","#EC4899","#14B8A6","#F97316","#06B6D4","#84CC16","#A855F7","#E11D48"];
const STATUS_OPTIONS = ["Present","Absent","Late","Early Leave","Day Off"];
const PAGES = ["Schedule","Attendance","Queue","Daily Tasks","Live Floor","Heat Map","Audit Log","Notes","Shifts","Performance","Reports"];

// ─── STYLE HELPERS ────────────────────────────────────────────────────────────
const I = (extra={}) => ({ background:"#fff", border:"1px solid #CBD5E1", borderRadius:6, padding:"6px 10px", fontSize:13, color:"#1E293B", outline:"none", width:"100%", boxSizing:"border-box", ...extra });
const CRD = (extra={}) => ({ background:"#fff", borderRadius:10, padding:"16px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.08)", ...extra });
const SBR = (extra={}) => ({ background:"#F1F5F9", borderRadius:8, padding:"10px 16px", marginBottom:12, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", ...extra });
const PBT = (color="#2563EB", extra={}) => ({ background:color, color:"#fff", border:"none", borderRadius:6, padding:"7px 14px", fontSize:13, cursor:"pointer", fontWeight:600, ...extra });
const LBL = { fontSize:12, fontWeight:600, color:"#64748B", marginBottom:4, display:"block" };

// ─── DEFAULT DATA ─────────────────────────────────────────────────────────────
const DEFAULT_SHIFTS = [
  { id:"s1", label:"Shift 1", start:"08:00", end:"17:00", color:"#0EA5E9" },
  { id:"s2", label:"Shift 2", start:"10:00", end:"19:00", color:"#10B981" },
  { id:"s3", label:"Shift 3", start:"11:00", end:"20:00", color:"#F59E0B" },
  { id:"s4", label:"Shift 4", start:"13:00", end:"22:00", color:"#6366F1" },
  { id:"s5", label:"Shift 5", start:"14:00", end:"23:00", color:"#EF4444" },
  { id:"s6", label:"Shift 6", start:"17:00", end:"02:00", color:"#EC4899" },
  { id:"s7", label:"Shift 7", start:"19:00", end:"04:00", color:"#06B6D4" },
  { id:"s8", label:"Shift 8", start:"23:00", end:"08:00", color:"#8B5CF6" },
];

const DEFAULT_EMPLOYEES = [
  { id:"e1",  name:"Ahmed Mohammed Ali",          tasks:[], role:"Team Lead" },
  { id:"e2",  name:"Mohammed Almutairi",           tasks:[], role:"Shift Leader" },
  { id:"e3",  name:"Manar Alturaiki",              tasks:[], role:"Shift Leader" },
  { id:"e4",  name:"Abdulaziz Alrusayni",          tasks:[], role:"Shift Leader" },
  { id:"e5",  name:"Yazeed Saad",                  tasks:[], role:"Shift Leader" },
  { id:"e6",  name:"Sultan Ahmed",                 tasks:[], role:"Shift Leader" },
  { id:"e7",  name:"Amar Saleh",                   tasks:[], role:"SME" },
  { id:"e8",  name:"Amer Alanzi",                  tasks:[], role:"SME" },
  { id:"e9",  name:"Abdulelah Fawaz Alanazi",      tasks:[], role:"SME" },
  { id:"e10", name:"Abdulrahman Alghamdi",         tasks:[], role:"SME" },
  { id:"e11", name:"Emad Alzahrani",               tasks:[], role:"SME" },
  { id:"e12", name:"Mohammed Nasser Althurwi",     tasks:[], role:"SME" },
  { id:"e13", name:"Ghazi Alruways",               tasks:[], role:"Agent" },
  { id:"e14", name:"Mohammed Alharthi",            tasks:[], role:"Agent" },
  { id:"e15", name:"Shaima Alyami",                tasks:[], role:"Agent" },
  { id:"e16", name:"Raed Abdullah Allehaidan",     tasks:[], role:"Agent" },
  { id:"e17", name:"Ali Mohammed Khuzaee",         tasks:[], role:"Agent" },
  { id:"e18", name:"Ali Haqawi",                   tasks:[], role:"Agent" },
  { id:"e19", name:"Nejoud Aljheimi",              tasks:[], role:"Agent" },
  { id:"e20", name:"Abdullah Alzain",              tasks:[], role:"Agent" },
  { id:"e21", name:"Abdulaziz Muqbil",             tasks:[], role:"Agent" },
  { id:"e22", name:"Fahad Sager",                  tasks:[], role:"Agent" },
  { id:"e23", name:"Rayan Almaziad",               tasks:[], role:"Agent" },
  { id:"e24", name:"Abdulmajeed Mohammed",         tasks:[], role:"Agent" },
  { id:"e25", name:"Saad Aldahus",                 tasks:[], role:"Agent" },
  { id:"e26", name:"Khalid Alkhaldi",              tasks:[], role:"Agent" },
  { id:"e27", name:"Talal Sagga",                  tasks:[], role:"Agent" },
  { id:"e28", name:"Rashed Aljaloud",              tasks:[], role:"Agent" },
  { id:"e29", name:"Abdulkarem Alansari",          tasks:[], role:"Agent" },
  { id:"e30", name:"Mohannad Alamri",              tasks:[], role:"Agent" },
  { id:"e31", name:"Ahmed Awaji",                  tasks:[], role:"Agent" },
  { id:"e32", name:"Abdulelah Saud",               tasks:[], role:"Agent" },
  { id:"e33", name:"Khalid Saeed",                 tasks:[], role:"Agent" },
  { id:"e34", name:"Nourah Alowayyid",             tasks:[], role:"Agent" },
  { id:"e35", name:"Lujain Metwalli",              tasks:[], role:"Agent" },
  { id:"e36", name:"Nasser Alhowimel",             tasks:[], role:"Agent" },
  { id:"e37", name:"Majed Mohammed",               tasks:[], role:"Agent" },
  { id:"e38", name:"Ahmed Alshehri",               tasks:[], role:"Agent" },
  { id:"e39", name:"Faris Rashed",                 tasks:[], role:"Agent" },
  { id:"e40", name:"Abdullah Alharbi",             tasks:[], role:"Agent" },
  { id:"e41", name:"Yousef Alrsheedi",             tasks:[], role:"Agent" },
  { id:"e42", name:"Khaled Almarhom",              tasks:[], role:"Agent" },
  { id:"e43", name:"Faez Almindah",                tasks:[], role:"Agent" },
  { id:"e44", name:"Mohammed Jaseem",              tasks:[], role:"Agent" },
  { id:"e45", name:"Mohammed Alnakhli",            tasks:[], role:"Agent" },
  { id:"e46", name:"Saud Ali",                     tasks:[], role:"Agent" },
  { id:"e47", name:"Mohammed Alsahli",             tasks:[], role:"Agent" },
  { id:"e48", name:"Yasir Seif",                   tasks:[], role:"Agent" },
  { id:"e49", name:"Sultan Alhamoudi",             tasks:[], role:"Agent" },
  { id:"e50", name:"Mohammed Alobaid",             tasks:[], role:"Agent" },
  { id:"e51", name:"Ramiz Ghashem",                tasks:[], role:"Agent" },
  { id:"e52", name:"Khalid Mnsour",                tasks:[], role:"Agent" },
  { id:"e53", name:"Khalid Mutlaq",                tasks:[], role:"Agent" },
  { id:"e54", name:"Ali Harfash",                  tasks:[], role:"Agent" },
  { id:"e55", name:"Talal Alfaraj",                tasks:[], role:"Agent" },
  { id:"e56", name:"Bader Alotaibi",               tasks:[], role:"Agent" },
  { id:"e57", name:"Bandar Almalki",               tasks:[], role:"Agent" },
  { id:"e58", name:"Ahmad Alharbi",                tasks:[], role:"Agent" },
  { id:"e59", name:"Mohammed Alshehri",            tasks:[], role:"Agent" },
  { id:"e60", name:"Abdulelah Alshehri",           tasks:[], role:"Agent" },
  { id:"e61", name:"Saud Alzahrani",               tasks:[], role:"Agent" },
  { id:"e62", name:"Faisal Saraan",                tasks:[], role:"Agent" },
  { id:"e63", name:"Manal Aldosry",                tasks:[], role:"Agent" },
  { id:"e64", name:"Hajer Alshreif",               tasks:[], role:"Agent" },
  { id:"e65", name:"Mohammed Alabdullah",          tasks:[], role:"Agent" },
  { id:"e66", name:"Abdulaziz Alsukait",           tasks:[], role:"Agent" },
  { id:"e67", name:"Abdulkareem Mokhtar",          tasks:[], role:"Agent" },
  { id:"e68", name:"Saad Alsaiqer",                tasks:[], role:"Agent" },
  { id:"e69", name:"Yasser Alghamdi",              tasks:[], role:"Agent" },
  { id:"e70", name:"Nasser Saad",                  tasks:[], role:"Agent" },
  { id:"e71", name:"Tariq Alhalmani",              tasks:[], role:"Agent" },
  { id:"e72", name:"Saad Altukhayfi",              tasks:[], role:"Agent" },
  { id:"e73", name:"Abdulaziz Massad Alanazi",     tasks:[], role:"Agent" },
  { id:"e74", name:"Raneem Albaqami",              tasks:[], role:"Agent" },
  { id:"e75", name:"Sarah Almihbash",              tasks:[], role:"Agent" },
  { id:"e76", name:"Ahmed Khalid",                 tasks:[], role:"Agent" },
  { id:"e77", name:"Muath Ahmed",                  tasks:[], role:"Agent" },
  { id:"e78", name:"Mohamed Aljhani",              tasks:[], role:"Agent" },
  { id:"e79", name:"Ziyad Ahmed",                  tasks:[], role:"Agent" },
  { id:"e80", name:"Faisal Alowis",                tasks:[], role:"Agent" },
  { id:"e81", name:"Abdulaziz Alghamdi",           tasks:[], role:"Agent" },
  { id:"e82", name:"Salma Aldossarie",             tasks:[], role:"Agent" },
  { id:"e83", name:"Faisal Abdulrhman",            tasks:[], role:"Agent" },
  { id:"e84", name:"Bader Alnaafisah",             tasks:[], role:"Agent" },
  { id:"e85", name:"Faisal Baothman",              tasks:[], role:"Agent" },
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
function SchedulePage({ employees, setEmployees, schedule, setSchedule, shifts }) {
  const [showAdd, setShowAdd]       = useState(false);
  const [editEmp, setEditEmp]       = useState(null);
  const [newEmp, setNewEmp]         = useState({ name:"", tasks:[], role:"Agent" });
  const [showImport, setShowImport] = useState(false);
  const [importPreview, setImportPreview] = useState([]); // [{name, role, tasks, days:{Sun:shiftId,...}}]
  const [importErrors, setImportErrors]   = useState([]);
  const fileRef = useRef();
  const today = new Date().getDay();

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

    // ── All "off" variants → Day Off ──
    if (/^(off|wo|w\.o\.?|ph|public.?holiday|holiday|day.?off|leave|annual|إجازة|اجازة|يوم.?إجازة|عطلة|-)$/i.test(v))
      return "OFF";

    // ── Exact shift label e.g. "Shift 1" ──
    const byLabel = shifts.find(s => s.label.toLowerCase() === v.toLowerCase());
    if (byLabel) return byLabel.id;

    // ── Number only → "Shift N" ──
    if (/^\d+$/.test(v)) {
      const byNum = shifts.find(s => s.label.toLowerCase() === `shift ${v}`);
      if (byNum) return byNum.id;
    }

    // ── Time range "HH:MM-HH:MM" or "HH:MM–HH:MM" ──
    const rangeMatch = v.match(/^(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})$/);
    if (rangeMatch) {
      const pad = t => t.replace(/^(\d):/, "0$1:");
      const start = pad(rangeMatch[1]);
      const end   = pad(rangeMatch[2]);
      // 1. Exact match
      const exact = shifts.find(s => s.start === start && s.end === end);
      if (exact) return exact.id;
      // 2. Start-time match
      const byStart = shifts.find(s => s.start === start);
      if (byStart) return byStart.id;
      // 3. Closest shift by start time
      const startMin = toMin(start);
      let closest = shifts[0], minDiff = Infinity;
      shifts.forEach(s => {
        const diff = Math.abs(toMin(s.start) - startMin);
        if (diff < minDiff) { minDiff = diff; closest = s; }
      });
      return closest.id;
    }

    // ── Single time "HH:MM" → match start ──
    const timeMatch = v.match(/^(\d{1,2}:\d{2})$/);
    if (timeMatch) {
      const pad = t => t.replace(/^(\d):/, "0$1:");
      const s = shifts.find(sh => sh.start === pad(timeMatch[1]));
      if (s) return s.id;
    }

    // ── Anything else (dates, unknown text) → OFF ──
    return "OFF";
  }

  // ── Parse Excel file — handles ANY structure ──────────────────────────────────
  function handleFile(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const XLSX = window.XLSX;
        if (!XLSX) { alert("SheetJS not loaded yet, please wait and try again."); return; }

        const wb = XLSX.read(ev.target.result, { type:"array", cellDates:true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        // raw:true keeps original values; defval:"" fills blanks
        const rows = XLSX.utils.sheet_to_json(ws, { header:1, defval:"", raw:false });

        if (rows.length < 2) { alert("File is empty."); return; }

        const DAY_ALIASES = {
          Sunday:    ["sunday","sun","الأحد","احد"],
          Monday:    ["monday","mon","الاثنين","اثنين"],
          Tuesday:   ["tuesday","tue","الثلاثاء","ثلاثاء"],
          Wednesday: ["wednesday","wed","الأربعاء","اربعاء"],
          Thursday:  ["thursday","thu","الخميس","خميس"],
          Friday:    ["friday","fri","الجمعة","جمعة"],
          Saturday:  ["saturday","sat","السبت","سبت"],
        };

        function isDayCell(c) {
          const cl = String(c).trim().toLowerCase();
          return Object.values(DAY_ALIASES).flat().some(a => cl.includes(a));
        }
        function isNameCell(c) { return /name|employee|موظف|اسم/i.test(String(c).trim()); }
        function isDateCell(c) {
          // Detects date strings like "3/15/2026", "2026-03-15", "15-Mar-26" etc.
          return /\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(String(c).trim());
        }

        // ── Step 1: find daysRow (has day names) and nameRow (has "Name" + dates) ──
        let daysRowIdx = -1, nameRowIdx = -1;

        for (let i = 0; i < Math.min(8, rows.length); i++) {
          const cells = rows[i].map(c => String(c).trim());
          if (daysRowIdx === -1 && cells.some(isDayCell)) daysRowIdx = i;
          if (nameRowIdx === -1 && cells.some(isNameCell)) nameRowIdx = i;
        }

        // Fallbacks
        if (daysRowIdx === -1 && nameRowIdx === -1) { daysRowIdx = 0; nameRowIdx = 1; }
        else if (daysRowIdx === -1) daysRowIdx = nameRowIdx - 1;
        else if (nameRowIdx === -1) nameRowIdx = daysRowIdx + 1;

        const daysRow  = rows[daysRowIdx] || [];
        const nameRow  = rows[nameRowIdx] || [];
        const dataStart = Math.max(daysRowIdx, nameRowIdx) + 1;

        // ── Step 2: build colMap {colIdx → "Sunday"|...} and find nameCol ──
        const colMap = {};   // colIdx → day name
        let nameCol  = 0;    // default col A (index 0)

        // From daysRow: map columns with day names
        daysRow.forEach((cell, ci) => {
          const cl = String(cell).trim().toLowerCase();
          for (const [day, aliases] of Object.entries(DAY_ALIASES)) {
            if (aliases.some(a => cl.includes(a))) colMap[ci] = day;
          }
        });

        // From nameRow: find nameCol; also catch days repeated here
        nameRow.forEach((cell, ci) => {
          const cs = String(cell).trim();
          if (isNameCell(cs)) { nameCol = ci; return; }
          // If nameRow has date strings (e.g. "3/15/2026"), map them to the day
          // using the daysRow day for that column (already in colMap)
          // Also catch day names repeated in nameRow
          const cl = cs.toLowerCase();
          if (!colMap[ci]) {
            for (const [day, aliases] of Object.entries(DAY_ALIASES)) {
              if (aliases.some(a => cl.includes(a))) colMap[ci] = day;
            }
          }
        });

        // ── Step 3: if no day columns found from day names, try date columns ──
        // Map date columns to day-of-week automatically
        if (Object.keys(colMap).length === 0) {
          nameRow.forEach((cell, ci) => {
            const cs = String(cell).trim();
            if (isDateCell(cs)) {
              try {
                const d = new Date(cs);
                if (!isNaN(d)) {
                  const day = DAYS[d.getDay()];
                  if (!colMap[ci]) colMap[ci] = day;
                }
              } catch {}
            }
          });
          daysRow.forEach((cell, ci) => {
            const cs = String(cell).trim();
            if (isDateCell(cs)) {
              try {
                const d = new Date(cs);
                if (!isNaN(d)) {
                  const day = DAYS[d.getDay()];
                  if (!colMap[ci]) colMap[ci] = day;
                }
              } catch {}
            }
          });
        }

        // ── Step 4: parse data rows ──
        const preview = [];
        const warnings = [];
        const seen = {}; // track duplicate day assignments per week — last wins

        for (let ri = dataStart; ri < rows.length; ri++) {
          const row = rows[ri];
          const name = String(row[nameCol] || "").trim();
          // Skip empty names, pure-number rows, header repeats
          if (!name || /^\d+$/.test(name) || isNameCell(name)) continue;

          const days = {
            Sunday:"OFF", Monday:"OFF", Tuesday:"OFF",
            Wednesday:"OFF", Thursday:"OFF", Friday:"OFF", Saturday:"OFF"
          };

          Object.entries(colMap).forEach(([ci, dayName]) => {
            const cell = String(row[Number(ci)] || "").trim();
            const sid  = resolveShiftId(cell);
            // If same day appears multiple times (multiple weeks), last column wins
            days[dayName] = sid;
            // Warn only on non-blank, non-standard values that became OFF
            if (cell && sid === "OFF" && !/^(off|wo|w\.o\.?|ph|public|holiday|day.?off|leave|annual|إجازة|اجازة|يوم|عطلة|-|)$/i.test(cell)) {
              warnings.push(`"${name}" · ${dayName}: "${cell}" → OFF`);
            }
          });

          preview.push({ name, role:"Agent", tasks:[], days });
        }

        if (preview.length === 0) {
          alert("No employee data found.\n\nMake sure:\n• Row 1 has day names (Sunday, Monday...)\n• Row 2 has 'Name' label\n• Data starts from Row 3");
          return;
        }

        setImportPreview(preview);
        setImportErrors(warnings);
        setShowImport(true);
      } catch(err) {
        console.error(err);
        alert("Error reading file:\n" + err.message);
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
  function downloadTemplate() {
    const XLSX = window.XLSX;
    if (!XLSX) { alert("SheetJS not loaded yet."); return; }
    // Row 1: days
    const row1 = ["", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // Row 2: Name + date placeholders
    const row2 = ["Name", "Date", "Date", "Date", "Date", "Date", "Date", "Date"];
    // Example data rows
    const examples = [
      ["Ahmed Mohammed Ali",  "Shift 1",      "Shift 1",      "Shift 1",      "Shift 1",      "Shift 1",      "OFF", "OFF"],
      ["Mohammed Almutairi",  "08:00-17:00",  "08:00-17:00",  "OFF",          "OFF",          "08:00-17:00",  "OFF", "OFF"],
      ["Ghazi Alruways",      "OFF",          "Shift 3",      "Shift 3",      "Shift 3",      "Shift 3",      "OFF", "OFF"],
    ];
    const ws = XLSX.utils.aoa_to_sheet([row1, row2, ...examples]);
    ws["!cols"] = [{ wch:28 }, ...Array(7).fill({ wch:14 })];
    // Style header rows bold (basic)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Schedule");
    XLSX.writeFile(wb, "schedule-template.xlsx");
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
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744", flex:1 }}>📅 Weekly Schedule Template</span>
        <button style={PBT("#2563EB")} onClick={()=>setShowAdd(true)}>+ Add Employee</button>
        <button style={PBT("#475569")} onClick={()=>fileRef.current.click()}>📥 Import Excel</button>
        <button style={PBT("#10B981")} onClick={downloadTemplate}>⬇️ Download Template</button>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{display:"none"}} onChange={handleFile}/>
      </div>

      {/* Shift legend */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
        {shifts.map(s=>(
          <span key={s.id} style={{ fontSize:11, fontWeight:600, background:s.color+"18", border:`1px solid ${s.color}50`,
            color:s.color, borderRadius:10, padding:"2px 10px" }}>{s.label}: {s.start}–{s.end}</span>
        ))}
        <span style={{ fontSize:11, fontWeight:600, background:"#FEF3C7", border:"1px solid #F59E0B50",
          color:"#92400E", borderRadius:10, padding:"2px 10px" }}>🏖️ Leave</span>
        <span style={{ fontSize:11, fontWeight:600, background:"#F3E8FF", border:"1px solid #8B5CF650",
          color:"#6D28D9", borderRadius:10, padding:"2px 10px" }}>🎌 PH - Public Holiday</span>
      </div>

      {/* Schedule Table */}
      <div style={{ ...CRD(), overflowX:"auto", marginBottom:20 }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#F8FAFC" }}>
              <tr style={{ background:"#F8FAFC" }}>
              <th style={{ padding:"10px 12px", textAlign:"left", fontWeight:700, color:"#0F2744", borderBottom:"2px solid #E2E8F0", minWidth:180 }}>Employee</th>
              {DAYS.map((day,di) => (
                <th key={day} style={{ padding:"10px 8px", textAlign:"center", fontWeight:700,
                  color: di===today ? "#2563EB" : "#0F2744",
                  borderBottom:"2px solid #E2E8F0", background: di===today ? "#EFF6FF" : "transparent", minWidth:110 }}>
                  {day.slice(0,3)}
                  {di===today && <span style={{ display:"block", fontSize:10, color:"#2563EB" }}>TODAY</span>}
                </th>
              ))}
              <th style={{ padding:"10px 8px", borderBottom:"2px solid #E2E8F0" }}></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp,ri) => (
              <tr key={emp.id} style={{ background: ri%2===0 ? "#fff" : "#F8FAFC" }}>
                <td style={{ padding:"8px 12px", fontWeight:600, color:"#1E293B" }}>
                  <div>{emp.name}</div>
                  <div style={{ fontSize:11, color:"#94A3B8" }}>{emp.role}</div>
                </td>
                {DAYS.map((day,di) => {
                  const val = (schedule[emp.id]||{})[day]||"OFF";
                  const sh = shifts.find(s=>s.id===val);
                  return (
                    <td key={day} style={{ padding:"6px", textAlign:"center", background: di===today ? "#EFF6FF" : "transparent" }}>
                      <select value={val} onChange={e=>setShift(emp.id,day,e.target.value)}
                        style={{ ...I(), padding:"4px 6px", fontSize:11,
                          border:`2px solid ${val==="LEAVE"?"#F59E0B":val==="PH"?"#8B5CF6":sh?sh.color:"#CBD5E1"}`,
                          background: val==="LEAVE"?"#FEF3C7":val==="PH"?"#F3E8FF":sh?sh.color+"18":"#fff",
                          color: val==="LEAVE"?"#92400E":val==="PH"?"#6D28D9":sh?sh.color:"#64748B",
                          fontWeight:600, cursor:"pointer" }}>
                        <option value="OFF">🔘 Day Off</option>
                        <option value="LEAVE">🏖️ Leave</option>
                        <option value="PH">🎌 PH - Public Holiday</option>
                        {shifts.map(s => <option key={s.id} value={s.id}>{s.label} ({s.start})</option>)}
                      </select>
                    </td>
                  );
                })}
                <td style={{ padding:"6px", textAlign:"center" }}>
                  <button onClick={()=>setEditEmp({...emp})} style={{ background:"none", border:"1px solid #CBD5E1", borderRadius:6, padding:"4px 8px", cursor:"pointer", fontSize:14 }}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      {/* Add Employee Modal */}
      {showAdd && (
        <Modal title="Add Employee" onClose={()=>setShowAdd(false)}>
          <label style={LBL}>Name</label>
          <input style={{ ...I(), marginBottom:12 }} value={newEmp.name} onChange={e=>setNewEmp(p=>({...p,name:e.target.value}))} placeholder="Full name"/>
          <label style={LBL}>Role</label>
          <select style={{ ...I(), marginBottom:12 }} value={newEmp.role} onChange={e=>setNewEmp(p=>({...p,role:e.target.value}))}>
            {["Agent","Shift Leader","Team Lead","SME","Other"].map(r=><option key={r}>{r}</option>)}
          </select>
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
< truncated lines 645-755 >
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
< truncated lines 1053-1148 >
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
< truncated lines 1444-1607 >
                    <span key={i} style={{ marginLeft:6, color:"#94A3B8" }}>[{eb.start} +{eb.durationMin}m]</span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {es.status==="Online" ? (
                  <button onClick={()=>setBreakStart(emp.id)}
                    style={PBT("#F59E0B",{padding:"5px 12px",fontSize:11})}>☕ Start Break</button>
                ) : (
                  <button onClick={()=>endBreak(emp.id)}
                    style={PBT("#10B981",{padding:"5px 12px",fontSize:11})}>✅ End Break</button>
                )}
                <button onClick={()=>{setShowBreakModal(emp.id);setExtraStart(pad(now.getHours())+":"+pad(now.getMinutes()));setExtraDur(15);}}
                  style={PBT("#8B5CF6",{padding:"5px 12px",fontSize:11})}>+ Extra Break</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra Break Modal */}
      {showBreakModal && (
        <Modal title={`Add Extra Break — ${employees.find(e=>e.id===showBreakModal)?.name}`}
          onClose={()=>setShowBreakModal(null)} width={380}>
          <label style={LBL}>Break Start Time</label>
          <input type="time" value={extraStart} onChange={e=>setExtraStart(e.target.value)} style={{ ...I(), marginBottom:12 }}/>
          <label style={LBL}>Duration (minutes)</label>
          <input type="number" min="1" max="120" value={extraDur} onChange={e=>setExtraDur(Number(e.target.value))} style={{ ...I(), marginBottom:16 }}/>
          <button style={PBT("#8B5CF6",{width:"100%",padding:"10px"})} onClick={()=>addExtraBreak(showBreakModal)}>+ Add Extra Break</button>
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

          {/* Agent hint */}
          {isAgent && (
            <div style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:8,
              padding:"12px 14px", marginBottom:16, fontSize:12, color:"#475569", textAlign:"center" }}>
              👤 Agent access requires no password — tap Sign In to continue.
            </div>
          )}

          {/* Sign In button */}
          {(isAgent || (selectedName && step==="login")) && (
            <button onClick={tryLogin}
              style={{ ...PBT(roleColor, { width:"100%", padding:"12px", fontSize:14, borderRadius:10 }) }}>
              {ROLE_ICONS[selectedRole]} Sign In{selectedName ? ` as ${selectedName.split(" ")[0]}` : " as Agent"}
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
  function setAuditLog(val)   { const n=typeof val==="function"?val(auditLog):val;   setAuditLogRaw(n);   saveAuditLog(n); }
  function setNotes(val)      { const n=typeof val==="function"?val(notes):val;      setNotesRaw(n);      saveNotes(n); }

  // Use scheduleMap as schedule
  const schedule = scheduleMap;

  // Load SheetJS
  if (typeof window !== "undefined" && !window.XLSX) {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    document.head.appendChild(s);
  }

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
    Schedule:      <SchedulePage employees={employees} setEmployees={E} schedule={schedule} setSchedule={SC} shifts={shifts}/>,
    Attendance:    <AttendancePage employees={employees} schedule={schedule} shifts={shifts} attendance={attendance} setAttendance={AT}/>,
    Queue:         <QueuePage shifts={shifts} queueLog={queueLog} setQueueLog={QL} setHeatmap={HM}/>,
    "Daily Tasks": <DailyTasksPage employees={employees} setEmployees={E} schedule={schedule} setSchedule={SC} shifts={shifts} auditLog={auditLog} setAuditLog={AL} session={session}/>,
    "Live Floor":  <LiveFloorPage employees={employees} schedule={schedule} shifts={shifts} attendance={attendance} setAttendance={AT}/>,
    "Heat Map":    <HeatMapPage queueLog={queueLog}/>,
    "Audit Log":   <AuditLogPage auditLog={auditLog} session={session}/>,
    Notes:         <NotesPage notes={notes} setNotes={canEdit?setNotes:noop}/>,
    Shifts:        <ShiftsPage shifts={shifts} setShifts={SH}/>,
    Performance:   <PerformancePage employees={employees} schedule={schedule} shifts={shifts} performance={performance} setPerformance={PF}/>,
    Reports:       <ReportsPage employees={employees} schedule={schedule} shifts={shifts} attendance={attendance} performance={performance} heatmap={heatmap} kg={{}} queueLog={queueLog}/>,
  };

  return (
    <div style={{ minHeight:"100vh", background:"#EFF3F8", fontFamily:"'IBM Plex Sans','Segoe UI',sans-serif" }}>
      <div style={{ background:"#0F2744", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(0,0,0,0.25)" }}>
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 0", overflowX:"auto" }}>
            <div style={{ color:"#fff", fontWeight:800, fontSize:15, whiteSpace:"nowrap", marginRight:12,
              paddingRight:12, borderRight:"1px solid rgba(255,255,255,0.15)",
              display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
              🎯 CS Ops
              <span style={{ fontSize:10, background:"#10B981", color:"#fff", borderRadius:10, padding:"2px 7px", fontWeight:600 }}>💾</span>
            </div>
            {PAGES.map(p => (
              <button key={p} onClick={()=>navigateLogged(p)}
                style={{ background: page===p ? "#2563EB" : "rgba(255,255,255,0.1)",
                  color:"#fff", border:"none", borderRadius:6, padding:"7px 13px",
                  fontSize:12, cursor:"pointer", fontWeight:600, whiteSpace:"nowrap", transition:"background 0.15s" }}>
                {p}
              </button>
            ))}
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
              <div style={{ background: roleColor+"30", border:`1px solid ${roleColor}60`,
                borderRadius:20, padding:"5px 12px", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:14 }}>{ROLE_ICONS[currentRole]}</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:800, color:roleColor, lineHeight:1.2 }}>{currentName}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", lineHeight:1.2 }}>
                    {currentRole}{!canEdit && " · View Only"}
                  </div>
                </div>
              </div>
              <button onClick={logout}
                style={{ background:"rgba(239,68,68,0.15)", color:"#FCA5A5", border:"1px solid rgba(239,68,68,0.3)",
                  borderRadius:6, padding:"5px 10px", fontSize:11, cursor:"pointer", fontWeight:600, whiteSpace:"nowrap" }}>
                Sign Out
              </button>
              {canResetPasswords(currentRole, currentName) && (
                <button onClick={()=>setShowResetPw(true)}
                  style={{ background:"rgba(245,158,11,0.15)", color:"#FCD34D", border:"1px solid rgba(245,158,11,0.3)",
                    borderRadius:6, padding:"5px 10px", fontSize:11, cursor:"pointer", fontWeight:600, whiteSpace:"nowrap" }}>
                  🔑
                </button>
              )}
              <button onClick={()=>{ if(!window.confirm("Reset ALL local data? (Supabase data stays safe)")) return;
                ["employees","shifts","schedule","attendance","performance","heatmap","queueLog","session","auditLog","notes","passwords"]
                  .forEach(k=>localStorage.removeItem("csops_"+k));
                localStorage.removeItem("csops_lastPage");
                window.location.reload(); }}
                style={{ background:"rgba(100,116,139,0.2)", color:"#94A3B8", border:"1px solid rgba(100,116,139,0.3)",
                  borderRadius:6, padding:"5px 10px", fontSize:11, cursor:"pointer", fontWeight:600 }}>
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"20px 16px" }}>
        <div style={{ marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:800, color:"#0F2744", margin:0 }}>{page}</h1>
            <div style={{ fontSize:12, color:"#94A3B8", marginTop:2 }}>
              {new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            </div>
          </div>
          <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:20, padding:"6px 14px",
            display:"flex", alignItems:"center", gap:8, fontSize:12, color:"#475569" }}>
            <span>{ROLE_ICONS[currentRole]}</span>
            <span>Active: <strong style={{ color:roleColor }}>{currentName}</strong></span>
            <span style={{ color:"#CBD5E1" }}>·</span>
            <span style={{ color:"#94A3B8" }}>{new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</span>
          </div>
        </div>
        {!canEdit && <ReadOnlyBanner userName={currentName}/>}
        {pageComponents[page]}
      </div>
      {showResetPw && (
        <PasswordResetModal employees={employees} session={session} onClose={()=>setShowResetPw(false)}/>
      )}
    </div>
  );
}
