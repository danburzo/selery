import tape from 'tape';
import { doc } from './utils/doc.js';
import { querySelector } from '../src/index.js';

tape('Tree-positional pseudo-classes', t => {
	let d = doc`
		<dl>	
			<dt>1-term</dt>
			<dd>1-def</dd>
			<dt>2-term</dt>
			<dd>2-def</dd>
			<dt>3-term</dt>
			<dd>3-def</dd>
		</dl>
		<p>1st <em>para</em></p>
		<p>2nd para</p>
		<p class='not-empty'>	<strong></strong></p>
	`;

	t.equals(querySelector(d, 'dl :first-child').textContent, '1-term');
	t.equals(querySelector(d, 'dl :last-child').textContent, '3-def');
	t.equals(querySelector(d, 'dd:first-of-type').textContent, '1-def');
	t.equals(querySelector(d, 'dt:last-of-type').textContent, '3-term');
	t.equals(querySelector(d, 'body :only-of-type').localName, 'dl');
	t.equals(querySelector(d, 'body :only-child').textContent, 'para');

	t.equals(querySelector(d, ':root'), d.documentElement);
	t.equals(querySelector(d, 'body :empty').localName, 'strong');

	t.end();
});
