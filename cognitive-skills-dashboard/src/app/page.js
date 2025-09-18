'use client';
import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { loadStudentData } from '../utils/loadStudentData';

// Dynamically import components with SSR disabled to prevent hydration issues
const StudentTable = dynamic(
  () => import('../components/StudentTable'),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center">Loading table...</div> }
);

const SkillsRadar = dynamic(
  () => import('../components/SkillsRadar'),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center">Loading skills radar...</div> }
);

const PerformanceChart = dynamic(
  () => import('../components/PerformanceChart'),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center">Loading performance chart...</div> }
);

const PersonaDistribution = dynamic(
  () => import('../components/PersonaDistribution'),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center">Loading persona distribution...</div> }
);

const CorrelationHeatmap = dynamic(
  () => import('../components/CorrelationHeatmap'),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center">Loading correlation heatmap...</div> }
);

// Loading component for suspense fallback
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
      <p className="text-gray-600">Loading dashboard data...</p>
    </div>
  );
}

export default function Home() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // Load student data using our robust utility
    const loadData = async () => {
      try {
        const studentData = await loadStudentData();
        setStudents(studentData);
        
        // Select the first student by default if available
        if (studentData.length > 0) {
          setSelectedStudent(studentData[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load student data:', err);
        setError('Failed to load student data. Please try again later.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" suppressHydrationWarning>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Student Cognitive Skills Dashboard</h1>
        <p className="text-gray-600">Analyze and track student performance and learning patterns</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Student Performance</h2>
          <PerformanceChart students={students} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Learning Persona Distribution</h2>
          <PersonaDistribution students={students} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Student List</h2>
          <StudentTable 
            students={students} 
            onSelectStudent={setSelectedStudent}
            selectedStudent={selectedStudent}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {selectedStudent ? `${selectedStudent.Name}'s Skills` : 'Select a student'}
          </h2>
          {selectedStudent ? (
            <SkillsRadar student={selectedStudent} />
          ) : (
            <p className="text-gray-500">Click on a student to view their skills radar</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Skills Correlation</h2>
        <CorrelationHeatmap students={students} />
      </div>
    </div>
  );
}
