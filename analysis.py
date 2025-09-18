import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

# Load augmented dataset
df = pd.read_csv('augmented_students.csv')

# --- Correlation Analysis ---

# Select relevant columns
corr_cols = ['comprehension', 'attention', 'focus', 'retention', 'engagement_time', 'assessment_score']

# Correlation matrix
corr_matrix = df[corr_cols].corr()
print("Correlation matrix:\n", corr_matrix)

# Heatmap visualization
plt.figure(figsize=(8,6))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".2f")
plt.title('Correlation Matrix: Cognitive Skills, Engagement, and Assessment Score')
plt.show()

# --- Machine Learning to predict assessment_score ---

# Features and target
X = df[['comprehension', 'attention', 'focus', 'retention', 'engagement_time']]
y = df['assessment_score']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 1) Linear Regression
lr_model = LinearRegression()
lr_model.fit(X_train, y_train)
y_pred_lr = lr_model.predict(X_test)

print("Linear Regression performance:")
print("  RMSE:", np.sqrt(mean_squared_error(y_test, y_pred_lr)))
print("  R2 Score:", r2_score(y_test, y_pred_lr))

# 2) Random Forest Regressor
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)
y_pred_rf = rf_model.predict(X_test)

print("Random Forest Regressor performance:")
print("  RMSE:", np.sqrt(mean_squared_error(y_test, y_pred_rf)))
print("  R2 Score:", r2_score(y_test, y_pred_rf))

# --- Clustering to identify learning personas ---

# Normalize features for clustering
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Choose number of clusters (e.g., 4)
kmeans = KMeans(n_clusters=4, random_state=42)
clusters = kmeans.fit_predict(X_scaled)
df['learning_persona'] = clusters

# Visualize cluster centers in radar chart
def plot_radar_chart(cluster_centers, feature_names, save_path='learning_personas_radar.png'):
    import matplotlib.pyplot as plt
    import numpy as np
    import os

    # Create the output directory if it doesn't exist
    os.makedirs('output', exist_ok=True)
    
    num_vars = len(feature_names)
    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(10, 8), subplot_kw=dict(polar=True))

    for i, center in enumerate(cluster_centers):
        values = center.tolist()
        values += values[:1]
        ax.plot(angles, values, label=f'Persona {i+1}', linewidth=2)
        ax.fill(angles, values, alpha=0.25)

    # Add labels and title
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(feature_names, fontsize=10)
    plt.title('Learning Personas - Cognitive Skill Profiles', fontsize=14, pad=20)
    plt.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), fontsize=9)
    
    # Adjust layout and save the figure
    plt.tight_layout()
    output_path = os.path.join('output', save_path)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    print(f"Radar chart saved to: {os.path.abspath(output_path)}")
    plt.close()

# Plot radar chart of cluster centers (in scaled units)
plot_radar_chart(kmeans.cluster_centers_, X.columns.tolist())

# --- Insights ---

# Average assessment score per cluster
print("\nAverage Assessment Score by Learning Persona:")
print(df.groupby('learning_persona')['assessment_score'].mean())

# Count students in each persona
print("\nStudent Counts by Learning Persona:")
print(df['learning_persona'].value_counts())
