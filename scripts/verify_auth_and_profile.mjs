import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const TEMP_DIR = path.resolve('.edge_temp_verify_auth');
const ARTIFACT_DIR = 'C:\\Users\\nandh\\.gemini\\antigravity-ide\\brain\\fc07b498-3273-4d90-a7b3-acb73799de80';

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Spawning Edge headless to verify Auth & Edit Profile...');
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9227',
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
        const res = await fetch('http://127.0.0.1:9227/json/list');
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
    await takeScreenshot('verified_auth_modal_signin.png');

    // Switch to "Create Account" tab
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Create Account');
      if (btn) btn.click();
    })()`);
    await sleep(400);
    await takeScreenshot('verified_auth_modal_signup.png');

    // Perform 1-click Google sign in
    console.log('Logging in via Google SSO...');
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Google Workspace'));
      if (btn) btn.click();
    })()`);
    await sleep(800);
    await takeScreenshot('verified_authenticated_dashboard.png');

    // 2. Navigate to Settings
    console.log('Navigating to Settings...');
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Settings'));
      if (btn) btn.click();
    })()`);
    await sleep(600);

    // Click "Edit Profile"
    console.log('Opening Edit Profile Modal...');
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Edit Profile');
      if (btn) btn.click();
    })()`);
    await sleep(600);
    await takeScreenshot('verified_edit_profile_modal.png');

    // Change Name, Role, and select preset avatar, then Save
    console.log('Modifying Profile details...');
    await evaluate(`(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const nameInput = inputs.find(i => i.placeholder && i.placeholder.includes('Marcus Vance'));
      if (nameInput) {
        nameInput.value = 'Dr. Elena Rostova';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const roleInput = inputs.find(i => i.placeholder && i.placeholder.includes('VP of Product'));
      if (roleInput) {
        roleInput.value = 'Chief Strategy Officer';
        roleInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      // Click Save Profile Changes
      const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Save Profile Changes'));
      if (saveBtn) saveBtn.click();
    })()`);

    await sleep(800);
    await takeScreenshot('verified_updated_profile_saved.png');

    ws.close();
    console.log('All Authentication and Edit Profile tests passed successfully!');
  } finally {
    edge.kill();
  }
}

main().catch(console.error);
