const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchR = document.querySelector("#search-results");

// Theme toggler elements
const themeToggler = document.querySelector("#theme-toggler");
const body = document.body;

async function searchWiki(query) {
  const encodedQuery = encodeURIComponent(query);
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodedQuery}`;

  const reponse = await fetch(endpoint);

  if (!reponse.ok) {
    throw new Error("Faild to fetch search results form wikipedia API.");
  }

  const json = await reponse.json();
  return json;
}

function displayResults(results) {
  // Remove the loading spinner
  searchR.innerHTML = "";

  results.forEach((result) => {
    const url = `https://en.wikipedia.org/?curid=${results.pageid}`;
    const titleLink = `<a href="${url}" target="_blank" rel="noopener">${result.title} </a>`;
    const urlLink = `<a href="${url} class="result-link" target="_blank" rel="noopener">${url}</a>`;

    const resultItme = document.createElement("div");
    resultItme.className = "result-item";
    resultItme.innerHTML = `
        <h3 class="result-title">${titleLink}</h3>
        ${urlLink}
        <p class="result-snippet">${result.snippet}</p>
        `;

    searchR.appendChild(resultItme);
  });
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    searchR.innerHTML = "<p>Please enter a valid search term. </p>";
    return;
  }

  searchR.innerHTML = "<div class='spinner'>Loading ... </div>";

  try {
    const results = await searchWiki(query);

    if (results.query.searchinfo.totalhits === 0) {
      searchR.innerHTML = "<p>No results found. </p>";
    } else {
      displayResults(results.query.search);
    }
  } catch (error) {
    console.error(error);
    searchR.innerHTML = `<p>An error occured while searching. Please try again later. </p>`;
  }
});

// Event listener for the theme toggler
themeToggler.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  if (body.classList.contains("dark-theme")) {
    themeToggler.textContent = "Dark";
    themeToggler.style.background = "#fff";
    themeToggler.style.color = "#333";
  } else {
    themeToggler.textContent = "Light";
    themeToggler.style.border = "2px solid #ccc";
    themeToggler.style.color = "#333";
  }
});
