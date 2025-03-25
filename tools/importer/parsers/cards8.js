/* eslint-disable no-undef */
export default function parse(element, { document }) {
  const headerRow = [document.createElement('strong')];
  headerRow[0].textContent = 'Cards';

  const rows = [];
  rows.push(headerRow);

  // Extract content from the cards
  const cards = element.querySelectorAll('[data-ux="ContentCard"]');
  cards.forEach((card) => {
    const imageElement = card.querySelector('img');
    const textHeadings = card.querySelectorAll('h4');

    const image = document.createElement('img');
    image.src = imageElement ? imageElement.src : '';
    image.srcset = imageElement ? imageElement.srcset : '';

    const textContent = document.createElement('div');
    textHeadings.forEach((heading) => {
      const headingElement = document.createElement('p');
      headingElement.textContent = heading.textContent;
      textContent.appendChild(headingElement);
    });

    rows.push([image, textContent]);
  });

  // Create a block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
