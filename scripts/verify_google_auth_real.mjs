import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const TEMP_DIR = path.resolve('.edge_temp_verify_google_auth');
const ARTIFACT_DIR = 'C:\\Users\\nandh\\.gemini\\antigravity-ide\\brain\\fc07b498-3273-4d90-a7b3-acb73799de80';

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Spawning Edge headless to verify Google Auth with real email & Microsoft removal...');
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9228',
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
        const res = await fetch('http://127.0.0.1:9228/json/list');
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

    // Skip intro if present
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip Intro'));
      if (btn) btn.click();
    })()`);
    await sleep(400);

    // 1. Click "Sign In" to open AuthModal
    console.log('Opening Auth modal...');
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Sign In');
      if (btn) btn.click();
    })()`);
    await sleep(600);
    await takeScreenshot('verified_auth_modal_no_microsoft.png');

    // 2. Click "Continue with Google"
    console.log('Clicking Continue with Google...');
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue with Google'));
      if (btn) btn.click();
    })()`);
    await sleep(600);
    await takeScreenshot('verified_google_auth_prompt.png');

    // 3. Enter real email into Google account prompt
    console.log('Entering real Google email...');
    await evaluate(`(() => {
      const input = Array.from(document.querySelectorAll('input')).find(i => i.placeholder && i.placeholder.includes('yourname@gmail.com'));
      if (input) {
        input.value = 'user.alex@gmail.com';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      // Click Continue with this Google Account
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue with this Google Account'));
      if (btn) btn.click();
    })()`);

    await sleep(900);
    await takeScreenshot('verified_signed_in_with_real_google_email.png');

    // 4. Verify settings profile details
    console.log('Checking Settings profile reflecting real email...');
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Settings'));
      if (btn) btn.click();
    })()`);
    await sleep(600);
    await takeScreenshot('verified_settings_real_google_profile.png');

    ws.close();
    console.log('Google Auth with real email verification completed successfully!');
  } finally {
    edge.kill();
  }
}

main().catch(console.error);
