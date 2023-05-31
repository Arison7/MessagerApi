# Arison's Messenger API

## Preview

Coming soon...

## Description

The primary objective of this application is to demonstrate my expertise and knowledge in software development. Consider this a showcase of my technical abilities.

![frameworks-used-transparent](https://github.com/Arison7/MessagerApi/assets/89223744/cc07d2c5-44d8-4923-99af-d6a95ec0979a)

The application's front-end is developed using TypeScript and the React library. For styling purposes, Sass has been employed. The front-end is served to the back-end via Django static files. The back-end is divided into three Django templates:

- [login.html](main/static/templates/registration.login.html)
- [register.html](main/static/templates/registration.register.html)
- [index.html](front-end/public/index.html)

The first two templates are responsible for authentication and are slightly modified versions of Django's default `UserCreationForm` and login view. The final template is where the core application is served using React, adhering to the principles of a RESTful API.

