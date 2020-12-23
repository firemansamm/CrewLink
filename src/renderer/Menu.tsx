import React, { useCallback, useState } from 'react';
import { ipcRenderer } from 'electron';
import './css/menu.css';
import os from 'os';

export interface MenuProps {
	errored: boolean
}

const Menu: React.FC<MenuProps> = function () {
	const [gameCode, setGameCode] = useState('');
	const [gameRegion, setGameRegion] = useState('AS');
	const [boundIP, setBoundIP] = useState('0.0.0.0');
	const textChangeCallback = useCallback((e) => {
		setGameCode(e.target.value);
	}, [gameCode]);
	const regionChangeCallback = useCallback((e) => {
		setGameRegion(e.target.value);
	}, [gameRegion]);
	const boundIPChangeCallback = useCallback((e) => {
		setBoundIP(e.target.value);
	}, [boundIP]);
	const ipList = Object.values(os.networkInterfaces()).map(x => x.map(y => y.address)).flat(2).filter(x => x.indexOf(':') === -1);
	return (
		<div className="root">
			<div className="menu">
				<span className="waiting">Enter Game Code</span>
				<input type='text' onChange={textChangeCallback} value={gameCode}></input>
				<select onChange={regionChangeCallback} value={gameRegion}>
					<option value='AS'>Asia</option>
					<option value='EU'>Europe</option>
					<option value='NA'>North America</option>
				</select>
				<button className="button" onClick={() => {
					ipcRenderer.send('enterCode', gameCode, gameRegion, boundIP);
				}}>Connect</button>
				<select onChange={boundIPChangeCallback} value={boundIP}>
					{ ipList.map((x, i) => <option value={x} key={i}>{x}</option>) }
				</select>
			</div>
		</div>
	);
};

export default Menu;