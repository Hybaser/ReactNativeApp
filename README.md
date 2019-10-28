1- App.js calls Prepare.js

2- Prepare.js gets and sets all the required data like token, jwt, categories etc. Then calls isLoaded function of App.js to change prop.

3- After isLoaded changed, Main.js is called and fills the side menu and calls NewsList.js for listing the news.


