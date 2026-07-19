const phraseData = [
  {text:'「我現在沒有辦法給妳承諾。」', meaning:'他先把責任拿掉，還想繼續享受妳的陪伴、情緒照顧或身體。', watch:'看他有沒有照樣要求專一、隨傳隨到、陪睡。', weight:2},
  {text:'「順其自然就好，幹嘛一定要定義？」', meaning:'關係保持模糊，他進退都方便。妳認真時他能躲，寂寞時又能回來找妳。', watch:'看他是否只在需要妳時談感覺，談責任就閃。', weight:2},
  {text:'「我跟她真的沒什麼，妳想太多。」', meaning:'他跳過具體事實，先處理妳的情緒，讓妳懷疑自己。', watch:'直接問時間、場合、關係和界線，看答案有沒有前後一致。', weight:2},
  {text:'「如果妳真的愛我，就不會拒絕。」', meaning:'他拿愛當壓力，逼妳交出身體、金錢、隱私或底線。', watch:'拒絕一次，看他尊重妳，還是翻臉、冷掉、裝可憐。', weight:3},
  {text:'「我以前被傷得很重，所以才會這樣。」', meaning:'他的傷可能是真的，但現在拿來要求妳忍受爛行為。', watch:'看他有沒有處理自己的問題，還是每次傷人都拿過去擋。', weight:2},
  {text:'「妳跟其他女生不一樣。」', meaning:'他快速把妳捧高，讓妳想守住那個特別位置，開始證明自己夠懂事。', watch:'看這句話後面有沒有接要求、比較、性暗示或情緒勞動。', weight:1},
  {text:'「我最近真的太忙，過陣子就好了。」', meaning:'他把妳放在有空才處理的位置，又用未來吊住妳。', watch:'忙的人仍然能交代、安排、守約。直接看下一次有沒有做到。', weight:1},
  {text:'「我不喜歡女生太黏、太情緒化。」', meaning:'他提前警告妳少問、少要、少表達。妳怕被嫌，會自己把需求吞回去。', watch:'看合理溝通是否也被他扣上麻煩、黏人、愛吵的帽子。', weight:2},
  {text:'「我只跟妳說這些，別人都不知道。」', meaning:'他用祕密快速製造親密感，讓妳提早投入照顧和信任。', watch:'看他的私密故事有沒有換來妳的裸照、金錢、性或無限體諒。', weight:1},
  {text:'「前任都很瘋，我只是運氣不好。」', meaning:'每段關係的錯都在女人身上，他永遠乾乾淨淨。', watch:'問他自己做錯什麼。完全答不出來，妳很可能會成為下一個瘋女人。', weight:2}
];

const actionItems = [
  {text:'關係不說清楚，卻要求妳只能有他', weight:3},
  {text:'拒絕後繼續盧、擺臭臉、消失或冷暴力', weight:3},
  {text:'被抓到矛盾時，改罵妳多疑、愛鬧', weight:3},
  {text:'只在深夜、喝酒後或想做愛時特別熱情', weight:2},
  {text:'答應會改，過幾天又原樣重演', weight:2},
  {text:'要求妳保密，不讓朋友知道完整狀況', weight:2},
  {text:'常拿前任或其他女生刺激妳競爭', weight:2},
  {text:'談到責任、公開、未來就轉移話題', weight:2}
];

const costItems = [
  {text:'妳開始不敢問關係，也不敢表達不舒服', weight:2},
  {text:'妳一直等訊息、等見面、等他準備好', weight:2},
  {text:'妳交出身體後，關係仍然沒有更清楚', weight:3},
  {text:'妳替他付錢、借錢、做事或收拾爛攤子', weight:3},
  {text:'妳對朋友隱瞞，怕別人一聽就叫妳走', weight:2},
  {text:'妳常懷疑自己太敏感、要求太多', weight:2}
];

const phraseState = Array(phraseData.length).fill(false);
const actionState = Array(actionItems.length).fill(false);
const costState = Array(costItems.length).fill(false);
const phraseBox = document.querySelector('#phrases');
const translationBox = document.querySelector('#translation');
const warning = document.querySelector('#phrase-warning');
const resultBox = document.querySelector('#result');
const submitButton = document.querySelector('#submit');
const shotButton = document.querySelector('#shot');
const aiInput = document.querySelector('#ai-input');
const aiSubmit = document.querySelector('#ai-submit');
const aiStatus = document.querySelector('#ai-status');
const aiAnswer = document.querySelector('#ai-answer');

function safeText(value) {
  return String(value || '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
}

aiSubmit.addEventListener('click', async () => {
  const message = aiInput.value.trim();
  const endpoint = String(window.FANSHI_API_URL || '');
  if (message.length < 3) {
    aiStatus.textContent = '先貼上他講的原話。';
    return;
  }
  if (!/^https:\/\//.test(endpoint) || endpoint.includes('請換成')) {
    aiStatus.textContent = '網站管理者還沒有完成 GPT 後端設定。';
    return;
  }

  aiSubmit.disabled = true;
  aiSubmit.textContent = '正在拆他的話…';
  aiStatus.textContent = '壞男翻譯機正在拆他的句子、目的和後續風險。';
  aiAnswer.classList.remove('show');
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({message})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '服務暫時無法使用');
    const rows = [
      ['直接翻譯', data.translation],
      ['他想拿什麼', data.goal],
      ['風險程度', data.risk],
      ['接著核對', data.check],
      ['妳可以回', data.reply]
    ];
    aiAnswer.innerHTML = rows.map(row => `<div class="ai-line"><b>${row[0]}</b><p>${safeText(row[1])}</p></div>`).join('');
    aiAnswer.classList.add('show');
    aiStatus.textContent = '分析完成。先看他的後續行動，再決定要不要信。';
  } catch (error) {
    aiStatus.textContent = error.message === 'Failed to fetch' ? '連不到翻譯服務，請管理者檢查後端網址。' : error.message;
  } finally {
    aiSubmit.disabled = false;
    aiSubmit.textContent = '拆開他的話 →';
  }
});

function showTranslation(item) {
  translationBox.innerHTML = `<b>他講的</b><p class="raw">${item.text}</p><b>直接翻譯</b><p>${item.meaning}</p><b>接著看</b><p>${item.watch}</p>`;
  translationBox.classList.add('show');
}

phraseData.forEach((item, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'phrase';
  button.textContent = item.text;
  button.addEventListener('click', () => {
    phraseState[index] = !phraseState[index];
    button.classList.toggle('on', phraseState[index]);
    warning.classList.remove('show');
    showTranslation(item);
  });
  phraseBox.append(button);
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

renderChecklist('#actions', actionItems, actionState);
renderChecklist('#costs', costItems, costState);

function weightedTotal(items, state) {
  return items.reduce((sum, item, index) => sum + (state[index] ? item.weight : 0), 0);
}

submitButton.addEventListener('click', () => {
  const selectedPhrases = phraseState.filter(Boolean).length;
  if (!selectedPhrases) {
    warning.classList.add('show');
    phraseBox.scrollIntoView({behavior:'smooth', block:'center'});
    return;
  }

  const phraseScore = weightedTotal(phraseData, phraseState);
  const actionScore = weightedTotal(actionItems, actionState);
  const costScore = weightedTotal(costItems, costState);
  const score = Math.min(30, phraseScore + actionScore + costScore);
  const actionCount = actionState.filter(Boolean).length;
  const costCount = costState.filter(Boolean).length;
  const topPhrase = phraseData.find((item, index) => phraseState[index]);
  const diagnosis = score >= 23
    ? ['他在拿話控制妳', '甜話、卸責、施壓和後續佔便宜已經接成一套。妳繼續聽他解釋，只會把自己的底線越磨越薄。']
    : score >= 15
      ? ['話術已經進到妳生活', '他講的話正在改變妳的行為。妳開始等、忍、證明自己，實際關係仍然模糊。']
      : score >= 8
        ? ['有明顯的帶風向', '幾句話正在把責任推回妳身上。先停下來看後續行動，別急著接受他的版本。']
        : ['目前訊號不算密集', '有些句子需要留意，但後續傷害還不明顯。把界線說清楚，繼續看他怎麼做。'];

  document.querySelector('#total').innerHTML = `${score}<i> / 30</i>`;
  document.querySelector('#level').textContent = diagnosis[0];
  document.querySelector('#summary').textContent = diagnosis[1];
  document.querySelector('#report').innerHTML = `<div class="report-row"><b>他講過</b><span>${selectedPhrases} 種典型話術</span></div><div class="report-row"><b>後續動作</b><span>${actionCount} 項。${actionCount >= 4 ? '他的話後面接著控制、卸責或佔便宜。' : '繼續看他能不能尊重界線、把責任做好。'}</span></div><div class="report-row"><b>妳的代價</b><span>${costCount} 項。${costCount >= 3 ? '妳已經在替他的舒服付帳。' : '目前代價仍可控，別再往裡面加碼。'}</span></div><div class="report-row"><b>先拆這句</b><span>${topPhrase.text}<br>${topPhrase.meaning}</span></div>`;
  document.querySelector('#verdict').textContent = score >= 15
    ? '別再研究他心裡到底愛不愛。直接看妳拒絕時他會不會尊重、談責任時他會不會留下、答應的事能不能做到。三樣都爛，嘴巴講再多深情也只是在騙妳繼續供應。'
    : '先把他的話當成待驗證資料。妳照常說需求、守界線、要求具體安排。他願意穩定做到，信任再慢慢加；他開始嫌妳麻煩，答案也出來了。';
  document.querySelector('#ask').textContent = `我的話術操控指數是 ${score}/30。他最常講的是「${topPhrase.text.replace(/[「」]/g, '')}」請凡氏幫我看：他真正想從我身上拿什麼？`;
  resultBox.style.display = 'block';
  resultBox.scrollIntoView({behavior:'smooth'});
});

shotButton.addEventListener('click', () => {
  document.body.classList.toggle('shot');
  resultBox.scrollIntoView();
  shotButton.textContent = document.body.classList.contains('shot') ? '退出截圖模式' : '進入截圖模式';
});

const shotStyle = document.createElement('style');
shotStyle.textContent = '.shot .top,.shot .hero,.shot .rule,.shot .section,.shot #submit,.shot .foot{display:none!important}.shot .wrap{padding:0;width:min(760px,100%)}.shot .result{display:block!important;margin:0;min-height:100vh}.shot .share button{position:fixed;right:15px;bottom:15px;width:auto}';
document.head.append(shotStyle);
