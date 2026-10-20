import { useState } from "react";

type IconName =
  | "home"
  | "ticket"
  | "calendar"
  | "doctors"
  | "bell"
  | "user"
  | "clock"
  | "chevron"
  | "plus"
  | "edit"
  | "check"
  | "close";

const paths: Record<IconName, React.ReactNode> = {
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
  ticket: <><path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4Z" /><path d="M13 9v6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  doctors: <><circle cx="9" cy="8" r="4" /><path d="M2.5 21a6.5 6.5 0 0 1 13 0M17 11v6M14 14h6" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const doctors = [
  { initials: "AK", name: "Dr. Ananya Kapoor", specialty: "General Medicine", room: "Room 204", status: "Available", color: "violet" },
  { initials: "RM", name: "Dr. Rohan Mehta", specialty: "Cardiology", room: "Room 307", status: "In consultation", color: "blue" },
  { initials: "SP", name: "Dr. Sana Patel", specialty: "Orthopedics", room: "Room 112", status: "Available", color: "coral" },
];

const navItems: { label: string; icon: IconName }[] = [
  { label: "Overview", icon: "home" },
  { label: "My queue", icon: "ticket" },
  { label: "Appointments", icon: "calendar" },
  { label: "Doctors", icon: "doctors" },
];

export default function App() {
  const [active, setActive] = useState("Overview");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [toast, setToast] = useState("");
  const [details, setDetails] = useState({
    patientName: "Aarav Sharma",
    patientId: "CF-28419",
    token: "A-27",
    nowServing: "A-24",
    patientsAhead: "3",
    waitTime: "18",
    department: "General Medicine",
    doctorName: "Dr. Ananya Kapoor",
    doctorInitials: "AK",
    specialty: "General Medicine",
    room: "204",
    appointmentTime: "10:30 AM",
    location: "West Wing, Floor 2",
    appointmentId: "#AP-1072",
  });

  function updateDetail(key: keyof typeof details, value: string) {
    setDetails((current) => ({ ...current, [key]: value }));
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><span>+</span></div>
          <span>CareFlow</span>
        </div>
        <nav>
          <p className="nav-label">PATIENT PORTAL</p>
          {navItems.map((item) => (
            <button className={`nav-item ${active === item.label ? "active" : ""}`} onClick={() => setActive(item.label)} key={item.label}>
              <Icon name={item.icon} /><span>{item.label}</span>
            </button>
          ))}
          <button className="nav-item edit-nav" onClick={() => setEditOpen(true)}>
            <Icon name="edit" /><span>Edit prototype</span>
          </button>
        </nav>
        <div className="help-card">
          <div className="help-icon">?</div>
          <strong>Need help?</strong>
          <p>Our patient support team is here for you.</p>
          <button onClick={() => showToast("Support will call you shortly")}>Contact support</button>
        </div>
        <div className="profile-mini">
          <div className="avatar">{details.patientName.split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase()}</div>
          <div><strong>{details.patientName}</strong><span>Patient ID: {details.patientId}</span></div>
          <Icon name="chevron" size={17} />
        </div>
      </aside>

      <main>
        <header>
          <div>
            <p className="eyebrow">MONDAY, 24 AUGUST</p>
            <h1>{active === "Overview" ? `Good morning, ${details.patientName.split(" ")[0] || "Patient"}` : active}</h1>
          </div>
          <div className="header-actions">
            <button className="icon-button edit-button" aria-label="Edit prototype details" onClick={() => setEditOpen(true)}>
              <Icon name="edit" />
            </button>
            <button className="icon-button" aria-label="Notifications" onClick={() => showToast("You have 2 new queue updates")}>
              <Icon name="bell" /><i />
            </button>
            <button className="book-button" onClick={() => setBookingOpen(true)}><Icon name="plus" size={18} /> Book appointment</button>
          </div>
        </header>

        <section className="hero-grid">
          <article className="queue-card">
            <div className="queue-head">
              <div><span className="live-dot" /> LIVE QUEUE</div>
              <span>{details.department}</span>
            </div>
            <div className="queue-body">
              <div className="token-block">
                <p>YOUR TOKEN</p>
                <strong>{details.token}</strong>
                <span>{details.patientsAhead} patients ahead</span>
              </div>
              <div className="progress-block">
                <div className="wait-row">
                  <div><Icon name="clock" /><span>Estimated wait</span></div>
                  <strong>~ {details.waitTime} min</strong>
                </div>
                <div className="progress-track"><span /></div>
                <div className="progress-labels"><span>Now serving <b>{details.nowServing}</b></span><span>Your turn <b>{details.token}</b></span></div>
                <div className="doctor-row">
                  <div className="doctor-avatar violet">{details.doctorInitials}</div>
                  <div><span>Consulting doctor</span><strong>{details.doctorName}</strong></div>
                  <div className="room"><span>Room</span><strong>{details.room}</strong></div>
                </div>
              </div>
            </div>
            <div className="queue-foot">
              <label className="notify-toggle">
                <button className={notifications ? "on" : ""} onClick={() => setNotifications(!notifications)} aria-label="Toggle queue alerts"><span /></button>
                <span><strong>Queue alerts are {notifications ? "on" : "off"}</strong><small>{notifications ? "We'll notify you when 1 patient is ahead" : "Turn on to receive live updates"}</small></span>
              </label>
              <button className="text-button" onClick={() => setActive("My queue")}>View queue details <Icon name="chevron" size={16} /></button>
            </div>
          </article>

          <article className="arrival-card">
            <span className="status-pill">{checkedIn ? "CHECKED IN" : "UPCOMING"}</span>
            <p className="card-label">TODAY'S APPOINTMENT</p>
            <h2>{details.appointmentTime}</h2>
            <div className="arrival-doctor">
              <div className="doctor-avatar violet">{details.doctorInitials}</div>
              <div><strong>{details.doctorName}</strong><span>{details.specialty}</span></div>
            </div>
            <div className="arrival-meta">
              <div><span>Location</span><strong>{details.location}</strong></div>
              <div><span>Appointment ID</span><strong>{details.appointmentId}</strong></div>
            </div>
            <button className={`checkin-button ${checkedIn ? "complete" : ""}`} onClick={() => { setCheckedIn(true); showToast(`You're checked in. Token ${details.token} is active.`); }}>
              <Icon name={checkedIn ? "check" : "ticket"} size={18} /> {checkedIn ? "Checked in" : "Check in now"}
            </button>
          </article>
        </section>

        <section className="content-grid">
          <div>
            <div className="section-title">
              <div><p>UP NEXT</p><h2>Your appointments</h2></div>
              <button onClick={() => setActive("Appointments")}>View all <Icon name="chevron" size={15} /></button>
            </div>
            <article className="appointment-card">
              <div className="date-tile"><strong>29</strong><span>AUG</span></div>
              <div className="appointment-info">
                <span>FRIDAY · 3:00 PM</span>
                <h3>Cardiology consultation</h3>
                <p>Dr. Rohan Mehta · Heart Care Centre</p>
              </div>
              <span className="confirmed"><Icon name="check" size={14} /> Confirmed</span>
              <button className="more-button" aria-label="Appointment options">•••</button>
            </article>
            <article className="appointment-card">
              <div className="date-tile pale"><strong>12</strong><span>SEP</span></div>
              <div className="appointment-info">
                <span>WEDNESDAY · 11:15 AM</span>
                <h3>Routine health check-up</h3>
                <p>Dr. Meera Joshi · Wellness Clinic</p>
              </div>
              <span className="confirmed"><Icon name="check" size={14} /> Confirmed</span>
              <button className="more-button" aria-label="Appointment options">•••</button>
            </article>
          </div>

          <div>
            <div className="section-title">
              <div><p>AVAILABLE NOW</p><h2>Doctors today</h2></div>
              <button onClick={() => setActive("Doctors")}>See directory <Icon name="chevron" size={15} /></button>
            </div>
            <article className="doctors-card">
              {doctors.map((doctor) => (
                <button className="doctor-list-row" key={doctor.name} onClick={() => { setBookingOpen(true); }}>
                  <div className={`doctor-avatar ${doctor.color}`}>{doctor.initials}</div>
                  <div className="doctor-copy"><strong>{doctor.name}</strong><span>{doctor.specialty} · {doctor.room}</span></div>
                  <span className={`availability ${doctor.status !== "Available" ? "busy" : ""}`}><i />{doctor.status}</span>
                  <Icon name="chevron" size={16} />
                </button>
              ))}
            </article>
          </div>
        </section>

        <nav className="mobile-nav">
          {navItems.map((item) => (
            <button className={active === item.label ? "active" : ""} onClick={() => setActive(item.label)} key={item.label}>
              <Icon name={item.icon} /><span>{item.label === "Appointments" ? "Visits" : item.label}</span>
            </button>
          ))}
        </nav>
      </main>

      {bookingOpen && (
        <div className="modal-backdrop" onMouseDown={() => setBookingOpen(false)}>
          <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setBookingOpen(false)} aria-label="Close"><Icon name="close" /></button>
            <p className="eyebrow">NEW APPOINTMENT</p>
            <h2>Book a consultation</h2>
            <p className="modal-intro">Choose a department and preferred time. We'll confirm the doctor instantly.</p>
            <label>Department<select defaultValue="General Medicine"><option>General Medicine</option><option>Cardiology</option><option>Orthopedics</option></select></label>
            <label>Preferred date<input type="date" defaultValue="2026-08-25" /></label>
            <label>Preferred time<select defaultValue="10:30 AM"><option>10:30 AM</option><option>12:00 PM</option><option>3:15 PM</option></select></label>
            <button className="modal-submit" onClick={() => { setBookingOpen(false); showToast("Appointment request confirmed"); }}>Confirm appointment</button>
          </div>
        </div>
      )}
      {editOpen && (
        <div className="modal-backdrop" onMouseDown={() => setEditOpen(false)}>
          <div className="modal edit-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditOpen(false)} aria-label="Close"><Icon name="close" /></button>
            <p className="eyebrow">PROTOTYPE SETTINGS</p>
            <h2>Edit dashboard details</h2>
            <p className="modal-intro">Changes appear throughout the prototype immediately.</p>
            <div className="edit-form">
              <h3>Patient</h3>
              <label>Patient name<input value={details.patientName} onChange={(event) => updateDetail("patientName", event.target.value)} /></label>
              <label>Patient ID<input value={details.patientId} onChange={(event) => updateDetail("patientId", event.target.value)} /></label>
              <h3>Live queue</h3>
              <label>Token number<input value={details.token} onChange={(event) => updateDetail("token", event.target.value)} /></label>
              <label>Now serving<input value={details.nowServing} onChange={(event) => updateDetail("nowServing", event.target.value)} /></label>
              <label>Patients ahead<input type="number" min="0" value={details.patientsAhead} onChange={(event) => updateDetail("patientsAhead", event.target.value)} /></label>
              <label>Wait time (minutes)<input type="number" min="0" value={details.waitTime} onChange={(event) => updateDetail("waitTime", event.target.value)} /></label>
              <h3>Doctor</h3>
              <label>Doctor name<input value={details.doctorName} onChange={(event) => updateDetail("doctorName", event.target.value)} /></label>
              <label>Initials<input maxLength={3} value={details.doctorInitials} onChange={(event) => updateDetail("doctorInitials", event.target.value.toUpperCase())} /></label>
              <label>Department<input value={details.department} onChange={(event) => updateDetail("department", event.target.value)} /></label>
              <label>Specialty<input value={details.specialty} onChange={(event) => updateDetail("specialty", event.target.value)} /></label>
              <label>Room<input value={details.room} onChange={(event) => updateDetail("room", event.target.value)} /></label>
              <h3>Appointment</h3>
              <label>Time<input value={details.appointmentTime} onChange={(event) => updateDetail("appointmentTime", event.target.value)} /></label>
              <label>Location<input value={details.location} onChange={(event) => updateDetail("location", event.target.value)} /></label>
              <label>Appointment ID<input value={details.appointmentId} onChange={(event) => updateDetail("appointmentId", event.target.value)} /></label>
            </div>
            <button className="modal-submit" onClick={() => { setEditOpen(false); showToast("Prototype details updated"); }}>Save changes</button>
          </div>
        </div>
      )}
      {toast && <div className="toast"><Icon name="check" size={18} />{toast}</div>}
    </div>
  );
}
