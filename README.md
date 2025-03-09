
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
    <li>Website Usage</li>
</ul>
<br>

<h2>Dataset Preparation</h2>
<h3>Video Directories:</h3>
<ul>
    <li><strong>Real Videos:</strong> <code>/kaggle/input/deep-fake-detection-dfd-entire-original-dataset/DFD_original sequences</code></li>
    <li><strong>Manipulated Videos:</strong> <code>/kaggle/input/deep-fake-detection-dfd-entire-original-dataset/DFD_manipulated_sequences/DFD_manipulated_sequences</code></li>
</ul>

<h3>Frame Extraction:</h3>
<p>Frames are extracted from videos at 1 frame per second and saved to disk.</p>
<br>

<h2>Model Architecture</h2>
<img src="Pictures/Img4.png" alt="Model Architecture Diagram" width="600">

<ul>
    <li><strong>Base Model:</strong> Vision Transformer (<code>vit_base_patch16_224</code>) from the timm library.</li>
    <li><strong>Input Size:</strong> 224x224 pixels</li>
    <li><strong>Number of Classes:</strong> 2 (Real, Manipulated)</li>
    <li><strong>Pretrained Weights:</strong> Yes (ImageNet)</li>
</ul>

<h3>Model Initialization:</h3>
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
<pre>
<code>
print(classification_report(all_labels, all_predictions, target_names=['Real', 'Manipulated']))
</code>
</pre>

<h3>Confusion Matrix:</h3>
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
    <li><strong>Real Video:</strong> <code>02__kitchen_still.mp4</code> → Real</li>
    <li><strong>Manipulated Video:</strong> <code>01_20__walking_and_outside_surprised__OTGHOG4Z.mp4</code> → Manipulated</li>
</ul>
<br>

<h2>Website Usage</h2>
<p>The website interface looks like this:</p>
<img src="Pictures/Img1.png" alt="Website Landing Page" width="600">

<p>After uploading an image or video:</p>
<img src="Pictures/Img2.png" alt="Upload Interface" width="600">

<p>The model processes the frames and displays results as it progresses:</p>
<img src="Pictures/Img3.png" alt="Processing Results" width="600">

<p>This setup provides a robust pipeline for detecting deepfake videos using frame-level classification, leveraging state-of-the-art transformer models and powerful GPU acceleration.</p>

</body>
