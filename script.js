/*
    This file contains all JavaScript code
    for interacting with the remove Web API
    provided by https://thecatapi.com/.
    Author: Jonathan Kipper
    File: script.js
    Date: 6-8-2020
    Josh, this is my unique API Key, just wanted to make it easier for you: 76f46c52-8640-4ae5-a343-8b8a50124bdf
 */

let firstRun = true;

window.onload = function () {
    //initially loads all of the information
    let button = document.querySelector("button").onclick = function () {
        loadInformation();
    };
   loadInformation();
};

/**
 * This function takes the initial drop down list, and fills it with all of the different cat breeds
 */
function loadInformation() {
    console.log("RAN!");
    fetch("https://api.thecatapi.com/v1/breeds", {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "76f46c52-8640-4ae5-a343-8b8a50124bdf"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {

            if (firstRun) {
                //iterates through the json file and creates all of the elements for the select list and populates it
                for (let i = 0; i < json.length; i++) {
                    //references the select element
                    let select = document.getElementById("breeds");
                    let newTag = document.createElement('option');
                    newTag.appendChild(document.createTextNode(json[i].name));
                    select.appendChild(newTag);
                }

                //initially loads the information into it
                applyInformation(json, 0);
                firstRun = false;
            }
            else {
                //accesses the dropdown list
                let tmp = document.getElementById("breeds");

                //finds the index location for the selected dog name
                let index = 0;
                for (let i = 0; i < json.length; i++) {
                    if (json[i].name === tmp.value) {
                        index = i;
                        i = json.length++;
                    }
                }

                //calls the function
                applyInformation(json, index);
            }
        })
        //catches any errors and reports it
        .catch(function (error) {
            console.log("Error occurred during populateDropdownList function!")
        });
}

/**
 * updates the screen information for the json file given an index location (a lot more efficient than simply retyping the
 * same code over and over again)
 * @param json this is the json file
 * @param index this is the location in the json file to be looked at
 */
function applyInformation(json, index) {
    //selects the elements which are straight forward
    let name = document.getElementById("name");
    let description = document.getElementById("description");
    let origin = document.getElementById("origin");
    let lifeSpan = document.getElementById("life-span");

    //assigns those elements their respective new values
    name.innerHTML = json[index].name;
    description.innerHTML = json[index].description;
    origin.innerHTML = json[index].origin;
    lifeSpan.innerHTML = json[index]["life_span"];

    //deals with all of the values where it requires text parsing as well:
    //child Friendly
    let childFriendly = document.getElementById("child-friendly");
    //childFriendly.innerHTML = json[index]["child_friendly"];

    switch (json[index]["child_friendly"]) {
        case 1:
            childFriendly.innerHTML = "Very unfriendly (1)";
            break;
        case 2:
            childFriendly.innerHTML = "Unfriendly (2)";
            break;
        case 3:
            childFriendly.innerHTML = "Indifferent (3)";
            break;
        case 4:
            childFriendly.innerHTML = "Friendly (4)";
            break;
        case 5:
            childFriendly.innerHTML = "Very friendly (5)";
            break;
    }

    //dog Friendly
    let dogFriendly = document.getElementById("dog-friendly");
    switch (json[index]["dog_friendly"]) {
        case 1:
            dogFriendly.innerHTML = "Very unfriendly (1)";
            break;
        case 2:
            dogFriendly.innerHTML = "Unfriendly (2)";
            break;
        case 3:
            dogFriendly.innerHTML = "Indifferent (3)";
            break;
        case 4:
            dogFriendly.innerHTML = "Friendly (4)";
            break;
        case 5:
            dogFriendly.innerHTML = "Very friendly (5)";
            break;
    }
    
    //energy levels
    let energyLevel = document.getElementById("energy-level");
    switch (json[index]["energy_level"]) {
        case 1:
            energyLevel.innerHTML = "Like a sloth (1)";
            break;
        case 2:
            energyLevel.innerHTML = "Slow moving (2)";
            break;
        case 3:
            energyLevel.innerHTML = "Energetic (3)";
            break;
        case 4:
            energyLevel.innerHTML = "A ball of energy (4)";
            break;
        case 5:
            energyLevel.innerHTML = "Bouncing off the walls (5)";
            break;
    }
    
    //social needs
    let socialNeeds = document.getElementById("social-needs");
    switch (json[index]["social_needs"]) {
        case 1:
            socialNeeds.innerHTML = "Antisocial (1)";
            break;
        case 2:
            socialNeeds.innerHTML = "A loner (2)";
            break;
        case 3:
            socialNeeds.innerHTML = "Indifferent (3)";
            break;
        case 4:
            socialNeeds.innerHTML = "Needs Friends (4)";
            break;
        case 5:
            socialNeeds.innerHTML = "Very needy (5)";
            break;
    }

    //deals with the wikipedia link with an a tag creation
    let learnMore = document.getElementById("wiki");
    learnMore.innerHTML = "";
    let a = document.createElement('a');
    let textValue = document.createTextNode("Wikipedia");
    a.appendChild(textValue);
    a.href = json[index]["wikipedia_url"];
    learnMore.appendChild(a);

    //sets the images for the page
    let breed = json[index].id;
    setImages(breed);
}

//sets the images
function setImages(breed) {
    let theURL = "https://api.thecatapi.com/v1/images/search?breed_id=" + breed + "&limit=10";

    fetch(theURL, {
        method: "GET",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "76f46c52-8640-4ae5-a343-8b8a50124bdf"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            let nameOfElement = "pic";

            console.log("LENGTH: " + json.length);

            for (let i = 0; i < json.length; i++) {
                nameOfElement = nameOfElement + (i + 1);
                console.log("NAME: " + nameOfElement);

                let image = document.getElementById(nameOfElement);
                image.setAttribute("src", json[i].url);
                image.setAttribute("width", 200);
                image.setAttribute("height", 200);

                nameOfElement = "pic";
            }

            //in case the number of pics is less than 10, it deletes the ones from the previous search/cat
            if (json.length < 10) {
                nameOfElement = "pic";

                for (let i = json.length; i < 10; i++) {
                    nameOfElement = nameOfElement + (i+1);

                    let list = document.getElementById(nameOfElement);
                    // list.setAttribute("src", "");
                    list.removeAttribute("src");
                    list.removeAttribute("width");
                    list.removeAttribute("height");

                    nameOfElement = "pic";
                }
            }
        });
}