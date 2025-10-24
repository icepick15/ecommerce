import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the backend/.env file regardless of import order
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const PAYSTACK_SECRET_KEY =
	process.env.PAYSTACK_SECRET_KEY ||
	process.env.PAYSTACK_SECRET ||
	process.env.PAYSTACK_SECRET_TEST_KEY ||
	"";

if (!PAYSTACK_SECRET_KEY) {
	console.error(
		"[Paystack] Missing secret key. Add PAYSTACK_SECRET_KEY to backend/.env to enable checkout."
	);
}

export const paystack = {
	baseURL: "https://api.paystack.co",
	secretKey: PAYSTACK_SECRET_KEY,
	headers: {
		Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
		"Content-Type": "application/json",
	},
};
