from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import tempfile
import torch
import timm
import json
import os

app = Flask(__name__)
CORS(app)

# Set up device (GPU if available)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Create the model architecture using timm
model = timm.create_model('vit_base_patch16_224', pretrained=False, num_classes=2)
model = model.to(device)

# Function to remove "module." prefix from state_dict keys if needed
def remove_module_prefix(state_dict):
    new_state_dict = {}
    for key, value in state_dict.items():
        if key.startswith("module."):
            new_key = key[len("module."):]
        else:
            new_key = key
        new_state_dict[new_key] = value
    return new_state_dict

# Load the state dict from file and remove the "module." prefix
state_dict = torch.load(r'C:\Users\rohit\OneDrive\Desktop\DeepShield\backend\best_vit_model (1).pth', map_location=device)
state_dict = remove_module_prefix(state_dict)
model.load_state_dict(state_dict)
model.eval()

def preprocess_frame(frame):
    # Resize frame to 224x224 (as expected by the model)
    frame_resized = cv2.resize(frame, (224, 224))
    frame_normalized = frame_resized / 255.0
    processed = np.expand_dims(frame_normalized, axis=0)  # Shape: (1, 224, 224, 3)
    # Convert to torch tensor and rearrange dimensions to (batch, channels, height, width)
    tensor = torch.tensor(processed, dtype=torch.float32).permute(0, 3, 1, 2)
    tensor = tensor.to(device)
    return tensor

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    video_file = request.files["file"]

    # Save video to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp:
        video_file.save(temp.name)
        video_path = temp.name

    def generate():
        cap = cv2.VideoCapture(video_path)
        real_count = 0
        fake_count = 0
        total_frames = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            total_frames += 1
            input_tensor = preprocess_frame(frame)
            with torch.no_grad():
                output = model(input_tensor)  # Output shape: (1, 2)
                _, predicted = torch.max(output, 1)  # Assuming: 1 = Real, 0 = Fake
                if predicted.item() == 1:
                    real_count += 1
                else:
                    fake_count += 1
            data = {
                "total_frames": total_frames,
                "real_count": real_count,
                "fake_count": fake_count,
                "real_percentage": (real_count / total_frames) * 100,
                "fake_percentage": (fake_count / total_frames) * 100
            }
            yield f"data: {json.dumps(data)}\n\n"
        cap.release()
        os.remove(video_path)
    
    return Response(generate(), mimetype="text/event-stream")

if __name__ == "__main__":
    app.run(debug=True)
