const expansionPlaceholder = document.getElementById("expansions");
const expansionTemplate = document.getElementById("expansionItemTemplate");
const fragment = document.createDocumentFragment();
expansionData.forEach((exp) => {
	const itemNode = expansionTemplate.content.cloneNode(true);
	itemNode.querySelector(".expansion__checkbox").value = exp.id;
	itemNode.querySelector(".expansion__checkbox").id = "expansion-" + exp.id;
	itemNode.querySelector(".expansion__image").src = exp.image;
	itemNode.querySelector(".expansion__name").textContent = exp.name;
	fragment.appendChild(itemNode);
});
expansionPlaceholder.replaceChildren(fragment);
