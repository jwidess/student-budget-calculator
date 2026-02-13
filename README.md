# WIP - Student Budget Calculator
### THIS IS A WIP WITH HEAVY RELIANCE ON AI CODE GENERATION. EXPECT BUGS AND INCONSISTENCIES. USE WITH CAUTION.

A visual budget planning tool designed for students to track income, expenses, and project their financial future. See your cash balance fluctuate over time with interactive charts and get warnings before you run out of money.

![Student Budget Calculator](https://img.shields.io/badge/React-19.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Vite](https://img.shields.io/badge/Vite-7.3-purple)

## Features

### 💰 Income Tracking
- **Recurring Income**: Part-time jobs with configurable hours, hourly rate, and pay frequency (weekly/biweekly/monthly)
- **One-Time Income**: Tax refunds, stipends, gifts, and other non-recurring income

### 💸 Expense Management
- **Monthly Expenses**: Rent, utilities, subscriptions with automatic monthly recurrence
- **One-Time Expenses**: Tuition payments, textbooks, electronics
- **Food Budget**: Separate weekday meal costs (breakfast/lunch/dinner/snacks) and weekend daily totals
- **Commuting Costs**: 
  - Auto transit with miles driven, MPG, and fuel cost calculations
  - Public transit with weekly pass costs

### 📊 Visual Projections
- **Cash Balance Chart**: Interactive time-series chart showing daily balance over your projection period
- **Income vs Expense Chart**: Monthly aggregated bar chart comparing total income and expenses
- **Warning System**: Header banner alerts you when projections show negative balance, with specific date and deficit amount

### 💾 Data Persistence
- All data automatically saved to browser localStorage
- No account needed, no server required
- Reset to defaults with one click

## How It Works

The app runs a **day-by-day financial simulation** starting from your current balance:

1. **Input Configuration**: Enter your starting balance, income sources, and all expenses
2. **Projection Engine**: The engine (`src/engine/projection.ts`) simulates each day:
   - Adds recurring income on calculated paydays (weekly/biweekly/monthly)
   - Adds one-time income on specified dates
   - Subtracts recurring expenses on the specified day of each month
   - Subtracts one-time expenses on specified dates
   - Calculates daily food costs (weekday meals + weekend totals)
   - Calculates daily commuting costs (fuel for miles driven + prorated public transit)
3. **Balance Tracking**: Each day's ending balance becomes the next day's starting balance
4. **Danger Detection**: Identifies the first day (if any) when balance goes negative
5. **Chart Rendering**: Recharts visualizes the daily snapshots with smart sampling for performance

The entire state is managed by **Zustand** with localStorage persistence, so your budget survives browser refreshes.

## Tech Stack

- **React 19** + **TypeScript** - Type-safe component architecture
- **Vite 7** - Lightning-fast dev server and build tool
- **Tailwind CSS 4** - Utility-first styling with CSS variables for theming
- **Recharts 3** - Composable charting library for React
- **Zustand 5** - Lightweight state management with middleware
- **dnd-kit** - Accessible drag-and-drop toolkit
- **date-fns** - Modern date utility library
- **Lucide React** - Beautiful icon set

## Setup Instructions

### Prerequisites

You need **Node.js** and **npm** installed.

#### Check if you have Node.js:
```bash
node --version
npm --version
```

If not installed:
- **Windows**: Download from [nodejs.org](https://nodejs.org/) and run the installer
- **Linux**: Use your package manager:

### Installation

#### Windows (PowerShell or Command Prompt)

1. **Clone the repository**:
   ```powershell
   git clone https://github.com/jwidess/student-budget-calculator.git
   cd student-budget-calculator
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Start the development server**:
   ```powershell
   npm run dev
   ```

4. **Open in browser**: Navigate to the URL shown in the terminal (usually `http://localhost:5173`)

#### Linux (Bash)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jwidess/student-budget-calculator.git
   cd student-budget-calculator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**: Navigate to the URL shown in the terminal (usually `http://localhost:5173`)


## Project Structure

```
src/
├── components/
│   ├── charts/          # Recharts visualizations
│   ├── dashboard/       # Summary cards and warning banner
│   └── inputs/          # All form components (income, expenses, food, transport)
├── engine/
│   ├── types.ts         # TypeScript interfaces for all data models
│   └── projection.ts    # Day-by-day financial simulation logic
├── hooks/
│   └── useProjection.ts # Memoized projection results from Zustand state
├── store/
│   └── budgetStore.ts   # Zustand store with localStorage persistence
├── lib/
│   └── utils.ts         # Helper utilities
├── App.tsx              # Main layout and routing
└── index.css            # Tailwind CSS with theme variables
```

## Usage Tips

1. **Start Simple**: Begin with just your initial balance and one income source
2. **Add Expenses Gradually**: Start with big recurring costs (rent, utilities), then fill in details
3. **Use Drag Handles**: Reorder items by grabbing the grip icon (⋮⋮) on the left of each card
4. **Multiple Sections Open**: Click any section header to expand/collapse independently
5. **Projection Length**: Adjust how many months ahead to calculate (3-24 months)
6. **Watch the Warning Banner**: The header shows an alert if your balance will go negative
7. **Reset Anytime**: Use the reset button in the top-right to restore default values


## License

GNU Affero General Public License v3.0 

