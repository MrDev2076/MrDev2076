import cv2
import os
import mysql.connector
import datetime

# Database connection setup
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="face_database"
)
cursor = conn.cursor()

# Create a new table for storing image-based detections
cursor.execute("""
    CREATE TABLE IF NOT EXISTS image_detected_faces (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timestamp DATETIME,
        image_path VARCHAR(255),
        face_number INT
    )
""")

# Path for Haarcascade XML file
haarcascade_path = 'haarcascade_frontalface_default.xml'

# Load the cascade
face_cascade = cv2.CascadeClassifier(haarcascade_path)

if face_cascade.empty():
    print("Error: Haarcascade XML file not loaded. Check the path!")
    exit()

# Read the input image
image_path = 'img_1.png'  # Change this to your image file
img = cv2.imread(image_path)

if img is None:
    print(f"Error: Could not load image {image_path}. Check the path!")
    exit()

# Convert into grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Detect faces
faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

# Directory to store detected faces
face_dir = "image_faces"
os.makedirs(face_dir, exist_ok=True)

# Process detected faces
for i, (x, y, w, h) in enumerate(faces):
    # Increase cropping size with padding
    padding = 30
    x1 = max(x - padding, 0)
    y1 = max(y - padding, 0)
    x2 = min(x + w + padding, img.shape[1])
    y2 = min(y + h + padding, img.shape[0])

    face_img = img[y1:y2, x1:x2]
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    face_filename = os.path.join(face_dir, f"face_{timestamp}_{i}.jpg")

    # Save cropped face
    cv2.imwrite(face_filename, face_img)

    # Store each face separately in SQL
    cursor.execute("INSERT INTO image_detected_faces (timestamp, image_path, face_number) VALUES (%s, %s, %s)",
                   (datetime.datetime.now(), face_filename, i + 1))
    conn.commit()

    print(f"Face {i + 1} captured & stored: {face_filename}")

# Draw rectangles around detected faces in the original image
for (x, y, w, h) in faces:
    cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 255), 5)

# Save the image with bounding boxes
output_image_path = os.path.join(face_dir, f"output_{timestamp}.jpg")
cv2.imwrite(output_image_path, img)

print(f"Processed Image Saved: {output_image_path} | Total Faces Detected: {len(faces)}")

# Display the output image
cv2.imshow('Detected Faces', img)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Cleanup
conn.close()
