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

// Fetch the data from Are.na API
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
    .then((response) => response.json())
    .then((data) => {
        console.log(data); // Always good to check your response!
        placeChannelInfo(data);
        
        // Loop through the contents and render only relevant ones
        data.contents.reverse().forEach((block) => {
            renderBlock(block);
        });
    });
