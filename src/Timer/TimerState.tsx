import * as React from 'react';

import { observable, action, autorun, computed } from 'mobx';
import { observer } from 'mobx-react';

import * as _ from 'lodash';

import './Timer.scss';

//import { App } from '../App';

const RunState = {
     INIT: 'init',
     RUNNING: 'running',
     PAUSE: 'pause',
};

export class TimerState {
     @observable private m_runState = RunState.INIT;
	 @computed get runState() {
		 return this.m_runState;
	}
	 
	 public get isRunning() {return this.m_runState === RunState.RUNNING;}

	 @observable 
	 private m_max = 60; // 최대 시간(초)

	 @computed get 
	 max() {return this.m_max;}

	private m_playSound = true;
	get playSound() {return this.m_playSound;}
	public setPlaySound(v: boolean) {this.m_playSound = v;}

	constructor(max: number) {
		this.m_max = max;
	}

	public setMax(max: number) {
		this.m_max = max;
		// this.m_max = 13;
	}

     @action 
	 public start = () => {
         this.m_runState = RunState.RUNNING;
     }
     @action 
	 public reset = () => {

         this.m_runState = RunState.INIT;
     }
     @action 
	 public pause = () => {
         this.m_runState = RunState.PAUSE;
     }
}

export default TimerState;
