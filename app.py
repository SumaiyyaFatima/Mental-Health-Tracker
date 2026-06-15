from flask import Flask, send_from_directory, request, render_template

app = Flask(__name__)

# Route to serve login/signup page
@app.route('/')
def login_page():
    return send_from_directory('templates', 'login.html')

# Route to serve mood selection page
@app.route('/mood')
def mood_page():
    return send_from_directory('templates', 'mood.html')

# Route to serve self-care tips page, with the mood passed as a query parameter
@app.route('/self_care')
def self_care_page():
    mood = request.args.get('mood', 'neutral')  # Get mood from query parameter, default to 'neutral'
    return send_from_directory('templates', 'self_care.html')

# Route to serve counselors page
@app.route('/counselors')
def counselors_page():
    return send_from_directory('templates', 'counselors.html')  # Ensure this HTML file exists in the templates folder

# Route to serve booking page
@app.route('/booking')
def booking_page():
    return send_from_directory('templates', 'booking.html')  # Ensure this HTML file exists in the templates folder

# Route to serve chat page
@app.route('/chat')
def chat_page():
    return send_from_directory('templates', 'chat.html')  # Ensure this HTML file exists in the templates folder

# Route to serve progress report page
@app.route('/progress')
def progress_page():
    return send_from_directory('templates', 'progress.html')  # Ensure this HTML file exists in the templates folder

if __name__ == '__main__':
    app.run(debug=True)


