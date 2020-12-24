import React from 'react';
const {useState, useCallback } = React;
import { ipcRenderer } from 'electron';
import './css/menu.css';
import makeStyles from '@material-ui/core/styles/makeStyles';
import os from 'os';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100vw',
		height: '100vh',
		paddingTop: theme.spacing(3),
	},
	error: {
		paddingTop: theme.spacing(4),
	},
}));

export interface MenuProps {
	error: string;
}

const Menu: React.FC<MenuProps> = function () {
	const classes = useStyles();
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
		<div className={classes.root}>
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
