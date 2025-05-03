import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in .env');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(opts: { to: string; subject: string; html: string }) {
  const { data, error: sendError } = await resend.emails.send({
    from: 'NextEpisode <no-reply@nextepisode.top>',
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });

  if (sendError) {
    const message =
      sendError instanceof Error
        ? sendError.message
        : typeof sendError === 'string'
          ? sendError
          : JSON.stringify(sendError);
    throw new Error(message);
  }

  return data;
}
