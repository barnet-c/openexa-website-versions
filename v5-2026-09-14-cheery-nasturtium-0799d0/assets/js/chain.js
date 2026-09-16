/* OpenEXA — the chain, for real.
   Eight records, each hashed with SHA-256 over (its content + the previous hash). Edit any field and every record after
   it turns red, because its stored previous-hash no longer matches. Press "restore" and the chain heals.
   The point: nothing on the ledger can be changed quietly. */
(function () {
  'use strict';
  const root = document.querySelector('[data-chain]');
  if (!root || !window.crypto || !crypto.subtle) return;
  const list = root.querySelector('[data-chain-list]'), status = root.querySelector('[data-chain-status]'), restore = root.querySelector('[data-chain-restore]');
  const RECORDS = [
    ['A-0412', 'PROPOSED', 'create · 45,000 sh · venue B'],
    ['A-0412', 'VALIDATED', 'limits ok · hours ok · borrow ok'],
    ['COUNCIL', 'APPROVED', 'policy v7 · auto · 3 ms'],
    ['A-0412', 'SUBMITTED', 'venue B · idempotency 9f3c'],
    ['A-0412', 'PARTIAL', '30,000 / 45,000 filled'],
    ['A-0412', 'FILLED', '45,000 / 45,000 · avg 51.2140'],
    ['A-0891', 'RECONCILED', 'broker confirm ↔ internal · Δ 0'],
    ['A-0412', 'RECORDED', 'settled · written · chained'],
  ];
  const ORIGINAL = RECORDS.map(r => r.slice());
  const enc = new TextEncoder();
  const hex = (buf) => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  async function sha(s) { return hex(await crypto.subtle.digest('SHA-256', enc.encode(s))); }

  // build rows
  const rows = RECORDS.map((r, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="i">${String(i + 1).padStart(2, '0')}</span><span class="who">${r[0]}</span><b class="ev" contenteditable="true" spellcheck="false">${r[1]}</b><span class="what" contenteditable="true" spellcheck="false">${r[2]}</span><span class="prev" title="previous hash"></span><span class="hash" title="this record's hash"></span>`;
    list.appendChild(li);
    return li;
  });
  const stored = []; // the chain as it was written: [prevHash, hash] per record
  let busy = false;

  async function compute(fromStored) {
    let prev = '0000000000000000';
    const out = [];
    for (let i = 0; i < rows.length; i++) {
      const li = rows[i];
      const content = `${li.querySelector('.who').textContent}|${li.querySelector('.ev').textContent}|${li.querySelector('.what').textContent}`;
      const h = (await sha(prev + '|' + content)).slice(0, 16);
      out.push([prev, h]); prev = h;
    }
    return out;
  }
  async function write() { const c = await compute(); stored.length = 0; c.forEach(p => stored.push(p)); paint(c, true); }
  async function verify() {
    if (busy) return; busy = true;
    const c = await compute();
    let broken = -1;
    for (let i = 0; i < c.length; i++) { if (c[i][1] !== stored[i][1]) { broken = i; break; } }
    paint(c, broken < 0, broken);
    busy = false;
  }
  function paint(c, intact, broken = -1) {
    rows.forEach((li, i) => {
      li.querySelector('.prev').textContent = stored[i] ? stored[i][0].slice(0, 8) : '';
      const h = li.querySelector('.hash'), bad = broken >= 0 && i >= broken;
      h.innerHTML = bad ? `<s>${stored[i][1].slice(0, 8)}</s> ${c[i][1].slice(0, 8)}` : c[i][1].slice(0, 8);
      li.classList.toggle('is-broken', bad);
      li.classList.toggle('is-edited', broken === i);
    });
    root.classList.toggle('is-broken', !intact);
    if (status) status.innerHTML = intact ? '<i></i>Chain intact · every record points at the one before it' : `<i></i>Chain broken at record ${String(broken + 1).padStart(2, '0')} · ${rows.length - broken} record${rows.length - broken > 1 ? 's' : ''} no longer verify`;
    if (restore) restore.hidden = intact;
  }
  let t = 0;
  list.addEventListener('input', () => { clearTimeout(t); t = setTimeout(verify, 120); });
  list.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } });
  if (restore) restore.addEventListener('click', () => { rows.forEach((li, i) => { li.querySelector('.ev').textContent = ORIGINAL[i][1]; li.querySelector('.what').textContent = ORIGINAL[i][2]; }); verify(); });
  write();
})();
