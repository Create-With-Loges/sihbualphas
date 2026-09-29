"""
SkillPulse AI - Comprehensive ML Model Evaluation Script
Evaluates all 3 trained models with detailed metrics, cross-validation, and data analysis.
"""

import pandas as pd
import numpy as np
import joblib
import json
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (
    accuracy_score, classification_report, confusion_matrix,
    r2_score, mean_absolute_error, mean_squared_error, roc_auc_score,
    precision_recall_fscore_support
)
from sklearn.metrics.pairwise import cosine_similarity

print("=" * 70)
print("  SKILLPULSE AI - COMPREHENSIVE MODEL EVALUATION REPORT")
print("=" * 70)

# Load datasets
signals = pd.read_csv("dataset/labour_market_signals_10k.csv")
drift = pd.read_csv("dataset/curriculum_drift_training.csv")
placements = pd.read_csv("dataset/candidate_placement_outcomes.csv")

print(f"\n>>> DATASET STATISTICS")
print(f"  Labour Market Signals: {len(signals):,} records")
print(f"  Curriculum Drift Modules: {len(drift):,} records")
print(f"  Candidate Placement Outcomes: {len(placements):,} records")
print(f"  TOTAL TRAINING CORPUS: {len(signals)+len(drift)+len(placements):,} records")

# Load trained models
vectorizer = joblib.load("ml_service/models/tfidf_vectorizer.joblib")
sector_centroids = joblib.load("ml_service/models/sector_centroids.joblib")
demand_model = joblib.load("ml_service/models/demand_forecast_model.joblib")
placement_model = joblib.load("ml_service/models/placement_predictor_model.joblib")

print(f"\n>>> TF-IDF VECTORIZER ANALYSIS")
print(f"  Vocabulary Size: {len(vectorizer.vocabulary_)} tokens")
print(f"  N-gram Range: {vectorizer.ngram_range}")
print(f"  Max Features: {vectorizer.max_features}")
print(f"  Sector Centroids Computed: {len(sector_centroids)} sectors")
print(f"  Sectors: {list(sector_centroids.keys())}")

# ============== MODEL 1: DEMAND FORECAST REGRESSOR ==============
print(f"\n{'=' * 70}")
print(f"  MODEL 1: DISTRICT LABOUR DEMAND FORECAST REGRESSOR")
print(f"{'=' * 70}")
X_demand = signals[["skills_count", "nsqf_proficiency_level", "avg_salary_lpa", "growth_trend_pct", "is_obsolete_role"]]
y_demand = signals["hiring_volume"]

X_train_d, X_test_d, y_train_d, y_test_d = train_test_split(X_demand, y_demand, test_size=0.2, random_state=42)

y_pred_d = demand_model.predict(X_test_d)
r2 = r2_score(y_test_d, y_pred_d)
mae = mean_absolute_error(y_test_d, y_pred_d)
mse = mean_squared_error(y_test_d, y_pred_d)
rmse = np.sqrt(mse)

cv_scores = cross_val_score(demand_model, X_demand, y_demand, cv=5, scoring="r2")

print(f"  Algorithm: Random Forest Regressor")
print(f"  n_estimators: {demand_model.n_estimators}")
print(f"  max_depth: {demand_model.max_depth}")
print(f"  Train/Test Split: 80/20 (random_state=42)")
print(f"")
print(f"  R2 Score: {r2:.4f}")
print(f"  Mean Absolute Error (MAE): {mae:.2f}")
print(f"  Root Mean Squared Error (RMSE): {rmse:.2f}")
print(f"  5-Fold CV R2 Scores: {[round(s,4) for s in cv_scores]}")
print(f"  5-Fold CV Mean R2: {cv_scores.mean():.4f} +/- {cv_scores.std():.4f}")

importances = demand_model.feature_importances_
features = ["skills_count", "nsqf_level", "avg_salary_lpa", "growth_trend_pct", "is_obsolete_role"]
print(f"\n  Feature Importances:")
for f, imp in sorted(zip(features, importances), key=lambda x: x[1], reverse=True):
    print(f"    {f:30s} : {imp:.4f} ({imp*100:.1f}%)")

# ============== MODEL 2: PLACEMENT READINESS CLASSIFIER ==============
print(f"\n{'=' * 70}")
print(f"  MODEL 2: CANDIDATE PLACEMENT READINESS CLASSIFIER")
print(f"{'=' * 70}")
X_place = placements[["matched_skills_count", "missing_skills_count", "curriculum_aligned_flag", "practical_training_hours", "nsqf_level"]]
y_place = placements["placed_successfully"]

X_train_p, X_test_p, y_train_p, y_test_p = train_test_split(X_place, y_place, test_size=0.2, random_state=42)

y_pred_p = placement_model.predict(X_test_p)
y_prob_p = placement_model.predict_proba(X_test_p)[:, 1]

acc = accuracy_score(y_test_p, y_pred_p)
auc = roc_auc_score(y_test_p, y_prob_p)
precision, recall, f1, _ = precision_recall_fscore_support(y_test_p, y_pred_p, average="binary")

cv_acc = cross_val_score(placement_model, X_place, y_place, cv=5, scoring="accuracy")
cv_auc = cross_val_score(placement_model, X_place, y_place, cv=5, scoring="roc_auc")

print(f"  Algorithm: Random Forest Classifier")
print(f"  n_estimators: {placement_model.n_estimators}")
print(f"  max_depth: {placement_model.max_depth}")
print(f"  Train/Test Split: 80/20 (random_state=42)")
print(f"")
print(f"  Accuracy: {acc*100:.2f}%")
print(f"  Precision: {precision*100:.2f}%")
print(f"  Recall: {recall*100:.2f}%")
print(f"  F1-Score: {f1*100:.2f}%")
print(f"  ROC-AUC: {auc:.4f}")
print(f"")
print(f"  5-Fold CV Accuracy: {cv_acc.mean()*100:.2f}% +/- {cv_acc.std()*100:.2f}%")
print(f"  5-Fold CV ROC-AUC: {cv_auc.mean():.4f} +/- {cv_auc.std():.4f}")

cm = confusion_matrix(y_test_p, y_pred_p)
print(f"\n  Confusion Matrix:")
print(f"    TN={cm[0][0]}  FP={cm[0][1]}")
print(f"    FN={cm[1][0]}  TP={cm[1][1]}")

print(f"\n  Detailed Classification Report:")
print(classification_report(y_test_p, y_pred_p, target_names=["Not Placed", "Placed"]))

importances_p = placement_model.feature_importances_
features_p = ["matched_skills_count", "missing_skills_count", "curriculum_aligned_flag", "practical_training_hours", "nsqf_level"]
print(f"  Feature Importances:")
for f, imp in sorted(zip(features_p, importances_p), key=lambda x: x[1], reverse=True):
    print(f"    {f:30s} : {imp:.4f} ({imp*100:.1f}%)")

# ============== MODEL 3: TF-IDF SEMANTIC DRIFT ENGINE ==============
print(f"\n{'=' * 70}")
print(f"  MODEL 3: TF-IDF SEMANTIC CURRICULUM DRIFT ENGINE")
print(f"{'=' * 70}")

correct = 0
total = len(drift)

for _, row in drift.iterrows():
    sector = row["sector"]
    text = f"{row['module_name']} {row['syllabus_description']}"
    
    if sector in sector_centroids:
        vec = vectorizer.transform([text]).toarray()
        centroid = sector_centroids[sector].reshape(1, -1)
        sim = float(cosine_similarity(vec, centroid)[0][0])
        predicted_aligned = sim > 0.08
    else:
        predicted_aligned = True
    
    actual_aligned = row["is_obsolete"] == 0
    if predicted_aligned == actual_aligned:
        correct += 1

drift_accuracy = correct / total * 100
print(f"  Evaluation Method: Cosine Similarity against Sector Centroids")
print(f"  Evaluated Modules: {total:,}")
print(f"  Correct Classifications: {correct:,}")
print(f"  Drift Detection Accuracy: {drift_accuracy:.2f}%")

# Data distribution analysis
print(f"\n>>> DATA DISTRIBUTION ANALYSIS")
print(f"\n  Labour Market Signals by Sector:")
for sector, count in signals["sector"].value_counts().items():
    print(f"    {sector:50s}: {count:,} records ({count/len(signals)*100:.1f}%)")

print(f"\n  Obsolete vs Emerging Roles:")
obs_count = int(signals["is_obsolete_role"].sum())
emg_count = len(signals) - obs_count
print(f"    Obsolete Roles: {obs_count:,} ({obs_count/len(signals)*100:.1f}%)")
print(f"    Emerging Roles: {emg_count:,} ({emg_count/len(signals)*100:.1f}%)")

print(f"\n  Placement Outcomes:")
placed = int(placements["placed_successfully"].sum())
not_placed = len(placements) - placed
print(f"    Successfully Placed: {placed:,} ({placed/len(placements)*100:.1f}%)")
print(f"    Not Placed: {not_placed:,} ({not_placed/len(placements)*100:.1f}%)")

# Save evaluation results as JSON
eval_results = {
    "dataset": {
        "labour_market_signals": len(signals),
        "curriculum_drift_modules": len(drift),
        "placement_outcomes": len(placements),
        "total": len(signals) + len(drift) + len(placements)
    },
    "demand_forecast_regressor": {
        "r2_score": round(r2, 4),
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "cv_mean_r2": round(cv_scores.mean(), 4),
        "cv_std_r2": round(cv_scores.std(), 4)
    },
    "placement_classifier": {
        "accuracy_pct": round(acc * 100, 2),
        "precision_pct": round(precision * 100, 2),
        "recall_pct": round(recall * 100, 2),
        "f1_pct": round(f1 * 100, 2),
        "roc_auc": round(auc, 4),
        "cv_mean_accuracy_pct": round(cv_acc.mean() * 100, 2),
        "cv_mean_auc": round(cv_auc.mean(), 4)
    },
    "drift_engine": {
        "accuracy_pct": round(drift_accuracy, 2),
        "modules_evaluated": total
    }
}

with open("ml_service/models/evaluation_results.json", "w") as f:
    json.dump(eval_results, f, indent=2)

print(f"\n{'=' * 70}")
print(f"  EVALUATION COMPLETE - Results saved to ml_service/models/evaluation_results.json")
print(f"{'=' * 70}")
