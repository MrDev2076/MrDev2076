from flask import Flask, render_template, request, jsonify
import cv2
import os
import numpy as np
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load Haarcascade model
haarcascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
face_cascade = cv2.CascadeClassifier(haarcascade_path)

if face_cascade.empty():
    print("Error: Haarcascade XML file not loaded!")
    exit()

def detect_faces(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4)
    return faces

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload():
    file = request.files["video"]
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        return jsonify({"message": "File uploaded successfully", "path": filepath})
    return jsonify({"error": "File upload failed"}), 400

@app.route("/detect_faces", methods=["POST"])
def detect_from_video():
    data = request.json
    video_path = data.get("video_path")

    if not video_path or not os.path.exists(video_path):
        return jsonify({"error": "Invalid video path"}), 400

    cap = cv2.VideoCapture(video_path)
    detected_faces = 0
    face_images = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        faces = detect_faces(frame)

        for (x, y, w, h) in faces:
            detected_faces += 1
            face_img = frame[y:y+h, x:x+w]
            face_filename = f"detected_face_{detected_faces}.png"
            face_path = os.path.join(UPLOAD_FOLDER, face_filename)
            cv2.imwrite(face_path, face_img)
            face_images.append(face_path)

    cap.release()

    return jsonify({
        "detected_faces": detected_faces,
        "face_images": face_images
    })

if __name__ == "__main__":
    app.run(debug=True)
