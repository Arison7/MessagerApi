# Arison's Messenger API

The primary objective of this application is to demonstrate my expertise and knowledge in software development. Consider this a showcase of my technical abilities.

![frameworks-used-transparent](https://github.com/Arison7/MessagerApi/assets/89223744/cc07d2c5-44d8-4923-99af-d6a95ec0979a)

The application's front end is developed using TypeScript and the React library. For styling purposes, Sass has been employed. The front end is served to the back end via Django static files. 

## Detailed description

The back-end is divided into three Django templates:

- [login.html](main/static/templates/registration.login.html)
- [register.html](main/static/templates/registration.register.html)
- [index.html](front-end/public/index.html)

The first two templates are responsible for authentication and are slightly modified versions of Django's default `UserCreationForm` and login view. The final template is where the core application is served using React, adhering to most of the principles of a RESTful API.

## Database Models

The Messager API primarily consists of two custom database models in addition to the default "User" model: `Chat` and `Message`. These models are designed with the following fields. (As a side note I am using the Aura theme on Vscode which I strongly recommend )

- `Chat` Model:
  
  ![Chat Model](https://github.com/Arison7/MessagerApi/assets/89223744/960672ac-d33c-48ff-a566-845254ff882a)

- `Message` Model:
 
  ![Message Model](https://github.com/Arison7/MessagerApi/assets/89223744/e35da1c0-dfa1-405f-a8bf-794314f024eb)

## Test Based Development

This project utilizes Unity Testing to ensure the robustness and reliability of its backend models. The comprehensive suite of tests can be explored in the [`main/tests.py`](main/tests.py) file. These tests play a crucial role in validating the functionality of our models, contributing to the overall stability and performance of the project.

## WebSocket Communication

The backend of the Messager API includes a critical component known as [`chatConsumer`](main/consumers.py). This consumer enables users to connect to WebSocket channels, each associated with a specific chat, and transmit updates regarding message changes within that particular chat. The front-end application then responds to these updates by adjusting the message state accordingly.

![WebSocket Communication](https://github.com/Arison7/MessagerApi/assets/89223744/7f0e73b3-253b-4b8d-9abb-55f21c5a4b3b)

## Front-End Structure

The front end of this application is structured around eight distinct components, with the more critical showcased below:

1. `ListChats`: This component is responsible for fetching and displaying all the chats in which the current user is involved.
   ![ListChats Component](https://github.com/Arison7/MessagerApi/assets/89223744/8f84d502-5535-464d-aa87-f53c17ff819f)

2. `Chat`: The `Chat` component serves as the parent element for several smaller elements. Its primary responsibilities include managing WebSocket connections and receiving data related to the current chat.
   ![Chat Component](https://github.com/Arison7/MessagerApi/assets/89223744/3367cacf-9071-41ba-b1b6-7535fa95751c)

3. `ListMessages`: This is the only Class component within the project. This structural choice allows for control over scrolling behaviour, especially following changes to the message state.
   ![ListMessages Component](https://github.com/Arison7/MessagerApi/assets/89223744/f3bc9bff-8e7d-4671-b3ce-547fa186d457)

4. `CreateMessage`: As its name implies, the `CreateMessage` component facilitates the creation and updating of messages.
   ![CreateMessage Component](https://github.com/Arison7/MessagerApi/assets/89223744/694ed4db-975c-4d5f-a75f-a621826e3d6c)

Feel free to explore these components to gain a better understanding of how the Messager API is structured and functions.

















