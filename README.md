# Node.js User Onboarding application
A Node based module using Mongodb to onboard user's into a very basic application, secured using JWT authorization.

The Node.js app uses [Hapi Framework](https://hapijs.com)

# Contents

* [Manual Deployment](#manual-deployment)
* [Upload Image/Document Guidelines](UPLOAD_IMAGE_GUIDLINE.md)

# Project Dependencies

* MongoDB ([Install MongoDB](https://docs.mongodb.com/manual/administration/install-community/))

# <a id="manual-deployment"></a>Manual Deployment

## Setup Node.js

Inorder to setup NodeJS you need to fellow the current steps:

### Mac OS X

* Step1: Install Home brew

```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

$ brew -v
```

* Step2: Install Node using Brew

```
$ brew install node

$ node -v

$ npm -v
```

### Linux Systems

* Step1: Install Node using apt-get

```
$ sudo apt-get install curl python-software-properties

$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

$ sudo apt-get install nodejs

$ node -v

$ npm -v
```
## Setup Node User Onboarding Application

* Step1: Git clone the application

```
$ git clone https://github.com/ChoudharyNavit22/User-Onboarding-Module.git

$ cd User-Onboarding-Module
```

* Step2: Install node modules

```
$ npm i

or 

$ npm install
```

* Step3: Copy .env.example to .env

```
$ cp .env.example .env
```

* Step4: Start the application

```
For Development Mode

$ npm run start
```

The current version of your application would be running on **http://localhost:8000** or **http://IP_OF_SERVER:8000** (in case you are running on the server)


$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
Ubuntu Machine Installation (Version 20.x)
Installation steps on ubuntu 20.x:

1) sudo apt install curl 
2) curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
3) sudo apt install nodejs
4) sudo apt-get install git

5) CLone the backend repo and run the commands
  --> cp .env.example .env
  --> npm i
  --> npm run build
  --> npm start

6) Clone the Front end repo and run the commands
   --> npm i
   --> npm start

7) sudo apt install python2
8) sudo apt-get install python-tk
9) Change the path to / from \ in game.py inside berkeley folder at Backend (line 537,540 and 730)

-->change python to python2 while spawn in node 

10) pip2 installation:

 --> curl https://bootstrap.pypa.io/get-pip.py --output get-pip.py

 --> sudo python2 get-pip.py
 --> pip2 --version (check)

11) Dependency installation
 --> pip2 install opencv-python==4.2.0.32
 --> pip install pyautogui
 --> sudo apt-get install scrot
 --> pip install MoviePy

12) Modify server and battleBaseController
   process.end(cb())
   process.data()

