/* eslint-disable no-undef, no-unused-vars */
export default function parse(element, { document }) {
  // Helper function to extract text content from an element
  const extractContent = (el) => {
    if (!el) return '';
    return el.innerHTML.trim();
  };

  // Helper function to create rows for the table
  const createRow = (title, content) => {
    const titleCell = document.createElement('strong');
    titleCell.textContent = title;
    return [titleCell, content];
  };

  // Create the exact header row structure
  const headerCell = document.createElement('strong');
  headerCell.textContent = 'Accordion';
  const headerRow = [headerCell];

  // Extracting content from the provided element
  const sections = element.querySelectorAll('[data-ux="ContentBasic"]');
  const rows = [];

  sections.forEach((section) => {
    const titleElement = section.querySelector('h4');
    const contentElement = section.querySelector('div[data-ux="ContentText"]');

    // Handle missing title or content gracefully
    const title = titleElement ? titleElement.textContent.trim() : 'Untitled';
    const content = contentElement ? contentElement.cloneNode(true) : document.createTextNode('No content available.');

    rows.push(createRow(title, content));
  });

  // Constructing the block table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replacing the original element
  element.replaceWith(block);
}
