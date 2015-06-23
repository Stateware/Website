var content;
var cur = 0;

function LoadLinks() {
	var 	links, i;

	d3.json("res/links.json", function(error, json) {
		if (error) return console.warn(error);
		links = json;
		console.log(json);
		console.log(links);

		d3.select('.links')
			.selectAll('div').data(links)
			.enter().append('div')
				.attr('class', function(d,i) {
					return 'link-' + i;
				})
				.style('position', 'absolute')
				.style('left', function(d,i) {
					return ((100 / links.length)*i).toString() + "%";
				})
				.style('height', '100%')
				.style('width', function(d,i) {
					return (100 / links.length).toString() + "%";
				})
				.style('background-color', 'transparent')
				.style('opacity', 1)
				.style('z-index', 2)
				.style('color', 'white')
				.style('font-family', 'Hind')
				.style('text-align', 'center')

				.on('mouseover', function() {
					this.style['background-color'] = '#c7c7db';
					this.style['color'] = 'black';
				})
	
				.on('mouseout', function() {
					this.style['background-color'] = 'transparent';
					this.style['color'] = 'white';
				})

				.on('click', function(d,i) {
					LoadContent(d.default);
				})

		for (i = 0; i < links.length; i++)
		{
			d3.select('div .link-' + i)
				.html('<p style="position:absolute;left:10%;bottom:5%;font-size:14pt;">' + links[i].name + '</p>')
		}
	});
}

function LoadContent(url) {

	d3.select('.container').html("")
	cur = 0;

	d3.json('res/' + url, function(error, json) {
		if (error) return console.warn(error);
		content = json;
		console.log(json);

		LoadChunk();
	});
}

function LoadChunk() {
	var i;

	for (i = 0; i < 7 && content.length > cur+i; i++)
		LoadBlock(content[cur+i], cur+i);

	if (cur+i != content.length)
	{
		cur += 7;
		d3.select('.container')
			.append('div')
			.attr('class', 'feed-end')
			.html('<h5 class="subheading">Show More?</h5>')
			.on("click", function() {
				console.log(content);
				LoadChunk();
				d3.select('.feed-end').remove();
			})
	}
	else
	{
		d3.select('.container')
			.append('div')
			.style('width', '90%')
			.style('height', '40%')
	}
}

function LoadBlock(block, index) {
	var 	html = '<div class="content-' + index + '">',
		imageRatio,
		imageAlign;

	switch (block.type)
	{
		case "heading":
		{
			html += '<h1 class="heading">' + block.text + '</h1>';
			break;
		}
		case "post":
		{
			if (block.image !== undefined)
			{			
				imageRatio = block.image.height / block.image.width;
				if (imageRatio < 1)
					imageAlign = 'center';
				else if (index % 2 == 0)
					imageAlign = 'left';
				else
					imageAlign = 'right';
				if (imageAlign != 'center')
					html += '<div class="mixed">'
				if (imageAlign == 'left')
					html += '<div class="image-' + imageAlign + '"><img src="' + block.image.src + '" alt="' + block.image.alt + '"/></div>';
				html += '<div class="content-' + imageAlign + '">';
				html += '<h3 class="heading">' + block.title + '</h3>';
				html += '<h5 class="subheading">' + block.date + '</h5>';
				html += '<h5 class="subheading">by ' + block.author + '</h5>';
				html += '<p class="text">' + block.first + '</p></br>';
				html += '</div>';
				if (imageAlign =='right' || imageAlign == 'center')
					html += '<div class="image-' + imageAlign + '"><img src="' + block.image.src + '" alt="' + block.image.alt + '"/></div>';
				if (imageAlign != 'center')
					html += '</div>';
				if (block.body !== undefined)
					html += '<p class="text">' + block.body + '</p>';
			}
			else
			{
				html += '<div class="content">';
				html += '<h3 class="heading">' + block.title + '</h3>';
				html += '<h5 class="subheading">' + block.date + '</h5>';
				html += '<h5 class="subheading">by ' + block.author + '</h5>';
				html += '<p class="text">' + block.first + '</p>';
				if (block.body !== undefined)
					html += '<p class="text">' + block.body + '</p>';
				html += '</div>';
			}
			break;
		}
		case "bio":
		{
			if (block.image !== undefined)
			{
				imageRatio = block.image.height / block.image.width;
				if (imageRatio < 1)
					imageAlign = 'center';
				else if (index % 2 == 0)
					imageAlign = 'left';
				else
					imageAlign = 'right';
				if (imageAlign != 'center')
					html += '<div class="mixed">'
				if (imageAlign == 'left' || imageAlign == 'center')
					html += '<div class="image-' + imageAlign + '"><img src="' + block.image.src + '" alt="' + block.image.alt + '"/></div>';
				html += '<div class="content-' + imageAlign + '">';
				html += '<h3 class="heading">' + block.name + '</h3>';
				html += '<h5 class="subheading">' + block.title + '</h5>';
				html += '<p class="link-heading">Email: </p><a class="link-large" href="mailto:' + block.email + '">' + block.email + '</a>';
				if (block.website !== undefined)
					html += '<p class="link-heading">Website: </p><a class="link-large" href="' + block.website + '">' + block.website + '</a>';
				html += '<p class="text">' + block.first + '</p>';
				html += '</div>';
				if (imageAlign =='right')
					html += '<div class="image-' + imageAlign + '"><img src="' + block.image.src + '" alt="' + block.image.alt + '"/></div>';
				if (imageAlign != 'center')
					html += '</div>';
				if (block.body !== undefined)
					html += '<p class="text">' + block.body + '</p>';
			}
			else
			{
				html += '<div class="content">';
				html += '<h3 class="heading">' + block.name + '</h3>';
				html += '<h5 class="subheading">' + block.title + '</h5>';
				html += '<p class="link-heading">Email: </p><a class="link-large" href="mailto:' + block.email + '">' + block.email + '</a>';
				if (block.website !== undefined)
					html += '<p class="link-heading">Website: </p><a class="link-large" href="' + block.website + '">' + block.website + '</a>';
				html += '<p class="text">' + block.first + '</p>';
				if (block.body !== undefined)
					html += '<p class="text">' + block.body + '</p>';
				html += '</div>';
			}
			break;
		}
		case "project":
		{
			if (block.image !== undefined)
			{
				imageRatio = block.image.height / block.image.width;
				if (imageRatio < 1)
					imageAlign = 'center';
				else if (index % 2 == 0)
					imageAlign = 'left';
				else
					imageAlign = 'right';
				if (imageAlign != 'center')
					html += '<div class="mixed">'
				if (imageAlign == 'left' || imageAlign == 'center')
					html += '<div class="image-' + imageAlign + '"><img src="' + block.image.src + '" alt="' + block.image.alt + '"/></div>';
				html += '<div class="content-' + imageAlign + '">';
				html += '<h3 class="heading">' + block.name + '</h3>';
				html += '<h5 class="subheading">Client: ' + block.client + '</h5>';
				html += '<h5 class="subheading">Developed at Stateware since ' + block.inception + '</h5></br>';
				if (block.github !== undefined)
					html += '<a class="link-large" href="' + block.github + '">' + block.name + ' on Github</a></br>';
				if (block.live !== undefined)
					html += '<a class="link-large" href="' + block.live + '">Try ' + block.name + ' now!</a></br></br>';
				html += '<p class="text">' + block.first + '</p>';
				html += '</div>';
				if (imageAlign =='right')
					html += '<div class="image-' + imageAlign + '"><img src="' + block.image.src + '" alt="' + block.image.alt + '"/></div>';
				if (imageAlign != 'center')
					html += '</div>';
				if (block.body !== undefined)
					html += '<p class="text">' + block.body + '</p>';
			}
			else
			{
				html += '<div class="content">';
				html += '<h3 class="heading">' + block.name + '</h3>';
				html += '<h5 class="subheading">' + block.client + '</h5>';
				html += '<h5 class="subheading">Developed at Stateware since ' + block.inception + '</h5></br>';
				if (block.github !== undefined)
					html += '<a class="link-large" href="' + block.github + '">' + block.name + ' on Github</a></br>';
				if (block.live !== undefined)
					html += '<a class="link-large" href="' + block.live + '">Try ' + block.name + ' now!</a></br></br>';
				html += '<p class="text">' + block.first + '</p>';
				if (block.body !== undefined)
					html += '<p class="text">' + block.body + '</p>';
				html += '</div>';
			}
			break;
		}
		case "image":
		{
			html += '<img class="image-center" src="' + block.src + '" alt="' + block.alt + '"/>';
			break;
		}
		case "youtube":
		{
			html += '<div style="text-align:center" ><iframe class="youtube" src="https://www.youtube.com/embed/' + block.source + '?feature=player_detailpage" frameborder="0" allowfullscreen></iframe></div>';
			break;
		}
		case "plaintext":
		{
			html += '<p class="text">' + block.text + '</p>';
			break;
		}
		case "customHTML":
		{
			html += block.content;
			break;
		}
	}

	html += '</div>';

	d3.select('.container')
		.html(d3.select('.container')
		.html() + 
		html)
}
