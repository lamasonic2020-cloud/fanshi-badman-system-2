const modules = [
  { no: '01', name: '關係驗屍室' },
  { no: '02', name: '他在測妳有多好拿' },
  { no: '03', name: '男人成分表' },
  { no: '04', name: '快速親密檢查' },
  { no: '06', name: '忽冷忽熱循環' },
  { no: '07', name: '伴侶待遇零責任' },
  { no: '08', name: '未來支票兌現所' },
  { no: '09', name: '備胎養殖場' }
];

const redFlagItems = [
  { text: '妳長期失眠、焦慮、暴瘦、暴食或無法工作', w: 4 },
  { text: '他威脅傷害妳、自己、家人、寵物或財物', w: 6 },
  { text: '出現推擠、抓扯、掐脖、阻擋離開或任何暴力', w: 8 },
  { text: '逼迫性行為、偷拍、散布私密影像或拒絕避孕', w: 8 },
  { text: '控制妳的錢、工作、住處、交通或重要證件', w: 6 },
  { text: '隔離妳的朋友家人，讓妳只剩下他', w: 5 },
  { text: '反覆查手機、定位、帳號，限制妳正常行動', w: 5 },
  { text: '妳想離開，卻因為害怕他的反應而不敢說', w: 7 }
];

const moduleBox = document.querySelector('#modules');
const redFlagBox = document.querySelector('#redflags');
const warning = document.querySelector('#score-warning');
const report = document.querySelector('#report');
const redFlagState = Array(redFlagItems.length).fill(false);

modules.forEach(item => {
  const row = document.createElement('label');
  row.className = 'module';
  row.innerHTML = `<span><small>MODULE ${item.no}</small><b>${item.name}</b></span><input type="number" min="0" max="30" inputmode="numeric" placeholder="／30" aria-label="${item.name}分數">`;
  moduleBox.append(row);
});
const hint = document.createElement('div');
hint.className = 'hint';
hint.textContent = '留白代表尚未完成；系統會依照已填篇數換算。';
moduleBox.append(hint);

redFlagItems.forEach((item, index) => {
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'checkbox';
  label.append(input, document.createTextNode(item.text));
  input.addEventListener('change', () => {
    redFlagState[index] = input.checked;
    label.classList.toggle('on', input.checked);
  });
  redFlagBox.append(label);
});

document.querySelector('#submit').addEventListener('click', () => {
  const inputs = [...moduleBox.querySelectorAll('input')];
  const entered = inputs.map((input, index) => ({
    ...modules[index],
    value: input.value.trim() === '' ? null : Number(input.value)
  })).filter(item => item.value !== null);
  const invalid = entered.some(item => !Number.isFinite(item.value) || item.value < 0 || item.value > 30);

  if (entered.length < 3 || invalid) {
    warning.classList.add('show');
    moduleBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  warning.classList.remove('show');

  const average = entered.reduce((total, item) => total + item.value, 0) / entered.length;
  const redCount = redFlagState.filter(Boolean).length;
  const redPoints = redFlagItems.reduce((total, item, index) => total + (redFlagState[index] ? item.w : 0), 0);
  const score = Math.min(100, Math.round(average / 30 * 78 + Math.min(22, redPoints)));
  const ranked = [...entered].sort((a, b) => b.value - a.value);
  const topOne = ranked[0];
  const topTwo = ranked[1];

  const diagnosis = score >= 80
    ? ['高度危險，先保命再談愛', '這段關係已經形成完整消耗系統。套路、傷害與控制互相咬住，妳靠更多溝通很難把它洗乾淨。']
    : score >= 60
      ? ['嚴重失血，停損期限到了', '多個問題同時存在，而且正在侵蝕妳的判斷和生活。繼續撐下去，代價會從情緒一路燒到健康、金錢與人際。']
      : score >= 35
        ? ['關係正在慢性腐爛', '目前還有觀察空間，問題已經不能靠忍耐帶過。界線、期限和後果要立刻落地。']
        : ['目前風險較低，繼續看行動', '整體分數沒有進入高危區。保留自己的生活和判斷，任何新紅旗都要重新計算。'];

  document.querySelector('#total').innerHTML = `${score}<i> / 100</i>`;
  document.querySelector('#level').textContent = diagnosis[0];
  document.querySelector('#summary').textContent = diagnosis[1];
  document.querySelector('#first').textContent = `${topOne.name}｜${topOne.value}/30`;
  document.querySelector('#second').textContent = `${topTwo.name}｜${topTwo.value}/30`;
  document.querySelector('#completed').textContent = `${entered.length}/8 篇`;
  document.querySelector('#autopsy').textContent = `妳完成 ${entered.length} 篇評估，平均風險 ${average.toFixed(1)}/30，另外勾選 ${redCount} 條傷害紅線。最深的傷口落在「${topOne.name}」。這份結果看的是整體行為，不讓某一次道歉、送禮或短暫變好蓋掉長期爛帳。`;

  const violent = [1, 2, 3, 4, 7].some(index => redFlagState[index]);
  document.querySelector('#verdict').textContent = violent
    ? '妳現在需要安全計畫。保留證據，把證件、錢、藥物和必要物品放在能取用的位置，找可信任的人知道狀況。離開與攤牌要選安全方式，避免單獨在密閉空間處理。遭遇立即危險，直接聯絡當地緊急服務。'
    : score >= 60
      ? '停止用下一次溝通換下一輪失望。列出三條底線、期限和違反後的行動，先把住處、金錢、工作與支持系統拿回來。妳要評估他做了什麼，別再替他的理由打分。'
      : '挑最高分的問題先處理，只設定可驗證的行動與期限。生活、朋友、金錢和選擇權繼續留在自己手上。結果長期沒有改善，就按事實做決定。';

  const actionList = violent
    ? ['今天告訴一位可信任的人目前狀況。', '備份對話、傷勢、威脅與財務控制證據。', '規劃安全離開路線，必要時尋求警方或專業機構協助。']
    : ['截圖保存這份報告，停止替結果找藉口。', `針對「${topOne.name}」寫下一條具體底線與期限。`, '把報告丟到社群，請凡氏協助檢查妳漏看的地方。'];
  const list = document.querySelector('#actions');
  list.innerHTML = '';
  actionList.forEach(text => {
    const item = document.createElement('li');
    item.textContent = text;
    list.append(item);
  });

  document.querySelector('#ask').textContent = `我的壞男系統總風險是 ${score}/100，最高分是「${topOne.name}」${topOne.value}/30，另外踩到 ${redCount} 條傷害紅線。請凡氏幫我做最終診斷：我現在最需要處理的盲點是什麼？`;
  report.style.display = 'block';
  report.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('#shot').addEventListener('click', event => {
  document.body.classList.toggle('shot');
  report.scrollIntoView();
  event.currentTarget.textContent = document.body.classList.contains('shot') ? '退出截圖模式' : '進入截圖模式';
});

const shotStyle = document.createElement('style');
shotStyle.textContent = '.shot .top,.shot .hero,.shot .rule,.shot .modules,.shot .section,.shot #submit,.shot .warning,.shot .foot{display:none!important}.shot .wrap{padding:0;width:min(780px,100%)}.shot .report{display:block!important;margin:0;min-height:100vh}.shot .share button{position:fixed;right:15px;bottom:15px;width:auto}';
document.head.append(shotStyle);
