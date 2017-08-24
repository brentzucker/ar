import cv2
from PIL import Image

class FaceDetector():
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

    def getCoordinatesOfFaces(self, img):
        # img_ = Image.fromarray(img, mode=None)
        # img_.show()
        # from matplotlib import pyplot as plt
        # plt.imread(plt.imshow(img, cmap='gray'))
        # plt.show()
        faces = self.detectFaces(img)
        json = self.facesTupleToJSON(faces)
        return json

    def detectFaces(self, img):

        # Convert to Grayscale
        # if not self.isRGB(img):
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        faces = self.face_cascade.detectMultiScale(img, 1.3, 5)
        return faces

    def facesTupleToJSON(self, faces):

        face_objs = []
        for (x, y, w, h) in faces:
            f = {
                'x': x,
                'y': y,
                'w': w,
                'h': h
            }
            face_objs.append(f)
        return face_objs

    def isRGB(self, img):
        return len(img.shape) == 3