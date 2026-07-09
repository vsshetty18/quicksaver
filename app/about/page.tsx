// ------------------------------------------------------------
// About Page
// Displays project overview, objectives, modules, tech stack,
// future scope, and developer/guide/college placeholders.
// ------------------------------------------------------------

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 fade-in">
      <h1 className="text-3xl font-bold mb-8 text-center">
        About This Project
      </h1>

      {/* Project Overview */}
      <section className="card mb-6">
        <h2 className="text-xl font-semibold mb-3">Project Overview</h2>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          AI Vehicle Speed Detection &amp; Accident Probability Prediction is
          a BE AI &amp; ML major project that analyzes traffic video footage
          to detect vehicles, estimate their speed, and predict the
          probability of an accident using a Machine Learning model. The
          system combines Computer Vision (OpenCV) for vehicle detection and
          tracking with a Random Forest Classifier for accident risk
          prediction.
        </p>
      </section>

      {/* Objectives */}
      <section className="card mb-6">
        <h2 className="text-xl font-semibold mb-3">Objectives</h2>
        <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-2">
          <li>Detect and track vehicles in traffic video footage using OpenCV.</li>
          <li>Estimate approximate vehicle speed using distance-time calculation.</li>
          <li>Predict accident risk based on speed, vehicle density, and weather conditions.</li>
          <li>Present results through an intuitive, easy-to-understand dashboard.</li>
          <li>Build a lightweight, beginner-friendly system without deep learning overhead.</li>
        </ul>
      </section>

      {/* Modules */}
      <section className="card mb-6">
        <h2 className="text-xl font-semibold mb-3">Modules</h2>
        <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-2">
          <li>
            <strong>Video Upload Module</strong> — Accepts MP4, AVI, MOV video
            files from the user.
          </li>
          <li>
            <strong>Vehicle Detection Module</strong> — Uses background
            subtraction and contour detection to identify vehicles.
          </li>
          <li>
            <strong>Vehicle Tracking Module</strong> — Assigns unique IDs to
            vehicles using a centroid-based tracker.
          </li>
          <li>
            <strong>Speed Estimation Module</strong> — Calculates speed using
            two virtual reference lines and distance/time.
          </li>
          <li>
            <strong>Accident Prediction Module</strong> — Uses a trained
            Random Forest Classifier to predict Safe / Medium Risk / High
            Risk outcomes.
          </li>
          <li>
            <strong>Dashboard Module</strong> — Visualizes results through
            statistic cards and charts.
          </li>
        </ul>
      </section>

      {/* Technology Stack */}
      <section className="card mb-6">
        <h2 className="text-xl font-semibold mb-3">Technology Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-600">
          <div className="bg-brand-50 rounded-lg py-2 px-3 text-center">Next.js</div>
          <div className="bg-brand-50 rounded-lg py-2 px-3 text-center">React</div>
          <div className="bg-brand-50 rounded-lg py-2 px-3 text-center">TypeScript</div>
          <div className="bg-brand-50 rounded-lg py-2 px-3 text-center">Tailwind CSS</div>
          <div className="bg-brand-50 rounded-lg py-2 px-3 text-center">Flask</div>
          <div className="bg-brand-50 rounded-lg py-2 px-3 text-center">OpenCV</div>
          <div className="bg-brand-50 rounded-lg py-2 px-3 text-center">Scikit-learn</div>
          <div className="bg-brand-50 rounded-lg py-2 px-3 text-center">NumPy / Pandas</div>
          <div className="bg-brand-50 rounded-lg py-2 px-3 text-center">Chart.js</div>
        </div>
      </section>

      {/* Future Scope */}
      <section className="card mb-6">
        <h2 className="text-xl font-semibold mb-3">Future Scope</h2>
        <ul className="list-disc list-inside text-gray-600 text-sm sm:text-base space-y-2">
          <li>Integrate deep learning models (YOLO) for higher detection accuracy.</li>
          <li>Add real-time video stream support (live CCTV feeds).</li>
          <li>Include number plate recognition for traffic violation logging.</li>
          <li>Expand the ML dataset with real-world traffic data for better predictions.</li>
          <li>Add a database to store historical analysis reports.</li>
        </ul>
      </section>

      {/* Developer / Guide / College Info */}
      <section className="card">
        <h2 className="text-xl font-semibold mb-3">Project Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <p className="text-gray-400 mb-1">Developer Name</p>
            <p className="font-medium text-gray-800">[Your Name Here]</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Guide Name</p>
            <p className="font-medium text-gray-800">[Guide Name Here]</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">College</p>
            <p className="font-medium text-gray-800">[College Name Here]</p>
          </div>
        </div>
      </section>
    </div>
  );
}
