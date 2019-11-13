'use strict';

//global variables
const pageOne = './data/page-1.json';
const pageTwo = './data/page-2.json';

//global array to hold animals
let animalArray = [];

//constructor function
function Animal(obj) {
  for(let key in obj){
    this[key] = obj[key];
  }
}

Animal.prototype.toHtml = function() {
  let source = $('#photo-template').html();
  let template = Handlebars.compile(source);
  return template(this);
};

Animal.prototype.toDropdown = function() {
  let source = $('#animalList').html();
  let template = Handlebars.compile(source);
  console.log('dania',source)
  return template(this);
};
// read json
const readJson = (pageNumber) => {

  animalArray = [];
  $.get(pageNumber)
    .then(animalData => {
      animalData.forEach(animal => {
        animalArray.push(new Animal(animal));
      });
    })
    .then(titleSort);
};

//read global array activate render
const loadAnimals = () => {
  animalArray.forEach(animal => {

    $('main').append(animal.toHtml());
  });
  dropDrown();
};

//function to build and display dropdown menu
const dropDrown = () => {
  animalArray.forEach(animal => {
    let exists = false;
    $('#selectBox option').each(function(){
      if(this.value === animal.keyword){
        exists = true;
      }
    });
    if(exists === false){
      //add element to parent
      $('select').append(animal.toDropdown());
    }
  });
};

//Event handler function
let animalSelector = (event) => {
  $('section').hide();
  let img = $(`img[value="${event.target.value}"]`).parent();
  $(img).show();
};

//Drop-down list event handler
$('#selectBox').on('change', animalSelector);

// Json page selector functions
let pageOneSelector = () => {
  // Animal.holdingArray = [];
  $('section').remove();
  readJson(pageOne);
};
let pageTwoSelector = () => {
  // Animal.holdingArray = [];
  $('section').remove();
  readJson(pageTwo);
};

//Sort functions
let titleSort = () => {
  animalArray.forEach( () => {
    animalArray.sort( (a,b) => {
      if(a.title < b.title){
        return -1;
      }
      if(a.title > b.title){
        return 1;
      }
      return 0;
    });
    return animalArray;
  });
  $('section').remove();
  loadAnimals();
};

let hornSort = () => {
  animalArray.forEach( () => {
    animalArray.sort( (a,b) => {
      return a.horns - b.horns;
    });
    return animalArray;
  });
  $('section').remove();
  loadAnimals();
};

//Button event handlers to switch pages
$('#pageOne').on('click', pageOneSelector);
$('#pageTwo').on('click', pageTwoSelector);

//Button event handlers to sort
$('#title').on('click', titleSort);
$('#horns').on('click', hornSort);
//start it off
$(() => readJson(pageOne));