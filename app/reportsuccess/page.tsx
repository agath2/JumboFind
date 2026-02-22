import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-light-beige flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-10 rounded-xl shadow-md max-w-lg w-full">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-heading font-bold text-dark-navy mb-4">
          Congratulations!
        </h1>
        <p className="text-gray-700 mb-8">
          Thank you for your report of the lost item. Your help makes our community better!
        </p>
        
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-dark-navy text-white font-medium rounded-lg hover:opacity-90 transition"
        >
          Return to Main Page
        </Link>
      </div>
    </div>
  );
}