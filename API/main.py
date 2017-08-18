__author__ = 'Adamlieberman'
# main.py

from functools import wraps
from flask import Flask, render_template, Response, request, jsonify, current_app
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

@app.route('/detectFace', methods=['POST', 'GET'])
def detectFace():
    url_arr = request.url.split('=')
    print('hi')
    print(url_arr)
    print len(url_arr)
    # Gray Image
    img_array = request.form['img']
    img = np.array(img_array)



    # Get Coordinates of Face
    fd = FaceDetector()
    json_faces = fd.detectFaces(img)
    return jsonp(jsonify(json_faces))


def jsonp(func):
    """Wraps JSONified output for JSONP requests."""
    @wraps(func)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            data = str(func(*args, **kwargs).data)
            content = str(callback) + '(' + data + ')'
            mimetype = 'application/javascript'
            return current_app.response_class(content, mimetype=mimetype)
        else:
            return func(*args, **kwargs)
    return decorated_function


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True,port=5001)