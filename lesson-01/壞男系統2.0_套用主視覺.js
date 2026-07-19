const theme = document.querySelector('#blackGoldTheme');
if (theme) document.head.appendChild(theme);
const boldSerif = document.createElement('style');
boldSerif.textContent = `.top b,.hero h1,.q h3,.supply h3,.score h2,.verdict p{font-weight:700}
.top{display:flex;max-width:100%;overflow:hidden}.top>div{display:flex;align-items:center;min-width:0;white-space:nowrap}.top>div:first-child{flex:1}.top>div:last-child{flex:0 0 auto}.top b{width:auto!important;min-width:44px;height:38px;padding:0 8px;white-space:nowrap;flex:0 0 auto}
.hero h1,.hero p,.q h3,.opts button,.checks label,.row>*,.share-body *{overflow-wrap:anywhere}.opts button{width:100%}.score,.row,.share-grid{max-width:100%}.share-head span{min-width:0;overflow-wrap:anywhere}
@media(max-width:650px){.top{gap:10px}.top>div:first-child{font-size:9px}.top>div:last-child{font-size:0!important}.top>div:last-child:after{content:'01';font:700 9px monospace;color:#8f8884}.top b{min-width:40px;height:32px;padding:0 6px;font-size:9px}.hero h1{font-size:clamp(42px,12vw,52px)!important}.opts,.checks{width:100%}.row{grid-template-columns:minmax(72px,.8fr) 52px minmax(0,1.5fr)!important;gap:8px}.share-head{align-items:flex-start}.share-head span:last-child{white-space:nowrap}.share-score b{font-size:54px}.shot-mode .community-share{overflow-x:hidden}}
@media(min-width:651px) and (max-width:980px){.wrap{width:90vw}.hero h1{font-size:clamp(58px,8vw,78px)}.q{padding:32px}.score{grid-template-columns:240px 1fr}.score>div{padding:38px}}`;
document.head.appendChild(boldSerif);

const shareStyle = document.createElement('style');
shareStyle.textContent = `
.community-share{display:none;margin-top:28px;border:1px solid rgba(210,169,40,.4);background:#0b0b0c}
.community-share.show{display:block}.share-head{display:flex;justify-content:space-between;gap:20px;padding:20px 26px;border-bottom:1px solid rgba(255,255,255,.12);font:9px monospace;letter-spacing:.15em;color:#d2a928}.share-body{padding:34px}.share-body h2{margin:0 0 10px;font-family:"Noto Serif TC","Songti TC",serif;font-size:30px}.share-body>p{color:#918a86;line-height:1.8}.share-score{display:flex;align-items:baseline;gap:12px;margin:28px 0;padding:22px 0;border-top:1px solid rgba(255,255,255,.12);border-bottom:1px solid rgba(255,255,255,.12)}.share-score b{font:64px "Times New Roman",serif}.share-score span{color:#777}.share-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(255,255,255,.12)}.share-grid div{display:flex;justify-content:space-between;padding:13px 15px;background:#111112;font-size:11px}.share-grid b{color:#d2a928}.share-supply{margin:26px 0 0}.share-supply small,.share-question small{font:9px monospace;color:#d2a928;letter-spacing:.13em}.share-supply p{color:#aaa3a0;line-height:1.8}.share-question{margin-top:25px;padding:20px;border-left:2px solid #d2a928;background:#17140c}.share-question p{margin:9px 0 0;font-size:16px;font-weight:700;line-height:1.7}.share-actions{display:flex;gap:8px;padding:0 34px 34px}.share-actions button{flex:1;padding:15px;border:1px solid #d2a928;background:#b48e1e;color:#fff;cursor:pointer}.share-actions button:last-child{background:transparent;color:#d2a928}.shot-mode body>*{display:none!important}.shot-mode body .community-share{display:block!important;position:absolute;inset:0;width:100%;min-height:100vh;margin:0;border:0}.shot-mode .share-actions{display:none}.shot-mode .share-body{max-width:760px;margin:auto}.shot-exit{display:none;position:fixed;right:18px;bottom:18px;z-index:99;padding:12px 16px;border:0;background:#d2a928;color:#080808}.shot-mode .shot-exit{display:block}@media(max-width:650px){.share-grid{grid-template-columns:1fr}.share-body{padding:25px}.share-actions{padding:0 25px 25px;flex-direction:column}}
`;
document.head.appendChild(shareStyle);

const report = document.querySelector('#report');
if (report) {
  const share = document.createElement('section');
  share.className = 'community-share';
  share.innerHTML = `<div class="share-head"><span>壞男系統 2.0 ／ 社群求診卡</span><span>凡氏可行</span></div><div class="share-body"><small>預判他的預判 ／ MODULE 01</small><h2 id="shareLevel">關係診斷</h2><p>我做完第一篇關係驗屍，想請凡氏幫我看：這個男人到底在拿我什麼？</p><div class="share-score"><b id="shareTotal">0</b><span>／32　吃虧分數</span></div><div class="share-grid" id="shareGrid"></div><div class="share-supply"><small>我已經白做的事</small><p id="shareSupply">無</p></div><div class="share-question"><small>請凡氏直接診斷</small><p>他現在把我放在什麼位置？我下一步最該停掉哪件事？</p></div></div><div class="share-actions"><button id="shotButton">進入截圖模式</button><button id="copyButton">複製發文文字</button></div>`;
  report.after(share);
  const exit = document.createElement('button'); exit.className='shot-exit'; exit.textContent='退出截圖模式'; document.body.append(exit);
  exit.onclick=()=>document.documentElement.classList.remove('shot-mode');
  share.querySelector('#shotButton').onclick=()=>{ document.documentElement.classList.add('shot-mode'); window.scrollTo(0,0); };
  share.querySelector('#copyButton').onclick=async()=>{ const text=`我做完《壞男系統 2.0｜預判他的預判》第一篇關係驗屍\n吃虧分數：${document.querySelector('#total')?.textContent?.trim()||''}\n請凡氏直接幫我看：他現在把我放在什麼位置？我下一步最該停掉哪件事？`; await navigator.clipboard?.writeText(text); share.querySelector('#copyButton').textContent='已複製，去社群貼上'; };
  document.querySelector('#submit')?.addEventListener('click',()=>setTimeout(()=>{
    share.classList.add('show');
    share.querySelector('#shareLevel').textContent=document.querySelector('#level')?.textContent||'關係診斷';
    share.querySelector('#shareTotal').textContent=(document.querySelector('#total')?.textContent||'0').split('/')[0].trim();
    const rows=[...document.querySelectorAll('#table .row')].slice(1,-1);
    share.querySelector('#shareGrid').innerHTML=rows.map(r=>`<div><span>${r.children[0]?.textContent}</span><b>${r.children[1]?.textContent}</b></div>`).join('');
    const picked=[...document.querySelectorAll('#checks label.on')].map(x=>x.textContent.trim());
    share.querySelector('#shareSupply').textContent=picked.length?picked.join('、'):'目前沒有勾選';
    share.scrollIntoView({behavior:'smooth'});
  },80));
}
