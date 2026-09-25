# ⚔️ Sorting Battle Arena – Interactive Dataset Sorting Platform (Enhanced V2)

> **Design & Analysis of Algorithms (DAA) Laboratory Project — 2026 Academic Edition**
>
> A commercial-grade, scroll-based interactive sorting platform with automated 60 FPS duel animations, 0.1× to 10× speed controls, empirical performance analytics, and conditional dataset exports.

---

## 🌟 Enhanced V2 Experience & Architecture

- **🌊 Scroll-Based Storytelling Experience**: Traditional top navigation has been completely eliminated. The user journey progresses naturally across seamless, reactive sections inspired by Apple, Linear, and Stripe.
- **⚡ Automatic Battle Launch**: No extra "Run" buttons. Selecting your battle mode and competitor algorithms immediately launches the interactive arena.
- **⏱️ Variable Speed Controller (0.1× to 10×)**:
  - **0.1× & 0.25×**: Ultra-slow execution specifically crafted for viva examinations to inspect every single comparison, pointer swap, and partition step.
  - **0.5×, 1×, 2×, 5×, 10×**: Real-time to hyper-speed execution for stress testing.
- **🏷️ Real-Time Current Operation Telemetry**: Every algorithm card live-streams its exact atomic action (e.g. `Comparing 34 and 18`, `Swapping 18 and 34`, `Pivot = 52`, `Merging subarrays`).
- **🛡️ 100% Pure Manual Implementations**: Zero usage of JavaScript's native `Array.prototype.sort()`. Strictly manual implementations of:
  1. Bubble Sort
  2. Selection Sort
  3. Insertion Sort
  4. Merge Sort
  5. Quick Sort (Median-of-Three pivot)
  6. Heap Sort (Binary max-heap)
- **📊 Dynamic Analytics (Selected Algorithms Only)**: After battle completion, the Performance Section dynamically displays tables and Recharts bar charts **exclusively for the algorithms that ran**.
- **💾 Strict Conditional Download Policy**:
  - **Manual Input**: `❌ Download Disabled`
  - **Random Generator**: `❌ Download Disabled`
  - **File Upload (`.xlsx`, `.csv`, `.txt`)**: `✅ Enabled` — output file format matches uploaded file (Excel $\to$ `.xlsx`, CSV $\to$ `.csv`, Text $\to$ `.txt`).
- **🎓 Interactive Complexity Explorer**: Hoverable/clickable asymptotic cards with Best/Avg/Worst/Space bounds, algorithmic paradigms, "How it works", and real-world industrial deployments.
- **📜 Session Audit History**: Logs past battles and only offers "Download Again" if the session originated from an uploaded dataset.

---

## 🏗️ Folder Structure

```
sorting-battle-arena/
├── frontend/                               # React (Vite) + Tailwind CSS + Framer Motion
│   ├── src/
│   │   ├── components/
│   │   │   ├── HeroSection.jsx             # Animated hero with single Start Sorting CTA
│   │   │   ├── InputSection.jsx            # 3 Cards: Manual, Generator, File Dropzone
│   │   │   ├── BattleModeSection.jsx       # Single, Duel (1v1), Multi modes + Checkbox cards
│   │   │   ├── BattleArenaSection.jsx      # Auto-starting arena, 0.1x-10x slider, live ops
│   │   │   ├── PerformanceSection.jsx      # Dynamic tables & Recharts charts (selected only)
│   │   │   ├── ComplexitySection.jsx       # Interactive Big-O cards & real-world use cases
│   │   │   ├── HistorySection.jsx          # Session audit logs with conditional download
│   │   │   ├── MouseGlow.jsx               # Cursor-following radial light & mesh orbs
│   │   │   └── Toast.jsx                   # Modern notification system
│   │   ├── services/
│   │   │   └── api.js                      # Axios client with multi-algorithm payload support
│   │   ├── utils/
│   │   │   ├── datasetGenerators.js        # Random, sorted, reverse, nearly sorted, duplicates
│   │   │   └── sortingAlgorithms.js        # Client-side 60 FPS visual frame generator
│   │   ├── App.jsx                         # Scroll-based master container
│   │   ├── index.css                       # Tailwind tokens, glassmorphism, mesh bg
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js                      # Port 5173 with /api proxy to port 5000
│   ├── vercel.json                         # Vercel deployment rewrite rules
│   └── package.json
│
├── backend/                                # Node.js + Express + Multer + SheetJS (XLSX)
│   ├── algorithms/
│   │   ├── bubbleSort.js                   # Optimized manual Bubble Sort
│   │   ├── selectionSort.js                # Manual Selection Sort
│   │   ├── insertionSort.js                # Adaptive manual Insertion Sort
│   │   ├── mergeSort.js                    # Stable O(N log N) Divide & Conquer
│   │   ├── quickSort.js                    # Median-of-3 partition Quick Sort
│   │   ├── heapSort.js                     # In-place Binary Heap Sort
│   │   └── index.js                        # Unified runner
│   ├── controllers/
│   │   └── sortingController.js            # Multi-algorithm sort & conditional export
│   ├── middleware/
│   │   └── upload.js                       # Multer 25MB disk storage & mime validation
│   ├── routes/
│   │   └── sortingRoutes.js                # Express API endpoints
│   ├── utils/
│   │   ├── analyzer.js                     # Dataset entropy & heuristic predictor
│   │   └── fileProcessor.js                # XLSX, CSV, and TXT parsing & generators
│   ├── uploads/                            # Temporary staging
│   ├── outputs/                            # Generated downloadable sorted files
│   ├── server.js                           # Express entrypoint on port 5000
│   ├── render.yaml                         # Render cloud deployment configuration
│   └── package.json
│
├── sample_datasets/                        # Ready-to-use testing datasets
│   ├── student_scores.xlsx                 # Multi-column Excel with duplicates
│   ├── ecommerce_prices.csv                # E-commerce CSV dataset
│   └── sensor_data.txt                     # Text numeric dataset
│
├── package.json                            # Workspace root convenience scripts
└── README.md                               # Complete documentation
```

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/sorting-battle-arena.git
cd sorting-battle-arena

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Run Locally in Development Mode

**Terminal 1 — Backend (Port 5000):**
```bash
cd backend
npm start
```

**Terminal 2 — Frontend (Port 5173):**
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Payload / Query |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Upload `.xlsx`, `.xls`, `.csv`, `.txt` file | Multipart `dataset` file |
| `POST` | `/api/extract` | Extract column numbers from sheet | `{ fileId, sheetName, columnIndex }` |
| `POST` | `/api/analyze` | Pre-analyze dataset distribution & predict best algorithm | `{ numbers: [...] }` |
| `POST` | `/api/sort` | Run Single, Duel, or Multi sort with conditional file generation | `{ numbers, fileId, originalFilename, algorithms, mode, inputType, order }` |
| `GET` | `/api/download/:filename` | Stream generated sorted output file | `:filename` |
| `GET` | `/api/history` | Retrieve recent battle audit logs | — |
| `GET` | `/api/health` | Backend status & version health check | — |

---

## 🔬 Algorithmic Reference & Viva Notes

| Algorithm | Best ($\Omega$) | Average ($\Theta$) | Worst ($O$) | Space (Auxiliary) | Stability | Real-World Application |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Bubble Sort** | $O(N)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ | **Stable** | Educational visualizations; testing if arrays are already sorted |
| **Selection Sort** | $O(N^2)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ | **Unstable** | Flash memory / EEPROMs with expensive write cycles ($N-1$ swaps) |
| **Insertion Sort** | $O(N)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ | **Stable** | Small partitions ($N \le 30$) in hybrid TimSort and streaming inputs |
| **Merge Sort** | $O(N \log N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(N)$ | **Stable** | External disk sorting, tape drives, relational database joins |
| **Quick Sort** | $O(N \log N)$ | $O(N \log N)$ | $O(N^2)$ | $O(\log N)$ | **Unstable** | Default in-memory sort in C runtime, V8 JS engine, OS kernels |
| **Heap Sort** | $O(N \log N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(1)$ | **Unstable** | Priority queues, safety-critical real-time systems needing guaranteed $O(1)$ space |

---

## 🌐 Production Deployment

- **Frontend (Vercel)**: Configured in `frontend/vercel.json` with SPA rewrite rules. Set `VITE_API_URL` to your Render backend URL.
- **Backend (Render)**: Configured in `backend/render.yaml` with build command `npm install` and start command `npm start`.
