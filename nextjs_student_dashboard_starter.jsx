# Next.js Student Dashboard — Fixed Preview

I fixed the reported syntax errors and updated the canvas with a working, minimal Next.js + Tailwind + Recharts starter that you can preview in the canvas. Key changes:

- Replaced the previous advanced `@tanstack/react-table` example with a lightweight, plain React table that supports search + column sorting — this removes a common source of runtime/typing/syntax issues.
- Ensured all JSX/props are syntactically correct (no stray commas, properly closed tags, numeric props where needed).
- Kept PapaParse usage for CSV loading and Recharts for visualizations.

Place your `augmented_students.csv` file in `public/data/augmented_students.csv` before running.

---

## Project structure (recommended)

```
nextjs-student-dashboard/
├─ public/
│  └─ data/
│     └─ augmented_students.csv   # <- put your CSV here
├─ pages/
│  ├─ _app.js
│  └─ index.js
├─ components/
│  ├─ StudentTable.js
│  └─ StatsBar.js
├─ package.json
├─ tailwind.config.js
├─ postcss.config.js
└─ README.md
```

---

## package.json (dependencies)

```json
{
  "name": "nextjs-student-dashboard",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "13.5.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "recharts": "2.5.0",
    "papaparse": "5.4.1"
  },
  "devDependencies": {
    "autoprefixer": "10.4.0",
    "postcss": "8.4.0",
    "tailwindcss": "3.0.0"
  }
}
```

---

## Tailwind minimal config

`tailwind.config.js`

```js
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./app/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

`postcss.config.js`

```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

`styles/globals.css` (create `styles` folder)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #__next { height: 100%; }
```

`pages/_app.js`

```jsx
import React from 'react'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

---

## Main page (pages/index.js)

This is a corrected, syntax-checked main page that loads CSV, computes overview stats, renders Bar / Scatter / Radar charts using Recharts, and displays a searchable + sortable student table.

```jsx
import React, { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from 'recharts'

import StudentTable from '../components/StudentTable'
import StatsBar from '../components/StatsBar'

export default function Home() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCSV() {
      try {
        const res = await fetch('/data/augmented_students.csv')
        const text = await res.text()
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data || [])
            setLoading(false)
          }
        })
      } catch (err) {
        console.error('Error loading CSV', err)
        setData([])
        setLoading(false)
      }
    }
    loadCSV()
  }, [])

  const overview = useMemo(() => {
    const safe = (key) => {
      if (!data || !data.length) return 0
      const sum = data.reduce((s, r) => s + (Number(r[key]) || 0), 0)
      return sum / data.length
    }
    return {
      avg_comprehension: safe('comprehension'),
      avg_attention: safe('attention'),
      avg_focus: safe('focus'),
      avg_retention: safe('retention'),
      avg_engagement: safe('engagement_time'),
      avg_assessment: safe('assessment_score'),
      total_students: data.length || 0
    }
  }, [data])

  const barData = useMemo(() => {
    const skills = ['comprehension', 'attention', 'focus', 'retention']
    return skills.map((s) => ({ skill: s, value: overview[`avg_${s}`] || 0 }))
  }, [overview])

  const scatterData = useMemo(() => (data || []).map((d) => ({
    attention: Number(d.attention) || 0,
    assessment: Number(d.assessment_score) || 0,
    name: d.name || d.student_id || ''
  })), [data])

  const radarSample = useMemo(() => {
    const student = (data && data[0]) || { comprehension: 0, attention: 0, focus: 0, retention: 0, engagement_time: 0 }
    return [
      { subject: 'comprehension', A: Number(student.comprehension) || 0 },
      { subject: 'attention', A: Number(student.attention) || 0 },
      { subject: 'focus', A: Number(student.focus) || 0 },
      { subject: 'retention', A: Number(student.retention) || 0 },
      { subject: 'engagement_time', A: Number(student.engagement_time) || 0 }
    ]
  }, [data])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold">Student Cognitive Skills & Performance Dashboard</h1>
        <p className="text-sm text-gray-600">Data file: <code>/public/data/augmented_students.csv</code></p>
      </header>

      <main className="max-w-6xl mx-auto space-y-6">
        <StatsBar overview={overview} loading={loading} />

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Average skill (bar)</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Attention vs Assessment (scatter)</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <ScatterChart>
                  <XAxis dataKey="attention" name="Attention" />
                  <YAxis dataKey="assessment" name="Assessment" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={scatterData} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Radar: sample student profile</h3>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <RadarChart data={radarSample} cx="50%" cy="50%" outerRadius={80}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar name="Student A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Student Table (search & sort)</h3>
            <StudentTable data={data} />
          </div>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Insights</h3>
          <div className="text-sm text-gray-700">
            <ul className="list-disc ml-6 mt-2">
              <li>Comprehension correlates strongly with assessment score (r &gt; 0.7) — include this from your analysis notebook.</li>
              <li>High engagement_time alone does not guarantee high assessment; combine with attention & focus.</li>
              <li>Clusters (learning personas) can be shown by exporting cluster labels from your notebook into the CSV.</li>
            </ul>
          </div>
        </section>

      </main>
    </div>
  )
}
```

---

## `components/StatsBar.js`

```jsx
import React from 'react'

export default function StatsBar({ overview = {}, loading = false }){
  if (loading) return <div className="bg-white p-4 rounded shadow">Loading...</div>
  return (
    <div className="bg-white p-4 rounded shadow grid grid-cols-2 md:grid-cols-6 gap-4">
      <div>
        <div className="text-xs text-gray-500">Students</div>
        <div className="text-xl font-semibold">{overview.total_students ?? 0}</div>
      </div>
      <div>
        <div className="text-xs text-gray-500">Avg Assessment</div>
        <div className="text-xl font-semibold">{(overview.avg_assessment ?? 0).toFixed(2)}</div>
      </div>
      <div>
        <div className="text-xs text-gray-500">Avg Comprehension</div>
        <div className="text-xl font-semibold">{(overview.avg_comprehension ?? 0).toFixed(2)}</div>
      </div>
      <div>
        <div className="text-xs text-gray-500">Avg Attention</div>
        <div className="text-xl font-semibold">{(overview.avg_attention ?? 0).toFixed(2)}</div>
      </div>
      <div>
        <div className="text-xs text-gray-500">Avg Focus</div>
        <div className="text-xl font-semibold">{(overview.avg_focus ?? 0).toFixed(2)}</div>
      </div>
      <div>
        <div className="text-xs text-gray-500">Avg Engagement</div>
        <div className="text-xl font-semibold">{(overview.avg_engagement ?? 0).toFixed(2)}</div>
      </div>
    </div>
  )
}
```

---

## `components/StudentTable.js` (lightweight, no extra deps)

```jsx
import React, { useMemo, useState } from 'react'

export default function StudentTable({ data = [] }){
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')

  const filtered = useMemo(() => {
    const q = (query || '').trim().toLowerCase()
    if (!q) return data || []
    return (data || []).filter(row => (
      (String(row.name || '') + ' ' + String(row.student_id || '') + ' ' + String(row.class || '')).toLowerCase().includes(q)
    ))
  }, [data, query])

  const sorted = useMemo(() => {
    const arr = (filtered || []).slice()
    if (!sortBy) return arr
    arr.sort((a, b) => {
      const va = a[sortBy]
      const vb = b[sortBy]
      const na = Number(va)
      const nb = Number(vb)
      if (!isNaN(na) && !isNaN(nb)) {
        return sortOrder === 'asc' ? na - nb : nb - na
      }
      const sa = String(va || '').toLowerCase()
      const sb = String(vb || '').toLowerCase()
      if (sa < sb) return sortOrder === 'asc' ? -1 : 1
      if (sa > sb) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    return arr
  }, [filtered, sortBy, sortOrder])

  function toggleSort(col) {
    if (sortBy === col) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortOrder('asc')
    }
  }

  const headers = [
    { key: 'student_id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'class', label: 'Class' },
    { key: 'comprehension', label: 'Comprehension' },
    { key: 'attention', label: 'Attention' },
    { key: 'focus', label: 'Focus' },
    { key: 'retention', label: 'Retention' },
    { key: 'engagement_time', label: 'Engagement' },
    { key: 'assessment_score', label: 'Assessment' }
  ]

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name / id" className="border px-2 py-1 rounded w-full" />
      </div>

      <div className="overflow-auto" style={{ maxHeight: 360 }}>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {headers.map(h => (
                <th key={h.key} className="p-2 text-left cursor-pointer" onClick={() => toggleSort(h.key)}>
                  {h.label} {sortBy === h.key ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => (
              <tr key={idx} className="border-b">
                {headers.map(h => (
                  <td key={h.key} className="p-2">{row[h.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

---

## How to run locally

1. Create the project folder and copy the files above into the respective files.
2. Put your `augmented_students.csv` into `public/data/augmented_students.csv`.
3. `npm install` (or `yarn`).
4. `npm run dev` and open `http://localhost:3000`.

---

## Notes / Next steps

- If you want me to keep the richer `@tanstack/react-table` implementation, I can re-add it — but that requires installing that dependency and matching the exact API version. I switched to the simple table to eliminate the syntax/runtime errors you reported.
- I can also export these files as a downloadable zip or paste every file content separately so you can copy/paste into your repo.

If this looks good, let me know and I will (A) paste all files separately for quick copy/paste, or (B) create a small Python script that converts your notebook outputs (clusters & predictions) into an `augmented_students.csv` and `cluster_centers.json` ready for the dashboard.
