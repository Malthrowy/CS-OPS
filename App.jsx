import { useState, useMemo, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const TASK_LIST = ["TGA","Social Group","KSA OT","GCC T2 Cases","KWT T2 Cases","KSA SOME Cases","KWT SOME Cases","GCC SOME Cases","180","OSLO","Keemart Online","Survey","Failed Refund Sheet"];
const TASK_COLORS = ["#6366F1","#0EA5E9","#F59E0B","#10B981","#EF4444","#8B5CF6","#EC4899","#14B8A6","#F97316","#06B6D4","#84CC16","#A855F7","#E11D48"];
const STATUS_OPTIONS = ["Present","Absent","Late","Early Leave","Day Off"];
const KG_TOPICS = ["Product Knowledge","Policy Understanding","System Navigation","Communication Skills","Escalation Handling","Refund Process","Technical Troubleshooting","SOP Compliance"];
const PAGES = ["Schedule","Attendance","Performance","Heat Map","KG Analysis","Queue","Roster","Shifts","Reports"];

// ─── STYLE HELPERS ────────────────────────────────────────────────────────────
const I = (extra={}) => ({ background:"#fff", border:"1px solid #CBD5E1", borderRadius:6, padding:"6px 10px", fontSize:13, color:"#1E293B", outline:"none", width:"100%", boxSizing:"border-box", ...extra });
const CRD = (extra={}) => ({ background:"#fff", borderRadius:10, padding:"16px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.08)", ...extra });
const SBR = (extra={}) => ({ background:"#F1F5F9", borderRadius:8, padding:"10px 16px", marginBottom:12, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", ...extra });
const PBT = (color="#2563EB", extra={}) => ({ background:color, color:"#fff", border:"none", borderRadius:6, padding:"7px 14px", fontSize:13, cursor:"pointer", fontWeight:600, ...extra });
const LBL = { fontSize:12, fontWeight:600, color:"#64748B", marginBottom:4, display:"block" };

// ─── DEFAULT DATA ─────────────────────────────────────────────────────────────
const DEFAULT_SHIFTS = [
  { id:"s1", label:"Morning", start:"08:00", end:"16:00", color:"#0EA5E9" },
  { id:"s2", label:"Afternoon", start:"12:00", end:"20:00", color:"#10B981" },
  { id:"s3", label:"Evening", start:"16:00", end:"00:00", color:"#F59E0B" },
  { id:"s4", label:"Night", start:"00:00", end:"08:00", color:"#8B5CF6" },
  { id:"s5", label:"Split A", start:"09:00", end:"17:00", color:"#EF4444" },
  { id:"s6", label:"Split B", start:"13:00", end:"21:00", color:"#EC4899" },
  { id:"s7", label:"Late Night", start:"20:00", end:"04:00", color:"#06B6D4" },
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
  const [showAdd, setShowAdd] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [newEmp, setNewEmp] = useState({ name:"", tasks:[], role:"Agent" });
  const [showImport, setShowImport] = useState(false);
  const [importPreview, setImportPreview] = useState([]);
  const fileRef = useRef();
  const today = new Date().getDay();

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

  function handleFile(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const XLSX = window.XLSX;
        const wb = XLSX.read(ev.target.result, { type:"array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header:1 }).filter(r=>r[0]);
        setImportPreview(rows.map(r => ({ name:r[0]||"", tasks:(r[1]||"").split("|").map(s=>s.trim()).filter(Boolean), role:r[2]||"Agent" })));
        setShowImport(true);
      } catch(err) { alert("Error reading file"); }
    };
    reader.readAsArrayBuffer(file);
  }

  function confirmImport() {
    importPreview.forEach(emp => {
      const id = "e"+Date.now()+Math.random();
      setEmployees(prev => [...prev, { id, ...emp }]);
      setSchedule(prev => ({ ...prev, [id]: { Sunday:"OFF", Monday:"OFF", Tuesday:"OFF", Wednesday:"OFF", Thursday:"OFF", Friday:"OFF", Saturday:"OFF" } }));
    });
    setShowImport(false);
    setImportPreview([]);
  }

  // Week preview: for each day, group employees by shift
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
        <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{display:"none"}} onChange={handleFile}/>
      </div>

      {/* Schedule Table */}
      <div style={{ ...CRD(), overflowX:"auto", marginBottom:20 }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#F8FAFC" }}>
              <th style={{ padding:"10px 12px", textAlign:"left", fontWeight:700, color:"#0F2744", borderBottom:"2px solid #E2E8F0", minWidth:180 }}>Employee</th>
              {DAYS.map((day,di) => (
                <th key={day} style={{ padding:"10px 8px", textAlign:"center", fontWeight:700, color: di===today ? "#2563EB" : "#0F2744",
                  borderBottom:"2px solid #E2E8F0", background: di===today ? "#EFF6FF" : "transparent", minWidth:100 }}>
                  {day.slice(0,3)}{di===today && <span style={{ display:"block", fontSize:10, color:"#2563EB" }}>TODAY</span>}
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
                        style={{ ...I(), padding:"4px 6px", fontSize:12, border:`2px solid ${sh?sh.color:"#CBD5E1"}`,
                          background: sh ? sh.color+"18" : "#fff", color: sh ? sh.color : "#64748B", fontWeight:600, cursor:"pointer" }}>
                        <option value="OFF">Day Off</option>
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
            {Object.keys(groups).length===0 ? <div style={{ fontSize:11, color:"#94A3B8" }}>All Off</div> :
              Object.entries(groups).map(([sid,names]) => {
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
            {["Agent","Shift Leader","Team Lead","SME"].map(r=><option key={r}>{r}</option>)}
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
            {["Agent","Shift Leader","Team Lead","SME"].map(r=><option key={r}>{r}</option>)}
          </select>
          <label style={LBL}>Tasks</label>
          <div style={{ marginBottom:16 }}><TaskPicker selected={editEmp.tasks} onChange={tasks=>setEditEmp(p=>({...p,tasks}))}/></div>
          <button style={PBT("#2563EB",{width:"100%"})} onClick={updateEmployee}>Save Changes</button>
        </Modal>
      )}

      {/* Import Preview Modal */}
      {showImport && (
        <Modal title="Import Preview" onClose={()=>setShowImport(false)} width={600}>
          <div style={{ marginBottom:12, fontSize:13, color:"#475569" }}>{importPreview.length} employees found. Confirm import?</div>
          <div style={{ maxHeight:300, overflow:"auto", marginBottom:16 }}>
            {importPreview.map((emp,i) => (
              <div key={i} style={{ padding:"8px 12px", background:"#F8FAFC", borderRadius:6, marginBottom:6 }}>
                <div style={{ fontWeight:600 }}>{emp.name} <span style={{ fontSize:12, color:"#94A3B8" }}>({emp.role})</span></div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:4 }}>
                  {emp.tasks.map(t=><span key={t} style={{ background:taskColor(t), color:"#fff", borderRadius:10, padding:"2px 8px", fontSize:11 }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button style={PBT("#10B981",{flex:1})} onClick={confirmImport}>✅ Confirm Import</button>
            <button style={PBT("#EF4444",{flex:1})} onClick={()=>setShowImport(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ATTENDANCE PAGE ──────────────────────────────────────────────────────────
function AttendancePage({ employees, schedule, shifts, attendance, setAttendance }) {
  const [date, setDate] = useState(todayStr());
  const [activeShift, setActiveShift] = useState(shifts[0]?.id||"");
  const dayName = DAYS[new Date(date+"T12:00:00").getDay()];

  const shiftEmployees = useMemo(() => {
    return employees.filter(emp => (schedule[emp.id]||{})[dayName] === activeShift);
  }, [employees, schedule, activeShift, dayName]);

  function getAtt(empId) {
    return ((attendance[date]||{})[empId]) || { status:"Present", checkIn:"", checkOut:"", lateMin:0, earlyMin:0, note:"" };
  }

  function setAtt(empId, field, val) {
    setAttendance(prev => {
      const dayData = { ...(prev[date]||{}) };
      const empData = { ...getAtt(empId), [field]: val };
      
      // Auto-calc late
      if (field==="checkIn" && val) {
        const sh = shifts.find(s=>s.id===activeShift);
        if (sh) {
          const late = calcLateMin(sh.start, val);
          empData.lateMin = Math.max(0, late);
          if (late >= 7) empData.status = "Late";
          else if (empData.status==="Late") empData.status = "Present";
        }
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

  // KPIs
  const allDayEmps = employees.filter(emp => (schedule[emp.id]||{})[dayName] !== "OFF");
  const allAtt = allDayEmps.map(e => getAtt(e.id));
  const kpis = {
    working: allDayEmps.length,
    present: allAtt.filter(a=>a.status==="Present").length,
    absent: allAtt.filter(a=>a.status==="Absent").length,
    late: allAtt.filter(a=>a.status==="Late").length,
    early: allAtt.filter(a=>a.status==="Early Leave").length,
    totalLate: allAtt.reduce((s,a)=>s+(a.lateMin||0),0)
  };

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>📋 Attendance Log</span>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...I(), width:150 }}/>
        <span style={{ fontSize:12, color:"#94A3B8" }}>Auto-calc late from check-in · 🔴 = ≥7 min late</span>
      </div>

      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10, marginBottom:16 }}>
        {[["Working",kpis.working,"#2563EB"],["Present",kpis.present,"#10B981"],["Absent",kpis.absent,"#EF4444"],
          ["Late",kpis.late,"#F59E0B"],["Early Leave",kpis.early,"#8B5CF6"],["Late Time",kpis.totalLate+"m","#EC4899"]].map(([l,v,c])=>(
          <div key={l} style={{ ...CRD({ padding:"12px 16px" }), borderTop:`3px solid ${c}` }}>
            <div style={{ fontSize:11, color:"#64748B", fontWeight:600 }}>{l}</div>
            <div style={{ fontSize:24, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Shift Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
        {shifts.map(sh => (
          <button key={sh.id} onClick={()=>setActiveShift(sh.id)}
            style={{ border:`2px solid ${sh.color}`, borderRadius:20, padding:"5px 14px", fontSize:12, cursor:"pointer", fontWeight:600,
              background: activeShift===sh.id ? sh.color : "transparent", color: activeShift===sh.id ? "#fff" : sh.color }}>
            {sh.label} {sh.start}
          </button>
        ))}
      </div>

      {/* Bulk Buttons */}
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <button style={PBT("#10B981")} onClick={()=>bulkSet("Present")}>✅ All Present</button>
        <button style={PBT("#EF4444")} onClick={()=>bulkSet("Absent")}>🔴 All Absent</button>
        <span style={{ fontSize:12, color:"#94A3B8", alignSelf:"center" }}>{shiftEmployees.length} employees on this shift for {dayName}</span>
      </div>

      {/* Table */}
      <div style={{ ...CRD(), overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:"#F8FAFC" }}>
              {["#","Employee","Status","Check-in","Check-out","Late","Early Leave (min)","Notes"].map(h=>(
                <th key={h} style={{ padding:"10px 8px", textAlign:"left", fontWeight:700, color:"#0F2744", borderBottom:"2px solid #E2E8F0", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shiftEmployees.map((emp,ri) => {
              const att = getAtt(emp.id);
              const isLate = att.lateMin >= 7;
              const isSlightLate = att.lateMin > 0 && att.lateMin < 7;
              return (
                <tr key={emp.id} style={{ background: ri%2===0?"#fff":"#F8FAFC" }}>
                  <td style={{ padding:"8px", color:"#94A3B8", fontWeight:600 }}>{ri+1}</td>
                  <td style={{ padding:"8px", fontWeight:600, color:"#1E293B" }}>{emp.name}</td>
                  <td style={{ padding:"8px" }}>
                    <select value={att.status} onChange={e=>setAtt(emp.id,"status",e.target.value)}
                      style={{ ...I(), width:120, border:`1.5px solid ${att.status==="Present"?"#10B981":att.status==="Absent"?"#EF4444":att.status==="Late"?"#F59E0B":"#8B5CF6"}` }}>
                      {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding:"8px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <input type="time" value={att.checkIn||""} onChange={e=>setAtt(emp.id,"checkIn",e.target.value)}
                        style={{ ...I({ width:110, border: isLate?"2px solid #EF4444": isSlightLate?"2px solid #F59E0B":"1px solid #CBD5E1" })}}/>
                      {isLate && <span title={`Late ${att.lateMin}m`}>🔴</span>}
                      {isSlightLate && <span title={`${att.lateMin}m`}>🟡</span>}
                    </div>
                    {(isLate||isSlightLate) && att.lateMin>0 && <div style={{ fontSize:11, color: isLate?"#EF4444":"#F59E0B", fontWeight:700 }}>{isLate?"🔴":""} {att.lateMin}m</div>}
                  </td>
                  <td style={{ padding:"8px" }}>
                    <input type="time" value={att.checkOut||""} onChange={e=>setAtt(emp.id,"checkOut",e.target.value)} style={{ ...I({ width:110 })}}/>
                  </td>
                  <td style={{ padding:"8px", color: att.lateMin>=7?"#EF4444":"#94A3B8", fontWeight:600 }}>
                    {att.lateMin>0 ? att.lateMin+"m" : "—"}
                  </td>
                  <td style={{ padding:"8px" }}>
                    <input type="number" value={att.earlyMin||""} onChange={e=>setAtt(emp.id,"earlyMin",Number(e.target.value))} style={{ ...I({ width:70 })}} placeholder="0"/>
                  </td>
                  <td style={{ padding:"8px" }}>
                    <input value={att.note||""} onChange={e=>setAtt(emp.id,"note",e.target.value)} style={{ ...I({ width:140 })}} placeholder="Note..."/>
                  </td>
                </tr>
              );
            })}
            {shiftEmployees.length===0 && (
              <tr><td colSpan={8} style={{ padding:24, textAlign:"center", color:"#94A3B8" }}>No employees scheduled for this shift on {dayName}</td></tr>
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

  const dayEmps = employees.filter(emp => (schedule[emp.id]||{})[dayName] !== "OFF");

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
  const totalReopened = dayEmps.reduce((s,e)=>s+(getPerf(e.id).reopened||0),0);
  const totalEsc = dayEmps.reduce((s,e)=>s+(getPerf(e.id).escalations||0),0);
  const fcr = totalClosed>0 ? Math.round((1 - totalReopened/totalClosed)*100) : 0;
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
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        {[["Total Closed",totalClosed,"#10B981"],["Re-opened",totalReopened,"#EF4444"],["FCR Rate",fcr+"%","#2563EB"],["Escalations",totalEsc,"#F59E0B"]].map(([l,v,c])=>(
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
              {["Rank","Employee","Tasks","Shift","Closed","Re-opened","Escalations",...(showQuality?["Quality %"]:[])]
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
                    <input type="number" min="0" value={p.reopened||""} onChange={e=>setPerf(emp.id,"reopened",Number(e.target.value))}
                      style={{ ...I({ width:70, border: p.reopened>0?"2px solid #EF4444":"1px solid #CBD5E1" })}} placeholder="0"/>
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

// ─── HEAT MAP PAGE ────────────────────────────────────────────────────────────
function HeatMapPage({ heatmap, setHeatmap }) {
  const [date, setDate] = useState(todayStr());
  const hours = Array.from({length:24},(_,i)=>pad(i)+":00");

  function getCount(h) { return ((heatmap[date]||{})[h])||0; }
  function setCount(h,v) {
    setHeatmap(prev => ({...prev, [date]: {...(prev[date]||{}), [h]: Number(v)||0}}));
  }

  const counts = hours.map(h=>getCount(h));
  const maxCount = Math.max(...counts,1);
  const total = counts.reduce((a,b)=>a+b,0);
  const peakHour = hours[counts.indexOf(Math.max(...counts))];
  const sortedByCount = [...hours].sort((a,b)=>getCount(a)-getCount(b));
  const breakWindows = sortedByCount.slice(0,3);

  function cellBg(count) {
    if (count===0) return "#F1F5F9";
    const pct = count/maxCount;
    if (pct>0.8) return "#FEE2E2";
    if (pct>0.5) return "#FEF9C3";
    if (pct>0.2) return "#DCFCE7";
    return "#F0FDF4";
  }
  function cellBorder(count) {
    if (count===0) return "#E2E8F0";
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
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
        <div style={{ ...CRD(), borderTop:"3px solid #EF4444" }}>
          <div style={LBL}>Peak Hour</div>
          <div style={{ fontSize:22, fontWeight:800, color:"#EF4444" }}>{peakHour}</div>
          <div style={{ fontSize:12, color:"#94A3B8" }}>{getCount(peakHour)} cases</div>
        </div>
        <div style={{ ...CRD(), borderTop:"3px solid #2563EB" }}>
          <div style={LBL}>Total Inflow</div>
          <div style={{ fontSize:22, fontWeight:800, color:"#2563EB" }}>{total}</div>
          <div style={{ fontSize:12, color:"#94A3B8" }}>across 24 hours</div>
        </div>
        <div style={{ ...CRD(), borderTop:"3px solid #10B981" }}>
          <div style={LBL}>Recommended Breaks</div>
          <div style={{ fontSize:16, fontWeight:700, color:"#10B981" }}>{breakWindows.join(", ")}</div>
          <div style={{ fontSize:12, color:"#94A3B8" }}>lowest activity windows</div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ ...CRD(), padding:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:8 }}>
          {hours.map(h => {
            const count = getCount(h);
            return (
              <div key={h} style={{ background:cellBg(count), border:`1.5px solid ${cellBorder(count)}`, borderRadius:8, padding:"10px 8px", textAlign:"center" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#64748B", marginBottom:4 }}>{h}</div>
                <input type="number" min="0" value={count||""} onChange={e=>setCount(h,e.target.value)}
                  style={{ ...I({ textAlign:"center", fontWeight:700, fontSize:16, border:"none", background:"transparent", padding:"0", width:"100%" })}} placeholder="0"/>
                {count>0 && <div style={{ fontSize:10, color:"#94A3B8" }}>{Math.round(count/maxCount*100)}%</div>}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display:"flex", gap:16, marginTop:16, flexWrap:"wrap" }}>
          {[["#FEE2E2","#EF4444",">80% max"],["#FEF9C3","#F59E0B",">50% max"],["#DCFCE7","#10B981",">20% max"],["#F1F5F9","#94A3B8","No data"]].map(([bg,border,label])=>(
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

// ─── KG ANALYSIS PAGE ────────────────────────────────────────────────────────
function KGPage({ kg, setKg }) {
  const [date, setDate] = useState(todayStr());
  const [form, setForm] = useState({ topic: KG_TOPICS[0], count:1, note:"" });

  const entries = kg[date]||[];
  const total = entries.reduce((s,e)=>s+(e.count||0),0);
  const sorted = [...entries].sort((a,b)=>(b.count||0)-(a.count||0));
  const topPct = total>0 && sorted[0] ? Math.round((sorted[0].count/total)*100) : 0;

  function addEntry() {
    if (!form.topic || !form.count) return;
    const id = "kg"+Date.now();
    setKg(prev => ({...prev, [date]: [...(prev[date]||[]), { id, ...form }]}));
    setForm(p=>({...p, count:1, note:""}));
  }
  function removeEntry(id) {
    setKg(prev => ({...prev, [date]: (prev[date]||[]).filter(e=>e.id!==id)}));
  }

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>🧠 Knowledge Gap Analysis</span>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...I(), width:150 }}/>
      </div>

      {/* Add Form */}
      <div style={{ ...CRD(), marginBottom:16 }}>
        <div style={{ fontWeight:700, marginBottom:12, color:"#0F2744" }}>Add Knowledge Gap</div>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 2fr auto", gap:10, alignItems:"end" }}>
          <div>
            <label style={LBL}>Topic</label>
            <select value={form.topic} onChange={e=>setForm(p=>({...p,topic:e.target.value}))} style={I()}>
              {KG_TOPICS.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={LBL}>Count</label>
            <input type="number" min="1" value={form.count} onChange={e=>setForm(p=>({...p,count:Number(e.target.value)}))} style={I()}/>
          </div>
          <div>
            <label style={LBL}>Observation / Root Cause</label>
            <input value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} style={I()} placeholder="Root cause..."/>
          </div>
          <button style={PBT("#8B5CF6",{ alignSelf:"stretch" })} onClick={addEntry}>+ Add</button>
        </div>
      </div>

      {/* Auto Recommendation */}
      {topPct>30 && sorted[0] && (
        <div style={{ background:"#FEF3C7", border:"1.5px solid #F59E0B", borderRadius:8, padding:"12px 16px", marginBottom:16, display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight:700, color:"#92400E" }}>SME Recommendation</div>
            <div style={{ fontSize:13, color:"#78350F" }}>
              <strong>{sorted[0].topic}</strong> represents {topPct}% of gaps. SOP update or Refresher Training recommended.
            </div>
          </div>
        </div>
      )}

      {/* Bar Chart */}
      <div style={CRD()}>
        <div style={{ fontWeight:700, marginBottom:12, color:"#0F2744" }}>Gap Distribution</div>
        {sorted.length===0 && <div style={{ color:"#94A3B8", textAlign:"center", padding:24 }}>No gaps recorded for this date.</div>}
        {sorted.map(entry => {
          const pct = total>0 ? Math.round(entry.count/total*100) : 0;
          return (
            <div key={entry.id} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <div style={{ fontWeight:600, fontSize:13, color:"#1E293B" }}>{entry.topic}</div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontSize:12, color:"#64748B" }}>{entry.note}</span>
                  <span style={{ fontWeight:700, fontSize:13, color:"#8B5CF6" }}>{entry.count} ({pct}%)</span>
                  <button onClick={()=>removeEntry(entry.id)} style={{ background:"none", border:"1px solid #EF4444", color:"#EF4444", borderRadius:4, padding:"1px 6px", cursor:"pointer", fontSize:11 }}>✕</button>
                </div>
              </div>
              <div style={{ background:"#F1F5F9", borderRadius:20, height:10, overflow:"hidden" }}>
                <div style={{ width:pct+"%", height:"100%", background:"linear-gradient(90deg,#7C3AED,#8B5CF6)", borderRadius:20, transition:"width 0.4s" }}/>
              </div>
            </div>
          );
        })}
        {total>0 && <div style={{ marginTop:12, fontSize:13, color:"#94A3B8", textAlign:"right" }}>Total reported: <strong style={{color:"#1E293B"}}>{total}</strong></div>}
      </div>
    </div>
  );
}

// ─── QUEUE PAGE ───────────────────────────────────────────────────────────────
function QueuePage({ shifts, queueLog, setQueueLog }) {
  const [date, setDate] = useState(todayStr());
  const [shiftId, setShiftId] = useState(shifts[0]?.id||"");

  const key = `${date}_${shiftId}`;
  const data = queueLog[key] || {};
  function setQ(field,val) { setQueueLog(prev=>({...prev,[key]:{...data,[field]:val}})); }

  // Calc resolved
  const ksaResolved = (Number(data.ksaBase||0)+Number(data.ksaInflow||0)) - Number(data.ksaCurr||0);
  const gccResolved = (Number(data.gccBase||0)+Number(data.gccInflow||0)) - Number(data.gccCurr||0);
  const ksaTotal = Number(data.ksaCurr||0);
  const status = ksaTotal>400 || Number(data.osloBase||0)>10 ? "🚨 CRITICAL" : ksaTotal>200 ? "⚠️ WARNING" : "✅ NORMAL";
  const statusColor = status.includes("CRITICAL")?"#EF4444":status.includes("WARNING")?"#F59E0B":"#10B981";

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>📊 Queue Data</span>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...I(), width:150 }}/>
        <select value={shiftId} onChange={e=>setShiftId(e.target.value)} style={{ ...I(), width:160 }}>
          {shifts.map(s=><option key={s.id} value={s.id}>{s.label} ({s.start})</option>)}
        </select>
        <div style={{ marginLeft:"auto", fontWeight:700, fontSize:14, color:statusColor, background:statusColor+"18", borderRadius:6, padding:"6px 14px" }}>{status}</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {/* KSA */}
        <div style={CRD()}>
          <div style={{ fontWeight:700, color:"#2563EB", marginBottom:12, fontSize:14 }}>🇸🇦 KSA Queue</div>
          {[["Outbound Baseline","ksaBase"],["SOME Cases Baseline","somBase"],["OSLO Baseline","osloBase"],["New Incoming","ksaInflow"],["Current Live","ksaCurr"]].map(([l,k])=>(
            <div key={k} style={{ display:"flex", alignItems:"center", marginBottom:8, gap:10 }}>
              <label style={{ ...LBL, width:180, marginBottom:0, flex:"none" }}>{l}</label>
              <input type="number" min="0" value={data[k]||""} onChange={e=>setQ(k,e.target.value)} style={{ ...I({ width:100 })}} placeholder="0"/>
            </div>
          ))}
          <div style={{ marginTop:8, padding:"8px 12px", background:"#EFF6FF", borderRadius:6, fontSize:13, color:"#2563EB", fontWeight:600 }}>
            KSA Resolved: <strong>{ksaResolved}</strong>
          </div>
        </div>

        {/* GCC */}
        <div style={CRD()}>
          <div style={{ fontWeight:700, color:"#10B981", marginBottom:12, fontSize:14 }}>🌍 GCC Queue</div>
          {[["Tier 2 Baseline","gccBase"],["SOME Cases Baseline","gccSomBase"],["New Incoming","gccInflow"],["Current Live","gccCurr"]].map(([l,k])=>(
            <div key={k} style={{ display:"flex", alignItems:"center", marginBottom:8, gap:10 }}>
              <label style={{ ...LBL, width:180, marginBottom:0, flex:"none" }}>{l}</label>
              <input type="number" min="0" value={data[k]||""} onChange={e=>setQ(k,e.target.value)} style={{ ...I({ width:100 })}} placeholder="0"/>
            </div>
          ))}
          <div style={{ marginTop:8, padding:"8px 12px", background:"#F0FDF4", borderRadius:6, fontSize:13, color:"#10B981", fontWeight:600 }}>
            GCC Resolved: <strong>{gccResolved}</strong>
          </div>
        </div>
      </div>

      {/* Times */}
      <div style={{ ...CRD(), marginTop:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:12 }}>
          <div>
            <label style={LBL}>Baseline Time</label>
            <input type="time" value={data.baseTime||""} onChange={e=>setQ("baseTime",e.target.value)} style={I()}/>
          </div>
          <div>
            <label style={LBL}>Update Time</label>
            <input type="time" value={data.updTime||""} onChange={e=>setQ("updTime",e.target.value)} style={I()}/>
          </div>
        </div>
        <label style={LBL}>SME Insights (Problem → Action → Result)</label>
        <textarea value={data.insight||""} onChange={e=>setQ("insight",e.target.value)} rows={4}
          style={{ ...I(), resize:"vertical" }} placeholder="Problem → Action → Result"/>
      </div>
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
    // Add employee and immediately assign them to this shift on this day
    const defaultSched = { Sunday:"OFF", Monday:"OFF", Tuesday:"OFF", Wednesday:"OFF", Thursday:"OFF", Friday:"OFF", Saturday:"OFF" };
    defaultSched[dayName] = activeShift;
    setEmployees(prev => [...prev, { id, ...newEmp }]);
    setSchedule(prev => ({ ...prev, [id]: defaultSched }));
    setNewEmp({ name:"", tasks:[], role:"Agent" });
    setShowAdd(false);
  }

  function saveEdit() {
    setEmployees(prev => prev.map(e => e.id===editEmp.id ? editEmp : e));
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
          <select style={{ ...I(), marginBottom:12 }} value={newEmp.role} onChange={e=>setNewEmp(p=>({...p,role:e.target.value}))}>
            {["Agent","Shift Leader","Team Lead","SME"].map(r=><option key={r}>{r}</option>)}
          </select>
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
          <select style={{ ...I(), marginBottom:12 }} value={editEmp.role} onChange={e=>setEditEmp(p=>({...p,role:e.target.value}))}>
            {["Agent","Shift Leader","Team Lead","SME"].map(r=><option key={r}>{r}</option>)}
          </select>
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
  const [reportType, setReportType] = useState("daily");
  const [date, setDate] = useState(todayStr());
  const [month, setMonth] = useState(new Date().toISOString().slice(0,7));
  const [copied, setCopied] = useState(false);

  function getMonthStats(y,m) {
    const dates = monthDates(y,m);
    const stats = {};
    employees.forEach(emp => {
      stats[emp.id] = { abs:0,lateCount:0,lateMin:0,earlyCount:0,earlyMin:0,closed:0,reopened:0,escalations:0,qualitySum:0,qualityCount:0,workDays:0 };
    });
    dates.forEach(d => {
      const dayName = DAYS[new Date(d+"T12:00:00").getDay()];
      employees.forEach(emp => {
        const scheduled = (schedule[emp.id]||{})[dayName];
        if (!scheduled||scheduled==="OFF") return;
        const att = ((attendance[d]||{})[emp.id])||{status:"Present"};
        const perf = ((performance[d]||{})[emp.id])||{};
        const s=stats[emp.id];
        s.workDays++;
        if (att.status==="Absent") s.abs++;
        if (att.status==="Late"||att.lateMin>=7) { s.lateCount++; s.lateMin+=att.lateMin||0; }
        if (att.status==="Early Leave") { s.earlyCount++; s.earlyMin+=att.earlyMin||0; }
        s.closed += perf.closed||0;
        s.reopened += perf.reopened||0;
        s.escalations += perf.escalations||0;
        if (perf.quality) { s.qualitySum+=Number(perf.quality); s.qualityCount++; }
      });
    });
    return stats;
  }

  function getScorecard(stats) {
    return employees.map(emp => {
      const s = stats[emp.id];
      if (!s) return null;
      const attRate = s.workDays>0 ? Math.round(((s.workDays-s.abs)/s.workDays)*100) : 100;
      const fcrRate = s.closed>0 ? Math.round((1-s.reopened/s.closed)*100) : 80;
      const avgQ = s.qualityCount>0 ? Math.round(s.qualitySum/s.qualityCount) : 80;
      const productivity = s.closed>0 ? Math.min(100, Math.round(s.closed/Math.max(s.workDays,1)*10)) : 0;
      const score = Math.round(productivity*0.35 + attRate*0.30 + fcrRate*0.20 + avgQ*0.15);
      return { emp, s, attRate, fcrRate, avgQ, productivity, score };
    }).filter(Boolean);
  }

  function buildDailyReport() {
    const dayName = DAYS[new Date(date+"T12:00:00").getDay()];
    const dayEmps = employees.filter(e=>(schedule[e.id]||{})[dayName]!=="OFF");
    const attMap = attendance[date]||{};
    const perfMap = performance[date]||{};
    const hm = heatmap[date]||{};
    const kgArr = kg[date]||[];

    const present = dayEmps.filter(e=>(attMap[e.id]?.status||"Present")==="Present").length;
    const absent = dayEmps.filter(e=>attMap[e.id]?.status==="Absent");
    const late = dayEmps.filter(e=>attMap[e.id]?.status==="Late");
    const totalClosed = dayEmps.reduce((s,e)=>s+(perfMap[e.id]?.closed||0),0);
    const totalReopened = dayEmps.reduce((s,e)=>s+(perfMap[e.id]?.reopened||0),0);
    const fcr = totalClosed>0?Math.round((1-totalReopened/totalClosed)*100):0;
    const hCounts = Object.entries(hm).map(([h,c])=>({h,c})).sort((a,b)=>b.c-a.c);
    const peakH = hCounts[0];
    const perfSorted = [...dayEmps].sort((a,b)=>(perfMap[b.id]?.closed||0)-(perfMap[a.id]?.closed||0));
    const kgTotal = kgArr.reduce((s,e)=>s+(e.count||0),0);

    return `📊 DAILY OPERATIONS REPORT — ${date}
${"=".repeat(50)}

👥 STAFFING & ATTENDANCE
─────────────────────────
Scheduled: ${dayEmps.length} | Present: ${present} | Absent: ${absent.length} | Late: ${late.length}

Absent: ${absent.map(e=>e.name).join(", ")||"None"}
Late arrivals: ${late.map(e=>`${e.name} (${attMap[e.id]?.lateMin||0}m)`).join(", ")||"None"}

⚡ INDIVIDUAL PERFORMANCE
──────────────────────────
${perfSorted.map((e,i)=>{
  const p=perfMap[e.id]||{};
  const f=p.closed>0?Math.round((1-(p.reopened||0)/p.closed)*100):"N/A";
  return `${["🥇","🥈","🥉"][i]||`${i+1}.`} ${e.name}: ${p.closed||0} closed | ${p.reopened||0} reopened | FCR: ${f}% | Esc: ${p.escalations||0}`;
}).join("\n")}

Total Closed: ${totalClosed} | Reopened: ${totalReopened} | FCR: ${fcr}%

📊 QUEUE STATUS
────────────────
(See Queue Data page for full breakdown)

🌡️ HOURLY HEAT MAP
───────────────────
Peak Hour: ${peakH?`${peakH.h} (${peakH.c} cases)`:"N/A"}
${hCounts.slice(0,5).map(({h,c})=>`  ${h}: ${c} cases`).join("\n")||"No data"}

🧠 KNOWLEDGE GAPS
──────────────────
${kgArr.length>0 ? kgArr.sort((a,b)=>b.count-a.count).map(e=>`• ${e.topic}: ${e.count} (${kgTotal>0?Math.round(e.count/kgTotal*100):0}%)`).join("\n") : "No gaps recorded"}

📝 SME NOTES
─────────────
Problem → Action → Result

Generated: ${new Date().toLocaleString()}`;
  }

  function buildMonthlyReport() {
    const [y,m] = month.split("-").map(Number);
    const stats = getMonthStats(y,m-1);
    const scorecard = getScorecard(stats).sort((a,b)=>b.score-a.score);
    const monthStr = new Date(y,m-1,1).toLocaleString("default",{month:"long",year:"numeric"});
    const totalClosed = Object.values(stats).reduce((s,v)=>s+v.closed,0);
    const totalReopened = Object.values(stats).reduce((s,v)=>s+v.reopened,0);
    const totalAbsences = Object.values(stats).reduce((s,v)=>s+v.abs,0);
    const totalLateMin = Object.values(stats).reduce((s,v)=>s+v.lateMin,0);
    const fcr = totalClosed>0?Math.round((1-totalReopened/totalClosed)*100):0;
    const top3 = scorecard.slice(0,3);
    const bottom = scorecard.filter(s=>s.score<60);

    return `📅 MONTHLY OPERATIONS REPORT — ${monthStr}
${"=".repeat(60)}

📊 EXECUTIVE SUMMARY
─────────────────────
Total Closed: ${totalClosed}
Total Reopened: ${totalReopened}
Overall FCR: ${fcr}%
Total Absences: ${totalAbsences}
Total Late Time: ${totalLateMin} minutes

🏆 TOP PERFORMERS
──────────────────
${top3.map((s,i)=>`${["🥇","🥈","🥉"][i]} ${s.emp.name} — Score: ${s.score} | Closed: ${s.s.closed} | Att: ${s.attRate}% | FCR: ${s.fcrRate}%`).join("\n")}

⚠️ NEEDS ATTENTION
────────────────────
${bottom.length>0 ? bottom.map(s=>`• ${s.emp.name} — Score: ${s.score} | Abs: ${s.s.abs} | Late: ${s.s.lateCount}x`).join("\n") : "All employees performing well"}

📋 FULL ATTENDANCE AUDIT
─────────────────────────
${employees.map(e=>{const s=stats[e.id]; return `${e.name}: WorkDays=${s.workDays} | Abs=${s.abs} | Late=${s.lateCount}x (${s.lateMin}m) | Early=${s.earlyCount}x`;}).join("\n")}

⚡ PRODUCTIVITY TABLE
──────────────────────
${employees.map(e=>{const s=stats[e.id]; return `${e.name}: ${s.closed} closed | ${s.reopened} reopened | ${s.escalations} esc`;}).join("\n")}

🎯 BALANCED SCORECARD
──────────────────────
${scorecard.map(s=>`${s.emp.name}: Productivity=${s.productivity} | Att=${s.attRate}% | FCR=${s.fcrRate}% | Quality=${s.avgQ}% | SCORE=${s.score}/100 ${s.score>=80?"🟢":s.score>=60?"🟡":"🔴"}`).join("\n")}

Generated: ${new Date().toLocaleString()}`;
  }

  function getReportText() {
    if (reportType==="daily") return buildDailyReport();
    if (reportType==="monthly") return buildMonthlyReport();
    return "";
  }

  function copyReport() {
    navigator.clipboard.writeText(getReportText()).then(()=>{
      setCopied(true); setTimeout(()=>setCopied(false),2000);
    });
  }

  // Scorecard data for visual table
  const [y,m] = month.split("-").map(Number);
  const mStats = getMonthStats(y,m-1);
  const scoreData = getScorecard(mStats).sort((a,b)=>b.score-a.score);

  return (
    <div>
      <div style={SBR()}>
        <span style={{ fontWeight:700, fontSize:15, color:"#0F2744" }}>📑 Reports</span>
        <div style={{ display:"flex", gap:6 }}>
          {[["daily","Daily"],["monthly","Monthly"],["scorecard","Scorecard"]].map(([k,l])=>(
            <button key={k} onClick={()=>setReportType(k)} style={{ border:`2px solid #2563EB`, borderRadius:20, padding:"5px 14px", fontSize:12, cursor:"pointer", fontWeight:600,
              background:reportType===k?"#2563EB":"transparent", color:reportType===k?"#fff":"#2563EB" }}>{l}</button>
          ))}
        </div>
        {reportType==="daily" && <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ ...I(), width:150 }}/>}
        {(reportType==="monthly"||reportType==="scorecard") && <input type="month" value={month} onChange={e=>setMonth(e.target.value)} style={{ ...I(), width:150 }}/>}
        {reportType!=="scorecard" && (
          <button style={PBT(copied?"#10B981":"#2563EB")} onClick={copyReport}>{copied?"✅ Copied!":"📋 Copy Report"}</button>
        )}
      </div>

      {/* Scorecard Visual Table */}
      {reportType==="scorecard" && (
        <div>
          <div style={{ ...CRD(), overflowX:"auto", marginBottom:16 }}>
            <div style={{ fontWeight:700, color:"#0F2744", marginBottom:12 }}>🎯 Balanced Scorecard — Weights: Productivity 35% · Attendance 30% · FCR 20% · Quality 15%</div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:"#F8FAFC" }}>
                  {["Rank","Employee","Closed","Attendance %","FCR %","Quality %","Score"].map(h=>(
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
                      <td style={{ padding:"10px 12px", fontWeight:700 }}>{s.emp.name}</td>
                      <td style={{ padding:"10px 12px" }}>{s.s.closed}</td>
                      <td style={{ padding:"10px 12px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ background:"#E2E8F0", borderRadius:10, height:8, width:80, overflow:"hidden" }}>
                            <div style={{ width:s.attRate+"%", height:"100%", background: s.attRate>=80?"#10B981":"#F59E0B", borderRadius:10 }}/>
                          </div>
                          {s.attRate}%
                        </div>
                      </td>
                      <td style={{ padding:"10px 12px" }}>{s.fcrRate}%</td>
                      <td style={{ padding:"10px 12px" }}>{s.avgQ}%</td>
                      <td style={{ padding:"10px 12px" }}>
                        <span style={{ background:scoreColor+"20", color:scoreColor, border:`1.5px solid ${scoreColor}`, borderRadius:20, padding:"4px 14px", fontWeight:700, fontSize:14 }}>{s.score}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Strategy Guide */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
            {[
              { icon:"📅", title:"Daily Report", desc:"Staffing, attendance, performance, queue status, heat map, knowledge gaps, SME notes." },
              { icon:"📆", title:"Weekly Report", desc:"Trend analysis, attendance summary, top performers, recurring issues, action items." },
              { icon:"📊", title:"Monthly Report", desc:"Executive summary, full audit, balanced scorecard, top performers, needs attention." },
              { icon:"🎯", title:"Quarterly Report", desc:"Strategic review, team development, process improvements, targets vs actuals." }
            ].map(c=>(
              <div key={c.title} style={{ ...CRD(), borderTop:"3px solid #2563EB" }}>
                <div style={{ fontSize:24, marginBottom:6 }}>{c.icon}</div>
                <div style={{ fontWeight:700, color:"#0F2744", marginBottom:6 }}>{c.title}</div>
                <div style={{ fontSize:12, color:"#64748B" }}>{c.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background:"linear-gradient(135deg,#FEF3C7,#FDE68A)", border:"2px solid #F59E0B", borderRadius:10, padding:"14px 20px", display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ fontSize:24 }}>✨</span>
            <div>
              <div style={{ fontWeight:800, color:"#92400E", fontSize:14 }}>The Golden Formula</div>
              <div style={{ fontWeight:700, color:"#78350F", fontSize:16 }}>Problem → Action → Result</div>
              <div style={{ fontSize:12, color:"#92400E", marginTop:2 }}>Always structure your SME insights and reports using this framework for maximum clarity.</div>
            </div>
          </div>
        </div>
      )}

      {/* Report Text */}
      {reportType!=="scorecard" && (
        <div style={{ ...CRD(), fontFamily:"monospace", fontSize:12, whiteSpace:"pre-wrap", lineHeight:1.7, color:"#1E293B", maxHeight:600, overflow:"auto", background:"#0F172A", borderRadius:10, padding:20, color:"#E2E8F0" }}>
          {getReportText()}
        </div>
      )}
    </div>
  );
}


// ─── DATA VERSION — increment this whenever defaults change ───────────────────
const DATA_VERSION = "v3"; // bump this to force-reset all clients

// ─── LOCALSTORAGE HOOK ────────────────────────────────────────────────────────
// On first load, if stored version doesn't match DATA_VERSION, wipe everything.
(function migrateStorage() {
  try {
    const stored = localStorage.getItem("csops_version");
    if (stored !== DATA_VERSION) {
      const keys = ["employees","shifts","schedule","attendance","performance",
                    "heatmap","kg","queueLog","currentRole"];
      keys.forEach(k => localStorage.removeItem("csops_" + k));
      localStorage.setItem("csops_version", DATA_VERSION);
    }
  } catch {}
})();

function usePersist(key, defaultVal) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem("csops_" + key);
      return raw ? JSON.parse(raw) : (typeof defaultVal === "function" ? defaultVal() : defaultVal);
    } catch { return typeof defaultVal === "function" ? defaultVal() : defaultVal; }
  });
  const set = useCallback((val) => {
    setState(prev => {
      const next = typeof val === "function" ? val(prev) : val;
      try { localStorage.setItem("csops_" + key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [state, set];
}

// ─── ROLE CONFIG ──────────────────────────────────────────────────────────────
// All roles see ALL 9 pages. Only Agent is read-only.
const ROLE_PASSWORDS = {
  "Team Lead":    "CC@123456",
  "Shift Leader": "CC@123456",
  "SME":          "CC@123456",
  "Agent":        "CC@123456",
};
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
function LoginScreen({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState("Team Lead");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  function tryLogin() {
    if (password === ROLE_PASSWORDS[selectedRole]) {
      setError(""); onLogin(selectedRole);
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  }

  const roleColor = ROLE_COLORS[selectedRole];

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0F2744 0%,#1E3A5F 50%,#0F2744 100%)",
      display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'IBM Plex Sans','Segoe UI',sans-serif", padding:16 }}>
      <div style={{ width:440, background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.4)" }}>

        {/* Header */}
        <div style={{ background:"#0F2744", padding:"32px 32px 28px", textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🎯</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:22, letterSpacing:"-0.5px" }}>CS Operations</div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginTop:4 }}>Management System</div>
          <div style={{ marginTop:10, display:"inline-flex", alignItems:"center",
            background:"#10B981", borderRadius:20, padding:"3px 12px" }}>
            <span style={{ fontSize:10, color:"#fff", fontWeight:700 }}>💾 Auto-saved · Secure Login</span>
          </div>
        </div>

        <div style={{ padding:"28px 32px 32px" }}>
          {/* Role picker — 2×2 grid */}
          <label style={LBL}>Select Your Role</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
            {Object.keys(ROLE_PASSWORDS).map(role => (
              <button key={role} onClick={()=>{ setSelectedRole(role); setError(""); setPassword(""); }}
                style={{ border:`2px solid ${selectedRole===role ? ROLE_COLORS[role] : "#E2E8F0"}`,
                  borderRadius:10, padding:"12px 10px", cursor:"pointer", textAlign:"left", transition:"all 0.15s",
                  background: selectedRole===role ? ROLE_COLORS[role]+"12" : "#fff", display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:22 }}>{ROLE_ICONS[role]}</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color: selectedRole===role ? ROLE_COLORS[role] : "#1E293B" }}>{role}</div>
                  <div style={{ fontSize:10, color:"#94A3B8", marginTop:1 }}>
                    {role==="Agent" ? "View only" : "Full access"}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Permission hint */}
          <div style={{ background: roleColor+"10", border:`1px solid ${roleColor}30`, borderRadius:8,
            padding:"10px 14px", marginBottom:18, fontSize:12 }}>
            <span style={{ fontWeight:700, color:roleColor }}>{ROLE_ICONS[selectedRole]} {selectedRole} — </span>
            <span style={{ color:"#475569" }}>{ROLE_DESC[selectedRole]}</span>
          </div>

          {/* Password */}
          <div style={{ marginBottom:16 }}>
            <label style={LBL}>Password</label>
            <div style={{ position:"relative" }}>
              <input type={showPw?"text":"password"} value={password}
                onChange={e=>{ setPassword(e.target.value); setError(""); }}
                onKeyDown={e=>e.key==="Enter"&&tryLogin()}
                style={{ ...I({ paddingRight:42, border: error?"2px solid #EF4444":"1px solid #CBD5E1" }) }}
                placeholder="CC@123456" autoFocus/>
              <button onClick={()=>setShowPw(p=>!p)}
                style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", cursor:"pointer", fontSize:15, color:"#94A3B8" }}>
                {showPw?"🙈":"👁️"}
              </button>
            </div>
            {error && <div style={{ color:"#EF4444", fontSize:12, marginTop:6, fontWeight:600 }}>⚠️ {error}</div>}
          </div>

          <button onClick={tryLogin}
            style={{ ...PBT(roleColor, { width:"100%", padding:"12px", fontSize:14, borderRadius:10 }) }}>
            {ROLE_ICONS[selectedRole]} Sign In as {selectedRole}
          </button>

          <div style={{ marginTop:14, textAlign:"center", fontSize:11, color:"#94A3B8" }}>
            Each device stores data independently · Data never leaves your browser
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LOCKED PAGE (unused now, kept for safety) ────────────────────────────────
function ReadOnlyBanner() {
  return (
    <div style={{ background:"#FEF9C3", border:"1.5px solid #F59E0B", borderRadius:8,
      padding:"10px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
      <span style={{ fontSize:18 }}>👁️</span>
      <div style={{ fontSize:13, color:"#78350F" }}>
        <strong>View Only Mode</strong> — You are logged in as <strong>Agent</strong>. You can browse all data but cannot make any changes.
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("Schedule");
  const [currentRole, setCurrentRole] = usePersist("currentRole", null);

  const [employees, setEmployees] = usePersist("employees", DEFAULT_EMPLOYEES);
  const [shifts, setShifts] = usePersist("shifts", DEFAULT_SHIFTS);
  const [schedule, setSchedule] = usePersist("schedule", () => buildDefaultSchedule(DEFAULT_EMPLOYEES));
  const [attendance, setAttendance] = usePersist("attendance", {});
  const [performance, setPerformance] = usePersist("performance", {});
  const [heatmap, setHeatmap] = usePersist("heatmap", {});
  const [kg, setKg] = usePersist("kg", {});
  const [queueLog, setQueueLog] = usePersist("queueLog", {});

  // Load SheetJS
  if (typeof window !== "undefined" && !window.XLSX) {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    document.head.appendChild(s);
  }

  // Not logged in → show login screen
  if (!currentRole) {
    return <LoginScreen onLogin={role => { setCurrentRole(role); setPage("Schedule"); }}/>;
  }

  const canEdit = ROLE_CAN_EDIT[currentRole];
  const roleColor = ROLE_COLORS[currentRole];

  // Guard: if Agent (read-only), replace setters with no-ops
  const noop = () => {};
  const E = canEdit ? setEmployees   : noop;
  const SH = canEdit ? setShifts     : noop;
  const SC = canEdit ? setSchedule   : noop;
  const AT = canEdit ? setAttendance : noop;
  const PF = canEdit ? setPerformance: noop;
  const HM = canEdit ? setHeatmap    : noop;
  const KG = canEdit ? setKg         : noop;
  const QL = canEdit ? setQueueLog   : noop;

  function logout() { setCurrentRole(null); setPage("Schedule"); }

  const pageComponents = {
    Schedule:      <SchedulePage employees={employees} setEmployees={E} schedule={schedule} setSchedule={SC} shifts={shifts}/>,
    Attendance:    <AttendancePage employees={employees} schedule={schedule} shifts={shifts} attendance={attendance} setAttendance={AT}/>,
    Performance:   <PerformancePage employees={employees} schedule={schedule} shifts={shifts} performance={performance} setPerformance={PF}/>,
    "Heat Map":    <HeatMapPage heatmap={heatmap} setHeatmap={HM}/>,
    "KG Analysis": <KGPage kg={kg} setKg={KG}/>,
    Queue:         <QueuePage shifts={shifts} queueLog={queueLog} setQueueLog={QL}/>,
    Roster:        <RosterPage employees={employees} setEmployees={E} schedule={schedule} setSchedule={SC} shifts={shifts}/>,
    Shifts:        <ShiftsPage shifts={shifts} setShifts={SH}/>,
    Reports:       <ReportsPage employees={employees} schedule={schedule} shifts={shifts} attendance={attendance} performance={performance} heatmap={heatmap} kg={kg} queueLog={queueLog}/>,
  };

  return (
    <div style={{ minHeight:"100vh", background:"#EFF3F8", fontFamily:"'IBM Plex Sans','Segoe UI',sans-serif" }}>
      {/* Header */}
      <div style={{ background:"#0F2744", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(0,0,0,0.25)" }}>
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 0", overflowX:"auto" }}>

            {/* Brand */}
            <div style={{ color:"#fff", fontWeight:800, fontSize:15, whiteSpace:"nowrap", marginRight:12,
              paddingRight:12, borderRight:"1px solid rgba(255,255,255,0.15)", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
              🎯 CS Ops
              <span style={{ fontSize:10, background:"#10B981", color:"#fff", borderRadius:10, padding:"2px 7px", fontWeight:600 }}>💾</span>
            </div>

            {/* Nav — ALL pages visible to everyone */}
            {PAGES.map(p => (
              <button key={p} onClick={()=>setPage(p)}
                style={{ background: page===p ? "#2563EB" : "rgba(255,255,255,0.1)",
                  color:"#fff", border:"none", borderRadius:6, padding:"7px 13px", fontSize:12,
                  cursor:"pointer", fontWeight:600, whiteSpace:"nowrap", transition:"background 0.15s" }}>
                {p}
              </button>
            ))}

            {/* Role badge + Sign Out + Reset */}
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
              <div style={{ background: roleColor+"30", border:`1px solid ${roleColor}60`,
                borderRadius:20, padding:"5px 12px", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:13 }}>{ROLE_ICONS[currentRole]}</span>
                <span style={{ fontSize:12, fontWeight:700, color: roleColor }}>{currentRole}</span>
                {!canEdit && <span style={{ fontSize:10, color:"#F59E0B", fontWeight:700 }}>· View Only</span>}
              </div>
              <button onClick={logout}
                style={{ background:"rgba(239,68,68,0.15)", color:"#FCA5A5", border:"1px solid rgba(239,68,68,0.3)",
                  borderRadius:6, padding:"5px 10px", fontSize:11, cursor:"pointer", fontWeight:600, whiteSpace:"nowrap" }}>
                Sign Out
              </button>
              <button onClick={()=>{ if(!window.confirm("Reset ALL data to defaults?")) return;
                ["employees","shifts","schedule","attendance","performance","heatmap","kg","queueLog","currentRole"]
                  .forEach(k=>localStorage.removeItem("csops_"+k));
                window.location.reload(); }}
                style={{ background:"rgba(100,116,139,0.2)", color:"#94A3B8", border:"1px solid rgba(100,116,139,0.3)",
                  borderRadius:6, padding:"5px 10px", fontSize:11, cursor:"pointer", fontWeight:600 }}>
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"20px 16px" }}>
        <div style={{ marginBottom:16 }}>
          <h1 style={{ fontSize:20, fontWeight:800, color:"#0F2744", margin:0 }}>{page}</h1>
          <div style={{ fontSize:12, color:"#94A3B8", marginTop:2 }}>
            {new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
          </div>
        </div>
        {!canEdit && <ReadOnlyBanner/>}
        {pageComponents[page]}
      </div>
    </div>
  );
}
