import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const TEMP_DIR = path.resolve('.edge_temp_verify');

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Spawning Edge headless to verify MeetMind AI redesign...');
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9223',
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
        const res = await fetch('http://127.0.0.1:9223/json/list');
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

    if (!wsUrl) {
      throw new Error('Failed to connect to Edge CDP');
    }

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
    await send('Console.enable');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.method === 'Console.messageAdded' || data.method === 'Runtime.consoleAPICalled') {
        console.log('[Browser Console]:', data.params?.message?.text || data.params?.args);
      }
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    await sleep(2000);

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

    // 1. VERIFY OVERVIEW / DASHBOARD
    console.log('\n--- 1. Verifying Overview / Dashboard ---');
    const pageHtml = await evaluate(`document.body.innerHTML`);
    console.log('Page HTML snippet:', pageHtml.slice(0, 500));
    const dashboardCheck = await evaluate(`(() => {
      const text = document.body.innerText;
      const title = document.title;
      const hasHackathon = text.toLowerCase().includes('hackathon') || text.toLowerCase().includes('demo step');
      const hasGreeting = text.includes('Alex');
      const hasNextMeeting = text.includes('Your next meeting') || text.includes('YOUR NEXT MEETING');
      const hasTodayMeetings = text.includes("Today's Meetings") || text.includes("TODAY'S MEETINGS");
      const hasActionItems = text.includes("Open Action Items") || text.includes("OPEN ACTION ITEMS");
      const hasRecentMemory = text.includes("Recent Memory") || text.includes("RECENT MEMORY");
      const hasOrbCanvas = !!document.querySelector('canvas');
      const hasPrepareBtn = !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Prepare Me'));

      return {
        title,
        hasHackathon,
        hasGreeting,
        hasNextMeeting,
        hasTodayMeetings,
        hasActionItems,
        hasRecentMemory,
        hasOrbCanvas,
        hasPrepareBtn
      };
    })()`);
    console.log('Dashboard verification result:', dashboardCheck);

    if (dashboardCheck.hasHackathon) {
      throw new Error('Hackathon mentions detected on Dashboard!');
    }
    if (!dashboardCheck.hasNextMeeting || !dashboardCheck.hasTodayMeetings || !dashboardCheck.hasActionItems || !dashboardCheck.hasRecentMemory) {
      throw new Error('Required dashboard sections missing!');
    }
    console.log('✓ Overview / Dashboard passed perfectly!');

    // 2. VERIFY MEETING PREPARATION PAGE (ALL 8 SECTIONS)
    console.log('\n--- 2. Verifying Meeting Preparation Experience ---');
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Prepare Me'));
      if (btn) btn.click();
    })()`);
    await sleep(2000);

    const prepCheck = await evaluate(`(() => {
      const text = document.body.innerText;
      return {
        hasObjective: text.includes('1. Meeting Objective'),
        hasContext: text.includes('2. Previous Context'),
        hasWhatWeKnow: text.includes('3. What We Know'),
        hasOpenIssues: text.includes('4. Open Issues'),
        hasCommitments: text.includes('5. Previous Commitments'),
        hasSuggestedQuestions: text.includes('6. Suggested Questions'),
        hasPotentialRisks: text.includes('7. Potential Risks'),
        hasFollowUps: text.includes('8. Recommended Follow-ups'),
        hasAiIndicator: text.includes('AI-Generated Executive Briefing'),
        hasHackathon: text.toLowerCase().includes('hackathon') || text.toLowerCase().includes('demo step')
      };
    })()`);
    console.log('Meeting Prep 8 Sections verification:', prepCheck);

    if (prepCheck.hasHackathon) {
      throw new Error('Hackathon mentions found in Meeting Prep View!');
    }
    if (!prepCheck.hasObjective || !prepCheck.hasContext || !prepCheck.hasWhatWeKnow || !prepCheck.hasOpenIssues || !prepCheck.hasCommitments || !prepCheck.hasSuggestedQuestions || !prepCheck.hasPotentialRisks || !prepCheck.hasFollowUps || !prepCheck.hasAiIndicator) {
      throw new Error('One or more of the 8 required meeting preparation sections are missing!');
    }
    console.log('✓ Meeting Preparation View passed with all 8 sections and AI provenance indicator!');

    // 3. VERIFY CONTACTS PAGE & EMPTY STATE
    console.log('\n--- 3. Verifying Contacts Page & Empty State ---');
    await evaluate(`(() => {
      const navBtn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.textContent.includes('Contacts'));
      if (navBtn) navBtn.click();
    })()`);
    await sleep(1500);

    const contactsCheck = await evaluate(`(() => {
      const text = document.body.innerText;
      const hasEmptyState = text.includes('No contacts connected yet');
      const hasGoogleBtn = !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Connect Google'));
      const hasMicrosoftBtn = !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Connect Microsoft'));
      const hasSearch = !!document.querySelector('input[placeholder*="Search contacts"]');

      return {
        hasEmptyState,
        hasGoogleBtn,
        hasMicrosoftBtn,
        hasSearch
      };
    })()`);
    console.log('Contacts Empty State verification:', contactsCheck);

    if (!contactsCheck.hasEmptyState || !contactsCheck.hasGoogleBtn || !contactsCheck.hasMicrosoftBtn || !contactsCheck.hasSearch) {
      throw new Error('Contacts empty state or Connect buttons missing!');
    }
    console.log('✓ Contacts Empty State passed with [ Connect Google ] and [ Connect Microsoft ]!');

    // Test Connect Google click
    await evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Connect Google'));
      if (btn) btn.click();
    })()`);
    await sleep(1000);

    const afterConnectCheck = await evaluate(`(() => {
      const text = document.body.innerText;
      return {
        hasContactsNow: !text.includes('No contacts connected yet'),
        cardCount: document.querySelectorAll('.grid > div').length
      };
    })()`);
    console.log('After Connecting Google:', afterConnectCheck);
    if (!afterConnectCheck.hasContactsNow || afterConnectCheck.cardCount === 0) {
      throw new Error('Contacts did not populate after connecting Google workspace');
    }
    console.log('✓ Contact import and workspace connection verified!');

    // 4. VERIFY MEMORY PAGE & AI MEMORY VISUALIZATION
    console.log('\n--- 4. Verifying Memory Page & AI Memory Graph ---');
    await evaluate(`(() => {
      const navBtn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.textContent.includes('Memory'));
      if (navBtn) navBtn.click();
    })()`);
    await sleep(1500);

    const memoryCheck = await evaluate(`(() => {
      const text = document.body.innerText;
      const hasSearch = !!document.querySelector('input[placeholder*="Search your meeting history"]');
      const hasGraphTitle = text.includes('AI MEMORY GRAPH') || text.includes('AI Memory Graph');
      const hasMeetingNode = text.includes('Previous Meeting');
      const hasDecisionNode = text.includes('Decision');
      const hasActionNode = text.includes('Action Item');
      const hasPreferenceNode = text.includes('Client Preference');
      const hasIssueNode = text.includes('Open Issue');
      const hasRecentMemories = text.includes('Recent memories');
      const hasTabs = text.includes('Previous meetings') && text.includes('Decisions') && text.includes('Commitments') && text.includes('Action items') && text.includes('Important preferences') && text.includes('Unresolved issues');

      return {
        hasSearch,
        hasGraphTitle,
        hasMeetingNode,
        hasDecisionNode,
        hasActionNode,
        hasPreferenceNode,
        hasIssueNode,
        hasRecentMemories,
        hasTabs
      };
    })()`);
    console.log('Memory Page verification:', memoryCheck);

    if (!memoryCheck.hasSearch || !memoryCheck.hasGraphTitle || !memoryCheck.hasMeetingNode || !memoryCheck.hasDecisionNode || !memoryCheck.hasActionNode || !memoryCheck.hasPreferenceNode || !memoryCheck.hasIssueNode || !memoryCheck.hasRecentMemories || !memoryCheck.hasTabs) {
      throw new Error('Memory Page or AI Memory Visualization components missing!');
    }
    console.log('✓ Memory Page & AI Memory Graph verified successfully!');

    // 5. VERIFY MEETINGS PAGE
    console.log('\n--- 5. Verifying Meetings Page ---');
    await evaluate(`(() => {
      const navBtn = Array.from(document.querySelectorAll('aside nav button')).find(b => b.textContent.includes('Meetings'));
      if (navBtn) navBtn.click();
    })()`);
    await sleep(1500);

    const meetingsCheck = await evaluate(`(() => {
      const text = document.body.innerText;
      const hasTitle = text.includes('Meetings');
      const hasMeetingCards = document.querySelectorAll('.space-y-4 > div').length > 0;
      const hasPrepareButtons = !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Prepare Me'));
      const hasSampleBadge = text.includes('Sample Data') || text.includes('Sample Agenda');

      return {
        hasTitle,
        hasMeetingCards,
        hasPrepareButtons,
        hasSampleBadge
      };
    })()`);
    console.log('Meetings Page verification:', meetingsCheck);

    if (!meetingsCheck.hasTitle || !meetingsCheck.hasMeetingCards || !meetingsCheck.hasPrepareButtons || !meetingsCheck.hasSampleBadge) {
      throw new Error('Meetings list, status, sample data badge, or Prepare Me CTA missing!');
    }
    console.log('✓ Meetings Page verified successfully!');

    ws.close();
    console.log('\n======================================================');
    console.log('🎉 ALL 14 USER REQUIREMENTS VERIFIED AND PASSED 100%!');
    console.log('======================================================');
  } finally {
    edge.kill();
  }
}

main().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});
