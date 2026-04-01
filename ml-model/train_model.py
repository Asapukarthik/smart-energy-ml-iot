import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load dataset
def train_models():
    try:
        data = pd.read_csv("D:/New folder/smart-energy-ml-iot/ml-model/dataset.csv")
    except FileNotFoundError:
        print("dataset.csv not found. Please run generate_ml_dataset.py first.")
        return

    # Features for occupancy prediction
    X_occ = data[["hour", "temperature", "humidity", "voltage", "prev_occupancy"]]
    y_occ = data["occupancy"]

    # Features for wastage detection (includes current and ground truth occupied)
    X_wast = data[["hour", "ledCurrent", "motorCurrent", "voltage", "occupancy", "humidity"]]
    y_wast = data["wastage"]

    # Split dataset (80/20)
    X_occ_train, X_occ_test, y_occ_train, y_occ_test = train_test_split(X_occ, y_occ, test_size=0.2, random_state=42)
    X_wast_train, X_wast_test, y_wast_train, y_wast_test = train_test_split(X_wast, y_wast, test_size=0.2, random_state=42)

    # 1. Train Decision Tree for Occupancy
    dt_model = DecisionTreeClassifier(max_depth=5, random_state=42)
    dt_model.fit(X_occ_train, y_occ_train)
    occ_pred = dt_model.predict(X_occ_test)
    occ_acc = accuracy_score(y_occ_test, occ_pred)

    # 2. Train Random Forest for Energy Wastage
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
    rf_model.fit(X_wast_train, y_wast_train)
    wast_pred = rf_model.predict(X_wast_test)
    wast_acc = accuracy_score(y_wast_test, wast_pred)

    print(f"Decision Tree Accuracy (Occupancy): {occ_acc:.4f}")
    print(f"Random Forest Accuracy (Wastage): {wast_acc:.4f}")

    # Save models as a dictionary
    model_data = {
        "occupancy_model": dt_model,
        "wastage_model": rf_model,
        "features_occ": ["hour", "temperature", "humidity", "voltage", "prev_occupancy"],
        "features_wast": ["hour", "ledCurrent", "motorCurrent", "voltage", "occupancy", "humidity"]
    }
    
    joblib.dump(model_data, "model.pkl")
    print("Models saved successfully to model.pkl")

if __name__ == "__main__":
    train_models()