const HTTP_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409
}

//---------------------------------------------------
const SLIDE_TYPE_DEFAULT = {
    A: { type: "A", text: "New Slide", bgColor: "white" },
    B: { type: "B", text: "New Slide", image: "insert image link", bgColor: "white" },
    C: { type: "C", list: [], bgColor: "white" }
}

const WAIT_TO_UPDATE = 2;

//--------------- Result text -----------------------
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

let currentUser = {};

//---------------- Presentations ---------------------------
let presName = document.getElementById("presName");

let userPresentations = [];
let helperSlides = [];
let updateTimer = {
    value: 0,
    interval: null
}

let updateTasks = [];

let currentPres = {
    ID: null,
    name: "",
    owner: "",
    theme: "",
    last_updated: ""
}

let selectedSlide = {
    slideid: null,
    data: {}
}