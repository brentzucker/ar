__author__ = 'Adamlieberman'
#Server
import socket
import cv2
def server():
    host_name = 'localhost'
    port = 5000
    print 'Server started at ' + str(socket.gethostbyname(host_name)) + " at port " + str(port)
    serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    serversocket.bind(("",port))
    serversocket.listen(10)
    video = cv2.VideoCapture(0)

    while True:
        connection,address = serversocket.accept()
        print "Connection Accepted"
        success, image = video.read()
        data = cv2.imencode('.jpg',image)[1] #.toString()
        connection.sendall(data)
        connection.close()


if __name__ == "__main__":
    server()