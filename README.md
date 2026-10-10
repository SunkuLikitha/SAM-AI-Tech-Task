# Modern Blog Website

BlogSpace is a polished, responsive static blog built for Task 3. It offers a welcoming home page, a searchable and filterable journal, an about page, and an accessible contact page.

## Features

- Consistent editorial branding and active navigation across all four pages.
- Responsive mobile navigation with an accessible toggle and Escape-key support.
- Eight sample articles with images, descriptions, categories, authors, and dates.
- Search across article titles and descriptions, combined with category filtering.
- Category links from the home and about pages open the journal with that category selected.
- Friendly empty state and clear-filters control when a search has no results.
- Contact and newsletter forms with front-end validation and visible demo feedback.
- Remote image URLs with an embedded fallback image, semantic HTML, keyboard focus styles, and reduced-motion support.

## Technologies

- HTML5
- CSS3 (responsive grid, flexbox, and media queries)
- Vanilla JavaScript
- Remote images from Unsplash; Google Fonts are loaded remotely

No framework, package manager, backend, or database is required.

## Files

```text
blog-website/
├── index.html     # Home page
├── blog.html      # Searchable and filterable article listing
├── about.html     # BlogSpace mission and topics
├── contact.html   # Validated demo contact form and contact details
├── style.css      # Shared responsive styles
├── script.js      # Shared navigation, filters, and form interactions
└── README.md      # Project instructions and limitations
```

## Run in VS Code

1. Open the project folder in Visual Studio Code with **File → Open Folder**.
2. If needed, install the **Live Server** extension by Ritwick Dey from the Extensions view.
3. In the Explorer, right-click `index.html` and select **Open with Live Server**. Alternatively, open `index.html` and select **Go Live** in the VS Code status bar.
4. Live Server opens the site in your browser. Use the header navigation to move between pages.

The site can also be opened directly by double-clicking `index.html`; Live Server is recommended for a consistent local web experience.

## Test the features

- **Navigation:** Use Home, Blog, About, and Contact on desktop. On a narrow browser window, open and close the menu with its toggle; also test Escape and the active-page indicator.
- **Search:** On Blog, search for a word in a title (for example, “travel”) and then a word in a description (for example, “itinerary”).
- **Categories:** Choose Travel, Technology, or another category, then choose All to reset.
- **Combined filters:** Select a category and enter a search term; only articles that match both should remain. Search for a term with no match to see the empty state, then select **Clear filters**.
- **Category links:** Choose a topic from Home or About and confirm the Blog page opens with that category selected.
- **Contact form:** Submit empty fields to see required-field errors. Try a malformed email and too-short message, then enter valid details and check the demo success notice.
- **Newsletter:** Submit an empty or invalid email, then a valid address, and confirm the respective feedback appears.
- **Responsive/accessibility:** Resize to mobile/tablet/desktop widths, navigate with the keyboard, and check reduced-motion behavior using your operating system or browser accessibility settings.

## Limitations

This is a front-end-only static demo. Contact form submissions are validated in the browser but are **not emailed or stored**. The newsletter form does not subscribe visitors or keep email addresses. Real delivery requires a backend endpoint or a trusted form/newsletter service. Contact details are clearly labeled sample details. Original images and fonts use remote services and require an internet connection; if an image fails to load, a small embedded BlogSpace fallback is used instead.

## Publish with GitHub Pages

1. Create a GitHub repository and add the seven project files to its root.
2. Push the files to the repository's default branch.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select the default branch and the `/ (root)` folder, then save.
5. Wait for the Pages deployment to finish. Open the published URL shown in the Pages settings and verify navigation, imagery, search, and forms.

All page-to-page links are relative, so the site can be served from the repository root or a GitHub Pages project path.
