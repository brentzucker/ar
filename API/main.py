__author__ = 'Adamlieberman'
# main.py

from flask import Flask, render_template, Response, request, jsonify
from camera import VideoCamera
from face_detector import FaceDetector
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():

    #The index page that will show the video
    return render_template('index.html')

def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen(VideoCamera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detectFace', methods=['POST'])
def detectFace():
    # Gray Image
    img_array = request.form['img']
    img = np.array(img_array)

    # Get Coordinates of Face
    fd = FaceDetector()
    json_faces = fd.detectFaces(img)
    return jsonify(json_faces)



if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True,port=5001)