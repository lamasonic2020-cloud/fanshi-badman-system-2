const durations = ['不到 3 個月', '3～6 個月', '半年～1 年', '1～2 年', '超過 2 年'];

const promiseItems = [
  { text: '答應正式確認或公開關係', w: 3 },
  { text: '說會帶妳認識朋友或家人', w: 2 },
  { text: '說會結束其他曖昧或前任糾纏', w: 3 },
  { text: '談過同居、搬家或住在同一個城市', w: 2 },
  { text: '主動提過結婚、生小孩或共同生活', w: 3 },
  { text: '說會改善消失、冷暴力、撒謊或脾氣', w: 3 },
  { text: '答應處理債務、工作、成癮或生活爛攤', w: 3 },
  { text: '說等某件事忙完，一切就會變好', w: 2 }
];

const delayItems = [
  { text: '每次都說最近太忙，過一陣子再談', w: 2 },
  { text: '怪妳逼太緊、想太多、破壞氣氛', w: 3 },
  { text: '換一個更遠的條件：等工作、錢、房子穩定', w: 3 },
  { text: '吵架或妳要離開時才突然重新保證', w: 3 },
  { text: '拒絕給日期，還要妳相信他的心', w: 3 },
  { text: '用短暫變好幾天，換妳再等幾個月', w: 2 },
  { text: '被問到進度就生氣、消失或轉移話題', w: 3 },
  { text: '以前的承諾沒完成，又丟出新的未來', w: 3 }
];

const actionItems = [
  { text: '主動提出清楚日期，而且沒有反覆改期', w: 3 },
  { text: '已經讓重要親友知道妳的身分', w: 3 },
  { text: '為共同計畫投入了看得到的時間或金錢', w: 3 },
  { text: '主動處理阻礙，不用妳天天催', w: 3 },
  { text: '至少有一項重要承諾已經完整做到', w: 4 },
  { text: '遇到困難會一起修正計畫，仍保留明確期限', w: 2 }
];

const promiseState = Array(promiseItems.length).fill(false);
const delayState = Array(delayItems.length).fill(false);
const actionState = Array(actionItems.length).fill(false);
let selectedDuration = -1;

const durationBox = document.querySelector('#duration');
const warning = document.querySelector('#duration-warning');
const resultBox = document.querySelector('#result');
const submitButton = document.querySelector('#submit');
const shotButton = document.querySelector('#shot');

durations.forEach((text, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.addEventListener('click', () => {
    selectedDuration = index;
    durationBox.querySelectorAll('button').forEach(item => item.classList.remove('on'));
    button.classList.add('on');
    warning.classList.remove('show');
  });
  durationBox.append(button);
});

function mount(selector, items, state) {
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

function sum(items, state) {
  return items.reduce((total, item, index) => total + (state[index] ? item.w : 0), 0);
}

mount('#promises', promiseItems, promiseState);
mount('#delays', delayItems, delayState);
mount('#actions', actionItems, actionState);

submitButton.addEventListener('click', () => {
  if (selectedDuration < 0) {
    warning.classList.add('show');
    durationBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const promisePoints = sum(promiseItems, promiseState);
  const delayPoints = sum(delayItems, delayState);
  const actionPoints = sum(actionItems, actionState);
  const promiseCount = promiseState.filter(Boolean).length;
  const delayCount = delayState.filter(Boolean).length;
  const actionCount = actionState.filter(Boolean).length;
  const durationRisk = [0, 2, 4, 6, 8][selectedDuration];
  const rawRisk = promisePoints + delayPoints + durationRisk - Math.round(actionPoints * 0.8);
  const score = Math.max(0, Math.min(30, Math.round(rawRisk * 30 / 51)));

  const diagnosis = score >= 24
    ? ['這張支票早就跳票了', '他靠未來餵住妳，靠拖延保住自己。話說得越大，現在付出的成本越接近零。']
    : score >= 16
      ? ['信用已經爛得差不多', '承諾堆得很高，完成度低得難看。妳繼續等，他只會學會用下一句保證換更多時間。']
      : score >= 8
        ? ['承諾還缺真金白銀', '部分行動已經出現，拖延和模糊仍在吃掉信用。接下來只收日期、步驟與結果。']
        : ['目前看得到兌現能力', '他說過的事有具體進度，也願意付出成本。繼續盯長期一致性，別只靠一兩次表現下結論。'];

  const gap = Math.max(0, promiseCount - actionCount);
  document.querySelector('#total').innerHTML = `${score}<i> / 30</i>`;
  document.querySelector('#level').textContent = diagnosis[0];
  document.querySelector('#summary').textContent = diagnosis[1];
  document.querySelector('#said').textContent = `${promiseCount}/8`;
  document.querySelector('#done').textContent = `${actionCount}/6`;
  document.querySelector('#truth').textContent = delayCount >= 4
    ? `妳已經看見 ${delayCount} 種拖延手法。他很清楚什麼話能讓妳心軟，也知道每次多撐一陣子，就能繼續享受現在的好處。`
    : `他開過 ${promiseCount} 張未來支票，留下 ${gap} 筆明顯落差。妳已經等了「${durations[selectedDuration]}」，時間本身就是成本。`;
  document.querySelector('#verdict').textContent = score >= 16
    ? '停止跟他討論遙遠的夢。挑一件最重要的承諾，寫清楚期限、下一步和雙方要做的事。期限到了仍然只有理由，妳就按跳票處理。別再拿自己的青春替他延長付款日。'
    : '保留觀察，不提前把未來當成已經到手。每個承諾都要有下一步、期限和可驗證的結果。穩定兌現幾次，信用才有資格往上加。';
  document.querySelector('#ask').textContent = `我的空頭支票指數是 ${score}/30。他說過 ${promiseCount} 項未來，完成 ${actionCount} 項，我已經等了「${durations[selectedDuration]}」。請凡氏幫我看：這張支票還值得給多久期限？`;
  resultBox.style.display = 'block';
  resultBox.scrollIntoView({ behavior: 'smooth' });
});

shotButton.addEventListener('click', () => {
  document.body.classList.toggle('shot');
  resultBox.scrollIntoView();
  shotButton.textContent = document.body.classList.contains('shot') ? '退出截圖模式' : '進入截圖模式';
});

const shotStyle = document.createElement('style');
shotStyle.textContent = '.shot .top,.shot .hero,.shot .rule,.shot .promise-board,.shot .section,.shot #submit,.shot .foot{display:none!important}.shot .wrap{padding:0;width:min(760px,100%)}.shot .result{display:block!important;margin:0;min-height:100vh}.shot .share button{position:fixed;right:15px;bottom:15px;width:auto}';
document.head.append(shotStyle);
