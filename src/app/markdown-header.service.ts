import { Injectable } from '@angular/core';
import { LAB_IDENTIFIER } from './contants';

@Injectable({
  providedIn: 'root',
})
export class MarkdownHeaderService {
  getFirstMainHeading(text: string) {
    const allHeadings = this.getHeadings(text);
    return allHeadings.find((h) => h.level === 1)?.text || '';
  }

  getHeadings(text: string): Heading[] {
    const regXHeader = /(#{1,6} .*)\r?\n/g;
    const headings = text.match(regXHeader);

    if (!headings) {
      return [];
    }

    return headings.map((heading) => this.extractHeading(heading));
  }

  private extractHeading(text: string): Heading {
    const level = (text.match(/\#/g) || []).length;
    const headingText = text
      .replace(LAB_IDENTIFIER, '')
      .replace(/\#/g, '')
      .trim();

    return {
      level,
      text: headingText,
      rawText: text,
    };
  }
}

export interface Heading {
  level: number;

  text: string;

  rawText: string;
}
