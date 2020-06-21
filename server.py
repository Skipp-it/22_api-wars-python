from datetime import datetime
from flask import Flask, render_template, url_for, request, session, redirect, flash
import data_manager
from util import json_response


app = Flask('__name__')
# app.secret_key = data_manager.random_api_key()
app.secret_key = '123'


@app.route('/')
def index():
    return render_template('index.html')



@app.route("/register", methods=['GET', 'POST'])
def register():
    if 'user_id' in session:
        return redirect(url_for("index"))
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        submission_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        if data_manager.register_user(username, password, submission_time) is False:
            flash('Not registered')
        data_manager.register_user(username, password, submission_time)
        flash('Successful registration. Log in to continue.')
        return redirect(url_for("login"))
    return render_template("register.html")


@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for("index"))
    if request.method == 'POST':
        username, typed_password = request.form.get(
            'username'), request.form.get('password')
        user = data_manager.check_user(username)
        if user and data_manager.verify_password(typed_password, user['password']):
            session['user_id'] = user['id']
            session['username'] = username
            flash('User logged in!')
            return redirect('/')
        else:
            flash('User or Password do not match')
    return render_template('login.html')


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    if 'user_id' not in session:
        flash('You are not logged in!')
    else:
        session.pop('user_id', None)
        session.pop('username', None)
    return redirect(url_for('index'))


@app.route("/vote/<planetID>/<planetName>", methods=['GET', 'POST'])
@json_response
def vote(planetID, planetName):
    if request.method == 'POST':
        planet_id = planetID
        planet_name = planetName
        user_id = session['user_id']
        submission_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data_manager.vote_planet(planet_id, planet_name, user_id, submission_time)
        flash(f'Voted on planet {planetName} successfully')
        return render_template('index.html')
    user_id = session['user_id']
    date = data_manager.planets_votes(user_id)
    return date


def main():
    app.run(debug=True,
            port=8001)


if __name__ == '__main__':
    main()

