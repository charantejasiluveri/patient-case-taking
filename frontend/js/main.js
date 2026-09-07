document.addEventListener('DOMContentLoaded', () => {
    
    // -- Utility: Show Alert --
    function showAlert(elementId, message, type) {
        const alertEl = document.getElementById(elementId);
        if (!alertEl) return;
        
        alertEl.innerText = message;
        alertEl.className = `alert ${type}`;
        alertEl.style.display = 'block';
        
        setTimeout(() => {
            alertEl.style.display = 'none';
        }, 5000);
    }

    // -- Login Form Logic --
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const usernameInput = document.getElementById('username').value.trim();
            const passwordInput = document.getElementById('password').value.trim();

            if (!usernameInput || !passwordInput) {
                showAlert('login-alert', 'Please enter both username and password.', 'error');
                return;
            }

            const res = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username: usernameInput, password: passwordInput })
            });

            if (!res.ok) {
                showAlert('login-alert', res.error, 'error');
                return;
            }

            showAlert('login-alert', 'Login successful. Redirecting...', 'success');
            
            // Save auth
            setAuth({
                role: res.data.role,
                patient_id: res.data.patient_id,
                doctor_id: res.data.doctor_id
            });
            
            setTimeout(() => {
                if (res.data.role === 'patient') {
                    window.location.href = '/patient-dashboard.html';
                } else if (res.data.role === 'doctor') {
                    window.location.href = '/doctor-dashboard.html';
                }
            }, 1000);
        });
    }

    // -- Registration Form Logic --
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value;
            const dob = document.getElementById('dob').value;
            
            // Calculate age from dob
            const dobDate = new Date(dob);
            const diff_ms = Date.now() - dobDate.getTime();
            const age_dt = new Date(diff_ms); 
            const age = Math.abs(age_dt.getUTCFullYear() - 1970);

            const gender = document.getElementById('gender').value;
            const mobile = document.getElementById('mobile').value;
            const email = document.getElementById('email').value;
            const abha = document.getElementById('abha').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                showAlert('register-alert', 'Passwords do not match.', 'error');
                return;
            }
            
            if (password.length < 6) {
                showAlert('register-alert', 'Password must be at least 6 characters long.', 'error');
                return;
            }

            const res = await apiFetch('/api/auth/register/patient', {
                method: 'POST',
                body: JSON.stringify({
                    username: mobile, // Using mobile as default username for patients
                    password: password,
                    full_name: fullname,
                    dob: dob,
                    age: age,
                    gender: gender,
                    mobile: mobile,
                    email: email || null,
                    abha_id: abha || null
                })
            });

            if (!res.ok) {
                showAlert('register-alert', res.error, 'error');
                return;
            }

            showAlert('register-alert', `Registration Successful!\nWelcome, ${fullname}\nYour Patient ID: ${res.data.patient_id}\n\nKeep this ID safe for future visits. Redirecting to your dashboard...`, 'success');
            
            // Auto login after registration
            setAuth({
                role: res.data.role,
                patient_id: res.data.patient_id,
                doctor_id: null
            });
            
            setTimeout(() => {
                window.location.href = '/patient-dashboard.html';
            }, 4000);
        });
    }

    // -- Doctor Registration Form Logic --
    const registerDoctorForm = document.getElementById('register-doctor-form');
    if (registerDoctorForm) {
        registerDoctorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullname = document.getElementById('reg-fullname').value;
            const mobile = document.getElementById('reg-mobile').value;
            const email = document.getElementById('reg-email').value;
            const regno = document.getElementById('reg-regno').value;
            const spec = document.getElementById('reg-spec').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm').value;

            if (password !== confirmPassword) {
                showAlert('register-alert', 'Passwords do not match.', 'error');
                return;
            }
            
            if (password.length < 6) {
                showAlert('register-alert', 'Password must be at least 6 characters long.', 'error');
                return;
            }

            const res = await apiFetch('/api/auth/register/doctor', {
                method: 'POST',
                body: JSON.stringify({
                    doctor_name: fullname,
                    mobile: mobile,
                    email: email,
                    medical_registration_number: regno,
                    specialization: spec,
                    password: password
                })
            });

            if (!res.ok) {
                showAlert('register-alert', res.error, 'error');
                return;
            }

            showAlert('register-alert', `Registration Successful!\nWelcome, ${fullname}\nYour Doctor ID: ${res.data.doctor_id}\n\nRedirecting to your dashboard...`, 'success');
            
            // Auto login after registration
            setAuth({
                role: res.data.role,
                patient_id: null,
                doctor_id: res.data.doctor_id
            });
            
            setTimeout(() => {
                window.location.href = '/doctor-dashboard.html';
            }, 4000);
        });
    }
});
