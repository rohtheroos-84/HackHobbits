<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deepfake Video Detection with Vision Transformer (ViT)</title>
</head>
<body>

<h1>Deepfake Video Detection with Vision Transformer (ViT)</h1>
<p>
    This project aims to detect deepfake videos using a Vision Transformer (ViT) model trained on the DeepFake Detection (DFD) dataset. The model classifies video frames as either real or manipulated, achieving high accuracy through transfer learning and advanced image augmentations.
</p>

<h2>Table of Contents</h2>
<ul>
    <li>Dataset Preparation</li>
    <li>Model Architecture</li>
    <li>Training Process</li>
    <li>Validation and Metrics</li>
    <li>Video Prediction</li>
    <li>Installation and Setup</li>
    <li>Results</li>
</ul>
<br>

<h2>Dataset Preparation</h2>
<h3>Video Directories:</h3>
<ul>
    <li><strong>Real Videos:</strong> /kaggle/input/deep-fake-detection-dfd-entire-original-dataset/DFD_original sequences</li>
    <li><strong>Manipulated Videos:</strong> /kaggle/input/deep-fake-detection-dfd-entire-original-dataset/DFD_manipulated_sequences/DFD_manipulated_sequences</li>
</ul>

<h3>Frame Extraction:</h3>
<p>Frames are extracted from videos at 1 frame per second and saved to disk.</p>
<br>

<h2>Model Architecture</h2>
<ul>
    <li><strong>Base Model:</strong> Vision Transformer (vit_base_patch16_224) from the timm library.</li>
    <li><strong>Input Size:</strong> 224x224 pixels</li>
    <li><strong>Number of Classes:</strong> 2 (Real, Manipulated)</li>
    <li><strong>Pretrained Weights:</strong> Yes (ImageNet)</li>
</ul>

<pre>
<code>
model = timm.create_model('vit_base_patch16_224', pretrained=True, num_classes=2)
model.to(device)
model = nn.DataParallel(model)
</code>
</pre>
<br>

<h2>Training Process</h2>
<h3>Transformations:</h3>
<p>Image augmentations to enhance model generalization:</p>

<pre>
<code>
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(),
    transforms.RandomRotation(20),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.2),
    transforms.RandomAffine(degrees=15, translate=(0.1, 0.1)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])
</code>
</pre>

<h3>Training Loop:</h3>
<p>Training with early stopping and learning rate scheduling:</p>
<pre>
<code>
for epoch in range(num_epochs):
    model.train()
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
</code>
</pre>
<br>

<h2>Validation and Metrics</h2>
<h3>Classification Report:</h3>
<p>Evaluate the model using a validation set:</p>
<pre>
<code>
print(classification_report(all_labels, all_predictions, target_names=['Real', 'Manipulated']))
</code>
</pre>

<h3>Confusion Matrix:</h3>
<p>Visualize model predictions:</p>
<pre>
<code>
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.show()
</code>
</pre>
<br>

<h2>Video Prediction</h2>
<p>Classify an entire video by analyzing its frames:</p>
<pre>
<code>
def predict_video(video_path, model, transform, device):
    cap = cv2.VideoCapture(video_path)
    real_count, manipulated_count = 0, 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        image = transform(Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))).unsqueeze(0).to(device)
        with torch.no_grad():
            outputs = model(image)
            _, predicted = torch.max(outputs, 1)
        real_count += (predicted.item() == 0)
        manipulated_count += (predicted.item() == 1)
    cap.release()
</code>
</pre>
<br>

<h2>Installation and Setup</h2>
<h3>Install Required Packages:</h3>
<pre>
<code>
pip install timm torch torchvision opencv-python pillow scikit-learn seaborn matplotlib
</code>
</pre>

<h3>CUDA Verification:</h3>
<p>Ensure GPU support:</p>
<pre>
<code>
print("CUDA Available:", torch.cuda.is_available())
print("GPU Name:", torch.cuda.get_device_name(0) if torch.cuda.is_available() else "No GPU")
</code>
</pre>
<br>

<h2>Results</h2>
<h3>Model Performance:</h3>
<ul>
    <li>Training Accuracy: ~89.71%</li>
    <li>Validation Accuracy: ~87.77%</li>
    <li>Best Validation Accuracy: 87.77%</li>
</ul>

<h3>Example Predictions:</h3>
<ul>
    <li><strong>Real Video:</strong> 02__kitchen_still.mp4 → Real</li>
    <li><strong>Manipulated Video:</strong> 01_20__walking_and_outside_surprised__OTGHOG4Z.mp4 → Manipulated</li>
</ul>

<p>This setup provides a robust pipeline for detecting deepfake videos using frame-level classification, leveraging state-of-the-art transformer models and powerful GPU acceleration.</p>

</body>
</html>
