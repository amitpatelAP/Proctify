# Proctify - Advanced AI Proctoring System 🛡️

Proctify is a high-end, Next.js-based prototype for a modern, secure online examination environment. Built with a premium dark-mode glassmorphism aesthetic, it demonstrates what a state-of-the-art enterprise proctoring platform should look and feel like, complete with real-time AI computer vision running directly in the browser.

## 🚀 Key Features

### 1. Real-Time AI Detection (TensorFlow.js)
The live exam interface uses real machine learning models executing on the client's GPU via WebGL, ensuring zero server latency and maximum privacy:
* **Face Detection (`@tensorflow-models/blazeface`)**: 
  * Detects if the student looks away or leaves the frame ("No face detected").
  * Flags the exam if a friend sits next to them ("Multiple faces detected").
* **Object Detection (`@tensorflow-models/coco-ssd`)**:
  * Actively scans the webcam feed for forbidden objects.
  * Immediately triggers a high-risk alert if a "cell phone", "laptop", or "book" is detected in the frame.

### 2. Browser Lockdown & Fullscreen Enforcement
* Automatically attempts to force the browser into Fullscreen mode when the exam starts.
* Listens to the `fullscreenchange` API. If the student presses `ESC` or attempts to switch tabs, a massive warning screen immediately overlays and blocks the exam until they return to fullscreen mode.

### 3. Comprehensive Role-Based Dashboards
Includes a dummy authentication state (powered by Zustand) to easily toggle between three perspectives:
* **🎓 Student**: Pre-exam system diagnostics, live test environment (MCQ, Subjective, and Coding questions), and real-time AI bounding box overlays.
* **👁️ Proctor**: A live grid layout monitoring multiple student feeds simultaneously, featuring an alert sidebar for real-time violation logs.
* **🏢 Admin**: An enterprise-level console for viewing global analytics, configuring security protocols, and managing institutions.

### 4. Premium UI / UX
* Built with **Tailwind CSS v4** utilizing custom CSS variables for a cohesive dark theme.
* Smooth micro-animations and route transitions powered by **Framer Motion**.
* Consistent, clean iconography via **Lucide React**.
* Includes a persistent floating support Chatbot for automated student assistance.

## 🛠️ Tech Stack
* **Framework**: Next.js (App Router)
* **Styling**: Tailwind CSS, Framer Motion
* **State Management**: Zustand
* **Machine Learning**: TensorFlow.js (BlazeFace, COCO-SSD)
* **Icons**: Lucide React

## ▲ Vercel Compatible
This project is **100% Vercel-compatible** out of the box. Because it's built natively with Next.js, you can deploy it to a live production URL in seconds with zero configuration required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FamitpatelAP%2FProctify)

## 💻 Getting Started

To run the platform locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **View the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

*(Make sure to allow Camera and Microphone permissions in your browser to test the live AI detection features!)*
