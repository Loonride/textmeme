handleDragOver = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

handleImageUploads = function(id, f) {
    var self = this;
    var fileDrop = document.getElementById(id);
    fileDrop.addEventListener('dragover', handleDragOver, false);
    fileDrop.addEventListener('drop', function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var file = evt.dataTransfer.files[0];

        $("#" + id).text(file.name);

        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function() {
            f(reader.result);
        }
    }, false);
}

handleText = function(data, isImage, side) {
    let elem = null;
    if (isImage) {
        elem = $(`<img src="${data}">`);
    }
    else {
        elem = $(`<div>${data}</div>`);
    }

    let divs = $("#text > div");

    if (divs.length > 0 && side == divs.last().attr("class")) {
        elem.appendTo(divs.last());
    }
    else {
        let newDiv = $(`<div class="${side}"></div>`);
        elem.appendTo(newDiv);
        newDiv.appendTo($("#text"));
    }
}

$(document).ready(function() {
    $("#reset").click(e => $("#text").empty());

    handleImageUploads("profile-image", function(src) {
        $("#pro-pic").attr("src", src);
    });

    $("#name-input").on('change keyup paste', function() {
        $("#name").text($(this).val());
    });

    let imgSrc = null; 

    handleImageUploads("text-image", function(src) {
        imgSrc = src;
        $("#text-input").val("");
    });

    $(".send-btn").click(function() {
        let side = $(this).attr("id");
        let text = $("#text-input").val();

        
        if (text != "") {
            handleText(text, false, side);
        }
        else if (imgSrc) {
            handleText(imgSrc, true, side);
        }
    });

    $("#download").click(function() {
        html2canvas(document.querySelector("#phone")).then(canvas => {
            var link = document.createElement('a');
            link.setAttribute('download', 'screenshot.png');
            link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
            link.click();
        });
    });//
});