(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=(n,d=0)=>Number(n||0).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});

const MATERIALS=[
  {id:'silicon',name:'Silicon',efficiency:.273,color:0x2f6fb2},
  {id:'fapbbr3',name:'FAPbBr₃',efficiency:.242,color:0x5f7fe6},
  {id:'cdte',name:'CdTe',efficiency:.210,color:0x5d8e72},
  {id:'nbse2',name:'NbSe₂',efficiency:0,color:0x6c7480}
];
const DEVICES=[
  {id:'fridge',name:'Kulkas',power:150,icon:'🧊'},
  {id:'lamp',name:'Lampu',power:5,icon:'💡'},
  {id:'ac',name:'AC',power:300,icon:'▭'},
  {id:'tv',name:'TV',power:100,icon:'▣'},
  {id:'rice',name:'Rice Cooker',power:300,icon:'◉'},
  {id:'laptop',name:'Laptop',power:60,icon:'💻'}
];
const TOOLS=[
  {id:'sun',name:'Matahari',icon:'☀',singleton:true,note:'posisi mengikuti waktu'},
  {id:'panel',name:'Panel Surya',icon:'▦',singleton:true,note:'drag ke workspace'},
  {id:'inverter',name:'Inverter',icon:'∿',singleton:true,note:'konversi DC → AC'},
  {id:'dcMeter',name:'Meter DC',icon:'▣',singleton:true,note:'alat ukur DC'},
  {id:'acMeter',name:'Meter AC',icon:'▣',singleton:true,note:'alat ukur AC'},
  {id:'table',name:'Meja Eksperimen',icon:'▤',singleton:false,note:'maks. 3 meja · alas komponen'},
  ...DEVICES.map(d=>({id:d.id,name:d.name,icon:d.icon,singleton:false,note:`${d.power} W · maks. 3 beban`}))
];
const state={
  irradiance:1000,angle:0,area:2,inverterEff:.92,material:'silicon',deficitMode:'conceptual',
  running:false,elapsed:0,eDC:0,eAC:0,solarTime:10,timeSpeed:300,
  showFlow:true,showPhotons:true,showDC:true,showAC:true,showLabels:true,showValues:true,
  mode:'explore',slots:[],placementTool:null
};

let scene,camera,renderer,controls,clock,raycaster,mouse,dragPlane,dragOffset,dragging=null;
let hemiLight,sunLight,skyDome;
const groups={}, draggables=[], originalDrop={};
const particles={photon:[],dc:[],ac:[]};
const TABLE_LIMIT=3;
const TABLE_TOP_Y=1.18;
const HOUSE_ZONE={minX:3.6,maxX:8.6,minZ:-5.8,maxZ:2.2,floorY:.08};
let selectedKey=null;
let selectionHelper=null;
let pointerOverTrash=false;

function isDaylight(){return state.solarTime>=6 && state.solarTime<=18;}
function material(){return MATERIALS.find(m=>m.id===state.material)||MATERIALS[0];}
function calc(){
  const hasSun=!!groups.sun,hasPanel=!!groups.panel,hasInv=!!groups.inverter;
  const daylight=isDaylight();
  const effectiveG=(hasSun&&daylight)?state.irradiance:0;
  const fTheta=Math.max(0,Math.cos(state.angle*Math.PI/180));
  const pSolar=hasPanel?effectiveG*state.area*fTheta:0;
  const pDC=pSolar*material().efficiency;
  const pAC=hasInv?pDC*state.inverterEff:0;
  const loads=state.slots.map(s=>s.on?(DEVICES.find(d=>d.id===s.device)?.power||0):0);
  const totalLoad=loads.reduce((a,b)=>a+b,0);
  const balance=pAC-totalLoad;
  const supplied=loads.map(()=>true);
  if(state.deficitMode==='realistic'&&balance<0){let budget=pAC;for(let i=0;i<loads.length;i++){if(loads[i]<=budget){budget-=loads[i];supplied[i]=true}else supplied[i]=false}}
  let status='Belum dirangkai';
  if(hasPanel&&!hasSun)status='Tanpa Matahari';
  else if(hasSun&&hasPanel&&!daylight)status='Malam';
  else if(hasSun&&hasPanel&&material().efficiency===0)status='No Conversion';
  else if(hasSun&&hasPanel&&!hasInv)status='DC tersedia';
  else if(hasSun&&hasPanel&&hasInv&&pAC>0&&totalLoad===0)status='Standby';
  else if(hasSun&&hasPanel&&hasInv&&pAC>0&&totalLoad>pAC)status='Overload';
  else if(hasSun&&hasPanel&&hasInv&&pAC>0&&totalLoad>=.9*pAC)status='Near Limit';
  else if(hasSun&&hasPanel&&hasInv&&pAC>0)status='Normal';
  else if(hasSun&&hasPanel&&daylight&&pDC===0)status='No Conversion';
  return{daylight,effectiveG,fTheta,pSolar,pDC,pAC,loads,totalLoad,balance,supplied,status};
}

function renderToolbox(){
  $('#toolbox').innerHTML=TOOLS.map(t=>`<div class="tool-item" draggable="true" data-tool="${t.id}" tabindex="0"><span class="tool-icon">${t.icon}</span><span><span class="tool-name">${t.name}</span><small>${t.note}</small></span></div>`).join('');
  $$('.tool-item').forEach(el=>{
    el.addEventListener('dragstart',e=>{if(el.classList.contains('used')){e.preventDefault();return;}e.dataTransfer.setData('text/plain',el.dataset.tool);e.dataTransfer.effectAllowed='copy';});
    el.addEventListener('click',()=>{if(el.classList.contains('used'))return;state.placementTool=el.dataset.tool;$('#placementBanner').classList.remove('hidden');toast('Klik workspace untuk meletakkan '+toolName(el.dataset.tool)+'.');});
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}})
  });
  updateToolboxUsage();
}
function updateToolboxUsage(){
  const tableCount=Object.keys(groups).filter(k=>k.startsWith('table')).length;
  $$('.tool-item').forEach(el=>{
    const t=TOOLS.find(x=>x.id===el.dataset.tool);
    const used=(t?.singleton&&!!groups[t.id])||(t?.id==='table'&&tableCount>=TABLE_LIMIT);
    el.classList.toggle('used',!!used);el.setAttribute('aria-disabled',used?'true':'false');
    if(t?.id==='table'){const small=el.querySelector('small');if(small)small.textContent=`${tableCount}/${TABLE_LIMIT} meja · alas komponen`;}
  });
}
function toolName(id){return TOOLS.find(t=>t.id===id)?.name||id;}
function renderMaterials(){
  $('#materialOptions').innerHTML=MATERIALS.map(m=>`<label><input type="radio" name="material" value="${m.id}" ${state.material===m.id?'checked':''}> ${m.name}</label>`).join('');
  $$('input[name=material]').forEach(x=>x.addEventListener('change',e=>{state.material=e.target.value;updatePanelMaterial();updateAll();}));
}
function renderSlots(){
  const box=$('#deviceSlots');
  if(!state.slots.length){box.innerHTML='<div class="empty-slot">Belum ada beban. Drag perangkat dari Kotak Alat.</div>';return;}
  box.innerHTML=state.slots.map((s,i)=>{const d=DEVICES.find(x=>x.id===s.device);return `<div class="device-row"><span class="slot-name">Slot ${i+1} · ${d.name} (${d.power} W)</span><label class="switch"><input type="checkbox" data-slot="${i}" ${s.on?'checked':''}><span class="slider"></span></label><button class="remove-btn" data-remove-slot="${i}" title="Hapus">×</button></div>`}).join('');
  $$('input[data-slot]').forEach(x=>x.addEventListener('change',e=>{state.slots[+e.target.dataset.slot].on=e.target.checked;updateAll();}));
  $$('[data-remove-slot]').forEach(b=>b.addEventListener('click',()=>removeDevice(+b.dataset.removeSlot)));
}
function renderData(){
  const c=calc();
  const statusClass=c.status==='Overload'?'bad':(c.status==='Near Limit'||c.status==='Malam'||c.status==='Belum dirangkai'?'warn':'');
  const metrics=[
    ['☀','Irradiance efektif',fmt(c.effectiveG),'W/m²'],['▦','Luas Panel',fmt(state.area), 'm²'],['◿','Sudut',fmt(state.angle),'°'],['⚙','Efisiensi Material',fmt(material().efficiency*100,1),'%'],
    ['⚡','P_solar',fmt(c.pSolar,0),'W'],['⚡','P_DC',fmt(c.pDC,1),'W'],['⚙','Ef. Inverter',fmt(state.inverterEff*100,0),'%'],['⚡','P_AC',fmt(c.pAC,1),'W'],['◉','Total Beban',fmt(c.totalLoad,0),'W'],['▥',c.balance>=0?'Surplus':'Defisit',fmt(Math.abs(c.balance),1),'W'],['●','Status',c.status,'']
  ];
  $('#dataGrid').innerHTML=metrics.map((m,i)=>`<div class="metric ${i===10?'status '+statusClass:''}"><div class="metric-label"><span>${m[0]}</span>${m[1]}</div><div class="metric-value">${m[2]}</div>${m[3]?`<span class="metric-unit">${m[3]}</span>`:''}</div>`).join('');
}

function init3D(){
  const host=$('#scene-container');
  scene=new THREE.Scene(); scene.background=new THREE.Color(0x5b94c8);
  camera=new THREE.PerspectiveCamera(48,host.clientWidth/host.clientHeight,.1,100);camera.position.set(12,9,15);
  renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(host.clientWidth,host.clientHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputEncoding=THREE.sRGBEncoding;host.appendChild(renderer.domElement);
  controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,1.7,0);controls.maxPolarAngle=Math.PI*.49;controls.minDistance=6;controls.maxDistance=28;
  hemiLight=new THREE.HemisphereLight(0xdaf0ff,0x6d8058,1.2);scene.add(hemiLight);sunLight=new THREE.DirectionalLight(0xfff3d1,1.4);sunLight.position.set(-8,12,-4);sunLight.castShadow=true;scene.add(sunLight);
  buildBackyard();
  createParticles();
  clock=new THREE.Clock();raycaster=new THREE.Raycaster();mouse=new THREE.Vector2();dragPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);dragOffset=new THREE.Vector3();
  renderer.domElement.addEventListener('pointerdown',onPointerDown);renderer.domElement.addEventListener('pointermove',onPointerMove);renderer.domElement.addEventListener('pointerup',onPointerUp);renderer.domElement.addEventListener('pointercancel',onPointerUp);
  renderer.domElement.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';});
  renderer.domElement.addEventListener('drop',onToolDrop);
  renderer.domElement.addEventListener('click',onSceneClick);
  window.addEventListener('resize',resize3D);
  window.addEventListener('keydown',e=>{
    const tag=(e.target?.tagName||'').toLowerCase();
    if((e.key==='Delete'||e.key==='Backspace')&&selectedKey&&!['input','select','textarea'].includes(tag)){e.preventDefault();removeObject(selectedKey);}
    if(e.key==='Escape')clearSelection();
  });
  updateEnvironment();animate();
}
function buildBackyard(){
  // Main lawn and experimental deck. The center remains intentionally open.
  const grass=new THREE.Mesh(new THREE.PlaneGeometry(42,32),new THREE.MeshStandardMaterial({color:0x2d4b3a,roughness:.96}));grass.rotation.x=-Math.PI/2;grass.position.y=-.03;grass.receiveShadow=true;scene.add(grass);
  const deck=new THREE.Mesh(new THREE.PlaneGeometry(18.5,11.5),new THREE.MeshStandardMaterial({color:0x353b43,roughness:.94,metalness:.02}));deck.rotation.x=-Math.PI/2;deck.position.set(-1.6,.01,.45);deck.receiveShadow=true;scene.add(deck);
  const grid=new THREE.GridHelper(18.5,19,0xc8d9e6,0x74889a);grid.position.set(-1.6,.026,.45);const gm=Array.isArray(grid.material)?grid.material:[grid.material];gm.forEach(m=>{m.transparent=true;m.opacity=.72});scene.add(grid);

  // Futuristic open-front house on the right. It is the dedicated load/appliance zone.
  const wallMat=new THREE.MeshStandardMaterial({color:0xf5f7f8,roughness:.82});
  const trimMat=new THREE.MeshStandardMaterial({color:0x353d46,roughness:.48,metalness:.1});
  const floorMat=new THREE.MeshStandardMaterial({color:0x2d333a,roughness:.86,metalness:.03});
  const houseFloor=new THREE.Mesh(new THREE.BoxGeometry(5.5,.14,8.3),floorMat);houseFloor.position.set(6.1,.07,-1.8);houseFloor.receiveShadow=true;scene.add(houseFloor);
  // Back and side walls, front remains fully open for visibility and interaction.
  const back=new THREE.Mesh(new THREE.BoxGeometry(5.7,4.4,.28),wallMat);back.position.set(6.1,2.2,-5.85);back.castShadow=true;back.receiveShadow=true;scene.add(back);
  const side=new THREE.Mesh(new THREE.BoxGeometry(.28,4.4,8.25),wallMat);side.position.set(8.85,2.2,-1.8);side.castShadow=true;side.receiveShadow=true;scene.add(side);
  const halfSide=new THREE.Mesh(new THREE.BoxGeometry(.22,2.0,3.2),wallMat);halfSide.position.set(3.35,1.0,-4.3);scene.add(halfSide);
  const roof=new THREE.Mesh(new THREE.BoxGeometry(6.1,.24,8.7),new THREE.MeshStandardMaterial({color:0xc5d0d3,roughness:.58,metalness:.05}));roof.position.set(6.1,4.55,-1.8);roof.castShadow=true;scene.add(roof);
  // Large windows make the room feel open but retain the futuristic clean design.
  const glassMat=new THREE.MeshStandardMaterial({color:0x6fb5d3,transparent:true,opacity:.26,metalness:.05,roughness:.18});
  for(let i=0;i<2;i++){const w=new THREE.Mesh(new THREE.BoxGeometry(1.75,2.25,.055),glassMat);w.position.set(5.1+i*2.0,2.45,-5.68);scene.add(w)}
  const frameTop=box(5.6,.11,.14,0x2f3944);frameTop.position.set(6.05,3.65,-5.63);scene.add(frameTop);
  const sideTrim=box(.12,4.1,8.05,0x2f3944);sideTrim.position.set(8.71,2.08,-1.8);scene.add(sideTrim);
  const frontSill=box(5.3,.12,.18,0x2f3944);frontSill.position.set(6.0,.95,2.22);scene.add(frontSill);
  // Interior partition and electrical rail for visual context only.
  const rail=box(4.5,.14,.13,0x687c89);rail.position.set(6.0,1.85,-5.55);scene.add(rail);
  const outletMat=new THREE.MeshStandardMaterial({color:0xf8fafb,roughness:.5});
  [4.35,5.55,6.75,7.95].forEach(x=>{const o=new THREE.Mesh(new THREE.BoxGeometry(.34,.46,.08),outletMat);o.position.set(x,1.25,-5.39);scene.add(o);const d1=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.02,10),new THREE.MeshBasicMaterial({color:0x414b55}));d1.rotation.x=Math.PI/2;d1.position.set(x-.07,1.26,-5.34);scene.add(d1);const d2=d1.clone();d2.position.x=x+.07;scene.add(d2)});
  const houseLabel=createLabelSprite('RUMAH · ZONA BEBAN LISTRIK');houseLabel.position.set(6.0,4.05,-5.45);houseLabel.scale.set(4.4,.72,1);scene.add(houseLabel);

  // Background is intentionally free from decorative tables, benches, or furniture-like structures.
  // Only perimeter landscaping and small lighting ornaments are kept so the assembly area remains visually clear.

  // Planters and shrubs only around the edge.
  [[-8.6,5.0],[-8.8,-5.6],[9.2,5.1],[9.4,-5.4]].forEach(([x,z],idx)=>{const pot=new THREE.Mesh(new THREE.CylinderGeometry(.4,.55,.72,12),new THREE.MeshStandardMaterial({color:idx%2?0xc8b9a4:0xd9ded8}));pot.position.set(x,.36,z);scene.add(pot);for(let i=0;i<6;i++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(.31,9,7),new THREE.MeshStandardMaterial({color:0x42884f}));leaf.scale.set(.55,1.35,.44);leaf.position.set(x+(Math.random()-.5)*.62,1.0+Math.random()*.95,z+(Math.random()-.5)*.56);leaf.rotation.z=(Math.random()-.5)*1.15;scene.add(leaf)}});

  // Perimeter fence.
  const fenceMat=new THREE.MeshStandardMaterial({color:0xc6d0ca});
  for(let x=-10;x<=10;x+=1.25){const p=new THREE.Mesh(new THREE.BoxGeometry(.07,1.1,.07),fenceMat);p.position.set(x,.55,7.2);scene.add(p)}
  const fenceRail=new THREE.Mesh(new THREE.BoxGeometry(20.2,.08,.08),fenceMat);fenceRail.position.set(0,1.0,7.2);scene.add(fenceRail);

  // Futuristic bollard lights placed away from work areas.
  const accentMat=new THREE.MeshStandardMaterial({color:0x647d8b,metalness:.18,roughness:.48});
  const warmMat=new THREE.MeshStandardMaterial({color:0xffe6a8,emissive:0xffc65c,emissiveIntensity:.45,roughness:.4});
  [[-9.0,-.7],[-9.0,2.8],[9.7,2.9],[9.7,-.3]].forEach(([x,z])=>{const post=new THREE.Mesh(new THREE.CylinderGeometry(.1,.14,.65,12),accentMat);post.position.set(x,.325,z);scene.add(post);const cap=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,.08,16),warmMat);cap.position.set(x,.69,z);scene.add(cap)});

  // Decorative solar sculpture, far from the assembly area.
  const mast=cyl(.08,.11,1.9,0x6c8290);mast.position.set(-9.1,.95,-3.5);scene.add(mast);
  const disc=new THREE.Mesh(new THREE.TorusGeometry(.45,.06,9,24),new THREE.MeshStandardMaterial({color:0x6fa3bf,metalness:.24,roughness:.36}));disc.position.set(-9.1,1.95,-3.5);disc.rotation.y=Math.PI/4;scene.add(disc);
}
function createLabelSprite(text){
  const canvas=document.createElement('canvas');canvas.width=320;canvas.height=80;const c=canvas.getContext('2d');c.fillStyle='rgba(255,255,255,.93)';roundRect(c,2,2,316,76,14);c.fill();c.strokeStyle='rgba(170,190,205,.75)';c.stroke();c.fillStyle='#26415c';c.font='600 28px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(text,160,40);
  const tex=new THREE.CanvasTexture(canvas);const mat=new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false});const s=new THREE.Sprite(mat);s.scale.set(2.45,.61,1);s.userData.isLabel=true;return s;
}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function mat(color,opts={}){return new THREE.MeshStandardMaterial({color,roughness:.65,metalness:.05,...opts})}
function box(w,h,d,color){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));m.castShadow=true;m.receiveShadow=true;return m}
function cyl(rt,rb,h,color,seg=16){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat(color));m.castShadow=true;return m}
function groupLabel(g,text,y){const l=createLabelSprite(text);l.position.set(0,y,0);g.add(l)}
function addOperationalAura(g,color=0x29d3ff,radius=.72,height=.06){
  const ringMat=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:0,transparent:true,opacity:.0});
  const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.045,10,40),ringMat);
  ring.rotation.x=Math.PI/2; ring.position.y=height; ring.visible=false; g.add(ring);
  const outerMat=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:0,transparent:true,opacity:.0});
  const outer=new THREE.Mesh(new THREE.TorusGeometry(radius*1.22,.03,8,32),outerMat);
  outer.rotation.x=Math.PI/2; outer.position.y=height+.02; outer.visible=false; g.add(outer);
  const beacons=[];
  for(let i=0;i<4;i++){
    const a=i*Math.PI/2;
    const b=new THREE.Mesh(new THREE.SphereGeometry(.055,10,8),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:0,transparent:true,opacity:0}));
    b.position.set(Math.cos(a)*(radius*.86),height+.08,Math.sin(a)*(radius*.86)); b.visible=false; g.add(b); beacons.push(b);
  }
  g.userData.powerAura={ring,outer,beacons,color,height,radius};
}
function addDrag(g,key){g.userData.key=key;g.traverse(o=>{if(o.isMesh){o.userData.dragRoot=g;draggables.push(o)}})}
function removeDraggableRefs(g){for(let i=draggables.length-1;i>=0;i--){let o=draggables[i];if(o===g||isDescendant(g,o))draggables.splice(i,1)}}
function isDescendant(parent,obj){let p=obj.parent;while(p){if(p===parent)return true;p=p.parent}return false}

function makeSun(){
  const g=new THREE.Group();const sphere=new THREE.Mesh(new THREE.SphereGeometry(.72,24,18),new THREE.MeshStandardMaterial({color:0xffd04c,emissive:0xffb300,emissiveIntensity:1.2}));g.add(sphere);const halo=new THREE.Mesh(new THREE.SphereGeometry(.95,20,16),new THREE.MeshBasicMaterial({color:0xffe68a,transparent:true,opacity:.22}));g.add(halo);groupLabel(g,'Matahari',1.35);return g;
}
function makePanel(){
  const g=new THREE.Group();const frame=box(3.7,.16,2.45,0x71808d);frame.position.y=.85;g.add(frame);const face=box(3.5,.08,2.25,material().color);face.position.y=.96;face.userData.panelFace=true;g.add(face);
  for(let x=-1.45;x<=1.45;x+=.58){const line=box(.018,.02,2.18,0xcfe8ff);line.position.set(x,1.015,0);g.add(line)}for(let z=-.88;z<=.88;z+=.44){const line=box(3.42,.02,.018,0xcfe8ff);line.position.set(0,1.018,z);g.add(line)}
  [-1.45,1.45].forEach(x=>{const leg=box(.13,.85,.13,0x75828b);leg.position.set(x,.42,.55);g.add(leg)});groupLabel(g,'Panel Surya',1.65);return g;
}
function makeMeter(type){const g=new THREE.Group();const body=box(1.35,1.55,.8,0x596773);body.position.y=.78;g.add(body);const scr=box(.92,.5,.06,0xddeff2);scr.position.set(0,.98,.43);g.add(scr);const red=new THREE.Mesh(new THREE.SphereGeometry(.08,12,8),new THREE.MeshStandardMaterial({color:0xd63f3f,emissive:0x5e0808}));red.position.set(-.3,.3,.44);g.add(red);const black=red.clone();black.material=mat(0x202833);black.position.x=.3;g.add(black);groupLabel(g,type==='dc'?'Meter DC':'Meter AC',1.95);return g}
function makeInverter(){const g=new THREE.Group();const b=box(1.6,1.55,1.05,0x8c969e);b.position.y=.78;g.add(b);const ring=new THREE.Mesh(new THREE.TorusGeometry(.31,.055,8,22,Math.PI),new THREE.MeshStandardMaterial({color:0x394957}));ring.position.set(0,.9,.54);ring.rotation.z=Math.PI;g.add(ring);const led=box(.3,.12,.05,0x38cf68);led.position.set(0,.28,.55);g.add(led);groupLabel(g,'Inverter',1.95);return g}
function makeTable(){
  const g=new THREE.Group();
  const top=box(4.2,.18,2.35,0xe7edf0);top.position.y=1.1;top.userData.tableSurface=true;g.add(top);
  const edge=box(4.28,.12,2.43,0x9aaab4);edge.position.y=1.0;g.add(edge);
  [[-1.65,-.82],[1.65,-.82],[-1.65,.82],[1.65,.82]].forEach(([x,z])=>{const leg=box(.16,1.02,.16,0x728590);leg.position.set(x,.51,z);g.add(leg)});
  // subtle cable rail under the table, visual only
  const rail=box(3.25,.08,.08,0x7e929e);rail.position.set(0,.52,-.92);g.add(rail);
  groupLabel(g,'Meja Eksperimen',1.65);
  g.userData.isTable=true;g.userData.tableSize={x:4.2,z:2.35};g.userData.tableTop=TABLE_TOP_Y;
  return g;
}

function makeDevice(id){
  const g=new THREE.Group();
  g.userData.deviceId=id;
  g.userData.animPhase=Math.random()*Math.PI*2;
  if(id==='fridge'){
    const b=box(1.15,2.2,.95,0xb9c3ca);b.position.y=1.1;g.add(b);
    const line=box(1.03,.03,.97,0x77828a);line.position.set(0,1.15,0);g.add(line);
    const led=box(.12,.08,.04,0x54d66f);led.position.set(.38,.38,.50);led.userData.operational=true;g.add(led);
    const handle=box(.07,.5,.05,0x69747b);handle.position.set(.4,1.55,.50);g.add(handle);
    g.userData.fridgeBody=b;
    addOperationalAura(g,0x39d2ff,.78,.05);
  }
  else if(id==='lamp'){
    const base=cyl(.42,.5,.25,0x8d8372);base.position.y=.13;g.add(base);const stem=cyl(.06,.06,.9,0x7f8790);stem.position.y=.65;g.add(stem);
    const bulbMat=new THREE.MeshStandardMaterial({color:0xffe48a,emissive:0xffc62c,emissiveIntensity:.12});
    const bulb=new THREE.Mesh(new THREE.SphereGeometry(.35,16,12),bulbMat);bulb.position.y=1.3;bulb.userData.operational=true;g.add(bulb);
    const light=new THREE.PointLight(0xffd67a,0,5,2);light.position.set(0,1.45,0);g.add(light);g.userData.deviceLight=light;g.userData.bulb=bulb;
    addOperationalAura(g,0xffcf4a,.62,.05);
  }
  else if(id==='ac'){
    const b=box(2.2,.85,.55,0xe6e8e8);b.position.y=.6;g.add(b);const vent=box(1.8,.1,.05,0x8598a6);vent.position.set(0,.38,.3);g.add(vent);
    const flap=box(1.65,.08,.13,0x5d7483);flap.position.set(0,.28,.34);flap.userData.operational=true;g.add(flap);g.userData.acFlap=flap;
    const led=box(.12,.07,.04,0x3ad76e);led.position.set(.82,.75,.3);led.userData.operational=true;g.add(led);
    addOperationalAura(g,0x32d8ff,.95,.05);
  }
  else if(id==='tv'){
    const frame=box(1.8,1.05,.12,0x2f3841);frame.position.y=.95;g.add(frame);const screenMat=new THREE.MeshStandardMaterial({color:0x182532,emissive:0x1a4c77,emissiveIntensity:.05});
    const screen=box(1.58,.83,.03,0x25435e);screen.material=screenMat;screen.position.set(0,.95,.075);screen.userData.operational=true;g.add(screen);g.userData.tvScreen=screen;
    const stand=box(.5,.5,.12,0x444c54);stand.position.y=.25;g.add(stand);
    addOperationalAura(g,0x32d8ff,.82,.05);
  }
  else if(id==='rice'){
    const pot=cyl(.58,.48,.8,0xe0e3e4);pot.position.y=.48;g.add(pot);const lid=cyl(.62,.62,.12,0x798791);lid.position.y=.94;g.add(lid);
    const led=box(.12,.09,.04,0xff7b35);led.position.set(.0,.38,.5);led.userData.operational=true;g.add(led);
    g.userData.steam=[];for(let i=0;i<4;i++){const puff=new THREE.Mesh(new THREE.SphereGeometry(.08+.02*i,8,6),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0}));puff.position.set((i-1.5)*.06,1.1+i*.16,0);g.add(puff);g.userData.steam.push(puff)}
    addOperationalAura(g,0xff9a3d,.70,.05);
  }
  else if(id==='laptop'){
    const base=box(1.55,.1,1.0,0x8b969f);base.position.y=.12;g.add(base);const frame=box(1.55,1,.08,0x4a5966);frame.position.set(0,.68,-.48);frame.rotation.x=-.12;g.add(frame);
    const screen=box(1.38,.82,.025,0x254f72);screen.position.set(0,.69,-.525);screen.rotation.x=-.12;screen.material=new THREE.MeshStandardMaterial({color:0x244866,emissive:0x1f8fd2,emissiveIntensity:.05});screen.userData.operational=true;g.add(screen);g.userData.laptopScreen=screen;
    addOperationalAura(g,0x3ec9ff,.68,.05);
  }
  const d=DEVICES.find(x=>x.id===id);groupLabel(g,d.name,2.55);return g;
}

function isInHouseZone(g){
  if(!g)return false;const p=g.position;
  return p.x>=HOUSE_ZONE.minX&&p.x<=HOUSE_ZONE.maxX&&p.z>=HOUSE_ZONE.minZ&&p.z<=HOUSE_ZONE.maxZ;
}

function animateDevices(t){
  const c=calc();
  state.slots.forEach((slot,i)=>{
    const g=groups[slot.key];if(!g)return;
    const powered=!!(slot.on&&c.supplied[i]&&c.pAC>0&&isInHouseZone(g));
    const phase=t+(g.userData.animPhase||0),id=slot.device;
    g.userData.isPowered=powered;
    if(g.userData.basePosY==null)g.userData.basePosY=g.position.y;
    g.position.y=(g.userData.basePosY??g.position.y)+(powered?0.012*Math.sin(phase*18):0);
    g.rotation.y=powered?0.02*Math.sin(phase*12):0;
    g.traverse(o=>{if(o.userData.operational&&o.material&&'emissiveIntensity' in o.material)o.material.emissiveIntensity=powered?1.15:.08});
    const aura=g.userData.powerAura;
    if(aura){
      const pulse=.5+.5*Math.sin(phase*4.5);
      aura.ring.visible=aura.outer.visible=powered;
      aura.ring.material.emissiveIntensity=powered?0.9+.7*pulse:0; aura.ring.material.opacity=powered?0.72:.0; aura.ring.scale.setScalar(powered?1+.04*pulse:1);
      aura.outer.visible=powered; aura.outer.material.emissiveIntensity=powered?0.6+.4*(1-pulse):0; aura.outer.material.opacity=powered?0.45:.0; aura.outer.scale.setScalar(powered?1.02+.08*(1-pulse):1);
      (aura.beacons||[]).forEach((b,j)=>{const pp=.5+.5*Math.sin(phase*5+j*1.2); b.visible=powered; b.material.emissiveIntensity=powered?1.0+.6*pp:0; b.material.opacity=powered?.9:.0; b.position.y=aura.height+.08+(powered?.03*pp:0);});
    }
    if(id==='lamp'){
      if(g.userData.deviceLight)g.userData.deviceLight.intensity=powered?1.35:0;
      if(g.userData.bulb)g.userData.bulb.scale.setScalar(powered?1+.025*Math.sin(phase*5):1);
    }else if(id==='ac'){
      if(g.userData.acFlap)g.userData.acFlap.rotation.x=powered?-.12+.16*Math.sin(phase*5):0;
    }else if(id==='tv'){
      if(g.userData.tvScreen){const hue=.54+.05*Math.sin(phase*.8);g.userData.tvScreen.material.color.setHSL(hue,.45,powered?.35:.12);g.userData.tvScreen.material.emissiveIntensity=powered?.65:.03;}
    }else if(id==='rice'){
      (g.userData.steam||[]).forEach((p,j)=>{if(powered){const cycle=(phase*.65+j*.24)%1;p.visible=true;p.position.y=1.05+cycle*1.25;p.position.x=(j-1.5)*.06+.05*Math.sin(phase*2+j);p.material.opacity=.36*(1-cycle);p.scale.setScalar(.8+cycle*.75);}else{p.visible=false;p.material.opacity=0;}});
    }else if(id==='laptop'){
      if(g.userData.laptopScreen){g.userData.laptopScreen.material.emissiveIntensity=powered?.55+.18*(.5+.5*Math.sin(phase*2)):.03;}
    }else if(id==='fridge'){
      if(g.userData.fridgeBody){g.userData.fridgeBody.position.x=powered?.008*Math.sin(phase*18):0;}
    }
  });
}
function syncSelectionUI(){
  const bar=$('#selectionToolbar'),label=$('#selectedObjectLabel');
  if(!bar||!label)return;
  if(!selectedKey||!groups[selectedKey]){bar.classList.add('hidden');return;}
  let name=toolName(selectedKey);
  if(selectedKey.startsWith('device')){const slot=state.slots.find(s=>s.key===selectedKey);const d=slot&&DEVICES.find(x=>x.id===slot.device);name=d?.name||'Perangkat';}
  if(selectedKey.startsWith('table'))name='Meja Eksperimen';
  label.textContent=name+' dipilih';bar.classList.remove('hidden');
}
function clearSelection(){
  selectedKey=null;
  if(selectionHelper){scene.remove(selectionHelper);selectionHelper=null;}
  syncSelectionUI();
}
function selectObject(key){
  if(!key||!groups[key]){clearSelection();return;}
  selectedKey=key;
  if(selectionHelper){scene.remove(selectionHelper);selectionHelper=null;}
  selectionHelper=new THREE.BoxHelper(groups[key],0x2f80ed);
  selectionHelper.material.depthTest=false;
  selectionHelper.renderOrder=999;
  scene.add(selectionHelper);
  syncSelectionUI();
}
function updateSelectionHelper(){if(selectionHelper&&selectedKey&&groups[selectedKey])selectionHelper.setFromObject(groups[selectedKey]);}
function setTrashVisible(visible){
  const z=$('#trashZone');if(!z)return;
  z.classList.toggle('hidden',!visible);if(!visible){z.classList.remove('hot');pointerOverTrash=false;}
}
function updateTrashHit(clientX,clientY){
  const z=$('#trashZone');if(!z||z.classList.contains('hidden')){pointerOverTrash=false;return false;}
  const r=z.getBoundingClientRect();pointerOverTrash=clientX>=r.left&&clientX<=r.right&&clientY>=r.top&&clientY<=r.bottom;
  z.classList.toggle('hot',pointerOverTrash);return pointerOverTrash;
}
function tableAt(x,z,ignoreKey=null){
  let best=null;
  Object.entries(groups).forEach(([key,g])=>{
    if(key===ignoreKey||!key.startsWith('table')||!g.userData.tableSize)return;
    const sx=g.userData.tableSize.x/2,sz=g.userData.tableSize.z/2;
    if(Math.abs(x-g.position.x)<=sx*.88&&Math.abs(z-g.position.z)<=sz*.82)best={key,group:g,y:g.userData.tableTop||TABLE_TOP_Y};
  });
  return best;
}
function placeOnSupport(g,key,x,z){
  if(key==='sun'||key.startsWith('table'))return;
  const t=tableAt(x,z,key);
  if(t){g.position.y=t.y;g.userData.supportTable=t.key;}
  else{g.position.y=0;g.userData.supportTable=null;}
}
function releaseObjectsFromTable(tableKey){
  Object.entries(groups).forEach(([key,g])=>{if(g?.userData?.supportTable===tableKey){g.userData.supportTable=null;g.position.y=0;}});
}
function moveObjectsWithTable(tableKey,dx,dz){
  Object.entries(groups).forEach(([key,g])=>{if(g?.userData?.supportTable===tableKey){g.position.x=clamp(g.position.x+dx,-8.8,8.8);g.position.z=clamp(g.position.z+dz,-5.7,5.7);}});
}
function addObject(type,position){
  const singleton=TOOLS.find(t=>t.id===type)?.singleton;
  if(singleton&&groups[type]){toast(toolName(type)+' sudah ada di workspace.');return false;}
  if(DEVICES.some(d=>d.id===type)&&state.slots.length>=3){toast('Maksimum tiga beban elektronik sesuai PRD.');return false;}
  if(type==='table'&&Object.keys(groups).filter(k=>k.startsWith('table')).length>=TABLE_LIMIT){toast('Maksimum tiga meja eksperimen.');return false;}
  let g,key=type;
  if(type==='sun')g=makeSun();else if(type==='panel')g=makePanel();else if(type==='inverter')g=makeInverter();else if(type==='dcMeter')g=makeMeter('dc');else if(type==='acMeter')g=makeMeter('ac');else if(type==='table'){let idx=0;while(groups['table'+idx]&&idx<TABLE_LIMIT)idx++;key='table'+idx;g=makeTable();}else if(DEVICES.some(d=>d.id===type)){const idx=state.slots.length;key='device'+idx;g=makeDevice(type);state.slots.push({device:type,on:true,key});}
  if(!g)return false;
  if(type==='sun'){g.userData.trackZ=clamp(position.z,-5,5);g.userData.trackCenterX=0;scene.add(g);groups.sun=g;addDrag(g,'sun');updateSunPosition();}
  else{g.position.copy(position);g.position.y=(key.startsWith('device')&&isInHouseZone(g))?HOUSE_ZONE.floorY:0;scene.add(g);groups[key]=g;addDrag(g,key);if(!key.startsWith('device')||!isInHouseZone(g))placeOnSupport(g,key,g.position.x,g.position.z);}
  originalDrop[key]=g.position.clone();selectObject(key);updatePanelMaterial();renderSlots();updateToolboxUsage();updateEmptyState();updateFlows();updateAll();toast(toolName(type)+' ditambahkan.');return true;
}
function removeDevice(index){
  const slot=state.slots[index];if(!slot)return;const key=slot.key;removeGroup(key);state.slots.splice(index,1);
  // re-key remaining device groups to match slots
  const remaining=state.slots.map(s=>({slot:s,group:groups[s.key]}));remaining.forEach(({slot})=>{delete groups[slot.key]});remaining.forEach(({slot,group},i)=>{const nk='device'+i;slot.key=nk;groups[nk]=group;group.userData.key=nk;group.traverse(o=>{if(o.isMesh)o.userData.dragRoot=group})});
  clearSelection();renderSlots();updateFlows();updateAll();updateEmptyState();
}
function removeObject(key){
  if(key?.startsWith('device')){const idx=state.slots.findIndex(s=>s.key===key);if(idx>=0){removeDevice(idx);return}}
  if(groups[key]){removeGroup(key);updateToolboxUsage();updateFlows();updateAll();updateEmptyState();syncSelectionUI();toast('Objek dihapus.');}
}
function removeGroup(key){const g=groups[key];if(!g)return;if(key.startsWith('table'))releaseObjectsFromTable(key);removeDraggableRefs(g);scene.remove(g);delete groups[key];if(selectedKey===key)clearSelection();}
function clearWorkspace(){
  clearSelection();setTrashVisible(false);Object.keys(groups).forEach(k=>removeGroup(k));state.slots=[];state.running=false;state.elapsed=0;state.eDC=0;state.eAC=0;state.solarTime=10;state.irradiance=1000;state.angle=0;state.material='silicon';state.placementTool=null;
  $('#solarTime').value=10;$('#irradiance').value=1000;$('#irradianceNumber').value=1000;$('#angle').value=0;$('#angleNumber').value=0;renderMaterials();renderSlots();updateToolboxUsage();updateEmptyState();updateEnvironment();updateFlows();updateAll();controls.target.set(0,1.6,0);camera.position.set(12,9,15);toast('Workspace dikosongkan.');
}
function updateEmptyState(){$('#emptyState').classList.toggle('hidden',Object.keys(groups).length>0)}
function updatePanelMaterial(){if(groups.panel){groups.panel.traverse(o=>{if(o.userData.panelFace)o.material.color.setHex(material().color)})}}

function createParticles(){
  for(let i=0;i<26;i++){const p=particle(0xffd735,.07);scene.add(p);particles.photon.push(p)}
  for(let i=0;i<22;i++){const p=particle(0x2489f5,.06);scene.add(p);particles.dc.push(p)}
  for(let i=0;i<30;i++){const p=particle(0xf28a38,.06);scene.add(p);particles.ac.push(p)}
}
function particle(color,r){return new THREE.Mesh(new THREE.SphereGeometry(r,8,6),new THREE.MeshBasicMaterial({color}))}
function worldPos(key,offset=new THREE.Vector3()){const g=groups[key];if(!g)return null;const p=new THREE.Vector3();g.getWorldPosition(p);return p.add(offset)}
function linePts(a,b,n){const arr=[];for(let i=0;i<n;i++)arr.push(a.clone().lerp(b,i/(n-1)));return arr}
function setParticlePath(list,path,visible){list.forEach((p,i)=>{p.visible=visible&&path.length>1;if(path.length>1)p.position.copy(path[i%path.length])})}
function updateFlows(){
  const c=calc(),show=state.showFlow;
  let ph=[],dc=[],ac=[];
  const sun=worldPos('sun'),panel=worldPos('panel',new THREE.Vector3(0,1,0)),inv=worldPos('inverter',new THREE.Vector3(0,.8,0)),dcm=worldPos('dcMeter',new THREE.Vector3(0,.8,0)),acm=worldPos('acMeter',new THREE.Vector3(0,.8,0));
  if(sun&&panel)ph=linePts(sun,panel,26);
  if(panel&&inv){dc=dcm?[...linePts(panel,dcm,11),...linePts(dcm,inv,11)]:linePts(panel,inv,22)}
  if(inv&&state.slots.length){const start=acm||inv;state.slots.forEach(s=>{const p=worldPos(s.key,new THREE.Vector3(0,1,0));if(p)ac.push(...linePts(start,p,10))});if(acm)ac=[...linePts(inv,acm,8),...ac]}
  setParticlePath(particles.photon,ph,show&&state.showPhotons&&c.daylight&&c.effectiveG>0);setParticlePath(particles.dc,dc,show&&state.showDC&&c.pDC>0);setParticlePath(particles.ac,ac,show&&state.showAC&&c.pAC>0);
  Object.values(groups).forEach(g=>g?.traverse(o=>{if(o.userData.isLabel)o.visible=state.showLabels}));
}

function sunBasePosition(t){
  let x,y;
  if(t>=6&&t<=18){const a=Math.PI*(t-6)/12;x=-8*Math.cos(a);y=.75+7.4*Math.sin(a)}
  else{const n=t<6?t+6:t-18;const a=Math.PI*(n/12);x=8*Math.cos(a);y=-1.2-2*Math.sin(a)}
  return{x,y};
}
function updateSunPosition(){
  const g=groups.sun;if(!g)return;
  const base=sunBasePosition(state.solarTime);const x=base.x+(g.userData.trackCenterX||0),y=base.y;
  g.position.set(x,y,g.userData.trackZ??-4.5);sunLight.position.set(x,Math.max(2,y),g.position.z);
}
function updateEnvironment(){
  const day=isDaylight();const t=state.solarTime;let factor=0;
  if(day)factor=Math.sin(Math.PI*(t-6)/12);
  const skyDay=new THREE.Color(0x4f8dc6),skyTwilight=new THREE.Color(0xc86f43),skyNight=new THREE.Color(0x132033);
  let sky;if(day){sky=skyTwilight.clone().lerp(skyDay,clamp(factor*1.35,0,1))}else sky=skyNight;
  scene.background.copy(sky);hemiLight.intensity=day?.58+factor*.72:.22;sunLight.intensity=day?.78+factor*1.28:.06;
  $('#dayStatus').textContent=`${day?'☀ Siang':'☾ Malam'} · ${formatSolarTime(t)}`;
  $('#solarClock').textContent=formatSolarTime(t);const av=$('#solarAvailability');av.textContent=day?'Panel aktif':'Panel tidak aktif';av.className='badge '+(day?'day':'night');
}
function formatSolarTime(v){let h=Math.floor(v)%24,m=Math.round((v-Math.floor(v))*60);if(m===60){h=(h+1)%24;m=0}return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`}
function formatElapsed(sec){const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=Math.floor(sec%60);return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}

function eventToFloor(clientX,clientY){const r=renderer.domElement.getBoundingClientRect();mouse.x=((clientX-r.left)/r.width)*2-1;mouse.y=-((clientY-r.top)/r.height)*2+1;raycaster.setFromCamera(mouse,camera);const floor=new THREE.Plane(new THREE.Vector3(0,1,0),0);const p=new THREE.Vector3();if(raycaster.ray.intersectPlane(floor,p)){p.x=clamp(p.x,-8.8,8.8);p.z=clamp(p.z,-5.7,5.7);return p}return new THREE.Vector3(0,0,0)}
function onToolDrop(e){e.preventDefault();const type=e.dataTransfer.getData('text/plain');if(!type)return;addObject(type,eventToFloor(e.clientX,e.clientY));state.placementTool=null;$('#placementBanner').classList.add('hidden')}
function onSceneClick(e){if(!state.placementTool)return;if(dragging)return;addObject(state.placementTool,eventToFloor(e.clientX,e.clientY));state.placementTool=null;$('#placementBanner').classList.add('hidden')}
function ndc(e){const r=renderer.domElement.getBoundingClientRect();mouse.x=((e.clientX-r.left)/r.width)*2-1;mouse.y=-((e.clientY-r.top)/r.height)*2+1}
function onPointerDown(e){
  if(state.placementTool)return;ndc(e);raycaster.setFromCamera(mouse,camera);const hits=raycaster.intersectObjects(draggables,true);if(!hits.length){clearSelection();return}dragging=hits[0].object.userData.dragRoot;selectObject(dragging.userData.key);controls.enabled=false;setTrashVisible(true);
  // Sun is time-driven. Dragging changes its path depth only while keeping x/y clock-controlled.
  const wp=new THREE.Vector3();dragging.getWorldPosition(wp);dragPlane.set(new THREE.Vector3(0,1,0),0);const hit=new THREE.Vector3();raycaster.ray.intersectPlane(dragPlane,hit);dragOffset.set(wp.x-hit.x,0,wp.z-hit.z);dragging.userData.dragStartX=dragging.position.x;dragging.userData.dragStartZ=dragging.position.z;renderer.domElement.setPointerCapture?.(e.pointerId)
}
function onPointerMove(e){
  if(!dragging)return;ndc(e);raycaster.setFromCamera(mouse,camera);const hit=new THREE.Vector3();if(!raycaster.ray.intersectPlane(dragPlane,hit))return;hit.add(dragOffset);
  const key=dragging.userData.key;
  if(dragging===groups.sun){const base=sunBasePosition(state.solarTime);dragging.userData.trackCenterX=clamp(hit.x-base.x,-3.5,3.5);dragging.userData.trackZ=clamp(hit.z,-5.5,5.5);updateSunPosition()}
  else if(key?.startsWith('table')){
    const ox=dragging.position.x,oz=dragging.position.z;dragging.position.x=clamp(hit.x,-6.5,6.5);dragging.position.z=clamp(hit.z,-4.4,4.7);dragging.position.y=0;
    moveObjectsWithTable(key,dragging.position.x-ox,dragging.position.z-oz);
  } else {
    dragging.position.x=clamp(hit.x,-8.8,8.8);dragging.position.z=clamp(hit.z,-5.7,5.7);if(key?.startsWith('device')&&isInHouseZone(dragging)){dragging.position.y=HOUSE_ZONE.floorY;dragging.userData.supportTable=null;}else placeOnSupport(dragging,key,dragging.position.x,dragging.position.z);
  }
  updateTrashHit(e.clientX,e.clientY);updateSelectionHelper();updateFlows();
}
function onPointerUp(e){if(dragging){const key=dragging.userData.key;const remove=updateTrashHit(e?.clientX??-1,e?.clientY??-1);dragging=null;controls.enabled=true;setTrashVisible(false);if(remove&&key){removeObject(key);toast('Objek dihapus dari workspace.');return;}updateSelectionHelper();}}
function resize3D(){const h=$('#scene-container');camera.aspect=h.clientWidth/h.clientHeight;camera.updateProjectionMatrix();renderer.setSize(h.clientWidth,h.clientHeight)}

function updateAll(flow=true){
  updateSunPosition();updateEnvironment();renderData();if(flow)updateFlows();$('#stopwatch').textContent=formatElapsed(state.elapsed);$('#playPauseBtn').textContent=state.running?'❚❚':'▶';
  if(groups.panel)groups.panel.rotation.z=-(state.angle*Math.PI/180)*.45;updateSelectionHelper();
  const c=calc();state.slots.forEach((s,i)=>{const g=groups[s.key];if(!g)return;g.traverse(o=>{if(o.userData.operational){o.material.emissiveIntensity=(s.on&&c.supplied[i]&&c.pAC>0)?1.3:.15}})});
}
function animate(){
  requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);if(state.running){const simDt=dt*state.timeSpeed;state.elapsed+=simDt;state.solarTime=(state.solarTime+simDt/3600)%24;$('#solarTime').value=state.solarTime;const c=calc();state.eDC+=c.pDC*simDt/3600;state.eAC+=c.pAC*simDt/3600;}
  const t=performance.now()*.001;animateDevices(t);particles.photon.forEach((p,i)=>p.scale.setScalar(.8+.26*Math.sin(t*5+i)));particles.dc.forEach((p,i)=>p.scale.setScalar(.9+.18*Math.sin(t*6+i)));particles.ac.forEach((p,i)=>p.scale.setScalar(.9+.18*Math.sin(t*7+i)));
  controls.update();renderer.render(scene,camera);const tick=Math.floor(performance.now()/150);if(animate.tick!==tick){animate.tick=tick;updateAll(false);updateFlows()}
}

function bindUI(){
  $('#deleteSelectedBtn').addEventListener('click',()=>{if(selectedKey)removeObject(selectedKey);});
  const syncI=v=>{state.irradiance=clamp(+v||0,0,1200);$('#irradiance').value=state.irradiance;$('#irradianceNumber').value=state.irradiance;updateAll()};$('#irradiance').addEventListener('input',e=>syncI(e.target.value));$('#irradianceNumber').addEventListener('change',e=>syncI(e.target.value));
  const syncA=v=>{state.angle=clamp(+v||0,0,90);$('#angle').value=state.angle;$('#angleNumber').value=state.angle;updateAll()};$('#angle').addEventListener('input',e=>syncA(e.target.value));$('#angleNumber').addEventListener('change',e=>syncA(e.target.value));
  $('#solarTime').addEventListener('input',e=>{state.solarTime=+e.target.value;updateAll()});$('#timeSpeed').addEventListener('change',e=>state.timeSpeed=+e.target.value);
  $$('input[name=deficit]').forEach(el=>el.addEventListener('change',e=>{state.deficitMode=e.target.value;updateAll()}));
  ['showFlow','showPhotons','showDC','showAC','showLabels'].forEach(id=>$('#'+id).addEventListener('change',e=>{state[id]=e.target.checked;updateAll()}));
  $('#showStopwatch').addEventListener('change',e=>$('#stopwatch').classList.toggle('hidden',!e.target.checked));$('#showValues').addEventListener('change',e=>{state.showValues=e.target.checked;$('#dataGrid').style.opacity=e.target.checked?'1':'.35'});
  $('#playPauseBtn').addEventListener('click',()=>{state.running=!state.running;updateAll()});$('#stepBtn').addEventListener('click',()=>{state.solarTime=(state.solarTime+.5)%24;$('#solarTime').value=state.solarTime;updateAll()});$('#resetBtn').addEventListener('click',clearWorkspace);
  $$('.mode-tab').forEach(b=>b.addEventListener('click',()=>{$$('.mode-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.mode=b.dataset.mode;toast({explore:'Mode Eksplorasi aktif.',guided:'Eksperimen Terpandu dipilih.',compare:'Mode Bandingkan dipilih.',challenge:'Mode Tantangan dipilih.'}[state.mode])}));
  $('#helpBtn').addEventListener('click',()=>showModal('Bantuan',`<p><b>Membangun simulasi:</b> drag komponen dari Kotak Alat ke workspace. Scene dimulai kosong. Maksimum tiga beban elektronik dan tiga meja eksperimen dapat digunakan. Perangkat listrik sebaiknya ditempatkan di area Rumah · Zona Beban Listrik agar dapat beroperasi. Saat perangkat aktif, objek akan beranimasi dan menampilkan indikator cahaya di sekelilingnya.</p><p><b>Meja eksperimen:</b> tambahkan Meja Eksperimen dari Kotak Alat. Meja bukan ornamen tetap, sehingga hanya muncul ketika pemain menambahkannya. Komponen eksperimen dapat di-snap ke permukaan meja.</p><p><b>Waktu matahari:</b> posisi matahari mengikuti jam simulasi. Panel hanya menghasilkan energi pada rentang 06:00–18:00. Di luar rentang tersebut irradiance efektif menjadi 0 W/m².</p><p><b>Drag objek:</b> semua komponen yang sudah berada pada canvas dapat dipindahkan. Klik objek untuk memilihnya, lalu gunakan tombol <b>Hapus</b>, tombol Delete/Backspace, atau seret objek ke area tempat sampah yang muncul saat drag.</p><p><b>Matahari:</b> drag menggeser kedalaman jalur matahari, sedangkan posisi timur-barat dan ketinggian tetap mengikuti waktu.</p><p><b>Reset:</b> tombol oranye menghapus seluruh objek dari workspace dan mengembalikan parameter awal.</p>`));
  $('#settingsBtn').addEventListener('click',()=>showModal('Pengaturan',`<p><b>Lingkungan:</b> futuristic backyard berbasis primitive geometry dengan rumah terbuka sebagai zona pemasangan beban listrik. Ornamen hanya berupa planter, bollard light, pagar, dan solar sculpture di perimeter. Tidak ada meja, bangku, pergola, atau furnitur dekoratif pada background. Area perakitan memakai lantai slate gelap dan langit biru yang sedikit lebih pekat agar matahari, panel, dan perangkat memiliki kontras yang jelas.</p><button id="clearBtnModal" style="padding:9px 12px;border:1px solid #dbe5ef;border-radius:8px;background:#fff;cursor:pointer">Kosongkan Workspace</button><p style="margin-top:10px">Tekan Delete/Backspace untuk menghapus objek yang terakhir dipilih.</p>`));
  $('#closeModal').addEventListener('click',()=>$('#modal').classList.add('hidden'));$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')$('#modal').classList.add('hidden')});$('#modalBody').addEventListener('click',e=>{if(e.target.id==='clearBtnModal'){clearWorkspace();$('#modal').classList.add('hidden')}});
}
function showModal(title,html){$('#modalTitle').textContent=title;$('#modalBody').innerHTML=html;$('#modal').classList.remove('hidden')}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.remove('hidden');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.add('hidden'),1800)}

renderToolbox();renderMaterials();renderSlots();bindUI();init3D();updateEmptyState();syncSelectionUI();updateAll();
})();
