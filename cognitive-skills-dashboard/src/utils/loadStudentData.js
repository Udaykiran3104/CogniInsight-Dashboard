/**
 * Load and parse student data from CSV
 * @returns {Promise<Array>} Array of student objects
 */
export const loadStudentData = async () => {
  try {
    console.log('Loading student data from CSV...');
    const response = await fetch('/data/augmented_students.csv');
    
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    console.log('CSV loaded, parsing data...');
    
    // Split into lines and filter out empty lines
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length <= 1) {
      throw new Error('CSV file is empty or has no data rows');
    }
    
    // Parse header - keep original case for consistency
    const headers = lines[0].split(',').map(h => h.trim());
    console.log('CSV Headers:', headers);
    
    // Process data rows
    const students = [];
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Split by comma, but handle quoted values
        const values = line.split(',').map(v => v.trim());
        
        // Ensure we have enough columns
        if (values.length < headers.length) {
          console.warn(`Skipping row ${i + 1}: Not enough columns`);
          continue;
        }
        
        // Create student object with proper types and case sensitivity
        const student = {
          StudentID: values[0] || `student_${i}`,
          Name: values[1] || `Student ${i}`,
          Class: values[2] || 'Unknown',
          Comprehension: parseFloat(values[3]) || 0,
          Attention: parseFloat(values[4]) || 0,
          Focus: parseFloat(values[5]) || 0,
          Retention: parseFloat(values[6]) || 0,
          Assessment_Score: parseFloat(values[7]) || 0,
          Engagement_Time: parseFloat(values[8]) || 0,
          attention: parseFloat(values[4]) || 0,
          focus: parseFloat(values[5]) || 0,
          retention: parseFloat(values[6]) || 0,
          assessment_score: parseFloat(values[7]) || 0,
          engagement_time: parseFloat(values[8]) || 0,
          // Generate learning_persona based on assessment score (0-3)
          learning_persona: Math.min(3, Math.floor((parseFloat(values[7]) || 0) / 25))
        };
        
        // Log first few students for debugging
        if (i <= 3) {
          console.log(`Sample student data [${i}]:`, student);
        }
        
        students.push(student);
      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error);
      }
    }
    
    console.log(`Successfully loaded ${students.length} students`);
    return students;
    
  } catch (error) {
    console.error('Error in loadStudentData:', error);
    throw error; // Re-throw to be handled by the caller
  }
};
