export default function parse(element, {document}) {
  const cells = [];

  // Header row
  const headerCell = document.createElement('strong');
  headerCell.textContent = 'Columns';
  const headerRow = [headerCell];
  cells.push(headerRow);

  // Extract Send Message section
  const formTitle = element.querySelector('[data-aid="CONTACT_FORM_TITLE_REND"]');
  if (formTitle) {
    const row = [];

    const heading = document.createElement('h4');
    heading.textContent = formTitle.textContent;
    row.push(heading);

    const fields = [];
    const labels = element.querySelectorAll('[data-ux="InputFloatLabelLabel"]');
    labels.forEach(label => {
      const field = document.createElement('p');
      field.textContent = label.textContent;
      fields.push(field);
    });

    const messagePlaceholder = element.querySelector('[data-aid="CONTACT_FORM_MESSAGE"]');
    if (messagePlaceholder) {
      const messageField = document.createElement('p');
      messageField.textContent = messagePlaceholder.placeholder;
      fields.push(messageField);
    }

    row.push(fields);
    cells.push(row);
  }

  // Extract Privacy Policy and Terms section
  const policySection = element.querySelector('[data-aid="CONTACT_FORM_CONTAINER_REND"]');
  if (policySection) {
    const row = [];

    const policyLinks = policySection.querySelectorAll('a');

    policyLinks.forEach(link => {
      const contentCell = document.createElement('p');
      const clonedLink = link.cloneNode(true);
      contentCell.appendChild(clonedLink);
      row.push(contentCell);
    });

    cells.push(row);
  }

  // Extract Address and Hours section
  const contactInfo = element.querySelector('[data-aid="CONTACT_INFO_CONTAINER_REND"]');
  if (contactInfo) {
    const row = [];
    const address = contactInfo.querySelector('[data-aid="CONTACT_INFO_ADDRESS_REND"]');
    const phone = contactInfo.querySelector('[data-aid="CONTACT_INFO_PHONE_REND"]');
    const hours = contactInfo.querySelector('[data-aid="CONTACT_HOURS_COLLAPSED_HR_LABEL"]');

    if (address) {
      const addressContent = document.createElement('p');
      addressContent.textContent = address.textContent;
      row.push(addressContent);
    }

    if (phone) {
      const phoneContent = document.createElement('p');
      phoneContent.innerHTML = phone.outerHTML;
      row.push(phoneContent);
    }

    if (hours) {
      const hoursContent = document.createElement('p');
      hoursContent.textContent = `Open today ${hours.textContent}`;
      row.push(hoursContent);
    }

    cells.push(row);
  }

  // Create table block
  const tableBlock = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(tableBlock);
}