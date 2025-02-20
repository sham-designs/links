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
    
    // Append the block to the correct section or default grid
    if (isPast) {
        pastContainer.appendChild(blockItem);
    } else if (isPresent) {
        presentContainer.appendChild(blockItem);
    } else {
        defaultContainer.appendChild(blockItem); // Show content with no labels in the grid
    }
};

// Hover-based Desaturation Effect
document.querySelector("#past").addEventListener("mouseenter", () => {
    document.querySelector("#present").style.filter = "grayscale(100%)";
    document.querySelector("#past").style.filter = "grayscale(0%)";
});

document.querySelector("#present").addEventListener("mouseenter", () => {
    document.querySelector("#past").style.filter = "grayscale(100%)";
    document.querySelector("#present").style.filter = "grayscale(0%)";
});

document.querySelector("#past").addEventListener("mouseleave", () => {
    document.querySelector("#past").style.filter = "grayscale(0%)";
    document.querySelector("#present").style.filter = "grayscale(0%)";
});

document.querySelector("#present").addEventListener("mouseleave", () => {
    document.querySelector("#past").style.filter = "grayscale(0%)";
    document.querySelector("#present").style.filter = "grayscale(0%)";
});




document.addEventListener("DOMContentLoaded", () => {
    let pastSection = document.querySelector("#past");
    let presentSection = document.querySelector("#present");

    pastSection.addEventListener("scroll", () => {
        presentSection.scrollTop = pastSection.scrollTop;
    });

    presentSection.addEventListener("scroll", () => {
        pastSection.scrollTop = presentSection.scrollTop;
    });
});




document.addEventListener("DOMContentLoaded", () => {
    let pastSection = document.querySelector("#past");
    let presentSection = document.querySelector("#present");

    function adjustHeight() {
        let windowHeight = window.innerHeight;
        pastSection.style.height = `${windowHeight}px`;
        presentSection.style.height = `${windowHeight}px`;
    }

    adjustHeight();
    window.addEventListener("resize", adjustHeight);
});









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

// 🚀 Toggle Function (Reveals Content On Click)
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




