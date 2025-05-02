import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(opts: {
    to: string;
    subject: string;
    html: string;
}) {
    const {data, error} = await resend.emails.send({
        from: "NextEpisode <no-reply@nextepisode.top>",
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
    });

    if (error) throw error;
    return data;
}