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

};










//I wanted to filter the blocks based on title string, so I wanted to understand how I could do it. Here in this function what I understood was that we are checking if the block has a title first, treating = lowercase so case is not an issue, and then assigning storing them in resp variables that would be used to filter the content. I took help from various sources for this function. [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes] [https://stackoverflow.com/questions/280634/endswith-and-startswith-functions-in-javascript] and some llm.


// Function to filter and place blocks into the correct section
let renderBlock = (block) => {
    let pastContainer = document.querySelector('#past');
    let presentContainer = document.querySelector('#present');
    let defaultContainer = document.querySelector('#channel-blocks'); //

    // Ensure the block has a title before checking
    let title = block.title ? block.title.toLowerCase() : "";
    let isPast = title.includes("[past]");
    let isPresent = title.includes("[present]");

    console.log(`Block Title: ${block.title}, isPast: ${isPast}, isPresent: ${isPresent}`); // Debugging to check if filtering is working
    
    let blockItem = document.createElement("div");
    blockItem.classList.add("block-item");

    let titleElement = document.createElement("div");
    titleElement.classList.add("block-title");
    titleElement.innerText = block.title || "Untitled"; // not have empty title

    
    //  content types
    if (block.class === 'Image') {
        blockItem.innerHTML = `<img src="${block.image.original.url}" alt="${block.title}">`;
    } 
    
    
    else if (block.class === 'Text') {
        blockItem.innerHTML = `<p>${block.content}</p>`;
    } 
    
    
    
    else if (block.class === 'Attachment' && block.attachment.content_type.includes('video')) {
        blockItem.innerHTML = `<video controls src="${block.attachment.url}"></video>`;
    } 
    
    
    
    else if (block.class === 'Attachment' && block.attachment.content_type.includes('audio')) {
        blockItem.innerHTML = `<audio controls src="${block.attachment.url}"></audio>`;
    }




    else if (block.class === 'Link') { 
        blockItem.innerHTML = `<a href="${block.source.url}" target="_blank">${block.title || 'Open Link'}</a>`;
    } 



    else if ((block.class === 'Media' || block.class === 'Link') && block.source?.url.includes("youtube") || block.source?.url.includes("youtu.be")) {
        blockItem.innerHTML = `<a href="${block.source.url}" target="_blank">${block.title || 'Watch Video'}</a>`;
    }
    
    
    
    else if (block.class === 'Attachment' && block.attachment.content_type.includes('pdf')) {
        blockItem.innerHTML = `
            <a href="${block.attachment.url}" target="_blank">
                <embed src="${block.attachment.url}" type="application/pdf" width="100%" height="500px">
            </a>
        `;
    }
    
    


    blockItem.appendChild(titleElement);

    
    
    if (isPast) {
        pastContainer.appendChild(blockItem);
    } else if (isPresent) {
        presentContainer.appendChild(blockItem);
    } else {
        defaultContainer.appendChild(blockItem); 
    }
};






  



//  Fetch API Data (Loads Are.na Content)
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        placeChannelInfo(data);

        // Ensure existing content is cleared before appending new blocks
        document.querySelector("#past").innerHTML += ""; // Preserve header, clear existing blocks
        document.querySelector("#present").innerHTML += "";

        data.contents.reverse().forEach((block) => {
            renderBlock(block); //  Now every block goes through filtering & proper handling
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









//hover zones: I wanted to assign hover zones in my intro page and then have a custom svg appear on that zone specifically. the hero image (the image in the middle) was also changing, so we are getting all those elements, using mouse enter function to detect and then injecting the required assets. I took a little help for this function online too, just to have the svg follow the cursor.

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







//Custom cursor on Hover function on intro page

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


        // Floating buttons placement around cursor
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

    
    document.addEventListener("mousemove", updateCursorPosition);
    document.querySelector(".hover-left").addEventListener("mouseenter", showPast);
    document.querySelector(".hover-right").addEventListener("mouseenter", showPresent);
    hero.addEventListener("mouseleave", resetCursor);
    document.addEventListener("click", handleClick);
});




  //youtube thumbnail (tried this but it didnt work)
  document.addEventListener("click", function(event) {
    if (event.target.closest(".youtube-preview")) {
        let previewDiv = event.target.closest(".youtube-preview");
        let videoUrl = previewDiv.getAttribute("data-video");

        previewDiv.innerHTML = `<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
    }
});




