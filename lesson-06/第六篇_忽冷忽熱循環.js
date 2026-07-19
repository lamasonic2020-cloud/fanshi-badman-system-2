const positions = ['正在很熱', '開始變冷', '已經消失', '突然回來', '又和好了'];
const coldItems = [
  {text:'前一天很熱，隔天突然像陌生人', weight:2},
  {text:'訊息看了不回，社群卻一直有活動', weight:2},
  {text:'臨時取消見面，也不主動補時間', weight:2},
  {text:'問他怎麼了，只回忙、累、沒事', weight:2},
  {text:'每次關係靠近，他就開始往後退', weight:3},
  {text:'發生衝突後直接消失，不處理問題', weight:3},
  {text:'冷掉期間仍會看限動、按讚或丟表情', weight:1},
  {text:'只有他想見面時才突然恢復正常', weight:2}
];
const baitItems = [
  {text:'突然說想妳、夢到妳或放不下妳', weight:2},
  {text:'像沒發生過一樣丟一句「在幹嘛」', weight:2},
  {text:'道歉很重，具體做法完全沒有', weight:2},
  {text:'又提旅行、未來、同居或正式交往', weight:2},
  {text:'妳一退，他馬上變得很積極', weight:3},
  {text:'用性、酒、深夜見面快速拉回親密', weight:3},
  {text:'說最近狀態不好，要妳再體諒一次', weight:2},
  {text:'給幾天高濃度陪伴，確認妳回頭後又冷', weight:3}
];
const damageItems = [
  {text:'一直盯手機，情緒跟著他的回覆上下', weight:2},
  {text:'他一回來，妳立刻把之前的不爽吞掉', weight:2},
  {text:'開始研究自己哪句話說錯、哪裡不夠好', weight:2},
  {text:'不敢提需求，怕他又消失', weight:3},
  {text:'朋友勸妳離開，妳仍替他找理由', weight:2},
  {text:'生活安排被他打亂，工作與睡眠受影響', weight:3},
  {text:'每次回溫都覺得這次真的會不一樣', weight:2},
  {text:'已經反覆分開、回來兩次以上', weight:3}
];

let currentPosition = -1;
const coldState = Array(coldItems.length).fill(false);
const baitState = Array(baitItems.length).fill(false);
const damageState = Array(damageItems.length).fill(false);
const positionBox = document.querySelector('#position');
const warning = document.querySelector('#position-warning');
const resultBox = document.querySelector('#result');
const submitButton = document.querySelector('#submit');
const shotButton = document.querySelector('#shot');

positions.forEach((text, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.addEventListener('click', () => {
    currentPosition = index;
    positionBox.querySelectorAll('button').forEach(item => item.classList.remove('on'));
    button.classList.add('on');
    warning.classList.remove('show');
  });
  positionBox.append(button);
});

function renderChecklist(selector, items, state) {
  const box = document.querySelector(selector);
  items.forEach((item, index) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    label.append(input, document.createTextNode(item.text));
    input.addEventListener('change', () => {
      state[index] = input.checked;
      label.classList.toggle('on', input.checked);
    });
    box.append(label);
  });
}

renderChecklist('#cold', coldItems, coldState);
renderChecklist('#bait', baitItems, baitState);
renderChecklist('#damage', damageItems, damageState);

function points(items, state) {
  return items.reduce((total, item, index) => total + (state[index] ? item.weight : 0), 0);
}

submitButton.addEventListener('click', () => {
  if (currentPosition < 0) {
    warning.classList.add('show');
    positionBox.scrollIntoView({behavior:'smooth', block:'center'});
    return;
  }
  const cold = points(coldItems, coldState);
  const bait = points(baitItems, baitState);
  const damage = points(damageItems, damageState);
  const coldCount = coldState.filter(Boolean).length;
  const baitCount = baitState.filter(Boolean).length;
  const damageCount = damageState.filter(Boolean).length;
  const score = Math.min(30, cold + bait + damage);
  const diagnosis = score >= 24
    ? ['妳已經被吊進循環', '他抽走、回來、再抽走。妳的情緒與生活被他的出現控制，關係仍然沒有穩定進展。']
    : score >= 16
      ? ['忽冷忽熱很明顯', '他的投入不穩定，回頭時又給足希望。妳正在拿幾天的熱，替長期的冷找理由。']
      : score >= 8
        ? ['節奏開始不對', '冷熱落差已經出現。先別加碼投入，讓他的穩定行動累積一段時間。']
        : ['目前循環不明顯', '目前看不出固定的吊人節奏。遇到消失或失約，照樣要求清楚交代。'];

  document.querySelector('#total').innerHTML = `${score}<i> / 30</i>`;
  document.querySelector('#level').textContent = diagnosis[0];
  document.querySelector('#summary').textContent = diagnosis[1];
  const meters = [['抽走程度', cold, 17], ['回頭餌量', bait, 19], ['妳的耗損', damage, 19]];
  document.querySelector('#stage').innerHTML = meters.map(item => `<div class="stage-line"><b>${item[0]}</b><div class="bar"><i style="width:${Math.min(100, item[1] / item[2] * 100)}%"></i></div><strong>${item[1]}</strong></div>`).join('');
  const strongest = cold >= bait && cold >= damage ? '他最熟的是抽走注意力，等妳開始追。' : bait >= damage ? '他最熟的是在妳快死心時餵一口甜頭。' : '這套節奏已經讓妳付出大量情緒和生活成本。';
  document.querySelector('#truth').textContent = `${strongest} 你們現在位於「${positions[currentPosition]}」。妳記得的是他回來多熱，身體承受的是他反覆消失。`;
  document.querySelector('#verdict').textContent = score >= 16
    ? '下一次他回來，先別急著和好、做愛、談未來。直接問消失的原因、接下來怎麼維持、做不到怎麼處理。只肯講想妳，不肯交代行動，他回來只是補充供應。'
    : '先把觀察時間拉長。看他能不能主動安排、穩定聯絡、處理衝突。熱三天沒有用，連續穩定幾週才算資料。';
  document.querySelector('#ask').textContent = `我的吊人循環指數是 ${score}/30，目前在「${positions[currentPosition]}」。抽走 ${coldCount} 項、回頭餌 ${baitCount} 項、耗損 ${damageCount} 項。請凡氏幫我看：他下一次回來，我最需要守住哪條底線？`;
  resultBox.style.display = 'block';
  resultBox.scrollIntoView({behavior:'smooth'});
});

shotButton.addEventListener('click', () => {
  document.body.classList.toggle('shot');
  resultBox.scrollIntoView();
  shotButton.textContent = document.body.classList.contains('shot') ? '退出截圖模式' : '進入截圖模式';
});

const shotStyle = document.createElement('style');
shotStyle.textContent = '.shot .top,.shot .hero,.shot .rule,.shot .cycle,.shot .section,.shot #submit,.shot .foot{display:none!important}.shot .wrap{padding:0;width:min(760px,100%)}.shot .result{display:block!important;margin:0;min-height:100vh}.shot .share button{position:fixed;right:15px;bottom:15px;width:auto}';
document.head.append(shotStyle);
