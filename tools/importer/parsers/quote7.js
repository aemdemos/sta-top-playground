/* eslint-disable no-undef */
export default function parse(element, { document }) {
  // Safely check if the button element exists
  const button = element.querySelector('button');

  // Extract text from the button or provide a fallback value
  const buttonText = button && button.innerText ? button.innerText.trim() : 'No text available';

  // Create the header row for the table
  const headerCell = document.createElement('strong');
  headerCell.textContent = 'Quote'; // Ensure this matches the example exactly
  const headerRow = [headerCell];

  // Create the content row for the table
  const contentRow = [buttonText];

  // Construct the table using the helper function
  const cells = [
    headerRow, // Add the header row
    contentRow, // Add the content row with the extracted text
  ];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element in the DOM with the new table
  element.replaceWith(blockTable);
}
