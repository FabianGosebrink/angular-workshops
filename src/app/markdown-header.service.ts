import { Injectable } from '@angular/core';
import { LAB_IDENTIFIER } from './contants';

@Injectable({
  providedIn: 'root',
})
export class MarkdownHeaderService {
  getFirstMainHeading(text: string): Heading {
    const allHeadings = this.getAllHeadings(text);
    return allHeadings.find((h) => h.level === 1);
  }

  getIntroHeadings(text: string): Heading[] {
    const allHeadings = this.getAllHeadings(text);

    return allHeadings.filter((x) => !x.rawText.startsWith(LAB_IDENTIFIER));
  }

  getLabHeadings(text: string): Heading[] {
    const allHeadings = this.getAllHeadings(text);

    return allHeadings
      .filter((x) => x.rawText.startsWith(LAB_IDENTIFIER))
      .map((x) => ({ ...x, text: x.text.replace('Lab:', '').trim() }));
  }

  private getAllHeadings(text: string): Heading[] {
    const regXHeader = /(#{1,6} .*)\r?\n/g;
    const headings = text.match(regXHeader);

    if (!headings) {
      return [];
    }

    return headings.map((heading) => this.extractHeading(heading));
  }

  private extractHeading(text: string): Heading {
    const level = (text.match(/\#/g) || []).length;
    const headingText = text.replace(/\#/g, '').trim();

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
