// TOOL 1: SCORECARD
// ============================================================
const T1_SECTIONS = [
  { id:1, name:'Functional Capabilities', criteria:[
    {name:'General ledger & chart of accounts',note:'Multi-level CoA, segment-based reporting',weight:5},
    {name:'Accounts payable & receivable',note:'Invoice processing, aging, payment runs',weight:5},
    {name:'Bank reconciliation & cash management',note:'Automated matching, multi-bank support',weight:4},
    {name:'Financial reporting & dashboards',note:'Real-time P&L, balance sheet, trial balance',weight:5},
    {name:'Budgeting & forecasting',note:'Budget entry, variance analysis, multi-scenario',weight:4},
    {name:'Project / job cost accounting',note:'Cost centers, project ledgers, labor allocation',weight:4},
    {name:'Payroll integration or native payroll',note:'Integration with ADP/Paychex or built-in payroll',weight:3},
    {name:'Purchasing / procurement module',note:'PO management, approval workflows, vendor portal',weight:3},
    {name:'Grant / fund accounting',note:'Fund tracking, grant reporting, restriction monitoring',weight:3},
  ]},
  { id:2, name:'Compliance & Regulatory', criteria:[
    {name:'DCAA-compliant timekeeping',note:'Labor distribution, supervisor approval, audit trail',weight:5,govcon:true},
    {name:'Indirect cost pool structure (FAR)',note:'Fringe, overhead, G&A pool separation',weight:5,govcon:true},
    {name:'Unallowable cost identification',note:'Cost coding to flag FAR 31 unallowable items',weight:4,govcon:true},
    {name:'2 CFR 200 / OMB compliance features',note:'Federal grant reporting, allowable cost tracking',weight:4,nonprofit:true},
    {name:'Audit trail & transaction history',note:'Immutable log of all financial entries',weight:5},
    {name:'User role-based security',note:'Segregation of duties, permission levels',weight:4},
    {name:'Multi-entity / fund reporting',note:'Intercompany eliminations, consolidated reporting',weight:3},
    {name:'Revenue recognition compliance (ASC 606)',note:'Milestone billing, deferred revenue, schedules',weight:3},
  ]},
  { id:3, name:'Implementation & Support', criteria:[
    {name:'Implementation methodology & timeline',note:"Vendor's standard go-live timeline and phases",weight:4},
    {name:'Data migration support & tools',note:'Templates, validation, conversion support',weight:4},
    {name:'Training resources (live + self-service)',note:'Role-based training, video library, help center',weight:3},
    {name:'Dedicated implementation project manager',note:'Named PM vs. team-based project delivery',weight:4},
    {name:'Post-go-live support model',note:'Hypercare period, SLA for production issues',weight:4},
    {name:'Customer reference availability',note:'Willingness to provide references in your industry/size',weight:3},
  ]},
  { id:4, name:'Vendor Stability & Fit', criteria:[
    {name:'Years in market & product maturity',note:'Track record and longevity of the specific product',weight:4},
    {name:'Customer base size and retention rate',note:'Indicator of long-term viability and satisfaction',weight:3},
    {name:'Financial health of the vendor',note:'Publicly disclosed or researchable stability signals',weight:4},
    {name:'Industry-specific experience (your sector)',note:'GovCon, nonprofit, or SMB customers similar to you',weight:5},
    {name:'Cultural / service model fit',note:'High-touch vs. self-service, SMB vs. enterprise focus',weight:3},
    {name:'Contract flexibility & exit terms',note:'Data portability, contract length, termination rights',weight:4},
  ]},
  { id:5, name:'Total Cost & Commercial Terms', criteria:[
    {name:'Year 1 total cost (license + implementation)',note:'All-in cost in the go-live year including services',weight:5},
    {name:'Year 2–3 subscription / maintenance cost',note:'Recurring annual cost after initial implementation',weight:5},
    {name:'Per-user pricing model transparency',note:'Clear, predictable user tier pricing',weight:3},
    {name:'Implementation cost estimate quality',note:'Itemized SOW vs. vague "starts at" estimates',weight:4},
    {name:'Hidden cost exposure (add-ons, modules)',note:'Transparency about what requires additional purchase',weight:4},
    {name:'Payment terms & contract structure',note:'Upfront vs. monthly, annual commitment flexibility',weight:3},
  ]},
];
const T1_SCORE_OPTS = [
  {value:'na',label:'— Not scored'},{value:'0',label:'0 — Does not meet'},{value:'1',label:'1 — Partially meets'},
  {value:'2',label:'2 — Meets requirement'},{value:'3',label:'3 — Exceeds'},{value:'4',label:'4 — Best in class'},
];

function t1Build() {
  const body = document.getElementById('t1-sections-body');
  T1_SECTIONS.forEach(sec => {
    const sh = document.createElement('div');
    sh.className = 'section-header';
    sh.innerHTML = `<div class="sh-left"><div class="sh-lbl">Section ${sec.id} of ${T1_SECTIONS.length}</div><div class="sh-ttl">${sec.name}</div></div>`;
    body.appendChild(sh);
    const tbl = document.createElement('table');
    tbl.className = 'criteria-table';
    tbl.innerHTML = `<thead><tr><th style="width:34%">Requirement</th><th style="width:8%">Wt</th><th class="vc" style="width:12%"><span class="t1v1-lbl">Vendor A</span></th><th class="vc" style="width:12%"><span class="t1v2-lbl">Vendor B</span></th><th class="vc" style="width:12%"><span class="t1v3-lbl">Vendor C</span></th><th class="vc" style="width:7%">Wt.A</th><th class="vc" style="width:7%">Wt.B</th><th class="vc" style="width:7%">Wt.C</th></tr></thead><tbody id="t1s${sec.id}-body"></tbody>`;
    body.appendChild(tbl);
    sec.criteria.forEach((c,ci) => {
      const row = document.createElement('tr');
      let badge = c.govcon ? ' <span style="font-size:10px;background:#e8f0fa;color:#3060a0;padding:1px 6px;border-radius:3px;">GovCon</span>' : c.nonprofit ? ' <span style="font-size:10px;background:var(--green-pale);color:var(--teal);padding:1px 6px;border-radius:3px;">Nonprofit</span>' : '';
      row.innerHTML = `<td><div class="row-name">${c.name}${badge}</div><div class="row-note">${c.note}</div></td><td><span class="wt-chip">${c.weight}</span></td>
        ${[1,2,3].map(v=>`<td class="score-cell"><select class="score-select" id="t1s${sec.id}c${ci}v${v}" onchange="t1OnChange(this,${sec.id},${ci},${v},${c.weight})">${T1_SCORE_OPTS.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></td>`).join('')}
        ${[1,2,3].map(v=>`<td class="weighted-score" id="t1ws${sec.id}c${ci}v${v}">—</td>`).join('')}`;
      document.getElementById(`t1s${sec.id}-body`).appendChild(row);
    });
    const st = document.createElement('div');
    st.className = 'section-total';
    st.innerHTML = `<span class="st-label">${sec.name} Totals</span><div class="st-scores">${[1,2,3].map(v=>`<div class="st-vendor"><div class="st-vname t1v${v}-lbl">Vendor ${['A','B','C'][v-1]}</div><div class="st-vscore" id="t1st${sec.id}v${v}">—</div></div>`).join('')}</div>`;
    body.appendChild(st);
  });
}
function t1OnChange(sel,secId,ci,v,w) {
  const val=sel.value; sel.className='score-select'+(val!='na'?` s${val}`:'');
  const ws=document.getElementById(`t1ws${secId}c${ci}v${v}`);
  if(val=='na'||val==''){ws.textContent='N/A';ws.style.color='var(--ink-soft)';}
  else{const s=parseInt(val)*w;ws.textContent=s;ws.style.color=parseInt(val)>=3?'var(--teal)':parseInt(val)<=1?'var(--signal)':'var(--text)';}
  t1UpdateSectionTotal(secId);
}
function t1UpdateSectionTotal(secId) {
  const sec=T1_SECTIONS.find(s=>s.id===secId);
  [1,2,3].forEach(v=>{
    let t=0; sec.criteria.forEach((_,ci)=>{ const val=document.getElementById(`t1s${secId}c${ci}v${v}`)?.value; if(val&&val!='na')t+=parseInt(val)*sec.criteria[ci].weight; });
    const el=document.getElementById(`t1st${secId}v${v}`); if(el)el.textContent=t;
  });
}
function t1UpdateVendorNames() {
  const n=[document.getElementById('t1v1name')?.value||'Vendor A',document.getElementById('t1v2name')?.value||'Vendor B',document.getElementById('t1v3name')?.value||'Vendor C'];
  document.querySelectorAll('.t1v1-lbl').forEach(e=>e.textContent=n[0]);
  document.querySelectorAll('.t1v2-lbl').forEach(e=>e.textContent=n[1]);
  document.querySelectorAll('.t1v3-lbl').forEach(e=>e.textContent=n[2]);
}
function t1Calculate() {
  const names=[document.getElementById('t1v1name')?.value||'Vendor A',document.getElementById('t1v2name')?.value||'Vendor B',document.getElementById('t1v3name')?.value||'Vendor C'];
  const totals=[0,0,0],maxP=[0,0,0];
  const secTotals=T1_SECTIONS.map(sec=>{
    const st=[0,0,0];
    sec.criteria.forEach((c,ci)=>[0,1,2].forEach(vi=>{
      const val=document.getElementById(`t1s${sec.id}c${ci}v${vi+1}`)?.value;
      if(val&&val!='na'){st[vi]+=parseInt(val)*c.weight;totals[vi]+=parseInt(val)*c.weight;maxP[vi]+=4*c.weight;}
    }));
    return st;
  });
  const maxScore=Math.max(...totals);
  const grid=document.getElementById('t1-results-grid'); grid.innerHTML='';
  [0,1,2].forEach(vi=>{
    const pct=maxP[vi]>0?Math.round(totals[vi]/maxP[vi]*100):0;
    const isTop=totals[vi]===maxScore&&maxScore>0;
    const card=document.createElement('div'); card.className='result-card'+(isTop?' top':'');
    card.innerHTML=`<div class="rc-label">${isTop?'★ TOP SCORER':'Vendor '+(vi+1)}</div><div class="rc-name">${names[vi]}</div><div class="rc-score">${totals[vi]}</div><div class="rc-max">of ${maxP[vi]} pts</div><div class="rc-bar-wrap"><div class="rc-bar" style="width:${pct}%"></div></div><div style="font-size:11px;color:var(--ink-soft);margin-top:5px;">${pct}% match</div>`;
    grid.appendChild(card);
  });
  const bb=document.getElementById('t1-breakdown-bars'); bb.innerHTML='';
  T1_SECTIONS.forEach((sec,si)=>{
    const maxSec=Math.max(...[0,1,2].map(vi=>{let mp=0;sec.criteria.forEach((_,ci)=>{const val=document.getElementById(`t1s${sec.id}c${ci}v${vi+1}`)?.value;if(val&&val!='na')mp+=4*sec.criteria[ci].weight;});return mp;}));
    const row=document.createElement('div'); row.className='breakdown-row';
    row.innerHTML=`<div class="br-header"><div class="br-lbl">${sec.name}</div><div class="br-scores">${[0,1,2].map(vi=>`<div class="br-vscore">${names[vi].substring(0,6)}: ${secTotals[si][vi]}</div>`).join('')}</div></div>${[0,1,2].map(vi=>`<div class="br-bar-wrap"><div class="br-bar v${vi+1}" style="width:${maxSec>0?Math.round(secTotals[si][vi]/maxSec*100):0}%"></div></div>`).join('')}`;
    bb.appendChild(row);
  });
  document.getElementById('t1-results').style.display='block';
  document.getElementById('t1-results').scrollIntoView({behavior:'smooth',block:'start'});
}

// ============================================================
// TOOL 2: TCO
// ============================================================
const T2_Y1=[
  {label:'Software license / subscription (Year 1)',note:'First-year subscription or perpetual license'},
  {label:'Implementation / professional services',note:"Vendor's or partner's implementation fee"},
  {label:'Data migration services',note:'ETL, conversion, validation by vendor/partner'},
  {label:'System configuration & customization',note:'Chart of accounts setup, workflows, custom reports'},
  {label:'Training (vendor-delivered)',note:'Initial end-user and admin training'},
  {label:'Integration development',note:'Connecting payroll, CRM, project management, etc.'},
  {label:'One-time setup / onboarding fees',note:'Activation, sandbox, tenant setup fees'},
];
const T2_Y23=[
  {label:'Annual subscription / maintenance fee',note:'Recurring license or SaaS subscription'},
  {label:'Annual support contract',note:'Standard or premium support tier'},
  {label:'Additional module / user license fees',note:'Expected growth in users or activated modules'},
  {label:'Ongoing training (new staff, updates)',note:'Refresher training, new hire onboarding'},
];
function t2Build() {
  function buildTable(tbodyId, items) {
    const tbody=document.getElementById(tbodyId);
    items.forEach((item,i)=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td><div class="row-label">${item.label}</div><div class="row-note">${item.note}</div></td>${[1,2,3].map(v=>`<td><input class="money-input" id="${tbodyId}_${i}_v${v}" type="number" placeholder="$0" oninput="t2UpdateSubs()"></td>`).join('')}`;
      tbody.appendChild(tr);
    });
    const sub=document.createElement('tr'); sub.className='section-subtotal';
    sub.innerHTML=`<td class="subtotal-label">${tbodyId==='t2y1-body'?'Year 1':'Yr 2–3 Annual'} Subtotal</td>${[1,2,3].map(v=>`<td class="subtotal-val" id="${tbodyId}_sub_v${v}">$0</td>`).join('')}`;
    tbody.appendChild(sub);
  }
  buildTable('t2y1-body',T2_Y1); buildTable('t2y23-body',T2_Y23);
}
function t2GetVal(id){return parseFloat(document.getElementById(id)?.value)||0;}
function t2Fmt(n){return '$'+Math.round(n).toLocaleString();}
function t2UpdateSubs(){
  [1,2,3].forEach(v=>{
    const y1=T2_Y1.reduce((s,_,i)=>s+t2GetVal(`t2y1-body_${i}_v${v}`),0);
    const y23=T2_Y23.reduce((s,_,i)=>s+t2GetVal(`t2y23-body_${i}_v${v}`),0);
    document.getElementById(`t2y1-body_sub_v${v}`).textContent=t2Fmt(y1);
    document.getElementById(`t2y23-body_sub_v${v}`).textContent=t2Fmt(y23)+'(×2)';
  });
}
function t2CalcInternal(){
  const v=t2GetVal('t2lead-rate')*t2GetVal('t2lead-hrs')+t2GetVal('t2train-hrs')*t2GetVal('t2staff-rate')+t2GetVal('t2data-hrs')*t2GetVal('t2staff-rate')+t2GetVal('t2prod-loss');
  document.getElementById('t2-internal-total').textContent=t2Fmt(v);
}
function t2UpdateLabels(){
  const n=[document.getElementById('t2v1name')?.value||'Vendor A',document.getElementById('t2v2name')?.value||'Vendor B',document.getElementById('t2v3name')?.value||'Vendor C'];
  document.querySelectorAll('.t2v1-label').forEach(e=>e.textContent=n[0]);
  document.querySelectorAll('.t2v2-label').forEach(e=>e.textContent=n[1]);
  document.querySelectorAll('.t2v3-label').forEach(e=>e.textContent=n[2]);
}
function t2Calculate(){
  const names=[document.getElementById('t2v1name')?.value||'Vendor A',document.getElementById('t2v2name')?.value||'Vendor B',document.getElementById('t2v3name')?.value||'Vendor C'];
  const internal=t2GetVal('t2lead-rate')*t2GetVal('t2lead-hrs')+t2GetVal('t2train-hrs')*t2GetVal('t2staff-rate')+t2GetVal('t2data-hrs')*t2GetVal('t2staff-rate')+t2GetVal('t2prod-loss');
  const tcos=[1,2,3].map(v=>{
    const y1=T2_Y1.reduce((s,_,i)=>s+t2GetVal(`t2y1-body_${i}_v${v}`),0);
    const y23=T2_Y23.reduce((s,_,i)=>s+t2GetVal(`t2y23-body_${i}_v${v}`),0);
    return{name:names[v-1],y1,y23,total3yr:y1+y23*2+internal,internal};
  });
  const minTCO=Math.min(...tcos.map(t=>t.total3yr).filter(t=>t>0));
  const maxTCO=Math.max(...tcos.map(t=>t.total3yr));
  const cards=document.getElementById('t2-tco-cards'); cards.innerHTML='';
  tcos.forEach(t=>{
    const isLow=t.total3yr===minTCO&&minTCO>0,isHigh=t.total3yr===maxTCO&&maxTCO>0&&maxTCO!==minTCO;
    const c=document.createElement('div'); c.className='tco-card'+(isLow?' lowest':isHigh?' highest':'');
    c.innerHTML=`<div class="rc-label">${isLow?'★ LOWEST TCO':isHigh?'⚠ HIGHEST TCO':'—'}</div><div class="rc-name">${t.name}</div><div class="rc-score" style="color:${isLow?'var(--teal)':isHigh?'var(--signal)':'var(--action)'}">${t2Fmt(t.total3yr)}</div><div class="rc-max">3-Year Total</div><div style="font-size:0.8rem;color:var(--ink-soft);margin-top:10px;line-height:1.8;text-align:left;">Year 1: ${t2Fmt(t.y1)}<br>Year 2: ${t2Fmt(t.y23)}<br>Year 3: ${t2Fmt(t.y23)}<br>Internal: ${t2Fmt(t.internal)}</div>`;
    cards.appendChild(c);
  });
  const savings=maxTCO-minTCO;
  const lowestName=tcos.reduce((a,b)=>a.total3yr<=b.total3yr?a:b).name;
  document.getElementById('t2-insight-box').innerHTML=`<div class="callout-label">Key Insight</div><div class="callout-text">${savings>0?`The lowest-cost option (${lowestName}) saves <strong>${t2Fmt(savings)}</strong> over 3 years. Verify that the lower-cost option scores acceptably on your Requirements Scorecard — a cheaper system that doesn't meet your needs costs more in the long run.`:'Enter vendor cost data above to see a comparison.'}</div>`;
  const yt=document.getElementById('t2-year-table');
  yt.innerHTML=`<thead><tr><th>Cost Category</th>${tcos.map(t=>`<th class="right">${t.name}</th>`).join('')}</tr></thead><tbody><tr><td>Year 1 Vendor Costs</td>${tcos.map(t=>`<td>${t2Fmt(t.y1)}</td>`).join('')}</tr><tr><td>Year 2 Recurring</td>${tcos.map(t=>`<td>${t2Fmt(t.y23)}</td>`).join('')}</tr><tr><td>Year 3 Recurring</td>${tcos.map(t=>`<td>${t2Fmt(t.y23)}</td>`).join('')}</tr><tr><td>Internal / Staff Costs</td>${tcos.map(t=>`<td>${t2Fmt(t.internal)}</td>`).join('')}</tr><tr class="total-row"><td>3-Year Total TCO</td>${tcos.map(t=>`<td>${t2Fmt(t.total3yr)}</td>`).join('')}</tr></tbody>`;
  document.getElementById('t2-results').style.display='block';
  document.getElementById('t2-results').scrollIntoView({behavior:'smooth',block:'start'});
}

// ============================================================
// TOOL 3: DCAA
// ============================================================
const T3_QS = [
  {section:'SF 1408 — Core Accounting System Requirements',ref:'SF 1408, Items 1–6 · FAR 16.301-3',questions:[
    {id:'t3q1',text:'Does your accounting system use a double-entry system capable of generating a complete and auditable trial balance?',ref:'SF 1408, Item 1',universal:true,options:[{score:0,label:'No double-entry system; we use spreadsheets or single-entry methods.'},{score:1,label:'We have accounting software but cannot generate a clean trial balance on demand.'},{score:2,label:'Double-entry system exists but has known reconciliation issues.'},{score:3,label:'Full double-entry accounting with clean, auditable trial balance available at any time.'}],actions:{0:'CRITICAL: Implement a double-entry accounting system immediately. SF 1408 Item 1 is a hard requirement — DCAA will reject a single-entry or spreadsheet-based system without exception.',1:'HIGH: Resolve trial balance issues before any pre-award review. A DCAA auditor will request a current trial balance within the first hour.',2:'MODERATE: Address known reconciliation issues and document their resolution. Create a monthly close checklist that includes trial balance sign-off.'}},
    {id:'t3q2',text:'Does your chart of accounts segregate direct costs, indirect costs, and unallowable costs into separate account codes?',ref:'SF 1408, Items 2–3 · FAR 31.201-6',universal:true,options:[{score:0,label:'No separation — direct and indirect costs are in the same accounts.'},{score:1,label:'Some separation exists but unallowable costs are not separately identified.'},{score:2,label:'Direct and indirect costs are separated; unallowable costs are flagged informally.'},{score:3,label:'Full three-way segregation with distinct account codes and written policy.'}],actions:{0:'CRITICAL: Restructure your chart of accounts immediately. FAR 31.201-6 requires unallowable costs to be separately identified and excluded from billing. This is consistently one of the top reasons for accounting system inadequacy findings.',1:'HIGH: Add unallowable cost account codes and create a written policy mapping FAR 31.205 cost categories to your chart of accounts.',2:'MODERATE: Formalize your unallowable cost identification in a written policy with specific account codes.'}},
    {id:'t3q3',text:'Does your accounting system support allocation of indirect costs using documented, consistently applied allocation bases?',ref:'SF 1408, Item 4 · FAR 31.203',universal:true,options:[{score:0,label:'No formal indirect cost allocation — overhead is not assigned to projects.'},{score:1,label:'Indirect costs are allocated but the basis is undocumented or changes frequently.'},{score:2,label:'Documented allocation basis exists but is not consistently applied.'},{score:3,label:'Documented, consistently applied indirect cost rates with defined pools and written methodology.'}],actions:{0:'CRITICAL: Develop indirect cost pool structure and allocation methodology before any cost-type award. FAR 31.203 requires documented indirect cost allocation bases.',1:'HIGH: Document your indirect cost allocation basis in an Accounting Practices and Procedures document. Define your cost pools (fringe, overhead, G&A) and the specific allocation base for each.',2:'MODERATE: Review and document any instances where the allocation basis has changed. Retroactive changes to indirect rates require DCAA notification on cost-type contracts.'}},
  ]},
  {section:'Timekeeping System (Labor Cost Controls)',ref:'SF 1408, Item 7 · DCAA CAM Chapter 6',questions:[
    {id:'t3q4',text:'Does your timekeeping system record employee labor by project and cost objective on a daily or near-daily basis with employee self-certification?',ref:'DCAA CAM 6-400 · SF 1408, Item 7',universal:false,naLabel:'Does not apply — we have no employees charging labor to government contracts.',options:[{score:0,label:'No formal timekeeping — employees estimate or report hours at month-end.'},{score:1,label:'Time is recorded but not consistently by project/cost objective, or lacks certification.'},{score:2,label:'Timekeeping by project with employee sign-off, but supervisor review is informal.'},{score:3,label:'Daily timekeeping by cost objective, employee certification, supervisor approval, and correction audit trail.'}],actions:{0:'CRITICAL: Implement a compliant timekeeping system before pursuing cost-type contracts. Retroactive time entry is explicitly prohibited. Required: daily entry, employee attestation, supervisor approval, immutable correction log.',1:'HIGH: Require all employees to enter time by project code daily and attest to accuracy at week-end. Implement supervisor approval workflow.',2:'MODERATE: Formalize supervisor approval as a hard system control and document the correction procedure.'}},
    {id:'t3q5',text:'Does your organization have a written timekeeping policy distributed to and acknowledged by all employees charging government contracts?',ref:'DCAA CAM 6-405',universal:false,naLabel:'Does not apply — we have no employees charging labor to government contracts.',options:[{score:0,label:'No written timekeeping policy exists.'},{score:1,label:'A policy exists but is outdated, not distributed, or not acknowledged by employees.'},{score:2,label:'A written policy exists and has been distributed, but acknowledgment is informal.'},{score:3,label:'Written policy, annual employee acknowledgment on file, and training completion documented.'}],actions:{0:'HIGH: Draft a timekeeping policy addressing: daily recording requirement, prohibited practices, correction procedures, and consequences for falsification.',1:'HIGH: Reissue the policy with current date and collect signed acknowledgments from all employees. Archive acknowledgments.',2:'MODERATE: Implement a formal annual acknowledgment process and retain records for at least three years.'}},
  ]},
  {section:'Billing & Revenue Controls',ref:'SF 1408, Items 8–10 · FAR 52.216-7',questions:[
    {id:'t3q6',text:'Does your accounting system produce invoices that reconcile to the general ledger and show only allowable, allocable costs incurred under the contract?',ref:'SF 1408, Item 8 · FAR 52.232-25',universal:true,options:[{score:0,label:'Invoices are prepared manually and do not reconcile to the GL.'},{score:1,label:'System-generated invoices but unallowable costs are not always excluded.'},{score:2,label:'System-generated invoices reconcile to GL; allowability screening is done manually.'},{score:3,label:'System-generated invoices with automated unallowable cost exclusion and invoice register maintained.'}],actions:{0:'CRITICAL: Establish a billing process that flows directly from the general ledger. Manual invoices that do not reconcile are a material deficiency under SF 1408.',1:'HIGH: Implement a pre-billing checklist that reviews each invoice for unallowable costs. Assign this responsibility to a specific, named individual.',2:'MODERATE: Build unallowable cost review into the formal billing close process as a documented, signed-off step.'}},
    {id:'t3q7',text:'Does your accounting system track contract funding, obligations, and expenditures by CLIN to prevent over-billing?',ref:'SF 1408, Item 9 · FAR 52.232-20',universal:true,options:[{score:0,label:'No CLIN-level tracking — contract costs tracked at the contract level only.'},{score:1,label:'CLIN tracking exists but is maintained in a separate spreadsheet.'},{score:2,label:'CLIN-level tracking in the accounting system but funding limit alerts are not automated.'},{score:3,label:'CLIN-level project codes in the GL with automated ceiling/funding limit warnings.'}],actions:{0:'HIGH: Establish CLIN-level project codes in your accounting system. Billing above the funded ceiling without CO authorization is a contract violation.',1:'HIGH: Migrate CLIN tracking into the accounting system and eliminate the separate spreadsheet.',2:'MODERATE: Configure automated budget alerts at 75%, 90%, and 100% of CLIN funding.'}},
  ]},
  {section:'Management Controls & Procedures',ref:'SF 1408, Items 11–18 · FAR 42.302',questions:[
    {id:'t3q8',text:'Does your organization have a named compliance owner responsible for accounting system adequacy, documented in writing?',ref:'DCAA Best Practice · FAR 42.302(b)',universal:true,options:[{score:0,label:'No named compliance owner — compliance is informal and distributed.'},{score:1,label:'Someone is informally responsible but it is not documented.'},{score:2,label:'A named owner exists with documented responsibility, but no formal delegation of authority.'},{score:3,label:'Named compliance officer with documented authority and annual review cycle.'}],actions:{0:'HIGH: Designate a named individual as the accounting compliance owner. DCAA auditors expect a specific point of contact responsible for system adequacy.',1:'MODERATE: Formalize the role in a job description or policy statement with specific responsibilities.',2:'MODERATE: Add a formal delegation of authority and establish an annual review cycle for the accounting practices manual.'}},
    {id:'t3q9',text:'Does your organization maintain a written Accounting Practices and Procedures (APP) manual that describes your cost accounting system?',ref:'DCAA Best Practice · FAR 9.104-1',universal:true,options:[{score:0,label:'No APP manual — accounting procedures are undocumented or verbal.'},{score:1,label:'Some procedures are documented but not consolidated into a single current manual.'},{score:2,label:'An APP manual exists but is outdated (not reviewed in 2+ years) or incomplete.'},{score:3,label:"Current, comprehensive APP manual reviewed within the past 12 months, covering all SF 1408 elements."}],actions:{0:"HIGH: Create an Accounting Practices and Procedures manual before any pre-award review. DCAA's first document request is always the APP manual.",1:'MODERATE: Consolidate existing procedures into a single document with version control, ownership, and annual review date.',2:'MODERATE: Schedule an annual APP review and update for any changes to your accounting system or FAR guidance.'}},
  ]},
];
const T3_ANSWERS = {};

function t3Build() {
  const body=document.getElementById('t3-assessment-body');
  let qNum=0;
  T3_QS.forEach((sec,si)=>{
    const sh=document.createElement('div'); sh.className='q-section-header';
    sh.innerHTML=`<div class="q-sh-label">Section ${si+1} of ${T3_QS.length}</div><div class="q-sh-title">${sec.section}</div><div class="q-sh-ref">${sec.ref}</div>`;
    body.appendChild(sh);
    sec.questions.forEach((q)=>{
      qNum++;
      const card=document.createElement('div'); card.className='q-card'; card.id=`t3card-${q.id}`;
      const optsHtml=q.options.map(opt=>`<label class="opt"><input type="radio" name="${q.id}" value="${opt.score}" onchange="t3OnAnswer('${q.id}',${opt.score})"><div class="option-body"><span class="opt-label">${opt.label}</span><span class="option-score score-${opt.score}">${opt.score===0?'High Risk':opt.score===1?'Moderate Risk':opt.score===2?'Low Risk':'Managed'}</span></div></label>`).join('');
      const naHtml=!q.universal?`<div class="na-divider"><div class="na-line"></div><div class="na-text">Not applicable</div><div class="na-line"></div></div><label class="opt na-opt"><input type="radio" name="${q.id}" value="na" onchange="t3OnAnswer('${q.id}','na')"><div class="option-body"><span class="opt-label">${q.naLabel}</span></div></label>`:'';
      card.innerHTML=`<div class="q-num">Question ${qNum}</div><div class="q-text">${q.text}</div><div class="q-ref">${q.ref}</div><div class="options-list">${optsHtml}${naHtml}</div>`;
      body.appendChild(card);
    });
  });
  const total=T3_QS.flatMap(s=>s.questions).length;
  document.getElementById('t3-prog-count').textContent=`0 of ${total} answered`;
}
function t3OnAnswer(qId,score) {
  T3_ANSWERS[qId]=score;
  const card=document.getElementById(`t3card-${qId}`);
  card.className=`q-card answered-${score}`;
  card.querySelectorAll('.option').forEach(opt=>{
    const v=opt.querySelector('input')?.value;
    opt.className='option'+(opt.querySelector('.na-opt, .option.na-opt')?'':'')+
      (opt.querySelector('input.na-opt')?'':'')+
      (opt.querySelector('.na-opt')||opt.classList.contains('na-opt')?' na-opt':'');
    if(v==String(score)||v==score)opt.className+=' selected-'+score;
  });
  const total=T3_QS.flatMap(s=>s.questions).length;
  const answered=Object.keys(T3_ANSWERS).length;
  const pct=Math.round(answered/total*100);
  document.getElementById('t3-prog-bar').style.width=pct+'%';
  document.getElementById('t3-prog-count').textContent=`${answered} of ${total} answered`;
}
function t3CheckScope() {
  const s1=document.querySelector('input[name=t3scope1]:checked')?.value;
  const s2=document.querySelector('input[name=t3scope2]:checked')?.value;
  document.getElementById('t3-scope-in').style.display=(s1==='yes'&&s2==='yes')?'block':'none';
  document.getElementById('t3-scope-out').style.display=(s1==='no'||s2==='no')?'block':'none';
}
function t3Calculate() {
  let scored=0,total=0; const excluded=[];
  const allQs=T3_QS.flatMap(s=>s.questions);
  allQs.forEach(q=>{
    const a=T3_ANSWERS[q.id];
    if(a==='na'){excluded.push(q.text.substring(0,50)+'...');}
    else if(a!==undefined){scored+=parseInt(a);total+=3;}
  });
  const pct=total>0?Math.round(scored/total*100):0;
  let tier,tierLabel;
  if(pct>=85){tier='managed';tierLabel='Accounting System Readiness: Strong';}
  else if(pct>=65){tier='low-risk';tierLabel='Readiness: Adequate with Gaps';}
  else if(pct>=40){tier='moderate';tierLabel='Readiness: Needs Improvement';}
  else{tier='high-risk';tierLabel='Readiness: Material Deficiencies Present';}
  const actions=[];
  allQs.forEach(q=>{
    const a=T3_ANSWERS[q.id];
    if(a===undefined||a==='na'||parseInt(a)===3)return;
    const p=parseInt(a)===0?'critical':parseInt(a)===1?'high':'moderate';
    actions.push({priority:p,text:q.actions[parseInt(a)]});
  });
  actions.sort((a,b)=>({critical:0,high:1,moderate:2}[a.priority]-{critical:0,high:1,moderate:2}[b.priority]));
  const secScores=T3_QS.map(sec=>{
    let s=0,t=0;
    sec.questions.forEach(q=>{const a=T3_ANSWERS[q.id];if(a!==undefined&&a!=='na'){s+=parseInt(a);t+=3;}});
    return{name:sec.section,scored:s,total:t};
  });
  const rs=document.getElementById('t3-results');
  rs.innerHTML=`<div class="sc-card-title">DCAA Readiness Report</div>
    <div class="score-badge-wrap"><div class="score-badge ${tier}"><div class="sb-tier">${tierLabel}</div><div class="sb-score">${scored} / ${total}</div><div class="sb-label">${pct}% readiness score</div>${excluded.length?`<div style="font-size:11px;color:var(--ink-soft);margin-top:8px;">${excluded.length} question${excluded.length>1?'s':''} excluded (N/A)</div>`:''}</div></div>
    <div class="area-section"><div class="breakdown-title">Readiness by Area</div>${secScores.map(s=>s.total===0?`<div class="area-row"><div class="ar-header"><div class="ar-lbl">${s.name}</div></div><div style="font-size:12px;color:var(--ink-soft);font-style:italic;padding:8px 0;">Not applicable</div></div>`:
    `<div class="area-row"><div class="ar-header"><div class="ar-lbl">${s.name}</div><div class="ar-score">${s.scored}/${s.total} (${Math.round(s.scored/s.total*100)}%)</div></div><div class="ar-bar-wrap"><div class="ar-bar" style="width:${Math.round(s.scored/s.total*100)}%;background:${Math.round(s.scored/s.total*100)>=80?'var(--teal)':Math.round(s.scored/s.total*100)>=55?'#e8a020':'var(--signal)'}"></div></div></div>`).join('')}</div>
    <div class="actions-section"><div class="actions-title">Prioritized Action Items</div><div class="actions-sub">Up to 8 highest-priority actions. Sorted Critical → High → Moderate.</div>
    ${actions.slice(0,8).length===0?'<div style="background:var(--green-pale);border:1px solid rgba(36,102,64,0.2);border-radius:10px;padding:18px;font-size:14px;color:var(--teal);">✓ No critical actions identified. All scored questions are at the managed level.</div>':actions.slice(0,8).map(a=>`<div class="action-item ${a.priority}"><div class="ai-priority">${a.priority} priority</div><div class="ai-text">${a.text}</div></div>`).join('')}</div>
    <div class="retainer-cta"><div class="rct-text"><strong>Need help preparing for a DCAA review?</strong> Savanna Consulting provides spot advisory sessions to review your readiness and develop a remediation plan.</div><a href="https://app.usemotion.com/meet/Savanna-Consulting/intro-strategy" class="rct-link" target="_blank">Book a Strategy Call →</a></div>`;
  rs.style.display='block';
  rs.scrollIntoView({behavior:'smooth',block:'start'});
}

// ============================================================
// TOOL 4: RFI / DEMO SCRIPT
// ============================================================
function t4Build() {
  // RFI sections
  const rfiData=[
    {title:'Section A — Company & Product Overview',note:'Establish vendor credibility and product maturity before investing time in a demo.',items:[
      {num:'A1',text:'How many customers does your organization have in our industry and size segment (provide specific count and 3 reference customers willing to speak with us)?',tag:'all'},
      {num:'A2',text:'How long has your current product been in market, and what is your annual customer retention rate?',tag:'all'},
      {num:'A3',text:'Describe your implementation methodology, typical go-live timeline for an organization our size, and what is included vs. billed separately.',tag:'all'},
      {num:'A4',text:'Who will be our named implementation project manager, and what is their experience with organizations like ours?',tag:'all'},
    ]},
    {title:'Section B — Government Contracting Requirements',note:'GovCon-specific. Include for all vendors being evaluated for government contractor use.',items:[
      {num:'B1',text:'Has your accounting system been reviewed and found adequate by DCAA under SF 1408? If yes, provide documentation and describe your support process for pre-award reviews.',tag:'govcon'},
      {num:'B2',text:'Describe how your system supports indirect cost pool structure (fringe, overhead, G&A) with separate allocation bases per FAR 31.203.',tag:'govcon'},
      {num:'B3',text:'Describe your timekeeping module: does it support daily entry, employee self-certification, supervisor approval, and immutable correction audit trail per DCAA requirements?',tag:'govcon'},
      {num:'B4',text:'How does your system track and exclude unallowable costs (FAR 31.205) from billing and indirect rate calculations?',tag:'govcon'},
      {num:'B5',text:'Describe how your system handles CLIN-level contract tracking, funding ceiling alerts, and cumulative billing-to-date for T&M and cost-type contracts.',tag:'govcon'},
    ]},
    {title:'Section C — Nonprofit & Grant Management',note:'Include when fund accounting and 2 CFR 200 compliance are requirements.',items:[
      {num:'C1',text:'Describe your fund accounting architecture. How are restricted, temporarily restricted, and unrestricted net assets tracked and reported separately?',tag:'nonprofit'},
      {num:'C2',text:'How does your system support 2 CFR 200 (Uniform Guidance) compliance — including allowable cost tracking and single audit readiness?',tag:'nonprofit'},
    ]},
    {title:'Section D — Technical & Integration Requirements',note:'For all evaluations. Customize with your specific integration requirements before sending.',items:[
      {num:'D1',text:'List all native integrations available with payroll providers (ADP, Paychex, Gusto) and describe whether these are included in the base subscription or billed separately.',tag:'all'},
      {num:'D2',text:'Describe your data export capabilities. Can we export all our data at any time in a standard format? What is the process for data export at contract termination?',tag:'all'},
      {num:'D3',text:'What is your system uptime SLA, and what has your actual uptime been for the past 24 months?',tag:'all'},
    ]},
    {title:'Section E — Pricing & Commercial Terms',note:'Request itemized pricing — vague "starts at" responses are a red flag.',items:[
      {num:'E1',text:'Provide an itemized Year 1 quote including: subscription fee, implementation services, data migration, training, integrations, and any other first-year costs.',tag:'all'},
      {num:'E2',text:'What are the recurring annual costs in Years 2 and 3? What contractual mechanisms govern price increases?',tag:'all'},
      {num:'E3',text:'What are the contract minimum term and early termination provisions? Is month-to-month available?',tag:'all'},
    ]},
  ];
  const rfiBody=document.getElementById('t4-rfi-sections');
  rfiData.forEach(sec=>{
    const div=document.createElement('div'); div.className='rfi-group';
    div.innerHTML=`<div class="rfi-group-title">${sec.title}</div><div class="rfi-group-note">${sec.note}</div>${sec.items.map(it=>`<div class="rfi-q-item"><span class="rfi-num">${it.num}</span><div class="rfi-q-text">${it.text}</div><span class="rfi-tag tag-${it.tag}">${it.tag==='govcon'?'GovCon':it.tag==='nonprofit'?'Nonprofit':'All'}</span></div>`).join('')}`;
    rfiBody.appendChild(div);
  });
  // Demo phases
  const demoData=[
    {num:'1',time:'Min 0–10',title:'Opening: Your Requirements, Not Their Script',purpose:'Tell the vendor: "We\'ve sent you our requirements. Today we want to see you demonstrate against those requirements — not your standard demo."',qs:['Walk us through your implementation methodology for an organization our size and complexity.','What are the three most common reasons your customers go live later than planned, and how do you mitigate them?','Tell us about a customer similar to ours and how the implementation went.']},
    {num:'2',time:'Min 10–30',title:'Core Financial Functionality',purpose:'Ask the vendor to use a demo environment — not slides. Require them to perform transactions, not just show screenshots.',qs:['Create a new vendor, post an AP bill, and show us how it flows through to the GL in real time.','Generate a trial balance and show us how it reconciles to the balance sheet as of today.','Show us how we would create and apply an indirect cost allocation — step by step, not in theory.','Run a budget-to-actual report for a specific department or project.']},
    {num:'3',time:'Min 30–50',title:'Your Specific Compliance Requirements',purpose:'Customize for your organization type. GovCon: use GovCon questions. Nonprofit: use grant management questions.',qs:['[GovCon] Show us the timekeeping module — how does an employee enter time, certify it, and how does their supervisor approve it?','[GovCon] Show us how indirect cost pools are configured and how overhead allocates to a direct project.','[GovCon] Show us how the system flags and segregates a FAR 31.205 unallowable cost from billing.','[Nonprofit] Show us how grant restrictions are set up and how the system prevents expenditure for non-permitted purposes.','[All] Show us how the system handles a scenario where a budget is exceeded.']},
    {num:'4',time:'Min 50–65',title:'Implementation, Migration & Support',purpose:'How a vendor answers questions about go-live difficulties tells you more than how they answer questions about features.',qs:['Walk us through your data migration process — what we are responsible for vs. what you handle.','Describe your go-live support model. What does hypercare look like and how long does it last?','Tell us about a time a go-live did not go as planned for a customer similar to ours. What happened?','What are the three most common support tickets from organizations our size in the first 90 days after go-live?']},
    {num:'5',time:'Min 65–75',title:'Closing Questions',purpose:'End every demo session with these questions — the answers reveal whether the vendor is the right fit beyond the feature checklist.',qs:['Based on what you know about our organization, what are you most concerned about in our implementation?','What capabilities do we need that your system does not currently support?','If we select you, what are the three most important things we can do in the first 30 days?']},
  ];
  const demoBody=document.getElementById('t4-demo-phases');
  demoData.forEach(ph=>{
    const div=document.createElement('div'); div.className='demo-phase';
    div.innerHTML=`<div class="dp-header"><div class="dp-num">${ph.num}</div><div><div class="dp-time">${ph.time}</div><div class="dp-title">${ph.title}</div></div></div><div class="dp-purpose">${ph.purpose}</div><ul class="demo-q-list">${ph.qs.map(q=>`<li>${q}</li>`).join('')}</ul>`;
    demoBody.appendChild(div);
  });
  // Red flags
  const rfData=[
    {title:'Sales Process Red Flags',items:[
      {label:'Vendor refuses to provide itemized pricing — only "let\'s get on a call to discuss"',cons:'Opaque pricing typically leads to significant undisclosed costs surfacing in the contract phase.'},
      {label:'Demo is entirely slides or screenshots — no live system transactions demonstrated',cons:'Vendors who cannot demonstrate functionality live often have systems that cannot perform it out of the box.'},
      {label:'Inability to provide 3 references in your industry/size segment',cons:'Indicates limited relevant experience or high churn among customers like you.'},
      {label:'Artificial urgency — "this pricing expires Friday" or "we only have one implementation slot left"',cons:'Pressure tactics signal that the vendor is more focused on closing than fit.'},
    ]},
    {title:'Implementation Risk Red Flags',items:[
      {label:'Vague implementation SOW — "we\'ll scope after contract signing"',cons:'SOW vagueness transfers all scope risk to you. Require a written, itemized SOW before signing.'},
      {label:'No dedicated implementation PM — "you\'ll work with our team"',cons:'Team-based delivery without accountability typically results in slow escalation and delayed go-lives.'},
      {label:'Data migration described as "easy" or "automatic" without specifics',cons:'Data migration is consistently the most underestimated implementation risk.'},
    ]},
    {title:'GovCon-Specific Red Flags',items:[
      {label:'Vendor claims DCAA "approval" but cannot produce documentation of a specific adequacy finding',cons:'DCAA approves accounting systems, not software. Ask for actual audit findings.'},
      {label:'Cannot demonstrate how unallowable costs are segregated — only describes it conceptually',cons:'If they cannot show it in the demo, it does not work the way they describe.'},
      {label:'Timekeeping is a separate module at additional cost not mentioned in initial pricing',cons:'DCAA-compliant timekeeping is a hard requirement — it should be core, not an add-on.'},
    ]},
    {title:'Contract & Exit Risk Red Flags',items:[
      {label:'No clear data export or data portability provision in the contract',cons:'You must be able to access and export your data at any time. Non-negotiable.'},
      {label:'Auto-renewal clause with a short (less than 60-day) cancellation window',cons:'Missed auto-renewal windows result in involuntary multi-year contract extensions.'},
      {label:'Unlimited price escalation clause — no cap on annual subscription increases',cons:'Year 3 and Year 4 costs can substantially exceed initial quotes if escalation is uncapped.'},
    ]},
  ];
  const rfBody=document.getElementById('t4-redflags-body');
  rfData.forEach(cat=>{
    const div=document.createElement('div'); div.className='rf-category';
    div.innerHTML=`<div class="rf-cat-title">${cat.title}</div>${cat.items.map(it=>`<div class="rf-item"><input type="checkbox" class="rf-check"><div><div class="rf-label">${it.label}</div><div class="rf-consequence">${it.cons}</div></div></div>`).join('')}`;
    rfBody.appendChild(div);
  });
  // Reference check
  const rcData=[
    {title:'Phase 1 — Implementation Experience',sub:'Ask every reference. These questions reveal how the vendor performs when things are difficult.',qs:['Did you go live on time and on budget? If not, what caused the overrun — and how did the vendor respond?','How accurate was the vendor\'s initial project estimate? What costs came up after contract signing?','How would you describe your implementation project manager? Did you have PM continuity?','What was the data migration experience like? What would you do differently?','Describe the first 60 days after go-live. What issues came up and how were they resolved?']},
    {title:'Phase 2 — Ongoing Operations',sub:'Understanding the post-go-live reality is as important as the implementation experience.',qs:['How responsive is their support team when you have a production issue?','How have subscription pricing and contract terms changed at renewal?','Has the product evolved in the ways you expected? Has the vendor delivered on roadmap promises?','Are there capabilities sold to you that the system does not actually perform well in practice?']},
    {title:'Phase 3 — GovCon / Compliance-Specific',sub:'For evaluations where DCAA compliance or government billing are requirements.',qs:['Have you gone through a DCAA pre-award accounting system review with this system? What was the outcome?','How does the system perform for indirect cost rate calculations at month-end?','How is the timekeeping module used in practice — do employees use it daily?']},
    {title:'Closing Question',sub:'Always end with this question.',qs:['Knowing what you know now, would you make the same decision again? What would you do differently in the evaluation and implementation process?']},
  ];
  const rcBody=document.getElementById('t4-refcheck-body');
  rcData.forEach(sec=>{
    const div=document.createElement('div'); div.className='ref-guide';
    div.innerHTML=`<div class="rg-title">${sec.title}</div><div class="rg-sub">${sec.sub}</div><ul class="ref-q-list">${sec.qs.map(q=>`<li>${q}</li>`).join('')}</ul>`;
    rcBody.appendChild(div);
  });
  document.getElementById('t4rfi-date').value=new Date().toISOString().split('T')[0];
}

// ============================================================
// TOOL 5: DATA MIGRATION
// ============================================================
const T5_CATEGORIES = [
  {id:'coa',title:'Chart of Accounts',sub:'CoA structure must be fully cleaned and reconciled before migration. Duplicate accounts and orphaned codes will carry over.',items:[
    {label:'Active account codes',note:'Total number of GL accounts in current chart of accounts'},
    {label:'Duplicate or unused accounts',note:'Accounts with no activity in 2+ years or duplicates of active accounts'},
    {label:'Account segment / dimension structure',note:'Consistency of department, project, fund segment codes'},
    {label:'Account descriptions and naming conventions',note:'Clear, standardized descriptions vs. cryptic legacy codes'},
    {label:'Opening balances reconciliation',note:'Trial balance as of migration cutoff date — verified and reconciled'},
  ]},
  {id:'master',title:'Vendor & Customer Master Data',sub:'Duplicate records and missing required fields are among the most common post-go-live issues. De-duplicate before migration, not after.',items:[
    {label:'Active vendor records',note:'Vendors with activity in past 24 months'},
    {label:'Vendor duplicate records',note:'Same vendor entered under multiple names or IDs'},
    {label:'Vendor required fields completeness',note:'Address, tax ID (W-9), payment terms, 1099 flag'},
    {label:'Active customer / client records',note:'Customers with open or recent activity'},
    {label:'Customer required fields completeness',note:'Billing address, contact, payment terms, contract reference'},
  ]},
  {id:'open',title:'Open Transactions',sub:'Open AR, AP, and purchase orders as of the migration cutoff date must be migrated accurately.',items:[
    {label:'Open accounts receivable invoices',note:'Unpaid customer invoices as of migration cutoff'},
    {label:'Open accounts payable bills',note:'Unpaid vendor bills as of migration cutoff'},
    {label:'Open purchase orders',note:'POs not yet fully received or matched to invoices'},
    {label:'AR/AP aging reconciliation',note:'Aging reports reconcile to GL balance as of cutoff'},
  ]},
  {id:'hist',title:'Historical Financial Data',sub:'Historical data migration is optional — but the decision has downstream consequences for reporting and auditing.',items:[
    {label:'Prior-year closed financial statements',note:'Audited or reviewed P&L and balance sheets available'},
    {label:'Cumulative project cost history',note:'Project-to-date costs if migrating active projects'},
    {label:'Fixed asset register',note:'Asset records with cost, depreciation schedule, book value'},
  ]},
  {id:'proj',title:'Project / Grant / Contract Data',sub:'For GovCon and nonprofit organizations, project and grant data migration is often the highest-risk element.',items:[
    {label:'Active project / contract records',note:'Open projects with current budget and cost detail',govcon:true},
    {label:'Budget-to-actual history by project',note:'Cumulative budget, actuals, and remaining balance',govcon:true},
    {label:'Grant award records and restrictions',note:'Award amounts, periods of performance, restriction codes',nonprofit:true},
    {label:'Cumulative billing history (T&M/cost-type)',note:'Billed-to-date by CLIN for cost-type contracts',govcon:true},
    {label:'Open encumbrances and commitments',note:'Committed but not yet expended amounts'},
  ]},
];
const T5_QUAL_OPTS=[{value:'',label:'— Not assessed'},{value:'high',label:'✓ High — clean, complete, ready'},{value:'med',label:'⚠ Medium — gaps, needs cleanup'},{value:'low',label:'✗ Low — significant remediation needed'},{value:'na',label:'N/A — not applicable'}];
const T5_RISK_MAP={high:{label:'Low Risk',css:'risk-low'},med:{label:'Med Risk',css:'risk-med'},low:{label:'High Risk',css:'risk-high'},na:{label:'N/A',css:'risk-na'},'':{label:'—',css:''}};

function t5Build() {
  const body=document.getElementById('t5-categories-body');
  T5_CATEGORIES.forEach((cat,catIdx)=>{
    const sec=document.createElement('div'); sec.className='cat-section';
    sec.innerHTML=`<div class="cat-header"><div class="cat-label">Category ${catIdx+1} of ${T5_CATEGORIES.length}</div><div class="cat-title">${cat.title}</div><div class="cat-sub">${cat.sub}</div></div>`;
    const tbl=document.createElement('table'); tbl.className='audit-table';
    tbl.innerHTML=`<thead><tr><th style="width:30%">Data Element</th><th style="width:16%">Quality Rating</th><th style="width:12%">Approx. Volume</th><th style="width:12%">Migration Risk</th><th style="width:30%">Notes / Remediation</th></tr></thead>`;
    const tbody=document.createElement('tbody');
    cat.items.forEach((item,i)=>{
      const tr=document.createElement('tr');
      let badge=item.govcon?' <span style="font-size:10px;background:#e8f0fa;color:#3060a0;padding:1px 5px;border-radius:3px;">GovCon</span>':item.nonprofit?' <span style="font-size:10px;background:var(--green-pale);color:var(--teal);padding:1px 5px;border-radius:3px;">Nonprofit</span>':'';
      tr.innerHTML=`<td><div class="row-label">${item.label}${badge}</div><div class="row-note">${item.note}</div></td>
        <td><select class="qual-select" id="t5${cat.id}_q${i}" onchange="t5OnQual(this,'${cat.id}',${i})">${T5_QUAL_OPTS.map(o=>`<option value="${o.value}">${o.label}</option>`).join('')}</select></td>
        <td><input class="volume-input" type="number" placeholder="~"></td>
        <td><span class="risk-cell risk-na" id="t5${cat.id}_r${i}">—</span></td>
        <td><textarea class="notes-input" id="t5${cat.id}_n${i}" placeholder="Notes..."></textarea></td>`;
      tbody.appendChild(tr);
    });
    tbl.appendChild(tbody); sec.appendChild(tbl); body.appendChild(sec);
  });
}
function t5OnQual(sel,catId,i){
  const v=sel.value; sel.className='qual-select'+(v?` q-${v}`:'');
  const risk=T5_RISK_MAP[v]||T5_RISK_MAP[''];
  const cell=document.getElementById(`t5${catId}_r${i}`);
  cell.className=`risk-cell ${risk.css}`; cell.textContent=risk.label;
}
function t5CheckScope(){
  const v=document.querySelector('input[name=t5scope]:checked')?.value;
  document.getElementById('t5-scope-na').style.display=v==='no'?'block':'none';
  document.getElementById('t5-scope-in').style.display=v==='yes'?'block':'none';
}
function t5SelectStrategy(el,strategy){
  document.querySelectorAll('.strat-opt').forEach(o=>o.classList.remove('selected')); el.classList.add('selected');
  const recs={bigbang:'Big Bang selected. Viable when data quality ratings are mostly High and volume is manageable. Conduct at least one full mock migration 4–6 weeks before go-live.',phased:'Phased Migration selected. Reduces risk by migrating in waves. Recommended when 2 or more data categories have Medium or Low quality ratings.',parallel:'Parallel Run selected. Highest-confidence approach — recommended for GovCon organizations with active cost-type contracts or teams doing their first ERP migration.'};
  const rec=document.getElementById('t5-strategy-rec'); rec.textContent=recs[strategy]; rec.style.display='block';
}
function t5Generate(){
  const counts={high:0,med:0,low:0,na:0}; const priorities=[];
  T5_CATEGORIES.forEach(cat=>{
    cat.items.forEach((item,i)=>{
      const val=document.getElementById(`t5${cat.id}_q${i}`)?.value;
      const note=document.getElementById(`t5${cat.id}_n${i}`)?.value;
      if(val)counts[val]++;
      if(val==='low')priorities.push({level:'high',label:`HIGH RISK: ${item.label}`,note:note||'Significant remediation required before migration.'});
      else if(val==='med')priorities.push({level:'med',label:`MODERATE RISK: ${item.label}`,note:note||'Gaps identified — plan cleanup sprints before migration cutover.'});
    });
  });
  if(counts.low>0)priorities.push({level:'high',label:'Schedule a data remediation sprint 8–10 weeks before go-live',note:'All High Risk items must be resolved before migration begins.'});
  if(counts.med>2)priorities.push({level:'med',label:'Consider phased migration approach given medium-quality data volume',note:'Multiple categories with medium quality ratings increase big-bang go-live risk.'});
  priorities.push({level:'low',label:'Schedule a mock migration drill 4–6 weeks before go-live',note:'Test data load into sandbox environment and validate reconciliation before production cutover.'});
  priorities.push({level:'low',label:'Establish a migration cutoff date and freeze period',note:'Define the exact date as of which all balances will be migrated. No transactions should post after cutoff.'});
  const rs=document.getElementById('t5-results');
  rs.innerHTML=`<div class="sc-card-title">Data Migration Readiness Report</div><div style="font-size:0.88rem;color:var(--ink-soft);margin-bottom:18px;">Summary of data quality assessments across all categories.</div>
    <div class="summary-grid"><div class="sum-card risk-high-card"><div class="sum-num">${counts.low}</div><div class="sum-label">High Risk Items</div></div><div class="sum-card risk-med-card"><div class="sum-num">${counts.med}</div><div class="sum-label">Moderate Risk Items</div></div><div class="sum-card risk-low-card"><div class="sum-num">${counts.high}</div><div class="sum-label">Ready to Migrate</div></div></div>
    <div class="priority-title">Remediation Priority List</div>${priorities.slice(0,8).map(p=>`<div class="priority-item ${p.level}"><span class="pi-badge">${p.level==='high'?'HIGH':p.level==='med'?'MODERATE':'LOW'}</span><div class="pi-text"><strong>${p.label}</strong><br>${p.note}</div></div>`).join('')}
    <div class="retainer-cta"><div class="rct-text"><strong>Need help planning your migration?</strong> Savanna Consulting can review your audit results and help you build a migration project plan.</div><a href="https://app.usemotion.com/meet/Savanna-Consulting/intro-strategy" class="rct-link" target="_blank">Book a Strategy Call →</a></div>`;
  rs.style.display='block'; rs.scrollIntoView({behavior:'smooth',block:'start'});
}

// ============================================================
// TOOL 6: PLAYBOOK
// ============================================================
function t6Build() {
  // Phases
  const phases=[
    {num:1,title:'Requirements Documentation',time:'Typical: 2–4 weeks',desc:'Define what your organization actually needs — not what looks impressive in a demo. Requirements documentation is the foundation of every subsequent decision.',tasks:[{t:'Complete the ERP Requirements Scorecard (Tool 01) — all five sections',o:'Finance Lead'},{t:'Identify and document compliance requirements (DCAA, 2 CFR 200, SOC 2)',o:'Finance + Compliance'},{t:'Document all required integrations (payroll, CRM, project management, HR)',o:'IT / Finance'},{t:'Define reporting requirements — list the 10 reports you cannot live without',o:'Finance + Management'},{t:'Document data migration scope (categories, volume, history requirements)',o:'Finance + IT'}],pitfall:'Rushing requirements to get to demos. Every hour spent in requirements saves three hours in vendor evaluation and ten hours in post-selection scope disputes.'},
    {num:2,title:'Vendor Evaluation',time:'Typical: 4–8 weeks',desc:'Issue RFIs, schedule structured demos, model TCO, and conduct reference checks for 2–4 finalist vendors. The goal is to generate comparable, structured data — not impressions.',tasks:[{t:'Identify 3–5 vendors for initial RFI based on industry fit and requirements',o:'Finance Lead'},{t:'Issue structured RFI using Tool 04 — require written responses with deadline',o:'Finance Lead'},{t:'Score RFI responses and shortlist to 2–3 demo candidates',o:'Evaluation Team'},{t:'Run structured demos using Tool 04 Demo Script — score each vendor immediately',o:'Evaluation Team'},{t:'Build 3-year TCO models for each finalist using Tool 02',o:'Finance Lead'},{t:'Conduct 2 reference calls per finalist using Tool 04 Reference Check Guide',o:'Finance Lead'}],pitfall:'Letting vendors control the demo agenda. Issue your demo script in advance and insist on live system demonstrations of your specific scenarios.'},
    {num:3,title:'Vendor Selection & Decision',time:'Typical: 1–2 weeks',desc:'Make the selection based on structured data — scorecard results, TCO model, reference check notes, and red flag checklist. Present the recommendation with supporting documentation before any contract is signed.',tasks:[{t:'Compile final Requirements Scorecard results for all finalists',o:'Finance Lead'},{t:'Prepare a one-page selection recommendation with scorecard, TCO, and reference summary',o:'Finance Lead'},{t:'Present recommendation to decision-making leadership for approval',o:'Finance Lead + CEO/ED'},{t:'Notify selected vendor and request initial contract and SOW drafts',o:'Finance Lead'},{t:'Notify non-selected vendors professionally and promptly',o:'Finance Lead'}],pitfall:'Making a verbal or informal commitment to a vendor before contract negotiation begins. Once you signal a clear choice, your negotiating leverage evaporates.'},
    {num:4,title:'Contract Negotiation & Execution',time:'Typical: 2–4 weeks',desc:'Review and negotiate every term before signing. Use the Contract Review Checklist (Tab 3) as your guide.',tasks:[{t:'Review contract against the Contract Review Checklist (Tab 3 of this tool)',o:'Finance Lead + Legal'},{t:'Verify that the SOW matches all RFI commitments and demo scenarios demonstrated',o:'Finance Lead'},{t:'Negotiate price escalation caps, auto-renewal notice period, and data portability',o:'Finance Lead + Legal'},{t:'Confirm named implementation PM is identified in the contract or SOW',o:'Finance Lead'},{t:'Obtain final signatures and distribute fully executed contract to all stakeholders',o:'Finance Lead'}],pitfall:'Signing under deadline pressure. "We need your signature by end of week to hold your slot" is a sales tactic. Contracts govern everything when things go wrong.'},
    {num:5,title:'Implementation',time:'Typical: 3–9 months',desc:'Execute with active internal oversight — not passive attendance at vendor-led meetings. The organizations with the smoothest go-lives treat implementation as their project, not the vendor\'s.',tasks:[{t:'Complete Project Charter (Tab 2) and distribute to all stakeholders',o:'Project Lead'},{t:'Establish weekly status meetings with written agendas and action logs',o:'Project Lead'},{t:'Complete Data Migration Readiness Audit (Tool 05) and begin data cleanup sprints',o:'Finance + IT'},{t:'Conduct User Acceptance Testing (UAT) for all critical workflows before go-live',o:'All Departments'},{t:'Complete a full mock migration in the sandbox environment at least 4 weeks before go-live',o:'Finance + IT'},{t:'Train all end users with role-based sessions at least 2 weeks before go-live',o:'Project Lead'},{t:'Complete Go-Live Readiness Assessment (Tab 4) — do not proceed with unresolved blockers',o:'Project Lead'}],pitfall:'Proceeding to go-live before UAT is complete or when the data migration has unresolved reconciliation errors. A delayed go-live is always less costly than a failed one.'},
    {num:6,title:'Go-Live & Post-Launch Stabilization',time:'Typical: 30–90 days post go-live',desc:'Go-live is not the finish line — it\'s the start of stabilization. Plan for 60–90 days of heightened support, process monitoring, and parallel validation before declaring the implementation complete.',tasks:[{t:'Confirm vendor hypercare support is active and escalation contacts are documented',o:'Project Lead'},{t:'Run first month-end close in the new system and reconcile to prior system balances',o:'Finance Lead'},{t:'Verify all integrations are processing correctly (payroll, bank feeds, etc.)',o:'Finance + IT'},{t:'Conduct post-go-live user feedback sessions at Day 14 and Day 45',o:'Project Lead'},{t:'Conduct 90-day implementation retrospective and close the project formally',o:'Project Lead'}],pitfall:'Releasing the implementation team at go-live. Vendor hypercare expires at 30 days — but most critical issues surface at 45–60 days. Keep your internal project lead engaged through the first full quarter-end close.'},
  ];
  const pb=document.getElementById('t6-phases-body');
  phases.forEach(ph=>{
    const div=document.createElement('div'); div.className='phase-card';
    div.innerHTML=`<div class="pc-header"><div class="pc-num">${ph.num}</div><div><div class="pc-phase">Phase ${ph.num}</div><div class="pc-title">${ph.title}</div><div class="pc-timeframe">${ph.time}</div></div></div><div class="pc-desc">${ph.desc}</div><ul class="task-list">${ph.tasks.map(t=>`<li><input type="checkbox" class="task-check"><div class="task-label">${t.t}</div><span class="task-owner">${t.o}</span></li>`).join('')}</ul><div class="pc-pitfall"><div class="pitfall-label">Most Common Failure Point</div><div class="pitfall-text">${ph.pitfall}</div></div>`;
    pb.appendChild(div);
  });

  // Charter
  const cb=document.getElementById('t6-charter-body');
  cb.innerHTML=`<div class="charter-section"><div class="cs-title">Project Overview</div>
    <div class="field-grid"><div class="vi-group"><label class="vi-label">Organization Name</label><input class="vi-input" type="text" placeholder="Your organization"></div><div class="vi-group"><label class="vi-label">Selected ERP System</label><input class="vi-input" type="text" placeholder="Vendor and product name"></div><div class="vi-group"><label class="vi-label">Project Start Date</label><input class="vi-input" type="date"></div><div class="vi-group"><label class="vi-label">Target Go-Live Date</label><input class="vi-input" type="date"></div><div class="vi-group"><label class="vi-label">Executive Sponsor</label><input class="vi-input" type="text" placeholder="Name and title"></div><div class="vi-group"><label class="vi-label">Internal Project Lead</label><input class="vi-input" type="text" placeholder="Name and title"></div><div class="vi-group"><label class="vi-label">Vendor Project Manager</label><input class="vi-input" type="text" placeholder="Name and contact"></div><div class="vi-group"><label class="vi-label">Total Budget (all-in)</label><input class="vi-input" type="text" placeholder="$"></div></div>
    <div class="field-grid one-col"><div class="vi-group"><label class="vi-label">Project Scope Statement</label><textarea class="vi-input" placeholder="Describe what is in scope: modules, departments, integrations, data to be migrated, etc."></textarea></div><div class="vi-group"><label class="vi-label">Out of Scope</label><textarea class="vi-input" placeholder="List anything explicitly excluded from this implementation to prevent scope creep."></textarea></div><div class="vi-group"><label class="vi-label">Key Success Criteria</label><textarea class="vi-input" placeholder="e.g., First month-end close completed within 5 business days. DCAA timekeeping module fully operational by go-live."></textarea></div></div></div>
    <div class="charter-section"><div class="cs-title">Decision Authority</div><table class="charter-table"><thead class="ct-head"><tr><th>Decision Type</th><th>Decision Maker</th><th>Escalation Path</th></tr></thead><tbody>${['Scope changes','Budget changes','Go-live date changes','Configuration decisions (accounting)','Vendor dispute / escalation'].map(d=>`<tr><td style="font-weight:500;">${d}</td><td><input class="ct-input" placeholder="Name / role"></td><td><input class="ct-input" placeholder="Escalate to..."></td></tr>`).join('')}</tbody></table></div>
    <div class="charter-section"><div class="cs-title">Key Milestones</div><table class="charter-table"><thead class="ct-head"><tr><th>Milestone</th><th>Target Date</th><th>Owner</th><th>Status</th></tr></thead><tbody>${['Requirements Complete','RFI Responses Received','Vendor Selected','Contract Signed','Data Migration Mock Complete','UAT Sign-off','Go-Live','First Month-End Close','Project Closeout'].map(m=>`<tr><td style="font-weight:500;">${m}</td><td><input class="ct-input" type="date"></td><td><input class="ct-input" placeholder="Owner"></td><td><select class="ct-input"><option>—</option><option>Not Started</option><option>In Progress</option><option>Complete</option><option>At Risk</option><option>Delayed</option></select></td></tr>`).join('')}</tbody></table></div>`;

  // Contract review
  const contractData=[
    {title:'Subscription & Pricing Terms',items:[
      {label:'Annual price increase is capped',type:'NEGOTIATE',note:'Require a specific cap (CPI or 3–5%) on annual subscription increases.'},
      {label:'Auto-renewal notice period is at least 90 days',type:'NEGOTIATE',note:'Vendor standard is often 30–60 days. Request 90 days minimum.'},
      {label:'All Year 1 costs are itemized — no "TBD" line items',type:'CRITICAL',note:'Any cost marked "to be determined" after signing will be determined in the vendor\'s favor.'},
      {label:'User tier pricing is clearly defined',type:'',note:'Clarify whether "users" means named, concurrent, or administrator users, and the cost increment for adding users.'},
    ]},
    {title:'Implementation & SOW Terms',items:[
      {label:'SOW includes a detailed list of deliverables and acceptance criteria',type:'CRITICAL',note:'Vague SOWs are unenforceable. Require specific deliverables with measurable acceptance criteria.'},
      {label:'Named implementation PM is identified or PM assignment process is specified',type:'NEGOTIATE',note:'Request right of approval over PM assignment and continuity commitment.'},
      {label:'Change order process is defined',type:'',note:'Without a defined change order process, every scope question becomes a dispute.'},
      {label:'Go-live definition and vendor obligations at go-live are specified',type:'CRITICAL',note:'Include a hypercare commitment and the vendor\'s obligations if go-live is delayed due to their failure.'},
    ]},
    {title:'Data Rights & Security',items:[
      {label:'Data portability clause — you can export all your data at any time',type:'CRITICAL',note:'Non-negotiable. If the vendor does not allow complete data export, do not sign.'},
      {label:'Data ownership is clearly assigned to your organization',type:'CRITICAL',note:'Your financial data belongs to you. The contract must explicitly state you own all data entered.'},
      {label:'Data retention and deletion policy at contract termination is specified',type:'',note:'How long does the vendor retain your data after you leave?'},
    ]},
    {title:'Support & Service Levels',items:[
      {label:'Support SLA is defined by priority level with response and resolution time commitments',type:'',note:'Critical/production-down issues should have a 1–4 hour response SLA.'},
      {label:'Uptime SLA is specified with remedies for downtime',type:'NEGOTIATE',note:'99.5% uptime is the minimum acceptable for a financial system.'},
    ]},
    {title:'Exit & Termination Terms',items:[
      {label:'Termination for cause provisions are defined and fair to both parties',type:'CRITICAL',note:'You should be able to terminate without penalty if the vendor fails to deliver per the SOW.'},
      {label:'Early termination fees are reasonable — not more than 1 year of remaining subscription',type:'NEGOTIATE',note:'Negotiate a cap on early termination fees.'},
      {label:'Transition assistance is specified post-termination',type:'',note:'Request 90 days of transition support including export of all data in a usable format.'},
    ]},
  ];
  const ctBody=document.getElementById('t6-contract-body');
  contractData.forEach(cat=>{
    const div=document.createElement('div'); div.className='contract-category';
    div.innerHTML=`<div class="cc-title">${cat.title}</div>${cat.items.map(it=>`<div class="contract-item"><input type="checkbox" class="ci-check"><div><div class="ci-label">${it.label}${it.type==='CRITICAL'?'<span class="ci-critical">CRITICAL</span>':it.type==='NEGOTIATE'?'<span class="ci-negotiate">NEGOTIATE</span>':''}</div><div class="ci-note">${it.note}</div></div></div>`).join('')}`;
    ctBody.appendChild(div);
  });

  // Go-live items
  const glData={
    'System Configuration & Testing':[
      {label:'Chart of accounts fully configured and reconciled to current system',blocker:true},
      {label:'All required modules configured per implementation SOW',blocker:true},
      {label:'User roles and permissions tested — segregation of duties verified',blocker:true},
      {label:'All required integrations tested end-to-end with production-like data',blocker:true},
      {label:'User Acceptance Testing complete — all test scripts signed off',blocker:true},
    ],
    'Data Migration':[
      {label:'Mock migration completed in sandbox — all balances reconciled',blocker:true},
      {label:'Opening balance sheet as of cutoff date verified and reconciled',blocker:true},
      {label:'Open AR and AP balances migrated and aged correctly',blocker:true},
      {label:'Data cutoff date confirmed and communicated to all staff',blocker:true},
    ],
    'Training & User Readiness':[
      {label:'All end users have completed role-based training',blocker:true},
      {label:'Quick reference guides distributed for common workflows',blocker:false},
      {label:'Internal super-users identified and trained for first-line support',blocker:false},
    ],
    'Support & Contingency':[
      {label:'Vendor hypercare support contacts and escalation paths documented',blocker:true},
      {label:'Rollback / contingency plan documented if critical go-live failure occurs',blocker:true},
      {label:'Go-live communication sent to all staff and stakeholders',blocker:false},
      {label:'Post-go-live check-in schedule established (Day 7, 14, 30)',blocker:false},
    ],
  };
  const glBody=document.getElementById('t6-golive-body');
  Object.entries(glData).forEach(([groupName, items])=>{
    const div=document.createElement('div'); div.className='golive-group';
    div.innerHTML=`<div class="gg-title">${groupName}</div>${items.map((item,i)=>`<div class="gl-item"><div class="gl-radio-wrap"><div class="gl-radio"><label><input type="radio" name="gl_${groupName.replace(/\s/g,'_')}_${i}" value="yes"> Ready</label><label><input type="radio" name="gl_${groupName.replace(/\s/g,'_')}_${i}" value="no"> Not Ready</label><label><input type="radio" name="gl_${groupName.replace(/\s/g,'_')}_${i}" value="na"> N/A</label></div></div><div><div class="gl-label">${item.label} ${item.blocker?'<span class="gl-blocker">BLOCKER</span>':''}</div></div></div>`).join('')}`;
    glBody.appendChild(div);
  });

  // Failure modes
  const failures=[
    {num:1,title:'Selecting a System Before Documenting Requirements',cat:'Phase: Selection',desc:'Organizations select an ERP based on demo impressions or vendor reputation — then discover after signing that the system doesn\'t meet their operational needs.',prevent:'Complete Tool 01 (Requirements Scorecard) before scheduling any demos. Every demo should be evaluated against your documented requirements, not on its own terms.'},
    {num:2,title:'No Internal Project Owner with Real Authority',cat:'Phase: Implementation',desc:'Implementations assigned as a "side project" consistently fail or overrun. Without explicit authority to make decisions and hold the vendor accountable, everything slows down.',prevent:'Name a Project Lead in your charter with dedicated time, explicit decision authority, and executive sponsorship.'},
    {num:3,title:'Underestimating Data Migration Complexity',cat:'Phase: Implementation',desc:'Organizations assume data migration is technical and delegate it entirely to the vendor — without cleaning the underlying data first. Every quality issue in the old system carries over to the new one.',prevent:'Complete Tool 05 (Data Migration Readiness Audit) 8–10 weeks before go-live. Run a full mock migration in the sandbox environment and reconcile before the production cutover.'},
    {num:4,title:'Signing a Vague or One-Sided Implementation SOW',cat:'Phase: Contract',desc:'SOWs that describe deliverables as "implement the accounting module" give the vendor maximum flexibility to declare success prematurely.',prevent:'Require a deliverable-based SOW with specific acceptance criteria. Use the Contract Review Checklist (Tab 3) before signing anything.'},
    {num:5,title:'Going Live Without Completing User Acceptance Testing',cat:'Phase: Go-Live',desc:'UAT is routinely compressed or skipped under schedule pressure. The result: broken workflows on go-live day, workarounds proliferate, and the system configuration degrades.',prevent:'Make UAT completion a hard go-live gate in your project charter. Assign specific users to test specific workflows — not generic "can you log in and click around" testing.'},
    {num:6,title:'Treating Compliance Configuration as an Afterthought',cat:'Phase: Configuration (GovCon)',desc:'For government contractors, the DCAA-required accounting system configuration is typically addressed late in the implementation. Retrofitting compliance is far more expensive than building it in from the start.',prevent:'Complete Tool 03 (DCAA Readiness Guide) before implementation begins. Share your SF 1408 requirements with the implementation PM in the kickoff meeting.'},
    {num:7,title:'Insufficient End-User Training',cat:'Phase: Pre-Go-Live',desc:'A single "train the trainer" session 3 days before go-live is not a training program. It\'s a recipe for shadow spreadsheets and a finance team that spent $200K on software they don\'t know how to use.',prevent:'Build a training plan by role, not by module. Require at least 2 weeks between training completion and go-live. Make training completion a go-live gate item.'},
    {num:8,title:'Scope Creep Without Formal Change Management',cat:'Phase: Implementation',desc:'"While we\'re in there, can we also add..." is the most expensive sentence in ERP implementations.',prevent:'Define your out-of-scope list in the project charter and enforce it. Any scope addition requires a written change order approved by the executive sponsor before work begins.'},
    {num:9,title:"Assuming the Vendor's TCO Estimate Is Complete",cat:'Phase: Selection',desc:'Vendor quotes consistently exclude: internal staff time, productivity loss, integration development, data cleanup, and Year 2–3 subscription increases.',prevent:'Build your own TCO model using Tool 02 before making any selection decision. Include internal labor, training time, productivity loss, and recurring costs for all three years.'},
    {num:10,title:'Disbanding the Project Team at Go-Live',cat:'Phase: Post-Go-Live',desc:'The most critical period is the 60–90 days after go-live — when users encounter real transactions, edge cases appear, and vendor hypercare closes.',prevent:'Keep the Project Lead engaged through the first full quarter-end close. Schedule post-go-live check-ins at Day 14, 30, 60, and 90.'},
  ];
  const fb=document.getElementById('t6-failures-body');
  failures.forEach(f=>{
    const div=document.createElement('div'); div.className='failure-card';
    div.innerHTML=`<div class="failure-header"><div class="failure-rank">${f.num}</div><div><div class="failure-title">${f.title}</div><div class="failure-category">${f.cat}</div></div></div><div class="failure-desc">${f.desc}</div><div class="failure-prevent"><div class="fp-label">How to Prevent It</div><div class="fp-text">${f.prevent}</div></div>`;
    fb.appendChild(div);
  });
}
function t6ScoreGoLive(){
  let ready=0,notReady=0,blockersFailed=0,total=0;
  document.querySelectorAll('#t6-golive-body .gl-item').forEach((item,i)=>{
    const inputs=item.querySelectorAll('input[type=radio]');
    let val='';
    inputs.forEach(inp=>{ if(inp.checked)val=inp.value; });
    if(!val||val==='na')return;
    total++;
    if(val==='yes')ready++;
    else{ notReady++; if(item.querySelector('.gl-blocker'))blockersFailed++; }
  });
  const pct=total>0?Math.round(ready/total*100):0;
  const sw=document.getElementById('t6-golive-score');
  const sc=document.getElementById('t6-gsw-score');
  const vd=document.getElementById('t6-gsw-verdict');
  const it=document.getElementById('t6-gsw-items');
  sc.textContent=`${pct}%`;
  if(blockersFailed>0){sc.style.color='var(--signal)';vd.style.color='var(--signal)';vd.textContent=`⛔ DO NOT PROCEED — ${blockersFailed} blocker item${blockersFailed>1?'s':''} not ready`;}
  else if(pct>=85){sc.style.color='var(--teal)';vd.style.color='var(--teal)';vd.textContent='✓ CLEARED FOR GO-LIVE';}
  else if(pct>=70){sc.style.color='#e8a020';vd.style.color='#e8a020';vd.textContent='⚠ CONDITIONAL — review non-ready items before proceeding';}
  else{sc.style.color='var(--signal)';vd.style.color='var(--signal)';vd.textContent='⛔ NOT READY — significant gaps remain';}
  it.textContent=`${ready} of ${total} items ready · ${notReady} not ready · ${blockersFailed} blockers`;
  sw.style.display='block';
  sw.scrollIntoView({behavior:'smooth',block:'nearest'});
}


// DASH_STATE — initialized here, wrapping done in app.js
const DASH_STATE = { scorecard: null, tco: null, golive: null };

function dashCaptureScorecard() {
  const names = ['t1v1name','t1v2name','t1v3name'].map((id,i)=>document.getElementById(id)?.value||['Vendor A','Vendor B','Vendor C'][i]);
  const totals=[0,0,0], maxP=[0,0,0];
  const secTotals = T1_SECTIONS.map(sec => {
    const st=[0,0,0];
    sec.criteria.forEach((c,ci)=>[0,1,2].forEach(vi=>{
      const val=document.getElementById(`t1s${sec.id}c${ci}v${vi+1}`)?.value;
      if(val&&val!=='na'){st[vi]+=parseInt(val)*c.weight;totals[vi]+=parseInt(val)*c.weight;maxP[vi]+=4*c.weight;}
    }));
    return st;
  });
  DASH_STATE.scorecard = { names, totals, maxP, secTotals };
}

function dashCaptureTCO() {
  const names = ['t2v1name','t2v2name','t2v3name'].map((id,i)=>document.getElementById(id)?.value||['Vendor A','Vendor B','Vendor C'][i]);
  const internal = t2GetVal('t2lead-rate')*t2GetVal('t2lead-hrs')+t2GetVal('t2train-hrs')*t2GetVal('t2staff-rate')+t2GetVal('t2data-hrs')*t2GetVal('t2staff-rate')+t2GetVal('t2prod-loss');
  const tcos = [1,2,3].map(v=>{
    const y1=T2_Y1.reduce((s,_,i)=>s+t2GetVal(`t2y1-body_${i}_v${v}`),0);
    const y23=T2_Y23.reduce((s,_,i)=>s+t2GetVal(`t2y23-body_${i}_v${v}`),0);
    return{name:names[v-1],total3yr:y1+y23*2+internal};
  });
  DASH_STATE.tco = { names, tcos };
}

function dashCaptureGoLive() {
  let ready=0,notReady=0,blockersFailed=0,total=0;
  document.querySelectorAll('#t6-golive-body .gl-item').forEach(item=>{
    let val='';
    item.querySelectorAll('input[type=radio]').forEach(inp=>{if(inp.checked)val=inp.value;});
    if(!val||val==='na')return;
    total++;
    if(val==='yes')ready++;
    else{notReady++;if(item.querySelector('.gl-blocker'))blockersFailed++;}
  });
  DASH_STATE.golive={pct:total>0?Math.round(ready/total*100):0,blockersFailed,notReady,total,ready};
}

function dashRefresh() {
  renderScorecardWidget();
  renderTCOWidget();
  renderGoLiveWidget();
  updateProgressStrip();
}

function updateProgressStrip() {
  if(DASH_STATE.scorecard){
    const el=document.getElementById('pill-t1'),st=document.getElementById('pill-t1-status');
    if(el)el.classList.add('complete');
    const wi=DASH_STATE.scorecard.totals.indexOf(Math.max(...DASH_STATE.scorecard.totals));
    if(st)st.textContent='· Winner: '+DASH_STATE.scorecard.names[wi];
  }
  if(DASH_STATE.tco){
    const el=document.getElementById('pill-t2'),st=document.getElementById('pill-t2-status');
    if(el)el.classList.add('complete');
    const valid=DASH_STATE.tco.tcos.filter(t=>t.total3yr>0);
    if(valid.length&&st){const mi=valid.reduce((a,b)=>a.total3yr<=b.total3yr?a:b);st.textContent='· Lowest: '+mi.name;}
  }
  if(DASH_STATE.golive){
    const el=document.getElementById('pill-t6'),st=document.getElementById('pill-t6-status');
    if(el)el.classList.add(DASH_STATE.golive.blockersFailed>0?'has-data':'complete');
    if(st)st.textContent='· '+DASH_STATE.golive.pct+'% ready'+(DASH_STATE.golive.blockersFailed>0?' · '+DASH_STATE.golive.blockersFailed+' blockers':'');
  }
}

function renderScorecardWidget() {
  const d=DASH_STATE.scorecard; if(!d)return;
  const maxScore=Math.max(...d.totals);
  const wi=d.totals.indexOf(maxScore);
  const barColors=['var(--action)','var(--action-dark)','var(--teal)'];
  let html=`<div class="sc-winner">★ Leading: ${d.names[wi]} — ${d.totals[wi]} pts</div>
    <div class="sc-vendor-tabs">${d.names.map((n,i)=>`<div class="sc-vtab${i===0?' active':''}" onclick="dashScorecardTab(${i})" id="sc-vtab-${i}">${n}</div>`).join('')}</div>
    ${d.names.map((n,vi)=>{
      return `<div class="sc-bars" id="sc-bars-${vi}" style="${vi===0?'':'display:none'}">
        ${T1_SECTIONS.map((sec,si)=>{
          const s=d.secTotals[si][vi];
          let maxSec=0;
          sec.criteria.forEach((c,ci)=>{const v=document.getElementById(`t1s${sec.id}c${ci}v${vi+1}`)?.value;if(v&&v!=='na')maxSec+=4*c.weight;});
          const pct=maxSec>0?Math.round(s/maxSec*100):0;
          return `<div class="sc-bar-row"><div class="sc-bar-lbl">${sec.name}</div><div class="sc-bar-wrap"><div class="sc-bar-fill" style="width:${pct}%;background:${barColors[vi]}"></div></div><div class="sc-bar-score">${s} pts</div></div>`;
        }).join('')}
        <div class="sc-total"><div class="sc-total-lbl">Total Score</div><div class="sc-total-score" style="color:${barColors[vi]}">${d.totals[vi]} / ${d.maxP[vi]}</div></div>
      </div>`;
    }).join('')}`;
  document.getElementById('dash-scorecard-content').innerHTML=html;
}

function dashScorecardTab(idx){
  document.querySelectorAll('.sc-vtab').forEach((t,i)=>t.className='sc-vtab'+(i===idx?' active':''));
  [0,1,2].forEach(i=>{const el=document.getElementById(`sc-bars-${i}`);if(el)el.style.display=i===idx?'':'none';});
}

function renderTCOWidget() {
  const d=DASH_STATE.tco; if(!d)return;
  const valid=d.tcos.filter(t=>t.total3yr>0); if(!valid.length)return;
  const maxTCO=Math.max(...d.tcos.map(t=>t.total3yr));
  const minTCO=Math.min(...valid.map(t=>t.total3yr));
  const barColors=['var(--action)','var(--action-dark)','var(--teal)'];
  const savings=maxTCO-minTCO;
  const lowestName=d.tcos.find(t=>t.total3yr===minTCO)?.name||'';
  let html=`<div class="tco-bars">${d.tcos.map((t,i)=>{
    if(!t.total3yr)return'';
    const pct=maxTCO>0?Math.round(t.total3yr/maxTCO*100):0;
    const isLow=t.total3yr===minTCO,isHigh=t.total3yr===maxTCO&&maxTCO!==minTCO;
    const tag=isLow?'<span style="font-size:10px;background:var(--green-pale);color:var(--teal);padding:1px 7px;border-radius:3px;margin-left:6px;">LOWEST</span>':isHigh?'<span style="font-size:10px;background:var(--red-pale);color:var(--signal);padding:1px 7px;border-radius:3px;margin-left:6px;">HIGHEST</span>':'';
    return `<div class="tco-bar-row"><div class="tco-bar-hdr"><div class="tco-bar-name">${t.name}${tag}</div><div class="tco-bar-amt">${t2Fmt(t.total3yr)}</div></div><div class="tco-bar-wrap"><div class="tco-bar-fill" style="width:${pct}%;background:${isLow?'var(--teal)':isHigh?'var(--signal)':barColors[i]}"></div></div></div>`;
  }).join('')}</div>
  ${savings>0?`<div class="tco-delta"><strong>${lowestName}</strong> saves <strong>${t2Fmt(savings)}</strong> over 3 years vs. the highest-cost option.</div>`:''}`;
  document.getElementById('dash-tco-content').innerHTML=html;
}

function renderGoLiveWidget() {
  const d=DASH_STATE.golive; if(!d)return;
  let color,verdict,alertHtml;
  if(d.blockersFailed>0){color='var(--signal)';verdict=`⛔ Do Not Proceed — ${d.blockersFailed} blocker${d.blockersFailed>1?'s':''} unresolved`;alertHtml=`<div class="gl-alert blocker">⚠ ${d.blockersFailed} BLOCKER item${d.blockersFailed>1?'s':''} not ready. Must be resolved before go-live.</div>`;}
  else if(d.pct>=85){color='var(--teal)';verdict='✓ Cleared for Go-Live';alertHtml=`<div class="gl-alert ok">✓ All blocker items ready. You are cleared to proceed.</div>`;}
  else if(d.pct>=70){color='#e8a020';verdict='⚠ Conditional — review non-ready items';alertHtml=`<div class="gl-alert warn">${d.notReady} items not yet ready. Review before proceeding.</div>`;}
  else{color='var(--signal)';verdict='⛔ Not Ready — significant gaps remain';alertHtml=`<div class="gl-alert blocker">${d.notReady} of ${d.total} items not ready.</div>`;}
  document.getElementById('dash-golive-content').innerHTML=`
    <div class="gl-gauge">
      <div class="gl-big-score" style="color:${color}">${d.pct}%</div>
      <div class="gl-meta">
        <div class="gl-verdict" style="color:${color}">${verdict}</div>
        <div class="gl-detail">${d.ready} of ${d.total} items ready · ${d.notReady} not ready · ${d.blockersFailed} blockers</div>
        <div class="gl-track"><div class="gl-fill" style="width:${d.pct}%;background:${color}"></div></div>
      </div>
    </div>
    ${alertHtml}
    <div style="margin-top:14px;font-size:12px;"><span style="cursor:pointer;color:var(--action);text-decoration:underline;" onclick="switchTool('t6');setTimeout(()=>switchInnerTab('t6','golive'),100)">Open Go-Live Assessment to update →</span></div>`;
}

function toggleHtu(){
  document.getElementById('htu-toggle').classList.toggle('open');
  document.getElementById('htu-body').classList.toggle('open');
}

function dashPrint(){ window.print(); }
// ============================================================
// USER GUIDE — SEARCH & SCROLL-SPY
// ============================================================
(function(){
  var ugMatches = [], ugMatchIdx = 0;

  function ugGetBody(){return document.getElementById('ug-body');}

  function ugClearMarks(body){
    body.querySelectorAll('mark.ug-hit').forEach(function(m){
      var p = m.parentNode;
      p.replaceChild(document.createTextNode(m.textContent), m);
      p.normalize();
    });
    ugMatches = []; ugMatchIdx = 0;
    var ctr = document.getElementById('ug-search-counter');
    if(ctr) ctr.textContent = '';
  }

  window.ugClearSearch = function(){
    var inp = document.getElementById('ug-search-input');
    if(inp) inp.value = '';
    var body = ugGetBody();
    if(body) ugClearMarks(body);
  };

  function ugWalkTextNodes(node, term, marks){
    if(node.nodeType === 3){
      var idx = node.textContent.toLowerCase().indexOf(term);
      if(idx === -1) return;
      var before = document.createTextNode(node.textContent.slice(0, idx));
      var mark = document.createElement('mark');
      mark.className = 'ug-hit';
      mark.textContent = node.textContent.slice(idx, idx + term.length);
      mark.style.cssText = 'background:#ffe066;color:#1C2B35;border-radius:2px;padding:0 1px;';
      var after = document.createTextNode(node.textContent.slice(idx + term.length));
      var frag = document.createDocumentFragment();
      frag.appendChild(before); frag.appendChild(mark); frag.appendChild(after);
      node.parentNode.replaceChild(frag, node);
      marks.push(mark);
      if(after.textContent) ugWalkTextNodes(after, term, marks);
    } else if(node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE'){
      Array.from(node.childNodes).forEach(function(c){ ugWalkTextNodes(c, term, marks); });
    }
  }

  window.ugSearch = function(){
    var inp = document.getElementById('ug-search-input');
    var body = ugGetBody();
    if(!inp || !body) return;
    ugClearMarks(body);
    var term = inp.value.trim().toLowerCase();
    if(term.length < 2) return;
    ugWalkTextNodes(body, term, ugMatches);
    ugMatchIdx = 0;
    ugUpdateCounter();
    if(ugMatches.length) ugScrollToMatch(0);
  };

  window.ugNavSearch = function(dir){
    if(!ugMatches.length) return;
    ugMatchIdx = (ugMatchIdx + dir + ugMatches.length) % ugMatches.length;
    ugScrollToMatch(ugMatchIdx);
    ugUpdateCounter();
  };

  function ugScrollToMatch(i){
    ugMatches.forEach(function(m){ m.style.background='#ffe066'; m.style.outline=''; });
    if(ugMatches[i]){
      ugMatches[i].style.background='#ffb700';
      ugMatches[i].style.outline='2px solid #e8720c';
      ugMatches[i].scrollIntoView({behavior:'smooth', block:'center'});
    }
  }

  function ugUpdateCounter(){
    var ctr = document.getElementById('ug-search-counter');
    if(!ctr) return;
    ctr.textContent = ugMatches.length ? (ugMatchIdx+1)+' / '+ugMatches.length : 'No matches';
  }

  // Scroll-spy for TOC
  function ugSpySetup(){
    var panel = document.getElementById('panel-help');
    if(!panel) return;
    var anchors = Array.from(panel.querySelectorAll('[id^="ug-"]'));
    panel.addEventListener('scroll', function(){
      var scrollY = panel.scrollTop + 140;
      var active = null;
      anchors.forEach(function(a){
        if(a.offsetTop <= scrollY) active = a;
      });
      panel.querySelectorAll('.ug-toc-link').forEach(function(l){ l.style.color=''; l.style.borderLeftColor='transparent'; l.style.fontWeight=''; });
      if(active){
        var link = panel.querySelector('.ug-toc-link[href="#'+active.id+'"]');
        if(link){ link.style.color='var(--action-dark)'; link.style.borderLeftColor='var(--action-dark)'; link.style.fontWeight='600'; }
      }
    }, {passive:true});
  }

  document.addEventListener('DOMContentLoaded', ugSpySetup);
  // Also try after a short delay in case DOM is ready
  setTimeout(ugSpySetup, 500);
})();
(function(){
  var ugMatches = [], ugMatchIdx = 0;

  function ugGetBody(){return document.getElementById('ug-body');}

  function ugClearMarks(body){
    body.querySelectorAll('mark.ug-hit').forEach(function(m){
      var p = m.parentNode;
      p.replaceChild(document.createTextNode(m.textContent), m);
      p.normalize();
    });
    ugMatches = []; ugMatchIdx = 0;
    var ctr = document.getElementById('ug-search-counter');
    if(ctr) ctr.textContent = '';
  }

  window.ugClearSearch = function(){
    var inp = document.getElementById('ug-search-input');
    if(inp) inp.value = '';
    var body = ugGetBody();
    if(body) ugClearMarks(body);
  };

  function ugWalkTextNodes(node, term, marks){
    if(node.nodeType === 3){
      var idx = node.textContent.toLowerCase().indexOf(term);
      if(idx === -1) return;
      var before = document.createTextNode(node.textContent.slice(0, idx));
      var mark = document.createElement('mark');
      mark.className = 'ug-hit';
      mark.textContent = node.textContent.slice(idx, idx + term.length);
      mark.style.cssText = 'background:#ffe066;color:#1C2B35;border-radius:2px;padding:0 1px;';
      var after = document.createTextNode(node.textContent.slice(idx + term.length));
      var frag = document.createDocumentFragment();
      frag.appendChild(before); frag.appendChild(mark); frag.appendChild(after);
      node.parentNode.replaceChild(frag, node);
      marks.push(mark);
      if(after.textContent) ugWalkTextNodes(after, term, marks);
    } else if(node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE'){
      Array.from(node.childNodes).forEach(function(c){ ugWalkTextNodes(c, term, marks); });
    }
  }

  window.ugSearch = function(){
    var inp = document.getElementById('ug-search-input');
    var body = ugGetBody();
    if(!inp || !body) return;
    ugClearMarks(body);
    var term = inp.value.trim().toLowerCase();
    if(term.length < 2) return;
    ugWalkTextNodes(body, term, ugMatches);
    ugMatchIdx = 0;
    ugUpdateCounter();
    if(ugMatches.length) ugScrollToMatch(0);
  };

  window.ugNavSearch = function(dir){
    if(!ugMatches.length) return;
    ugMatchIdx = (ugMatchIdx + dir + ugMatches.length) % ugMatches.length;
    ugScrollToMatch(ugMatchIdx);
    ugUpdateCounter();
  };

  function ugScrollToMatch(i){
    ugMatches.forEach(function(m){ m.style.background='#ffe066'; m.style.outline=''; });
    if(ugMatches[i]){
      ugMatches[i].style.background='#ffb700';
      ugMatches[i].style.outline='2px solid #e8720c';
      ugMatches[i].scrollIntoView({behavior:'smooth', block:'center'});
    }
  }

  function ugUpdateCounter(){
    var ctr = document.getElementById('ug-search-counter');
    if(!ctr) return;
    ctr.textContent = ugMatches.length ? (ugMatchIdx+1)+' / '+ugMatches.length : 'No matches';
  }

  // Scroll-spy for TOC
  function ugSpySetup(){
    var panel = document.getElementById('panel-help');
    if(!panel) return;
    var anchors = Array.from(panel.querySelectorAll('[id^="ug-"]'));
    panel.addEventListener('scroll', function(){
      var scrollY = panel.scrollTop + 140;
      var active = null;
      anchors.forEach(function(a){
        if(a.offsetTop <= scrollY) active = a;
      });
      panel.querySelectorAll('.ug-toc-link').forEach(function(l){ l.style.color=''; l.style.borderLeftColor='transparent'; l.style.fontWeight=''; });
      if(active){
        var link = panel.querySelector('.ug-toc-link[href="#'+active.id+'"]');
        if(link){ link.style.color='var(--action-dark)'; link.style.borderLeftColor='var(--action-dark)'; link.style.fontWeight='600'; }
      }
    }, {passive:true});
  }

  document.addEventListener('DOMContentLoaded', ugSpySetup);
  // Also try after a short delay in case DOM is ready
  setTimeout(ugSpySetup, 500);
})();
