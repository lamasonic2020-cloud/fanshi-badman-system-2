const positions = ['正式女友，公開介紹', '正式交往，很少公開', '曖昧或穩定約會', '朋友以上，沒有名分', '他刻意不定義'];

const lineItems = [
  { text: '和前任保持高頻聯絡，內容對妳保密', w: 3 },
  { text: '固定找幾個女生聊天、談心或深夜互動', w: 3 },
  { text: '社群持續對陌生女生撒餌、回限動、傳火', w: 2 },
  { text: '交友軟體仍在使用，理由是忘了刪或看看而已', w: 3 },
  { text: '手機、通知、行程突然變得異常防備', w: 2 },
  { text: '有一位他說不用擔心，界線卻一直很模糊', w: 3 },
  { text: '消失期間常出現新的女性互動，回來後不解釋', w: 3 },
  { text: '曾經越界或說謊，相關對象仍留在生活裡', w: 4 }
];

const gameItems = [
  { text: '故意稱讚別的女生，順便嫌妳不夠好', w: 3 },
  { text: '告訴妳很多人喜歡他，要妳珍惜機會', w: 3 },
  { text: '妳一拉開距離，他就用別的女生刺激妳', w: 3 },
  { text: '把妳和前任比較，要求妳證明自己更值得', w: 3 },
  { text: '被抓到曖昧後，反過來罵妳查勤、控制、沒自信', w: 3 },
  { text: '要求妳專一，他自己保留認識新人的自由', w: 4 },
  { text: '每次關係要升級，他身邊就冒出另一個選項', w: 2 },
  { text: '讓不同女生互相知道存在，享受被爭奪', w: 4 }
];

const boundaryItems = [
  { text: '主動公開妳的伴侶身分，不製造單身假象', w: 3 },
  { text: '對前任與曖昧對象講清楚界線並持續做到', w: 4 },
  { text: '遇到越界邀約會拒絕，也願意讓妳知道', w: 3 },
  { text: '社群互動和私訊尺度長期一致', w: 2 },
  { text: '雙方遵守同一套專一規則，沒有特權', w: 4 },
  { text: '妳提出合理疑慮時，他願意說明和處理', w: 2 }
];

const lineState = Array(lineItems.length).fill(false);
const gameState = Array(gameItems.length).fill(false);
const boundaryState = Array(boundaryItems.length).fill(false);
let selectedPosition = -1;

const positionBox = document.querySelector('#position');
const warning = document.querySelector('#position-warning');
const resultBox = document.querySelector('#result');
const shotButton = document.querySelector('#shot');

positions.forEach((text, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.addEventListener('click', () => {
    selectedPosition = index;
    positionBox.querySelectorAll('button').forEach(item => item.classList.remove('on'));
    button.classList.add('on');
    warning.classList.remove('show');
  });
  positionBox.append(button);
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

mount('#lines', lineItems, lineState);
mount('#games', gameItems, gameState);
mount('#boundaries', boundaryItems, boundaryState);

document.querySelector('#submit').addEventListener('click', () => {
  if (selectedPosition < 0) {
    warning.classList.add('show');
    positionBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const linePoints = sum(lineItems, lineState);
  const gamePoints = sum(gameItems, gameState);
  const boundaryPoints = sum(boundaryItems, boundaryState);
  const lineCount = lineState.filter(Boolean).length;
  const gameCount = gameState.filter(Boolean).length;
  const boundaryCount = boundaryState.filter(Boolean).length;
  const positionRisk = [0, 2, 4, 6, 7][selectedPosition];
  const rawRisk = linePoints + gamePoints + positionRisk - Math.round(boundaryPoints * 0.75);
  const score = Math.max(0, Math.min(30, Math.round(rawRisk * 30 / 59)));

  const diagnosis = score >= 24
    ? ['妳已經住進他的養殖場', '他同時保留多條線，又用競爭和不安控制妳的投入。妳在拚正宮資格，他在享受所有人的供應。']
    : score >= 16
      ? ['候補名單非常擁擠', '模糊關係和操控手法都很明顯。他沒有急著清場，因為現在這個局面對他最爽、最省事。']
      : score >= 8
        ? ['後門還沒有關乾淨', '有幾條關係缺乏界線，安全行動也不夠完整。別急著說服自己大方，先看他願不願意處理。']
        : ['目前界線相對清楚', '他有用行動維持專一，也沒有明顯利用第三者操控妳。繼續看長期一致性和雙方規則是否對等。'];

  document.querySelector('#total').innerHTML = `${score}<i> / 30</i>`;
  document.querySelector('#level').textContent = diagnosis[0];
  document.querySelector('#summary').textContent = diagnosis[1];
  document.querySelector('#open-lines').textContent = `${lineCount}/8`;
  document.querySelector('#safe-lines').textContent = `${boundaryCount}/6`;
  document.querySelector('#truth').textContent = gameCount >= 4
    ? `他用了 ${gameCount} 種競爭手法。妳越怕被換掉，就越容易降低底線、加倍付出、吞下原本不能接受的事。這份不安對他非常有用。`
    : `目前抓到 ${lineCount} 條可疑養線，妳的公開位置是「${positions[selectedPosition]}」。關係越模糊，他越容易把每個人都留在剛好捨不得走的位置。`;
  document.querySelector('#verdict').textContent = score >= 16
    ? '停止參加他安排的女人競賽。妳只談界線：哪些互動會越界、雙方是否遵守同一套規則、違反後怎麼處理。他拒絕清楚，又要妳繼續專一和投入，答案已經擺在桌上。'
    : '把界線說具體，觀察他能不能穩定做到。安全感不用靠查手機硬撐，也不能靠妳裝大方換來。願意專一的人會主動關掉模糊後門。';
  document.querySelector('#ask').textContent = `我的候補名單指數是 ${score}/30，抓到 ${lineCount} 條可疑養線、${gameCount} 種競爭手法，他做出 ${boundaryCount} 項清楚界線。請凡氏幫我看：我在這段關係裡到底排第幾？`;
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
