
        // Fetch Are.na content for "Past"
        fetch(`https://api.are.na/v2/channels/amazon-forest?per=100`, { cache: 'no-store' })
            .then(response => response.json())
            .then(data => {
                let pastContainer = document.getElementById('past-content');

                data.contents.reverse().forEach(block => {
                    let title = block.title ? block.title.toLowerCase() : "";
                    let isPast = title.includes("[past]");

                    if (isPast) {
                        let blockItem = document.createElement("div");
                        blockItem.classList.add("block-item");

                        let titleElement = document.createElement("div");
                         titleElement.classList.add("block-title");
                         titleElement.innerText = block.title || "Untitled"; 

                        if (block.class === 'Image') {
                            blockItem.innerHTML = `<img src="${block.image.original.url}" alt="${block.title}">`;
                        } else if (block.class === 'Text') {
                            blockItem.innerHTML = `<p>${block.content}</p>`;
                        } else if (block.class === 'Attachment' && block.attachment.content_type.includes('video')) {
                            blockItem.innerHTML = `<video controls src="${block.attachment.url}"></video>`;
                        } else if (block.class === 'Attachment' && block.attachment.content_type.includes('audio')) {
                            blockItem.innerHTML = `<audio controls src="${block.attachment.url}"></audio>`;
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
            

          //scale up block item (tried this but didnt work)
          function checkBlocksInView() {
            let blocks = document.querySelectorAll(".block-item");
        
            blocks.forEach(block => {
                let rect = block.getBoundingClientRect();
                let windowWidth = window.innerWidth;
        
                // Now checking if even a part of the block is visible
                let isPartiallyVisible = rect.right > 0 && rect.left < windowWidth;
        
                if (isPartiallyVisible) {
                    block.classList.add("in-view");
                } else {
                    block.classList.remove("in-view");
                }
            });
        }
        
        // Run on scroll + resize (didnt work either)
        window.addEventListener("scroll", checkBlocksInView);
        window.addEventListener("resize", checkBlocksInView);
        checkBlocksInView();
        
            