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

    // Set title, but use "Unknown Channel" if empty
    // channelTitle.innerHTML = data.title || "Unknown Channel";

    // Check if metadata exists before accessing description
    // let description = data.metadata && data.metadata.description ? data.metadata.description : "No description available.";
    // channelDescription.innerHTML = window.markdownit().render(description);

    // Set block count
    // channelCount.innerHTML = data.length;

    // Set channel link
    // channelLink.href = `https://www.are.na/channel/${channelSlug}`;


 // If any element is empty, remove it from the DOM
 if (channelTitle) channelTitle.remove();
 if (channelDescription) channelDescription.remove();
 if (channelCount) channelCount.remove();
 if (channelLink) channelLink.remove();

};




// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
    let channelBlocks = document.querySelector('#channel-blocks');

    // Links (Articles, Resources, External Content)
    if (block.class == 'Link') {
        let linkItem = `
            <li>
                <p><em>Resource</em></p>
                <h3>${ block.title }</h3>
                <p>${ block.description_html }</p>
                <p><a href="${ block.source.url }" target="_blank">Read More ↗</a></p>
            </li>
        `;
        channelBlocks.insertAdjacentHTML('beforeend', linkItem);
    }

    // Images (Rainforest, Fire, Wildlife, Textures)
    else if (block.class == 'Image') {
        let imageItem = `
            <li>
                <p><em>Visual</em></p>
                <img src="${ block.image.original.url }" alt="${ block.title }">
                <h3>${ block.title }</h3>
                ${ block.description_html }
            </li>
        `;
        channelBlocks.insertAdjacentHTML('beforeend', imageItem);
    }

    // Text (Descriptions, Quotes, Reflections)
    else if (block.class == 'Text') {
        let textItem = `
            <li>
                <p><em>Excerpt</em></p>
                <h3>${ block.title }</h3>
                <p>${ block.content }</p>
            </li>
        `;
        channelBlocks.insertAdjacentHTML('beforeend', textItem);
    }

    // Uploaded Videos (Nature Clips, Documentaries)
    else if (block.class == 'Attachment' && block.attachment.content_type.includes('video')) {
        let videoItem = `
            <li>
                <p><em>Footage</em></p>
                <video controls src="${ block.attachment.url }"></video>
            </li>
        `;
        channelBlocks.insertAdjacentHTML('beforeend', videoItem);
    }

    // Linked Videos (YouTube, Vimeo, Other Embedded Media)
    else if (block.class == 'Media' && block.embed.type.includes('video')) {
        let linkedVideoItem = `
            <li>
                <p><em>Visual Story</em></p>
                ${ block.embed.html }
            </li>
        `;
        channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem);
    }

    // Audio (Rainforest Sounds, Indigenous Voices, Ambient Tracks)
    else if (block.class == 'Attachment' && block.attachment.content_type.includes('audio')) {
        let audioItem = `
            <li>
                <p><em>Soundscape</em></p>
                <audio controls src="${ block.attachment.url }"></audio>
            </li>
        `;
        channelBlocks.insertAdjacentHTML('beforeend', audioItem);
    }

    // PDFs (Reports, Research Papers)
    else if (block.class == 'Attachment' && block.attachment.content_type.includes('pdf')) {
        let pdfItem = `
            <li>
                <p><em>Report</em></p>
                <a href="${ block.attachment.url }" target="_blank">View PDF ↗</a>
            </li>
        `;
        channelBlocks.insertAdjacentHTML('beforeend', pdfItem);
    }
};



// It‘s always good to credit your work:
let renderUser = (user, container) => { // You can have multiple arguments for a function!
	let userAddress =
		`
		<address>
			<img src="${ user.avatar_image.display }">
			<h3>${ user.first_name }</h3>
			<p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
		</address>
		`
	container.insertAdjacentHTML('beforeend', userAddress)
}



// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log(data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})

		// Also display the owner and collaborators:
		let channelUsers = document.querySelector('#channel-users') // Show them together
		data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		renderUser(data.user, channelUsers)
	})




	document.querySelectorAll("video").forEach((video) => {
		video.setAttribute("autoplay", true);
		video.setAttribute("loop", true);
		video.setAttribute("muted", true);
		video.setAttribute("playsinline", true);
	  });


	  document.querySelectorAll(".grid-item-label").forEach((el) => el.remove());

	  