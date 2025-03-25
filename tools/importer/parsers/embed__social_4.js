/* eslint-disable no-undef */
export default function parse(element, { document }) {
  // Import the external utility function
  const { createTable } = WebImporter.DOMUtils;

  // Find the anchor tag containing the social URL
  const linkElement = element.querySelector('a[href]');

  // Extract the href (URL) from the anchor tag
  const socialURL = linkElement ? linkElement.href : '';

  // Define the header row
  const headerCell = document.createElement('strong');
  headerCell.textContent = 'Embed';

  // Define the cells for the new table
  const cells = [
    [headerCell], // Header row with the block name
    [socialURL], // Content row containing the URL
  ];

  // Create the block table using the utility function
  const blockTable = createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
