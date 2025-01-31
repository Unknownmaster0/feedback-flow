#Todos of the project, which can be improved after the first time project get deployed or made full fledge.

1. ApiResponseInterface -> type of data should be checked correctly.

2. getSession() -> should have the proper type of the returning payload(session)

3. when user signup successfully, the session comes in the cookie but the nav-bar doesn't updated, it requires a refresh to update the username -> use the 'sessions' in state variable such that changes will be considered by the React.

4. Hydration error in the home page while loading the "profile url" of the users.

5. when the user is not logged in and reaches the dashboard, must see the valid information or message.

6. add the next-auth features like signin with google.

7. update the signup method, that is for the signup also you need to use the next-auth feature only. This will resolve all the session releated type error then.

last: check the css property for the dynamic nature of the app (web/mobile/tablet) based all.
