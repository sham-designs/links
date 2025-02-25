
// Fetch Are.na content for "Past"
fetch(`https://api.are.na/v2/channels/amazon-forest?per=100`, { cache: 'no-store' })
    .then(response => response.json())
    .then(data => {
        let pastContainer = document.getElementById('past-content');

        data.contents.reverse().forEach(block => {
            let title = block.title ? block.title.toLowerCase() : "";
            let isPresent = title.includes("[present]");
            if (isPresent) {

                let blockItem = document.createElement("div");
                blockItem.classList.add("block-item");


                let titleElement = document.createElement("div");
                         titleElement.classList.add("block-title");
                         titleElement.innerText = block.title || "Untitled"; 

                if (block.class === 'Image') {
                    blockItem.innerHTML = `<img src="${block.image.original.url}" alt="${block.title}">`;
                } else if (block.class === 'Text') {
                    blockItem.innerHTML = `<p>${block.content}</p>`;
                } else if (block.class === 'Attachment' && block.attachment?.content_type.includes('video')) {
                    blockItem.innerHTML = `<video controls src="${block.attachment.url}"></video>`;
                } else if (block.class === 'Attachment' && block.attachment?.content_type.includes('audio')) {
                    blockItem.innerHTML = `<audio controls src="${block.attachment.url}"></audio>`;
                } 



                
//add cover images for links

else if ((block.class === 'Media' || block.class === 'Link' || block.class === 'Attachment') &&
    (block.source?.url || (block.attachment && block.attachment.content_type.includes("pdf")))) {

    let isYouTube = block.source?.url?.includes("youtube") || block.source?.url?.includes("youtu.be");
    let isPDF = block.attachment && block.attachment.content_type.includes("pdf");
    let isRegularLink = block.class === 'Link' && !isYouTube;

    let icon = isYouTube ? "assets/YoutubeLogo.png" : "assets/ReadLogo.png";
    let coverImage = block.image?.filename  
        ? `https://d2w9rnfcy7mm78.cloudfront.net/${block.image.filename}`  
        : "./assets/custom-cover.png";  
    let linkUrl = isPDF ? block.attachment.url : block.source?.url;  

    console.log("🔗 Processing:", block.source?.url || block.attachment?.url); 

    blockItem.innerHTML = `
        <div class="custom-cover" style="background-image: url('${coverImage}');">
            <a href="${linkUrl}" target="_blank" class="custom-link">
                <img src="${icon}" alt="Icon" class="custom-icon">
                <span class="custom-text">Know more</span>
            </a>
        </div>
    `;

    if (isPDF) {
        let pdfEmbed = document.createElement("embed");
        pdfEmbed.src = block.attachment.url;
        pdfEmbed.type = "application/pdf";
        pdfEmbed.width = "100%";
        pdfEmbed.height = "500px";
        blockItem.appendChild(pdfEmbed);
    }
}



                blockItem.appendChild(titleElement);

                pastContainer.appendChild(blockItem);
            }
        });
    })
    .catch(error => console.error("Error fetching data:", error));


    


     // just to play my audio
     function toggleAudio() {
        let audio = document.getElementById("bg-audio");
        let audioBtn = document.getElementById("audio-btn");
    
        if (audio.paused) {
            audio.play();
            audioBtn.innerHTML = "🔊 Playing";
        } else {
            audio.pause();
            audioBtn.innerHTML = "🔇 Muted";
        }
    }

 
    


    //youtube thumbnail
    document.addEventListener("click", function(event) {
        if (event.target.closest(".youtube-preview")) {
            let previewDiv = event.target.closest(".youtube-preview");
            let videoUrl = previewDiv.getAttribute("data-video");
    
            previewDiv.innerHTML = `<iframe width="560" height="315" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
        }
    });