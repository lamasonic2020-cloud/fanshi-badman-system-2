const times = ['三天內', '一週內', '一個月內', '三個月內', '更久'];
const talkItems = ['說只有妳真正懂他', '很快講童年創傷和前任傷害', '提到同居、旅行、結婚或孩子', '很早就叫寶貝、老婆或專屬暱稱', '說你們相遇有命運安排', '要求妳停止認識其他人', '一直強調你們非常相像', '說從沒對別人有這種感覺'];
const bodyItems = ['第一次見面就想去私人空間', '很快把聊天轉成性話題', '一直測試肢體接觸', '用喝酒幫忙推進', '拒絕後繼續盧或裝失望', '說愛他就該更親密'];
const dutyItems = ['提前安排見面並準時出現', '感情狀態交代清楚', '讓重要朋友知道妳的存在', '答應的事情長期做到', '尊重妳放慢速度', '願意談雙方都要遵守的規則'];

let selectedTime = -1;
const talkState = Array(talkItems.length).fill(false);
const bodyState = Array(bodyItems.length).fill(false);
const dutyState = Array(dutyItems.length).fill(false);

const timeBox = document.querySelector('#time');
const submitButton = document.querySelector('#submit');
const resultBox = document.querySelector('#result');
const shotButton = document.querySelector('#shot');

times.forEach((text, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.addEventListener('click', () => {
    selectedTime = index;
    timeBox.querySelectorAll('button').forEach(item => item.classList.remove('on'));
    button.classList.add('on');
    timeBox.classList.remove('needs-answer');
    submitButton.textContent = '看他的嘴、手和責任差多遠 →';
  });
  timeBox.append(button);
});

function renderChecklist(selector, data, state) {
  const box = document.querySelector(selector);
  data.forEach((text, index) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    label.append(input, document.createTextNode(text));
    input.addEventListener('change', () => {
      state[index] = input.checked;
      label.classList.toggle('on', input.checked);
    });
    box.append(label);
  });
}

renderChecklist('#talk', talkItems, talkState);
renderChecklist('#body', bodyItems, bodyState);
renderChecklist('#duty', dutyItems, dutyState);

submitButton.addEventListener('click', () => {
  if (selectedTime < 0) {
    timeBox.classList.add('needs-answer');
    submitButton.textContent = '先選你們當時認識多久 ↑';
    timeBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const talk = talkState.filter(Boolean).length;
  const body = bodyState.filter(Boolean).length;
  const duty = dutyState.filter(Boolean).length;
  const timeRisk = [4, 4, 3, 2, 0][selectedTime];
  const score = Math.max(0, Math.min(24, talk + body * 2 + timeRisk - duty));
  const diagnosis = score >= 18
    ? ['快轉很嚴重', '他用很高的情緒濃度和身體推進，把妳迅速拉進關係。責任遠遠落在後面。']
    : score >= 11
      ? ['速度已經失衡', '甜話和親密跑得很快，實際承擔還不夠。妳需要放慢，看他能不能穩定做事。']
      : score >= 5
        ? ['有幾個快轉訊號', '目前仍能觀察。幾句深情話不能直接換成信任，讓時間繼續驗證。']
        : ['速度相對正常', '情話、親密和責任目前沒有明顯落差。繼續保持自己的節奏。'];

  document.querySelector('#total').innerHTML = `${score}<i> / 24</i>`;
  document.querySelector('#level').textContent = diagnosis[0];
  document.querySelector('#summary').textContent = diagnosis[1];
  const values = [['情話速度', talk, 8], ['身體速度', body, 6], ['責任進度', duty, 6]];
  document.querySelector('#meters').innerHTML = values.map(value => `<div class="meter"><b>${value[0]}</b><div class="bar"><i style="width:${value[1] / value[2] * 100}%"></i></div><strong>${value[1]}/${value[2]}</strong></div>`).join('');
  document.querySelector('#verdict').textContent = score >= 11
    ? '他的嘴巴已經跟妳過完一輩子，手也想趕快伸進妳衣服，責任還停在原地。現在放慢。妳一放慢他就翻臉，答案已經很清楚。'
    : '目前不用急著把他判死刑。照自己的速度走。真正穩定的人，等得起，也做得到。';
  document.querySelector('#ask').textContent = `我的快轉風險是 ${score}/24。請凡氏幫我看：他現在推得最快的是哪一塊？我該怎麼放慢？`;
  resultBox.style.display = 'block';
  resultBox.scrollIntoView({ behavior: 'smooth' });
});

shotButton.addEventListener('click', () => {
  document.body.classList.toggle('shot');
  resultBox.scrollIntoView();
  shotButton.textContent = document.body.classList.contains('shot') ? '退出截圖模式' : '進入截圖模式';
});

const style = document.createElement('style');
style.textContent = '.time-row.needs-answer{outline:2px solid var(--p);outline-offset:8px}.shot .top,.shot .hero,.shot .rule,.shot .section,.shot #submit,.shot .foot{display:none!important}.shot .wrap{padding:0;width:min(760px,100%)}.shot .result{display:block!important;margin:0;min-height:100vh}.shot .share button{position:fixed;right:15px;bottom:15px;width:auto}';
document.head.append(style);
