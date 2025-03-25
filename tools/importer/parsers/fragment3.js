export default function parse(element, { document }) {
  // Extract the block name and URL dynamically
  const blockName = 'Fragment';
  const fragmentURL = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/fragment-include';

  // Create the header row with dynamically created HTML elements
  const headerCell = document.createElement('strong');
  headerCell.textContent = blockName;
  const headerRow = [headerCell];

  // Create the second row with the URL dynamically
  const link = document.createElement('a');
  link.href = fragmentURL;
  link.textContent = fragmentURL;

  const rows = [
    headerRow,
    [link],
  ];

  // Create the table and replace the element
  // eslint-disable-next-line no-undef
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
