let socket = io('/');
let nameAndRole = {
    name: "",
    role: ""
};
let data = {
};

socket.on('connect', function() {
    console.log("You are onnected: " + socket.id);
});

socket.on('disconncted', function() {
    socket.emit('disconnected', socket.id);
});

var searchButton = $("#button-search");
var textField = $("#search")[0];
var textLable = $("label.input__label.input__label--hoshi.input__label--hoshi-color-0")[0];
var barCount = 4;
var barHolders = [];
var illustrationHolders = [
    [0, 0],
    [0, 1],
    [0, 2]
];

let wordCount;
let allMessage;

$(window).load(function () {
    centerContent();
});

$(window).resize(function () {
    centerContent();
});

// Button listener
$("#button-next")[0].addEventListener("click", function(){
    if ($("#input-4").val().trim().length === 0) {
        textField.classList.add("input__label--error");
        setTimeout(function () {
            textField.classList.remove("input__label--error");
        }, 300);
    } else {
        // Change the page
        nameAndRole.name = $("#input-4").val();
        socket.emit('setNameAndRole', nameAndRole);
    }
});

function centerContent() {
    var container = $('#home');
    var content = $('#main');
    content.css("left", (container.width() - content.width()) / 2);
    content.css("top", ($(window).height() - content.height()) / 2 + 32);
}

// Callback function after valid search request
function chart() {
    reveal();
    bars();
}

// Reveal the chart
function reveal() {
    $(".notes").css("visibility", "visible");
}

// Creating visulization bars
function bars() {

    var hoverHolder = $(".barHolder")[0];
    
    hoverHolder.addEventListener("mouseover", function (e) {
        if (e.target && e.target.nodeName == "SPAN") {
            console.log("Hovered!")
            $('.desc').css('display', 'block')

            var index = e.target.className.split('--')[1];
            $(".illustrations--header")[0].innerHTML = allMessage.wordData[index].date;
            $(".illustrations--paragraph")[0].innerHTML = `${allMessage.wordData[index].name}, mentioned ${allMessage.word} ${allMessage.wordData[index].wordCount} time(s).`;
        }
    });
    hoverHolder.addEventListener("mouseout", function (e) {
        if (e.target && e.target.nodeName == "SPAN") {
            $('.desc').css('display', 'none')
            $(".illustrations--header")[0].innerHTML = "";
            $(".illustrations--paragraph")[0].innerHTML = "";
        }
    });

    var bars = $(".barHolder")[0];
    var illustrations = $(".illustrationsHolder")[0];


    let wordCount = allMessage.wordData.map(data => data.wordCount)
    wordCount = mapping(wordCount, 300, 40)
    // Create bars
    for (i = 0; i < allMessage.wordData.length; i++) {
        var j = wordCount[i]
        barHolders[i] = document.createElement("span");
        // sheet.insertRule(`.bars--${i} { height: ${j}px;}`, 0);
        sheet.insertRule(`.bars--${i} {height: ${j}px;}`, sheet.cssRules.length);
        barHolders[i].setAttribute("class", `bars bars--${i}`);
        bars.appendChild(barHolders[i]);
    }
}

$('.barHolder').on('mousemove', function(e){
    if (e.pageX+20 < ($(window).width())/4*3) {
        $('.desc').css({
            left:  e.pageX + 20,
            top:   e.pageY - 100
         });
    } else {
        $('.desc').css({
            left:  e.pageX - 300,
            top:   e.pageY - 100
         });
    }
});


function mapping(wordCount, max, min){
    wordCount = wordCount.map((data) => {
        let local_max = Math.max(...wordCount)
        let local_min = Math.min(...wordCount)
        
        return (local_max-local_min) == 0? (max + min)/2:data/(local_max - local_min) * (max - min) + min
    })

    return wordCount
}

function changeOp(cnt){
    let barName = '.bars--'+cnt
    $(barName).css('opacity',1)
    if(cnt-1 >= 0){
        barName = '.bars--'+(cnt-1)
        $(barName).css('opacity',0.5)
    }

}