import { create } from 'twrnc';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tailwindConfig = require('../../tailwind.config.js');

const tw = create(tailwindConfig);

export default tw;
