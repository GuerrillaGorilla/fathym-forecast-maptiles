import LCUStateDefaults from './lcuState.json';

const lcuState = window.LCU?.State || {};

const LCUState = { ...LCUStateDefaults, ...(lcuState || {}) };

export default LCUState;