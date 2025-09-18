# CogniInsight: Student Cognitive Skills Analytics Dashboard

CogniInsight is an advanced analytics platform designed to transform educational data into actionable insights. This powerful dashboard enables educators and administrators to monitor, analyze, and enhance student learning experiences through comprehensive cognitive skill assessment and performance tracking.

## 🔍 Project Description

CogniInsight provides a centralized platform for tracking key learning metrics including comprehension, attention, focus, retention, and engagement time. By visualizing complex educational data through intuitive charts and interactive components, it helps educational institutions make data-driven decisions to improve student outcomes.

Key aspects of the project include:
- Real-time visualization of student cognitive skills
- Individual and class-level performance analytics
- Identification of learning patterns and trends
- Data-driven insights for personalized learning approaches

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview
CogniInsight is a data visualization dashboard designed to help educators and administrators track and analyze student cognitive skills. The dashboard provides insights into various learning metrics including comprehension, attention, focus, retention, and engagement time.

## ✨ Features

- **Interactive Student Table**
  - Sort, filter, and search through student records
  - Quick view of key metrics

- **Skills Radar Chart**
  - Visual representation of individual student skills
  - Compare different cognitive metrics at a glance

- **Performance Analytics**
  - Track student performance over time
  - Identify learning patterns and trends

- **Persona Distribution**
  - Categorize students based on learning styles
  - Identify different learning personas in the classroom

## 🛠 Tech Stack

- **Frontend**: Next.js 13+ (React)
- **Charts**: Chart.js with react-chartjs-2
- **Styling**: Tailwind CSS
- **Data Management**: React Hooks
- **Build Tool**: Vite
- **Deployment**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites
- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/cogniinsight-dashboard.git
   cd cogniinsight-dashboard
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
│   ├── StudentTable.js  # Student data table
│   ├── SkillsRadar.js   # Radar chart component
│   ├── PerformanceChart.js
│   └── ...
├── context/             # React context providers
├── public/              # Static files
│   └── data/            # Sample student data
└── utils/               # Utility functions
```

## 🖥️ Usage

1. **Viewing Student Data**
   - Browse through the student list
   - Click on a student to view detailed metrics
   - Use search and filters to find specific students

2. **Analyzing Performance**
   - Check the performance chart for trends
   - Review the skills radar for individual assessments
   - Explore the correlation heatmap for insights

## 📸 Screenshots

### 1. Dashboard Overview
![Dashboard Overview](./Screenshot%202025-09-18%20at%2009.36.00.png)  
*Main dashboard view showing student list and key metrics*

### 2. Student Skills Radar
![Skills Radar](./Screenshot%202025-09-18%20at%2009.36.20.png)  
*Interactive radar chart showing individual student skills*

### 3. Performance Analytics
![Performance Analytics](./Screenshot%202025-09-18%20at%2009.36.47.png)  
*Performance trends and analytics over time*


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by [Gaduputi Udaykiran]
</div>
