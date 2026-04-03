import cv2
import mediapipe as mp
import requests
import time

# --- Configuration ---
BACKEND_LOGIN_URL = 'http://localhost:5000/api/auth/login'
BACKEND_UPDATE_URL = 'http://localhost:5000/api/device/update'
ADMIN_CREDENTIALS = {
    'email': 'karthikasapu21@gmail.com',
    'password': 'Karthik@#0121' # Seeded admin credentials required to update devices
}

# --- Initialization ---
print("Logging into Backend...")
try:
    response = requests.post(BACKEND_LOGIN_URL, json=ADMIN_CREDENTIALS)
    response.raise_for_status()
    token = response.json().get('token')
    print("Login Successful!")
except Exception as e:
    print(f"Failed to log in to backend: {e}")
    print("Make sure your backend is running!")
    exit(1)

HEADERS = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# MediaPipe Setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.7, min_tracking_confidence=0.7)
mp_draw = mp.solutions.drawing_utils

# --- State Management ---
last_gesture = -1
last_action_time = 0
DEBOUNCE_DELAY = 1.5 # Wait seconds before sending new API request

def send_device_update(fingers):
    global last_gesture, last_action_time
    
    # Do not spam the same request
    if fingers == last_gesture:
        return
    # Must wait before accepting a new gesture
    if time.time() - last_action_time < DEBOUNCE_DELAY:
        return

    payload = None
    action_text = ""
    
    if fingers == 0:
        # Fist -> All OFF
        payload = {"light": False, "fan": False}
        action_text = "Turned OFF All Devices (0 Fingers Detected)"
    elif fingers == 2:
        # Peace -> Sleep Mode
        payload = {"light": False, "fan": True}
        action_text = "Sleep Mode (Fan ON, Light OFF) (2 Fingers Detected)"
    elif fingers == 5:
        # Open Hand -> All ON
        payload = {"light": True, "fan": True}
        action_text = "Turned ON All Devices (5 Fingers Detected)"
        
    if payload:
        try:
            res = requests.post(BACKEND_UPDATE_URL, json=payload, headers=HEADERS)
            if res.status_code == 200:
                print(f"✅ Executed Action: {action_text}")
                last_gesture = fingers
                last_action_time = time.time()
            else:
                print(f"❌ Failed to update. Server returned: {res.status_code}")
        except Exception as e:
            print(f"API Update Failed: {e}")


def count_fingers(hand_landmarks):
    tip_ids = [4, 8, 12, 16, 20]
    fingers = []

    # Thumb detection can be tricky depending on which hand.
    # To simplify, we'll just check if the tip is outside the PIP joint horizontally.
    if hand_landmarks.landmark[tip_ids[0]].x > hand_landmarks.landmark[tip_ids[0] - 1].x:
        fingers.append(1) # Open (Right Hand logic usually, but works decently)
    else:
        fingers.append(0)

    # 4 Fingers detection (Tip is conceptually 'higher' than middle joint)
    for id in range(1, 5):
        if hand_landmarks.landmark[tip_ids[id]].y < hand_landmarks.landmark[tip_ids[id] - 2].y:
            fingers.append(1)
        else:
            fingers.append(0)

    # Special case: The logic above can sometimes confuse 5 vs 4. 
    # Since we only care about 0, 2, and 5:
    total = fingers.count(1)
    if total >= 4:
        return 5 # Assume 4 or 5 means open hand.
    return total

# --- Main Video Loop ---
cap = cv2.VideoCapture(0)
print("Starting Webcam. Make a gesture! Press 'q' on the video window to quit.")

while True:
    success, img = cap.read()
    if not success:
        print("Failed to read from webcam.")
        break
        
    # Flip the image horizontally for selfie-view
    img = cv2.flip(img, 1)
    imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Process gestures
    results = hands.process(imgRGB)

    fingers_count = -1

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_draw.draw_landmarks(img, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            fingers_count = count_fingers(hand_landmarks)
            
            # Show number of fingers
            cv2.rectangle(img, (20, 20), (250, 100), (0, 0, 0), cv2.FILLED)
            cv2.putText(img, f'Fingers: {fingers_count}', (30, 70), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 3)
            
            send_device_update(fingers_count)

    # UI Notifications
    if fingers_count == 0:
        cv2.putText(img, 'COMMAND: ALL OFF', (30, 140), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    elif fingers_count == 2:
        cv2.putText(img, 'COMMAND: SLEEP MODE', (30, 140), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
    elif fingers_count == 5:
        cv2.putText(img, 'COMMAND: ALL ON', (30, 140), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("Smart Home Gesture Control", img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
