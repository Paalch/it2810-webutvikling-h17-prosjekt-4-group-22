# IT2810 - Project 4 - UnWatched

## Description
The UnWatched application is a movie- and TV show manager.
To get access to the main functionality like *Library* and *Watchlist*, you have to log into your Google account.

##### !!! It is important to add a lot of movies and series to the watchlist and the library, once logged in, to get the full experince of the functionality of the web-application. !!!

  * Discover  
   The front page of the application presents the user with kind of fresh news on movies and shows.

  * Search  
   In the search bar, the you can search for any movie or TV show.
   Here you can add them to your Library or Watchlist.

  * Library  
   All movies and TV shows added to Library appears here.
   The The Library's intent is to serve as a "watch history" of movies and TV shows you have seen.

  * Watchlist  
   All movies and TV shows added to Watchlist appears here.  
   The Watchlist's intent is to serve as a wish list of movies and TV show you want to see in the future.
  

  * Profile
  In the Profile page, you can delete your account, see a word cloud overview of your most seen genres,
  and see your search history.  
  The word cloud only generates if you have five or more movies in your library.
  Press the "Generate cloud!" button to generate the cloud. If it is empty, it will show you; if it has less than five
  movies, it will ask you to add more to your library.

Extended documentation can be found under the URL `/documentation`. Follow link in footer.


## Production setup

Setting up this project for production is quite easy.

You will need `nodejs` version `8.9.0` (LTS) or above with `npm`, 
and `PostgreSQL` installed and running at port `5432` with a database named `it2810-g22-p4-dev`.
Unless these things are set up, the project wont work!

Then open up a terminal/shell and run the following commands:

``` bash
# Clone this git repository
git clone https://github.com/IT2810/it2810-webutvikling-h17-prosjekt-4-group-22.git

# Enter the project folder
cd it2810-webutvikling-h17-prosjekt-4-group-22

# Install dependencies
npm install

# Run project
npm run prod
```

The project will be available in your browser at `localhost:8000`.

## Development server

This project has multiple services, and the easiest way to run it is with Docker and Docker-Compose. If you want to do it without Docker, there is a guide below.

### Setup with Docker

First you need to install [Docker](https://www.docker.com/community-edition#/download) and [Docker-Compose](https://docs.docker.com/compose/install/)

Export environment variables (This is *NIX style, you fix Windows some other way, I don't know how).

Clone this repository and install dependencies

``` bash
git clone https://github.com/IT2810/it2810-webutvikling-h17-prosjekt-4-group-22.git

cd it2810-webutvikling-h17-prosjekt-4-group-22

npm install
```

``` bash
# Required environment variables
# THESE VALUES ARE PROVIDED FOR YOUR TESTING PURPOSES ONLY.
# THEY ARE MADE WITH DUMMY USERS AND WILL BE DISCARDED AFTER THE TESTING IS DONE.
# THEY ARE PROVIDED ONLY TO MAKE IT EASIER FOR YOU TO TEST OUT CODE
export P4_AUTH_GOOGLE_KEY="900799539371-6ekhk6cdvg8ephfqvuo0prhns8pkknse.apps.googleusercontent.com"
export P4_AUTH_GOOGLE_SECRET="5YzUSvucaF_hj9TyRf8X4Orr"
export P4_AUTH_GOOGLE_CALLBACK="http://localhost:8000/auth/google-callback"
export P4_TMDB_TOKEN="14aaf9ea405e5c25e5a9ed2e6792e35e"

# These variables have default values, but can be overwritten.
export P4_PORT=<port> # Default = 8000, in production, change to 8084.
export P4_DB_HOST=<databasae-host-ip> # Default = localhost
export P4_DB_PORT=<database-port> # Default = 27017
export P4_DB_NAME=<database-name> # Default = it2810-g22-p4.
export P4_AUTH_GOOGLE_CALLBACK=<google-oath2-callback-url> # Default = http://localhost:8000/auth/google-callback
```

With that all set up, just start the project!

``` bash
docker-compose up

# Note that you may need `sudo` on some systems and configurations to use this command.
# When using sudo, environment variables from your current shell will not work!
# To avoid this on a linux system, add your user to the Docker group with the following command.
# You need to log out and log in again for these changes to take effect.

sudo usermod -aG docker $USER
```

The project will then be available in your browser at `localhost:8000`!

## Setup with Angular-CLI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.9.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test -sm=false` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
