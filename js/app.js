let obName = [];
let obKeyword = [];
let obHorns = [];
let fileName = '../data/page-1.json';

const MyHorns = function(image_url, title, description, keyword, horns) {
  this.image_url = image_url;
  this.title = title;
  obName.push(this.title);
  this.description = description;
  this.keyword = keyword;
  obKeyword.push(this.keyword);
  this.horns = horns;
  obHorns.push(this.horns);
}

MyHorns.readJson = function(filename) {
  $.get(filename, 'json').then(myHornsJson => {
  //Creates the objects from the JSON
    myHornsJson.forEach(horn => {
      new MyHorns(horn.image_url, horn.title, horn.description, horn.keyword, horn.horns);
    });

    //removes duplicates in the arrays that will be pushed to selects later
    obName = removeDuplicates(obName);
    obKeyword = removeDuplicates(obKeyword);
    obHorns = removeDuplicates(obHorns);
    obHorns.sort(function(a, b) { return a - b }); //Sorts number array by number decending

    //Populates Select Filter By Name
    let opTypeId = 'type';
    restoreOpDefault(opTypeId);
    console.log(obKeyword);
    obKeyword.forEach(horn => {
      toHtmlOp(horn, opTypeId);
    });

    //Populates Select Filter by Horns
    let opHornId = 'horns';
    restoreOpDefault(opHornId);
    obHorns.forEach(horn => {
      toHtmlOp(horn, opHornId);
    });

    //Populates Select Filter by Name
    let opNameId = 'name';
    restoreOpDefault(opNameId);
    obName.forEach(horn => {
      toHtmlOp(horn, opNameId);
    });

    obKeyword = []; //Clears options to accept new drop down options
    obHorns = []; //Clears options to accept new drop down options
    obName = []; //Clears options to accept new drop down options

    //Populates the Images and Titles for the Images to the DOM
    myHornsJson.forEach(horn => {
      toHtmlImg(horn.image_url, horn.title, horn.keyword, horn.horns);
    });
  });
};

//Used to populate the Options Dropdown
function toHtmlOp(keyword, selectId) {
  let target = $('#opTemp').html(); // pulls the DIV element from the dom to populate later
  let context = { //inputs the variable into the two template elements
    'opClass': keyword,
    'opText': keyword
  };
  let templateScript = Handlebars.compile(target); //Compliles the target, empty option into the select element
  let html = templateScript(context); //Populates the empty option
  $('#' + selectId).append(html); //appends the data to the DOM
}

//Used to populate the image tags
function toHtmlImg(image_url, title, keyword, horns) {
  let target = $('#imgTemp').html();
  let context = {
    'imgKeyword': keyword,
    'imgTitle': title,
    'imgSrc': image_url,
    'imgHorn': horns
  };
  let templateScript = Handlebars.compile(target);
  let html = templateScript(context);
  $('main').append(html);
}

function restoreOpDefault(val) {
  let target = $('#opDefa').html();
  let context = {
    'default': val
  };
  let templateScript = Handlebars.compile(target); //Compliles the target, empty option into the select element
  let html = templateScript(context); //Populates the empty option
  $('#' + val).append(html); //appends the data to the DOM
}

//used to sort and remove elements in an array passed to it.
let removeDuplicates = function(arr) {
  let sortedArray = arr.sort();
  let len = sortedArray.length - 1;
  let newArr = [];
  if (len >= 0) {
    for (var i = 0; i < len; i++) {
      if (sortedArray[i] !== sortedArray[i + 1]) {
        newArr.push(sortedArray[i]);
      }
    }
    newArr.push(sortedArray[len]);
  }
  return newArr;
}

//Event listener and Changes the elements to page-1 JSON
$('#one').on('click', function() {
  fileName = '../data/page-1.json';
  $('div').remove();
  $('option').remove();
  $(() => MyHorns.readJson(fileName));
});

//Event listener and Changes the elements to page-2 JSON
$('#two').click(function() {
  fileName = '../data/page-2.json';
  $('div').remove();
  $('option').remove();
  $(() => MyHorns.readJson(fileName));
});

//Call to start everything off and load objects and load everythign into the DOM
$(() => MyHorns.readJson(fileName));

$('select').on('change', function() {
  $('div').hide();
  $('div.' + $(this).val()).show();
});