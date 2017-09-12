# Insructions for windows
# https://github.com/docker/for-win/issues/204
Go to VirtualBox -> Your BOX -> Settings -> Network ->
Choose NAT
Open Advanced
Click Port Forwarding
Add new rule to map whatever port 8080 from host to guest port 8080
Click OK, OK
Then stop, start the BOX

docker pull bzuckerncr/python2-opencv-flask
docker run -it -p 8080:8080 python2-opencv-flask bash