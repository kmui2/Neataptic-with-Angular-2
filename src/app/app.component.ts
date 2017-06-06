import { Component, OnInit } from '@angular/core';
import { NeatapticService } from './services/neataptic/neataptic.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
   LOCV_percent = 0.8;
   num_points = 100;
   num_input_neurons = 10;
   num_hidden_neurons = 14;
   num_output_neurons = 1;
   training_options = {
    log: 10,
    error: 0.0000000001,
    iterations: 1000,
    rate: 0.3
  }
  
  constructor (private neatapticService: NeatapticService) {
    
  }
  ngOnInit() {
    
    var input = <HTMLInputElement>(document.getElementsByTagName('input')[0]);

    input.onclick = function() {
      input.value = null;
    };

    var comp = this;
    input.onchange = function() {
      const config = {
        LOCV_percent: comp.LOCV_percent,
        num_points: comp.num_points,
        num_input_neurons: comp.num_input_neurons,
        num_hidden_neurons: comp.num_hidden_neurons,
        num_output_neurons: comp.num_output_neurons,
        training_options: comp.training_options
      }
      comp.neatapticService.parseAndTrain(input.files[0], config);
    };
  }

} 

