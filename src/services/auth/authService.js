// Authentication & Role-Based Access Control (RBAC) Service

export const ROLES = {
  PATIENT_KIOSK: 'PATIENT_KIOSK',
  DOCTOR: 'DOCTOR',
  TRIAGE: 'TRIAGE',
  ADMIN: 'ADMIN'
};

export const MOCK_USERS = {
  doctor: {
    id: "DOC-101",
    name: "Dr. Ananya Sharma",
    role: ROLES.DOCTOR,
    department: "Internal Medicine & Cardiology",
    registrationNo: "MCI-2015-88412",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"
  },
  triage: {
    id: "STAFF-02",
    name: "Sister Priya Nair",
    role: ROLES.TRIAGE,
    department: "OPD Emergency Triage",
    avatar: "https://images.unsplash.com/photo-1594824813571-24a698277d33?auto=format&fit=crop&q=80&w=200"
  },
  admin: {
    id: "ADM-01",
    name: "Rajesh Varma (IT Admin)",
    role: ROLES.ADMIN,
    department: "Hospital Administration",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  }
};

export class AuthService {
  static loginAsRole(role) {
    if (role === ROLES.DOCTOR) return MOCK_USERS.doctor;
    if (role === ROLES.TRIAGE) return MOCK_USERS.triage;
    if (role === ROLES.ADMIN) return MOCK_USERS.admin;
    return { id: "KIOSK-01", name: "OPD Patient Kiosk", role: ROLES.PATIENT_KIOSK };
  }

  static verifyOtp(mobileNumber, otpCode) {
    // For demo purposes, accepts '123456' or any 6-digit code
    if (otpCode && otpCode.length === 6) {
      return { success: true, message: "Mobile number verified successfully." };
    }
    return { success: false, message: "Invalid OTP. Enter 123456 for demo." };
  }
}
