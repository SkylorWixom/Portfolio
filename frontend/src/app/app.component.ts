import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgFor, CommonModule } from '@angular/common'; // ✅ Import NgFor

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, NgFor], // ✅ Include NgFor here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  projects: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:5000/projects')
      .subscribe(data => {
        this.projects = data;
      }, error => {
        console.error('Error fetching projects:', error);
      });
  }
}
