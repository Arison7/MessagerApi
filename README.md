# Arison's Messenger API

The primary objective of this application is to demonstrate my expertise and knowledge in software development. Consider this a showcase of my technical abilities.

![frameworks-used-transparent](https://github.com/Arison7/MessagerApi/assets/89223744/cc07d2c5-44d8-4923-99af-d6a95ec0979a)

The application's front end is developed using TypeScript and the React library. For styling purposes, Sass has been employed. The front-end is served to the back-end via Django static files. 

## Back-end

The back-end is divided into three Django templates:

- [login.html](main/static/templates/registration.login.html)
- [register.html](main/static/templates/registration.register.html)
- [index.html](front-end/public/index.html)

The first two templates are responsible for authentication and are slightly modified versions of Django's default `UserCreationForm` and login view. The final template is where the core application is served using React, adhering to most of the principles of a RESTful API.

The database holds only two models aside from the default user which are `Chat` and `Message` with the following fields. (As a side note, I can say I am using the Aura theme there, which I really recommend.)

![image](https://github.com/Arison7/MessagerApi/assets/89223744/960672ac-d33c-48ff-a566-845254ff882a)
![image](https://github.com/Arison7/MessagerApi/assets/89223744/e35da1c0-dfa1-405f-a8bf-794314f024eb)

Other than that on the back end there is also [`chatConsumer`](main/consumers.py) which allows users to connect to websocket channels with the name of the current chat and send their updates about changes on messages done in that specific chat.
those changes are then caught back by the front-end application which updates the state of the messages according to the provided data.

![image](https://github.com/Arison7/MessagerApi/assets/89223744/ca371894-bc18-4fcb-b0ff-6acaf433d461)





