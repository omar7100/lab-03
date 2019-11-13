'use strict';

const page1 = './data/page-1.json';
const page2 = './data/page-2.json';

function Horns(data) {
  this.image_url = data.image_url;
  this.title = data.title;
  this.description = data.description;
  this.keyword = data.keyword;
  this.horns = data.horns;
  Horns.all.push(this);
}
Horns.all = [];

Horns.prototype.render = function() {
  let templateMarkup =$('#photo-template').html();
  let template = Handlebars.compile(templateMarkup);
  let output = template(this);
  $('#output').append(output);
};


function populateSelectBox() {
  let seen = {};
  let select = $('select');
  Horns.all.forEach( (horn) => {
    if ( ! seen[horn.keyword] ) {
      let option = `<option value="${horn.keyword}">${horn.keyword}</option>`;
      select.append(option);
      seen[horn.keyword] = true;
    }
  });

  console.log(seen);
}
populateSelectBox();
$('select').on('change', function() {
  let selected = $(this).val();
  $('div').hide();
  $(`.${selected}`).fadeIn(800);
});
//  to show the two pages
const jsonPage = (pages) => {
  $.get(pages)
   .then(data =>{
     data.forEach(thing =>{
      let horn = new Horns(thing);
      horn.render();
    });
   })
}
$(() => jsonPage(page1));
let selectPage1 = () => {
  $('section').remove();
  jsonPage(page1);
};
let selectPage2 = () => {
  $('section').remove();
  jsonPage(page2);
};
$('#page1').on('click', selectPage1);
$('#page2').on('click', selectPage2);
