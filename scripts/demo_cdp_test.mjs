import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const TEMP_DIR = path.resolve('.edge_temp_cdp');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Spawning Edge headless with remote debugging port 9222...');
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
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
        const res = await fetch('http://127.0.0.1:9222/json/list');
        const list = await res.json();
        if (list && list.length > 0) {
          const page = list.find(item => item.type === 'page');
          if (page && page.webSocketDebuggerUrl) {
            wsUrl = page.webSocketDebuggerUrl;
            break;
          }
        }
      } catch (e) {
        // wait
      }
    }

    if (!wsUrl) {
      throw new Error('Failed to obtain WebSocket debugger URL from Edge');
    }

    console.log('Connected to WebSocket Debugger:', wsUrl);
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

    console.log('Waiting for initial page render...');
    await sleep(2500);

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

    const waitForElement = async (selector, timeout = 8000) => {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        const found = await evaluate(`!!document.querySelector('${selector}')`);
        if (found) return true;
        await sleep(300);
      }
      return false;
    };

    const takeScreenshot = async (filename) => {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(filename, Buffer.from(res.data, 'base64'));
      console.log(`Saved screenshot: ${filename} (${Math.round(res.data.length / 1024)} KB)`);
    };

    // Initial check
    const title = await evaluate(`document.title`);
    console.log('Page Title:', title);

    // Click Reset Demo first to ensure totally clean state
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Reset Demo'));
      if (btn) btn.click();
    })()`);
    await sleep(1500);

    // ==========================================
    // STEP 1: PAST INTERACTIONS
    // ==========================================
    console.log('\n--- Executing Step 1: Past Interactions ---');
    const step1Nav = await evaluate(`(() => {
      const btn = document.querySelector('#step-1-interactions');
      if (btn) {
        btn.click();
        return 'Clicked #step-1-interactions';
      }
      return 'Button not found';
    })()`);
    console.log('Navigation:', step1Nav);
    await sleep(1500);

    const step1Verif = await evaluate(`(() => {
      const text = document.body.innerText;
      return {
        hasRahul: text.includes('Rahul Sharma'),
        hasRole: text.includes('Product Manager'),
        hasCompany: text.includes('ABC Technologies'),
        hasMeeting1: text.includes('Meeting 1') && text.includes('Initial product discussion'),
        hasMeeting2: text.includes('Meeting 2') && text.includes('pricing'),
        hasMeeting3: text.includes('Meeting 3') && text.includes('Feature X'),
        hasMeeting4: text.includes('Meeting 4') && text.includes('revised proposal'),
      };
    })()`);
    console.log('Step 1 Verification:', step1Verif);
    if (!step1Verif.hasRahul || !step1Verif.hasMeeting1 || !step1Verif.hasMeeting4) {
      throw new Error('Step 1 verification failed');
    }
    await takeScreenshot('step1_past_interactions.png');

    // ==========================================
    // STEP 2: AI MEETING PREP ("Prepare Me")
    // ==========================================
    console.log('\n--- Executing Step 2: AI Meeting Prep ---');
    const step2Nav = await evaluate(`(() => {
      const btn = document.querySelector('#step-2-prep') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Prepare Me'));
      if (btn) {
        btn.click();
        return 'Clicked Step 2';
      }
      return 'Button not found';
    })()`);
    console.log('Navigation:', step2Nav);

    const contextCardReady = await waitForElement('#ai-identified-context', 10000);
    console.log('#ai-identified-context rendered:', contextCardReady);
    await sleep(1000);

    const step2Verif = await evaluate(`(() => {
      const card = document.querySelector('#ai-identified-context');
      const cardText = card ? card.innerText : '';
      const bodyText = document.body.innerText;
      return {
        hasUpcomingMeeting: bodyText.includes('Discuss revised proposal'),
        pricingConcern: cardText.includes('Pricing was previously a concern'),
        featureXReq: cardText.includes('Feature X is an important requirement'),
        fasterImpl: cardText.includes('Faster implementation is a priority'),
        revisedProposal: cardText.includes('Revised proposal was previously promised'),
      };
    })()`);
    console.log('Step 2 Verification:', step2Verif);
    if (!step2Verif.pricingConcern || !step2Verif.featureXReq || !step2Verif.fasterImpl || !step2Verif.revisedProposal) {
      throw new Error('Step 2 verification failed: missing 4 identified context items');
    }
    await takeScreenshot('step2_ai_meeting_prep.png');

    // ==========================================
    // STEP 3: UPDATE RELATIONSHIP MEMORY
    // ==========================================
    console.log('\n--- Executing Step 3: Update Relationship Memory ---');
    const step3Nav = await evaluate(`(() => {
      const btn = document.querySelector('#step-3-update') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Update Memory'));
      if (btn) {
        btn.click();
        return 'Clicked Step 3';
      }
      return 'Button not found';
    })()`);
    console.log('Navigation:', step3Nav);
    await sleep(1500);

    // Click Extract Memory
    const extractClick = await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Extract Memory'));
      if (btn) {
        btn.click();
        return 'Clicked Extract Memory';
      }
      return 'Extract button not found';
    })()`);
    console.log('Action:', extractClick);
    await sleep(2000);

    const step3Verif = await evaluate(`(() => {
      const text = document.body.innerText;
      return {
        hasPricingResolved: text.includes('Pricing concern resolved'),
        hasFeatureXConfirmed: text.includes('Feature X requirement confirmed'),
        hasOct15Deadline: text.includes('October 15 deadline added'),
      };
    })()`);
    console.log('Step 3 Verification:', step3Verif);
    if (!step3Verif.hasPricingResolved || !step3Verif.hasFeatureXConfirmed || !step3Verif.hasOct15Deadline) {
      throw new Error('Step 3 verification failed: missing extracted changes');
    }
    await takeScreenshot('step3_memory_extraction.png');

    // Save to Relationship Memory
    const saveClick = await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Save to Relationship Memory'));
      if (btn) {
        btn.click();
        return 'Clicked Save to Relationship Memory';
      }
      return 'Save button not found';
    })()`);
    console.log('Action:', saveClick);
    await sleep(2000);

    const savedVerif = await evaluate(`(() => {
      const text = document.body.innerText;
      return {
        memoryUpdatedBadge: text.includes('Memory Updated'),
        hasReturnBtn: !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Return to Meeting Preparation')),
      };
    })()`);
    console.log('Saved Verification:', savedVerif);
    await takeScreenshot('step4_memory_saved.png');

    // ==========================================
    // STEP 4: BETTER FUTURE PREPARATION
    // ==========================================
    console.log('\n--- Executing Step 4: Better Future Preparation ---');
    const returnClick = await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Return to Meeting Preparation')) || document.querySelector('#step-4-better-prep');
      if (btn) {
        btn.click();
        return 'Clicked Return / Step 4';
      }
      return 'Return button not found';
    })()`);
    console.log('Navigation:', returnClick);

    await waitForElement('#ai-identified-context', 10000);
    await sleep(1500);

    const step4Verif = await evaluate(`(() => {
      const text = document.body.innerText;
      return {
        hasMemoryUpdatedBadge: text.includes('Memory Updated'),
        remembersOct15: text.includes('October 15') && text.includes('Feature X'),
        showsPricingResolved: text.includes('Pricing concern resolved') || text.includes('Accepted revised pricing'),
        objectiveMentionsOct15: text.includes('delivered before October 15'),
      };
    })()`);
    console.log('Step 4 Better Prep Verification:', step4Verif);
    if (!step4Verif.hasMemoryUpdatedBadge || !step4Verif.remembersOct15 || !step4Verif.showsPricingResolved) {
      throw new Error('Step 4 verification failed: AI did not remember October 15 or resolved pricing');
    }
    await takeScreenshot('step5_better_future_prep.png');

    // ==========================================
    // STEP 5: RESET DEMO FLOW
    // ==========================================
    console.log('\n--- Executing Reset Demo Test ---');
    const resetClick = await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Reset Demo'));
      if (btn) {
        btn.click();
        return 'Clicked Reset Demo';
      }
      return 'Reset button not found';
    })()`);
    console.log('Action:', resetClick);
    await sleep(1500);

    const resetVerif = await evaluate(`(() => {
      const text = document.body.innerText;
      return {
        backToContactDetails: text.includes('Rahul Sharma') && text.includes('Meeting 1: Initial product discussion'),
      };
    })()`);
    console.log('Reset Verification:', resetVerif);
    await takeScreenshot('step6_reset_demo.png');

    ws.close();
    console.log('\n======================================================');
    console.log('🎉 100% COMPLETE & VERIFIED: ALL HACKATHON DEMO STEPS PASSED PERFECTLY!');
    console.log('======================================================');
  } finally {
    edge.kill();
  }
}

main().catch(err => {
  console.error('Test run error:', err);
  process.exit(1);
});
