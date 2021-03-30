import * as React from 'react';

import { observable, action, autorun, computed } from 'mobx';
import { observer } from 'mobx-react';

import * as _ from 'lodash';

import TimerState from './TimerState';
import './Timer.scss';

//import { App } from '../App';

const RunState = {
     INIT: 'init',
     RUNNING: 'running',
     PAUSE: 'pause',
};

function _pToC(cX: number, cY: number, r: number, deg: number) {
     let rad = (deg - 90) * Math.PI / 180.0;
     return {
         x: cX + (r * Math.cos(rad)),
         y: cY + (r * Math.sin(rad))
     };
}

function _dArc(cX: number, cY: number, r: number, sdeg: number, edeg: number) {

	let d;
	if(edeg - sdeg >= 360) {
		d = [
			'M', cX, cY,
			'm', -r, 0,
			'a', r, r, 0, '1', 0, r * 2, 0,
			'a', r, r, 0, '1', 0, -r * 2, 0
		].join(' ');
	} else {
		let largeFlag = edeg - sdeg <= 180 ? '0' : '1';
		let sPt = _pToC(cX, cY, r, edeg);
		let ePt = _pToC(cX, cY, r, sdeg);
		d = [
		'M', sPt.x, sPt.y,
		'A', r, r, 0, largeFlag, 0, ePt.x, ePt.y,
		'L', cX, cY,
		'L', sPt.x, sPt.y,
		].join(' ');
	}
	return d;
}

const _arcR = 32;
const _arcC = _arcR;
const _arcWH = 2 * _arcC;

interface ITimer {
	state: TimerState;
	view: boolean;
	onComplete: () => void;
	onStart?: () => void;
}

@observer
class Timer extends React.Component<ITimer> {
     private m_runState = RunState.INIT;
     private m_sec = 0;
	 private m_stime = 0;
	 
	 @observable 
	 private m_text = '';
	 @observable 
	 private m_d = '';

	 private _drawArc = _.throttle((time: number) => {
		if(!this.props || this.m_runState !== RunState.RUNNING) return;

		const max = this.props.state.max * 1000;
		let angle = 0;
		if( this.m_sec <= 5 ) {
			const d = time % 1000;
			if( time === 0 ) angle = 0;
			else if( d === 0) angle = 1;
			else angle = d / 1000;
		} else {
			angle = time / max;
		}
		angle = angle * 360;
		
		this.m_d = _dArc(_arcC, _arcC, _arcR, 0, angle);
	 }, 50, {trailing: true});

	 
     constructor(props: ITimer) {
         super(props);
         this.m_text = this._getTime(this.props.state.max);
         this.m_d = '';

         autorun(() => {
			if(!this.props) return;
			const {state} = this.props;
			const max = state.max;
			if(state.runState === RunState.RUNNING && this.m_runState !== RunState.RUNNING) {
				this.m_runState = RunState.RUNNING;
				this._start();
			} else if(state.runState === RunState.INIT) {
				this.m_text = this._getTime(max);
				this.m_d = '';
			}
			this.m_runState = state.runState;
         });
     }

     private _start = () => {
         // this.m_cnt = this.props.state.max;
         this.m_sec = this.props.state.max;
         this.m_text = this._getTime(this.m_sec);
         this.m_d = '';
         this.m_stime = Date.now();
         this._run(0);

         if(this.props.onStart) this.props.onStart();
     }

     private _run = (f: number) => {
         if(!this.props || this.m_runState !== RunState.RUNNING) return;

         const max = this.props.state.max;

         const time = Date.now() - this.m_stime;
         const sec = max - Math.floor(time / 1000);
         if(this.m_sec !== sec) {
             this.m_text = this._getTime(sec);
            //  if(sec === 0) {
            //      if(this.props.state.playSound) App.pub_playDingend();
            //  } else if( sec < 5 ) {
            //      if(this.props.state.playSound) App.pub_playDing();
            //  } else if( sec >= 5 &&  sec <= 10) {
            //      if(this.props.state.playSound) App.pub_playClock();
            //  }
         }
         this.m_sec = sec;

         if(sec > 0) {
             this._drawArc(time);
             window.requestAnimationFrame(this._run);
         } else {
			this._drawArc.cancel();
			this.m_d = _dArc(_arcC, _arcC, _arcR, 0, 360);
			this.props.onComplete();
         }
	 }
	 
     private _getTime(t: number) {
         const m = Math.floor(t / 60);
         const s = t % 60;

         let ret = '';
         if(m < 10) ret = '0' + m;
         else ret = '' + m;
         if(s < 10) ret = ret + ':0' + s;
         else ret = ret + ':' + s;
         return ret;
	 }
	 
     public render() {
		 let stroke = (this.m_sec <= 5) ? '#f00' : '#ff0';
		 console.log('render if timer',this.m_d);
		 console.log(this.m_d);

         return (
			 <>
			 <h1>Timer</h1>
             <div className="q_timer" hidden={!this.props.view}>
                 <svg width={_arcWH} height={_arcWH} viewBox={'0 0 ' + _arcWH + ' ' + _arcWH}>
                     <path fill={stroke} d={this.m_d}/>
                 </svg>
                 <div className="m_text">{this.m_text}</div>
             </div>
			 </>
         );
     }
}

export default Timer;
