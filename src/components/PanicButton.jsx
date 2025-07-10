// src/components/PanicButton.jsx
import { useState, useEffect } from "react";

export default function PanicButton() {
  const [countdown, setCountdown] = useState(null);
  const [password, setPassword] = useState("");
  const [showCancel, setShowCancel] = useState(false);

  const emergencyNumber = "917387979150"; // your contact (include country code)

  useEffect(() => {
    if (countdown === 0) {
      getLocationAndSend();
    }
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePanic = () => {
    setCountdown(5);
    setShowCancel(true);
  };

  const cancelAlert = (e) => {
    e.preventDefault();
    if (password === "1234") {
      alert("Alert cancelled");
      setCountdown(null);
      setShowCancel(false);
      setPassword("");
    } else {
      alert("Wrong password!");
    }
  };

  const getLocationAndSend = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const locationText = `Help me! My location: https://maps.google.com/?q=${latitude},${longitude}`;
      const whatsappLink = `https://wa.me/${emergencyNumber}?text=${encodeURIComponent(locationText)}`;
      window.open(whatsappLink, "_blank");
    });
  };

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Emergency Panic Button</h1>
      <button
        onClick={handlePanic}
        className="bg-red-600 text-white px-10 py-5 text-xl rounded-full hover:bg-red-700 transition"
        disabled={countdown !== null}
      >
        Panic
      </button>

      {countdown !== null && (
        <div className="text-lg mt-4 text-red-800">Sending alert in {countdown} sec...</div>
      )}

      {showCancel && (
        <form onSubmit={cancelAlert} className="mt-4 flex gap-2">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
