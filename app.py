from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import cv2
import tempfile

app = Flask(__name__)
CORS(app)

# Load the model using joblib (assuming you saved it with joblib.dump)
model = joblib.load("best_vit_model.pkl", mmap_mode=None)

def preprocess_frame(frame):
    frame_resized = cv2.resize(frame, (224, 224))
    frame_normalized = frame_resized / 255.0
    return np.expand_dims(frame_normalized, axis=0)

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    video_file = request.files["file"]
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp:
        video_file.save(temp.name)
        video_path = temp.name

    cap = cv2.VideoCapture(video_path)
    real_count = 0
    fake_count = 0
    total_frames = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        total_frames += 1
        processed_frame = preprocess_frame(frame)
        prediction = model.predict(processed_frame)[0]
        if prediction[1] > prediction[0]:
            fake_count += 1
        else:
            real_count += 1

    cap.release()
    if total_frames == 0:
        return jsonify({"error": "No frames extracted"}), 400

    real_percentage = (real_count / total_frames) * 100
    fake_percentage = (fake_count / total_frames) * 100

    return jsonify({
        "total_frames": total_frames,
        "real_count": real_count,
        "fake_count": fake_count,
        "real_percentage": real_percentage,
        "fake_percentage": fake_percentage
    })

if __name__ == "__main__":
    app.run(debug=True)
