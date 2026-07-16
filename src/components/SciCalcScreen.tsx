import React from 'react';
import { useApp } from '../store/AppContext';
import { ArrowLeft } from 'lucide-react';

export const SciCalcScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  
  return (
    <div className={`relative flex flex-col w-full h-[100dvh] ${state.isComputerMode ? 'max-w-6xl' : 'max-w-md'} mx-auto shadow-2xl overflow-hidden sm:h-[800px] sm:rounded-[2.5rem] transition-all duration-300 bg-[#081b2e]`}>
      <header className="px-6 pt-12 pb-4 flex items-center z-10 bg-[#081b2e] text-white">
        <button 
          onClick={() => {
            dispatch({ type: 'SET_ACTIVE_APP', payload: 'notes' });
          }} 
          className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={28} />
        </button>
      </header>
      <div className="flex-1 w-full h-full relative">
        <iframe 
          srcDoc={`
<!DOCTYPE html>
<html lang="ar" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

  :root{
    --blue-deep:#0e2c47;
    --blue-mid:#153f66;
    --grid-line:rgba(120,180,220,.14);
    --paper:#efe8d6;
    --paper-shadow:#c9c0a8;
    --graphite:#20241f;
    --amber:#e2a03f;
    --amber-dark:#a86f1e;
    --coral:#d9634c;
    --coral-dark:#9c3f2c;
    --cyan:#6fc6d9;
  }

  *{ box-sizing:border-box; -webkit-tap-highlight-color:transparent; }

  body{
    margin:0;
    min-height:100vh;
    background:
      repeating-linear-gradient(0deg, var(--grid-line) 0 1px, transparent 1px 28px),
      repeating-linear-gradient(90deg, var(--grid-line) 0 1px, transparent 1px 28px),
      linear-gradient(160deg, var(--blue-deep), #081b2e 80%);
    display:flex;
    align-items:flex-start;
    justify-content:center;
    font-family:'Space Grotesk', sans-serif;
    padding:0 28px 28px;
  }

  .unit{
    width:400px;
    max-width:100%;
    position:relative;
    margin-top: 10px;
  }

  .ticks-top, .ticks-bottom{
    display:flex;
    justify-content:space-between;
    padding:0 6px;
    margin-bottom:4px;
    color: var(--cyan);
    opacity:.5;
  }
  .ticks-top span, .ticks-bottom span{
    width:1px; height:6px; background: var(--cyan);
    display:block;
  }
  .ticks-bottom{ margin-top:6px; margin-bottom:0; }

  .card{
    background: linear-gradient(175deg, #12324f, #0c2540);
    border:1px solid rgba(150,200,230,.18);
    border-radius:6px;
    padding:20px 18px 18px;
    box-shadow: 0 30px 70px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.04);
  }

  .head{
    display:flex;
    justify-content:space-between;
    align-items:baseline;
    margin-bottom:12px;
    padding:0 2px;
  }
  .head .title{
    font-weight:700;
    letter-spacing:3px;
    color:#e8f1f7;
    font-size:14px;
  }
  .head .title b{ color: var(--amber); }
  .head .modebar{
    display:flex;
    gap:10px;
    font-family:'IBM Plex Mono', monospace;
    font-size:10.5px;
    color: var(--cyan);
    letter-spacing:1px;
  }
  .head .modebar .active{ color:#fff; font-weight:600; }
  .head .modebar span{ cursor:pointer; }

  .display{
    background: #061420;
    border-radius:5px;
    padding:14px 14px 12px;
    margin-bottom:14px;
    min-height:120px;
    display:flex;
    flex-direction:column;
    justify-content:flex-end;
    box-shadow: inset 0 2px 10px rgba(0,0,0,.5);
    border:1px solid rgba(111,198,217,.15);
  }

  .expr-line{
    font-family:'IBM Plex Mono', monospace;
    font-size:24px;
    color:#eaf6fb;
    min-height:36px;
    line-height:1.4;
    overflow-x:auto;
    overflow-y:hidden;
    white-space:nowrap;
    scrollbar-width:none;
    display:flex;
    align-items:flex-end;
    flex-wrap:wrap;
  }
  .expr-line::-webkit-scrollbar{ display:none; }

  .result-line{
    font-family:'IBM Plex Mono', monospace;
    font-size:19px;
    color: var(--amber);
    text-align:right;
    margin-top:6px;
    min-height:24px;
    overflow-x:auto;
    white-space:nowrap;
    scrollbar-width:none;
  }
  .result-line.err{ color: var(--coral); }

  .frac-wrap{ display:inline-flex; flex-direction:column; align-items:center; vertical-align:middle; margin:0 3px; font-size:.62em; line-height:1.15; }
  .frac-num, .frac-den{ padding:0 3px; min-width:16px; text-align:center; }
  .frac-bar{ width:100%; height:0; border-top:2px solid #eaf6fb; margin:2px 0; }
  .pow-wrap{ display:inline-flex; align-items:flex-start; }
  .pow-exp{ font-size:.6em; position:relative; top:-.6em; padding:0 1px; color: var(--cyan); }
  .sqrt-wrap{ display:inline-flex; align-items:flex-start; }
  .sqrt-sign{ margin-right:1px; }
  .sqrt-bar{ border-top:2px solid #eaf6fb; padding:0 3px; min-width:14px; margin-top:1px; }
  .placeholder-box{ display:inline-block; width:14px; height:16px; border:1px dashed rgba(111,198,217,.5); border-radius:2px; vertical-align:middle; margin:0 1px; }
  .caret{ display:inline-block; width:2px; height:1em; background: var(--amber); animation: blink 1s steps(1) infinite; vertical-align:middle; margin:0 -1px; }
  @keyframes blink{ 50%{ opacity:0; } }

  .keys{ display:grid; gap:7px; }
  .row{ display:grid; gap:7px; }
  .r6{ grid-template-columns:repeat(6,1fr); }
  .r5{ grid-template-columns:repeat(5,1fr); }

  .key{
    position:relative;
    border:none;
    border-radius:6px;
    background: var(--paper);
    color: var(--graphite);
    font-family:'Space Grotesk', sans-serif;
    font-size:13px;
    font-weight:600;
    padding:11px 2px 9px;
    cursor:pointer;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    line-height:1.1;
    box-shadow: 0 2px 0 var(--paper-shadow);
    transition: transform .05s, box-shadow .05s;
  }
  .key:active{ transform: translateY(2px); box-shadow:0 0 0 var(--paper-shadow); }
  .key .sub{ position:absolute; top:2px; left:5px; font-size:8px; color: var(--amber-dark); font-weight:700; }

  .key.digit{ font-size:17px; font-weight:700; background:#faf6ea; }
  .key.op{ background: var(--blue-mid); color:#eaf6fb; box-shadow:0 2px 0 #0a2135; }
  .key.op:active{ box-shadow:0 0 0 #0a2135; }
  .key.amber{ background: var(--amber); color:#1f1607; box-shadow:0 2px 0 var(--amber-dark); }
  .key.amber:active{ box-shadow:0 0 0 var(--amber-dark); }
  .key.coral{ background: var(--coral); color:#fff; box-shadow:0 2px 0 var(--coral-dark); }
  .key.coral:active{ box-shadow:0 0 0 var(--coral-dark); }
  .key.dim{ background:#dcd4bd; color:#6b6656; box-shadow:0 2px 0 #b7ae94; }
  .key.shift-active{ outline:2px solid var(--amber); }

  .toast{
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:#0c2540; color:#eaf6fb; padding:9px 16px; border-radius:20px;
    font-size:12.5px; opacity:0; pointer-events:none; transition:opacity .2s; z-index:50;
    white-space:nowrap; border:1px solid rgba(111,198,217,.3);
    font-family:'IBM Plex Mono', monospace;
  }
  .toast.show{ opacity:1; }

  .titleblock{
    display:flex;
    justify-content:space-between;
    margin-top:10px;
    padding:0 4px;
    font-family:'IBM Plex Mono', monospace;
    font-size:9.5px;
    color: rgba(180,215,235,.45);
    letter-spacing:1px;
  }
</style>
</head>
<body>

<div class="unit">
  <div class="ticks-top">
    <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
  </div>

  <div class="card">
    <div class="head">
      <div class="title">CALC<b>·</b>01</div>
      <div class="modebar">
        <span id="modeDeg" class="active" onclick="setDeg(true)">DEG</span>
        <span id="modeRad" onclick="setDeg(false)">RAD</span>
        <span id="indM">M</span>
      </div>
    </div>

    <div class="display">
      <div class="expr-line" id="exprLine"></div>
      <div class="result-line" id="resultLine"></div>
    </div>

    <div class="keys">

      <div class="row r6">
        <button class="key amber" id="shiftBtn" onclick="toggleShift()">SHIFT</button>
        <button class="key dim" onclick="moveLeft()">◄</button>
        <button class="key dim" onclick="moveUp()">▲</button>
        <button class="key dim" onclick="moveDown()">▼</button>
        <button class="key dim" onclick="moveRight()">►</button>
        <button class="key op" onclick="doDelete()">DEL</button>
      </div>

      <div class="row r6">
        <button class="key op" onclick="insertReciprocal()">x⁻¹</button>
        <button class="key op" data-shift="10ˣ" onclick="pressLog()">Log</button>
        <button class="key op" data-shift="eˣ" onclick="pressLn()">Ln</button>
        <button class="key op" data-shift="sin⁻¹" onclick="pressTrig('sin')">Sin</button>
        <button class="key op" data-shift="cos⁻¹" onclick="pressTrig('cos')">Cos</button>
        <button class="key op" data-shift="tan⁻¹" onclick="pressTrig('tan')">Tan</button>
      </div>

      <div class="row r6">
        <button class="key op" onclick="insertFrac()">▮/▮</button>
        <button class="key op" onclick="insertSqrt()">√▮</button>
        <button class="key op" onclick="insertPowerFixed('2')">x²</button>
        <button class="key op" onclick="insertPowerFixed('3')">x³</button>
        <button class="key op" onclick="insertPowerEditable()">xʸ</button>
        <button class="key op" data-shift="!" onclick="pressPercentFact()">%</button>
      </div>

      <div class="row r6">
        <button class="key dim" onclick="insertText('(')">(</button>
        <button class="key dim" onclick="insertText(')')">)</button>
        <button class="key dim" onclick="insertText('-')">(-)</button>
        <button class="key dim" onclick="memoryAdd(1)">M+</button>
        <button class="key dim" onclick="memoryAdd(-1)">M−</button>
        <button class="key dim" onclick="recallMemory()">MR</button>
      </div>

      <div class="row r5">
        <button class="key digit" onclick="insertText('7')">7</button>
        <button class="key digit" onclick="insertText('8')">8</button>
        <button class="key digit" onclick="insertText('9')">9</button>
        <button class="key op" onclick="insertText('×')">×</button>
        <button class="key op" onclick="insertText('÷')">÷</button>
      </div>

      <div class="row r5">
        <button class="key digit" onclick="insertText('4')">4</button>
        <button class="key digit" onclick="insertText('5')">5</button>
        <button class="key digit" onclick="insertText('6')">6</button>
        <button class="key op" onclick="insertText('+')">+</button>
        <button class="key op" onclick="insertText('-')">−</button>
      </div>

      <div class="row r5">
        <button class="key digit" onclick="insertText('1')">1</button>
        <button class="key digit" onclick="insertText('2')">2</button>
        <button class="key digit" onclick="insertText('3')">3</button>
        <button class="key dim" data-shift="π" onclick="pressExpOrPi()">Exp</button>
        <button class="key dim" data-shift="e" onclick="pressAnsOrE()">Ans</button>
      </div>

      <div class="row r5">
        <button class="key digit" onclick="insertText('0')" style="grid-column:span 2;">0</button>
        <button class="key digit" onclick="insertText('.')">.</button>
        <button class="key coral" onclick="doClearAll()">AC</button>
        <button class="key amber" onclick="pressEquals()">=</button>
      </div>

    </div>

    <div class="titleblock">
      <span>SCI · NATURAL DISPLAY</span>
      <span>REV A</span>
    </div>
  </div>

  <div class="ticks-bottom">
    <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
/* ================= Data model ================= */
const root = { items: [] };
let cursorStack = [{ node:null, part:null, seq:root.items, index:0, parentIndex:-1 }];
let shiftOn = false;
let isDegree = true;
let lastAnswer = 0;
let memory = 0;

const exprLine = document.getElementById('exprLine');
const resultLine = document.getElementById('resultLine');
const indM = document.getElementById('indM');
const toastEl = document.getElementById('toast');

function activeFrame(){ return cursorStack[cursorStack.length-1]; }

function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>toastEl.classList.remove('show'), 1200);
}

/* ================= Cursor navigation ================= */
function enterNode(node, part, idx){
  const f = activeFrame();
  const pIdx = f.seq.indexOf(node);
  cursorStack.push({ node, part, seq: node[part].items, index: idx, parentIndex: pIdx });
  render();
}
function moveRight(){
  const f = activeFrame();
  if(f.index < f.seq.length){
    const item = f.seq[f.index];
    if(item && item.type==='frac'){ enterNode(item,'num',0); return; }
    if(item && item.type==='pow' && item.editableExp){ enterNode(item,'exp',0); return; }
    if(item && item.type==='sqrt'){ enterNode(item,'arg',0); return; }
    f.index++; render(); return;
  }
  if(f.part==='num'){
    const node = f.node, pIdx = f.parentIndex;
    cursorStack[cursorStack.length-1] = { node, part:'den', seq:node.den.items, index:0, parentIndex:pIdx };
    render(); return;
  }
  if(cursorStack.length>1){
    cursorStack.pop();
    const pf = activeFrame();
    pf.index = f.parentIndex+1;
    render();
  }
}
function moveLeft(){
  const f = activeFrame();
  if(f.index>0){
    const item = f.seq[f.index-1];
    if(item && item.type==='frac'){ enterNode(item,'den', item.den.items.length); return; }
    if(item && item.type==='pow' && item.editableExp){ enterNode(item,'exp', item.exp.items.length); return; }
    if(item && item.type==='sqrt'){ enterNode(item,'arg', item.arg.items.length); return; }
    f.index--; render(); return;
  }
  if(f.part==='den'){
    const node = f.node, pIdx = f.parentIndex;
    cursorStack[cursorStack.length-1] = { node, part:'num', seq:node.num.items, index:node.num.items.length, parentIndex:pIdx };
    render(); return;
  }
  if(cursorStack.length>1){
    cursorStack.pop();
    const pf = activeFrame();
    pf.index = f.parentIndex;
    render();
  }
}
function moveUp(){
  const f = activeFrame();
  if(f.part==='den'){
    cursorStack[cursorStack.length-1] = { node:f.node, part:'num', seq:f.node.num.items, index:Math.min(f.index, f.node.num.items.length), parentIndex:f.parentIndex };
    render();
  }
}
function moveDown(){
  const f = activeFrame();
  if(f.part==='num'){
    cursorStack[cursorStack.length-1] = { node:f.node, part:'den', seq:f.node.den.items, index:Math.min(f.index, f.node.den.items.length), parentIndex:f.parentIndex };
    render();
  }
}

/* ================= Insertion ================= */
function insertText(str){
  const f = activeFrame();
  const items = [...str].map(ch=>({ type:'char', text: ch }));
  f.seq.splice(f.index, 0, ...items);
  f.index += items.length;
  render();
}
function insertFrac(){
  const f = activeFrame();
  const node = { type:'frac', num:{items:[]}, den:{items:[]} };
  f.seq.splice(f.index, 0, node);
  f.index++;
  enterNode(node, 'num', 0);
}
function insertSqrt(){
  const f = activeFrame();
  const node = { type:'sqrt', arg:{items:[]} };
  f.seq.splice(f.index, 0, node);
  f.index++;
  enterNode(node, 'arg', 0);
}
function extractBase(f){
  if(f.index===0) return { items: [] };
  const prev = f.seq[f.index-1];
  if(prev.type==='char'){
    if(prev.text===')'){
      let depth=0, i=f.index-1;
      for(; i>=0; i--){
        const it = f.seq[i];
        if(it.type==='char' && it.text===')') depth++;
        else if(it.type==='char' && it.text==='('){ depth--; if(depth===0) break; }
      }
      if(i<0) i = f.index-1;
      const extracted = f.seq.splice(i, f.index-i);
      f.index = i;
      return { items: extracted };
    }
    if(/[0-9.]/.test(prev.text)){
      let i=f.index-1;
      while(i>=0 && f.seq[i].type==='char' && /[0-9.]/.test(f.seq[i].text)) i--;
      const start=i+1;
      const extracted = f.seq.splice(start, f.index-start);
      f.index = start;
      return { items: extracted };
    }
    const extracted = f.seq.splice(f.index-1, 1);
    f.index -= 1;
    return { items: extracted };
  } else {
    const extracted = f.seq.splice(f.index-1, 1);
    f.index -= 1;
    return { items: extracted };
  }
}
function insertPowerFixed(expText){
  const f = activeFrame();
  const base = extractBase(f);
  const node = { type:'pow', editableExp:false, base:{items:base.items}, exp:{items:[{type:'char',text:expText}]} };
  f.seq.splice(f.index, 0, node);
  f.index++;
  render();
}
function insertPowerEditable(){
  const f = activeFrame();
  const base = extractBase(f);
  const node = { type:'pow', editableExp:true, base:{items:base.items}, exp:{items:[]} };
  f.seq.splice(f.index, 0, node);
  f.index++;
  enterNode(node, 'exp', 0);
}
function insertReciprocal(){
  const f = activeFrame();
  const base = extractBase(f);
  const node = { type:'frac', num:{items:[{type:'char', text:'1'}]}, den:{items: base.items} };
  f.seq.splice(f.index, 0, node);
  f.index++;
  render();
}

/* ================= Function / trig / log keys ================= */
function pressTrig(name){
  if(shiftOn){ insertText('a'+name+'('); toggleShift(); }
  else { insertText(name+'('); }
}
function pressLog(){
  if(shiftOn){ insertText('10^'); insertPowerEditable(); toggleShift(); }
  else { insertText('log('); }
}
function pressLn(){
  if(shiftOn){ insertText('e^'); insertPowerEditable(); toggleShift(); }
  else { insertText('ln('); }
}
function pressExpOrPi(){
  if(shiftOn){ insertText('π'); toggleShift(); } else { insertText('E'); }
}
function pressAnsOrE(){
  if(shiftOn){ insertText('e'); toggleShift(); } else { insertText('Ans'); }
}
function pressPercentFact(){
  if(shiftOn){ insertText('!'); toggleShift(); } else { insertText('%'); }
}
function setDeg(deg){
  isDegree = deg;
  document.getElementById('modeDeg').classList.toggle('active', deg);
  document.getElementById('modeRad').classList.toggle('active', !deg);
  liveEvaluate();
}

/* ================= Delete / Clear ================= */
function doDelete(){
  const f = activeFrame();
  if(f.index>0){
    f.seq.splice(f.index-1, 1);
    f.index--;
    render();
    return;
  }
  if(cursorStack.length>1){
    const f2 = cursorStack.pop();
    const pf = activeFrame();
    if(f2.part==='num' || f2.part==='arg'){
      pf.seq.splice(f2.parentIndex, 1);
      pf.index = f2.parentIndex;
    } else {
      pf.index = f2.parentIndex+1;
    }
    render();
  }
}
function doClearAll(){
  root.items.length = 0;
  cursorStack = [{ node:null, part:null, seq:root.items, index:0, parentIndex:-1 }];
  resultLine.textContent = '';
  resultLine.classList.remove('err');
  render();
}

/* ================= Memory ================= */
function recallMemory(){ insertText(formatNum(roundClean(memory))); }
function memoryAdd(sign){
  try{
    const val = evaluate(serialize(root.items) || '0');
    memory += sign*val;
    indM.style.color = memory !== 0 ? '#e2a03f' : '';
    showToast('M = ' + formatNum(roundClean(memory)));
  }catch(e){ showToast('تعبير غير مكتمل'); }
}

/* ================= Rendering ================= */
function render(){
  const topSeq = activeFrame().seq;
  const topIndex = activeFrame().index;
  function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function renderSeq(seq){
    let html = '';
    const isActive = (seq === topSeq);
    for(let i=0;i<seq.length;i++){
      if(isActive && i===topIndex) html += '<span class="caret"></span>';
      html += renderItem(seq[i]);
    }
    if(isActive && topIndex===seq.length) html += '<span class="caret"></span>';
    if(seq.length===0 && !isActive) html += '<span class="placeholder-box"></span>';
    return html;
  }
  function renderItem(item){
    if(item.type==='char') return '<span>'+esc(item.text)+'</span>';
    if(item.type==='frac') return '<span class="frac-wrap"><span class="frac-num">'+renderSeq(item.num.items)+'</span><span class="frac-bar"></span><span class="frac-den">'+renderSeq(item.den.items)+'</span></span>';
    if(item.type==='pow') return '<span class="pow-wrap"><span>'+renderSeq(item.base.items)+'</span><span class="pow-exp">'+renderSeq(item.exp.items)+'</span></span>';
    if(item.type==='sqrt') return '<span class="sqrt-wrap"><span class="sqrt-sign">√</span><span class="sqrt-bar">'+renderSeq(item.arg.items)+'</span></span>';
    return '';
  }
  exprLine.innerHTML = renderSeq(root.items);
  exprLine.scrollLeft = exprLine.scrollWidth;
  liveEvaluate();
}

/* ================= Serialize ================= */
function serialize(seq){
  let s = '';
  for(const item of seq){
    if(item.type==='char') s += item.text;
    else if(item.type==='frac') s += '(' + (serialize(item.num.items)||'0') + ')/(' + (serialize(item.den.items)||'1') + ')';
    else if(item.type==='pow') s += (item.base.items.length ? '('+serialize(item.base.items)+')' : '') + '^(' + (serialize(item.exp.items)||'0') + ')';
    else if(item.type==='sqrt') s += 'sqrt(' + (serialize(item.arg.items)||'0') + ')';
  }
  return s;
}

/* ================= Live evaluation ================= */
function liveEvaluate(){
  const src = serialize(root.items);
  if(!src.trim()){ resultLine.textContent=''; resultLine.classList.remove('err'); return; }
  try{
    const val = evaluate(src);
    resultLine.classList.remove('err');
    resultLine.textContent = formatNum(roundClean(val));
  }catch(e){
    resultLine.textContent = '';
    resultLine.classList.remove('err');
  }
}
function pressEquals(){
  const src = serialize(root.items);
  if(!src.trim()) return;
  try{
    const val = evaluate(src);
    const clean = roundClean(val);
    lastAnswer = clean;
    resultLine.classList.remove('err');
    resultLine.textContent = formatNum(clean);
  }catch(e){
    resultLine.classList.add('err');
    resultLine.textContent = 'خطأ رياضي';
  }
}
function roundClean(n){ if(!isFinite(n)) return n; return Math.round(n*1e10)/1e10; }
function formatNum(n){
  if(!isFinite(n)) return 'خطأ';
  if(Math.abs(n) > 1e12 || (Math.abs(n) < 1e-9 && n !== 0)) return n.toExponential(6);
  let s = n.toString();
  let neg = false;
  if(s.startsWith('-')){ neg=true; s = s.slice(1); }
  let [intPart, decPart] = s.split('.');
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (neg?'-':'') + intPart + (decPart ? '.'+decPart : '');
}

/* ================= SHIFT ================= */
function toggleShift(){
  shiftOn = !shiftOn;
  document.getElementById('shiftBtn').classList.toggle('shift-active', shiftOn);
}

/* ================= Tokenizer / Parser ================= */
function evaluate(source){
  const tokens = tokenize(source);
  const parser = new Parser(tokens);
  const result = parser.parseExpression();
  if(parser.pos < tokens.length) throw new Error('Unexpected token');
  return result;
}
function tokenize(src){
  src = src.replace(/Ans/g, '\u0001').replace(/π/g, '\u0002').replace(/(?<![a-zA-Z])e(?![a-zA-Z(])/g, '\u0003');
  const tokens = [];
  let i = 0;
  const funcNames = ['sin','cos','tan','asin','acos','atan','log','ln','sqrt','cbrt','exp'];
  while(i < src.length){
    const c = src[i];
    if(c === ' '){ i++; continue; }
    if(/[0-9.]/.test(c)){
      let num = '';
      while(i < src.length && /[0-9.]/.test(src[i])){ num += src[i]; i++; }
      tokens.push({ type:'num', value: parseFloat(num) });
      continue;
    }
    if(c === '\u0001'){ tokens.push({ type:'num', value: lastAnswer }); i++; continue; }
    if(c === '\u0002'){ tokens.push({ type:'num', value: Math.PI }); i++; continue; }
    if(c === '\u0003'){ tokens.push({ type:'num', value: Math.E }); i++; continue; }
    if(c === 'E'){ tokens.push({ type:'op', value:'E' }); i++; continue; }
    if(/[a-zA-Z]/.test(c)){
      let name = '';
      while(i < src.length && /[a-zA-Z]/.test(src[i])){ name += src[i]; i++; }
      if(funcNames.includes(name)) tokens.push({ type:'func', value:name });
      else throw new Error('Unknown identifier: '+name);
      continue;
    }
    if('+-×÷*/^%!(),'.includes(c)){ tokens.push({ type:'op', value:c }); i++; continue; }
    throw new Error('Unexpected character: '+c);
  }
  return tokens;
}
class Parser{
  constructor(tokens){ this.tokens = tokens; this.pos = 0; }
  peek(){ return this.tokens[this.pos]; }
  next(){ return this.tokens[this.pos++]; }
  parseExpression(){ return this.parseAddSub(); }
  parseAddSub(){
    let left = this.parseMulDiv();
    while(this.peek() && this.peek().type==='op' && (this.peek().value==='+'||this.peek().value==='-')){
      const op = this.next().value;
      const right = this.parseMulDiv();
      left = op==='+' ? left+right : left-right;
    }
    return left;
  }
  parseMulDiv(){
    let left = this.parsePercent();
    while(this.peek() && this.peek().type==='op' && (this.peek().value==='×'||this.peek().value==='*'||this.peek().value==='÷'||this.peek().value==='/')){
      const op = this.next().value;
      const right = this.parsePercent();
      left = (op==='×'||op==='*') ? left*right : left/right;
    }
    return left;
  }
  parsePercent(){
    let left = this.parseImplicitMul();
    while(this.peek() && this.peek().type==='op' && this.peek().value==='%'){ this.next(); left = left/100; }
    return left;
  }
  parseImplicitMul(){
    let left = this.parsePower();
    while(this.peek() && ((this.peek().type==='num')||(this.peek().type==='func')||(this.peek().type==='op'&&this.peek().value==='('))){
      const right = this.parsePower();
      left = left*right;
    }
    return left;
  }
  parsePower(){
    let left = this.parseUnary();
    if(this.peek() && this.peek().type==='op' && this.peek().value==='^'){
      this.next();
      const right = this.parsePower();
      left = Math.pow(left, right);
    }
    if(this.peek() && this.peek().type==='op' && this.peek().value==='E'){
      this.next();
      const right = this.parseUnary();
      left = left*Math.pow(10, right);
    }
    return left;
  }
  parseUnary(){
    if(this.peek() && this.peek().type==='op' && this.peek().value==='-'){ this.next(); return -this.parseUnary(); }
    if(this.peek() && this.peek().type==='op' && this.peek().value==='+'){ this.next(); return this.parseUnary(); }
    return this.parsePostfix();
  }
  parsePostfix(){
    let val = this.parseAtom();
    while(this.peek() && this.peek().type==='op' && this.peek().value==='!'){ this.next(); val = factorial(val); }
    return val;
  }
  parseAtom(){
    const tok = this.peek();
    if(!tok) throw new Error('Unexpected end');
    if(tok.type==='num'){ this.next(); return tok.value; }
    if(tok.type==='op' && tok.value==='('){
      this.next();
      const val = this.parseAddSub();
      if(!(this.peek() && this.peek().value===')')) throw new Error('Expected )');
      this.next();
      return val;
    }
    if(tok.type==='func'){
      this.next();
      if(!(this.peek() && this.peek().value==='(')) throw new Error('Expected ( after function');
      this.next();
      const arg = this.parseAddSub();
      if(!(this.peek() && this.peek().value===')')) throw new Error('Expected )');
      this.next();
      return applyFunc(tok.value, arg);
    }
    throw new Error('Unexpected token');
  }
}
function toRad(x){ return isDegree ? x*Math.PI/180 : x; }
function fromRad(x){ return isDegree ? x*180/Math.PI : x; }
function applyFunc(name, x){
  switch(name){
    case 'sin': return Math.sin(toRad(x));
    case 'cos': return Math.cos(toRad(x));
    case 'tan': return Math.tan(toRad(x));
    case 'asin': return fromRad(Math.asin(x));
    case 'acos': return fromRad(Math.acos(x));
    case 'atan': return fromRad(Math.atan(x));
    case 'log': return Math.log10(x);
    case 'ln': return Math.log(x);
    case 'sqrt': return Math.sqrt(x);
    case 'cbrt': return Math.cbrt(x);
    case 'exp': return Math.exp(x);
  }
  throw new Error('Unknown function '+name);
}
function factorial(n){
  if(n<0 || !Number.isInteger(n)) throw new Error('Invalid factorial');
  let r=1;
  for(let i=2;i<=n;i++) r*=i;
  return r;
}

/* ================= Keyboard ================= */
window.addEventListener('keydown', (e)=>{
  const k = e.key;
  if(/[0-9.]/.test(k)){ insertText(k); return; }
  if(k==='+'){ insertText('+'); return; }
  if(k==='-'){ insertText('-'); return; }
  if(k==='*'){ insertText('×'); return; }
  if(k==='/'){ e.preventDefault(); insertFrac(); return; }
  if(k==='('){ insertText('('); return; }
  if(k===')'){ insertText(')'); return; }
  if(k==='ArrowLeft'){ moveLeft(); return; }
  if(k==='ArrowRight'){ moveRight(); return; }
  if(k==='ArrowUp'){ moveUp(); return; }
  if(k==='ArrowDown'){ moveDown(); return; }
  if(k==='Enter' || k==='='){ e.preventDefault(); pressEquals(); return; }
  if(k==='Backspace'){ doDelete(); return; }
  if(k==='Escape'){ doClearAll(); return; }
  if(k==='%'){ insertText('%'); return; }
  if(k==='^'){ insertPowerEditable(); return; }
});

render();
</script>
</body>
</html>
          `}
          className="w-full h-full border-0 bg-transparent"
        />
      </div>
    </div>
  );
};
