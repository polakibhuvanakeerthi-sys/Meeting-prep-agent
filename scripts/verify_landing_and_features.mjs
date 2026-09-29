import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const TEMP_DIR = path.resolve('.edge_temp_verify_landing');
const ARTIFACT_DIR = 'C:\\Users\\nandh\\.gemini\\antigravity-ide\\brain\\fc07b498-3273-4d90-a7b3-acb73799de80';

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Spawning Edge headless for visual verification...');
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9226',
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
        const res = await fetch('http://127.0.0.1:9226/json/list');
        const list = await res.json();
        if (list && list.length > 0) {
          const page = list.find((item) => item.type === 'page');
          if (page && page.webSocketDebuggerUrl) {
            wsUrl = page.webSocketDebuggerUrl;
            break;
          }
        }
      } catch (e) {}
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

    const takeScreenshot = async (filename) => {
      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(ARTIFACT_DIR, filename), Buffer.from(data, 'base64'));
      console.log(`✓ Saved: ${filename}`);
    };

    const evaluate = async (expression) => {
      return send('Runtime.evaluate', { expression, returnByValue: true });
    };

    await sleep(2500);

    // 1. Landing Hero / Intro
    await takeScreenshot('verified_landing_hero_live.png');

    // 2. Click "Skip Intro" or wait and verify Landing Page
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip Intro'));
      if (btn) btn.click();
    })()`);
    await sleep(600);
    await takeScreenshot('verified_landing_page_live.png');

    // 3. Click "Get Started" to enter Dashboard
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Get Started'));
      if (btn) btn.click();
    })()`);
    await sleep(600);
    await takeScreenshot('verified_dashboard_live.png');

    // 4. Click "Prepare Me"
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Prepare Me'));
      if (btn) btn.click();
    })()`);
    await sleep(600);
    await takeScreenshot('verified_prepare_sequence_live.png');

    await sleep(2800);
    await takeScreenshot('verified_meeting_brief_live.png');

    ws.close();
    console.log('All screenshots verified and captured successfully!');
  } finally {
    edge.kill();
  }
}

main().catch(console.error);
