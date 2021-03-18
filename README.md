# Github Search Project
An Angular app to search github users and repositories

#  Features implemented 
  - Animation on input and dropdown to search github users and repositories using @angular/animations
  - Make API call when 3 or more characters are entered
  - State management and storing search results in cache using @ngrx/store
  - Adding debounce time before API call
  - Show empty screen when the input is clear
  - Show 'No data found' message when there are no reults from API
  - Handle API error
  - Responsive design
  - Infinite Scrolling

# Installation
  $ npm install 
  $ ng serve
  - Please add Redux Devtools extension in chrome to view the store
  $ ng test 

# Project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
