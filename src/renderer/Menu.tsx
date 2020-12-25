import React, { useCallback, useState } from 'react';
import { ipcRenderer } from 'electron';
import './css/menu.css';

export interface MenuProps {
	errored: boolean
}

const Menu: React.FC<MenuProps> = function () {
	const [gameCode, setGameCode] = useState('');
	const [gameRegion, setGameRegion] = useState('AS');
	const textChangeCallback = useCallback((e) => {
		setGameCode(e.target.value);
	}, [gameCode]);
	const regionChangeCallback = useCallback((e) => {
		setGameRegion(e.target.value);
	}, [gameRegion]);
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
					ipcRenderer.send('enterCode', gameCode, gameRegion);
				}}>Connect</button>
			</div>
		</div>
	);
};

export default Menu;