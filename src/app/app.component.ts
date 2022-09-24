import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, concatMap } from 'rxjs';
import { MarkdownParserService, Topic } from './markdown-parser.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angularworkshops';

  topic: Topic | null = null;

  currentIndex = -1;

  constructor(
    private markdownParserService: MarkdownParserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParamMap
      .pipe(
        map((params: ParamMap) => Number(params.get('lab')) || 0),
        concatMap((labIndex) => {
          return this.markdownParserService
            .parseMarkdown('assets/start.md')
            .pipe(map((data) => ({ labIndex, data })));
        })
      )
      .subscribe(({ labIndex, data }) => {
        this.topic = data;
        this.currentIndex = labIndex;
      });
  }

  nextLab() {
    this.currentIndex++;
    this.updateIndexInRoute(this.currentIndex);
  }

  previousLab() {
    this.currentIndex--;
    this.updateIndexInRoute(this.currentIndex);
  }

  private updateIndexInRoute(currentIndex: number) {
    this.router
      .navigate(['/'], {
        queryParams: { lab: currentIndex },
      })
      .then(() => {
        this.router.onSameUrlNavigation = 'ignore';
      });
  }
}
