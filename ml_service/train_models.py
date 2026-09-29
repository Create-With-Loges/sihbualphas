"""
SkillPulse AI - ML Training Pipeline
Trains Machine Learning models on the 10,000+ Labour Market & Curriculum Alignment Dataset:
1. TF-IDF Semantic Drift Vectorizer & Sector Skill Centroids
2. District Labour Demand Forecast Regressor (Random Forest)
3. Candidate Placement Probability Classifier (Logistic Regression & Random Forest)
Serializes trained models with Joblib into ml_service/models/
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, accuracy_score, classification_report, roc_auc_score

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)


def train_all_models():
    print("=" * 65)
    print(">> STARTING SKILLPULSE AI MACHINE LEARNING TRAINING PIPELINE")
    print("=" * 65)

    signals_path = os.path.join(DATA_DIR, "labour_market_signals_10k.csv")
    drift_path = os.path.join(DATA_DIR, "curriculum_drift_training.csv")
    placement_path = os.path.join(DATA_DIR, "candidate_placement_outcomes.csv")

    if not os.path.exists(signals_path):
        raise FileNotFoundError(f"Missing dataset at {signals_path}. Run generate_dataset.py first.")

    # -------------------------------------------------------------
    # 1. TRAIN TF-IDF SEMANTIC DRIFT VECTORIZER ON 10,000+ SIGNALS
    # -------------------------------------------------------------
    print("\n[1/3] Training TF-IDF Semantic Drift Vectorizer on 13,000+ texts...")
    df_signals = pd.read_csv(signals_path)
    df_drift = pd.read_csv(drift_path)

    # Combine all textual features from signals & curriculum syllabus
    corpus = list(df_signals["required_skills"].dropna()) + \
             list(df_signals["job_title"].dropna()) + \
             list(df_drift["syllabus_description"].dropna()) + \
             list(df_drift["module_name"].dropna())

    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=4000,
        stop_words="english",
        sublinear_tf=True
    )
    vectorizer.fit(corpus)

    # Compute sector centroids
    sector_centroids = {}
    for sector, group in df_signals.groupby("sector"):
        sector_texts = group["required_skills"].tolist()
        matrix = vectorizer.transform(sector_texts)
        centroid = np.asarray(matrix.mean(axis=0)).flatten()
        sector_centroids[sector] = centroid

    vectorizer_path = os.path.join(MODELS_DIR, "tfidf_vectorizer.joblib")
    centroids_path = os.path.join(MODELS_DIR, "sector_centroids.joblib")
    joblib.dump(vectorizer, vectorizer_path)
    joblib.dump(sector_centroids, centroids_path)
    print(f" -> Fitted vocabulary size: {len(vectorizer.vocabulary_)} n-grams")
    print(f" -> Saved Vectorizer & Centroids to {MODELS_DIR}")

    # -------------------------------------------------------------
    # 2. TRAIN DISTRICT DEMAND FORECAST REGRESSOR
    # -------------------------------------------------------------
    print("\n[2/3] Training District Labour Demand Forecasting Regressor (Random Forest)...")
    # Features: skills_count, nsqf_proficiency_level, avg_salary_lpa, growth_trend_pct, is_obsolete_role
    X_demand = df_signals[["skills_count", "nsqf_proficiency_level", "avg_salary_lpa", "growth_trend_pct", "is_obsolete_role"]]
    y_demand = df_signals["hiring_volume"]

    X_train_d, X_test_d, y_train_d, y_test_d = train_test_split(X_demand, y_demand, test_size=0.2, random_state=42)

    rf_regressor = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
    rf_regressor.fit(X_train_d, y_train_d)

    y_pred_d = rf_regressor.predict(X_test_d)
    r2 = r2_score(y_test_d, y_pred_d)
    mae = mean_absolute_error(y_test_d, y_pred_d)

    print(f" -> Random Forest Regressor R^2 Score: {r2:.4f}")
    print(f" -> Mean Absolute Error (MAE): {mae:.2f} hiring volume units")

    demand_model_path = os.path.join(MODELS_DIR, "demand_forecast_model.joblib")
    joblib.dump(rf_regressor, demand_model_path)
    print(f" -> Saved Demand Forecast Model to {demand_model_path}")

    # -------------------------------------------------------------
    # 3. TRAIN CANDIDATE PLACEMENT READINESS CLASSIFIER
    # -------------------------------------------------------------
    print("\n[3/3] Training Candidate Placement Readiness Classifier on 5,000 outcomes...")
    df_placements = pd.read_csv(placement_path)

    X_place = df_placements[[
        "matched_skills_count", "missing_skills_count", 
        "curriculum_aligned_flag", "practical_training_hours", "nsqf_level"
    ]]
    y_place = df_placements["placed_successfully"]

    X_train_p, X_test_p, y_train_p, y_test_p = train_test_split(X_place, y_place, test_size=0.2, random_state=42)

    # Train Logistic Regression & Random Forest
    log_clf = LogisticRegression(max_iter=500, random_state=42)
    log_clf.fit(X_train_p, y_train_p)

    rf_clf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    rf_clf.fit(X_train_p, y_train_p)

    y_pred_rf = rf_clf.predict(X_test_p)
    acc = accuracy_score(y_test_p, y_pred_rf)
    auc = roc_auc_score(y_test_p, rf_clf.predict_proba(X_test_p)[:, 1])

    print(f" -> Placement Classifier Accuracy: {acc*100:.2f}%")
    print(f" -> ROC-AUC Score: {auc:.4f}")

    placement_model_path = os.path.join(MODELS_DIR, "placement_predictor_model.joblib")
    joblib.dump(rf_clf, placement_model_path)
    print(f" -> Saved Placement Classifier to {placement_model_path}")

    # Save summary metrics to JSON
    metrics = {
        "dataset_records_count": len(df_signals),
        "curriculum_records_count": len(df_drift),
        "placement_records_count": len(df_placements),
        "total_training_records": len(df_signals) + len(df_drift) + len(df_placements),
        "vocabulary_size": len(vectorizer.vocabulary_),
        "demand_forecast_r2_score": round(float(r2), 4),
        "demand_forecast_mae": round(float(mae), 2),
        "placement_classifier_accuracy_pct": round(float(acc * 100), 2),
        "placement_classifier_roc_auc": round(float(auc), 4),
        "training_timestamp": pd.Timestamp.now().isoformat()
    }

    metrics_path = os.path.join(MODELS_DIR, "training_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    print("\n" + "=" * 65)
    print(">> TRAINING COMPLETED SUCCESSFULLY!")
    print(f" - Trained on {metrics['total_training_records']:,} records")
    print(f" - Demand Forecast R2: {metrics['demand_forecast_r2_score']}")
    print(f" - Placement Accuracy: {metrics['placement_classifier_accuracy_pct']}% (AUC: {metrics['placement_classifier_roc_auc']})")
    print(f" - Model artifacts written to: {MODELS_DIR}")
    print("=" * 65)


if __name__ == "__main__":
    train_all_models()
