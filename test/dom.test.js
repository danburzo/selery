import tape from 'tape';
import { doc } from './utils/doc.js';
import { querySelector, querySelectorAll } from '../src/index.js';

tape('Combinators', t => {
	let d = doc`
	<article>
		<div>
			<h1>Heading</h1>
			<p>1st para</p>
			<p>2nd para</p>
		</div>
	</article>`;
	t.equals(querySelector(d, 'article h1 + p').textContent, '1st para');
	t.equals(querySelectorAll(d, 'article h1 ~ p').length, 2);
	t.equals(querySelector(d, 'div > p').textContent, '1st para');
	t.equals(querySelector(d, 'article > p'), null);
	t.end();
});

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
