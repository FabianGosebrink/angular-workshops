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
        const mainHeading =
          this.markdownHeaderService.getFirstMainHeading(text);

        const codeLabs = this.extractCodeLabs(text);
        const introduction = this.extractIntroduction(text);

        return {
          heading: mainHeading?.text,
          codelabs: [introduction, ...codeLabs],
        };
      })
    );
  }

  private extractIntroduction(text: string): Codelab {
    const untilFirstLab = text.indexOf(LAB_IDENTIFIER);
    const introductionText = text.substring(0, untilFirstLab);
    const heading = this.markdownHeaderService.getFirstMainHeading(text);

    return {
      heading,
      text: introductionText,
      index: 0,
    };
  }

  private extractCodeLabs(text: string): Codelab[] {
    const codeLabs = text.split(LAB_IDENTIFIER);

    const allSubHeadings = this.markdownHeaderService.getLabHeadings(text);
    const allFilteresLabHeadings = allSubHeadings.filter(
      (h) => h.level > 1 && h.rawText.startsWith(LAB_IDENTIFIER)
    );

    return codeLabs.map((text, index) => {
      const completeText = LAB_IDENTIFIER + ' ' + text.trim();
      const currentHeading = allFilteresLabHeadings[index];

      return {
        heading: currentHeading,
        text: completeText,
        index: index + 1,
      };
    });
  }
}

export interface Topic {
  heading: string;

  codelabs: Codelab[];
}

export interface Codelab {
  heading: Heading;
  text: string;
  index: number;
}
