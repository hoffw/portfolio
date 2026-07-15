import type { APIRoute } from "astro";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

dotenv.config();

const smtpConfig: SMTPTransport.Options = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
};

const transporter = nodemailer.createTransport(smtpConfig);

const MAX_PER_WINDOW = 3;
const WINDOW_MS = 15 * 60 * 1000;

const rateMap = new Map<string, { count: number; resetAt: number }>();

function stripTags(str: string): string {
    return str.replace(/<[^>]*>/g, '');
}

function checkRate(ip: string): boolean {
    const now = Date.now();
    const entry = rateMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return true;
    }
    if (entry.count >= MAX_PER_WINDOW) {
        return false;
    }
    entry.count++;
    return true;
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const referer = request.headers.get('referer');
        const origin = request.headers.get('origin');
        const host = request.headers.get('host') || '';

        const allowed = referer?.includes(host) || origin?.includes(host);
        if (!allowed) {
            return new Response(
                JSON.stringify({ message: "Message sent successfully!" }),
                { status: 200 }
            );
        }

        const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
            || 'unknown';

        if (!checkRate(ip)) {
            return new Response(
                JSON.stringify({ message: "Too many requests. Please try again later." }),
                { status: 429 }
            );
        }

        const data = await request.formData();
        const name = data.get("name");
        const email = data.get("email");
        const message = data.get("message");

        if (!name || !email || !message) {
            return new Response(
                JSON.stringify({ message: "All form fields must be filled." }),
                { status: 400 }
            );
        }

        const nameStr = stripTags(String(name)).slice(0, 100);
        const emailStr = stripTags(String(email)).slice(0, 254);
        const messageStr = stripTags(String(message)).slice(0, 2000);

        if (!nameStr || !emailStr || !messageStr) {
            return new Response(
                JSON.stringify({ message: "All form fields must be filled." }),
                { status: 400 }
            );
        }

        const envelope = {
            from: "Portfolio <server@unlimited.beer>",
            to: "will.hoffman@pm.me",
            subject: `Message from ${nameStr}`,
            text: messageStr + "\n\n" + emailStr
        };

        await transporter.sendMail(envelope);

        return new Response(
            JSON.stringify({ message: "Message sent successfully!" }),
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ message: "Failed to send message. Please try again." }),
            { status: 500 }
        );
    }
};