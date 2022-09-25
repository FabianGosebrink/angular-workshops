import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { MarkdownParserService, Topic } from './markdown-parser.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angularworkshops';

  topic: Topic | null = null;

  currentIndex = 0;

  constructor(
    private markdownParserService: MarkdownParserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.markdownParserService
      .parseMarkdown('assets/start.md')
      .subscribe((data) => (this.topic = data));

    this.route.queryParamMap
      .pipe(
        map((params: ParamMap) => Number(params.get('lab')) || 0),
        tap(console.log)
      )
      .subscribe((labIndex) => {
        this.currentIndex = labIndex || 0;
        this.updateIndexInRoute(labIndex);
      });
  }

  nextLab() {
    const nextIndex = this.currentIndex + 1;

    if (nextIndex <= this.topic.codelabs.length - 1) {
      this.currentIndex = nextIndex;
      this.updateIndexInRoute(this.currentIndex);
    }
  }

  previousLab() {
    this.currentIndex--;
    this.updateIndexInRoute(this.currentIndex);
  }

  private updateIndexInRoute(currentIndex: number) {
    this.router.navigate(['/'], {
      queryParams: { lab: currentIndex },
    });
    // .then(() => {
    //   this.router.onSameUrlNavigation = 'ignore';
    // });
  }
}
