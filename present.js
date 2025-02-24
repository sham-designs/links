
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

                if (block.class === 'Image') {
                    blockItem.innerHTML = `<img src="${block.image.original.url}" alt="${block.title}">`;
                } else if (block.class === 'Text') {
                    blockItem.innerHTML = `<p>${block.content}</p>`;
                } else if (block.class === 'Attachment' && block.attachment?.content_type.includes('video')) {
                    blockItem.innerHTML = `<video controls src="${block.attachment.url}"></video>`;
                } else if (block.class === 'Attachment' && block.attachment?.content_type.includes('audio')) {
                    blockItem.innerHTML = `<audio controls src="${block.attachment.url}"></audio>`;
                } 
                else if (block.class === 'Link') { //  Links
                    blockItem.innerHTML = `<a href="${block.source.url}" target="_blank">${block.title || 'Open Link'}</a>`;
                } 

                else if (block.class === 'Media' && block.source?.url.includes("youtube.com")) {
                    let videoId = block.source.url.split("v=")[1]?.split("&")[0]; // Extract YouTube video ID
                    let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; // Get Thumbnail
                    
                    blockItem.innerHTML = `
                        <div class="youtube-preview" data-video="${block.source.url.replace("watch?v=", "embed/")}">
                            <img src="${thumbnailUrl}" alt="YouTube Video" class="youtube-thumbnail">
                            <button class="play-button">▶ Play</button>
                        </div>
                    `;
                }
                
                else if (block.class === 'Media') { // 
                    blockItem.innerHTML = `<a href="${block.source.url}" target="_blank">${block.title || 'Open Media'}</a>`;
                }
                

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