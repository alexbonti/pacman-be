# Node.js getting started application
The Getting Started tutorial for Node.js uses this sample application to provide you with a sample workflow for working with any Node.js app

The Node.js app uses [Hapi Framework](https://hapijs.com)

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
## Setup Node Backend Boilerplate Application

* Step1: Git clone the application

```
$ git clone https://github.com/deakin-launchpad/node-backend-boilerplate.git

$ cd node-backend-boilerplate
```

* Step2: Install node modules

```
$ npm i

or 

$ npm install
```

* Step3: Start the application

```
For Development Mode

$ npm run start
```

The current version of your application would be running on **http://localhost:8000** or **http://IP_OF_SERVER:8000** (in case you are running on the server)
