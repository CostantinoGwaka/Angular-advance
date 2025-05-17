export class HTMLCleanerUtility {
  static toRemove: string[] = [
    'MsoNormal',
    'MsoBodyTextIndent2',
    'heading2Normal14pt',
  ];

  static dangerousTagsToRemove: string[] = [
    'script',
    'iframe',
    'object',
    'embed',
    'applet',
    'meta',
    'form',
    'input',
    'textarea',
    'select',
  ];

  static removeDangerousTags(html: string): string {
    // Create a regular expression to match the dangerous tags
    const regex = new RegExp(
      `<(${this.dangerousTagsToRemove.join('|')})(\\s|>)`,
      'gi'
    );

    // Remove the dangerous tags from the HTML
    const sanitizedHtml = html?.replace(regex, '');

    return sanitizedHtml;
  }

  static removeUnwantedClasses(html: string): string {
    let cleanedHtml = html;

    // Remove unwanted classes
    this.toRemove.forEach((className) => {
      const regex = new RegExp(`class="${className}"`, 'gi');
      cleanedHtml = cleanedHtml.replace(regex, '');
    });

    return cleanedHtml;
  }

  static stripHtmlTags(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const trippedHtml =  doc.body.textContent || '';

    return this.stripHtmlTagsExtra(trippedHtml);
  }

  static stripHtmlTagsExtra(html: string): string {
    /// Handle remove extra tags - <,>
    const regex = /([<>])/g;
    return html.replace(regex, '');
  }
}
