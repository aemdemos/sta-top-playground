export default function parse(element, {document}) {
  // Extract the image from the element
  const imageElement = element.querySelector('img');
  const image = imageElement ? imageElement.cloneNode(true) : null;

  // Extract the URL if present
  const urlElement = element.querySelector('a[href]');
  const url = urlElement ? urlElement.href : '';

  // Ensure both the image and URL are properly wrapped in the same cell
  const contentCell = document.createElement('div');
  if (image) contentCell.appendChild(image);
  if (url) {
    const link = document.createElement('a');
    link.href = url;
    link.textContent = url;
    contentCell.appendChild(document.createElement('br')); // Line break between image and URL
    contentCell.appendChild(link);
  }

  // Creating the header row
  const headerCell = document.createElement('strong');
  headerCell.textContent = 'Embed';
  const headerRow = [headerCell];

  // Create cells for the table
  const cells = [
    headerRow,
    [contentCell]
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block structure
  element.replaceWith(block);
}