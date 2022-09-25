import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LAB_IDENTIFIER } from './contants';
import { Heading, MarkdownHeaderService } from './markdown-header.service';

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
    const textWithoutFirstLine = introductionText.split('\r\n\r\n').slice(2);
    const introText = textWithoutFirstLine.join('\r\n\r\n');

    return {
      heading: {
        level: 1,
        text: 'Introduction',
        rawText: '## Introduction',
      },
      text: introText,
      index: 0,
    };
  }

  private extractCodeLabs(text: string): Codelab[] {
    const startOfFirstLab = text.indexOf(LAB_IDENTIFIER);
    const codelabText = text.substring(startOfFirstLab, text.length - 1);
    const codeLabs = codelabText.split(LAB_IDENTIFIER).filter((x) => !!x);
    const allSubHeadings = this.markdownHeaderService.getLabHeadings(text);

    return codeLabs.map((text, index) => {
      const completeText = LAB_IDENTIFIER + ' ' + text.trim();
      const currentHeading = allSubHeadings[index];

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
