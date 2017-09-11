__author__ = 'Adamlieberman'
# main.py

from functools import wraps
from flask import Flask, render_template, Response, request, jsonify, current_app
from flask_cors import CORS, cross_origin
from camera import VideoCamera
from face_detector import FaceDetector
import numpy as np
import json
from PIL import Image
from io import BytesIO
import base64

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def index():

    #The index page that will show the video
    print 'index'
    return render_template('index.htm')

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
@cross_origin()
def detectFace():
    # url_arr = request.url.split('=')
    # print('hi')
    # print(url_arr)
    # print len(url_arr)

    # Base64 img
    base64Str = request.form['base64']
    base64Str = base64Str[len('data:image/png;base64,'):] # Remove Header
    im = Image.open(BytesIO(base64.b64decode(base64Str)))
    img = np.array(im)
    # from matplotlib import pyplot as plt
    # plt.imshow(img, cmap=None)
    # plt.show()

    # Gray Image
    # jsonStr = request.form['img']
    # jsonStr = jsonStr.replace('\n', '')
    # img_array = json.loads(jsonStr)
    # print(len(img_array))
    # img = np.array(img_array)



    # Get Coordinates of Face
    fd = FaceDetector()
    json_faces = fd.getCoordinatesOfFaces(img)
    return jsonify(json_faces)


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
    # host = 'localhost'
    host = '0.0.0.0'
    port = 8080
    app.run(host=host, debug=True,port=port)