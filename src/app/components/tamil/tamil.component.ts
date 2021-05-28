import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tamil',
  templateUrl: './tamil.component.html',
  styleUrls: ['./tamil.component.scss']
})
export class TamilComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  copyToClipboard()
  {

    if (navigator.share) {
      navigator.share({
        title: 'Suggesto : Best app to find hand picked Movies and Suggestion on daily basis.',
        text: 'Hey checkout this amazing app that suggests some great movies daily and has many features in it.   '+"https://play.google.com/store/apps/details?id=xyz.appmaker.jibpca",
        // url: window.location.toString(),
      }).then(() => {
        console.log('Thanks for sharing!');
      })
      .catch(console.error);
    } else 
    {
      document.addEventListener('copy', (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', (window.location.href));
        e.preventDefault();
        document.removeEventListener('copy', null);
      });
      document.execCommand('copy');
    }
  }

  goToPlayStore()
  {
    window.location.href = "https://play.google.com/store/apps/details?id=xyz.appmaker.jibpca";
  }

}
