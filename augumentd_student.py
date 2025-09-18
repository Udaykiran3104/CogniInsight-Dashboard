import pandas as pd
import numpy as np

# Load the original students.csv (ensure it's in your working directory)
students_df = pd.read_csv('students.csv')

# Define a helper function to map age to class
def age_to_class(age):
    if age <= 18:
        return '12'
    elif age <= 19:
        return '12'
    elif age <= 20:
        return '11'
    elif age <= 21:
        return '11'
    elif age <= 22:
        return '10'
    elif age <= 23:
        return '10'
    elif age <= 24:
        return '9'
    elif age <= 25:
        return '9'
    else:
        return '8'

students_df['class'] = students_df['Age'].apply(age_to_class)

# Generate synthetic cognitive skill columns based on GPA
np.random.seed(42)
n = len(students_df)
gpa_scaled = (students_df['GPA'] / 4.0) * 100

comprehension = np.clip(gpa_scaled + np.random.normal(0, 10, n), 30, 100)
attention = np.clip(gpa_scaled + np.random.normal(0, 12, n), 25, 100)
focus = np.clip(gpa_scaled + np.random.normal(0, 15, n), 20, 100)
retention = np.clip(gpa_scaled + np.random.normal(0, 11, n), 25, 100)
engagement_time = np.clip(np.random.normal(90, 25, n), 10, 180)

assessment_score = (
    0.3 * comprehension +
    0.25 * attention +
    0.2 * focus +
    0.15 * retention +
    0.1 * (engagement_time / 2) +
    np.random.normal(0, 5, n)
)
assessment_score = np.clip(assessment_score, 0, 100)

students_df['comprehension'] = comprehension
students_df['attention'] = attention
students_df['focus'] = focus
students_df['retention'] = retention
students_df['engagement_time'] = engagement_time
students_df['assessment_score'] = assessment_score

# Select relevant columns and save to CSV
augmented_df = students_df[[
    'StudentID', 'Name', 'class', 'comprehension', 'attention',
    'focus', 'retention', 'assessment_score', 'engagement_time'
]]

augmented_df.to_csv('augmented_students.csv', index=False)
print("Augmented dataset saved as augmented_students.csv")
