import cv2
import os
import mysql.connector
import datetime
import time

# Database connection setup
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="face_database"
)
cursor = conn.cursor()

# Create table if not exists
cursor.execute("""
    CREATE TABLE IF NOT EXISTS detected_faces (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timestamp DATETIME,
        image_path VARCHAR(255)
    )
""")

# Path for Haarcascade XML file
haarcascade_path = os.path.join(os.getcwd(), 'venv', 'Lib', 'site-packages', 'cv2', 'data', 'haarcascade_frontalface_default.xml')

# Load the cascade
face_cascade = cv2.CascadeClassifier(haarcascade_path)

if face_cascade.empty():
    print("Error: Haarcascade XML file not loaded. Check the path!")
    exit()

# Open video file or webcam
video_path = 'Vid_sample1.mp4'  # Use '0' for webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print(f"Error: Could not open video file {video_path}. Check path and format.")
    exit()

# Set the desired frame size
TARGET_WIDTH = 800
TARGET_HEIGHT = 600

# Directory to store captured faces
face_dir = "faces"
os.makedirs(face_dir, exist_ok=True)

# Timestamp tracking for capturing every 30 seconds
last_capture_time = time.time()

while True:
    ret, img = cap.read()
    if not ret:
        print("End of video or error in reading frame")
        break

    img = cv2.resize(img, (TARGET_WIDTH, TARGET_HEIGHT))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    current_time = time.time()

    # Capture only once every 30 seconds
    if current_time - last_capture_time >= 30 and len(faces) > 0:
        for i, (x, y, w, h) in enumerate(faces):
            # Increase cropped face size by adding padding
            padding = 30  # Increase face box size
            x1 = max(x - padding, 0)
            y1 = max(y - padding, 0)
            x2 = min(x + w + padding, img.shape[1])
            y2 = min(y + h + padding, img.shape[0])

            face_img = img[y1:y2, x1:x2]
            timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
            face_filename = os.path.join(face_dir, f"face_{timestamp}_{i}.jpg")

            cv2.imwrite(face_filename, face_img)  # Save the face image

            cursor.execute("INSERT INTO detected_faces (timestamp, image_path) VALUES (%s, %s)",
                           (datetime.datetime.now(), face_filename))
            conn.commit()

            print(f"Face captured & stored: {face_filename}")

        last_capture_time = current_time  # Reset the timer after capturing

    # Draw rectangles around detected faces
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)

    # Show video
    cv2.imshow('Live Face Detection', img)

    # Exit if ESC key (27) is pressed
    key = cv2.waitKey(1) & 0xFF
    if key == 27:
        print("Exiting video...")
        break

# Cleanup
cap.release()
cv2.destroyAllWindows()
conn.close()
