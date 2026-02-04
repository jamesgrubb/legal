import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const apiKey = import.meta.env.RESEND_API_KEY;
	const fromEmail = import.meta.env.RESEND_FROM_EMAIL;
	const toEmail = import.meta.env.CONTACT_EMAIL;

	if (!apiKey || !fromEmail || !toEmail) {
		return new Response(JSON.stringify({ error: 'Server misconfigured.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const formData = await request.formData();
	const name = String(formData.get('name') || '').trim();
	const email = String(formData.get('email') || '').trim();
	const message = String(formData.get('message') || '').trim();

	if (!name || !email || !message) {
		return new Response(JSON.stringify({ error: 'All fields are required.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return new Response(JSON.stringify({ error: 'Invalid email address.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from: fromEmail,
			to: [toEmail],
			replyTo: email,
			subject: `Contact: ${name}`,
			text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
		}),
	});

	if (!res.ok) {
		return new Response(JSON.stringify({ error: 'Failed to send message.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
};
