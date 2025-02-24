// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)


// Okay, Are.na stuff!
let channelSlug = "amazon-forest"; // The “slug” is just the end of the URL


// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
    let channelTitle = document.querySelector('#channel-title');
    let channelDescription = document.querySelector('#channel-description');
    let channelCount = document.querySelector('#channel-count');
    let channelLink = document.querySelector('#channel-link');

    // Remove these elements since we are not displaying them
    if (channelTitle) channelTitle.remove();
    if (channelDescription) channelDescription.remove();
    if (channelCount) channelCount.remove();
    if (channelLink) channelLink.remove();
};




// Fetch the data from Are.na API
// fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
//     .then((response) => response.json())
//     .then((data) => {
//         console.log(data); // Always good to check your response!
//         placeChannelInfo(data);
        
//         // Loop through the contents and render only relevant ones
//         data.contents.reverse().forEach((block) => {
//             renderBlock(block);
//         });
//     });












// Function to filter and place blocks into the correct section
let renderBlock = (block) => {
    let pastContainer = document.querySelector('#past');
    let presentContainer = document.querySelector('#present');
    let defaultContainer = document.querySelector('#channel-blocks'); // Default grid for unlabeled content

    // Ensure the block has a title before checking
    let title = block.title ? block.title.toLowerCase() : "";
    let isPast = title.includes("[past]");
    let isPresent = title.includes("[present]");

    console.log(`Block Title: ${block.title}, isPast: ${isPast}, isPresent: ${isPresent}`); // Debugging to check if filtering is working
    
    let blockItem = document.createElement("div");
    blockItem.classList.add("block-item");
    
    // Handling different content types
    if (block.class === 'Image') {
        blockItem.innerHTML = `<img src="${block.image.original.url}" alt="${block.title}">`;
    } else if (block.class === 'Text') {
        blockItem.innerHTML = `<p>${block.content}</p>`;
    } else if (block.class === 'Attachment' && block.attachment.content_type.includes('video')) {
        blockItem.innerHTML = `<video controls src="${block.attachment.url}"></video>`;
    } else if (block.class === 'Attachment' && block.attachment.content_type.includes('audio')) {
        blockItem.innerHTML = `<audio controls src="${block.attachment.url}"></audio>`;
    }
    else if (block.class === 'Link') { //for links
        blockItem.innerHTML = `<a href="${block.source.url}" target="_blank">${block.title || 'Open Link'}</a>`;
    }
    
    
    // Append the block to the correct section or default grid
    if (isPast) {
        pastContainer.appendChild(blockItem);
    } else if (isPresent) {
        presentContainer.appendChild(blockItem);
    } else {
        defaultContainer.appendChild(blockItem); // Show content with no labels in the grid
    }
};

// Hover-based Desaturation Effect for split sections
// document.querySelector("#past").addEventListener("mouseenter", () => {
//     document.querySelector("#present").style.filter = "grayscale(100%)";
//     document.querySelector("#past").style.filter = "grayscale(0%)";
// });

// document.querySelector("#present").addEventListener("mouseenter", () => {
//     document.querySelector("#past").style.filter = "grayscale(100%)";
//     document.querySelector("#present").style.filter = "grayscale(0%)";
// });

// document.querySelector("#past").addEventListener("mouseleave", () => {
//     document.querySelector("#past").style.filter = "grayscale(0%)";
//     document.querySelector("#present").style.filter = "grayscale(0%)";
// });

// document.querySelector("#present").addEventListener("mouseleave", () => {
//     document.querySelector("#past").style.filter = "grayscale(0%)";
//     document.querySelector("#present").style.filter = "grayscale(0%)";
// });




// document.addEventListener("DOMContentLoaded", () => {
//     let pastSection = document.querySelector("#past");
//     let presentSection = document.querySelector("#present");

//     pastSection.addEventListener("scroll", () => {
//         presentSection.scrollTop = pastSection.scrollTop;
//     });

//     presentSection.addEventListener("scroll", () => {
//         pastSection.scrollTop = presentSection.scrollTop;
//     });
// });




// document.addEventListener("DOMContentLoaded", () => {
//     let pastSection = document.querySelector("#past");
//     let presentSection = document.querySelector("#present");

//     function adjustHeight() {
//         let windowHeight = window.innerHeight;
//         pastSection.style.height = `${windowHeight}px`;
//         presentSection.style.height = `${windowHeight}px`;
//     }

//     adjustHeight();
//     window.addEventListener("resize", adjustHeight);
// });









//  Fetch API Data (Loads Are.na Content)
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        placeChannelInfo(data);

        // Ensure existing content is cleared before appending new blocks
        document.querySelector("#past").innerHTML += ""; // Preserve header, clear existing blocks
        document.querySelector("#present").innerHTML += "";

        // Loop through and place blocks into the correct sections
        data.contents.reverse().forEach((block) => {
            let pastContainer = document.querySelector('#past');
            let presentContainer = document.querySelector('#present');

            let title = block.title ? block.title.toLowerCase() : "";
            let isPast = title.includes("[past]");
            let isPresent = title.includes("[present]");

            let blockItem = document.createElement("div");
            blockItem.classList.add("block-item");

            if (block.class === 'Image') {
                blockItem.innerHTML = `<img src="${block.image.original.url}" alt="${block.title}">`;
            } else if (block.class === 'Text') {
                blockItem.innerHTML = `<p>${block.content}</p>`;
            } else if (block.class === 'Attachment' && block.attachment.content_type.includes('video')) {
                blockItem.innerHTML = `<video controls src="${block.attachment.url}"></video>`;
            } else if (block.class === 'Attachment' && block.attachment.content_type.includes('audio')) {
                blockItem.innerHTML = `<audio controls src="${block.attachment.url}"></audio>`;
            }

            if (isPast) {
                pastContainer.appendChild(blockItem);
            } else if (isPresent) {
                presentContainer.appendChild(blockItem);
            }
        });

        // 🚀 Ensure content is hidden initially
        document.querySelectorAll("#past .block-item, #present .block-item").forEach(item => {
            item.style.display = "none";
        });
    })
    .catch(error => console.error("Error fetching data:", error));





//  Toggle Function (Reveals Content On Click)
document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".toggle-section");
    const pastBlocks = document.querySelectorAll("#past .block-item");
    const presentBlocks = document.querySelectorAll("#present .block-item");

    // Initially hide all blocks, keeping only the title & button visible
    pastBlocks.forEach(block => (block.style.display = "none"));
    presentBlocks.forEach(block => (block.style.display = "none"));

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const target = this.getAttribute("data-target");

            if (target === "past") {
                pastBlocks.forEach(block => (block.style.display = "flex"));
                presentBlocks.forEach(block => (block.style.display = "none"));
            } else {
                presentBlocks.forEach(block => (block.style.display = "flex"));
                pastBlocks.forEach(block => (block.style.display = "none"));
            }
        });
    });
});








// This code is trying to make the hover on intro section work

// document.addEventListener("DOMContentLoaded", function () {
//     let heroSection = document.getElementById("hero");
//     let pastButton = document.getElementById("past-btn");
//     let presentButton = document.getElementById("present-btn");

//     document.querySelector(".hover-left").addEventListener("mouseenter", function () {
//         heroSection.classList.add("hero-past");
//         heroSection.classList.remove("hero-present");
//         pastButton.style.opacity = "1";
//         presentButton.style.opacity = "0";
//     });

//     document.querySelector(".hover-right").addEventListener("mouseenter", function () {
//         heroSection.classList.add("hero-present");
//         heroSection.classList.remove("hero-past");
//         presentButton.style.opacity = "1";
//         pastButton.style.opacity = "0";
//     });

//     heroSection.addEventListener("mouseleave", function () {
//         heroSection.classList.remove("hero-past", "hero-present");
//         pastButton.style.opacity = "0";
//         presentButton.style.opacity = "0";
//     });
// });




document.addEventListener("DOMContentLoaded", function () {
    let heroSection = document.getElementById("hero");
    let pastButton = document.getElementById("past-btn");
    let presentButton = document.getElementById("present-btn");
    let heroImage = document.querySelector(".hero-background");

    document.querySelector(".hover-left").addEventListener("mouseenter", function () {
        heroSection.classList.add("hero-past");
        heroSection.classList.remove("hero-present", "hero-middle");
        heroImage.src = "assets/hero image.png"; // Default rainforest image
        pastButton.style.opacity = "1";
        presentButton.style.opacity = "0";
    });

    document.querySelector(".hover-right").addEventListener("mouseenter", function () {
        heroSection.classList.add("hero-present");
        heroSection.classList.remove("hero-past", "hero-middle");

         heroImage.src = "assets/ForestFireImage.jpg"; // Fire image
        
        presentButton.style.opacity = "1";
        pastButton.style.opacity = "0";
    });

    document.querySelector(".hover-middle").addEventListener("mouseenter", function () {
        heroSection.classList.add("hero-middle");
        heroSection.classList.remove("hero-past", "hero-present");
        heroImage.src = "assets/hero image.png"; // Neutral state, default image
        pastButton.style.opacity = "0";
        presentButton.style.opacity = "0";
    });

    heroSection.addEventListener("mouseleave", function () {
        heroSection.classList.remove("hero-past", "hero-present", "hero-middle");
        heroImage.src = "assets/hero image.png"; // Reset to default image
        pastButton.style.opacity = "0";
        presentButton.style.opacity = "0";
    });
});





//CUSTOM CURSOR AND BUTTON ON HOVER

// document.addEventListener("DOMContentLoaded", function () {
//     let cursor = document.getElementById("custom-cursor");
//     let cursorImg = document.getElementById("cursor-img");
//     let pastBtn = document.getElementById("past-btn");
//     let presentBtn = document.getElementById("present-btn");
//     let hero = document.getElementById("hero");

//     document.addEventListener("mousemove", function (e) {
//         let x = e.clientX;
//         let y = e.clientY;

//         // Move cursor image smoothly
//         cursor.style.left = `${x}px`;
//         cursor.style.top = `${y}px`;

//         // Button placement
//         pastBtn.style.left = `${x - 10}px`;
//         pastBtn.style.top = `${y + 60}px`;

//         presentBtn.style.left = `${x + 10}px`;
//         presentBtn.style.top = `${y + 60}px`;
//     });

//     // When hovering left (Show Past)
//     document.querySelector(".hover-left").addEventListener("mouseenter", function () {
//         cursorImg.src = "assets/left-arrow.svg";
//         cursor.style.opacity = "1"; // Ensure cursor is visible
//         pastBtn.style.opacity = "1"; // Show button
//         presentBtn.style.opacity = "0"; // Hide other button
//     });

//     // When hovering right (Show Present)
//     document.querySelector(".hover-right").addEventListener("mouseenter", function () {
//         cursorImg.src = "assets/right-arrow.svg";
//         cursor.style.opacity = "1"; // Ensure cursor is visible
//         presentBtn.style.opacity = "1"; // Show button
//         pastBtn.style.opacity = "0"; // Hide other button
//     });

//     // When in middle zone (Reset cursor)
//     hero.addEventListener("mouseleave", function () {
//         cursorImg.src = "";
//         cursor.style.opacity = "0"; // Hide cursor when leaving
//         pastBtn.style.opacity = "0";
//         presentBtn.style.opacity = "0";
//     });
// });






// CUSTOM CURSOR AND BUTTON ON HOVER



// document.addEventListener("DOMContentLoaded", function () {
//     let cursor = document.getElementById("custom-cursor");
//     let cursorImg = document.getElementById("cursor-img");
//     let pastBtn = document.getElementById("past-btn");
//     let presentBtn = document.getElementById("present-btn");
//     let hero = document.getElementById("hero");

//     document.addEventListener("mousemove", function (e) {
//         let x = e.clientX;
//         let y = e.clientY;

//         // Move cursor image
//         cursor.style.left = `${x}px`;
//         cursor.style.top = `${y}px`;

//         // Move buttons below cursor
//         pastBtn.style.left = `${x}px`;
//         pastBtn.style.top = `${y + 50}px`;

//         presentBtn.style.left = `${x}px`;
//         presentBtn.style.top = `${y + 50}px`;
//     });

//     // Hover on left → Show Past
//     document.querySelector(".hover-left").addEventListener("mouseenter", function () {
//         cursorImg.src = "assets/left-arrow.svg";
//         cursor.style.opacity = "1"; 
//         pastBtn.style.opacity = "1"; 
//         presentBtn.style.opacity = "0"; 
//     });

//     // Hover on right → Show Present
//     document.querySelector(".hover-right").addEventListener("mouseenter", function () {
//         cursorImg.src = "assets/right-arrow.svg";
//         cursor.style.opacity = "1"; 
//         presentBtn.style.opacity = "1"; 
//         pastBtn.style.opacity = "0"; 
//     });

//     // Leave middle → Hide cursor & buttons
//     hero.addEventListener("mouseleave", function () {
//         cursorImg.src = "";
//         cursor.style.opacity = "0"; 
//         pastBtn.style.opacity = "0";
//         presentBtn.style.opacity = "0";
//     });
// });


//Custom Hover function on intro page

document.addEventListener("DOMContentLoaded", function () {
    let cursor = document.getElementById("custom-cursor");
    let cursorImg = document.getElementById("cursor-img");
    let pastBtn = document.getElementById("past-btn");
    let presentBtn = document.getElementById("present-btn");
    let hero = document.getElementById("hero");

    function updateCursorPosition(e) {
        let x = e.clientX;
        let y = e.clientY;

        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;

        // Move floating buttons slightly below the cursor
        pastBtn.style.left = `${x}px`;
        pastBtn.style.top = `${y + 60}px`;

        presentBtn.style.left = `${x}px`;
        presentBtn.style.top = `${y + 60}px`;
    }

    function showPast() {
        cursorImg.src = "assets/left-arrow.svg";
        cursor.style.opacity = "1"; 
        pastBtn.style.opacity = "1"; 
        presentBtn.style.opacity = "0"; 
    }

    function showPresent() {
        cursorImg.src = "assets/right-arrow.svg";
        cursor.style.opacity = "1"; 
        presentBtn.style.opacity = "1"; 
        pastBtn.style.opacity = "0"; 
    }

    function resetCursor() {
        cursorImg.src = "";
        cursor.style.opacity = "0"; 
        pastBtn.style.opacity = "0";
        presentBtn.style.opacity = "0";
    }

    function handleClick(e) {
        let screenWidth = window.innerWidth;
        let clickX = e.clientX;

        if (clickX < screenWidth / 2) {
            window.location.href = "past.html";
        } else {
            window.location.href = "present.html";
        }
    }

    // Attach event listeners
    document.addEventListener("mousemove", updateCursorPosition);
    document.querySelector(".hover-left").addEventListener("mouseenter", showPast);
    document.querySelector(".hover-right").addEventListener("mouseenter", showPresent);
    hero.addEventListener("mouseleave", resetCursor);
    document.addEventListener("click", handleClick);
});
