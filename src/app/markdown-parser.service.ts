import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MarkdownHeaderService, Heading } from './markdown-header.service';
import { LAB_IDENTIFIER } from './contants';

@Injectable({
  providedIn: 'root',
})
export class MarkdownParserService {
  constructor(
    private httpClient: HttpClient,
    private markdownHeaderService: MarkdownHeaderService
  ) {}

  parseMarkdown(path: string): Observable<Topic> {
    return this.httpClient.get(path, { responseType: 'text' }).pipe(
      map((text: string) => {
        const heading = this.markdownHeaderService.getFirstMainHeading(text);

        return {
          heading,
          codelabs: this.extractCodeLabs(text),
          introduction: this.getIntroduction(text),
        };
      })
    );
  }

  private getIntroduction(text: string): string {
    return text.split(LAB_IDENTIFIER)[0].split('\r\n').splice(2).join('\r\n');
  }

  private extractCodeLabs(text: string): Codelab[] {
    const codeLabs = text.split(LAB_IDENTIFIER);
    codeLabs.shift();
    const allSubHeadings = this.markdownHeaderService
      .getHeadings(text)
      .filter((h) => h.level > 1 && h.rawText.startsWith(LAB_IDENTIFIER));

    return codeLabs.map((text, index) => {
      const completeText = LAB_IDENTIFIER + ' ' + text.trim();
      const currentHeading = allSubHeadings[index];

      return {
        heading: currentHeading,
        text: completeText,
        index,
      };
    });
  }
}

export interface Topic {
  heading: string;

  introduction: string;

  codelabs: Codelab[];
}

export interface Codelab {
  heading: Heading;
  text: string;
  index: number;
}
