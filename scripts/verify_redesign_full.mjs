import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const TEMP_DIR = path.resolve('.edge_temp_verify_full');
const ARTIFACT_DIR = 'C:\\Users\\nandh\\.gemini\\antigravity-ide\\brain\\fc07b498-3273-4d90-a7b3-acb73799de80';

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Spawning Edge headless to verify full MeetMind AI experience...');
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9224',
    `--user-data-dir=${TEMP_DIR}`,
    '--window-size=1440,900',
    '--disable-gpu',
    'http://127.0.0.1:5173/'
  ]);

  try {
    let wsUrl = null;
    for (let i = 0; i < 30; i++) {
      await sleep(500);
      try {
        const res = await fetch('http://127.0.0.1:9224/json/list');
        const list = await res.json();
        if (list && list.length > 0) {
          const page = list.find((item) => item.type === 'page');
          if (page && page.webSocketDebuggerUrl) {
            wsUrl = page.webSocketDebuggerUrl;
            break;
          }
        }
      } catch (e) {
        // wait
      }
    }

    if (!wsUrl) throw new Error('Failed to connect to Edge CDP');
    console.log('Connected to CDP:', wsUrl);
    const ws = new WebSocket(wsUrl);

    let msgId = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    const send = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    await send('Page.enable');
    await send('Runtime.enable');

    const evaluate = async (expression) => {
      const res = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      if (res.exceptionDetails) {
        throw new Error(JSON.stringify(res.exceptionDetails));
      }
      return res.result.value;
    };

    const captureScreenshot = async (name) => {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(res.data, 'base64');
      const filename = path.join(ARTIFACT_DIR, `${name}.png`);
      fs.writeFileSync(filename, buffer);
      console.log(`Saved screenshot: ${filename}`);
    };

    await sleep(2000);

    // 1. Dashboard Overview
    console.log('1. Checking Dashboard Overview...');
    await captureScreenshot('verified_dashboard_overview');

    // 2. Prepare Me Hero Sequence Modal
    console.log('2. Triggering Hero Prepare Me Sequence...');
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Prepare Me'));
      if (btn) btn.click();
    })()`);
    await sleep(800);
    await captureScreenshot('verified_prepare_sequence_modal');

    // Wait for the hero sequence to finish and show the 8-section briefing
    await sleep(2500);
    await captureScreenshot('verified_briefing_8_sections');

    // 3. Contacts View (Empty State & Workspace Connect)
    console.log('3. Checking Contacts...');
    await evaluate(`(() => {
      const navBtn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.textContent.includes('Contacts'));
      if (navBtn) navBtn.click();
    })()`);
    await sleep(1000);
    await captureScreenshot('verified_contacts_empty_state');

    // Connect Google to populate contacts
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Connect Google'));
      if (btn) btn.click();
    })()`);
    await sleep(1000);
    await captureScreenshot('verified_contacts_populated');

    // 4. Memory View & Interactive Network Graph
    console.log('4. Checking Memory View & Network Graph...');
    await evaluate(`(() => {
      const navBtn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.textContent.includes('Memory'));
      if (navBtn) navBtn.click();
    })()`);
    await sleep(1200);
    await captureScreenshot('verified_memory_network_graph');

    // 5. Settings View (Honest Hindsight Status & Connections)
    console.log('5. Checking Settings...');
    await evaluate(`(() => {
      const navBtn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.textContent.includes('Settings'));
      if (navBtn) navBtn.click();
    })()`);
    await sleep(1000);
    await captureScreenshot('verified_settings_honest_hindsight');

    ws.close();
    console.log('✓ All screenshots captured and verification complete!');
  } finally {
    edge.kill();
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
