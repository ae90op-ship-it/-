import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { getT } from '../i18n';
import { ArrowLeft } from 'lucide-react';

export const QrScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  
  return (
    <div className={`relative flex flex-col w-full h-[100dvh] ${state.isComputerMode ? 'max-w-6xl' : 'max-w-md'} mx-auto shadow-2xl overflow-hidden sm:h-[800px] sm:rounded-[2.5rem] transition-all duration-300 bg-[#0b0c0d] text-[#eef1ee]`}>
      <header className="px-6 pt-12 pb-4 flex items-center z-10 bg-[#0b0c0d]">
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
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jsqr/1.4.0/jsQR.js"></script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

  :root{
    --bg:#0b0c0d;
    --panel:#131415;
    --line:#232527;
    --green:#4ee6a1;
    --green-dark:#2c9c6c;
    --text:#eef1ee;
    --dim:#8a8f8c;
    --red:#e0574a;
  }
  *{ box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  body{
    margin:0; min-height:100vh; background: var(--bg);
    display:flex; align-items:flex-start; justify-content:center;
    font-family:'Space Grotesk', sans-serif; padding:0 24px 24px; color:var(--text);
  }
  .unit{ width:400px; max-width:100%; margin-top: 10px; }

  .brandrow{ display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; padding:0 2px; }
  .brand{ font-weight:700; letter-spacing:3px; font-size:16px; }
  .brand span{ color:var(--green); }
  .dot{ width:8px; height:8px; border-radius:50%; background:var(--green); box-shadow:0 0 8px var(--green); }

  .tabs{ display:flex; gap:8px; margin-bottom:14px; background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:4px; }
  .tab{ flex:1; text-align:center; padding:9px 0; border-radius:7px; font-size:13px; font-weight:600; cursor:pointer; color:var(--dim); transition: all 0.2s; }
  .tab.active{ background:var(--green); color:#06140d; }

  .panel{ background:var(--panel); border:1px solid var(--line); border-radius:12px; padding:18px; position:relative; }

  .corner{ position:absolute; width:16px; height:16px; border-color:var(--green); }
  .corner.tl{ top:8px; left:8px; border-top:2px solid; border-left:2px solid; }
  .corner.tr{ top:8px; right:8px; border-top:2px solid; border-right:2px solid; }
  .corner.bl{ bottom:8px; left:8px; border-bottom:2px solid; border-left:2px solid; }
  .corner.br{ bottom:8px; right:8px; border-bottom:2px solid; border-right:2px solid; }

  label{ display:block; font-size:11.5px; color:var(--dim); margin:12px 0 6px; letter-spacing:.5px; }
  textarea, input[type=text]{
    width:100%; background:#0e0f10; border:1px solid var(--line); border-radius:8px;
    color:var(--text); font-family:'IBM Plex Mono', monospace; font-size:13.5px;
    padding:10px 12px; resize:none; outline:none;
  }
  textarea:focus, input[type=text]:focus{ border-color:var(--green); }
  textarea{ height:80px; }

  .size-row{ display:flex; gap:8px; margin-top:6px; }
  .size-opt{
    flex:1; text-align:center; padding:8px 0; border-radius:7px; background:#0e0f10;
    border:1px solid var(--line); font-size:12px; color:var(--dim); cursor:pointer;
  }
  .size-opt.active{ border-color:var(--green); color:var(--green); }

  .qr-preview{
    margin-top:16px; background:#fff; border-radius:10px; padding:18px;
    display:flex; align-items:center; justify-content:center; min-height:200px;
  }
  .qr-preview.empty{ background:#0e0f10; border:1px dashed var(--line); }
  .qr-preview.empty::after{ content:'سيظهر الرمز هنا'; color:var(--dim); font-size:12.5px; font-family:'IBM Plex Mono',monospace; }

  .btn{
    width:100%; margin-top:14px; padding:12px 0; border:none; border-radius:9px;
    background:var(--green); color:#06140d; font-weight:700; font-size:13.5px; cursor:pointer;
    font-family:'Space Grotesk', sans-serif;
  }
  .btn:active{ background:var(--green-dark); }
  .btn.secondary{ background:#0e0f10; color:var(--text); border:1px solid var(--line); }
  .btn:disabled{ opacity:.4; cursor:default; }

  .scan-frame{
    position:relative; border-radius:10px; overflow:hidden; background:#000;
    aspect-ratio:1/1; display:flex; align-items:center; justify-content:center;
  }
  video, canvas.overlay{ width:100%; height:100%; object-fit:cover; }
  canvas.overlay{ position:absolute; top:0; left:0; }
  .scan-frame .placeholder{ color:var(--dim); font-size:12.5px; font-family:'IBM Plex Mono',monospace; text-align:center; padding:20px; }
  .scan-corners span{
    position:absolute; width:26px; height:26px; border-color:var(--green); opacity:.85; pointer-events:none;
  }
  .sc-tl{ top:10%; left:10%; border-top:3px solid; border-left:3px solid; }
  .sc-tr{ top:10%; right:10%; border-top:3px solid; border-right:3px solid; }
  .sc-bl{ bottom:10%; left:10%; border-bottom:3px solid; border-left:3px solid; }
  .sc-br{ bottom:10%; right:10%; border-bottom:3px solid; border-right:3px solid; }

  .result-box{
    margin-top:14px; background:#0e0f10; border:1px solid var(--green); border-radius:9px;
    padding:12px 14px; font-family:'IBM Plex Mono', monospace; font-size:13px; word-break:break-all;
    display:none;
  }
  .result-box.show{ display:block; }
  .result-box .lbl{ color:var(--green); font-size:10.5px; letter-spacing:1px; display:block; margin-bottom:6px; }

  .status{ text-align:center; font-size:11.5px; color:var(--dim); margin-top:10px; font-family:'IBM Plex Mono', monospace; }
  .status.err{ color:var(--red); }

  footer.hint{ text-align:center; color:#55585a; font-size:10.5px; margin-top:14px; line-height:1.6; }
</style>
</head>
<body>

<div class="unit">
  <div class="brandrow">
    <div class="brand">LENS<span>·</span>QR</div>
    <div class="dot"></div>
  </div>

  <div class="tabs">
    <div class="tab active" id="tabGen" onclick="switchTab('gen')">إنشاء رمز</div>
    <div class="tab" id="tabScan" onclick="switchTab('scan')">مسح رمز</div>
  </div>

  <!-- GENERATE PANEL -->
  <div class="panel" id="genPanel">
    <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>

    <label>النص أو الرابط</label>
    <textarea id="qrInput" placeholder="اكتب أي نص، رابط، رقم هاتف..."></textarea>

    <label>الحجم</label>
    <div class="size-row">
      <div class="size-opt" data-size="180" onclick="setSize(180,this)">صغير</div>
      <div class="size-opt active" data-size="260" onclick="setSize(260,this)">متوسط</div>
      <div class="size-opt" data-size="340" onclick="setSize(340,this)">كبير</div>
    </div>

    <div class="qr-preview empty" id="qrPreview"></div>

    <button class="btn" id="downloadBtn" onclick="downloadQR()" disabled>تحميل PNG</button>
  </div>

  <!-- SCAN PANEL -->
  <div class="panel" id="scanPanel" style="display:none;">
    <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>

    <div class="scan-frame" id="scanFrame">
      <div class="placeholder" id="scanPlaceholder">اضغط &quot;تشغيل الكاميرا&quot; لبدء المسح</div>
      <video id="video" playsinline style="display:none;"></video>
      <div class="scan-corners" id="scanCorners" style="display:none;">
        <span class="sc-tl"></span><span class="sc-tr"></span><span class="sc-bl"></span><span class="sc-br"></span>
      </div>
    </div>

    <button class="btn" id="camBtn" onclick="toggleCamera()">تشغيل الكاميرا</button>

    <div class="result-box" id="scanResult">
      <span class="lbl">النتيجة</span>
      <span id="scanResultText"></span>
    </div>
    <button class="btn secondary" id="copyBtn" style="display:none;" onclick="copyResult()">نسخ النتيجة</button>

    <div class="status" id="scanStatus"></div>
  </div>

  <footer class="hint">الإنشاء يعمل بالكامل محليًا في المتصفح · المسح يستخدم كاميرا جهازك مباشرة دون رفع أي بيانات</footer>
</div>

<script>
function switchTab(which){
  const isGen = which==='gen';
  document.getElementById('tabGen').classList.toggle('active', isGen);
  document.getElementById('tabScan').classList.toggle('active', !isGen);
  document.getElementById('genPanel').style.display = isGen ? 'block' : 'none';
  document.getElementById('scanPanel').style.display = isGen ? 'none' : 'block';
  if(!isGen){}
  else { stopCamera(); }
}

let qrSize = 260;
let qrObj = null;
const qrInput = document.getElementById('qrInput');
const qrPreview = document.getElementById('qrPreview');
const downloadBtn = document.getElementById('downloadBtn');

function setSize(size, el){
  qrSize = size;
  document.querySelectorAll('.size-opt').forEach(o=>o.classList.remove('active'));
  el.classList.add('active');
  renderQR();
}

function renderQR(){
  const text = qrInput.value.trim();
  qrPreview.innerHTML = '';
  if(!text){
    qrPreview.classList.add('empty');
    downloadBtn.disabled = true;
    return;
  }
  qrPreview.classList.remove('empty');
  qrObj = new QRCode(qrPreview, {
    text: text,
    width: qrSize,
    height: qrSize,
    colorDark: '#0b0c0d',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M
  });
  downloadBtn.disabled = false;
}

qrInput.addEventListener('input', ()=>{
  clearTimeout(renderQR._t);
  renderQR._t = setTimeout(renderQR, 250);
});

function downloadQR(){
  const canvas = qrPreview.querySelector('canvas');
  if(!canvas) return;
  const link = document.createElement('a');
  link.download = 'qr-code.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

let stream = null;
let scanning = false;
const video = document.getElementById('video');
const scanPlaceholder = document.getElementById('scanPlaceholder');
const scanCorners = document.getElementById('scanCorners');
const camBtn = document.getElementById('camBtn');
const scanResult = document.getElementById('scanResult');
const scanResultText = document.getElementById('scanResultText');
const copyBtn = document.getElementById('copyBtn');
const scanStatus = document.getElementById('scanStatus');

let hiddenCanvas = document.createElement('canvas');
let hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true });

async function toggleCamera(){
  if(scanning){ stopCamera(); return; }
  scanStatus.textContent = '';
  scanStatus.classList.remove('err');
  try{
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    video.style.display = 'block';
    scanPlaceholder.style.display = 'none';
    scanCorners.style.display = 'block';
    await video.play();
    scanning = true;
    camBtn.textContent = 'إيقاف الكاميرا';
    scanResult.classList.remove('show');
    copyBtn.style.display = 'none';
    requestAnimationFrame(scanLoop);
  }catch(e){
    scanStatus.textContent = 'تعذّر الوصول إلى الكاميرا — تأكد من إعطاء الإذن';
    scanStatus.classList.add('err');
  }
}

function stopCamera(){
  scanning = false;
  if(stream){ stream.getTracks().forEach(t=>t.stop()); stream = null; }
  video.style.display = 'none';
  scanPlaceholder.style.display = 'block';
  scanCorners.style.display = 'none';
  camBtn.textContent = 'تشغيل الكاميرا';
}

function scanLoop(){
  if(!scanning) return;
  if(video.readyState === video.HAVE_ENOUGH_DATA){
    hiddenCanvas.width = video.videoWidth;
    hiddenCanvas.height = video.videoHeight;
    hiddenCtx.drawImage(video, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
    const imageData = hiddenCtx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);
    if(window.jsQR) {
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if(code && code.data){
        scanResultText.textContent = code.data;
        scanResult.classList.add('show');
        copyBtn.style.display = 'block';
        scanStatus.textContent = 'تم العثور على رمز ✓';
        scanStatus.classList.remove('err');
        }
    }
  }
  requestAnimationFrame(scanLoop);
}

function copyResult(){
  navigator.clipboard.writeText(scanResultText.textContent).then(()=>{
    scanStatus.textContent = 'تم النسخ إلى الحافظة';
    scanStatus.classList.remove('err');
  });
}
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
