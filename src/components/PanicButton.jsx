import { useState, useEffect } from "react";

export default function PanicButton() {
  const [countdown, setCountdown] = useState(null);
  const [password, setPassword] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedContacts = JSON.parse(localStorage.getItem("emergencyContacts") || "[]");
    setContacts(savedContacts);
  }, []);

  useEffect(() => {
    if (countdown === 0) sendAlerts();
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const saveToStorage = (updated) => {
    localStorage.setItem("emergencyContacts", JSON.stringify(updated));
    setContacts(updated);
  };

  const handleAddOrEditContact = (e) => {
    e.preventDefault();
    const trimmed = newContact.trim();
    if (!trimmed) return;

    if (editIndex !== null) {
      const updated = [...contacts];
      updated[editIndex] = trimmed;
      saveToStorage(updated);
      setEditIndex(null);
    } else if (!contacts.includes(trimmed)) {
      const updated = [...contacts, trimmed];
      saveToStorage(updated);
    }

    setNewContact("");
  };

  const handleEdit = (index) => {
    setNewContact(contacts[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = contacts.filter((_, i) => i !== index);
    saveToStorage(updated);
  };

  const handlePanic = () => {
    if (contacts.length === 0) {
      alert("Please add at least one emergency contact");
      return;
    }
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

  const isMobile = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const sendAlerts = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
      const message = `🚨 Emergency! I need help. Here's my location: ${locationLink}`;

      contacts.forEach((num, i) => {
        if (isMobile()) {
          // 📱 Mobile: send SMS first
          const smsURL = `sms:${num}?body=${encodeURIComponent(message)}`;
          setTimeout(() => {
            window.open(smsURL, "_blank");
          }, i * 2000);
        }

        // 📲 WhatsApp (works on both mobile & desktop)
        const waURL = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
        setTimeout(() => {
          window.open(waURL, "_blank");
        }, i * 2000 + 1000);
      });
    });
  };

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">
        Emergency Panic Button
      </h1>

      {/* Add/Edit Contact */}
      <form onSubmit={handleAddOrEditContact} className="w-full max-w-sm mb-4">
        <input
          type="text"
          placeholder="Enter phone number with country code"
          value={newContact}
          onChange={(e) => setNewContact(e.target.value)}
          className="w-full p-2 mb-2 border border-red-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800"
        >
          {editIndex !== null ? "Update Contact" : "Save Contact"}
        </button>
      </form>

      {/* Contact List */}
      <ul className="w-full max-w-sm text-sm mb-4">
        {contacts.map((num, i) => (
          <li
            key={i}
            className="bg-white p-2 border border-red-200 rounded mb-1 flex justify-between items-center"
          >
            <span>{num}</span>
            <div className="space-x-2">
              <button onClick={() => handleEdit(i)} className="text-blue-600 text-xs">
                Edit
              </button>
              <button onClick={() => handleDelete(i)} className="text-red-600 text-xs">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Panic Button */}
      <button
        onClick={handlePanic}
        className="bg-red-600 text-white px-10 py-5 text-xl rounded-full hover:bg-red-700 transition disabled:opacity-50"
        disabled={countdown !== null}
      >
        Panic
      </button>

      {countdown !== null && (
        <div className="text-lg mt-4 text-red-800">
          Sending alert in {countdown} sec...
        </div>
      )}

      {showCancel && (
        <form onSubmit={cancelAlert} className="mt-4 flex flex-col gap-2 w-full max-w-sm">
          <input
            type="password"
            placeholder="Enter password to cancel"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">
            Cancel Alert
          </button>
        </form>
      )}
    </div>
  );
}
