import os
import logging
from flask import Flask
from flask_mail import Mail

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Initialize Flask app
app = Flask(__name__)

# Load configuration
app.config.from_object('config.Config')

# Set secret key from environment variable
app.secret_key = os.environ.get("SESSION_SECRET", "default_secret_key_for_development")

# Initialize Flask-Mail
mail = Mail(app)

# Import routes to register them with the app
from routes import *

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
