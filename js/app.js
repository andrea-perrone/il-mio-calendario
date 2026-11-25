(function(){
'use strict';
var HOUR=56;
var WD=['lun','mar','mer','gio','ven','sab','dom'];
var MONTHS=['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
var $=function(id){return document.getElementById(id);};
var pad=function(n){return String(n).padStart(2,'0');};
var ymd=function(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());};
var fromYmd=function(s){var p=s.split('-').map(Number);return new Date(p[0],p[1]-1,p[2]);};
var addDays=function(d,n){return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);};
var startOfWeek=function(d){return addDays(d,-((d.getDay()+6)%7));};
var midnight=function(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate());};
var dayDiff=function(a,b){return Math.round((Date.UTC(b.getFullYear(),b.getMonth(),b.getDate())-Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()))/86400000);};
var toMin=function(t){if(!t)return 0;var p=t.split(':').map(Number);return p[0]*60+(p[1]||0);};
var fromMin=function(m){m=Math.max(0,Math.min(m,23*60+59));return pad(Math.floor(m/60))+':'+pad(m%60);};
var fT=function(t){if(!t)return '';var p=t.split(':');return (+p[0])+':'+p[1];};
var fmt=function(d,o){return new Intl.DateTimeFormat('it-IT',o).format(d);};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
var newId=function(){return 'e'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);};
var isHex=function(c){return typeof c==='string'&&/^#[0-9a-fA-F]{6}$/.test(c);};
var cssColor=function(c){return /^[#a-zA-Z0-9(),.%\s-]{1,40}$/.test(c||'')?c:'';};
var root=document.documentElement;

var ICON={
  lock:'<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M5 7V5a3 3 0 1 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v4a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 12.5v-4A1.5 1.5 0 0 1 4.5 7H5Zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2Z" fill="currentColor"/></svg>',
  rep:'<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M3 6.5A5 5 0 0 1 12.2 4M13 9.5A5 5 0 0 1 3.8 12M12.5 1.5V4.5H9.5M3.5 14.5v-3h3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pin:'<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M8 15s5-4.6 5-8.5A5 5 0 0 0 3 6.5C3 10.4 8 15 8 15Zm0-6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="currentColor" fill-rule="evenodd"/></svg>',
  plus:'<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  day:'<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  search:'<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m10.5 10.5 3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
};
var REPS=[['none','Mai'],['daily','Ogni giorno'],['weekly','Ogni settimana'],['monthly','Ogni mese'],['yearly','Ogni anno']];
var REP_TXT={daily:'Ogni giorno',weekly:'Ogni settimana',monthly:'Ogni mese',yearly:'Ogni anno'};
var EMOJIS=['','❤️','🍽️','💼','🏠','🛒','🎉','✈️','🚗','🏋️','⚽','🩺','🎂','🎬','📚','☕','🐶','🏔️','🏖️','💡'];
var FIELDS=['title','date','endDate','extraDates','allDay','start','end','place','notes','emoji','repeat','vis','by'];

/* ---------- looks ---------- */
var FONTS={
  moderno:{n:'Moderno',d:"'Bricolage Grotesque'",b:"'Hanken Grotesk'",fb:'sans-serif',fams:[]},
  editoriale:{n:'Editoriale',d:"'Fraunces'",b:"'DM Sans'",fb:'serif',fams:['Fraunces:opsz,wght@9..144,600;9..144,700','DM Sans:opsz,wght@9..40,400;9..40,600;9..40,700']},
  elegante:{n:'Elegante',d:"'Playfair Display'",b:"'Source Sans 3'",fb:'serif',fams:['Playfair Display:wght@600;700','Source Sans 3:wght@400;600;700']},
  libro:{n:'Libro',d:"'Bitter'",b:"'Bitter'",fb:'serif',fams:['Bitter:wght@400;600;700']},
  rotondo:{n:'Rotondo',d:"'Quicksand'",b:"'Nunito'",fb:'sans-serif',fams:['Quicksand:wght@500;600;700','Nunito:wght@400;600;700;800']},
  mano:{n:'Scritto a mano',d:"'Caveat'",b:"'Nunito'",fb:'cursive',fams:['Caveat:wght@600;700','Nunito:wght@400;600;700;800']},
  script:{n:'Corsivo',d:"'Pacifico'",b:"'Rubik'",fb:'cursive',fams:['Pacifico','Rubik:wght@400;500;600;700;800']},
  retro:{n:'Retrò',d:"'Righteous'",b:"'Lexend'",fb:'sans-serif',fams:['Righteous','Lexend:wght@400;500;600;700;800']},
  pixel:{n:'Pixel',d:"'VT323'",b:"'IBM Plex Mono'",fb:'monospace',fams:['VT323','IBM Plex Mono:wght@400;500;600;700']},
  macchina:{n:'Macchina da scrivere',d:"'IBM Plex Mono'",b:"'IBM Plex Mono'",fb:'monospace',fams:['IBM Plex Mono:wght@400;500;600;700']},
  deciso:{n:'Deciso',d:"'Archivo Black'",b:"'Archivo'",fb:'sans-serif',fams:['Archivo Black','Archivo:wght@400;500;600;700;800']},
  pulito:{n:'Pulito',d:"'Manrope'",b:"'Manrope'",fb:'sans-serif',fams:['Manrope:wght@400;600;700;800']},
  sistema:{n:'Sistema',d:"system-ui",b:"system-ui",fb:'sans-serif',fams:[]}
};
var loadedFams={'Bricolage Grotesque':1,'Hanken Grotesk':1};
function loadFonts(keys){
  var fams=[];
  keys.forEach(function(k){var f=FONTS[k];if(!f)return;f.fams.forEach(function(x){var nm=x.split(':')[0];if(!loadedFams[nm]){loadedFams[nm]=1;fams.push(x);}});});
  if(!fams.length) return;
  var l=document.createElement('link');l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?'+fams.map(function(x){return 'family='+x.replace(/ /g,'+');}).join('&')+'&display=swap';
  document.head.appendChild(l);
}
function fontStack(f,which){return (which==='d'?f.d:f.b)+",'Segoe UI',system-ui,"+f.fb;}

var SHAPES={
  bar:{n:'Barra',ds:'Striscia di colore',v:{pct:'20%',bar:'3px',ring:'0px',r:'var(--re)',dot:'none'}},
  fill:{n:'Pieno',ds:'Blocco colorato',v:{pct:'30%',bar:'0px',ring:'0px',r:'var(--re)',dot:'none'}},
  outline:{n:'Contorno',ds:'Solo il bordo',v:{pct:'0%',bar:'0px',ring:'1.5px',r:'var(--re)',dot:'none'}},
  pill:{n:'Pillola',ds:'Tutto arrotondato',v:{pct:'24%',bar:'0px',ring:'0px',r:'999px',dot:'none'}},
  square:{n:'Blocco',ds:'Spigoli vivi',v:{pct:'16%',bar:'5px',ring:'0px',r:'0px',dot:'none'}},
  dot:{n:'Punto',ds:'Pallino colorato',v:{pct:'8%',bar:'0px',ring:'0px',r:'var(--re)',dot:'block'}}
};
var THEMES={
  laguna:{n:'Laguna',ds:'Chiaro/scuro automatico',font:'moderno',shape:'bar',r:12,rc:8,re:6,bw:1,c:null,
    pv:['#EDF1F4','#FFFFFF','#F5F7F9','#D8DFE5','#16202A','#58677A','#0E6F73','#0A4F52','#D5EDEC','#FFFFFF']},
  quaderno:{n:'Quaderno',ds:'Carta e penna blu',font:'mano',shape:'square',r:4,rc:4,re:3,bw:1,
    c:['#F3F6FB','#FFFFFF','#F7F9FD','#C9D6EA','#1D2B4F','#5A6A8C','#2A5BD7','#1C3F99','#E1E9FB','#FFFFFF','#56607A','#EEF1F6','#DEE3EC','#C0392B','#E0457B']},
  notte:{n:'Notte alpina',ds:'Blu notte',font:'pulito',shape:'fill',r:16,rc:10,re:8,bw:1,dark:1,
    c:['#0B1020','#121A30','#18223D','#26314F','#E6EBFA','#9AA6C6','#7FB2FF','#BBD5FF','#1B2A4D','#0B1020','#A9B3CC','#1C2540','#26304F','#FF8A8A','#FF7AB6']},
  tramonto:{n:'Tramonto',ds:'Pesca e corallo',font:'editoriale',shape:'fill',r:18,rc:12,re:10,bw:1,
    c:['#FFF3EE','#FFFFFF','#FFF8F5','#F2D5CB','#3A1F1A','#8A6159','#E2574C','#A8352D','#FDE1DC','#FFFFFF','#7A6460','#F6ECE9','#EADBD6','#B3261E','#9B3FD1']},
  bosco:{n:'Bosco',ds:'Verde scuro',font:'libro',shape:'bar',r:6,rc:6,re:4,bw:1,dark:1,
    c:['#0F1A14','#15241C','#1B2D23','#284034','#E4EFE7','#98B1A2','#8FD19E','#C4EBCB','#1E3A2A','#0F1A14','#A9BDB0','#1D2C24','#26392E','#FF9C8F','#F5C06B']},
  brutale:{n:'Brutale',ds:'Bordi neri e giallo',font:'deciso',shape:'square',r:0,rc:0,re:0,bw:2,
    c:['#F4F4F0','#FFFFFF','#FFFBE0','#111111','#111111','#444444','#FFD400','#111111','#FFF1A6','#111111','#333333','#EEEEEE','#D9D9D9','#D00000','#FF3D00']},
  terminale:{n:'Terminale',ds:'Verde su nero',font:'pixel',shape:'outline',r:0,rc:0,re:0,bw:1,dark:1,
    c:['#050805','#0A110A','#0E180E','#1E3A1E','#B8FFB8','#6FBF6F','#39FF6A','#9DFFB3','#0F2A14','#031006','#7FB57F','#0E1A0E','#16281A','#FF6B6B','#FFE14D']},
  arcade:{n:'Arcade',ds:'Viola e neon',font:'retro',shape:'pill',r:10,rc:10,re:999,bw:1,dark:1,
    c:['#160B2E','#1F1140','#281752','#3B2672','#F3EAFF','#B9A6E0','#FF4FD8','#FFA6EC','#3A1650','#1A0624','#C2B4E3','#241446','#2F1C5A','#FF7A7A','#33E1FF']},
  lavanda:{n:'Lavanda',ds:'Lilla, tutto tondo',font:'rotondo',shape:'pill',r:20,rc:999,re:999,bw:1,
    c:['#F4F1FB','#FFFFFF','#F9F7FD','#E0D9F0','#2B2340','#6E6488','#7C5CD6','#5B3FB0','#ECE5FB','#FFFFFF','#6B6680','#F1EFF6','#E4E0EE','#C02E5A','#E05A9A']},
  ufficio:{n:'Ufficio',ds:'Grigio sobrio',font:'sistema',shape:'bar',r:4,rc:4,re:2,bw:1,
    c:['#F3F3F3','#FFFFFF','#FAFAFA','#E0E0E0','#242424','#616161','#0F6CBD','#0C3B5E','#EBF3FC','#FFFFFF','#5C5C5C','#F0F0F0','#E1E1E1','#C4314B','#C4314B']},
  mare:{n:'Mare',ds:'Acqua e spuma',font:'script',shape:'fill',r:16,rc:12,re:8,bw:1,
    c:['#E9F7F8','#FFFFFF','#F3FBFC','#CBE7EA','#12343A','#4C7178','#0A97A6','#066B76','#D3F0F3','#FFFFFF','#5A7175','#EBF2F3','#DAE6E8','#C0392B','#FF6B57']},
  caffe:{n:'Caffè',ds:'Marrone e caramello',font:'elegante',shape:'bar',r:8,rc:6,re:4,bw:1,dark:1,
    c:['#1C1410','#261B16','#2F221C','#44322A','#F3E7DD','#BFA898','#D9A066','#F1CFA8','#3D2A1E','#1C1410','#BCA99B','#2B201A','#372922','#FF9A86','#E8C07A']},
  ghiaccio:{n:'Ghiaccio',ds:'Bianco freddo',font:'pulito',shape:'dot',r:12,rc:10,re:6,bw:1,
    c:['#F7FAFC','#FFFFFF','#FBFDFE','#E3EBF1','#1B2833','#6B7C8A','#3B82C4','#275C8E','#E6F0F8','#FFFFFF','#6A7681','#F2F5F7','#E6EBEF','#C0392B','#E0457B']},
  sole:{n:'Sole',ds:'Giallo e arancio',font:'rotondo',shape:'pill',r:16,rc:999,re:999,bw:1,
    c:['#FFF8D6','#FFFDF0','#FFF6C7','#EBDD9A','#2A2410','#6E6430','#E07A00','#9C5400','#FFE9B8','#FFFFFF','#6C6650','#F7F0D6','#EDE3BE','#B3261E','#D6336C']},
  mono:{n:'Bianco e nero',ds:'Monocromo',font:'macchina',shape:'outline',r:2,rc:2,re:2,bw:1,
    c:['#FFFFFF','#FFFFFF','#F6F6F6','#E2E2E2','#0A0A0A','#6B6B6B','#0A0A0A','#0A0A0A','#EDEDED','#FFFFFF','#555555','#F2F2F2','#E3E3E3','#CC0000','#0A0A0A']},
  ciliegia:{n:'Ciliegia',ds:'Rosa e rosso',font:'script',shape:'pill',r:14,rc:999,re:999,bw:1,
    c:['#FFF0F3','#FFFFFF','#FFF7F9','#F6CCD6','#3D0F1C','#8C5263','#D1123F','#9A0C2E','#FFDCE4','#FFFFFF','#7D6168','#F7EBEE','#EDD9DF','#A1001F','#6B2FD1']},
  ardesia:{n:'Ardesia',ds:'Grigio scuro e ambra',font:'deciso',shape:'square',r:4,rc:4,re:0,bw:1,dark:1,
    c:['#15171A','#1D2024','#24282D','#353A41','#ECEEF0','#A0A7B0','#F2B23A','#FAD58A','#3A3020','#1A1406','#B0B6BE','#23272C','#2D3238','#FF8F86','#5FC8FF']},
  menta:{n:'Menta',ds:'Verde fresco',font:'retro',shape:'dot',r:14,rc:12,re:8,bw:1,
    c:['#EEF8F2','#FFFFFF','#F5FBF7','#CFE8D9','#14301F','#4F6F5C','#1E9E5A','#12703F','#D5F1E1','#FFFFFF','#5E7166','#EBF2EE','#DAE6DF','#C0392B','#D6336C']}
};
var CVARS=['--bg','--surface','--surface-2','--line','--fg','--muted','--accent','--accent-ink','--accent-soft','--on-accent','--busy-ink','--busy-soft','--busy-stripe','--danger','--now'];
var MYCOLORS=['#E5484D','#F76B15','#D49B00','#84A12B','#30A46C','#12A594','#00A2C7','#0091FF','#3E63DD','#6E56CF','#8E4EC6','#D6409F','#E54666','#A1665E','#697586','#2F3A45'];
var DEFAULT_LOOK={theme:'laguna',font:'',shape:''};
function cleanLook(l){l=l||{};return {theme:THEMES[l.theme]?l.theme:'laguna',font:FONTS[l.font]?l.font:'',shape:SHAPES[l.shape]?l.shape:''};}
function applyLook(look){
  var t=THEMES[look.theme]||THEMES.laguna,s=root.style;
  if(t.c){CVARS.forEach(function(v,i){s.setProperty(v,t.c[i]);});s.setProperty('--shadow',t.dark?'0 12px 40px rgba(0,0,0,.55)':'0 12px 40px rgba(16,28,40,.18)');s.colorScheme=t.dark?'dark':'light';}
  else{CVARS.forEach(function(v){s.removeProperty(v);});s.removeProperty('--shadow');s.colorScheme='';}
  s.setProperty('--r',t.r+'px');s.setProperty('--rc',t.rc+'px');s.setProperty('--re',t.re+'px');s.setProperty('--bw',t.bw+'px');
  var fk=look.font||t.font,f=FONTS[fk];
  loadFonts([fk]);
  s.setProperty('--f-display',fontStack(f,'d'));s.setProperty('--f-body',fontStack(f,'b'));
  var sh=SHAPES[look.shape||t.shape].v;
  s.setProperty('--ev-pct',sh.pct);s.setProperty('--ev-bar',sh.bar);s.setProperty('--ev-ring',sh.ring);s.setProperty('--ev-r',sh.r);s.setProperty('--ev-dot',sh.dot);
  var m=document.querySelector('meta[name="theme-color"]');
  if(!m){m=document.createElement('meta');m.name='theme-color';document.head.appendChild(m);}
  m.content=t.c?t.c[0]:(matchMedia('(prefers-color-scheme: dark)').matches?'#0E1418':'#EDF1F4');
}

/* ---------- state ---------- */
var state={
  view:'month',cursor:midnight(new Date()),sel:ymd(new Date()),
  myId:null,canWrite:false,isOwner:false,
  calIds:[],calMeta:{},people:{},pub:{},shared:[],priv:[],
  filter:'all',q:'',agendaDays:60,
  look:Object.assign({},DEFAULT_LOOK),
  loaded:false,status:'',shell:'',dayScrolled:'',mode:'local'
};
var db=null,user=null,subs=new Map();

function lsGet(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
state.look=cleanLook(lsGet('cal-look',null));
state.view=['month','agenda','day'].indexOf(lsGet('cal-view','month'))>-1?lsGet('cal-view','month'):'month';
state.filter=['all','me','partner','tog','me+tog'].indexOf(lsGet('cal-filter','all'))>-1?lsGet('cal-filter','all'):'all';
applyLook(state.look);

/* ---------- people ---------- */
function partnerId(){return state.calIds.filter(function(id){return id!==state.myId;})[0]||null;}
function myColor(){var m=state.calMeta[state.myId];return m&&isHex(m.color)?m.color:'';}
function person(uid){
  var p=state.people[uid]||{},meta=state.calMeta[uid]||{};
  var nick=typeof meta.nick==='string'?meta.nick.trim().slice(0,30):'';
  var name=uid===state.myId?'Tu':(nick||p.name||'Partner');
  var color=isHex(meta.color)?meta.color:(cssColor(p.color)||'var(--accent)');
  return {name:name,color:color};
}
function partnerName(){var p=partnerId();return p?person(p).name:'';}
async function refreshPeople(){
  if(!user||!state.calIds.length) return;
  try{
    var ps=await user.profiles(state.calIds),m={};
    Object.keys(ps).forEach(function(k){m[k]={name:ps[k].name||'',color:ps[k].color||''};});
    state.people=m;render();
  }catch(e){}
}

/* ---------- events ---------- */
function norm(e,kind,owner,editable){
  return Object.assign({},e,{kind:kind,owner:owner,editable:editable,key:kind+'|'+owner+'|'+e.id,mine:owner===state.myId});
}
function allRaw(){
  var out=[],me=state.myId;
  Object.keys(state.pub).forEach(function(uid){
    (state.pub[uid]||[]).forEach(function(e){if(e.vis==='private'||!e.date)return;out.push(norm(e,'pub',uid,uid===me&&state.canWrite));});
  });
  state.shared.forEach(function(e){if(!e.date)return;out.push(norm(e,'tog',e.by||'',state.canWrite));});
  state.priv.forEach(function(e){if(!e.date)return;out.push(norm(e,'prv',me,true));});
  return out;
}
function passFilter(e){
  var f=state.filter;
  if(f==='me') return e.kind!=='tog'&&e.owner===state.myId;
  if(f==='me+tog') return e.kind==='tog'||e.owner===state.myId;
  if(f==='partner') return e.kind==='pub'&&e.owner!==state.myId;
  if(f==='tog') return e.kind==='tog';
  return true;
}
function evStyle(e){
  if(e.kind==='tog'){var p=partnerId();return '--c:'+person(state.myId).color+';--c2:'+(p?person(p).color:person(state.myId).color);}
  return '--c:'+person(e.owner).color;
}
function spanOf(e){if(!e.endDate||e.endDate<=e.date)return 0;return dayDiff(fromYmd(e.date),fromYmd(e.endDate));}
function extrasOf(e){
  if(!Array.isArray(e.extraDates)) return [];
  var seen={},out=[];
  e.extraDates.forEach(function(s){if(typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&s!==e.date&&!seen[s]){seen[s]=1;out.push(s);}});
  return out.sort().slice(0,90);
}
function allDatesOf(e){return [e.date].concat(extrasOf(e)).sort();}
function occStarts(e,from,to){
  var seen={},out=[];
  allDatesOf(e).forEach(function(b){occStartsOne(e,b,from,to).forEach(function(d){var k=ymd(d);if(!seen[k]){seen[k]=1;out.push(d);}});});
  return out;
}
function occStartsOne(e,baseS,from,to){
  var base=fromYmd(baseS),span=spanOf(e),rep=e.repeat||'none',out=[],earliest=addDays(from,-span);
  if(rep==='none'||!REP_TXT[rep]){if(base<=to&&addDays(base,span)>=from)out.push(base);return out;}
  var k=0,guard=0;
  if(rep==='daily'||rep==='weekly'){var per=rep==='daily'?1:7,d0=dayDiff(base,earliest);if(d0>0)k=Math.floor(d0/per);}
  else if(rep==='monthly'){var m0=(earliest.getFullYear()-base.getFullYear())*12+earliest.getMonth()-base.getMonth()-1;if(m0>0)k=m0;}
  else{var y0=earliest.getFullYear()-base.getFullYear()-1;if(y0>0)k=y0;}
  while(guard++<2000){
    var d;
    if(rep==='daily') d=addDays(base,k);
    else if(rep==='weekly') d=addDays(base,7*k);
    else if(rep==='monthly') d=new Date(base.getFullYear(),base.getMonth()+k,base.getDate());
    else d=new Date(base.getFullYear()+k,base.getMonth(),base.getDate());
    k++;
    if(d.getDate()!==base.getDate()) continue;
    if(d>to) break;
    if(addDays(d,span)>=from) out.push(d);
  }
  return out;
}
function startKey(it){return it.e.allDay||it.pos==='mid'?'':(it.pos==='last'?'00:00':(it.e.start||''));}
function cmpItem(a,b){
  var ad=(a.e.allDay||a.pos==='mid')?0:1,bd=(b.e.allDay||b.pos==='mid')?0:1;
  return ad-bd||startKey(a).localeCompare(startKey(b))||(a.e.title||'').localeCompare(b.e.title||'');
}
function dayMap(from,to,events){
  var m=new Map();
  (events||allRaw().filter(passFilter)).forEach(function(e){
    var span=spanOf(e);
    occStarts(e,from,to).forEach(function(s){
      for(var i=0;i<=span;i++){
        var d=addDays(s,i);if(d<from||d>to)continue;
        var k=ymd(d);if(!m.has(k))m.set(k,[]);
        m.get(k).push({e:e,day:k,occ:ymd(s),pos:span===0?'single':(i===0?'first':(i===span?'last':'mid')),idx:i+1,span:span+1});
      }
    });
  });
  m.forEach(function(l){l.sort(cmpItem);});
  return m;
}
function nowStatus(it){
  var e=it.e,today=ymd(new Date());
  if(it.day!==today||e.allDay||it.pos==='mid') return '';
  var n=new Date(),nm=n.getHours()*60+n.getMinutes();
  var s=it.pos==='last'?0:toMin(e.start),en=it.pos==='first'?24*60:(e.end?toMin(e.end):s+60);
  if(nm>=s&&nm<en) return 'In corso';
  if(nm<s){var diff=s-nm;return diff<60?'Tra '+diff+' min':(diff<180?'Tra '+Math.floor(diff/60)+' h':'');}
  return '';
}
function isOver(it){
  var e=it.e,today=ymd(new Date());
  if(it.day!==today||e.allDay||it.pos==='mid'||it.pos==='first') return false;
  var n=new Date();return (e.end?toMin(e.end):toMin(e.start)+60)<=n.getHours()*60+n.getMinutes();
}
function timeLabel(it){
  var e=it.e;
  if(e.allDay) return it.span>1?'Tutto il giorno · giorno '+it.idx+' di '+it.span:'Tutto il giorno';
  if(it.pos==='single') return fT(e.start)+(e.end?'–'+fT(e.end):'');
  if(it.pos==='first') return 'Dalle '+fT(e.start)+' · giorno 1 di '+it.span;
  if(it.pos==='last') return 'Fino alle '+fT(e.end)+' · giorno '+it.idx+' di '+it.span;
  return 'Tutto il giorno · giorno '+it.idx+' di '+it.span;
}
function tmCol(it){
  var e=it.e;
  if(e.allDay||it.pos==='mid') return '<span class="sm">'+(it.span>1?'Giorno<br>'+it.idx+'/'+it.span:'Tutto il<br>giorno')+'</span>';
  if(it.pos==='first') return '<span class="a">'+fT(e.start)+'</span><span class="b">→</span>';
  if(it.pos==='last') return '<span class="b">→</span><span class="a">'+fT(e.end)+'</span>';
  return '<span class="a">'+fT(e.start)+'</span>'+(e.end?'<span class="b">'+fT(e.end)+'</span>':'');
}
function whoTag(e){
  if(e.kind==='tog') return '<span class="tag" style="'+evStyle(e)+'"><i class="tog"></i>Insieme</span>';
  if(e.kind==='prv') return '<span class="tag">'+ICON.lock+'Solo tu</span>';
  if(!e.mine) return '<span class="tag" style="'+evStyle(e)+'"><i></i>'+esc(person(e.owner).name)+'</span>';
  return '';
}
function row(it,opts){
  var e=it.e,tags=[];
  var st=nowStatus(it);if(st) tags.push('<span class="tag now">'+st+'</span>');
  var w=whoTag(e);if(w) tags.push(w);
  if(opts&&opts.showTime) tags.unshift('<span class="tag">'+esc(timeLabel(it))+'</span>');
  else if(it.span>1&&!e.allDay) tags.push('<span class="tag">giorno '+it.idx+'/'+it.span+'</span>');
  var nx=extrasOf(e).length;
  if(nx){var ds=allDatesOf(e),pos=ds.indexOf(it.occ)+1;tags.push('<span class="tag">'+ICON.day.replace('width="16" height="16"','width="12" height="12"')+(pos?pos+' di '+ds.length+' giorni':ds.length+' giorni')+'</span>');}
  if(REP_TXT[e.repeat]) tags.push('<span class="tag">'+ICON.rep+REP_TXT[e.repeat]+'</span>');
  if(e.place) tags.push('<span class="tag">'+ICON.pin+esc(e.place)+'</span>');
  var over=isOver(it)?' style="opacity:.55"':'';
  return '<button type="button" class="ev row '+e.kind+'" style="'+evStyle(e)+'" data-ev="'+esc(e.key)+'" data-occ="'+it.occ+'"'+(over?'':'')+'>'+
    '<span class="tm"'+over+'>'+tmCol(it)+'</span><span class="bd"'+over+'><span class="ti">'+(e.emoji?'<span aria-hidden="true">'+esc(e.emoji)+'</span>':'')+'<span class="n">'+esc(e.title)+'</span></span>'+
    (tags.length?'<span class="sub">'+tags.join('')+'</span>':'')+'</span></button>';
}

/* ---------- render ---------- */
function periodLabel(){
  var c=state.cursor;
  if(state.view==='month') return fmt(c,{month:'long'})+(c.getFullYear()!==new Date().getFullYear()?' '+c.getFullYear():'');
  if(state.view==='day'){
    var t=dayDiff(midnight(new Date()),c);
    var pre=t===0?'Oggi, ':(t===1?'Domani, ':(t===-1?'Ieri, ':''));
    return pre+fmt(c,{weekday:pre?undefined:'short',day:'numeric',month:'short'});
  }
  return 'Agenda';
}
function renderTop(){
  $('period').textContent=periodLabel();
  $('prev').hidden=$('next').hidden=state.view==='agenda';
  document.querySelectorAll('.seg[role=tablist] button').forEach(function(b){b.setAttribute('aria-selected',String(b.dataset.view===state.view));});
  $('fab').hidden=!state.canWrite;
  var bn=$('banner');
  if(state.status==='nodb'){bn.hidden=false;bn.textContent='Non riesco a collegarmi all\'archivio degli impegni. Controlla la configurazione in js/config.js e ricarica la pagina.';}
  else if(state.status==='error'){bn.hidden=false;bn.textContent='Non riesco a leggere gli impegni. Ricarica la pagina tra poco.';}
  else if(state.status==='readonly'){bn.hidden=false;bn.textContent='Puoi solo consultare. Per aggiungere impegni, chiedi a chi gestisce il calendario di abilitare il tuo account.';}
  else bn.hidden=true;
  var pid=partnerId(),me=state.myId;
  var fl=[['all','Tutti',''],['me','Miei','<i style="--c:'+(me?person(me).color:'var(--accent)')+'"></i>']];
  if(pid) fl.push(['partner',person(pid).name,'<i style="--c:'+person(pid).color+'"></i>']);
  fl.push(['tog','Insieme','<i class="tog" style="--c:'+(me?person(me).color:'var(--accent)')+';--c2:'+(pid?person(pid).color:'var(--accent)')+'"></i>']);
  $('filters').innerHTML=fl.map(function(f){return '<button type="button" class="chip" data-filter="'+f[0]+'" aria-pressed="'+(state.filter===f[0]||(state.filter==='me+tog'&&(f[0]==='me'||f[0]==='tog')))+'">'+f[2]+esc(f[1])+'</button>';}).join('');
}
function shell(){
  if(state.shell===state.view) return;
  state.shell=state.view;
  var h='';
  if(state.view==='month') h='<div id="grid"></div><section class="sec" id="selday"></section><section class="sec" id="upcoming"></section>';
  else if(state.view==='agenda') h='<div class="search">'+ICON.search+'<input id="q" type="search" placeholder="Cerca impegni" autocomplete="off" enterkeyhint="search" aria-label="Cerca impegni"></div><div id="alist"></div>';
  else h='<div class="daytop" id="dayall"></div><div class="tg" id="tg"><div class="tgi" id="tgi"></div></div>';
  $('main').innerHTML=h;
  if(state.view==='agenda') $('q').value=state.q;
  state.dayScrolled='';
}
function renderMonth(){
  var c=state.cursor,todayS=ymd(new Date());
  var first=startOfWeek(new Date(c.getFullYear(),c.getMonth(),1)),last=addDays(first,41);
  var evs=allRaw().filter(passFilter),map=dayMap(first,last,evs);
  var h='<div class="mgrid" id="mgrid">'+WD.map(function(w){return '<span class="wd">'+w+'</span>';}).join('');
  for(var i=0;i<42;i++){
    var d=addDays(first,i),s=ymd(d),list=map.get(s)||[];
    var cls='dc'+(d.getMonth()!==c.getMonth()?' out':'')+(s===todayS?' today':'')+(s===state.sel?' sel':'');
    var dots=list.slice(0,4).map(function(it){return '<i class="'+(it.e.kind==='tog'?'tog':'')+'" style="'+evStyle(it.e)+'"></i>';}).join('');
    if(list.length>4) dots+='<b>+</b>';
    h+='<button type="button" class="'+cls+'" data-sel="'+s+'" aria-label="'+esc(fmt(d,{weekday:'long',day:'numeric',month:'long'}))+(list.length?', '+list.length+' impegni':'')+'"><span class="dn">'+d.getDate()+'</span><span class="dots">'+dots+'</span></button>';
  }
  $('grid').innerHTML=h+'</div>';

  var sd=fromYmd(state.sel),items=(sd>=first&&sd<=last?map.get(state.sel):dayMap(sd,sd,evs).get(state.sel))||[];
  var t=dayDiff(midnight(new Date()),sd);
  var lbl=(t===0?'Oggi · ':(t===1?'Domani · ':''))+fmt(sd,{weekday:'long',day:'numeric',month:'long'});
  var sh='<div class="sech"><h3>'+esc(lbl)+'</h3><div class="acts"><button type="button" class="ib" data-openday="'+state.sel+'" aria-label="Apri vista giorno">'+ICON.day+'</button>'+(state.canWrite?'<button type="button" class="ib" data-add="'+state.sel+'" aria-label="Aggiungi impegno in questo giorno">'+ICON.plus+'</button>':'')+'</div></div>';
  if(!items.length) sh+=state.canWrite?'<button type="button" class="empty" data-add="'+state.sel+'">Niente in programma. Tocca per aggiungere.</button>':'<p class="empty static">Niente in programma.</p>';
  else sh+='<div class="list">'+items.map(function(it){return row(it);}).join('')+'</div>';
  $('selday').innerHTML=sh;

  var today=midnight(new Date()),um=dayMap(today,addDays(today,60),evs),up=[];
  Array.from(um.keys()).sort().forEach(function(k){if(k===state.sel)return;(um.get(k)||[]).forEach(function(it){if(!isOver(it))up.push(it);});});
  up=up.slice(0,6);
  var uh='<div class="sech"><h3>In arrivo</h3></div>';
  if(!up.length) uh+='<p class="empty static">Nessun altro impegno nei prossimi 60 giorni.</p>';
  else uh+='<div class="list">'+up.map(function(it){return dayHead(it)+row(it);}).join('')+'</div>';
  $('upcoming').innerHTML=uh;
}
var lastHead='';
function dayHead(it){
  if(it.day===lastHead) return '';
  lastHead=it.day;
  return '<span class="muted" style="font-size:13px;font-weight:700;text-transform:capitalize;margin-top:4px">'+esc(relDay(it.day))+'</span>';
}
function relDay(s){
  var d=fromYmd(s),t=dayDiff(midnight(new Date()),d);
  var base=fmt(d,{weekday:'long',day:'numeric',month:'long'});
  return t===0?'Oggi · '+base:(t===1?'Domani · '+base:base);
}
function renderAgenda(){
  var today=midnight(new Date()),to=addDays(today,state.agendaDays);
  var q=state.q.trim().toLowerCase();
  var evs=allRaw().filter(passFilter).filter(function(e){return !q||[e.title,e.place,e.notes].join(' ').toLowerCase().indexOf(q)>-1;});
  var map=dayMap(today,to,evs),keys=Array.from(map.keys()).sort(),h='';
  if(!keys.length) h='<p class="empty static" style="margin-top:16px">'+(q?'Nessun impegno trovato per “'+esc(state.q.trim())+'”.':'Nessun impegno nei prossimi '+state.agendaDays+' giorni.')+'</p>';
  keys.forEach(function(k){
    var d=fromYmd(k),t=dayDiff(today,d);
    var head=(t===0?'<b>Oggi</b> · ':(t===1?'<b>Domani</b> · ':''))+esc(fmt(d,{weekday:'long',day:'numeric',month:'long'}));
    h+='<div class="agd"><h3>'+head+'</h3><div class="list">'+map.get(k).map(function(it){return row(it);}).join('')+'</div></div>';
  });
  h+='<button type="button" class="btn more" id="more">Mostra fino al '+esc(fmt(addDays(today,state.agendaDays+60),{day:'numeric',month:'long'}))+'</button>';
  $('alist').innerHTML=h;
}
function layout(items){
  var arr=items.map(function(it){
    var s=it.pos==='last'?0:toMin(it.e.start),en=it.pos==='first'?24*60:(it.e.end?toMin(it.e.end):s+60);
    return {it:it,s:s,en:Math.max(en,s+20)};
  });
  arr.sort(function(a,b){return a.s-b.s||a.en-b.en;});
  var cluster=[],clusterEnd=-1,out=[];
  function flush(){
    if(!cluster.length)return;
    var cols=[];
    cluster.forEach(function(x){var c=cols.findIndex(function(end){return end<=x.s;});if(c===-1){c=cols.length;cols.push(x.en);}else cols[c]=x.en;x.col=c;});
    cluster.forEach(function(x){x.cols=cols.length;out.push(x);});
    cluster=[];
  }
  arr.forEach(function(x){if(x.s>=clusterEnd){flush();clusterEnd=x.en;}else clusterEnd=Math.max(clusterEnd,x.en);cluster.push(x);});
  flush();
  return out;
}
function renderDay(){
  var d=state.cursor,s=ymd(d),items=dayMap(d,d).get(s)||[];
  var all=items.filter(function(it){return it.e.allDay||it.pos==='mid';}),timed=items.filter(function(it){return !(it.e.allDay||it.pos==='mid');});
  $('dayall').innerHTML=all.length?'<div class="list">'+all.map(function(it){return row(it);}).join('')+'</div>':(items.length?'':'<p class="empty static" style="margin:0">Niente in programma'+(state.canWrite?'. Tocca un\'ora per aggiungere.':'.')+'</p>');
  var h='<div>';
  for(var i=0;i<24;i++) h+='<div class="tg-h"><span>'+i+':00</span></div>';
  h+='</div><div class="tg-col'+(state.canWrite?' can':'')+'" data-col="'+s+'">';
  layout(timed).forEach(function(x){
    var it=x.it,e=it.e,top=x.s/60*HOUR,ht=Math.max((x.en-x.s)/60*HOUR,28);
    var tl=it.pos==='single'?fT(e.start)+(e.end?'–'+fT(e.end):''):(it.pos==='first'?'dalle '+fT(e.start):'fino alle '+fT(e.end));
    h+='<button type="button" class="ev tg-ev '+e.kind+'" data-ev="'+esc(e.key)+'" data-occ="'+it.occ+'" style="'+evStyle(e)+';top:'+top+'px;height:'+ht+'px;left:calc('+(x.col/x.cols*100)+'% + 3px);width:calc('+(100/x.cols)+'% - 6px)"><span class="n">'+(e.emoji?esc(e.emoji)+' ':'')+(e.kind==='prv'?ICON.lock+' ':'')+esc(e.title)+'</span><span class="t">'+esc(tl)+(e.kind==='pub'&&!e.mine?' · '+esc(person(e.owner).name):(e.kind==='tog'?' · Insieme':''))+'</span></button>';
  });
  if(s===ymd(new Date())){var n=new Date();h+='<div class="nowline" style="top:'+((n.getHours()*60+n.getMinutes())/60*HOUR)+'px"></div>';}
  $('tgi').innerHTML=h+'</div>';
  if(state.dayScrolled!==s){
    state.dayScrolled=s;
    var tg=$('tg'),first=timed.length?Math.min.apply(null,timed.map(function(it){return it.pos==='last'?0:toMin(it.e.start);})):null;
    var target=s===ymd(new Date())?(new Date().getHours()-1)*60:(first!=null?first-30:7*60);
    tg.scrollTop=Math.max(0,target/60*HOUR);
  }
}
function render(){
  renderTop();shell();lastHead='';
  if(state.view==='month') renderMonth();
  else if(state.view==='agenda') renderAgenda();
  else renderDay();
  if(!$('dt').hidden&&openDetailKey) refreshDetail();
}

/* ---------- navigation ---------- */
function setView(v){state.view=v;lsSet('cal-view',v);if(v==='day')state.cursor=fromYmd(state.sel);else if(v==='month')state.cursor=fromYmd(state.sel);render();window.scrollTo(0,0);}
function step(n){
  if(state.view==='month'){
    var c=state.cursor,first=new Date(c.getFullYear(),c.getMonth()+n,1);
    state.cursor=first;
    var sd=fromYmd(state.sel),lastDay=new Date(first.getFullYear(),first.getMonth()+1,0).getDate();
    var today=midnight(new Date());
    state.sel=(today.getMonth()===first.getMonth()&&today.getFullYear()===first.getFullYear())?ymd(today):ymd(new Date(first.getFullYear(),first.getMonth(),Math.min(sd.getDate(),lastDay)));
  } else if(state.view==='day'){state.cursor=addDays(state.cursor,n);state.sel=ymd(state.cursor);}
  render();
}
function goToday(){var t=midnight(new Date());state.cursor=t;state.sel=ymd(t);state.agendaDays=60;render();window.scrollTo(0,0);}
$('prev').addEventListener('click',function(){step(-1);});
$('next').addEventListener('click',function(){step(1);});
$('today').addEventListener('click',goToday);
document.querySelectorAll('.seg[role=tablist] button').forEach(function(b){b.addEventListener('click',function(){setView(b.dataset.view);});});
$('filters').addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-filter]');if(!b)return;
  var k=b.dataset.filter,cur=state.filter;
  if(k==='me'||k==='tog'){
    var set=cur==='me+tog'?['me','tog']:(cur==='me'||cur==='tog'?[cur]:[]);
    var i=set.indexOf(k);
    if(i>-1)set.splice(i,1);else if(cur==='me'||cur==='tog'||cur==='me+tog')set.push(k);else set=[k];
    state.filter=set.length===2?'me+tog':(set[0]||'all');
  } else state.filter=k;
  lsSet('cal-filter',state.filter);render();});

/* swipe left/right on month grid and day timeline */
(function(){
  var sx=0,sy=0,t0=0,active=false;
  $('main').addEventListener('touchstart',function(e){
    if(state.view==='agenda'||e.touches.length!==1) return;
    if(!(e.target.closest('#mgrid')||e.target.closest('#tg')||e.target.closest('#dayall'))) return;
    active=true;sx=e.touches[0].clientX;sy=e.touches[0].clientY;t0=Date.now();
  },{passive:true});
  $('main').addEventListener('touchend',function(e){
    if(!active) return;active=false;
    var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
    if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5&&Date.now()-t0<700){swiped=Date.now();step(dx<0?1:-1);}
  },{passive:true});
})();
var swiped=0;

$('main').addEventListener('click',function(ev){
  if(Date.now()-swiped<350) return;
  var t=ev.target;if(!t.closest) return;
  var b;
  if((b=t.closest('[data-ev]'))){openDetail(b.dataset.ev,b.dataset.occ);return;}
  if((b=t.closest('[data-sel]'))){
    var s=b.dataset.sel;
    if(s===state.sel&&b.classList.contains('sel')){state.cursor=fromYmd(s);setView('day');return;}
    state.sel=s;var d=fromYmd(s);
    if(d.getMonth()!==state.cursor.getMonth()) state.cursor=new Date(d.getFullYear(),d.getMonth(),1);
    render();return;
  }
  if((b=t.closest('[data-openday]'))){state.cursor=fromYmd(b.dataset.openday);setView('day');return;}
  if((b=t.closest('[data-add]'))){newAt(b.dataset.add);return;}
  if(t.id==='more'){state.agendaDays+=60;render();return;}
  var col=t.closest('.tg-col');
  if(col&&state.canWrite){
    var r=col.getBoundingClientRect(),mins=Math.floor(((ev.clientY-r.top)/HOUR*60)/30)*30;
    newAt(col.dataset.col,fromMin(mins));
  }
});
$('main').addEventListener('input',function(e){if(e.target.id==='q'){state.q=e.target.value;renderAgenda();}});
$('fab').addEventListener('click',function(){newAt(state.view==='agenda'?ymd(new Date()):state.sel);});

/* ---------- sheets ---------- */
var openStack=[];
function openSheet(id){$(id).hidden=false;if(openStack.indexOf(id)===-1)openStack.push(id);document.body.style.overflow='hidden';}
function closeSheet(id){$(id).hidden=true;openStack=openStack.filter(function(x){return x!==id;});if(!openStack.length)document.body.style.overflow='';}
['ed','dt','st'].forEach(function(id){$(id).addEventListener('click',function(e){if(e.target===$(id)){if(id==='ed')closeEditor();else if(id==='dt')closeDetail();else closeSheet('st');}});});
document.addEventListener('keydown',function(e){
  if(e.key!=='Escape'||!openStack.length) return;
  var top=openStack[openStack.length-1];
  if(top==='ed')closeEditor();else if(top==='dt')closeDetail();else closeSheet(top);
});

var toastTimer=null,undoFn=null;
function toast(msg,undo){
  $('toast-t').textContent=msg;undoFn=undo||null;$('toast-undo').hidden=!undo;$('toast').hidden=false;
  clearTimeout(toastTimer);toastTimer=setTimeout(function(){$('toast').hidden=true;undoFn=null;},undo?6000:2200);
}
$('toast-undo').addEventListener('click',async function(){
  var f=undoFn;undoFn=null;$('toast').hidden=true;
  if(f){try{await f();toast('Ripristinato');}catch(e){toast('Non sono riuscito a ripristinarlo');}}
});

/* ---------- data paths ---------- */
function pathFor(kind,id,owner){
  if(kind==='tog') return 'shared/'+id;
  if(kind==='prv') return 'data/users/'+state.myId+'/'+id;
  return 'cal/'+(owner||state.myId)+'/events/'+id;
}
function rawOf(e){var o={};FIELDS.forEach(function(k){if(e[k]!==undefined)o[k]=e[k];});return o;}
function findEvent(key){return allRaw().find(function(x){return x.key===key;});}

/* ---------- detail ---------- */
var openDetailKey=null,openDetailOcc=null,detailConfirm=false;
function openDetail(key,occ){openDetailKey=key;openDetailOcc=occ;detailConfirm=false;if(!refreshDetail())return;openSheet('dt');$('dt-close').focus();}
function closeDetail(){openDetailKey=null;closeSheet('dt');}
function refreshDetail(){
  var e=findEvent(openDetailKey);
  if(!e){if(!$('dt').hidden){closeDetail();}return false;}
  var occ=openDetailOcc||e.date,od=fromYmd(occ),span=spanOf(e);
  $('dt-h').textContent=e.kind==='tog'?'Insieme':(e.kind==='prv'?'Privato':(e.mine?'Il mio impegno':person(e.owner).name));
  $('dt-edit').hidden=!e.editable;
  var when;
  if(span>0){
    var oe=addDays(od,span);
    when=fmt(od,{weekday:'short',day:'numeric',month:'short'})+(e.allDay?'':' '+fT(e.start))+' → '+fmt(oe,{weekday:'short',day:'numeric',month:'short'})+(e.allDay?'':' '+fT(e.end));
  } else when=fmt(od,{weekday:'long',day:'numeric',month:'long',year:'numeric'})+' · '+(e.allDay?'tutto il giorno':fT(e.start)+(e.end?'–'+fT(e.end):''));
  var extras=extrasOf(e),allDs=allDatesOf(e);
  if(extras.length){
    when=allDs.map(function(s){return fmt(fromYmd(s),{weekday:'short',day:'numeric',month:'short'});}).join(', ')+' · '+(e.allDay?'tutto il giorno':fT(e.start)+(e.end?'–'+fT(e.end):''));
  }
  var who=e.kind==='tog'?'Insieme · lo vedete e modificate entrambi':(e.kind==='prv'?'Solo tu · l\'altra persona non lo vede':(e.mine?'Pubblico · lo vede anche '+(partnerName()||'l\'altra persona'):'Calendario di '+person(e.owner).name));
  var h='<h3 class="dt-title">'+(e.emoji?'<span aria-hidden="true">'+esc(e.emoji)+'</span>':'')+'<span>'+esc(e.title)+'</span></h3>';
  h+='<div><span class="pill ev '+e.kind+'" style="'+evStyle(e)+';cursor:default">'+(e.kind==='prv'?ICON.lock:'')+esc(who)+'</span></div>';
  h+='<div><span class="dt-k">'+(extras.length?allDs.length+' giorni':'Quando')+'</span><p>'+esc(when)+'</p></div>';
  if(extras.length&&e.editable&&state.canWrite&&!REP_TXT[e.repeat]&&allDs.indexOf(occ)>-1) h+='<div><button type="button" class="btn" data-act="dropday" style="width:100%">Togli solo '+esc(fmt(od,{weekday:'long',day:'numeric',month:'long'}))+'</button></div>';
  if(REP_TXT[e.repeat]) h+='<div><span class="dt-k">Si ripete</span><p>'+esc(REP_TXT[e.repeat])+', dal '+esc(fmt(fromYmd(e.date),{day:'numeric',month:'long',year:'numeric'}))+'</p></div>';
  if(e.place) h+='<div><span class="dt-k">Luogo</span><p>'+esc(e.place)+'</p><p><a href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(e.place)+'" target="_blank" rel="noopener">Apri in Mappe</a></p></div>';
  if(e.notes) h+='<div><span class="dt-k">Note</span><p>'+esc(e.notes)+'</p></div>';
  if(e.kind==='tog'&&e.by) h+='<p class="muted" style="font-size:13px">Creato da '+esc(e.by===state.myId?'te':person(e.by).name)+'</p>';
  $('dt-body').innerHTML=h;
  var f='';
  if(state.canWrite){
    if(!e.editable) f='<button type="button" class="btn" data-act="dup">Copia nel mio calendario</button>';
    else if(detailConfirm) f='<span class="q">Eliminare'+(REP_TXT[e.repeat]?' tutte le ripetizioni':'')+'?</span><span class="sp"></span><button type="button" class="btn" data-act="nodel">No</button><button type="button" class="btn danger solid" data-act="del">Elimina</button>';
    else f='<button type="button" class="btn" data-act="dup">Duplica</button><span class="sp"></span><button type="button" class="btn danger" data-act="askdel">Elimina</button>';
  }
  $('dt-foot').innerHTML=f;$('dt-foot').hidden=!f;
  return true;
}
$('dt-close').addEventListener('click',closeDetail);
$('dt-body').addEventListener('click',async function(ev){
  var b=ev.target.closest&&ev.target.closest('[data-act="dropday"]');if(!b)return;
  var e=findEvent(openDetailKey);if(!e)return;
  var occ=openDetailOcc,ds=allDatesOf(e).filter(function(s){return s!==occ;});
  if(!ds.length) return;
  b.disabled=true;
  var path=pathFor(e.kind,e.id,e.owner),data=rawOf(e);
  try{
    await db.doc(path).update({date:ds[0],extraDates:ds.slice(1)});
    closeDetail();
    toast('Tolto '+fmt(fromYmd(occ),{weekday:'short',day:'numeric',month:'short'}),function(){return db.doc(path).set(data);});
  }catch(err){toast('Non sono riuscito a toglierlo. Riprova.');b.disabled=false;}
});
$('dt-edit').addEventListener('click',function(){var e=findEvent(openDetailKey);if(!e)return;closeDetail();openEditor(e,e);});
$('dt-foot').addEventListener('click',async function(ev){
  var b=ev.target.closest&&ev.target.closest('[data-act]');if(!b)return;
  var e=findEvent(openDetailKey);if(!e)return;
  var a=b.dataset.act;
  if(a==='askdel'){detailConfirm=true;refreshDetail();return;}
  if(a==='nodel'){detailConfirm=false;refreshDetail();return;}
  if(a==='dup'){closeDetail();var c=rawOf(e);delete c.by;delete c.vis;openEditor(Object.assign(c,{kind:e.editable?e.kind:'pub'}),null);return;}
  if(a==='del'){
    b.disabled=true;
    var path=pathFor(e.kind,e.id,e.owner),data=rawOf(e);
    try{await db.doc(path).delete();closeDetail();toast('Impegno eliminato',function(){return db.doc(path).set(data);});}
    catch(err){toast('Non sono riuscito a eliminarlo. Riprova.');b.disabled=false;}
  }
});

/* ---------- editor ---------- */
var form={orig:null,vis:'pub',rep:'none',emoji:'',dirtyDate:false,dirtyTime:false,parsed:null,confirm:false,saving:false};
function setErr(t){$('f-err').textContent=t||'';$('f-err').hidden=!t;}
function syncForm(){
  var tog=$('f-tog').checked;
  $('tog-row').classList.toggle('on',tog);
  $('tog-label').textContent=partnerName()?'Insieme a '+partnerName():'Insieme';
  $('vis-wrap').hidden=tog;
  document.querySelectorAll('[data-vis]').forEach(function(b){b.setAttribute('aria-checked',String(form.vis===b.dataset.vis));});
  $('vis-note').textContent=form.vis==='prv'?'Lo vedi solo tu: per l\'altra persona non esiste.':'Lo vedi tu e lo vede anche '+(partnerName()||'l\'altra persona')+', ma solo tu puoi modificarlo.';
  var a=$('f-allday').checked;$('time-wrap').hidden=a;
  document.querySelectorAll('[data-dm]').forEach(function(b){b.setAttribute('aria-checked',String(form.dmode===b.dataset.dm));});
  $('one-wrap').hidden=form.dmode==='multi';
  $('range-wrap').hidden=form.dmode!=='range';
  $('multi-wrap').hidden=form.dmode!=='multi';
  $('date-lbl').textContent=form.dmode==='range'?'Dal giorno':'Giorno';
  if(form.dmode==='multi') renderMcal();
  $('reps').innerHTML=REPS.map(function(r){return '<button type="button" class="chip" data-rep="'+r[0]+'" aria-pressed="'+(form.rep===r[0])+'">'+r[1]+'</button>';}).join('');
  $('emos').innerHTML=EMOJIS.map(function(x){return '<button type="button" class="chip" data-emo="'+esc(x)+'" aria-pressed="'+(form.emoji===x)+'" aria-label="'+(x?'Icona '+x:'Nessuna icona')+'">'+(x||'∅')+'</button>';}).join('');
  var today=midnight(new Date()),sat=addDays(today,(6-today.getDay()+7)%7||7),cur=$('f-date').value;
  var qd=[[ymd(today),'Oggi'],[ymd(addDays(today,1)),'Domani'],[ymd(addDays(today,2)),fmt(addDays(today,2),{weekday:'short'})],[ymd(sat),'Sabato'],[ymd(addDays(sat,1)),'Domenica']];
  if(cur) qd.push([ymd(addDays(fromYmd(cur),7)),'+1 settimana']);
  var seen={};
  $('qdates').innerHTML=qd.filter(function(x){if(seen[x[0]])return false;seen[x[0]]=1;return true;}).map(function(x){return '<button type="button" class="chip" data-qd="'+x[0]+'" aria-pressed="'+(cur===x[0])+'">'+esc(x[1])+'</button>';}).join('');
  var dur=toMin($('f-end').value)-toMin($('f-start').value);
  document.querySelectorAll('[data-dur]').forEach(function(b){b.setAttribute('aria-pressed',String(+b.dataset.dur===dur));});
  renderFoot();
}
function renderMcal(){
  var m=form.mmonth,first=new Date(m.getFullYear(),m.getMonth(),1),lead=(first.getDay()+6)%7;
  var days=new Date(m.getFullYear(),m.getMonth()+1,0).getDate(),todayS=ymd(new Date());
  var h='<div class="mcal-h"><button type="button" class="ib plain" data-mnav="-1" aria-label="Mese precedente"><svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><b>'+esc(fmt(first,{month:'long',year:'numeric'}))+'</b><button type="button" class="ib plain" data-mnav="1" aria-label="Mese successivo"><svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div class="mcal-g">';
  h+=WD.map(function(w){return '<span>'+w+'</span>';}).join('');
  for(var i=0;i<lead;i++) h+='<span></span>';
  for(var d=1;d<=days;d++){
    var s=ymd(new Date(m.getFullYear(),m.getMonth(),d));
    h+='<button type="button" data-md="'+s+'" class="'+(s===todayS?'td':'')+'" aria-pressed="'+(form.multi.indexOf(s)>-1)+'">'+d+'</button>';
  }
  $('mcal').innerHTML=h+'</div>';
  var sel=form.multi.slice().sort();
  $('msum').textContent=sel.length?sel.length+(sel.length===1?' giorno: ':' giorni: ')+sel.map(function(x){return fmt(fromYmd(x),{weekday:'short',day:'numeric',month:'short'});}).join(', '):'Tocca i giorni dell\'impegno, anche non di fila.';
}
function setDmode(m){
  if(m===form.dmode) return;
  if(m==='multi'){if(!form.multi.length&&$('f-date').value)form.multi=[$('f-date').value];form.mmonth=fromYmd(form.multi.slice().sort()[0]||$('f-date').value||ymd(new Date()));}
  if(form.dmode==='multi'&&form.multi.length) $('f-date').value=form.multi.slice().sort()[0];
  if(m==='range'&&!$('f-enddate').value&&$('f-date').value) $('f-enddate').value=ymd(addDays(fromYmd($('f-date').value),1));
  form.dmode=m;form.dirtyDate=true;syncForm();
}
function renderFoot(){
  var f=$('ed-foot');
  if(!form.orig){f.hidden=true;f.innerHTML='';return;}
  f.hidden=false;
  f.innerHTML=form.confirm?'<span class="q">Eliminare'+(form.rep!=='none'?' tutte le ripetizioni':'')+'?</span><span class="sp"></span><button type="button" class="btn" data-fa="no">No</button><button type="button" class="btn danger solid" data-fa="del">Elimina</button>'
    :'<button type="button" class="btn" data-fa="dup">Duplica</button><span class="sp"></span><button type="button" class="btn danger" data-fa="ask">Elimina</button>';
}
function openEditor(init,orig){
  if(!state.canWrite) return;
  form={orig:orig?{kind:orig.kind,id:orig.id,owner:orig.owner,by:orig.by||'',data:rawOf(orig)}:null,vis:init.kind==='prv'?'prv':'pub',rep:REP_TXT[init.repeat]?init.repeat:'none',emoji:init.emoji||'',dirtyDate:!!orig,dirtyTime:!!orig,parsed:null,confirm:false,saving:false};
  var ex=extrasOf(init);
  form.dmode=ex.length?'multi':(init.endDate&&init.date&&init.endDate>init.date?'range':'one');
  form.multi=ex.length?[init.date].concat(ex):[];
  form.mmonth=fromYmd(init.date||state.sel);
  $('ed-title').textContent=orig?'Modifica':'Nuovo impegno';
  $('f-title').value=init.title||'';
  $('f-tog').checked=init.kind==='tog';
  $('f-date').value=init.date||state.sel;
  $('f-allday').checked=!!init.allDay;
  var st=init.start||'09:00';
  $('f-start').value=st;$('f-end').value=init.end||fromMin(toMin(st)+60);
  $('f-enddate').value=init.endDate||'';
  $('f-place').value=init.place||'';$('f-notes').value=init.notes||'';
  $('qhint').hidden=true;setErr('');$('ed-save').disabled=false;
  syncForm();openSheet('ed');
  $('form').querySelector('.sh-b').scrollTop=0;
  if(!orig) setTimeout(function(){$('f-title').focus();},50);
}
function closeEditor(){closeSheet('ed');}
function newAt(date,start){
  if(!state.canWrite) return;
  var st=start||(date===ymd(new Date())?fromMin(Math.min((new Date().getHours()+1)*60,22*60)):'09:00');
  openEditor({date:date,start:st,end:fromMin(toMin(st)+60),kind:state.filter==='tog'?'tog':'pub'},null);
  if(start) form.dirtyTime=true;
}
$('ed-cancel').addEventListener('click',closeEditor);
$('f-tog').addEventListener('change',syncForm);
$('f-allday').addEventListener('change',function(){form.dirtyTime=true;syncForm();});
$('f-date').addEventListener('change',function(){form.dirtyDate=true;var ed=$('f-enddate').value;if(ed&&ed<$('f-date').value)$('f-enddate').value='';syncForm();});
var prevDur=60;
$('f-start').addEventListener('focus',function(){prevDur=Math.max(15,toMin($('f-end').value)-toMin($('f-start').value))||60;});
$('f-start').addEventListener('change',function(){form.dirtyTime=true;if($('f-start').value)$('f-end').value=fromMin(toMin($('f-start').value)+prevDur);syncForm();});
$('f-end').addEventListener('change',function(){form.dirtyTime=true;syncForm();});
$('form').addEventListener('click',function(ev){
  var b=ev.target.closest&&ev.target.closest('button');if(!b)return;
  if(b.dataset.dm){setDmode(b.dataset.dm);}
  else if(b.dataset.md){var s=b.dataset.md,i=form.multi.indexOf(s);if(i>-1)form.multi.splice(i,1);else form.multi.push(s);form.dirtyDate=true;renderMcal();}
  else if(b.dataset.mnav){form.mmonth=new Date(form.mmonth.getFullYear(),form.mmonth.getMonth()+(+b.dataset.mnav),1);renderMcal();}
  else if(b.dataset.vis){form.vis=b.dataset.vis;syncForm();}
  else if(b.dataset.qd){$('f-date').value=b.dataset.qd;form.dirtyDate=true;syncForm();}
  else if(b.dataset.dur){form.dirtyTime=true;$('f-end').value=fromMin(toMin($('f-start').value||'09:00')+(+b.dataset.dur));syncForm();}
  else if(b.dataset.rep){form.rep=b.dataset.rep;syncForm();}
  else if(b.dataset.emo!=null){form.emoji=b.dataset.emo;syncForm();}
  else if(b.dataset.fa==='ask'){form.confirm=true;renderFoot();}
  else if(b.dataset.fa==='no'){form.confirm=false;renderFoot();}
  else if(b.dataset.fa==='dup'){var o=form.orig;form.orig=null;$('ed-title').textContent='Copia di impegno';form.dirtyDate=form.dirtyTime=true;renderFoot();$('f-date').focus();toast('Ora stai creando una copia');}
  else if(b.dataset.fa==='del'){delFromEditor(b);}
});
async function delFromEditor(b){
  var o=form.orig;if(!o)return;b.disabled=true;
  var path=pathFor(o.kind,o.id,o.owner),data=o.data;
  try{await db.doc(path).delete();closeEditor();toast('Impegno eliminato',function(){return db.doc(path).set(data);});}
  catch(e){setErr('Non sono riuscito a eliminarlo. Riprova.');b.disabled=false;}
}

/* quick text: "cena domani 20-22", "dentista venerdì alle 9:30", "25 ottobre tutto il giorno" */
var WDN=[['domenica'],['lunedì','lunedi'],['martedì','martedi'],['mercoledì','mercoledi'],['giovedì','giovedi'],['venerdì','venerdi'],['sabato']];
function rx(s){return new RegExp('(?<![\\p{L}\\d])'+s+'(?![\\p{L}\\d])','iu');}
function validT(h,m){return h>=0&&h<=23&&m>=0&&m<=59;}
function parseQuick(t){
  var r={hits:[]},m,today=midnight(new Date());
  if((m=t.match(rx('tutto il giorno')))){r.allDay=true;r.hits.push(m[0]);}
  if((m=t.match(rx('(oggi|stasera|domani|dopodomani)')))){var w=m[1].toLowerCase();r.date=addDays(today,w==='domani'?1:(w==='dopodomani'?2:0));r.hits.push(m[0]);if(w==='stasera'&&!r.start){}}
  else if((m=t.match(rx('(?:il\\s+)?(\\d{1,2})\\s+('+MONTHS.join('|')+')(?:\\s+(\\d{4}))?')))){
    var dd=+m[1],mo=MONTHS.indexOf(m[2].toLowerCase()),y=m[3]?+m[3]:today.getFullYear(),dt=new Date(y,mo,dd);
    if(!m[3]&&dt<today)dt=new Date(y+1,mo,dd);
    if(dt.getDate()===dd){r.date=dt;r.hits.push(m[0]);}
  }
  else if((m=t.match(rx('(?:il\\s+)?(\\d{1,2})\\/(\\d{1,2})(?:\\/(\\d{2,4}))?')))){
    var d2=+m[1],mo2=+m[2]-1,y2=m[3]?(+m[3]<100?2000+(+m[3]):+m[3]):today.getFullYear(),dt2=new Date(y2,mo2,d2);
    if(!m[3]&&dt2<today)dt2=new Date(y2+1,mo2,d2);
    if(mo2>=0&&mo2<12&&dt2.getDate()===d2){r.date=dt2;r.hits.push(m[0]);}
  }
  else{
    for(var i=0;i<7&&!r.date;i++){
      for(var j=0;j<WDN[i].length;j++){
        if((m=t.match(rx('(?:(?:questo|questa|prossimo|prossima)\\s+)?'+WDN[i][j])))){
          var diff=(i-today.getDay()+7)%7;if(/prossim/i.test(m[0])&&diff===0)diff=7;
          r.date=addDays(today,diff);r.hits.push(m[0]);break;
        }
      }
    }
    if(!r.date&&(m=t.match(rx('il\\s+(\\d{1,2})')))){
      var d3=+m[1],dt3=new Date(today.getFullYear(),today.getMonth(),d3);
      if(dt3<today)dt3=new Date(today.getFullYear(),today.getMonth()+1,d3);
      if(d3>=1&&d3<=31&&dt3.getDate()===d3){r.date=dt3;r.hits.push(m[0]);}
    }
  }
  var tr=t.match(rx('(?:dalle\\s+|ore\\s+)?(\\d{1,2})(?:[:.](\\d{2}))?\\s*(?:-|–|alle)\\s*(\\d{1,2})(?:[:.](\\d{2}))?'));
  if(tr){
    var h1=+tr[1],m1=+(tr[2]||0),h2=+tr[3],m2=+(tr[4]||0);
    if(validT(h1,m1)&&validT(h2,m2)&&h2*60+m2>h1*60+m1){r.start=pad(h1)+':'+pad(m1);r.end=pad(h2)+':'+pad(m2);r.hits.push(tr[0]);}
  }
  if(!r.start){
    var ts=t.match(rx('(?:alle|ore|h)\\s*(\\d{1,2})(?:[:.](\\d{2}))?'))||t.match(rx('(\\d{1,2})[:.](\\d{2})'));
    if(ts&&validT(+ts[1],+(ts[2]||0))){r.start=pad(+ts[1])+':'+pad(+(ts[2]||0));r.hits.push(ts[0]);}
  }
  return r;
}
$('f-title').addEventListener('input',function(){
  if(form.orig) return;
  var r=parseQuick($('f-title').value),bits=[];
  form.parsed=null;
  var used=[];
  if(r.date&&!form.dirtyDate){$('f-date').value=ymd(r.date);bits.push(fmt(r.date,{weekday:'long',day:'numeric',month:'long'}));}
  if(!form.dirtyTime){
    if(r.allDay){$('f-allday').checked=true;bits.push('tutto il giorno');}
    else if(r.start){$('f-allday').checked=false;$('f-start').value=r.start;$('f-end').value=r.end||fromMin(toMin(r.start)+60);bits.push(fT(r.start)+'–'+fT($('f-end').value));}
  }
  if(bits.length){form.parsed=r;$('qhint').textContent='Ho capito: '+bits.join(' · ');$('qhint').hidden=false;}
  else $('qhint').hidden=true;
  syncForm();
});
function cleanTitle(t){
  var r=form.parsed;if(!r) return t;
  var out=t;r.hits.forEach(function(h){out=out.replace(h,' ');});
  out=out.replace(/\s+(alle|il|di|ore|per)\s*$/i,'').replace(/\s{2,}/g,' ').replace(/^[\s,.\-–]+|[\s,.\-–]+$/g,'').trim();
  return out.length>=2?out:t;
}
$('form').addEventListener('submit',async function(ev){
  ev.preventDefault();
  if(form.saving||!db||!state.canWrite) return;
  var title=cleanTitle($('f-title').value.trim()),date=$('f-date').value,allDay=$('f-allday').checked;
  var start=$('f-start').value,end=$('f-end').value,endDate=$('f-enddate').value;
  if(!$('f-title').value.trim()){setErr('Scrivi un titolo per l\'impegno.');$('f-title').focus();return;}
  var extraDates=[];
  if(form.dmode==='multi'){
    var sel=form.multi.slice().sort();
    if(!sel.length){setErr('Tocca almeno un giorno nel calendario.');return;}
    date=sel[0];extraDates=sel.slice(1);endDate='';
  } else if(form.dmode==='one') endDate='';
  if(!date){setErr('Scegli il giorno.');return;}
  if(form.dmode==='range'&&(!endDate||endDate<=date)){setErr('"Fino al giorno" deve essere dopo il giorno di inizio.');return;}
  var multi=endDate&&endDate>date;
  if(!allDay){
    if(!start){setErr('Imposta l\'ora di inizio, oppure scegli Tutto il giorno.');return;}
    if(!end) end=fromMin(toMin(start)+60);
    if(!multi&&toMin(end)<=toMin(start)){setErr('L\'ora di fine deve essere dopo l\'inizio.');return;}
  }
  var kind=$('f-tog').checked?'tog':form.vis;
  var o=form.orig,id=o?o.id:newId();
  var data={title:title,date:date,endDate:multi?endDate:'',extraDates:extraDates,allDay:allDay,start:allDay?'':start,end:allDay?'':end,place:$('f-place').value.trim(),notes:$('f-notes').value.trim(),emoji:form.emoji,repeat:form.rep};
  if(kind==='tog') data.by=o&&o.kind==='tog'&&o.by?o.by:state.myId;
  if(kind==='pub') data.vis='public';
  var owner=kind==='pub'?state.myId:'';
  form.saving=true;$('ed-save').disabled=true;setErr('');
  try{
    var newPath=pathFor(kind,id,owner);
    await db.doc(newPath).set(data);
    if(o){var oldPath=pathFor(o.kind,o.id,o.owner);if(oldPath!==newPath)await db.doc(oldPath).delete();}
    closeEditor();
    var d=fromYmd(date);state.sel=date;
    if(state.view==='month'&&(d.getMonth()!==state.cursor.getMonth()||d.getFullYear()!==state.cursor.getFullYear()))state.cursor=new Date(d.getFullYear(),d.getMonth(),1);
    if(state.view==='day')state.cursor=d;
    render();
    toast(o?'Modifiche salvate':(kind==='tog'?'Aggiunto a entrambi i calendari':'Impegno aggiunto'));
  }catch(e){
    setErr(e&&(e.code==='permission-denied'||e.code==='invalid_argument')?'Non hai i permessi per salvare in questo calendario.':'Non sono riuscito a salvare. Riprova tra un momento.');
  }finally{form.saving=false;$('ed-save').disabled=false;}
});

/* ---------- personalise ---------- */
function themeCard(k){
  var t=THEMES[k],p=t.c||t.pv,f=FONTS[t.font],sel=state.look.theme===k;
  var chipR=t.shape==='pill'?'999px':(t.shape==='square'?'0':t.re+'px');
  var chipBg=t.shape==='outline'?p[1]:'color-mix(in srgb,'+p[6]+' 28%,'+p[1]+')';
  var chipSh=t.shape==='outline'?'inset 0 0 0 1.5px '+p[6]:(t.shape==='bar'||t.shape==='square'?'inset 4px 0 0 '+p[6]:'none');
  return '<button type="button" class="card" data-skin="'+k+'" aria-pressed="'+sel+'">'+
    '<span class="tprev" style="background:'+p[0]+';border-radius:'+Math.min(t.r,12)+'px;border:'+t.bw+'px solid '+p[3]+'">'+
      '<span class="bar" style="background:'+p[1]+';border:'+t.bw+'px solid '+p[3]+';border-radius:'+Math.min(t.rc,8)+'px"><i style="width:22px;background:'+p[6]+'"></i><i style="width:34px;background:'+p[3]+'"></i></span>'+
      '<span class="chp" style="color:'+p[4]+';background:'+chipBg+';box-shadow:'+chipSh+';border-radius:'+chipR+';font-family:'+esc(fontStack(f,'b'))+'">8:00–12:00</span>'+
    '</span><span class="nm" style="font-family:'+esc(fontStack(f,'d'))+'">'+esc(t.n)+'</span><span class="ds">'+esc(t.ds)+'</span></button>';
}
function fontCard(k){
  var f=k?FONTS[k]:FONTS[THEMES[state.look.theme].font],sel=state.look.font===k;
  return '<button type="button" class="card fcard" data-font="'+k+'" aria-pressed="'+sel+'"><span class="aa" style="font-family:'+esc(fontStack(f,'d'))+'">Aa Gg</span><span class="nm">'+esc(k?f.n:'Del tema')+'</span><span class="smp" style="font-family:'+esc(fontStack(f,'b'))+'">Cena alle 20:30</span></button>';
}
function shapeCard(k){
  var sel=state.look.shape===k,shKey=k||THEMES[state.look.theme].shape,v=SHAPES[shKey].v,c=myColor()||'var(--accent)';
  var vars='--ev-pct:'+v.pct+';--ev-bar:'+v.bar+';--ev-ring:'+v.ring+';--ev-r:'+v.r+';--ev-dot:'+v.dot;
  return '<button type="button" class="card shcard" data-shape="'+k+'" aria-pressed="'+sel+'"><span class="demo" style="'+vars+'"><span class="ev pub" style="--c:'+c+'">8:00 Lavoro</span><span class="ev prv" style="--c:'+c+'">Privato</span></span><span class="nm">'+esc(k?SHAPES[k].n:'Del tema')+'</span><span class="ds">'+esc(k?SHAPES[k].ds:SHAPES[shKey].n)+'</span></button>';
}
function renderSettings(keepScroll){
  var body=$('st-body'),sc=body.scrollTop,rows={};
  body.querySelectorAll('.hs').forEach(function(el){rows[el.id]=el.scrollLeft;});
  var h='';
  if(state.canWrite){
    var mc=myColor(),eff=person(state.myId).color,meta=state.calMeta[state.myId]||{};
    h+='<section class="sset"><h3>Il tuo nome</h3><p class="lead">Come ti vede '+esc(partnerName()||'l\'altra persona')+' nel calendario.</p><input id="my-nick" type="text" maxlength="30" autocomplete="off" enterkeyhint="done" placeholder="Es. Andrea" value="'+esc(typeof meta.nick==='string'?meta.nick:'')+'"></section>';
    h+='<section class="sset"><h3>Il tuo colore</h3><p class="lead">I tuoi impegni compaiono con questo colore, anche per '+esc(partnerName()||'l\'altra persona')+'.</p><div class="swatches">';
    h+=MYCOLORS.map(function(c){return '<button type="button" class="swc" style="--c:'+c+'" data-color="'+c+'" aria-label="Colore '+c+'" aria-pressed="'+(mc.toLowerCase()===c.toLowerCase())+'"></button>';}).join('');
    h+='<label class="swcustom" for="my-color"><input type="color" id="my-color" value="'+(isHex(mc)?mc:'#0E6F73')+'"> Altro</label></div></section>';
  }
  h+='<section class="sset"><h3>Tema</h3><div class="hs" id="hs-t">'+Object.keys(THEMES).map(themeCard).join('')+'</div></section>';
  h+='<section class="sset"><h3>Caratteri</h3><div class="hs" id="hs-f">'+[''].concat(Object.keys(FONTS)).map(fontCard).join('')+'</div></section>';
  h+='<section class="sset"><h3>Forma degli impegni</h3><div class="hs" id="hs-s">'+[''].concat(Object.keys(SHAPES)).map(shapeCard).join('')+'</div></section>';
  h+='<section class="sset"><h3>Condivisione</h3><p class="lead" style="margin:0">'+(state.mode==='firebase'
    ?'Per invitare qualcuno, aggiungi il suo indirizzo email alle regole di Firestore (vedi README). Avrà il suo calendario: vedete a vicenda gli impegni pubblici e quelli Insieme, mai i privati.'
    :'Modalità locale: gli impegni restano salvati in questo browser. Per condividere il calendario con un\'altra persona collega Firebase in js/config.js (vedi README).')+'</p></section>';
  if(state.mode==='firebase') h+='<section class="sset"><button type="button" class="btn" id="sign-out">Esci</button></section>';
  body.innerHTML=h;
  if(keepScroll){body.scrollTop=sc;Object.keys(rows).forEach(function(id){var el=$(id);if(el)el.scrollLeft=rows[id];});}
  else body.querySelectorAll('.hs [aria-pressed="true"]').forEach(function(el){var p=el.parentElement;p.scrollLeft=Math.max(0,el.offsetLeft-p.offsetLeft-12);});
}
var lookTimer=null,lookChain=Promise.resolve(),colorTimer=null,metaChain=Promise.resolve();
function setStatus(t){$('st-status').textContent=t;}
function setLook(patch){
  state.look=cleanLook(Object.assign({},state.look,patch));
  applyLook(state.look);lsSet('cal-look',state.look);
  render();renderSettings(true);
  if(!db||!state.myId) return;
  clearTimeout(lookTimer);
  lookTimer=setTimeout(function(){
    var v=Object.assign({},state.look);
    lookChain=lookChain.then(function(){return db.doc('data/users/'+state.myId+'/settings').set(v);}).then(function(){setStatus('Salvato. Lo vedi solo tu.');},function(){setStatus('Salvato solo su questo telefono.');});
  },600);
}
function saveMeta(patch,okMsg){
  state.calMeta[state.myId]=Object.assign({},state.calMeta[state.myId],patch);
  render();
  clearTimeout(colorTimer);
  colorTimer=setTimeout(function(){
    colorTimer=null;
    var p=Object.assign({},patch);
    metaChain=metaChain.then(function(){return db.doc('cal/'+state.myId).update(p);}).then(function(){setStatus(okMsg);},function(){setStatus('Non sono riuscito a salvare. Riprova.');});
  },400);
}
function openSettings(){loadFonts(Object.keys(FONTS));setStatus('Tema, caratteri e forma li vedi solo tu.');renderSettings(false);openSheet('st');}
$('open-set').addEventListener('click',openSettings);
$('st-done').addEventListener('click',function(){closeSheet('st');});
$('st-reset').addEventListener('click',function(){setLook(DEFAULT_LOOK);});
$('st-body').addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('button');if(!b)return;
  if(b.dataset.skin!=null)setLook({theme:b.dataset.skin});
  else if(b.dataset.font!=null)setLook({font:b.dataset.font});
  else if(b.dataset.shape!=null)setLook({shape:b.dataset.shape});
  else if(b.id==='sign-out'&&window.CalendarBackend&&window.CalendarBackend.signOut){window.CalendarBackend.signOut();}
  else if(b.dataset.color&&state.canWrite){saveMeta({color:b.dataset.color},'Colore salvato.');renderSettings(true);}
});
$('st-body').addEventListener('change',function(e){
  if(e.target.id==='my-color'&&isHex(e.target.value)&&state.canWrite){saveMeta({color:e.target.value},'Colore salvato.');renderSettings(true);}
  if(e.target.id==='my-nick'&&state.canWrite){saveMeta({nick:e.target.value.trim().slice(0,30)},'Nome salvato.');}
});

/* ---------- subscriptions ---------- */
function syncSubs(ids){
  ids.forEach(function(uid){
    if(subs.has(uid)) return;
    try{
      subs.set(uid,db.collection('cal/'+uid+'/events').onSnapshot(function(s){
        state.pub[uid]=s.docs.map(function(d){return Object.assign({id:d.id},d.data());});
        state.loaded=true;render();
      },function(){}));
    }catch(e){}
  });
  subs.forEach(function(unsub,uid){if(ids.indexOf(uid)===-1){unsub();subs.delete(uid);delete state.pub[uid];}});
}

/* ---------- start ---------- */
async function init(){
  render();
  try{
    var be=window.CalendarBackend?await window.CalendarBackend.connect():null;
    if(be){db=be.db||null;user=be.user||null;state.mode=be.mode||'local';}
  }catch(e){console.error(e);}
  if(!db){state.status='nodb';render();return;}
  if(user){
    try{var me=await user.me();state.myId=me.id;state.isOwner=!!me.isOwner;if(me.id)state.people[me.id]={name:me.name||'',color:me.color||''};}catch(e){}
  }
  if(state.myId){
    try{
      var ss=await db.doc('data/users/'+state.myId+'/settings').get();
      if(ss.exists){state.look=cleanLook(ss.data());applyLook(state.look);lsSet('cal-look',state.look);}
    }catch(e){}
    try{
      var ref=db.doc('cal/'+state.myId),snap=await ref.get();
      if(!snap.exists) await ref.set({since:new Date().toISOString()});
      state.canWrite=true;
    }catch(e){state.canWrite=false;}
  }
  if(!state.canWrite) state.status='readonly';
  render();

  db.collection('cal').onSnapshot(function(s){
    var ids=[],meta={};
    s.docs.forEach(function(d){ids.push(d.id);meta[d.id]=Object.assign({},d.data());});
    if(state.canWrite&&ids.indexOf(state.myId)===-1) ids.push(state.myId);
    if(colorTimer&&state.calMeta[state.myId]) meta[state.myId]=Object.assign({},meta[state.myId],state.calMeta[state.myId]);
    state.calIds=ids;state.calMeta=meta;state.loaded=true;
    if(state.status==='error') state.status=state.canWrite?'':'readonly';
    syncSubs(ids);refreshPeople();render();
  },function(){state.status='error';render();});

  db.collection('shared').onSnapshot(function(s){
    state.shared=s.docs.map(function(d){return Object.assign({id:d.id},d.data());});render();
  },function(){});

  if(state.canWrite){
    db.collection('data/users/'+state.myId).onSnapshot(function(s){
      var arr=[];s.docs.forEach(function(d){if(d.id!=='settings'){var x=d.data();if(x&&x.date)arr.push(Object.assign({id:d.id},x));}});
      state.priv=arr;render();
    },function(){});
  }
  setInterval(function(){if(!openStack.length)render();},60000);
}
init();
})();
