const HTTP_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409
}

//Default values of each slide type
const SLIDE_TYPE_DEFAULT = {
    A: { type: "A", text: ""},
    B: { type: "B", text: "", image: ""},
    C: { type: "C", list: []},
    D: { type: "D", link: ""}
}

//Time until a presentation is updated automatically
const WAIT_TO_UPDATE = 2;

// Result text fields
let txtResultCreate = document.getElementById('txtResultCreate');
let txtResultLogin = document.getElementById('txtResultLogin');
let txtResultUpdate = document.getElementById('txtResultUpdate');
let txtResultSharing = document.getElementById("txtResultSharing");
let savingText = document.getElementById("saving-text");

//------------------- Users ---------------------------
let inpNameCreate = document.getElementById('inpNameCreate');
let inpEmailCreate = document.getElementById('inpEmailCreate');
let inpPasswordCreate = document.getElementById('inpPasswordCreate');

let inpNameLogin = document.getElementById('inpNameLogin');
let inpPasswordLogin = document.getElementById('inpPasswordLogin');

let inpNameUpdate = document.getElementById('inpNameUpdate');
let inpEmailUpdate = document.getElementById('inpEmailUpdate');
let inpPasswordUpdate = document.getElementById('inpPasswordUpdate');

// Credentials of the current user
let currentUser = {};

//---------------- Presentations ---------------------------
let presName = document.getElementById("presName");

// Presentations of the current user
let userPresentations = [];

// Slides of the current presentation
let helperSlides = {code: null, data: []};

// Information about the seconds elapsed since a change has been made in the presentation
let updateTimer = {
    value: 0,
    interval: null
}

// elements that need to be updated
let updateTasks = [];

// Information of the current presentation
let currentPres = {
    ID: null,
    name: "",
    owner: "",
    theme: "",
    last_updated: ""
}

// Information of the current slide
let selectedSlide = {
    slideid: null,
    data: {}
}