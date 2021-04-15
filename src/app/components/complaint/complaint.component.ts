import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Complaint } from 'src/app/models/Complaint';
import { ComplaintService } from 'src/app/services/complaint.service';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit {

  name : string;
  complaint : string;

  constructor(private compService : ComplaintService,private router : Router) {
    this.name = '';
    this.complaint = '';
   }

  ngOnInit(): void {
  }

  submitComplaint()
  {
    console.log(this.name + ","+this.complaint)
    var comp = new Complaint();
    comp.name = this.name;
    comp.complaint = this.complaint;
    this.compService.create(comp);
    alert("Thank you for your Feedback.")
    setTimeout(()=>{this.router.navigateByUrl('/')},1000)

  }

}
