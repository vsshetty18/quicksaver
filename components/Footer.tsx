// ------------------------------------------------------------
// Footer Component
// Simple footer shown on every page.
// ------------------------------------------------------------

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} SpeedGuard AI — BE AI & ML Major
          Project
        </p>
        <p className="text-gray-400">
          Vehicle Speed Detection & Accident Probability Prediction
        </p>
      </div>
    </footer>
  );
}
