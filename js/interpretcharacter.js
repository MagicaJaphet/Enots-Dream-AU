var path = window.location.pathname;
var character = path.split("/").pop().replace("%20", " ").split(".")[0].trim();

function createElement(type, classes, textContent, appendContainer) {
    let element = document.createElement(type);
    element.classList = classes;
    element.textContent = textContent;
    if (typeof(appendContainer) == "object") {
        appendContainer.appendChild(element);
    }
    return element;
}

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Fetch character information
fetch("../assets/Character bios.txt")
.then((res) => {
    if (res.ok) {
        return res.text();
    }
} )
.then((text) => {
    let mainBody = createElement("div", "container-xl", null, document.body);
    createElement("div", "title header m-0", character, mainBody);

    if (text != null && text.length > 0 && text.includes("{")) {
        let foundInfo = false;
        text.split("{").forEach((name) => {
            if (name != null && name.length > 0 && name.includes("}")) {
                let characterName = name.split("}")[0];
                // Then if this is the page's character, process info
                if (characterName.toLowerCase() == character.toLowerCase()) {
                    foundInfo = true;
                    let characterInfo = name.split("}")[1];
                    
                    // Auto generate HTML template for characters!!
                    let container = createElement("div", "container mx-auto mb-5 text-white row g-0", null, mainBody);
                    
                    let characterContainer = createElement("div", "rounded-start-3 bg-dark col-lg-4", null, container);
                    let characterImage = createElement("div", "m-3", null, characterContainer);
                    let paletteContainer = createElement("div", "justify-content-center m-3 d-flex flex-wrap", null, characterContainer);

                    let infoContainer = createElement("div", "col-lg-8 d-flex flex-column", null, container);
                    let shortInfo = createElement("div", "p-2 rounded-end-3 bg-dark", null, infoContainer);
                    let list = createElement("ul", "list-style-none", null, shortInfo);

                    let bio = createElement("div", "bg-dark mt-2 ms-md-2 rounded-2 p-4 flex-fill", null, infoContainer);
                    if (characterInfo.length > 0 && characterInfo.includes("[")) {
                        characterInfo.split("\n").forEach((infoString) => {
                            if (infoString != null && infoString.length > 0) {
                                let currentType = infoString.slice(1, infoString.indexOf("]")).trim();
                                let info = infoString.slice(infoString.indexOf("]") + 1).trim();
                                if (info != null && info.length > 0) {
                                    switch(currentType) {
                                        case "Image":
                                            let image = createElement("img", "img-fluid rounded-3", null, characterImage);
                                            image.src = info;
                                            break;
    
                                        case "Colors":
                                            let colors = [];
                                            if (info.includes(",")) {
                                                colors = info.split(",");
                                            }
                                            else {
                                                colors = [info];
                                            }

                                            colors.forEach((color) => {
                                                let colorSwatch = createElement("div", "text-center m-1 rounded-2", color, paletteContainer);
                                                colorSwatch.style.backgroundColor = color;
                                                colorSwatch.style.width = "80px";
                                                colorSwatch.style.height = "80px";
                                                colorSwatch.style.lineHeight = "80px";
                                                let colorArray = hexToRgb(color);
                                                let brightness = Math.round(((colorArray.r * 299) + (colorArray.g * 587) + (colorArray.b * 114)) / 1000);
                                                if (brightness > 150) {
                                                    colorSwatch.classList.add("text-black");
                                                }
                                            });
                                            break;
    
                                        case "Titles":
                                        case "Name":
                                        case "Pronouns":
                                        case "Age":
                                        case "Height":
                                        case "Food":
                                        case "Personality":
                                            let row = createElement("li", "row align-items-center my-2", null, list);
                                            createElement("div", "card py-1 col-3 text-center bg-light", currentType, row);
                                            switch(currentType) {
                                                case "Pronouns":
                                                    info = info.replaceAll("/", " / ");
                                                    break;
                                                case "Age":
                                                    info = info + " Earth years"
                                                    break;
                                                case "Height":
                                                    let ft = Math.round((info * 0.393701) / 12);
                                                    let inches = Math.round((info * 0.393701) - (ft * 12));
                                                    info = ft + "'" + inches + "\" [" + info + " cm]";
                                                    break;
                                                case "Food":
                                                    let necessary = parseInt(info.split("|")[0]);
                                                    let extra = parseInt(info.split("|")[1]);
                                                    info = "";
                                                    for (let i = 0; i < necessary; i++) {
                                                        info += "◯";
                                                    }
                                                    info += "|";
                                                    for (let i = 0; i < extra; i++) {
                                                        info += "◯";
                                                    }
                                                    info += " [" + necessary + " | " + extra +"]";
                                                    break;
                                            }
                                            createElement("div", "col pe-3", info, row);
                                            break;

                                        case "Bio":
                                            let innerBio = createElement("div", "d-flex", null, bio);
                                            let imageElement = createElement("img", "border mx-auto", null, innerBio);
                                            imageElement.src = "/assets/temp.png";
                                            imageElement.style.width = "150px";
                                            imageElement.style.height = "250px";
                                            let textElement = createElement("div", "w-100 ps-4", null, innerBio);
                                            let pClasses = "m-0 mb-3";
                                            if (info.includes("<LINE>")) {
                                                info.split("<LINE>").forEach((line) => {
                                                    let p = createElement("p", pClasses, "> " + line, textElement);
                                                    p.style.fontSize = "3.5mm";
                                                });
                                            }
                                            else {
                                                let p = createElement("p", pClasses, "> " + info, textElement);
                                                p.style.fontSize = "3.5mm";
                                            }
                                            break;
                                    }
                                }
                            }
                        });
                    }
                }
            }
        })

        if (!foundInfo) {
            let missingInfo = document.createElement("h1");
            missingInfo.textContent = "No information was found for this character.";
            mainBody.appendChild(missingInfo);
        }
    }
});