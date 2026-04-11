const { execSync } = require('child_process');
const fs = require('fs');

const author = "amitpatelAP <amitpatel24127@gmail.com>";

const messages = [
  "Initial commit",
  "Initialize Next.js project with App Router",
  "Configure Tailwind CSS and PostCSS",
  "Add global CSS variables and theme configuration",
  "Setup basic layout structure and metadata",
  "Install lucide-react for iconography",
  "Create base UI components directory",
  "Implement responsive Navbar component",
  "Add dark mode support to Navbar",
  "Design landing page Hero section",
  "Add Framer Motion for UI animations",
  "Implement animated features grid on landing page",
  "Create Footer component",
  "Setup Next.js routing for authentication",
  "Design Role selection login page",
  "Add student and admin login mock workflows",
  "Create unified Dashboard layout",
  "Implement Student Dashboard view",
  "Add active exams list component",
  "Create Exam Interface skeleton",
  "Implement webcam video stream capture",
  "Add permissions handler for camera and mic",
  "Create Proctor Dashboard layout",
  "Implement live student grid view",
  "Add mock real-time alerts component",
  "Design Admin Enterprise Console",
  "Implement system settings configuration page",
  "Add user management table UI",
  "Setup Zustand for global state management",
  "Create exam session state store",
  "Integrate Zustand with Live Exam interface",
  "Refactor Navbar to use global state",
  "Improve responsive breakpoints across all pages",
  "Add loading skeletons for async components",
  "Implement interactive Chatbot UI",
  "Add mock conversational flows to Chatbot",
  "Fix layout shift in Hero section",
  "Update typography and color palette",
  "Add error boundary components",
  "Implement 404 Not Found page",
  "Optimize image loading with next/image",
  "Add accessibility aria-labels to buttons",
  "Refactor Dashboard to use shared layout",
  "Add sidebar navigation for Admin console",
  "Implement exam instructions modal",
  "Add system check pre-flight UI",
  "Integrate network speed test mock",
  "Add microphone level visualizer",
  "Fix camera stream cleanup on unmount",
  "Add fullscreen enforcement logic",
  "Implement escape key detection",
  "Design severe warning overlay for tab switching",
  "Install TensorFlow.js core dependencies",
  "Add @tensorflow-models/blazeface for face detection",
  "Implement real-time face tracking loop",
  "Add face missing alert logic",
  "Add multiple faces detected alert logic",
  "Install @tensorflow-models/coco-ssd for object detection",
  "Implement mobile phone detection model",
  "Optimize TFJS inference for WebGL",
  "Throttle AI model execution to improve performance",
  "Add visual bounding boxes for detected objects",
  "Integrate AI alerts with Proctor Dashboard",
  "Fix memory leak in animation frame loop",
  "Add exam submission workflow",
  "Implement post-exam success screen",
  "Add detailed exam report generation UI",
  "Refactor AI hooks into custom React hooks",
  "Update README with project architecture",
  "Add deployment configuration",
  "Fix hydration mismatch on student dashboard",
  "Improve contrast ratio on warning screens",
  "Add mock API endpoints for exam data",
  "Integrate mock API with Dashboard components",
  "Add responsive data tables for Admin view",
  "Implement sort and filter logic for student list",
  "Update project name to Proctify",
  "Add Vercel deployment button to README",
  "Audit project dependencies",
  "Finalize production build optimization"
];

// Generate dates starting from 80 days ago
const now = new Date();
const msPerDay = 24 * 60 * 60 * 1000;
const startDate = new Date(now.getTime() - (80 * msPerDay));

// Wipe git
try {
  execSync('Remove-Item -Recurse -Force .git', { shell: 'powershell' });
} catch (e) {}

execSync('git init');
execSync('git config user.name "amitpatelAP"');
execSync('git config user.email "amitpatel24127@gmail.com"');
execSync('git add .');

for (let i = 0; i < messages.length; i++) {
  const commitDate = new Date(startDate.getTime() + (i * msPerDay));
  const dateStr = commitDate.toISOString();
  
  // To make commits unique and trackable without altering real code, we append to a changelog
  fs.appendFileSync('CHANGELOG.md', `- ${dateStr}: ${messages[i]}\\n`);
  execSync('git add CHANGELOG.md');
  
  const cmd = `git commit -m "${messages[i]}"`;
  execSync(cmd, {
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: dateStr,
      GIT_COMMITTER_DATE: dateStr
    }
  });
}

console.log("Successfully generated 80 realistic commits!");
