# Chatzy-App
In this project, we develop an app for internal communications for a company. Only the registered employees of that company are able to use this app. Admin can see whole messages between your employees. You can find the employees.json to check employees of company. If you want to use that app for your company you need to insert your data like employees.json to your Users collection. So that, your employees ready to register with using code that specified by yourself. 
## Screenshots 
![](/images/1.png)

![](/images/2.png)

![](/images/3.png)
## For testing Users credential informations
    email: berk@berk.com (Admin)
    password: 123456

    email: muhammed@muhammed.com
    password: 123456

    email: omar@gmail.com
    password: 123456

## For live demo : https://chatzyapp.netlify.app/
## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! After running the following command, just open again the command line 

    $ npm install npm -g

###
### Yarn installation
  After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

## Install
    $ git clone https://github.com/muhammedsedef/Chat-App.git

    For BackEnd:

    $ cd Chat-App

    $ cd BackEnd

    $ npm install

    For FrontEnd : 

    $ cd Chat-App

    $ cd FrontEnd

    $ npm install

## Configure app

    Create a .env file in the BackEnd folder and and inject your credentials so it looks like this : 
    MONGODB_CONNECTION_STRING = <CONNECTION_STRING>
    JWT_KEY = secret

## Running the project
    Write that command for backend and frontend 
    npm start


  

