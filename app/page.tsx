cat > app/page.tsx << 'EOF'
import UploadCard from "@/components/UploadCard";

export default function HomePage() {
  return (
    <div>
      <section className="gradient-header text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            AI Vehicle Speed Detection &amp; Accident Probability Prediction
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Upload traffic footage and let our AI pipeline detect vehicles,
            estimate their speed, and predict accident risk using Machine
            Learning — all in real time.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            
              href="#upload-section"
              className="bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Get Started
            </a>
            
              href="/about"
              className="border border-white/60 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              About Project
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl mb-2">Camera</div>
          <h3 className="font-semibold mb-1">Vehicle Detection</h3>
          <p className="text-sm text-gray-500">
            Detects and tracks vehicles using OpenCV background subtraction
            and contour detection.
          </p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">Speed</div>
          <h3 className="font-semibold mb-1">Speed Estimation</h3>
          <p className="text-sm text-gray-500">
            Calculates approximate vehicle speed using virtual reference
            lines and distance-time logic.
          </p>
        </div>
        <div className="card text-center">
          <div className="text-3xl mb-2">Risk</div>
          <h3 className="font-semibold mb-1">Accident Risk Prediction</h3>
          <p className="text-sm text-gray-500">
            Uses a trained Random Forest model to predict accident risk from
            traffic conditions.
          </p>
        </div>
      </section>

      <section id="upload-section" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <UploadCard />
      </section>
    </div>
  );
}
EOF
