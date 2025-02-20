
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

                        if (block.class === 'Image') {
                            blockItem.innerHTML = `<img src="${block.image.original.url}" alt="${block.title}">`;
                        } else if (block.class === 'Text') {
                            blockItem.innerHTML = `<p>${block.content}</p>`;
                        } else if (block.class === 'Attachment' && block.attachment.content_type.includes('video')) {
                            blockItem.innerHTML = `<video controls src="${block.attachment.url}"></video>`;
                        } else if (block.class === 'Attachment' && block.attachment.content_type.includes('audio')) {
                            blockItem.innerHTML = `<audio controls src="${block.attachment.url}"></audio>`;
                        }

                        pastContainer.appendChild(blockItem);
                    }
                });
            })
            .catch(error => console.error("Error fetching data:", error));
