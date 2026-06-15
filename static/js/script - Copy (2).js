document.addEventListener("DOMContentLoaded", () => {
    // Form toggling between login and signup
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const showSignup = document.getElementById("show-signup");
    const showLogin = document.getElementById("show-login");

    // Show the signup form and hide the login form
    if (showSignup) {
        showSignup.addEventListener("click", (e) => {
            e.preventDefault();
            loginForm.classList.add("hidden");
            signupForm.classList.remove("hidden");
        });
    }

    // Show the login form and hide the signup form
    if (showLogin) {
        showLogin.addEventListener("click", (e) => {
            e.preventDefault();
            signupForm.classList.add("hidden");
            loginForm.classList.remove("hidden");
        });
    }

    // Handle signup submission
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;

            // Save user credentials to localStorage
            let users = JSON.parse(localStorage.getItem("users")) || [];
            users.push({ email, password });
            localStorage.setItem("users", JSON.stringify(users));

            alert("Signup successful! You can now log in.");
            signupForm.reset();

            // Switch to login form after signup
            signupForm.classList.add("hidden");
            loginForm.classList.remove("hidden");
        });
    }

    // Handle login submission
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            // Check user credentials
            let users = JSON.parse(localStorage.getItem("users")) || [];
            const userExists = users.some(
                (user) => user.email === email && user.password === password
            );

            if (userExists) {
                alert("Login successful!");
                window.location.href = "/mood"; // Redirect to mood page
            } else {
                alert("Invalid email or password. Please try again.");
            }
        });
    }

    // Handle mood selection (in mood.html)
    const moodForm = document.getElementById("mood-form");
    if (moodForm) {
        moodForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const mood = document.getElementById("mood").value;
            storeMood(mood);
            window.location.href = `/self_care?mood=${mood}`; // Redirect with mood as a query parameter
        });
    }

    // Store mood in localStorage (Mood History)
    function storeMood(mood) {
        let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
        moodHistory.push({ mood: mood, date: new Date() });
        localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
    }

    // Display self-care tips based on mood and history (on self_care.html)
    function displayPersonalizedTips(mood) {
        const tips = {
            happy: ["Celebrate small wins", "Express gratitude", "Stay connected with loved ones"],
            sad: ["Allow yourself to grieve", "Seek support", "Practice mindfulness"],
            anxious: ["Practice deep breathing", "Try grounding exercises", "Listen to calming music"],
            neutral: ["Engage in a hobby", "Get active", "Try something new to break the routine"],
        };

        const personalizedTips = tips[mood] || []; // Handle unexpected moods
        const tipsList = document.getElementById("tips-list");

        if (tipsList) {
            tipsList.innerHTML = ""; // Clear previous tips
            personalizedTips.forEach((tip) => {
                const listItem = document.createElement("li");
                listItem.textContent = tip;
                tipsList.appendChild(listItem);
            });
        }
    }

    // ** Progress Page Functions **
    function renderProgressChart() {
        const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
        const moodCounts = {
            happy: 0,
            sad: 0,
            anxious: 0,
            neutral: 0,
        };

        // Count mood occurrences
        moodHistory.forEach((item) => {
            moodCounts[item.mood]++;
        });

        const ctx = document.getElementById("progress-chart");
        if (ctx) {
            new Chart(ctx.getContext("2d"), {
                type: "bar",
                data: {
                    labels: ["Happy", "Sad", "Anxious", "Neutral"],
                    datasets: [
                        {
                            label: "Mood Count",
                            data: [moodCounts.happy, moodCounts.sad, moodCounts.anxious, moodCounts.neutral],
                            backgroundColor: ["#FFEB3B", "#80C3D5", "#B19CD9", "#F5F5DC"],
                            borderColor: ["#FFEB3B", "#80C3D5", "#B19CD9", "#F5F5DC"],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    }

    // Display mood summary
    function displayMoodSummary() {
        const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
        const moodCounts = {
            happy: 0,
            sad: 0,
            anxious: 0,
            neutral: 0,
        };

        // Count mood occurrences
        moodHistory.forEach((item) => {
            moodCounts[item.mood]++;
        });

        const moodSummary = document.getElementById("mood-summary");
        if (moodSummary) {
            moodSummary.innerHTML = ` 
                <li>You have felt <strong>Happy</strong> ${moodCounts.happy} times.</li>
                <li>You have felt <strong>Sad</strong> ${moodCounts.sad} times.</li>
                <li>You have felt <strong>Anxious</strong> ${moodCounts.anxious} times.</li>
                <li>You have felt <strong>Neutral</strong> ${moodCounts.neutral} times.</li>
            `;
        }
    }

    // ** Notifications **
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    function sendReminder() {
        if (Notification.permission === "granted") {
            new Notification("Time to log your mood!", {
                body: "Don't forget to track your mood today.",
                icon: "/static/images/reminder-icon.png",
            });
        }
    }

    setInterval(sendReminder, 24 * 60 * 60 * 1000); // Reminder every 24 hours

    // Call functions to render chart and display summary
    renderProgressChart();
    displayMoodSummary();

    // ** Self-Care Page **
    const urlParams = new URLSearchParams(window.location.search);
    const mood = urlParams.get("mood");
    if (mood) {
        displayPersonalizedTips(mood);  // Display tips based on mood
        document.body.className = mood; // Apply mood-specific theme
    }

    // ** Booking Success Functionality **
    const sessionForm = document.getElementById("session-form");
    const bookingSuccess = document.getElementById("booking-success");

    if (sessionForm) {
        sessionForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Prevent page reload

            // Get selected counselor and date
            const counselor = document.getElementById("counselor-name").value;
            const sessionDate = document.getElementById("session-date").value;

            // Check if both fields are filled
            if (!counselor || !sessionDate) {
                alert("Please select a counselor and choose a valid date.");
                return;
            }

            // Display success message
            bookingSuccess.textContent = `Session with ${counselor} on ${sessionDate} booked successfully!`;
            bookingSuccess.classList.remove("hidden");

            // Auto-hide message after 3 seconds
            setTimeout(() => {
                bookingSuccess.classList.add("hidden");
            }, 3000);

            // Reset the form
            sessionForm.reset();
        });
    }
});
