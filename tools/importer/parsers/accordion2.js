export default function parse(element, {document}) {
  // Extract headings and unique content blocks
  const headings = element.querySelectorAll('[data-ux="ContentCardHeading"]');
  const collapsedTextBlock = element.querySelector('#collapsedTextBlock119753');
  const expandedTextBlock = element.querySelector('#expandedTextBlock119754');

  // Create rows for the block table
  const rows = [];

  // Add header row exactly as specified in the example
  const headerCell = document.createElement('strong');
  headerCell.textContent = 'Accordion';
  rows.push([headerCell]);

  // Use a Set to track unique headings to avoid redundant entries
  const processedHeadings = new Set();

  headings.forEach((heading) => {
    const titleText = heading.textContent.trim();

    // Skip duplicate headings
    if (processedHeadings.has(titleText)) return;
    processedHeadings.add(titleText);

    // Create title cell
    const titleCell = document.createElement('p');
    titleCell.textContent = titleText;

    // Create corresponding content cell
    const contentCell = document.createElement('div');

    if (titleText === 'What I Do' && collapsedTextBlock && expandedTextBlock) {
      const collapsedClone = collapsedTextBlock.cloneNode(true);
      const expandedClone = expandedTextBlock.cloneNode(true);

      // Remove redundant labels/buttons
      const collapsedLabel = collapsedClone.querySelector('label');
      const expandedLabel = expandedClone.querySelector('label');
      if (collapsedLabel) collapsedLabel.remove();
      if (expandedLabel) expandedLabel.remove();

      contentCell.append(collapsedClone, expandedClone);
    } else {
      const placeholderContent = document.createElement('p');
      placeholderContent.textContent = `Content not available for "${titleText}".`;
      contentCell.appendChild(placeholderContent);
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}