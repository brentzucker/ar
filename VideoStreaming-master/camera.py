__author__ = 'Adamlieberman'
import cv2

#We will have to wrap the detection code in here
class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        self.face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
        self.info = {'face':[800,500,10000,30]}

    def __del__(self):
        self.video.release()

    def get_frame(self):
        success, img = self.video.read()

        # Computer Vision / Image Processing
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            cv2.rectangle(img, (x, y), (x + w, y + h), (255, 255, 0), 2)
            font = cv2.FONT_HERSHEY_SIMPLEX
            cv2.putText(img, 'Face', (x + w / 2, y + h), font, 0.5, (11, 255, 255), 2)
            cv2.putText(img, 'Credit Score: ' + str(self.info['face'][0]), (x - w / 2, y + h), font, 0.5, (11, 255, 255), 2)
            cv2.putText(img, 'Current Balance: ' + str(self.info['face'][2]), (x - w / 2, y + h / 227), font, 0.5,
                        (11, 255, 255), 2)
            print(x, y)

        # Send Back
        ret, jpeg = cv2.imencode('.jpg', img)
        return jpeg.tobytes()