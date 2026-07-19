(() => {
  const REPORT_SELECTOR = '#result, #report, .result, .report';
  const GROUP_SELECTOR = '.section, .scene, .q, .signals, .supply, .profile, .modules';

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function outsideReport(element) {
    return !element.closest('#result, #report, .result, .report, .share, .community');
  }

  function groupName(element) {
    const container = element.closest(GROUP_SELECTOR);
    if (!container) return '其他已選內容';
    const small = cleanText(container.querySelector('small')?.textContent);
    const heading = cleanText(container.querySelector('h2, h3')?.textContent);
    return small && heading ? `${small}｜${heading}` : heading || small || '其他已選內容';
  }

  function selectedText(element) {
    if (element.matches('input[type="checkbox"], input[type="radio"]')) {
      return cleanText(element.closest('label')?.textContent || element.getAttribute('aria-label'));
    }
    if (element.matches('button')) return cleanText(element.textContent);
    return '';
  }

  function collectGroups() {
    const groups = new Map();
    const add = (name, text) => {
      if (!text) return;
      if (!groups.has(name)) groups.set(name, []);
      const items = groups.get(name);
      if (!items.includes(text)) items.push(text);
    };

    document.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked, button.on').forEach(element => {
      if (!outsideReport(element) || element.id === 'shot') return;
      add(groupName(element), selectedText(element));
    });

    document.querySelectorAll('input[type="number"]').forEach(input => {
      if (!outsideReport(input) || input.value.trim() === '') return;
      const module = input.closest('.module');
      const name = '已輸入的課程分數';
      const label = cleanText(module?.querySelector('b')?.textContent || input.getAttribute('aria-label') || '課程');
      add(name, `${label}：${input.value}/30`);
    });

    document.querySelectorAll('textarea').forEach(textarea => {
      if (!outsideReport(textarea) || textarea.id === 'ai-input' || textarea.value.trim() === '') return;
      const text = cleanText(textarea.value).slice(0, 400);
      add(groupName(textarea), `使用者填寫：${text}`);
    });

    return groups;
  }

  function findReport() {
    const candidates = [...document.querySelectorAll(REPORT_SELECTOR)];
    return candidates.find(element => element.querySelector('.score, .verdict, .share, .community')) || candidates[0];
  }

  function renderEvidence() {
    const report = findReport();
    if (!report) return;
    report.querySelector('.fanshi-evidence')?.remove();

    const groups = collectGroups();
    const section = document.createElement('section');
    section.className = 'fanshi-evidence';
    const title = document.createElement('div');
    title.className = 'fanshi-evidence-title';
    title.innerHTML = '<small>凡氏判讀版</small><h2>本次勾選證據</h2><p>下面保留使用者真正選過的內容，方便社群回覆時直接核對行為。</p>';
    section.append(title);

    if (!groups.size) {
      const empty = document.createElement('p');
      empty.className = 'fanshi-evidence-empty';
      empty.textContent = '本次沒有勾選具體項目。';
      section.append(empty);
    } else {
      groups.forEach((items, name) => {
        const group = document.createElement('div');
        group.className = 'fanshi-evidence-group';
        const heading = document.createElement('h3');
        heading.textContent = `${name}｜${items.length} 項`;
        const list = document.createElement('ul');
        items.forEach(text => {
          const item = document.createElement('li');
          item.textContent = text;
          list.append(item);
        });
        group.append(heading, list);
        section.append(group);
      });
    }

    const anchor = report.querySelector('.verdict, .share, .community');
    if (anchor) report.insertBefore(section, anchor);
    else report.append(section);
  }

  document.addEventListener('click', event => {
    if (event.target.closest('#submit')) window.setTimeout(renderEvidence, 40);
  });

  const style = document.createElement('style');
  style.textContent = `
    .fanshi-evidence{padding:42px 48px;border-top:1px solid rgba(200,75,111,.35);background:#0f0e10}
    .fanshi-evidence-title h2{margin:10px 0 8px;font:700 26px/1.5 "Noto Serif TC",serif}
    .fanshi-evidence-title p{margin:0 0 26px;color:#938b88;font-size:13px;line-height:1.8}
    .fanshi-evidence-group{padding:22px 0;border-top:1px solid rgba(242,237,231,.12)}
    .fanshi-evidence-group h3{margin:0 0 14px;color:#d66b8a;font:700 14px/1.6 "Noto Sans TC",sans-serif}
    .fanshi-evidence-group ul{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;margin:0;padding:0;list-style:none}
    .fanshi-evidence-group li{position:relative;padding-left:18px;color:#d8d0cc;font-size:13px;line-height:1.75}
    .fanshi-evidence-group li:before{content:'✓';position:absolute;left:0;color:#c84b6f;font-weight:700}
    .fanshi-evidence-empty{color:#817875}
    @media(max-width:650px){.fanshi-evidence{padding:28px 22px}.fanshi-evidence-group ul{grid-template-columns:1fr}.fanshi-evidence-title h2{font-size:22px}}
  `;
  document.head.append(style);
})();
