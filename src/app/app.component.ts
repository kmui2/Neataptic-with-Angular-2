import { Component, OnInit } from '@angular/core';
import { NeatapticService } from './services/neataptic/neataptic.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  config = {
     LOCV_percent : 0.8,
     num_points : 100,
     num_input_neurons : 10,
     num_hidden_neurons : 14,
     num_output_neurons : 1,
     training_options : {
      log: 10,
      error: 0.0000000001,
      iterations: 1000,
      rate: 0.3
    }
  }
  file: any;
  
  constructor (private neatapticService: NeatapticService) {
    
  }
  ngOnInit() {
    
    var input = <HTMLInputElement>(document.getElementsByTagName('input')[0]);

    input.onclick = function() {
      input.value = null;
    };

    var comp = this;
    input.onchange = function() {
      comp.file = input.files[0];
    };
  }
  
  train() {
    this.neatapticService.parseAndTrain(this.file, this.config);
  }

} 

